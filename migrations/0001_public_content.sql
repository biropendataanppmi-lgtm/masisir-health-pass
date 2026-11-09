-- Migration 0001 — Phase 1: public content tables.
--
-- Design notes
-- * Every public-facing table has a status/visibility column; the public API
--   only ever returns rows that are published / active.
-- * `is_sample = 1` marks development sample rows (seed/dev-sample.sql). The
--   production Worker additionally filters these out, so sample data can never
--   appear on the live site even if it is seeded by mistake.
-- * No table in this migration stores personal or individual health data.
--   Auth (users, roles, permissions), case reports and health datasets are
--   added in later migrations once their policies are decided.
-- * Timestamps are ISO-8601 UTC strings (SQLite has no native datetime type).

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------- articles
CREATE TABLE article_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE articles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  -- education = Edukasi Kesehatan; the rest belong to Berita & Informasi.
  kind         TEXT    NOT NULL DEFAULT 'education'
               CHECK (kind IN ('education', 'news', 'announcement', 'advisory', 'agenda')),
  category_id  INTEGER REFERENCES article_categories(id) ON DELETE SET NULL,
  title        TEXT    NOT NULL,
  summary      TEXT    NOT NULL DEFAULT '',
  -- Limited Markdown (headings, lists, bold, links). Rendered without raw HTML.
  body         TEXT    NOT NULL DEFAULT '',
  cover_image  TEXT,
  status       TEXT    NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TEXT,
  author_name  TEXT,
  reviewed_by  TEXT,
  reviewed_at  TEXT,
  -- JSON array of {"title": string, "url"?: string}
  sources      TEXT    NOT NULL DEFAULT '[]',
  is_sample    INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  created_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_articles_public   ON articles (status, kind, published_at DESC);
CREATE INDEX idx_articles_category ON articles (category_id);

-- -------------------------------------------------------------- facilities
CREATE TABLE facility_types (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT    NOT NULL UNIQUE,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE regions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT    NOT NULL UNIQUE,
  name       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE facilities (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                TEXT    NOT NULL UNIQUE,
  name                TEXT    NOT NULL,
  type_id             INTEGER NOT NULL REFERENCES facility_types(id),
  region_id           INTEGER REFERENCES regions(id) ON DELETE SET NULL,
  address             TEXT,
  latitude            REAL CHECK (latitude  IS NULL OR latitude  BETWEEN -90  AND 90),
  longitude           REAL CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  phone               TEXT,
  website             TEXT,
  social_url          TEXT,
  -- Only shown publicly when hours_verified = 1.
  opening_hours       TEXT,
  hours_verified      INTEGER NOT NULL DEFAULT 0 CHECK (hours_verified IN (0, 1)),
  services            TEXT    NOT NULL DEFAULT '[]', -- JSON array of strings
  access_notes        TEXT,
  photo_url           TEXT,
  notes               TEXT,
  verification_status TEXT    NOT NULL DEFAULT 'unverified'
                      CHECK (verification_status IN ('unverified', 'verified', 'needs_update')),
  last_verified_at    TEXT,
  is_active           INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
  is_featured         INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  is_sample           INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  created_at          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at          TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_facilities_public ON facilities (is_active, type_id, region_id);

-- ---------------------------------------------------------------- hotlines
CREATE TABLE hotline_contacts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT    NOT NULL,
  category         TEXT    NOT NULL
                   CHECK (category IN ('emergency', 'menkes', 'satgas', 'embassy', 'other')),
  phone            TEXT,
  whatsapp         TEXT,
  usage_note       TEXT,      -- when to use this contact
  priority         INTEGER NOT NULL DEFAULT 100, -- lower = shown first
  is_active        INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
  last_verified_at TEXT,
  is_sample        INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_hotlines_public ON hotline_contacts (is_active, category, priority);

-- ---------------------------------------------------------------- programs
CREATE TABLE programs (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT    NOT NULL UNIQUE,
  title             TEXT    NOT NULL,
  summary           TEXT    NOT NULL DEFAULT '',
  body              TEXT    NOT NULL DEFAULT '',
  program_status    TEXT    NOT NULL DEFAULT 'upcoming'
                    CHECK (program_status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  start_date        TEXT,
  end_date          TEXT,
  location          TEXT,
  registration_url  TEXT,
  registration_info TEXT,
  cover_image       TEXT,
  status            TEXT    NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_sample         INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX idx_programs_public ON programs (status, program_status, start_date);

-- ----------------------------------------------------- reference data
-- Categories and facility types are structural (taken from the product brief),
-- not factual claims, so they are safe to seed in every environment.
INSERT INTO article_categories (slug, name, sort_order) VALUES
  ('kesehatan-umum',        'Kesehatan Umum',              1),
  ('penyakit-dan-gejala',   'Penyakit dan Gejala',          2),
  ('kesehatan-pencernaan',  'Kesehatan Pencernaan',         3),
  ('kesehatan-mental',      'Kesehatan Mental',             4),
  ('gizi-dan-nutrisi',      'Gizi dan Nutrisi',             5),
  ('kesehatan-lingkungan',  'Kesehatan Lingkungan',         6),
  ('pertolongan-pertama',   'Pertolongan Pertama',          7),
  ('info-kesehatan-mesir',  'Informasi Kesehatan di Mesir', 8);

INSERT INTO facility_types (slug, name, sort_order) VALUES
  ('rumah-sakit',   'Rumah Sakit',   1),
  ('klinik',        'Klinik',        2),
  ('dokter',        'Dokter Praktik',3),
  ('apotek',        'Apotek',        4),
  ('laboratorium',  'Laboratorium',  5),
  ('lainnya',       'Lainnya',       6);
