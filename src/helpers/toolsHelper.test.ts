import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import Swal from "sweetalert2";
import { formatDate, showConfirmDialog, showErrorDialog, showSuccessDialog, showWarningDialog } from "./toolsHelper";

const fire = vi.mocked(Swal.fire);

describe("toolsHelper", () => {
  beforeEach(() => {
    fire.mockReset();
    fire.mockResolvedValue({ isConfirmed: true } as never);
  });

  it("showSuccessDialog menampilkan dialog sukses", async () => {
    await showSuccessDialog("Tersimpan");
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", text: "Tersimpan" }));
  });

  it("showErrorDialog menampilkan dialog error", async () => {
    await showErrorDialog("Gagal");
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "Gagal" }));
  });

  it("showWarningDialog menampilkan dialog peringatan", async () => {
    await showWarningDialog("Hati-hati");
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning", text: "Hati-hati" }));
  });

  it("showConfirmDialog mengembalikan true saat dikonfirmasi", async () => {
    await expect(showConfirmDialog("Hapus?")).resolves.toBe(true);
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "question", showCancelButton: true }));
  });

  it("showConfirmDialog mengembalikan false saat dibatalkan", async () => {
    fire.mockResolvedValue({ isConfirmed: false } as never);
    await expect(showConfirmDialog("Hapus?")).resolves.toBe(false);
  });

  it("formatDate memformat tanggal ke teks lokal", () => {
    const out = formatDate("2026-01-15T10:00:00Z");
    expect(typeof out).toBe("string");
    expect(out).toContain("2026");
  });
});
