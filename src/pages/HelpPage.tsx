import { ArrowRight, MapPin, Siren } from "lucide-react";
import { Link } from "react-router";
import type { Hotline } from "../../shared/types";
import { HotlineCard } from "../components/cards/HotlineCard";
import { PageHero } from "../components/ui/PageHero";
import { EmptyState, ErrorState, LoadingCards } from "../components/ui/States";
import { useApi } from "../lib/api";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const ORDER: Hotline["category"][] = ["emergency", "menkes", "satgas", "embassy", "other"];

export function HelpPage() {
  useDocumentTitle("Bantuan Kesehatan");
  const res = useApi<Hotline[]>("/hotlines");

  return (
    <>
      <PageHero
        eyebrow="Bantuan kesehatan"
        title="Ke mana mencari bantuan?"
        lead="Kontak darurat, kontak Menkes PPMI Mesir dan Satgas Kesehatan, serta panduan langkah demi langkah ketika Anda atau teman membutuhkan pertolongan."
        photo="patient-monitor"
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Bantuan Kesehatan" }]}
      />

      <section className="section section--tight">
        <div className="container stack" style={{ gap: "var(--s-6)" }}>
          <div className="notice notice--danger">
            <Siren size={22} aria-hidden="true" />
            <p>
              <strong>Kondisi mengancam nyawa? Hubungi layanan darurat Mesir sekarang.</strong>
              Masisir Health Pass adalah layanan informasi, bukan ambulans, rumah sakit, atau pusat tanggap darurat. Setelah
              pertolongan pertama didapat, kabari Menkes PPMI Mesir atau Satgas Kesehatan agar dapat didampingi.
            </p>
          </div>

          <div>
            <div className="section-head" style={{ marginBottom: "var(--s-4)" }}>
              <div className="section-head__text">
                <h2>Kontak penting</h2>
                <p>Hanya kontak yang aktif dan diterbitkan pengelola yang ditampilkan.</p>
              </div>
            </div>
            {res.status === "loading" && <LoadingCards count={3} media={false} />}
            {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
            {res.status === "success" &&
              (res.data.length === 0 ? (
                <EmptyState title="Kontak belum diterbitkan">
                  Kontak darurat dan kontak pengurus akan ditampilkan setelah diverifikasi oleh Menkes PPMI Mesir.
                </EmptyState>
              ) : (
                <div className="grid grid--3">
                  {[...res.data]
                    .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category))
                    .map((h) => (
                      <HotlineCard key={h.id} hotline={h} showCategory />
                    ))}
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="section section--mint">
        <div className="container grid grid--2" style={{ gap: "var(--s-7)" }}>
          <div className="stack">
            <span className="eyebrow">Panduan darurat</span>
            <h2>Saat menghadapi kondisi darurat</h2>
            <ol className="help-steps">
              <li>
                <div>
                  <strong>Pastikan keamanan</strong>
                  <p>Jauhkan diri dan korban dari bahaya. Jangan memindahkan korban yang mungkin cedera tulang belakang kecuali terpaksa.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Hubungi layanan darurat</strong>
                  <p>Sebutkan lokasi sejelas mungkin, kondisi korban, dan nomor yang dapat dihubungi kembali.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Minta bantuan orang terdekat</strong>
                  <p>Libatkan teman serumah, tetangga, atau pengurus kekeluargaan yang dapat berbahasa Arab bila perlu.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Kabari Menkes atau Satgas</strong>
                  <p>Setelah pertolongan didapat, informasikan agar pengurus dapat membantu pendampingan.</p>
                </div>
              </li>
            </ol>
            <p className="card__text">Panduan ini bersifat umum dan akan ditinjau oleh Menkes PPMI Mesir bersama tenaga kesehatan.</p>
          </div>

          <div className="stack">
            <span className="eyebrow">Alur meminta bantuan</span>
            <h2>Bukan darurat, tetapi butuh bantuan?</h2>
            <ol className="help-steps">
              <li>
                <div>
                  <strong>Cari fasilitas terdekat</strong>
                  <p>Gunakan direktori untuk menemukan klinik, apotek, atau rumah sakit sesuai kebutuhan dan wilayah Anda.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Hubungi fasilitas terlebih dahulu</strong>
                  <p>Pastikan jam buka, layanan, dan persyaratan pasien sebelum berangkat.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Hubungi Satgas wilayah Anda</strong>
                  <p>Satgas Kesehatan dapat membantu arah, pendampingan, atau menghubungkan Anda dengan Menkes.</p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Eskalasi ke Menkes PPMI Mesir</strong>
                  <p>Untuk kasus yang memerlukan koordinasi lebih lanjut.</p>
                </div>
              </li>
            </ol>
            <Link to="/fasilitas" className="btn" style={{ justifySelf: "start" }}>
              <MapPin size={18} aria-hidden="true" /> Buka direktori fasilitas <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
