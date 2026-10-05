const base = { confirmButtonColor: "#4f46e5" } as const;
const swal = async () => (await import("sweetalert2")).default;

export const showSuccessDialog = async (text: string) =>
  (await swal()).fire({ ...base, icon: "success", title: "Berhasil", text, timer: 1800, showConfirmButton: false });

export const showErrorDialog = async (text: string) =>
  (await swal()).fire({ ...base, icon: "error", title: "Oops", text });

export const showWarningDialog = async (text: string) =>
  (await swal()).fire({ ...base, icon: "warning", title: "Perhatian", text });

export const showConfirmDialog = async (text: string) =>
  (await (await swal()).fire({
    ...base,
    icon: "question",
    title: "Yakin?",
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  })).isConfirmed;

export const formatDate = (d: string) =>
  new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });