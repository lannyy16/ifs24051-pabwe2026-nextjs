"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAccessToken } from "@/helpers/apiHelper";
import { asyncLoadProfile, isAuthLogout } from "@/features/auth/states/reducer";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, isProfile } = useAppSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) router.replace("/auth/login");
    else dispatch(asyncLoadProfile());
  }, [dispatch, router]);

  useEffect(() => {
    if (isProfile && !profile) router.replace("/auth/login");
  }, [isProfile, profile, router]);

  const logout = async () => {
    if (await showConfirmDialog("Keluar dari akun?")) {
      dispatch(isAuthLogout());
      router.replace("/auth/login");
    }
  };

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center text-slate-600">
        <h1 className="sr-only">Memuat</h1>
        Memuat...
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent onMenu={() => setOpen(true)} onLogout={logout} />
      <Suspense><SidebarComponent open={open} onClose={() => setOpen(false)} /></Suspense>
      <main className="p-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}