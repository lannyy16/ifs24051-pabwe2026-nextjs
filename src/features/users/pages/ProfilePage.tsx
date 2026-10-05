"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncLoadProfile } from "@/features/auth/states/reducer";
import { changePassword, updateMe, uploadPhoto } from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.profile);
  const [name, onName] = useInput(me?.name || "");
  const [email, onEmail] = useInput(me?.email || "");
  const [pass, onPass, setPass] = useInput();
  const [npass, onNpass, setNpass] = useInput();

  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      await dispatch(asyncLoadProfile());
      showSuccessDialog(msg);
    } catch (e) {
      showErrorDialog((e as Error).message);
    }
  };

  if (!me) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">Profil Saya</h1>

      <div className="card flex items-center gap-5 p-6">
        <img
          src={me.photo || `https://ui-avatars.com/api/?background=6366f1&color=fff&size=128&name=${encodeURIComponent(me.name)}`}
          alt=""
          className="size-20 rounded-full object-cover"
        />
        <label className="btn btn-ghost cursor-pointer focus-within:ring-4 focus-within:ring-indigo-100">
          Ganti foto
          <input
            id="profile-photo-input"
            name="photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) run(() => uploadPhoto(file), "Foto diperbarui");
            }}
          />
        </label>
      </div>

      <form
        className="card space-y-3 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => updateMe(name, email), "Profil diperbarui");
        }}
      >
        <h2 className="font-bold">Data diri</h2>
        <input
          id="profile-name-input"
          name="name"
          aria-label="Nama"
          autoComplete="name"
          className="input"
          placeholder="Nama"
          value={name}
          onChange={onName}
        />
        <input
          id="profile-email-input"
          name="email"
          aria-label="Email"
          autoComplete="email"
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onEmail}
        />
        <button id="profile-save-button" type="submit" className="btn btn-primary">Simpan</button>
      </form>

      <form
        className="card space-y-3 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => {
            await changePassword(pass, npass);
            setPass("");
            setNpass("");
          }, "Kata sandi diubah");
        }}
      >
        <h2 className="font-bold">Ubah kata sandi</h2>
        <input
          id="profile-old-password-input"
          name="old_password"
          aria-label="Kata sandi lama"
          autoComplete="current-password"
          className="input"
          type="password"
          placeholder="Kata sandi lama"
          value={pass}
          onChange={onPass}
        />
        <input
          id="profile-new-password-input"
          name="new_password"
          aria-label="Kata sandi baru"
          autoComplete="new-password"
          className="input"
          type="password"
          placeholder="Kata sandi baru"
          value={npass}
          onChange={onNpass}
        />
        <button id="profile-password-button" type="submit" className="btn btn-primary">Ubah</button>
      </form>
    </div>
  );
}