# Yang dibutuhkan dari Menkes PPMI Mesir

Platform sengaja **tidak** mengarang data. Semua bagian di bawah tampil sebagai placeholder berlabel atau empty state sampai data resmi diberikan.

## Data & konten

- [ ] **Logo resmi** (SVG/PNG resolusi tinggi) — lihat `docs/ASSETS.md`.
- [ ] **Nomor darurat Mesir yang sudah diverifikasi** (ambulans, polisi, pemadam, dll.) beserta tanggal verifikasi.
- [ ] **Kontak Menkes PPMI Mesir** dan **kontak Satgas Kesehatan** (nama peran, nomor/WhatsApp, kegunaan). Sebutkan apakah boleh ditampilkan publik.
- [ ] **Kontak KBRI Kairo** untuk urusan kesehatan, bila relevan.
- [ ] **Daftar wilayah** yang dipakai Masisir (untuk filter direktori).
- [ ] **Data fasilitas kesehatan terverifikasi**: nama, jenis, alamat, koordinat, telepon, website/medsos, jam operasional (bila terverifikasi), layanan, persyaratan pasien, foto.
- [ ] **Visi & misi** resmi.
- [ ] **Email, akun media sosial, alamat sekretariat** Menkes PPMI Mesir (footer & halaman Profil).
- [ ] **Artikel edukasi pertama** beserta sumber dan nama peninjau (sebaiknya tenaga kesehatan).
- [ ] Peninjauan teks **panduan darurat** di halaman Bantuan oleh tenaga kesehatan.

Sebelum data resmi masuk, data CONTOH di `seed/dev-sample.sql` hanya untuk pengembangan lokal dan otomatis disaring di produksi.

## Keputusan

1. **Metode login admin** untuk Phase 2 — rekomendasi Cloudflare Access + peran di database (lihat `ARCHITECTURE.md`).
2. **Ambang minimum statistik** — usulan: kelompok < 10 data disembunyikan.
3. **Siapa saja pengelola awal** dan perannya (Super Admin, Menkes Admin, Data Manager, Satgas).
4. **Domain** yang akan dipakai dan akun Cloudflare pemiliknya (sebaiknya akun organisasi, bukan pribadi, agar dapat diwariskan).
5. **Kebijakan data kesehatan** (persetujuan, retensi, akses, insiden) sebelum Phase 3/4 menyimpan data apa pun yang berasal dari individu.
