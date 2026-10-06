import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DetailPage from "./DetailPage";
import type { Post } from "@/types";

const mockDispatch = vi.fn();
const mockRouterReplace = vi.fn();
const mockUseAppSelector = vi.fn();

const mockAsyncLoadPost = vi.fn();
const mockAddComment = vi.fn();
const mockChangeCover = vi.fn();
const mockDeleteComment = vi.fn();
const mockDeletePost = vi.fn();
const mockToggleLike = vi.fn();

const mockFormatDate = vi.fn();
const mockShowConfirmDialog = vi.fn();
const mockShowErrorDialog = vi.fn();

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    mockUseAppSelector(selector),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({
    postId: "post-1",
  }),
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock("../states/reducer", () => ({
  asyncLoadPost: Object.assign(
    vi.fn((id: string) => {
      mockAsyncLoadPost(id);

      return {
        type: "posts/asyncLoadPost/pending",
        payload: id,
      };
    }),
    {
      rejected: {
        match: (result: unknown) =>
          Boolean(
            result &&
              typeof result === "object" &&
              "type" in result &&
              String((result as { type: string }).type).includes(
                "/rejected",
              ),
          ),
      },
    },
  ),
}));

vi.mock("../api/postApi", () => ({
  addComment: (...args: unknown[]) => mockAddComment(...args),
  changeCover: (...args: unknown[]) => mockChangeCover(...args),
  deleteComment: (...args: unknown[]) => mockDeleteComment(...args),
  deletePost: (...args: unknown[]) => mockDeletePost(...args),
  toggleLike: (...args: unknown[]) => mockToggleLike(...args),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  formatDate: (...args: unknown[]) => mockFormatDate(...args),
  showConfirmDialog: (...args: unknown[]) =>
    mockShowConfirmDialog(...args),
  showErrorDialog: (...args: unknown[]) =>
    mockShowErrorDialog(...args),
}));

vi.mock("../modals/ChangeModal", () => ({
  default: ({
    id,
    initial,
    onClose,
    onDone,
  }: {
    id: string;
    initial: string;
    onClose: () => void;
    onDone: () => void;
  }) => (
    <div data-testid="change-modal">
      <p>Change Modal</p>
      <p>{id}</p>
      <p data-testid="change-modal-initial">{initial}</p>

      <button onClick={onClose}>Tutup Modal</button>

      <button onClick={onDone}>Selesai Ubah</button>
    </div>
  ),
}));

const basePost = {
  id: "post-1",
  user_id: "user-1",
  description: "Ini adalah isi postingan.",
  cover: "https://example.com/cover.jpg",
  created_at: "2026-01-10T10:00:00Z",

  author: {
    id: "user-1",
    name: "Karina",
    photo: "https://example.com/avatar.jpg",
  },

  likes: [
    {
      user_id: "user-1",
    },
    {
      user_id: "user-2",
    },
  ],

  comments: [
    {
      id: "comment-1",
      user_id: "user-2",
      comment: "Komentar pertama",
      author: {
        id: "user-2",
        name: "Niken",
      },
    },
    {
      id: "comment-2",
      user_id: "user-1",
      comment: "Komentar saya",
      author: {
        id: "user-1",
        name: "Karina",
      },
    },
  ],
} as Post;

const setState = (
  post: Post | null,
  profile: { id: string; name?: string } | null,
) => {
  const state = {
    posts: {
      post,
    },

    auth: {
      profile,
    },
  };

  mockUseAppSelector.mockImplementation(
    (selector: (state: typeof state) => unknown) => selector(state),
  );
};

const renderPage = (
  post: Post | null = basePost,
  profile: { id: string; name?: string } | null = {
    id: "user-1",
    name: "Karina",
  },
) => {
  setState(post, profile);

  return render(<DetailPage />);
};

