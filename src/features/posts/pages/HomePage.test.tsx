import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";

const mockDispatch = vi.fn();
const mockUseSearchParams = vi.fn();
const mockUseAppSelector = vi.fn();
const mockAsyncLoadPosts = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => mockUseAppSelector(),
}));

vi.mock("../states/reducer", () => ({
  asyncLoadPosts: (...args: unknown[]) => mockAsyncLoadPosts(...args),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  formatDate: (date: string) => `FORMAT:${date}`,
}));

vi.mock("../modals/AddModal", () => ({
  default: ({
    onClose,
    onDone,
  }: {
    onClose: () => void;
    onDone: () => void;
  }) => (
    <div data-testid="add-modal">
      <p>Modal Tambah Postingan</p>

      <button type="button" onClick={onClose}>
        Tutup Modal
      </button>

      <button type="button" onClick={onDone}>
        Selesai Tambah
      </button>
    </div>
  ),
}));

describe("HomePage", () => {
  const posts = [
    {
      id: "post-1",
      description: "Belajar React dan Next.js",
      cover: "https://example.com/react.jpg",
      created_at: "2026-01-10T10:00:00Z",
      author: {
        name: "Karina",
      },
      likes: [{ id: "like-1" }, { id: "like-2" }],
      comments: [{ id: "comment-1" }],
    },
    {
      id: "post-2",
      description: "Belajar TypeScript",
      cover: "",
      created_at: "2026-01-11T10:00:00Z",
      author: {
        name: "Niken",
      },
      total_likes: 5,
      total_comments: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "me" ? null : null),
    });

    mockUseAppSelector.mockReturnValue({
      posts: [],
      isPost: false,
    });

    mockAsyncLoadPosts.mockImplementation(
      (isMe: boolean) => ({
        type: "posts/load",
        payload: isMe,
      })
    );

    mockDispatch.mockImplementation((action: unknown) => action);
  });

  it("menampilkan judul Linimasa", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "Linimasa",
      })
    ).toBeInTheDocument();
  });

  it("menampilkan judul Postingan Saya ketika parameter me=1", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "me" ? "1" : null),
    });

    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "Postingan Saya",
      })
    ).toBeInTheDocument();
  });

  it("memanggil asyncLoadPosts saat halaman pertama kali dibuka", () => {
    render(<HomePage />);

    expect(mockAsyncLoadPosts).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("memanggil asyncLoadPosts dengan true untuk Postingan Saya", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "me" ? "1" : null),
    });

    render(<HomePage />);

    expect(mockAsyncLoadPosts).toHaveBeenCalledWith(true);
  });

  it("menampilkan teks Memuat ketika posts sedang dimuat", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [],
      isPost: true,
    });

    render(<HomePage />);

    expect(
      screen.getByText("Memuat...")
    ).toBeInTheDocument();
  });

  it("menampilkan pesan ketika belum ada postingan", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText("Belum ada postingan.")
    ).toBeInTheDocument();
  });

  it("menampilkan daftar postingan", () => {
    mockUseAppSelector.mockReturnValue({
      posts,
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText("Belajar React dan Next.js")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Belajar TypeScript")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Karina")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Niken")
    ).toBeInTheDocument();
  });

  it("menampilkan cover jika postingan memiliki cover", () => {
    mockUseAppSelector.mockReturnValue({
      posts,
      isPost: false,
    });

    render(<HomePage />);

    const image = document.querySelector(
      'img[src="https://example.com/react.jpg"]'
    );

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://example.com/react.jpg"
    );
  });

  it("menampilkan placeholder jika postingan tidak memiliki cover", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [
        {
          ...posts[1],
          cover: "",
        },
      ],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.queryByRole("img")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Belajar TypeScript")
    ).toBeInTheDocument();
  });

  it("menampilkan jumlah likes dan comments dari array", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [posts[0]],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText("2")
    ).toBeInTheDocument();

    expect(
      screen.getByText("1")
    ).toBeInTheDocument();
  });

  it("menggunakan total_likes dan total_comments jika array tidak tersedia", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [posts[1]],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText("5")
    ).toBeInTheDocument();

    expect(
      screen.getByText("3")
    ).toBeInTheDocument();
  });

  it("menggunakan 0 jika likes dan comments tidak tersedia", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [
        {
          id: "post-3",
          description: "Postingan tanpa interaksi",
          cover: "",
          created_at: "2026-01-12T10:00:00Z",
          author: {
            name: "Discha",
          },
        },
      ],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText("Postingan tanpa interaksi")
    ).toBeInTheDocument();

    const zeroes = screen.getAllByText("0");

    expect(zeroes).toHaveLength(2);
  });

  it("menampilkan tanggal yang sudah diformat", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [posts[0]],
      isPost: false,
    });

    render(<HomePage />);

    expect(
      screen.getByText(
        "FORMAT:2026-01-10T10:00:00Z"
      )
    ).toBeInTheDocument();
  });

  it("mencari postingan berdasarkan deskripsi", () => {
    mockUseAppSelector.mockReturnValue({
      posts,
      isPost: false,
    });

    render(<HomePage />);

    const input = screen.getByRole("textbox", {
      name: "Cari postingan",
    });

    fireEvent.change(input, {
      target: {
        value: "typescript",
      },
    });

    expect(
      screen.getByText("Belajar TypeScript")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "Belajar React dan Next.js"
      )
    ).not.toBeInTheDocument();
  });

  it("pencarian tidak membedakan huruf besar dan kecil", () => {
    mockUseAppSelector.mockReturnValue({
      posts,
      isPost: false,
    });

    render(<HomePage />);

    const input = screen.getByRole("textbox", {
      name: "Cari postingan",
    });

    fireEvent.change(input, {
      target: {
        value: "REACT",
      },
    });

    expect(
      screen.getByText(
        "Belajar React dan Next.js"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Belajar TypeScript")
    ).not.toBeInTheDocument();
  });

  it("menampilkan kembali semua postingan ketika pencarian dikosongkan", () => {
    mockUseAppSelector.mockReturnValue({
      posts,
      isPost: false,
    });

    render(<HomePage />);

    const input = screen.getByRole("textbox", {
      name: "Cari postingan",
    });

    fireEvent.change(input, {
      target: {
        value: "typescript",
      },
    });

    expect(
      screen.queryByText(
        "Belajar React dan Next.js"
      )
    ).not.toBeInTheDocument();

    fireEvent.change(input, {
      target: {
        value: "",
      },
    });

    expect(
      screen.getByText(
        "Belajar React dan Next.js"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Belajar TypeScript"
      )
    ).toBeInTheDocument();
  });

  it("menampilkan modal ketika tombol Tambah diklik", async () => {
    render(<HomePage />);

    expect(
      screen.queryByTestId("add-modal")
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Tambah/,
      })
    );

    expect(
      await screen.findByTestId("add-modal")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Modal Tambah Postingan"
      )
    ).toBeInTheDocument();
  });

  it("menutup modal ketika tombol Tutup Modal diklik", async () => {
    render(<HomePage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Tambah/,
      })
    );

    expect(
      await screen.findByTestId("add-modal")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Tutup Modal",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("add-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("memanggil reload ketika proses tambah postingan selesai", async () => {
    render(<HomePage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Tambah/,
      })
    );

    expect(
      await screen.findByTestId("add-modal")
    ).toBeInTheDocument();

    const dispatchCallsBefore =
      mockAsyncLoadPosts.mock.calls.length;

    fireEvent.click(
      screen.getByRole("button", {
        name: "Selesai Tambah",
      })
    );

    await waitFor(() => {
      expect(
        mockAsyncLoadPosts.mock.calls.length
      ).toBeGreaterThan(dispatchCallsBefore);
    });

    expect(
      mockAsyncLoadPosts
    ).toHaveBeenLastCalledWith(false);
  });

  it("menggunakan link detail berdasarkan id postingan", () => {
    mockUseAppSelector.mockReturnValue({
      posts: [posts[0]],
      isPost: false,
    });

    render(<HomePage />);

    const postLink = screen.getByRole("link", {
      name: /Belajar React dan Next\.js/,
    });

    expect(postLink).toHaveAttribute(
      "href",
      "/posts/post-1"
    );
  });
});