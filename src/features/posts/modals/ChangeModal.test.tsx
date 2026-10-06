import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal";

const mockChangePost = vi.fn();
const mockShowSuccessDialog = vi.fn();
const mockShowErrorDialog = vi.fn();

vi.mock("../api/postApi", () => ({
  changePost: (...args: unknown[]) => mockChangePost(...args),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: (...args: unknown[]) =>
    mockShowSuccessDialog(...args),
  showErrorDialog: (...args: unknown[]) =>
    mockShowErrorDialog(...args),
}));

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockChangePost.mockResolvedValue(undefined);
    mockShowSuccessDialog.mockResolvedValue(undefined);
  });

  it("menampilkan form ubah postingan dengan nilai awal", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <ChangeModal
        id="post-1"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Ubah postingan",
      })
    ).toBeInTheDocument();

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveValue("Postingan lama");

    expect(
      screen.getByRole("button", {
        name: "Batal",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Simpan",
      })
    ).toBeInTheDocument();
  });

  it("memperbarui isi textarea", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <ChangeModal
        id="post-1"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, {
      target: {
        value: "Postingan yang sudah diubah",
      },
    });

    expect(textarea).toHaveValue(
      "Postingan yang sudah diubah"
    );
  });

  it("memanggil onClose ketika tombol Batal diklik", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <ChangeModal
        id="post-1"
        initial="Postingan lama"
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
      <ChangeModal
        id="post-1"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByRole("textbox");
    const form = textarea.parentElement;
    const overlay = form?.parentElement;

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("tidak menutup modal ketika isi form diklik", () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <ChangeModal
        id="post-1"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.click(
      screen.getByRole("textbox")
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("berhasil mengubah postingan", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    mockChangePost.mockResolvedValue(undefined);
    mockShowSuccessDialog.mockResolvedValue(undefined);

    render(
      <ChangeModal
        id="post-123"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, {
      target: {
        value: "Postingan baru",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan",
      })
    );

    await waitFor(() => {
      expect(mockChangePost).toHaveBeenCalledWith(
        "post-123",
        "Postingan baru"
      );
    });

    expect(mockShowSuccessDialog).toHaveBeenCalledWith(
      "Postingan diperbarui"
    );

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("menampilkan error ketika gagal mengubah postingan", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    mockChangePost.mockRejectedValue(
      new Error("Gagal mengubah postingan")
    );

    render(
      <ChangeModal
        id="post-123"
        initial="Postingan lama"
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.change(
      screen.getByRole("textbox"),
      {
        target: {
          value: "Postingan baru",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan",
      })
    );

    await waitFor(() => {
      expect(mockShowErrorDialog).toHaveBeenCalledWith(
        "Gagal mengubah postingan"
      );
    });

    expect(onDone).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("mengirimkan nilai awal jika textarea tidak diubah", async () => {
    const onClose = vi.fn();
    const onDone = vi.fn();

    render(
      <ChangeModal
        id="post-456"
        initial="Isi awal postingan"
        onClose={onClose}
        onDone={onDone}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Simpan",
      })
    );

    await waitFor(() => {
      expect(mockChangePost).toHaveBeenCalledWith(
        "post-456",
        "Isi awal postingan"
      );
    });

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});