import { ArrowRight, Siren } from "lucide-react";
import { Link } from "react-router";
import type { Hotline } from "../../shared/types";
import { useApi } from "../lib/api";
import { HotlineCard } from "./cards/HotlineCard";
import { Modal } from "./ui/Modal";
import { ErrorState, LoadingBlock } from "./ui/States";

/** Quick-access emergency contacts, reachable from every page. */
export function EmergencyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Kontak darurat">
      {open && <EmergencyContent onClose={onClose} />}
    </Modal>
  );
}

function EmergencyContent({ onClose }: { onClose: () => void }) {
  const res = useApi<Hotline[]>("/hotlines");
  return (
    <>
      <div className="notice notice--danger">
        <Siren size={20} aria-hidden="true" />
        <p>
          <strong>Masisir Health Pass bukan layanan ambulans atau gawat darurat.</strong>
          Jika nyawa terancam, segera hubungi layanan darurat Mesir dan minta bantuan orang terdekat.
        </p>
      </div>
      {res.status === "loading" && <LoadingBlock />}
      {res.status === "error" && <ErrorState message={res.error.message} onRetry={res.reload} />}
      {res.status === "success" &&
        (res.data.length === 0 ? (
          <p className="card__text">Kontak darurat belum diterbitkan oleh pengelola.</p>
        ) : (
          <div className="stack">
            {res.data
              .filter((h) => h.category === "emergency" || h.category === "menkes")
              .slice(0, 3)
              .map((h) => (
                <HotlineCard key={h.id} hotline={h} />
              ))}
          </div>
        ))}
      <Link to="/bantuan" className="link-arrow" onClick={onClose}>
        Semua kontak & panduan bantuan <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  );
}
