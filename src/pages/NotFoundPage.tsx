import { House, SearchX } from "lucide-react";
import { Link } from "react-router";
import { EmptyState } from "../components/ui/States";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Halaman tidak ditemukan");
  return (
    <section className="section">
      <div className="container">
        <EmptyState
          icon={SearchX}
          title="Halaman tidak ditemukan"
          action={
            <Link to="/" className="btn btn--sm">
              <House size={16} aria-hidden="true" /> Kembali ke beranda
            </Link>
          }
        >
          Halaman yang Anda cari tidak tersedia, sudah dipindahkan, atau belum diterbitkan.
        </EmptyState>
      </div>
    </section>
  );
}
