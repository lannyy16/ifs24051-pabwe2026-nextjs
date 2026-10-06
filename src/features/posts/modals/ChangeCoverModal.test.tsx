import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal";
import { changeCover } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

vi.mock("../api/postApi", () => ({
  changeCover: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

vi.mock("./Modal", () => ({
  default: ({
    title,
    children,
    onClose,
  }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Tutup Modal</button>
      {children}
    </div>
  ),
}));

const mockPost = {
  id: "post-1",
  user_id: "user-1",
  description: "Postingan test",
  cover: "https://example.com/cover.jpg",
  created_at: "2026-01-01T10:00:00Z",
  updated_at: "2026-01-01T10:00:00Z",
  author: {
    id: "user-1",
    name: "Karina",
    email: "karina@example.com",
    photo: "",
  },
  likes: [],
  comments: [],
};

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    if (!URL.createObjectURL) {
      Object.defineProperty(URL, "createObjectURL", {
        writable: true,
        value: vi.fn(() => "blob:test-cover"),
      });
    } else {
      vi.spyOn(URL, "createObjectURL").mockReturnValue(
        "blob:test-cover",
      );
    }
  });

  it("menampilkan modal dengan cover awal", () => {
    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText("Ganti cover")).toBeInTheDocument();

    expect(screen.getByAltText("Preview cover")).toHaveAttribute(
      "src",
      "https://example.com/cover.jpg",
    );
  });

  it("menampilkan modal tanpa cover awal", () => {
    const postWithoutCover = {
      ...mockPost,
      cover: "",
    };

    render(
      <ChangeCoverModal
        post={postWithoutCover}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText("Ganti cover")).toBeInTheDocument();

    expect(
      screen.queryByAltText("Preview cover"),
    ).not.toBeInTheDocument();
  });

  it("menampilkan error ketika submit tanpa memilih gambar", () => {
    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Unggah" }),
    );

    expect(showErrorDialog).toHaveBeenCalledWith(
      "Pilih gambar terlebih dahulu.",
    );

    expect(changeCover).not.toHaveBeenCalled();
  });

  it("memilih file dan menampilkan preview gambar", () => {
    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    const file = new File(["image"], "cover.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);

    expect(screen.getByAltText("Preview cover")).toHaveAttribute(
      "src",
      "blob:test-cover",
    );
  });

  it("mengabaikan perubahan ketika tidak ada file", () => {
    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [],
      },
    });

    expect(changeCover).not.toHaveBeenCalled();
  });

  it("berhasil mengubah cover", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    vi.mocked(changeCover).mockResolvedValueOnce(undefined);

    vi.mocked(showSuccessDialog).mockResolvedValueOnce(
      {} as Awaited<ReturnType<typeof showSuccessDialog>>,
    );

    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={onClose}
        onDone={onDone}
      />,
    );

    const file = new File(["image"], "cover.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Unggah" }),
    );

    await waitFor(() => {
      expect(changeCover).toHaveBeenCalledWith(
        "post-1",
        file,
      );
    });

    expect(showSuccessDialog).toHaveBeenCalledWith(
      "Cover berhasil diperbarui.",
    );

    expect(onDone).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan loading ketika upload berlangsung", async () => {
    let resolveUpload!: () => void;

    vi.mocked(changeCover).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveUpload = resolve;
        }),
    );

    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    const file = new File(["image"], "cover.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Unggah/ }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Mengunggah/,
        }),
      ).toBeDisabled();
    });

    resolveUpload();

    await waitFor(() => {
      expect(showSuccessDialog).toHaveBeenCalledWith(
        "Cover berhasil diperbarui.",
      );
    });
  });

  it("menampilkan error ketika upload gagal dengan pesan error", async () => {
    const error = new Error("Upload gagal dari server");

    vi.mocked(changeCover).mockRejectedValueOnce(error);

    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    const file = new File(["image"], "cover.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Unggah/ }),
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Upload gagal dari server",
      );
    });
  });

  it("menampilkan pesan Upload gagal ketika error tidak memiliki message", async () => {
    vi.mocked(changeCover).mockRejectedValueOnce({});

    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    const file = new File(["image"], "cover.png", {
      type: "image/png",
    });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Unggah/ }),
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Upload gagal",
      );
    });
  });

  it("menutup modal ketika tombol Batal diklik", () => {
    const onClose = vi.fn();

    render(
      <ChangeCoverModal
        post={mockPost}
        onClose={onClose}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Batal" }),
    );

    expect(onClose).toHaveBeenCalled();
  });
});