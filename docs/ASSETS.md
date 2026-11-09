# Audit Aset

## Aset yang diterima

Lima foto dari Pexels, dilampirkan oleh pemilik proyek. Lisensi Pexels: bebas dipakai, atribusi tidak wajib (dicantumkan di sini sebagai catatan). Asli disimpan tanpa perubahan di `assets/originals/`; turunan web (WebP 640/1280/1920 + JPEG 1280) dibuat oleh `scripts/optimize_images.py` ke `public/images/`.

| Asli | Nama di app | Ukuran asli | Isi | Dipakai di |
| --- | --- | --- | --- | --- |
| pexels-sahilcaptures-35645519.jpg | `nursing-training` | 3936×2624 (landscape) | pelatihan tenaga kesehatan berseragam scrub | Hero beranda, Profil (latar belakang), header Program, sampul contoh berita/program |
| pexels-stephentcandrews-9408869.jpg | `patient-monitor` | 3280×4928 (portrait) | monitor tanda vital pasien | Teaser statistik beranda, header Bantuan, header Statistik |
| pexels-tara-winstead-7722912.jpg | `anatomy-models-wide` | 6720×4480 (landscape) | model anatomi di latar hijau | Header Edukasi, sampul contoh artikel |
| pexels-tara-winstead-7722916.jpg | `anatomy-models-tall` | 3611×5417 (portrait) | model anatomi (rangka, otak) | Sampul contoh artikel pertolongan pertama |
| pexels-tima-miroshnichenko-5407237.jpg | `stethoscope-notebook` | 2624×3936 (portrait) | stetoskop, buku catatan, obat | Header Fasilitas, header Berita, sampul contoh pengumuman |

Total asli 9 MB → turunan web 2.2 MB untuk semua ukuran (browser hanya mengunduh satu ukuran per gambar).

Catatan: foto `nursing-training` menampilkan wajah model stok Pexels (bukan pasien Masisir). Foto `patient-monitor` memperlihatkan merek perangkat; tidak masalah untuk dekorasi tetapi dapat diganti bila diinginkan.

## Aset yang belum tersedia

| Aset | Status sementara | Cara mengganti |
| --- | --- | --- |
| **Logo resmi** Masisir Health Pass / Menkes PPMI Mesir | Tanda sementara sederhana (kartu + tanda plus) di `src/components/BrandMark.tsx` dan `public/favicon.svg` | Kirim logo (SVG lebih baik). Ganti isi `BrandMark.tsx` dengan `<img src="/images/logo.svg">` dan perbarui favicon. |
| Foto fasilitas kesehatan | Placeholder "Foto fasilitas belum tersedia" | Diunggah lewat dashboard (Phase 2) ke kolom `facilities.photo_url` |
| Foto kegiatan/program Masisir | Memakai foto stok; program tanpa foto menampilkan placeholder | Diunggah lewat dashboard (Phase 2) |
| Ilustrasi medis / infografis | Belum ada | Dapat ditambahkan ke `public/images/` atau sebagai sampul artikel |

Tidak ada gambar yang diambil dari internet selain lampiran pemilik.
