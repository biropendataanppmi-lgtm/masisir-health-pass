import { ArrowRight, BookOpen, ChartColumn, LifeBuoy, Lock, MapPin, ShieldCheck, Siren } from "lucide-react";
import { Link } from "react-router";
import type { HomeData } from "../../shared/types";
import { ArticleCard } from "../components/cards/ArticleCard";
import { FacilityCard } from "../components/cards/FacilityCard";
import { ProgramCard } from "../components/cards/ProgramCard";
import { useOpenEmergency } from "../components/layout/PublicLayout";
import { Photo } from "../components/ui/Photo";
import { EmptyState, ErrorState, LoadingCards } from "../components/ui/States";
import { useApi } from "../lib/api";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle();
  const home = useApi<HomeData>("/home");
  const openEmergency = useOpenEmergency();

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">Platform Kesehatan Komunitas Masisir</span>
            <h1>
              Informasi kesehatan tepercaya, <em>dekat</em> dengan Masisir.
            </h1>
            <p className="hero__lead">
              Masisir Health Pass menghimpun edukasi kesehatan, direktori fasilitas, jalur bantuan, dan program kesehatan
              bagi masyarakat Indonesia di Mesir dalam satu tempat yang dikelola oleh Menkes PPMI Mesir.
            </p>
            <div className="hero__actions">
              <Link to="/fasilitas" className="btn">
                <MapPin size={18} aria-hidden="true" /> Cari fasilitas kesehatan
              </Link>
              <Link to="/bantuan" className="btn btn--secondary">
                <LifeBuoy size={18} aria-hidden="true" /> Butuh bantuan?
              </Link>
            </div>
            <div className="hero__trust">
              <span>
                <ShieldCheck aria-hidden="true" /> Diverifikasi Menkes sebelum terbit
              </span>
              <span>
                <Lock aria-hidden="true" /> Data pribadi tidak dipublikasikan
              </span>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__dots" aria-hidden="true" />
            <div className="hero__photo">
              <Photo
                name="nursing-training"
                alt="Tenaga kesehatan berseragam scrub mengikuti pelatihan pemeriksaan pasien"
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="hero__pass">
              <div className="hero__pass-top">
                <span>Health Pass</span>
                <Siren size={16} aria-hidden="true" />
              </div>
              <strong>Dalam kondisi darurat, jangan menunggu.</strong>
              <button type="button" className="btn btn--light btn--sm" onClick={openEmergency}>
                Lihat kontak darurat <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- quick access */}
      <section className="section section--tight" aria-labelledby="quick-title">
        <div className="container">
          <h2 id="quick-title" className="sr-only">
            Akses cepat
          </h2>
          <div className="quick-grid">
            <QuickTile to="/edukasi" icon={<BookOpen aria-hidden="true" />} title="Edukasi Kesehatan" text="Artikel, panduan pencegahan, dan pertolongan pertama." />
            <QuickTile to="/fasilitas" icon={<MapPin aria-hidden="true" />} title="Fasilitas Kesehatan" text="Rumah sakit, klinik, apotek, dan laboratorium." />
            <QuickTile to="/bantuan" icon={<LifeBuoy aria-hidden="true" />} title="Bantuan Kesehatan" text="Kontak Menkes, Satgas, dan panduan darurat." help />
            <QuickTile to="/statistik" icon={<ChartColumn aria-hidden="true" />} title="Statistik Kesehatan" text="Gambaran kesehatan komunitas secara agregat." />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- latest content */}
      <section className="section" aria-labelledby="latest-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Informasi terbaru</span>
              <h2 id="latest-title">Edukasi kesehatan</h2>
              <p>Bacaan singkat untuk menjaga kesehatan selama tinggal dan belajar di Mesir.</p>
            </div>
            <Link to="/edukasi" className="link-arrow">
              Semua artikel <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {home.status === "loading" && <LoadingCards />}
          {home.status === "error" && <ErrorState message={home.error.message} onRetry={home.reload} />}
          {home.status === "success" &&
            (home.data.latestArticles.length ? (
              <div className="grid grid--3">
                {home.data.latestArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <EmptyState icon={BookOpen} title="Belum ada artikel yang diterbitkan">
                Artikel edukasi akan tampil di sini setelah diterbitkan oleh Menkes PPMI Mesir.
              </EmptyState>
            ))}
        </div>
      </section>

      {/* ------------------------------------------------- statistics teaser */}
      <section className="section section--dark" aria-labelledby="stats-title">
        <div className="container stats-split">
          <div className="stack" style={{ gap: "var(--s-5)" }}>
            <div className="section-head__text">
              <span className="eyebrow">Statistik komunitas</span>
              <h2 id="stats-title">Data untuk keputusan yang lebih baik</h2>
              <p>
                Statistik kesehatan komunitas akan ditampilkan secara agregat, tanpa identitas individu. Modul ini sedang
                disiapkan bersama kebijakan perlindungan datanya.
              </p>
            </div>
            {home.status === "success" && (
              <div className="stat-strip">
                <div className="stat">
                  <span className="stat__value">{home.data.counts.articles}</span>
                  <span className="stat__label">Artikel edukasi terbit</span>
                </div>
                <div className="stat">
                  <span className="stat__value">{home.data.counts.facilities}</span>
                  <span className="stat__label">Fasilitas dalam direktori</span>
                </div>
                <div className="stat">
                  <span className="stat__value">{home.data.counts.programs}</span>
                  <span className="stat__label">Program aktif & mendatang</span>
                </div>
              </div>
            )}
            <Link to="/statistik" className="btn btn--light" style={{ justifySelf: "start" }}>
              Tentang statistik kesehatan <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="stats-photo">
            <Photo name="patient-monitor" alt="Monitor tanda vital pasien di ruang perawatan" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- programs */}
      <section className="section" aria-labelledby="programs-title">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Program kesehatan</span>
              <h2 id="programs-title">Program yang sedang berjalan</h2>
            </div>
            <Link to="/program" className="link-arrow">
              Semua program <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {home.status === "loading" && <LoadingCards />}
          {home.status === "success" &&
            (home.data.programs.length ? (
              <div className="grid grid--3">
                {home.data.programs.map((p) => (
                  <ProgramCard key={p.slug} program={p} />
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada program aktif">Program kesehatan yang sedang atau akan berjalan akan tampil di sini.</EmptyState>
            ))}
        </div>
      </section>

      {/* -------------------------------------------------------- facilities */}
      <section className="section section--mint" aria-labelledby="facilities-title">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Direktori</span>
              <h2 id="facilities-title">Fasilitas kesehatan pilihan</h2>
              <p>Informasi fasilitas dihimpun dan diverifikasi oleh pengelola. Selalu konfirmasi sebelum berkunjung.</p>
            </div>
            <Link to="/fasilitas" className="link-arrow">
              Buka direktori <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {home.status === "loading" && <LoadingCards media={false} />}
          {home.status === "success" &&
            (home.data.featuredFacilities.length ? (
              <div className="grid grid--3">
                {home.data.featuredFacilities.map((f) => (
                  <FacilityCard key={f.slug} facility={f} />
                ))}
              </div>
            ) : (
              <EmptyState icon={MapPin} title="Direktori sedang disusun">
                Data fasilitas kesehatan akan ditampilkan setelah diverifikasi oleh Menkes PPMI Mesir.
              </EmptyState>
            ))}
        </div>
      </section>

      {/* ---------------------------------------------------- news + workflow */}
      <section className="section" aria-labelledby="trust-title">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Bagaimana informasi diterbitkan</span>
              <h2 id="trust-title">Dari lapangan, diverifikasi, lalu terbit</h2>
              <p>Setiap informasi melalui alur yang sama sebelum tampil di Masisir Health Pass.</p>
            </div>
          </div>
          <div className="workflow">
            <div className="workflow__step">
              <h3>Satgas Kesehatan</h3>
              <p>Mengumpulkan informasi dan pembaruan dari wilayah serta kekeluargaan.</p>
            </div>
            <div className="workflow__step">
              <h3>Menkes PPMI Mesir</h3>
              <p>Memeriksa, memverifikasi, dan menyunting informasi sebelum diputuskan layak terbit.</p>
            </div>
            <div className="workflow__step">
              <h3>Masisir Health Pass</h3>
              <p>Informasi yang telah disetujui diterbitkan untuk seluruh Masisir.</p>
            </div>
          </div>
          {home.status === "success" && home.data.latestNews.length > 0 && (
            <div style={{ marginTop: "var(--s-8)" }}>
              <div className="section-head">
                <div className="section-head__text">
                  <span className="eyebrow">Berita & pengumuman</span>
                  <h2>Kabar terbaru</h2>
                </div>
                <Link to="/berita" className="link-arrow">
                  Semua berita <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid--3">
                {home.data.latestNews.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function QuickTile({ to, icon, title, text, help }: { to: string; icon: React.ReactNode; title: string; text: string; help?: boolean }) {
  return (
    <Link to={to} className={`quick-tile${help ? " quick-tile--help" : ""}`}>
      <span className="quick-tile__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="link-arrow">
        Buka <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
