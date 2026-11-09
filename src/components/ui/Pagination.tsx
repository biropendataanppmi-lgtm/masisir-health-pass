import { ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "../../i18n";

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Halaman">
      <button type="button" className="btn btn--secondary btn--sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft size={16} aria-hidden="true" /> {t("common.prev")}
      </button>
      <span aria-live="polite">
        Halaman {page} dari {pages}
      </span>
      <button type="button" className="btn btn--secondary btn--sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        {t("common.next")} <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
