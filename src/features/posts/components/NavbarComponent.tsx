"use client";

import Link from "next/link";
import { useAppSelector } from "@/hooks/redux";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[22px] w-[22px]">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default function NavbarComponent({ onMenu, onLogout }: { onMenu: () => void; onLogout: () => void }) {
  const me = useAppSelector((s) => s.auth.profile);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenu} aria-label="menu">
          <MenuIcon />
        </button>
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold text-transparent">
          ✦ Postingan
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-2">
          <img
            src={me?.photo || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(me?.name || "U")}`}
            alt=""
            className="size-9 rounded-full object-cover"
          />
          <span className="hidden text-sm font-semibold sm:block">{me?.name}</span>
        </Link>
        <button onClick={onLogout} className="btn btn-ghost !px-3" aria-label="logout">
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}
