"use client";
import { useEffect, useState, type SVGProps } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLoadPost } from "../states/reducer";
import { addComment, changeCover, deleteComment, deletePost, toggleLike } from "../api/postApi";
import { formatDate, showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

const IconBase = ({ size = 18, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden="true"
    {...props}
  />
);

const FiHeart = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M12 21s-8.5-4.7-10.3-9.3C.9 9.6 2.5 5 6.7 5c2.1 0 3.3 1.1 4.1 2.2A5.1 5.1 0 0 1 15 5c4.2 0 5.8 4.6 5 6.7C20.5 16.3 12 21 12 21Z" />
  </IconBase>
);

const FiTrash2 = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </IconBase>
);

const FiEdit2 = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </IconBase>
);

const FiImage = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="10" r="1.5" />
    <path d="m21 15-5.5-5.5a1 1 0 0 0-1.4 0L7 17" />
  </IconBase>
);

const FiSend = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </IconBase>
);

export default function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { post } = useAppSelector((s) => s.posts);
  const me = useAppSelector((s) => s.auth.profile);
  const [comment, setComment] = useState("");
  const [edit, setEdit] = useState(false);
  const [failedId, setFailedId] = useState<string | null>(null);

  const load = () => dispatch(asyncLoadPost(postId));

  useEffect(() => {
    dispatch(asyncLoadPost(postId)).then((result) => {
      if (asyncLoadPost.rejected.match(result)) setFailedId(postId);
    });
  }, [postId, dispatch]);

  const act = async (fn: () => Promise<unknown>) => {
    try { await fn(); await load(); } catch (e) { showErrorDialog((e as Error).message); }
  };

  if (failedId === postId && (!post || post.id !== postId)) {
    return (
      <section className="card mx-auto max-w-3xl p-10 text-center">
        <h1 className="text-xl font-extrabold">Postingan tidak ditemukan</h1>
        <p className="mt-2 text-slate-600">Postingan ini mungkin sudah dihapus atau alamatnya salah.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.replace("/")}>Kembali ke linimasa</button>
      </section>
    );
  }

  if (!post || post.id !== postId) {
    return (
      <>
        <h1 className="sr-only">Detail postingan</h1>
        <p className="text-slate-600">Memuat...</p>
      </>
    );
  }

  const mine = me?.id === post.user_id;
  const liked = post.likes?.some((l) => l.user_id === me?.id);

  return (
    <article className="card mx-auto max-w-3xl overflow-hidden">
      {post.cover ? <img src={post.cover} alt="" className="max-h-96 w-full object-cover" /> : <div className="h-48 bg-gradient-to-br from-indigo-200 via-violet-200 to-fuchsia-200" />}
      <div className="space-y-5 p-6">
        <h1 className="sr-only">Detail postingan</h1>
        <div className="flex items-center gap-3">
          <img src={post.author?.photo || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(post.author?.name || "U")}`} alt="" className="size-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold">{post.author?.name}</p>
            <p className="text-xs text-slate-600">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.description}</p>

        <div className="flex flex-wrap gap-2">
          <button
            aria-label={liked ? "Batal suka" : "Suka"}
            className={`btn ${liked ? "btn-primary" : "btn-ghost"}`}
            onClick={() => act(() => toggleLike(post.id))}
          >
            <FiHeart />{post.likes?.length ?? 0}
          </button>
          {mine && (
            <>
              <label className="btn btn-ghost cursor-pointer focus-within:ring-4 focus-within:ring-indigo-100">
                <FiImage />Cover
                <input
                  id="post-cover-input"
                  name="cover"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) act(() => changeCover(post.id, file));
                  }}
                />
              </label>
              <button className="btn btn-ghost" onClick={() => setEdit(true)}><FiEdit2 />Ubah</button>
              <button
                className="btn btn-ghost !text-red-600"
                onClick={async () => {
                  if (await showConfirmDialog("Hapus postingan ini?")) {
                    await deletePost(post.id);
                    router.replace("/");
                  }
                }}
              >
                <FiTrash2 />Hapus
              </button>
            </>
          )}
        </div>

        <hr className="border-slate-100" />
        <h2 className="font-bold">Komentar ({post.comments?.length ?? 0})</h2>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            act(async () => { await addComment(post.id, comment); setComment(""); });
          }}
        >
          <input
            id="comment-input"
            name="comment"
            aria-label="Komentar"
            className="input"
            placeholder="Tulis komentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit" aria-label="Kirim komentar" className="btn btn-primary"><FiSend /></button>
        </form>

        <ul className="space-y-3">
          {post.comments?.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-sm font-semibold">{c.author?.name ?? "Pengguna"}</p>
                <p className="text-sm text-slate-600">{c.comment}</p>
              </div>
              {c.user_id === me?.id && (
                <button
                  className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-red-600"
                  onClick={() => act(() => deleteComment(post.id, c.id))}
                  aria-label="Hapus komentar"
                >
                  <FiTrash2 />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {edit && <ChangeModal id={post.id} initial={post.description} onClose={() => setEdit(false)} onDone={load} />}
    </article>
  );
}