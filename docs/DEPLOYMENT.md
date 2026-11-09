# Deploy ke Cloudflare

Belum pernah di-deploy. Langkah berikut untuk pertama kali (butuh akun Cloudflare organisasi):

```bash
npx wrangler login
npx wrangler d1 create masisir-health-pass-prod
# salin database_id ke env.production.d1_databases di wrangler.jsonc
npx wrangler d1 migrations apply masisir-health-pass-prod --remote --env production
npm run build
npx wrangler deploy --env production
```

- **Jangan** menjalankan `seed/dev-sample.sql` di produksi. (Bila terjadi, baris contoh tetap disaring oleh Worker karena `APP_ENV=production`.)
- Environment `development` (default) dan `production` dipisah di `wrangler.jsonc`, masing-masing dengan database sendiri.
- Secret (Phase 2, mis. konfigurasi Cloudflare Access) diset dengan `wrangler secret put NAMA --env production`, tidak pernah di repo.
- Backup: D1 Time Travel menyediakan pemulihan titik waktu (30 hari pada paket berbayar, 7 hari gratis). Untuk arsip tambahan: `wrangler d1 export masisir-health-pass-prod --remote --output backup.sql` secara berkala.
