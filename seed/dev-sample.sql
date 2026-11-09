-- DEVELOPMENT SAMPLE DATA — DO NOT APPLY TO PRODUCTION.
--
-- Every row here is marked is_sample = 1 and every name starts with "[CONTOH]".
-- None of it is real: no real facility, phone number, statistic or patient.
-- The production Worker filters is_sample rows out regardless.
-- Purpose: let developers and reviewers see layouts, search, filters and
-- detail pages working before Menkes PPMI Mesir supplies verified data.

INSERT INTO regions (slug, name, sort_order) VALUES
  ('wilayah-contoh-1', '[CONTOH] Wilayah 1', 1),
  ('wilayah-contoh-2', '[CONTOH] Wilayah 2', 2),
  ('wilayah-contoh-3', '[CONTOH] Wilayah 3', 3);

INSERT INTO facilities (slug, name, type_id, region_id, address, latitude, longitude, phone, website,
  opening_hours, hours_verified, services, access_notes, notes, verification_status,
  is_active, is_featured, is_sample, photo_url) VALUES
  ('contoh-rumah-sakit-a', '[CONTOH] Rumah Sakit A',
    (SELECT id FROM facility_types WHERE slug = 'rumah-sakit'),
    (SELECT id FROM regions WHERE slug = 'wilayah-contoh-1'),
    '[Alamat diisi oleh pengelola]', 30.0600, 31.3300, NULL, NULL,
    NULL, 0, '["[Layanan contoh 1]","[Layanan contoh 2]"]',
    '[Informasi akses/persyaratan pasien diisi oleh pengelola]',
    'Entri contoh untuk pengembangan. Bukan fasilitas nyata.', 'unverified', 1, 1, 1, NULL),
  ('contoh-klinik-b', '[CONTOH] Klinik B',
    (SELECT id FROM facility_types WHERE slug = 'klinik'),
    (SELECT id FROM regions WHERE slug = 'wilayah-contoh-2'),
    '[Alamat diisi oleh pengelola]', 30.0450, 31.2600, NULL, NULL,
    '[Jam operasional contoh]', 1, '["[Layanan contoh]"]', NULL,
    'Entri contoh untuk pengembangan. Bukan fasilitas nyata.', 'verified', 1, 1, 1, NULL),
  ('contoh-apotek-c', '[CONTOH] Apotek C',
    (SELECT id FROM facility_types WHERE slug = 'apotek'),
    (SELECT id FROM regions WHERE slug = 'wilayah-contoh-1'),
    '[Alamat diisi oleh pengelola]', 30.0700, 31.3450, NULL, NULL,
    NULL, 0, '[]', NULL,
    'Entri contoh untuk pengembangan. Bukan fasilitas nyata.', 'needs_update', 1, 1, 1, NULL),
  ('contoh-laboratorium-d', '[CONTOH] Laboratorium D',
    (SELECT id FROM facility_types WHERE slug = 'laboratorium'),
    (SELECT id FROM regions WHERE slug = 'wilayah-contoh-3'),
    '[Alamat diisi oleh pengelola]', NULL, NULL, NULL, NULL,
    NULL, 0, '[]', NULL,
    'Entri contoh tanpa koordinat — untuk menguji tampilan peta.', 'unverified', 1, 0, 1, NULL),
  ('contoh-klinik-nonaktif', '[CONTOH] Klinik Nonaktif',
    (SELECT id FROM facility_types WHERE slug = 'klinik'),
    (SELECT id FROM regions WHERE slug = 'wilayah-contoh-2'),
    NULL, NULL, NULL, NULL, NULL, NULL, 0, '[]', NULL,
    'Nonaktif: tidak boleh tampil di portal publik.', 'unverified', 0, 0, 1, NULL);

INSERT INTO hotline_contacts (name, category, phone, whatsapp, usage_note, priority, is_active, is_sample) VALUES
  ('[CONTOH] Nomor darurat Mesir', 'emergency', NULL, NULL,
    'Nomor darurat resmi Mesir akan ditampilkan setelah diverifikasi oleh Menkes PPMI Mesir.', 1, 1, 1),
  ('[CONTOH] Kontak Menkes PPMI Mesir', 'menkes', NULL, NULL,
    'Konsultasi arah bantuan kesehatan dan informasi fasilitas.', 10, 1, 1),
  ('[CONTOH] Kontak Satgas Kesehatan', 'satgas', NULL, NULL,
    'Pendampingan di wilayah/kekeluargaan masing-masing.', 20, 1, 1),
  ('[CONTOH] Kontak nonaktif', 'other', NULL, NULL,
    'Tidak boleh tampil di portal publik.', 99, 0, 1);

