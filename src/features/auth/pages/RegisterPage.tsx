"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { register } from "../api/authApi";
import { showErrorDialog, showSuccessDialog, showWarningDialog } from "@/helpers/toolsHelper";

export default function RegisterPage() {
  const router = useRouter();
  const [name, onName] = useInput();
  const [email, onEmail] = useInput();
  const [password, onPass] = useInput();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return void showWarningDialog("Kata sandi minimal 6 karakter");
    setBusy(true);
    try {
      await register(name, email, password);
      await showSuccessDialog("Akun dibuat, silakan masuk");
      router.replace("/auth/login");
    } catch (err) {
      showErrorDialog((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-8">
      <h1 className="text-2xl font-extrabold">Buat akun baru</h1>
      <p className="text-sm text-slate-600">Hanya butuh semenit</p>
      <input
        id="register-name-input"
        name="name"
        aria-label="Nama lengkap"
        autoComplete="name"
        className="input"
        placeholder="Nama lengkap"
        value={name}
        onChange={onName}
        required
      />
      <input
        id="register-email-input"
        name="email"
        aria-label="Email"
        autoComplete="email"
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmail}
        required
      />
      <input
        id="register-password-input"
        name="password"
        aria-label="Kata sandi"
        autoComplete="new-password"
        className="input"
        type="password"
        placeholder="Kata sandi"
        value={password}
        onChange={onPass}
        required
      />
      <button id="register-submit-button" type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Memproses..." : "Daftar"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link className="font-semibold text-indigo-600 underline underline-offset-2" href="/auth/login">
          Masuk
        </Link>
      </p>
    </form>
  );
}