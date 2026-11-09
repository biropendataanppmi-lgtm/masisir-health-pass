import { ArrowLeft, Building, ExternalLink, Globe, MessageCircle, Navigation, Phone } from "lucide-react";
import { Link, useParams } from "react-router";
import type { FacilityDetail } from "../../shared/types";
import { facilityIcon } from "../components/cards/FacilityCard";
import { SampleBadge, VerificationBadge } from "../components/ui/Badge";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ContentImage } from "../components/ui/Photo";
import { ErrorState, LoadingBlock } from "../components/ui/States";
import { useApi } from "../lib/api";
import { formatDate, mapsLink, telLink } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { NotFoundPage } from "./NotFoundPage";

const isHttp = (u: string | null): u is string => !!u && /^https?:\/\//i.test(u);

export function FacilityDetailPage() {
  const { slug = "" } = useParams();
  const res = useApi<FacilityDetail>(`/facilities/${encodeURIComponent(slug)}`);
  useDocumentTitle(res.status === "success" ? res.data.name : undefined);
  if (res.status === "error" && res.error.status === 404) return <NotFoundPage />;
  return (
    <section className="section section--tight">
      <div className="container">
        {res.status === "loading" && <LoadingBlock />}
        {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
        {res.status === "success" && <Detail f={res.data} />}
      </div>
    </section>
  );
}

function Missing({ children = "Belum tersedia" }: { children?: string }) {
  return <span className="missing">{children}</span>;
}

function Detail({ f }: { f: FacilityDetail }) {
  const Icon = facilityIcon[f.type.slug] ?? Building;
  const hasCoords = f.latitude != null && f.longitude != null;
  return (
    <>
      <header className="article-header" style={{ marginBottom: "var(--s-6)" }}>
        <Breadcrumb items={[{ label: "Beranda", to: "/" }, { label: "Fasilitas", to: "/fasilitas" }, { label: f.name }]} />
        <span className="facility-card__type">
          <Icon size={16} aria-hidden="true" /> {f.type.name}
          {f.region && ` · ${f.region.name}`}
        </span>
        <h1>{f.name}</h1>
        <div className="badges">
          <VerificationBadge status={f.verificationStatus} />
          {f.isSample && <SampleBadge />}
        </div>
      </header>

      <div className="detail">
        <div className="stack" style={{ gap: "var(--s-5)" }}>
          <div className="article-cover" style={{ margin: 0, aspectRatio: "16 / 8" }}>
            <ContentImage src={f.photoUrl} alt={`Foto ${f.name}`} placeholder="Foto fasilitas belum tersedia" />
          </div>

          <div className="panel">
            <h2>Layanan tersedia</h2>
            {f.services.length ? (
              <div className="badges">
                {f.services.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="card__text">Daftar layanan belum tersedia.</p>
            )}
          </div>

          <div className="panel">
            <h2>Informasi akses & persyaratan pasien</h2>
            <p className="card__text">{f.accessNotes ?? "Belum ada informasi akses atau persyaratan pasien."}</p>
          </div>

          {f.notes && (
            <div className="panel">
              <h2>Catatan</h2>
              <p className="card__text">{f.notes}</p>
            </div>
          )}

          <p>
            <Link to="/fasilitas" className="link-arrow">
              <ArrowLeft size={16} aria-hidden="true" /> Kembali ke direktori
            </Link>
          </p>
        </div>

        <aside className="detail__aside" aria-label="Kontak dan lokasi">
          <div className="panel">
            <h2>Kontak & lokasi</h2>
            <dl className="def-list">
              <div>
                <dt>Alamat</dt>
                <dd>{f.address ?? <Missing />}</dd>
              </div>
              <div>
                <dt>Telepon</dt>
                <dd>{f.phone ? <a href={telLink(f.phone)}>{f.phone}</a> : <Missing />}</dd>
              </div>
              <div>
                <dt>Jam operasional</dt>
                <dd>{f.openingHours ?? <Missing>Belum terverifikasi</Missing>}</dd>
              </div>
              {isHttp(f.website) && (
                <div>
                  <dt>Website</dt>
                  <dd>
                    <a href={f.website} target="_blank" rel="noopener noreferrer">
                      {f.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <div className="stack" style={{ gap: "var(--s-2)" }}>
              {f.phone && (
                <a className="btn btn--block" href={telLink(f.phone)}>
                  <Phone size={16} aria-hidden="true" /> Telepon
                </a>
              )}
              {hasCoords && (
                <a className="btn btn--secondary btn--block" href={mapsLink(f.latitude!, f.longitude!)} target="_blank" rel="noopener noreferrer">
                  <Navigation size={16} aria-hidden="true" /> Petunjuk arah <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
              {isHttp(f.socialUrl) && (
                <a className="btn btn--ghost btn--block" href={f.socialUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} aria-hidden="true" /> Media sosial
                </a>
              )}
              {isHttp(f.website) && (
                <a className="btn btn--ghost btn--block" href={f.website} target="_blank" rel="noopener noreferrer">
                  <Globe size={16} aria-hidden="true" /> Website
                </a>
              )}
            </div>
          </div>
          <div className="panel">
            <h2>Verifikasi</h2>
            <dl className="def-list">
              <div>
                <dt>Status</dt>
                <dd>
                  <VerificationBadge status={f.verificationStatus} />
                </dd>
              </div>
              <div>
                <dt>Terakhir diverifikasi</dt>
                <dd>{f.lastVerifiedAt ? formatDate(f.lastVerifiedAt) : <Missing>Belum pernah</Missing>}</dd>
              </div>
            </dl>
            <p className="card__text">Menemukan informasi yang keliru? Sampaikan kepada Menkes PPMI Mesir melalui halaman Bantuan.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
