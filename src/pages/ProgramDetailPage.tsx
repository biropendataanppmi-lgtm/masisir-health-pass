import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Link, useParams } from "react-router";
import type { ProgramDetail } from "../../shared/types";
import { Badge, SampleBadge } from "../components/ui/Badge";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Markdown } from "../components/ui/Markdown";
import { ErrorState, LoadingBlock } from "../components/ui/States";
import { useApi } from "../lib/api";
import { formatDate, formatDateRange, programStatusLabel } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { NotFoundPage } from "./NotFoundPage";

export function ProgramDetailPage() {
  const { slug = "" } = useParams();
  const res = useApi<ProgramDetail>(`/programs/${encodeURIComponent(slug)}`);
  useDocumentTitle(res.status === "success" ? res.data.title : undefined);
  if (res.status === "error" && res.error.status === 404) return <NotFoundPage />;

  return (
    <article className="section section--tight">
      <div className="container">
        {res.status === "loading" && <LoadingBlock />}
        {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
        {res.status === "success" && <Body p={res.data} />}
      </div>
    </article>
  );
}

function Body({ p }: { p: ProgramDetail }) {
  const canRegister = (p.programStatus === "upcoming" || p.programStatus === "ongoing") && (p.registrationUrl || p.registrationInfo);
  return (
    <>
      <header className="article-header">
        <Breadcrumb items={[{ label: "Beranda", to: "/" }, { label: "Program", to: "/program" }, { label: p.title }]} />
        <div className="badges">
          <Badge tone={p.programStatus === "ongoing" ? "green" : p.programStatus === "upcoming" ? "blue" : "neutral"}>
            {programStatusLabel[p.programStatus]}
          </Badge>
          {p.isSample && <SampleBadge />}
        </div>
        <h1>{p.title}</h1>
        {p.summary && <p style={{ fontSize: "var(--fs-md)", color: "var(--text-muted)" }}>{p.summary}</p>}
      </header>
      {p.coverImage && (
        <div className="article-cover">
          <img src={p.coverImage} alt="" />
        </div>
      )}
      <div className="detail" style={{ marginTop: p.coverImage ? 0 : "var(--s-6)" }}>
        <div>
          <Markdown source={p.body} />
          <p style={{ marginTop: "var(--s-7)" }}>
            <Link to="/program" className="link-arrow">
              <ArrowLeft size={16} aria-hidden="true" /> Kembali ke program
            </Link>
          </p>
        </div>
        <aside className="detail__aside">
          <div className="panel">
            <h2>Jadwal & lokasi</h2>
            <dl className="def-list">
              <div>
                <dt>
                  <CalendarDays size={12} aria-hidden="true" style={{ display: "inline" }} /> Jadwal
                </dt>
                <dd>{formatDateRange(p.startDate, p.endDate)}</dd>
              </div>
              <div>
                <dt>
                  <MapPin size={12} aria-hidden="true" style={{ display: "inline" }} /> Lokasi
                </dt>
                <dd>{p.location ?? <span className="missing">Menyusul</span>}</dd>
              </div>
              <div>
                <dt>Terakhir diperbarui</dt>
                <dd>{formatDate(p.updatedAt)}</dd>
              </div>
            </dl>
          </div>
          {canRegister && (
            <div className="panel">
              <h2>Pendaftaran</h2>
              {p.registrationInfo && <p className="card__text">{p.registrationInfo}</p>}
              {p.registrationUrl && /^https?:\/\//.test(p.registrationUrl) && (
                <a className="btn btn--block" href={p.registrationUrl} target="_blank" rel="noopener noreferrer">
                  Daftar <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
