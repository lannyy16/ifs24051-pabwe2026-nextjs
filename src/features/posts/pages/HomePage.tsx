"use client";
import { type ComponentProps, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLoadPosts } from "../states/reducer";
import { formatDate } from "@/helpers/toolsHelper";

const AddModal = dynamic(() => import("../modals/AddModal"));

const Svg = ({ className, children, ...props }: ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className ?? "h-4 w-4"} aria-hidden="true" {...props}>
    {children}
  </svg>
);
const PlusIcon = (p: ComponentProps<"svg">) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
const SearchIcon = (p: ComponentProps<"svg">) => <Svg {...p}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></Svg>;
const HeartIcon = (p: ComponentProps<"svg">) => <Svg {...p}><path d="M12 21s-7.5-4.35-9.3-8.16C1.65 10.2 3.05 6 7.2 6c2.2 0 3.4 1.14 4.05 2.18A4.7 4.7 0 0 1 15.8 6c4.15 0 5.55 4.2 4.5 6.84C19.5 16.65 12 21 12 21Z" /></Svg>;
const MessageIcon = (p: ComponentProps<"svg">) => <Svg {...p}><path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" /></Svg>;

export default function HomePage() {
  const dispatch = useAppDispatch();
  const isMe = useSearchParams().get("me") === "1";
  const { posts, isPost } = useAppSelector((s) => s.posts);
  const [q, setQ] = useState("");
  const [add, setAdd] = useState(false);
  const load = () => dispatch(asyncLoadPosts(isMe));

  useEffect(() => { dispatch(asyncLoadPosts(isMe)); }, [isMe, dispatch]);

  const list = posts.filter((p) => p.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{isMe ? "Postingan Saya" : "Linimasa"}</h1>
        <button className="btn btn-primary" onClick={() => setAdd(true)}><PlusIcon />Tambah</button>
      </div>
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-600" />
        <input
          id="search-post-input"
          name="search"
          aria-label="Cari postingan"
          className="input pl-10"
          placeholder="Cari postingan..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {isPost && <p className="text-slate-600">Memuat...</p>}
      {!isPost && list.length === 0 && <div className="card p-10 text-center text-slate-600">Belum ada postingan.</div>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/posts/${p.id}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
            {p.cover ? (
              <img src={p.cover} alt="" width={640} height={352} className="h-44 w-full object-cover" loading="lazy" decoding="async" />
            ) : (
              <div className="h-44 bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-200" />
            )}
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold text-indigo-600">{p.author?.name}</p>
              <p className="line-clamp-3 text-slate-700">{p.description}</p>
              <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
                <span>{formatDate(p.created_at)}</span>
                <span className="flex gap-3">
                  <span className="flex items-center gap-1"><HeartIcon />{p.likes?.length ?? p.total_likes ?? 0}</span>
                  <span className="flex items-center gap-1"><MessageIcon />{p.comments?.length ?? p.total_comments ?? 0}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {add && <AddModal onClose={() => setAdd(false)} onDone={load} />}
    </div>
  );
}