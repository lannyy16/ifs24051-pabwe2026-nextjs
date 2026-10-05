"use client";
import { useState } from "react";
import { changeCover } from "../api/postApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import Modal from "./Modal";
import type { Post } from "@/types";
import AddModal from "./AddModal";

export default function ChangeCoverModal({ post, onClose, onDone }: { post: Post; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(post.cover || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!file) return void showErrorDialog("Pilih gambar terlebih dahulu.");
    setLoading(true);
    try {
      await changeCover(post.id, file);
      await showSuccessDialog("Cover berhasil diperbarui.");
      onDone();
      onClose();
    } catch (err) {
      showErrorDialog((err as Error).message || "Upload gagal");
      setLoading(false);
    }
  };

  return (
    <Modal title="Ganti cover" onClose={onClose}>
      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:bg-slate-50">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          if (f) setPreview(URL.createObjectURL(f));
        }} />
        <span className="font-semibold text-slate-700">Pilih gambar cover</span>
        <span className="mt-1 block text-sm text-slate-600">PNG, JPG, WEBP</span>
      </label>
      {preview && <img src={preview} alt="Preview cover" className="max-h-56 w-full rounded-2xl object-cover" />}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
        <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Mengunggah…" : "Unggah"}</button>
      </div>
    </Modal>
  );
}