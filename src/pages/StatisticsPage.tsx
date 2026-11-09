import { ChartColumn, EyeOff, Layers, Sigma } from "lucide-react";
import { PageHero } from "../components/ui/PageHero";
import { EmptyState } from "../components/ui/States";
import { MIN_PUBLIC_CELL_SIZE } from "../../shared/privacy";
import { useDocumentTitle } from "../lib/useDocumentTitle";

// Phase 3 builds the dataset module and charts. Until real, validated data
// exists this page states that honestly — no numbers are invented.

export function StatisticsPage() {
  useDocumentTitle("Statistik Kesehatan");
  return (
    <>
      <PageHero
        eyebrow="Statistik kesehatan"
        title="Gambaran kesehatan komunitas"
        lead="Visualisasi data kesehatan Masisir secara agregat: kategori keluhan, tren per periode, dan perkembangan program kesehatan."
        photo="patient-monitor"
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Statistik Kesehatan" }]}
      />
      <section className="section section--tight">
        <div className="container stack" style={{ gap: "var(--s-7)" }}>
          <EmptyState icon={ChartColumn} title="Statistik belum tersedia">
            Data kesehatan komunitas sedang disiapkan bersama kebijakan perlindungan datanya. Statistik akan terbit setelah data
            terkumpul, divalidasi, dan disetujui oleh Menkes PPMI Mesir.
          </EmptyState>

          <div>
            <div className="section-head">
              <div className="section-head__text">
                <span className="eyebrow">Prinsip publikasi data</span>
                <h2>Bagaimana privasi dijaga</h2>
              </div>
            </div>
            <div className="grid grid--3">
              <div className="value-card">
                <Sigma aria-hidden="true" />
                <h3>Hanya data agregat</h3>
                <p>Tidak ada nama, nomor kontak, atau identitas pasien yang ditampilkan.</p>
              </div>
              <div className="value-card">
                <EyeOff aria-hidden="true" />
                <h3>Batas minimum kelompok</h3>
                <p>
                  Kelompok dengan kurang dari {MIN_PUBLIC_CELL_SIZE} data disembunyikan agar tidak ada individu yang dapat dikenali.
                </p>
              </div>
              <div className="value-card">
                <Layers aria-hidden="true" />
                <h3>Filter terbatas</h3>
                <p>Kombinasi filter yang terlalu sempit tidak disediakan. Setiap grafik mencantumkan periode dan sumber data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
