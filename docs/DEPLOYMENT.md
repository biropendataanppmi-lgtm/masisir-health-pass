# Deploy ke Cloudflare

Worker produksi: `masisir-health-pass` (https://masisir-health-pass.biropendataanppmi.workers.dev), terhubung ke GitHub lewat **Cloudflare Workers Builds**. Setiap push/merge ke `main` membangun dan men-deploy otomatis.

## Pengaturan Workers Builds (sekali saja)

Di dashboard Cloudflare → Workers & Pages → `masisir-health-pass` → Settings → Build:

| Pengaturan | Nilai |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Root directory | `/` |

`npm run deploy` menjalankan `wrangler deploy` lalu `wrangler d1 migrations apply DB --remote`, sehingga skema database selalu ikut diperbarui. Jika deploy command dibiarkan `npx wrangler deploy`, situs tetap terbit tetapi API akan error karena tabel belum dibuat.

## Konfigurasi

- **Produksi** = konfigurasi tingkat atas di `wrangler.jsonc`: `APP_ENV=production`, database D1 `masisir-health-pass`. Tidak ada `database_id`: Wrangler mencari database berdasarkan nama atau membuatnya otomatis saat deploy pertama.
- **Pengembangan lokal** = `env.development` (`npm run dev` memakai `CLOUDFLARE_ENV=development`), database lokal `masisir-health-pass-dev` berisi data [CONTOH].
- **Jangan** menjalankan `seed/dev-sample.sql` ke database produksi. Bila terjadi, baris contoh tetap disaring oleh Worker karena `APP_ENV=production`.
- Secret (Phase 2, mis. konfigurasi Cloudflare Access) diset di dashboard (Settings → Variables and Secrets) atau `wrangler secret put NAMA`, tidak pernah di repo.

## Deploy manual (cadangan)

```bash
npx wrangler login
npm run build
npm run deploy
```

## Backup

D1 Time Travel menyediakan pemulihan titik waktu (7 hari pada paket gratis, 30 hari pada paket berbayar). Untuk arsip tambahan, ekspor berkala:

```bash
npx wrangler d1 export masisir-health-pass --remote --output backup-$(date +%F).sql
```