beforeEach(() => {
  vi.clearAllMocks();

  mockFormatDate.mockImplementation(
    (value: string) => `FORMAT:${value}`,
  );

  mockShowConfirmDialog.mockResolvedValue(true);

  mockAsyncLoadPost.mockReturnValue(undefined);

  mockDispatch.mockImplementation((action) => {
    if (typeof action === "function") {
      return action(mockDispatch);
    }

    return Promise.resolve({
      type: "posts/asyncLoadPost/fulfilled",
      payload: basePost,
    });
  });

  mockAddComment.mockResolvedValue({});
  mockChangeCover.mockResolvedValue({});
  mockDeleteComment.mockResolvedValue({});
  mockDeletePost.mockResolvedValue({});
  mockToggleLike.mockResolvedValue({});
});

describe("DetailPage", () => {
  it("menampilkan loading ketika post belum tersedia", () => {
    renderPage(null);

    expect(screen.getByText("Memuat...")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Detail postingan",
      }),
    ).toBeInTheDocument();
  });

  it("memanggil asyncLoadPost ketika halaman dibuka", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockAsyncLoadPost).toHaveBeenCalledWith("post-1");
    });
  });

  it("menampilkan halaman tidak ditemukan ketika load gagal", async () => {
    mockDispatch.mockImplementation(() =>
      Promise.resolve({
        type: "posts/asyncLoadPost/rejected",
      }),
    );

    renderPage(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Postingan tidak ditemukan",
        }),
      ).toBeInTheDocument();
    });
  });

  it("menampilkan halaman tidak ditemukan ketika post yang dimuat memiliki ID berbeda", async () => {
    mockDispatch.mockImplementation(() =>
      Promise.resolve({
        type: "posts/asyncLoadPost/rejected",
      }),
    );

    const differentPost = {
      ...basePost,
      id: "post-999",
    } as Post;

    renderPage(differentPost);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Postingan tidak ditemukan",
        }),
      ).toBeInTheDocument();
    });
  });

  it("kembali ke linimasa ketika tombol kembali diklik", async () => {
    mockDispatch.mockImplementation(() =>
      Promise.resolve({
        type: "posts/asyncLoadPost/rejected",
      }),
    );

    renderPage(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Postingan tidak ditemukan",
        }),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Kembali ke linimasa",
      }),
    );

    expect(mockRouterReplace).toHaveBeenCalledWith("/");
  });

  it("menampilkan detail postingan lengkap", () => {
    renderPage();

    expect(
      screen.getByText("Ini adalah isi postingan."),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Karina")[0],
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar pertama"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar saya"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar (2)"),
    ).toBeInTheDocument();
  });

  it("menampilkan cover postingan", () => {
    renderPage();

    const cover = document.querySelector(
      'img[src="https://example.com/cover.jpg"]',
    );

    expect(cover).toBeInTheDocument();
  });

  it("menampilkan placeholder ketika postingan tidak memiliki cover", () => {
    const post = {
      ...basePost,
      cover: "",
    } as Post;

    renderPage(post);

    expect(
      document.querySelector(
        'img[src="https://example.com/cover.jpg"]',
      ),
    ).not.toBeInTheDocument();

    expect(
      document.querySelector(".bg-gradient-to-br"),
    ).toBeInTheDocument();
  });

  it("menampilkan avatar author", () => {
    renderPage();

    const avatar = document.querySelector(
      'img[src="https://example.com/avatar.jpg"]',
    );

    expect(avatar).toBeInTheDocument();
  });

  it("menampilkan tanggal menggunakan formatDate", () => {
    renderPage();

    expect(mockFormatDate).toHaveBeenCalledWith(
      "2026-01-10T10:00:00Z",
    );

    expect(
      screen.getByText(
        "FORMAT:2026-01-10T10:00:00Z",
      ),
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Batal suka jika user sudah menyukai", () => {
    renderPage();

    expect(
      screen.getByRole("button", {
        name: "Batal suka",
      }),
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Suka jika user belum menyukai", () => {
    const post = {
      ...basePost,
      likes: [
        {
          user_id: "user-2",
        },
      ],
    } as Post;

    renderPage(post);

    expect(
      screen.getByRole("button", {
        name: "Suka",
      }),
    ).toBeInTheDocument();
  });

  it("memanggil toggleLike ketika tombol suka diklik", async () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Batal suka",
      }),
    );

    await waitFor(() => {
      expect(mockToggleLike).toHaveBeenCalledWith("post-1");
    });
  });

  it("menampilkan tombol Cover untuk pemilik postingan", () => {
    renderPage();

    expect(
      screen.getByText("Cover"),
    ).toBeInTheDocument();

    expect(
      document.querySelector("#post-cover-input"),
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Ubah untuk pemilik postingan", () => {
    renderPage();

    expect(
      screen.getByRole("button", {
        name: "Ubah",
      }),
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Hapus untuk pemilik postingan", () => {
    renderPage();

    expect(
      screen.getByRole("button", {
        name: /^Hapus$/,
      }),
    ).toBeInTheDocument();
  });

  it("tidak menampilkan tombol pengelolaan postingan jika bukan pemilik", () => {
    renderPage(basePost, {
      id: "user-2",
      name: "Niken",
    });

    expect(
      screen.queryByRole("button", {
        name: "Ubah",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /^Hapus$/,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Cover"),
    ).not.toBeInTheDocument();
  });

  it("menampilkan fallback avatar ketika author tidak memiliki foto", () => {
    const post = {
      ...basePost,

      author: {
        id: "user-1",
        name: "Karina",
        photo: "",
      },
    } as Post;

    renderPage(post);

    const images = document.querySelectorAll("img");

    const fallbackAvatar = Array.from(images).find(
      (img) =>
        img.src.includes("ui-avatars.com") &&
        img.src.includes("Karina"),
    );

    expect(fallbackAvatar).toBeDefined();
  });

  it("menampilkan fallback avatar ketika author tidak tersedia", () => {
    const post = {
      ...basePost,
      author: undefined,
    } as Post;

    renderPage(post);

    const images = document.querySelectorAll("img");

    const fallbackAvatar = Array.from(images).find(
      (img) =>
        img.src.includes("ui-avatars.com") &&
        img.src.includes("name=U"),
    );

    expect(fallbackAvatar).toBeDefined();
  });

  it("menampilkan tombol pengelolaan postingan jika user adalah pemilik", () => {
    renderPage();

    expect(
      screen.getByRole("button", {
        name: "Ubah",
      }),
    ).toBeInTheDocument();
  });

  it("membuka ChangeModal ketika tombol Ubah diklik", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Ubah",
      }),
    );

    expect(
      screen.getByTestId("change-modal"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("change-modal-initial"),
    ).toHaveTextContent(
      "Ini adalah isi postingan.",
    );
  });

  it("menutup ChangeModal ketika tombol tutup diklik", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Ubah",
      }),
    );

    expect(
      screen.getByTestId("change-modal"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Tutup Modal",
      }),
    );

    expect(
      screen.queryByTestId("change-modal"),
    ).not.toBeInTheDocument();
  });

  it("memanggil load ulang ketika perubahan postingan selesai", async () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Ubah",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Selesai Ubah",
      }),
    );

    await waitFor(() => {
      expect(mockAsyncLoadPost).toHaveBeenCalledWith(
        "post-1",
      );
    });
  });

  it("mengunggah cover baru", async () => {
    renderPage();

    const input = document.querySelector(
      "#post-cover-input",
    ) as HTMLInputElement;

    const file = new File(
      ["image"],
      "cover.jpg",
      {
        type: "image/jpeg",
      },
    );

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockChangeCover).toHaveBeenCalledWith(
        "post-1",
        file,
      );
    });
  });

  it("tidak memanggil changeCover jika file tidak dipilih", () => {
    renderPage();

    const input = document.querySelector(
      "#post-cover-input",
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [],
      },
    });

    expect(mockChangeCover).not.toHaveBeenCalled();
  });

  it("tidak memanggil changeCover ketika files tidak tersedia", () => {
    renderPage();

    const input = document.querySelector(
      "#post-cover-input",
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {},
    });

    expect(mockChangeCover).not.toHaveBeenCalled();
  });

  it("menampilkan input komentar", () => {
    renderPage();

    expect(
      screen.getByRole("textbox", {
        name: "Komentar",
      }),
    ).toBeInTheDocument();
  });

  it("mengirim komentar baru", async () => {
    renderPage();

    const input = screen.getByRole("textbox", {
      name: "Komentar",
    });

    fireEvent.change(input, {
      target: {
        value: "Komentar baru",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Kirim komentar",
      }),
    );

    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith(
        "post-1",
        "Komentar baru",
      );
    });
  });

  it("menampilkan tombol hapus untuk komentar milik user", () => {
    renderPage();

    const buttons = screen.getAllByRole("button", {
      name: "Hapus komentar",
    });

    expect(buttons).toHaveLength(1);
  });

  it("menghapus komentar milik user", async () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hapus komentar",
      }),
    );

    await waitFor(() => {
      expect(mockDeleteComment).toHaveBeenCalledWith(
        "post-1",
        "comment-2",
      );
    });
  });

  it("menghapus postingan ketika konfirmasi disetujui", async () => {
    mockShowConfirmDialog.mockResolvedValue(true);

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /^Hapus$/,
      }),
    );

    await waitFor(() => {
      expect(
        mockShowConfirmDialog,
      ).toHaveBeenCalledWith(
        "Hapus postingan ini?",
      );
    });

    await waitFor(() => {
      expect(mockDeletePost).toHaveBeenCalledWith(
        "post-1",
      );
    });

    expect(
      mockRouterReplace,
    ).toHaveBeenCalledWith("/");
  });

  it("tidak menghapus postingan ketika konfirmasi ditolak", async () => {
    mockShowConfirmDialog.mockResolvedValue(false);

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /^Hapus$/,
      }),
    );

    await waitFor(() => {
      expect(
        mockShowConfirmDialog,
      ).toHaveBeenCalledWith(
        "Hapus postingan ini?",
      );
    });

    expect(
      mockDeletePost,
    ).not.toHaveBeenCalled();

    expect(
      mockRouterReplace,
    ).not.toHaveBeenCalled();
  });

  it("menampilkan error ketika aksi postingan gagal", async () => {
    mockToggleLike.mockRejectedValue(
      new Error("Gagal menyukai"),
    );

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Batal suka",
      }),
    );

    await waitFor(() => {
      expect(
        mockShowErrorDialog,
      ).toHaveBeenCalledWith(
        "Gagal menyukai",
      );
    });
  });

  it("menggunakan fallback nama Pengguna ketika author komentar tidak tersedia", () => {
    const post = {
      ...basePost,

      comments: [
        {
          id: "comment-3",
          user_id: "user-3",
          comment: "Komentar tanpa author",
        },
      ],
    } as Post;

    renderPage(post);

    expect(
      screen.getByText("Pengguna"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar tanpa author"),
    ).toBeInTheDocument();
  });

  it("menggunakan fallback nama Pengguna ketika author komentar bernilai null", () => {
    const post = {
      ...basePost,

      comments: [
        {
          id: "comment-4",
          user_id: "user-4",
          comment: "Komentar author null",
          author: null,
        },
      ],
    } as Post;

    renderPage(post);

    expect(
      screen.getByText("Pengguna"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar author null"),
    ).toBeInTheDocument();
  });

  it("tidak error ketika daftar likes tidak tersedia", () => {
    const post = {
      ...basePost,
      likes: undefined,
    } as Post;

    renderPage(post);

    expect(
      screen.getByRole("button", {
        name: "Suka",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Komentar (2)"),
    ).toBeInTheDocument();
  });

  it("tidak error ketika daftar komentar tidak tersedia", () => {
    const post = {
      ...basePost,
      comments: undefined,
    } as Post;

    renderPage(post);

    expect(
      screen.getByText("Komentar (0)"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: "Komentar",
      }),
    ).toBeInTheDocument();
  });
});