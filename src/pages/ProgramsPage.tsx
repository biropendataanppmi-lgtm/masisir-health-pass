import { CalendarDays } from "lucide-react";
import { useSearchParams } from "react-router";
import type { ProgramStatus, ProgramSummary } from "../../shared/types";
import { ProgramCard } from "../components/cards/ProgramCard";
import { PageHero } from "../components/ui/PageHero";
import { EmptyState, ErrorState, LoadingCards } from "../components/ui/States";
import { qs, useApi } from "../lib/api";
import { programStatusLabel } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const STATUSES: ProgramStatus[] = ["ongoing", "upcoming", "completed"];

export function ProgramsPage() {
  useDocumentTitle("Program Kesehatan");
  const [params, setParams] = useSearchParams();
  const raw = params.get("status");
  const status = STATUSES.includes(raw as ProgramStatus) ? (raw as ProgramStatus) : undefined;
  const res = useApi<ProgramSummary[]>(`/programs${qs({ status })}`);

  return (
    <>
      <PageHero
        eyebrow="Program kesehatan"
        title="Program & kegiatan"
        lead="Program dan kegiatan kesehatan untuk Masisir: jadwal, lokasi, informasi pendaftaran, dan riwayat kegiatan."
        photo="nursing-training"
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Program Kesehatan" }]}
      />
      <section className="section section--tight">
        <div className="container">
          <div className="list-toolbar">
            <div className="chips" role="group" aria-label="Filter status program">
              <button type="button" className="chip" aria-pressed={!status} onClick={() => setParams({}, { replace: true })}>
                Semua
              </button>
              {STATUSES.map((s) => (
                <button key={s} type="button" className="chip" aria-pressed={status === s} onClick={() => setParams({ status: s }, { replace: true })}>
                  {programStatusLabel[s]}
                </button>
              ))}
            </div>
          </div>
          {res.status === "loading" && <LoadingCards />}
          {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
          {res.status === "success" &&
            (res.data.length ? (
              <div className="grid grid--3">
                {res.data.map((p) => (
                  <ProgramCard key={p.slug} program={p} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarDays} title={status ? "Tidak ada program dengan status ini" : "Belum ada program yang diterbitkan"}>
                Program kesehatan akan tampil setelah diterbitkan oleh Menkes PPMI Mesir.
              </EmptyState>
            ))}
        </div>
      </section>
    </>
  );
}
