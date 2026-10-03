import Swal from "sweetalert2";
const base = { confirmButtonColor: "#4f46e5" } as const;
export const showSuccessDialog = (text: string) => Swal.fire({ ...base, icon: "success", title: "Berhasil", text, timer: 1800, showConfirmButton: false });
export const showErrorDialog = (text: string) => Swal.fire({ ...base, icon: "error", title: "Oops", text });
export const showWarningDialog = (text: string) => Swal.fire({ ...base, icon: "warning", title: "Perhatian", text });
export const showConfirmDialog = async (text: string) => (await Swal.fire({ ...base, icon: "question", title: "Yakin?", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal" })).isConfirmed;
export const formatDate = (d: string) => new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
