// Bahasa Indonesia — the primary language.
// Add `en.ts` / `ar.ts` with the same keys to support English and Arabic
// (Arabic will also need `dir="rtl"` on <html>; layout uses logical CSS where possible).
export const id = {
  "brand.name": "Masisir Health Pass",
  "brand.org": "Menkes PPMI Mesir",
  "brand.tagline": "Connecting Masisir to Better Health.",
  "nav.home": "Beranda",
  "nav.profile": "Profil",
  "nav.education": "Edukasi",
  "nav.facilities": "Fasilitas",
  "nav.help": "Bantuan",
  "nav.stats": "Statistik",
  "nav.programs": "Program",
  "nav.news": "Berita",
  "nav.menu": "Menu",
  "nav.openMenu": "Buka menu",
  "nav.closeMenu": "Tutup menu",
  "nav.skip": "Lewati ke konten utama",
  "emergency.bar": "Kondisi darurat medis? Hubungi layanan darurat setempat terlebih dahulu.",
  "emergency.barShort": "Darurat medis? Hubungi layanan darurat.",
  "emergency.cta": "Kontak darurat",
  "common.readMore": "Selengkapnya",
  "common.viewAll": "Lihat semua",
  "common.retry": "Coba lagi",
  "common.back": "Kembali",
  "common.search": "Cari",
  "common.clear": "Hapus pencarian",
  "common.all": "Semua",
  "common.sample": "Data contoh",
  "common.loading": "Memuat…",
  "common.close": "Tutup",
  "common.next": "Berikutnya",
  "common.prev": "Sebelumnya",
} as const;

export type MessageKey = keyof typeof id;
