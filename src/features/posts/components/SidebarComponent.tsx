"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactElement, SVGProps } from "react";

type SidebarIconProps = SVGProps<SVGSVGElement> & { size?: number | string };

type SidebarIcon = (props: SidebarIconProps) => ReactElement;

const GlobeIcon: SidebarIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
);

const FileTextIcon: SidebarIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5M9 11h6M9 15h6M9 19h4" />
  </svg>
);

const UsersIcon: SidebarIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
    <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
    <circle cx="10" cy="7" r="3" />
    <path d="M22 19v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserIcon: SidebarIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

const items = [{ href: "/", label: "Semua Postingan", icon: GlobeIcon }, { href: "/?me=1", label: "Postingan Saya", icon: FileTextIcon }, { href: "/users", label: "Daftar Pengguna", icon: UsersIcon }, { href: "/profile", label: "Profil Saya", icon: UserIcon }];
export default function SidebarComponent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname(); const isMe = useSearchParams().get("me") === "1";
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 pt-20 shadow-xl transition-transform lg:z-20 lg:translate-x-0 lg:shadow-none lg:ring-1 lg:ring-slate-100 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="space-y-1">
          {items.map(({ href, label, icon: I }) => {
            const active = href === "/" ? path === "/" && !isMe : href === "/?me=1" ? path === "/" && isMe : path === href;
            return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}><I size={18} />{label}</Link>;
          })}
        </nav>
      </aside>
    </>
  );
}
