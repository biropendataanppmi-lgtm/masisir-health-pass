import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router";
import { BrandMark } from "../../components/BrandMark";
import { useDocumentTitle } from "../../lib/useDocumentTitle";

// /admin and /admin/login — Internal Management System (Phase 2).
// No login form is shown until real authentication exists on the server;
// the /api/admin endpoints currently reject every request.
export function AdminGatePage() {
  useDocumentTitle("Sistem Internal");
  return (
    <main className="admin-gate">
      <div className="admin-gate__card">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BrandMark />
          <div>
            <strong style={{ color: "var(--c-deep-teal)" }}>Masisir Health Pass</strong>
            <div className="card__text">Sistem Manajemen Internal</div>
          </div>
        </div>
        <div className="notice">
          <Lock size={20} aria-hidden="true" />
          <p>
            <strong>Login pengelola belum diaktifkan.</strong>
            Dashboard internal untuk Menkes PPMI Mesir sedang dibangun pada tahap berikutnya (Phase 2), termasuk autentikasi,
            pengaturan peran, dan alur publikasi konten.
          </p>
        </div>
        <Link to="/" className="btn btn--secondary">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke portal publik
        </Link>
      </div>
    </main>
  );
}
