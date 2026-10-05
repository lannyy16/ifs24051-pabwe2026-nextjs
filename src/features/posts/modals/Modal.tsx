"use client";
export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg space-y-4 p-6">
        <h2 className="text-lg font-extrabold">{title}</h2>
        {children}
      </div>
    </div>
  );
}