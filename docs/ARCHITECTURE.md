# Arsitektur

## Audit awal (Phase 1)

Repository `masisir-health-pass` masih kosong saat pekerjaan dimulai (tidak ada commit, stack, atau aset). Karena itu stack rekomendasi dari brief dipakai apa adanya: React + TypeScript + Vite, React Router, plain CSS, Cloudflare Workers + Hono, D1, Vitest. Aset yang tersedia hanya 5 foto dari Pexels yang dilampirkan pemilik (lihat [ASSETS.md](ASSETS.md)).

## Gambaran sistem

```
Browser ──► Cloudflare Worker "masisir-health-pass"
             ├─ aset statis (SPA React)   /, /edukasi, /fasilitas, …, /admin
             └─ Hono API                  /api/*
                  ├─ /api/health
                  ├─ /api/public/*   GET saja, tanpa login, tanpa data pribadi
                  └─ /api/admin/*    Phase 2 — saat ini selalu 401
                         │
                         ▼
                    D1 (SQLite)
```

- Satu deploy, satu domain. `wrangler.jsonc` mengatur `run_worker_first: ["/api/*"]` dan fallback SPA untuk path lain.
- `/admin` adalah shell terpisah (tanpa header/footer publik) agar dashboard Phase 2 dapat tumbuh tanpa menyentuh portal.

## Pemisahan publik vs internal

Prinsip: **akses data ditentukan di server, bukan di UI.**

1. API publik hanya `GET`; metode lain → 405.
2. Aturan visibilitas berada di satu tempat (`worker/lib/repo.ts`) dan diterapkan di SQL:
   - artikel & program: `status = 'published'` (artikel juga `published_at <= sekarang`)
   - fasilitas & kontak: `is_active = 1`
   - jam operasional hanya dikirim jika `hours_verified = 1`
   - produksi (`APP_ENV=production`): baris `is_sample = 1` selalu disaring
3. Mapper (`worker/lib/mappers.ts`) menyalin hanya kolom yang memang publik; kolom internal tidak pernah keluar dari Worker.
4. `/api/admin/*` menolak semua permintaan sampai autentikasi + RBAC server-side dibangun.

## Database

Migration `0001_public_content.sql` membuat tabel konten publik:

| Tabel | Isi |
| --- | --- |
| `article_categories` | 8 kategori dari brief (data struktural, aman di-seed) |
| `articles` | edukasi + berita/pengumuman/imbauan/agenda (`kind`), status Draft/Review/Published/Archived, sumber (JSON), peninjau |
| `facility_types` | Rumah Sakit, Klinik, Dokter Praktik, Apotek, Laboratorium, Lainnya |
| `regions` | wilayah — **kosong**, diisi pengelola |
| `facilities` | direktori; status verifikasi, `last_verified_at`, aktif/nonaktif, unggulan |
| `hotline_contacts` | kontak darurat/Menkes/Satgas/KBRI; prioritas, aktif, tanggal verifikasi |
| `programs` | program kesehatan; status program + status publikasi |

Tidak ada tabel yang menyimpan data pribadi atau data kesehatan individu pada Phase 1.

Rencana migration berikutnya:

- **0002 (Phase 2)** — `users`, `roles`, `permissions`, `user_roles`, `sessions`, `activity_logs`, `content_revisions`, `facility_revisions`.
- **0003 (Phase 3)** — `health_datasets` (periode, sumber, status validasi) dan `health_aggregates` (hitungan per kategori/wilayah/kekeluargaan — *agregat, bukan baris per orang*).
- **0004 (Phase 4)** — `case_reports` + `case_events` dengan akses terbatas per role, hanya setelah kebijakan persetujuan, retensi, dan insiden disetujui.

## Keamanan yang sudah diterapkan

- Validasi semua parameter query di server (Zod); slug dibatasi `[a-z0-9-]`, pencarian ≤100 karakter, wildcard `LIKE` di-escape.
- Semua query memakai prepared statements (`bind`).
- Konten artikel memakai subset Markdown yang di-parse menjadi pohon data lalu dirender React — tidak ada `innerHTML`; HTML mentah tampil sebagai teks; tautan hanya http(s)/mailto/tel/relatif.
- Popup peta dibangun dengan DOM API (bukan string HTML).
- Header keamanan: `secureHeaders()` untuk API, `public/_headers` (CSP, X-Frame-Options, dll.) untuk aset.
- Error log hanya berisi metode, path, dan pesan error — tidak pernah body permintaan.
- Tidak ada secret di frontend. `.dev.vars` di-ignore.

Belum diuji secara menyeluruh (penetration test, load test). **Jangan menyatakan sistem aman/siap produksi sebelum itu.**

## Privasi statistik

`shared/privacy.ts` menyediakan `suppressSmallCells()` — kelompok dengan jumlah di bawah ambang (default 10, menunggu keputusan pemilik) disembunyikan, plus *complementary suppression* agar nilai tersembunyi tidak bisa dihitung dari total. Dipakai oleh modul statistik Phase 3.

## Rencana fase

| Fase | Isi | Status |
| --- | --- | --- |
| 1 — Foundation & Public MVP | struktur proyek, design system, beranda, navigasi, profil, edukasi, direktori fasilitas (daftar + peta), bantuan, program, berita, halaman statistik (prinsip, tanpa angka), responsif | **PR ini** |
| 2 — Content Management | login admin, dashboard, CRUD artikel/fasilitas/hotline/program, workflow Draft→Review→Published, upload gambar (R2), audit log dasar | berikutnya |
| 3 — Data & Analytics | dataset kesehatan agregat, statistik publik dengan suppression, grafik, laporan berkala, ekspor agregat | |
| 4 — Advanced Internal | manajemen kasus, permission rinci, akses Satgas, riwayat perubahan, integrasi | |

## Risiko & keputusan terbuka

1. **Metode login admin (Phase 2).** Rekomendasi: Cloudflare Access (Zero Trust, gratis hingga 50 pengguna) di depan `/admin` + verifikasi JWT Access di Worker, lalu peran disimpan di D1. Alternatif: email + password dengan sesi di D1 (lebih banyak kode keamanan yang harus dirawat).
2. **Ambang minimum statistik** — default 10; perlu disetujui.
3. **Data kesehatan individu & manajemen kasus** — tidak dibangun sampai ada kebijakan persetujuan, dasar pengelolaan, retensi, kontrol akses, dan prosedur insiden.
4. **Tile peta** — OpenStreetMap publik memiliki kebijakan penggunaan wajar; untuk trafik besar pertimbangkan penyedia tile berbayar/gratis lain.
5. **Penyimpanan gambar** — Phase 2 butuh Cloudflare R2 untuk unggahan foto fasilitas/artikel.
6. **i18n** — struktur kamus sudah ada (`src/i18n`); teks halaman masih banyak yang langsung di komponen. Sebelum menambah bahasa Arab (RTL), pindahkan teks halaman ke kamus.
