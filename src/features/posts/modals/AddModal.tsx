"use client";
import { useState } from "react";
import { addPost } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function AddModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await addPost(text); await showSuccessDialog("Postingan dipublikasikan"); onDone(); onClose(); }
    catch (err) { showErrorDialog((err as Error).message); setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card w-full max-w-lg space-y-4 p-6">
        <h2 className="text-lg font-extrabold">Postingan baru</h2>
        <textarea className="input min-h-32" placeholder="Apa yang kamu pikirkan?" value={text} onChange={(e) => setText(e.target.value)} required />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" disabled={busy}>Publikasikan</button>
        </div>
      </form>
    </div>
  );
}