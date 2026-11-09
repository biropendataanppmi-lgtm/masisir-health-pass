import { CalendarDays } from "lucide-react";
import { Link } from "react-router";
import type { ArticleSummary } from "../../../shared/types";
import { formatDate } from "../../lib/format";
import { Badge, SampleBadge } from "../ui/Badge";
import { ContentImage } from "../ui/Photo";

const kindLabel: Record<ArticleSummary["kind"], string> = {
  education: "Edukasi",
  news: "Berita",
  announcement: "Pengumuman",
  advisory: "Imbauan",
  agenda: "Agenda",
};

export function articleHref(a: Pick<ArticleSummary, "kind" | "slug">) {
  return a.kind === "education" ? `/edukasi/${a.slug}` : `/berita/${a.slug}`;
}

export function ArticleCard({ article, headingLevel = 3 }: { article: ArticleSummary; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="card card--link">
      <div className="card__media">
        <ContentImage src={article.coverImage} alt="" placeholder="Gambar belum tersedia" />
      </div>
      <div className="card__body">
        <div className="badges">
          <Badge tone="blue">{article.category?.name ?? kindLabel[article.kind]}</Badge>
          {article.isSample && <SampleBadge />}
        </div>
        <H className="card__title">
          <Link to={articleHref(article)}>{article.title}</Link>
        </H>
        {article.summary && <p className="card__text">{article.summary}</p>}
        {article.publishedAt && (
          <div className="card__meta">
            <span>
              <CalendarDays aria-hidden="true" /> {formatDate(article.publishedAt)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
