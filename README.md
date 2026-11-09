# Masisir Health Pass

**Connecting Masisir to Better Health.**

Platform kesehatan komunitas bagi Masyarakat Indonesia di Mesir (Masisir), dikelola oleh Kementerian Kesehatan PPMI Mesir. Menggabungkan edukasi kesehatan, direktori fasilitas kesehatan, jalur bantuan, program kesehatan, statistik agregat, dan (tahap berikutnya) sistem pengelolaan internal.

> **Status: Phase 1 — Foundation & Public MVP.** Portal publik sudah berfungsi dengan data dari database. Sistem internal (`/admin`) belum aktif dan seluruh API admin menolak akses. Belum siap produksi: data resmi, logo, dan beberapa keputusan masih menunggu pemilik proyek — lihat [docs/OWNER-INPUT.md](docs/OWNER-INPUT.md).

## Teknologi

| Lapisan | Pilihan |
| --- | --- |
| Frontend | React 19 + TypeScript, Vite, React Router, plain CSS dengan design tokens |
| Backend | Cloudflare Workers + Hono (satu Worker: aset statis + `/api/*`) |
| Database | Cloudflare D1 (SQLite) dengan migrations |
| Validasi | Zod (server-side) |
| Peta | Leaflet + OpenStreetMap (dimuat hanya saat tampilan peta dibuka) |
| Ikon / font | Lucide, Plus Jakarta Sans (self-hosted via Fontsource) |
| Test | Vitest + Testing Library; API diuji terhadap SQLite nyata dengan migrations yang sama |

## Menjalankan secara lokal

Butuh Node.js 22+.

```bash
npm install
npm run db:migrate:local   # buat tabel di D1 lokal
npm run db:seed:local      # (opsional) data CONTOH untuk pengembangan
npm run dev                # http://localhost:5173
```

Perintah lain:

```bash
npm test            # unit + API + UI tests
npm run typecheck   # TypeScript untuk app, worker, dan tests
npm run build       # production build
npm run db:reset:local
```

## Struktur

```
migrations/        SQL migrations D1 (dilacak oleh wrangler)
seed/              data CONTOH khusus pengembangan — jangan dijalankan di produksi
shared/            tipe & logika bersama (privasi statistik, parser Markdown aman)
worker/            API Hono: routes publik (read-only) dan admin (ditolak sampai Phase 2)
src/
  components/      layout, UI kit (badge, modal, toast, tabs, states, …), cards
  pages/           halaman portal publik + gerbang /admin
  styles/          tokens.css → base → layout → components → pages
  i18n/            kamus bahasa (id); siap ditambah en/ar
public/images/     foto proyek yang sudah dioptimasi (WebP + JPEG)
assets/originals/  foto asli dari pemilik proyek (tidak diubah)
scripts/           optimize_images.py untuk membuat ulang turunan gambar
docs/              arsitektur, design system, aset, input pemilik
```

## Dokumentasi

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arsitektur, keamanan, database, rencana fase
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — warna, tipografi, komponen
- [docs/ASSETS.md](docs/ASSETS.md) — audit aset & pemetaan ke halaman
- [docs/OWNER-INPUT.md](docs/OWNER-INPUT.md) — data dan keputusan yang dibutuhkan dari Menkes PPMI Mesir
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — langkah deploy ke Cloudflare
