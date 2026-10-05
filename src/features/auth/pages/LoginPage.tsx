"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { login } from "../api/authApi";
import { putAccessToken } from "@/helpers/apiHelper";
import { showErrorDialog } from "@/helpers/toolsHelper";

export default function LoginPage() {
  const router = useRouter();
  const [email, onEmail] = useInput();
  const [password, onPass] = useInput();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      putAccessToken((await login(email, password)).token);
      router.replace("/");
    } catch (err) {
      showErrorDialog((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-8">
      <h1 className="text-2xl font-extrabold">Selamat datang 👋</h1>
      <p className="text-sm text-slate-600">Masuk untuk melanjutkan</p>
      <input
        id="login-email-input"
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
        id="login-password-input"
        name="password"
        aria-label="Kata sandi"
        autoComplete="current-password"
        className="input"
        type="password"
        placeholder="Kata sandi"
        value={password}
        onChange={onPass}
        required
      />
      <button id="login-submit-button" type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Memproses..." : "Masuk"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link className="font-semibold text-indigo-600 underline underline-offset-2" href="/auth/register">
          Daftar
        </Link>
      </p>
    </form>
  );
}