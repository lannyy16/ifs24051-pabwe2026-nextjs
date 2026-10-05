"use client";
import { useState } from "react";
import { changePost } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
export default function ChangeModal({ id, initial, onClose, onDone }: { id: string; initial: string; onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState(initial);
  const submit = async (e: React.FormEvent) => { e.preventDefault();
    try { await changePost(id, text); await showSuccessDialog("Postingan diperbarui"); onDone(); onClose(); } catch (err) { showErrorDialog((err as Error).message); } };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card w-full max-w-lg space-y-4 p-6">
        <h2 className="text-lg font-extrabold">Ubah postingan</h2>
        <textarea className="input min-h-32" value={text} onChange={(e) => setText(e.target.value)} required />
        <div className="flex justify-end gap-2"><button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button><button className="btn btn-primary">Simpan</button></div>
      </form>
    </div>
  );
}
