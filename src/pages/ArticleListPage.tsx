import { BookOpen, Newspaper, SearchX } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { ArticleSummary, Category, Paginated } from "../../shared/types";
import { ArticleCard } from "../components/cards/ArticleCard";
import { PageHero } from "../components/ui/PageHero";
import { Pagination } from "../components/ui/Pagination";
import { SearchInput } from "../components/ui/SearchInput";
import { EmptyState, ErrorState, LoadingCards } from "../components/ui/States";
import { qs, useApi } from "../lib/api";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const PAGE_SIZE = 12;

const config = {
  education: {
    title: "Edukasi Kesehatan",
    eyebrow: "Pusat literasi kesehatan",
    lead: "Artikel, panduan pencegahan penyakit, pertolongan pertama, dan tips menjaga kesehatan selama tinggal di Mesir.",
    photo: "anatomy-models-wide" as const,
    searchLabel: "Cari artikel",
    emptyTitle: "Belum ada artikel yang diterbitkan",
    emptyText: "Artikel edukasi akan tampil setelah ditinjau dan diterbitkan oleh Menkes PPMI Mesir.",
    icon: BookOpen,
  },
  news: {
    title: "Berita & Informasi",
    eyebrow: "Kabar dari Menkes PPMI Mesir",
    lead: "Berita kesehatan, pengumuman resmi, imbauan, dan agenda kegiatan untuk Masisir.",
    photo: "stethoscope-notebook" as const,
    searchLabel: "Cari berita",
    emptyTitle: "Belum ada berita yang diterbitkan",
    emptyText: "Berita dan pengumuman akan tampil setelah diterbitkan oleh Menkes PPMI Mesir.",
    icon: Newspaper,
  },
};

export function ArticleListPage({ section }: { section: "education" | "news" }) {
  const c = config[section];
  useDocumentTitle(c.title);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("kategori") ?? "";
  const page = Math.max(1, Number(params.get("halaman")) || 1);

  const update = useCallback(
    (patch: Record<string, string>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
          if (!("halaman" in patch)) next.delete("halaman");
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const categories = useApi<Category[]>(section === "education" ? "/article-categories" : null);
  const list = useApi<Paginated<ArticleSummary>>(
    `/articles${qs({ section, q, category: section === "education" ? category : undefined, page, pageSize: PAGE_SIZE })}`,
  );
  const filtered = Boolean(q || category);

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} photo={c.photo} crumbs={[{ label: "Beranda", to: "/" }, { label: c.title }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="list-toolbar">
            <SearchInput label={c.searchLabel} placeholder="Ketik judul atau topik…" value={q} onChange={(v) => update({ q: v })} />
            {section === "education" && categories.status === "success" && (
              <div className="chips" role="group" aria-label="Filter kategori">
                <button type="button" className="chip" aria-pressed={!category} onClick={() => update({ kategori: "" })}>
                  Semua
                </button>
                {categories.data.map((cat) => (
                  <button key={cat.slug} type="button" className="chip" aria-pressed={category === cat.slug} onClick={() => update({ kategori: cat.slug })}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {list.status === "loading" && <LoadingCards count={6} />}
          {list.status === "error" && <ErrorState message={list.error.message} onRetry={list.reload} />}
          {list.status === "success" && (
            <>
              <div className="list-summary" style={{ marginBottom: "var(--s-4)" }}>
                <span aria-live="polite">
                  <strong>{list.data.total}</strong> {section === "education" ? "artikel" : "informasi"}
                  {filtered && " sesuai filter"}
                </span>
              </div>
              {list.data.items.length ? (
                <>
                  <div className="grid grid--3">
                    {list.data.items.map((a) => (
                      <ArticleCard key={a.slug} article={a} headingLevel={2} />
                    ))}
                  </div>
                  <Pagination
                    page={list.data.page}
                    pageSize={list.data.pageSize}
                    total={list.data.total}
                    onPage={(p) => {
                      update({ halaman: String(p) });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </>
              ) : filtered ? (
                <EmptyState
                  icon={SearchX}
                  title="Tidak ada hasil"
                  action={
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => update({ q: "", kategori: "" })}>
                      Hapus filter
                    </button>
                  }
                >
                  Coba kata kunci lain atau pilih kategori berbeda.
                </EmptyState>
              ) : (
                <EmptyState icon={c.icon} title={c.emptyTitle}>
                  {c.emptyText}
                </EmptyState>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
