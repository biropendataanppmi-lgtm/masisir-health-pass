# Design System

Pendekatan: **Hybrid Healthcare Platform** — tenang dan tepercaya seperti situs institusi kesehatan, ringkas seperti aplikasi kesehatan digital, mobile-first.

Semua token ada di `src/styles/tokens.css`. Jangan menulis warna heksadesimal langsung di komponen.

## Warna

| Token | Nilai | Peran |
| --- | --- | --- |
| `--c-deep-teal` | `#123F46` | warna utama: heading, tombol utama, section gelap |
| `--c-medical-blue` | `#347F91` | sekunder: ikon, aksen, fokus |
| `--c-soft-green` | `#79B99A` | aksen: eyebrow di latar gelap, dekorasi |
| `--c-pale-mint` | `#E9F3EF` | latar section alternatif, badge |
| `--c-off-white` | `#F7F9F8` | latar halaman |
| `--c-charcoal` | `#263B3A` | teks isi |

Turunan untuk teks kecil agar lolos WCAG AA: `--c-medical-blue-700 #2A6B7A`, `--c-soft-green-700 #356F53`, `--c-muted #566B69`.

Rasio kontras terukur (AA = 4.5:1):

| Teks / latar | Rasio |
| --- | --- |
| Charcoal / Off White | 11.2 |
| Deep Teal / Off White | 10.9 |
| Putih / Deep Teal | 11.5 |
| Muted / Off White | 5.4 |
| Medical Blue 700 / Off White | 5.7 |
| Soft Green 700 / Pale Mint | 5.2 |
| Soft Green / Deep Teal | 5.1 |
| Medical Blue / Putih | 4.6 |

Soft Green (`#79B99A`) di atas putih hanya 2.3:1 — **jangan dipakai untuk teks di latar terang**.

## Tipografi

Plus Jakarta Sans (400–800), self-hosted. Skala fluid: `--fs-3xl` (hero) → `--fs-xs` (metadata). Heading `letter-spacing: -0.02em`, isi `line-height 1.65`, artikel `1.75` dengan lebar maks 70ch.

## Komponen (src/components)

| Komponen | Berkas |
| --- | --- |
| Header, navigasi, menu mobile, bottom nav, footer, bar darurat | `layout/PublicLayout.tsx` |
| Button (`.btn`, `--secondary`, `--ghost`, `--danger`, `--light`, `--sm`, `--icon`) | CSS `components.css` |
| Badge, SampleBadge, VerificationBadge | `ui/Badge.tsx` |
| Card artikel / fasilitas / program / kontak | `cards/*` |
| Search (debounce), Select filter, Chips, Tabs (keyboard), Pagination | `ui/*` |
| Modal (focus trap, Esc, bottom sheet di mobile) | `ui/Modal.tsx` |
| Toast | `ui/Toast.tsx` |
| Empty / error / loading (skeleton) states | `ui/States.tsx` |
| Breadcrumb, PageHero (polos / foto) | `ui/*` |
| Markdown aman | `ui/Markdown.tsx` |
| Foto proyek responsif (WebP + JPEG) | `ui/Photo.tsx` |

## Pola penting

- **Data contoh** selalu diberi badge bergaris kuning "Data contoh".
- **Status verifikasi** fasilitas selalu terlihat (Terverifikasi / Belum diverifikasi / Perlu pembaruan).
- **Placeholder konten** pemilik ditandai `.placeholder-text` (latar kuning) agar mudah ditemukan dan diganti.
- **Darurat** dapat dijangkau dari setiap halaman: bar atas, tombol di header, tab "Bantuan" di bottom nav, dialog kontak darurat.
- Target sentuh minimal 44px; fokus keyboard terlihat; `prefers-reduced-motion` dihormati.
