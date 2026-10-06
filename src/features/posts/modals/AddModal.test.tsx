import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AddModal from "./AddModal";

const mockAddPost = vi.fn();
const mockShowSuccessDialog = vi.fn();
const mockShowErrorDialog = vi.fn();

vi.mock("../api/postApi", () => ({
  addPost: (...args: unknown[]) => mockAddPost(...args),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: (...args: unknown[]) =>
    mockShowSuccessDialog(...args),
  showErrorDialog: (...args: unknown[]) =>
    mockShowErrorDialog(...args),
}));

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAddPost.mockResolvedValue(undefined);
    mockShowSuccessDialog.mockResolvedValue(undefined);
  });

  it("menampilkan form postingan baru", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Postingan baru",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Apa yang kamu pikirkan?"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Batal",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Publikasikan",
      })
    ).toBeInTheDocument();
  });

  it("memperbarui isi textarea", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Apa yang kamu pikirkan?"
    );

    fireEvent.change(textarea, {
      target: {
        value: "Ini adalah postingan baru",
      },
    });

    expect(textarea).toHaveValue(
      "Ini adalah postingan baru"
    );
  });

  it("memanggil onClose ketika tombol Batal diklik", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Batal",
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("memanggil onClose ketika overlay diklik", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Apa yang kamu pikirkan?"
    );

    const form = textarea.parentElement;

    expect(form).toBeInTheDocument();

    const overlay = form?.parentElement;

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("tidak menutup modal ketika isi form diklik", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.click(
      screen.getByPlaceholderText(
        "Apa yang kamu pikirkan?"
      )
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("berhasil mempublikasikan postingan", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    mockAddPost.mockResolvedValue(undefined);
    mockShowSuccessDialog.mockResolvedValue(undefined);

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Apa yang kamu pikirkan?"
    );

    fireEvent.change(textarea, {
      target: {
        value: "Halo, ini postingan saya",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Publikasikan",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Publikasikan",
      })
    ).toBeDisabled();

    await waitFor(() => {
      expect(mockAddPost).toHaveBeenCalledWith(
        "Halo, ini postingan saya"
      );
    });

    expect(mockShowSuccessDialog).toHaveBeenCalledWith(
      "Postingan dipublikasikan"
    );

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("menampilkan error ketika gagal mempublikasikan postingan", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    mockAddPost.mockRejectedValue(
      new Error("Gagal mempublikasikan postingan")
    );

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Apa yang kamu pikirkan?"
    );

    fireEvent.change(textarea, {
      target: {
        value: "Postingan gagal",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Publikasikan",
      })
    );

    await waitFor(() => {
      expect(mockShowErrorDialog).toHaveBeenCalledWith(
        "Gagal mempublikasikan postingan"
      );
    });

    expect(onDone).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    expect(
      screen.getByRole("button", {
        name: "Publikasikan",
      })
    ).not.toBeDisabled();
  });

  it("menonaktifkan tombol Publikasikan selama proses submit", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    let resolvePost: (() => void) | undefined;

    mockAddPost.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePost = resolve;
        })
    );

    render(
      <AddModal
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Apa yang kamu pikirkan?"
      ),
      {
        target: {
          value: "Postingan sedang diproses",
        },
      }
    );

    const submitButton = screen.getByRole("button", {
      name: "Publikasikan",
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(mockAddPost).toHaveBeenCalledWith(
      "Postingan sedang diproses"
    );

    resolvePost?.();

    await waitFor(() => {
      expect(onDone).toHaveBeenCalledTimes(1);
    });
  });
});