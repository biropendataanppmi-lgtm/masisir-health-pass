import { Copy, MessageCircle, Phone } from "lucide-react";
import type { Hotline } from "../../../shared/types";
import { formatDate, telLink, whatsappLink } from "../../lib/format";
import { Badge, SampleBadge } from "../ui/Badge";
import { useToast } from "../ui/Toast";

export const hotlineCategoryLabel: Record<Hotline["category"], string> = {
  emergency: "Darurat",
  menkes: "Menkes PPMI Mesir",
  satgas: "Satgas Kesehatan",
  embassy: "Perwakilan RI",
  other: "Kontak lainnya",
};

export function HotlineCard({ hotline, showCategory = false }: { hotline: Hotline; showCategory?: boolean }) {
  const toast = useToast();
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast("Nomor disalin");
    } catch {
      toast("Gagal menyalin nomor", "error");
    }
  };
  const emergency = hotline.category === "emergency";
  return (
    <article className={`contact-card${emergency ? " contact-card--emergency" : ""}`}>
      {(showCategory || hotline.isSample) && (
        <div className="badges">
          {showCategory && <Badge tone={emergency ? "danger" : "blue"}>{hotlineCategoryLabel[hotline.category]}</Badge>}
          {hotline.isSample && <SampleBadge />}
        </div>
      )}
      <div className="contact-card__head">
        <div>
          <h3 className="contact-card__name">{hotline.name}</h3>
          {hotline.usageNote && <p className="card__text">{hotline.usageNote}</p>}
        </div>
      </div>
      {hotline.phone ? (
        <div className="contact-card__number">{hotline.phone}</div>
      ) : (
        <p className="contact-card__missing">Nomor belum tersedia — menunggu verifikasi pengelola.</p>
      )}
      {(hotline.phone || hotline.whatsapp) && (
        <div className="contact-card__actions">
          {hotline.phone && (
            <a className={`btn btn--sm${emergency ? " btn--danger" : ""}`} href={telLink(hotline.phone)}>
              <Phone size={16} aria-hidden="true" /> Telepon
            </a>
          )}
          {hotline.whatsapp && (
            <a className="btn btn--secondary btn--sm" href={whatsappLink(hotline.whatsapp)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          )}
          {hotline.phone && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => copy(hotline.phone!)}>
              <Copy size={16} aria-hidden="true" /> Salin
            </button>
          )}
        </div>
      )}
      {hotline.lastVerifiedAt && <p className="card__meta">Terakhir diverifikasi {formatDate(hotline.lastVerifiedAt)}</p>}
    </article>
  );
}
