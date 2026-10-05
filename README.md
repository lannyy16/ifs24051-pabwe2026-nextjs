# Delcom Post — PABWE 2026 Next.js

Implementasi studi kasus **Aplikasi Postingan menggunakan NextJS (TypeScript)** berdasarkan modul PABWE 2026.

## Stack
- Next.js 16 + App Router
- TypeScript
- React 19
- Redux Toolkit + React Redux
- Tailwind CSS v4
- SweetAlert2
- Vitest + Testing Library
- Bun
- REST API Delcom

## Jalankan
```bash
bun install
bun run dev
```
Buka `http://localhost:3000`.

## Environment
Salin `.env.example` menjadi `.env` jika diperlukan:
```env
NEXT_PUBLIC_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=3000
```

## Validasi sebelum dikumpulkan
```bash
bun run lint
bun run build
bun run test:coverage
```

Catatan: pengujian integrasi API memerlukan endpoint Delcom dapat diakses dan akun yang valid. Struktur fitur mengikuti studi kasus: autentikasi, pengguna/profil, CRUD postingan, cover, like, komentar, route App Router, Redux, dan pengujian.
