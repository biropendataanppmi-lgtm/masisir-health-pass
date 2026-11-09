import { ArrowLeft, CalendarDays, ShieldCheck, UserRound } from "lucide-react";
import { Link, useParams } from "react-router";
import type { ArticleDetail } from "../../shared/types";
import { Badge, SampleBadge } from "../components/ui/Badge";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Markdown } from "../components/ui/Markdown";
import { ErrorState, LoadingBlock } from "../components/ui/States";
import { useApi } from "../lib/api";
import { formatDate } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { NotFoundPage } from "./NotFoundPage";

export function ArticleDetailPage({ section }: { section: "education" | "news" }) {
  const { slug = "" } = useParams();
  const res = useApi<ArticleDetail>(`/articles/${encodeURIComponent(slug)}`);
  const base = section === "education" ? { label: "Edukasi", to: "/edukasi" } : { label: "Berita", to: "/berita" };
  useDocumentTitle(res.status === "success" ? res.data.title : undefined);

  if (res.status === "error" && res.error.status === 404) return <NotFoundPage />;
  // An education slug opened under /berita (or vice versa) is treated as not found.
  if (res.status === "success" && (res.data.kind === "education") !== (section === "education")) return <NotFoundPage />;

  return (
    <article className="section section--tight">
      <div className="container">
        {res.status === "loading" && <LoadingBlock />}
        {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
        {res.status === "success" && <ArticleBody a={res.data} base={base} />}
      </div>
    </article>
  );
}

function ArticleBody({ a, base }: { a: ArticleDetail; base: { label: string; to: string } }) {
  return (
    <>
      <header className="article-header">
        <Breadcrumb items={[{ label: "Beranda", to: "/" }, base, { label: a.title }]} />
        <div className="badges">
          {a.category && <Badge tone="blue">{a.category.name}</Badge>}
          {a.isSample && <SampleBadge />}
        </div>
        <h1>{a.title}</h1>
        {a.summary && <p className="lead" style={{ fontSize: "var(--fs-md)", color: "var(--text-muted)" }}>{a.summary}</p>}
        <div className="card__meta">
          {a.publishedAt && (
            <span>
              <CalendarDays aria-hidden="true" /> Terbit {formatDate(a.publishedAt)}
            </span>
          )}
          {a.authorName && (
            <span>
              <UserRound aria-hidden="true" /> {a.authorName}
            </span>
          )}
        </div>
      </header>

      {a.coverImage && (
        <div className="article-cover">
          <img src={a.coverImage} alt="" />
        </div>
      )}

      <div className="detail" style={{ marginTop: a.coverImage ? 0 : "var(--s-6)" }}>
        <div>
          {a.isSample && (
            <div className="notice notice--warning" style={{ marginBottom: "var(--s-5)" }}>
              <ShieldCheck size={20} aria-hidden="true" />
              <p>
                <strong>Ini konten contoh untuk pengembangan.</strong>
                Jangan dijadikan rujukan kesehatan. Konten resmi akan ditinjau dan diterbitkan oleh Menkes PPMI Mesir.
              </p>
            </div>
          )}
          <Markdown source={a.body} />
          <p style={{ marginTop: "var(--s-7)" }}>
            <Link to={base.to} className="link-arrow">
              <ArrowLeft size={16} aria-hidden="true" /> Kembali ke {base.label}
            </Link>
          </p>
        </div>
        <aside className="detail__aside" aria-label="Informasi artikel">
          <div className="panel">
            <h2>Status tinjauan</h2>
            <dl className="def-list">
              <div>
                <dt>Peninjau</dt>
                <dd>{a.reviewedBy ?? <span className="missing">Belum ada peninjau tercatat</span>}</dd>
              </div>
              {a.reviewedAt && (
                <div>
                  <dt>Tanggal tinjauan</dt>
                  <dd>{formatDate(a.reviewedAt)}</dd>
                </div>
              )}
              <div>
                <dt>Terakhir diperbarui</dt>
                <dd>{formatDate(a.updatedAt)}</dd>
              </div>
            </dl>
          </div>
          <div className="panel">
            <h2>Sumber</h2>
            {a.sources.length ? (
              <ul className="source-list">
                {a.sources.map((s, i) => (
                  <li key={i}>
                    {s.url && /^https?:\/\//.test(s.url) ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card__text">Sumber belum dicantumkan.</p>
            )}
          </div>
          <div className="notice">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>Informasi ini bersifat edukatif dan tidak menggantikan pemeriksaan atau saran langsung dari tenaga kesehatan.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