INSERT INTO articles (slug, kind, category_id, title, summary, body, cover_image, status, published_at,
  author_name, reviewed_by, sources, is_sample) VALUES
  ('contoh-struktur-artikel-edukasi', 'education',
    (SELECT id FROM article_categories WHERE slug = 'kesehatan-umum'),
    '[CONTOH] Struktur artikel edukasi kesehatan',
    'Artikel contoh untuk memperlihatkan format halaman edukasi. Isi medis akan ditulis dan ditinjau oleh Menkes PPMI Mesir.',
    '## Tentang artikel contoh ini

Artikel ini **bukan rujukan medis**. Artikel ini dibuat agar tampilan halaman edukasi dapat diuji sebelum konten resmi tersedia.

## Format yang didukung

- Subjudul
- Daftar berbutir dan bernomor
- Teks **tebal**
- Tautan ke [sumber terpercaya](https://www.who.int)

## Yang harus ada pada artikel resmi

1. Sumber rujukan yang jelas.
2. Tanggal publikasi.
3. Nama peninjau, jika sudah ditinjau.',
    '/images/anatomy-models-wide-1280.webp', 'published', '2026-11-01T08:00:00Z',
    'Tim Pengembang', NULL, '[{"title":"[Sumber akan dilengkapi oleh peninjau]"}]', 1),
  ('contoh-pertolongan-pertama', 'education',
    (SELECT id FROM article_categories WHERE slug = 'pertolongan-pertama'),
    '[CONTOH] Panduan pertolongan pertama',
    'Tempat untuk panduan pertolongan pertama yang telah ditinjau tenaga kesehatan.',
    'Konten panduan pertolongan pertama akan diisi oleh Menkes PPMI Mesir bersama tenaga kesehatan yang berwenang.

Dalam keadaan darurat, segera hubungi layanan darurat setempat.',
    '/images/anatomy-models-tall-1280.webp', 'published', '2026-10-25T08:00:00Z',
    'Tim Pengembang', NULL, '[]', 1),
  ('contoh-kesehatan-mental', 'education',
    (SELECT id FROM article_categories WHERE slug = 'kesehatan-mental'),
    '[CONTOH] Menjaga kesehatan mental selama kuliah di Mesir',
    'Contoh kartu artikel kategori Kesehatan Mental.',
    'Konten akan diisi dan ditinjau oleh Menkes PPMI Mesir.',
    NULL, 'published', '2026-10-20T08:00:00Z',
    'Tim Pengembang', NULL, '[]', 1),
  ('contoh-draft-tidak-tampil', 'education',
    (SELECT id FROM article_categories WHERE slug = 'gizi-dan-nutrisi'),
    '[CONTOH] Draft — tidak boleh tampil',
    'Draft tidak boleh tampil di portal publik.', 'Draft.', NULL, 'draft', NULL,
    'Tim Pengembang', NULL, '[]', 1),
  ('contoh-pengumuman-menkes', 'announcement', NULL,
    '[CONTOH] Pengumuman Menkes PPMI Mesir',
    'Contoh format pengumuman resmi.',
    'Isi pengumuman resmi akan diterbitkan oleh Menkes PPMI Mesir melalui dashboard (Phase 2).',
    '/images/stethoscope-notebook-1280.webp', 'published', '2026-11-05T08:00:00Z',
    'Menkes PPMI Mesir', NULL, '[]', 1),
  ('contoh-berita-kegiatan', 'news', NULL,
    '[CONTOH] Berita kegiatan kesehatan',
    'Contoh format berita kegiatan.',
    'Isi berita akan diterbitkan oleh Menkes PPMI Mesir.',
    '/images/nursing-training-1280.webp', 'published', '2026-11-03T08:00:00Z',
    'Menkes PPMI Mesir', NULL, '[]', 1);

INSERT INTO programs (slug, title, summary, body, program_status, start_date, end_date, location,
  registration_info, cover_image, status, is_sample) VALUES
  ('contoh-program-berjalan', '[CONTOH] Program kesehatan berjalan',
    'Contoh kartu program dengan status berjalan.',
    'Detail program akan diisi oleh Menkes PPMI Mesir.',
    'ongoing', '2026-11-01', '2026-12-15', '[Lokasi diisi oleh pengelola]',
    '[Informasi pendaftaran diisi oleh pengelola]', '/images/nursing-training-1280.webp', 'published', 1),
  ('contoh-program-mendatang', '[CONTOH] Program kesehatan mendatang',
    'Contoh kartu program dengan status mendatang.',
    'Detail program akan diisi oleh Menkes PPMI Mesir.',
    'upcoming', '2027-01-10', NULL, '[Lokasi diisi oleh pengelola]', NULL, NULL, 'published', 1),
  ('contoh-program-selesai', '[CONTOH] Program kesehatan selesai',
    'Contoh riwayat program.',
    'Detail dan dokumentasi program akan diisi oleh Menkes PPMI Mesir.',
    'completed', '2026-09-01', '2026-09-30', '[Lokasi diisi oleh pengelola]', NULL, NULL, 'published', 1);
