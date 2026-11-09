import { CircleExclamationPoint, Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../i18n";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  children,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="state" role="status">
      <div className="state__icon">
        <Icon aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon">
        <CircleExclamationPoint aria-hidden="true" />
      </div>
      <h3>Gagal memuat data</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary btn--sm" onClick={onRetry}>
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}

export function LoadingCards({ count = 3, media = true }: { count?: number; media?: boolean }) {
  return (
    <div className="grid grid--3" aria-busy="true" aria-label={t("common.loading")}>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          {media && <div className="skeleton" style={{ aspectRatio: "16 / 10" }} />}
          <div className="skeleton" style={{ height: 14, width: "40%" }} />
          <div className="skeleton" style={{ height: 20, width: "85%" }} />
          <div className="skeleton" style={{ height: 14, width: "70%" }} />
        </div>
      ))}
    </div>
  );
}

export function LoadingBlock() {
  return (
    <div className="stack" aria-busy="true" aria-label={t("common.loading")}>
      <div className="skeleton" style={{ height: 18, width: "30%" }} />
      <div className="skeleton" style={{ height: 40, width: "80%" }} />
      <div className="skeleton" style={{ height: 16, width: "95%" }} />
      <div className="skeleton" style={{ height: 16, width: "90%" }} />
      <div className="skeleton" style={{ height: 16, width: "60%" }} />
    </div>
  );
}
