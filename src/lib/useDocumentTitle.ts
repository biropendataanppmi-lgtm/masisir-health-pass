import { useEffect } from "react";
import { t } from "../i18n";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${t("brand.name")}` : `${t("brand.name")} — ${t("brand.tagline")}`;
  }, [title]);
}
