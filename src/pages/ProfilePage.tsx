import { Eye, HandHeart, Lock, ShieldCheck, Target, Users } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "../components/ui/PageHero";
import { Photo } from "../components/ui/Photo";
import { useDocumentTitle } from "../lib/useDocumentTitle";

// Vision, mission and organisation details must come from Menkes PPMI Mesir.
// Text in .placeholder-text marks content still waiting for official input.

export function ProfilePage() {
  useDocumentTitle("Profil");
  return (
    <>
      <PageHero
        eyebrow="Profil"
        title="Tentang Masisir Health Pass"
        lead="Platform kesehatan komunitas yang mengintegrasikan informasi, edukasi, direktori fasilitas, statistik, dan pengelolaan data kesehatan Masisir dalam satu ekosistem digital."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Profil" }]}
      />

      <section className="section">
        <div className="container split">
          <div className="stack" style={{ gap: "var(--s-5)" }}>
            <span className="eyebrow">Latar belakang</span>
            <h2>Satu pintu informasi kesehatan untuk Masisir</h2>
            <p>
              Pelajar dan masyarakat Indonesia tinggal di Mesir, jauh dari sistem kesehatan yang mereka kenal. Informasi
              tentang fasilitas, jalur bantuan, dan cara menjaga kesehatan sering tersebar di banyak grup dan sulit diverifikasi.
            </p>
            <p>
              Masisir Health Pass hadir sebagai pusat informasi yang tepercaya: setiap konten dihimpun dari lapangan, diverifikasi
              oleh Kementerian Kesehatan PPMI Mesir, lalu diterbitkan untuk seluruh Masisir.
            </p>
          </div>
          <div className="split__photo">
            <Photo name="nursing-training" alt="Pelatihan tenaga kesehatan" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section section--mint">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Arah</span>
              <h2>Visi & misi</h2>
            </div>
          </div>
          <div className="grid grid--2">
            <div className="value-card">
              <Eye aria-hidden="true" />
              <h3>Visi</h3>
              <p>
                <span className="placeholder-text">[Visi resmi diisi oleh Menkes PPMI Mesir]</span>
              </p>
            </div>
            <div className="value-card">
              <Target aria-hidden="true" />
              <h3>Misi</h3>
              <p>
                <span className="placeholder-text">[Misi resmi diisi oleh Menkes PPMI Mesir]</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Tujuan & prinsip</span>
              <h2>Apa yang kami jaga</h2>
            </div>
          </div>
          <div className="grid grid--4">
            <div className="value-card">
              <ShieldCheck aria-hidden="true" />
              <h3>Tepercaya</h3>
              <p>Informasi memiliki sumber, tanggal, dan status verifikasi yang jelas.</p>
            </div>
            <div className="value-card">
              <Lock aria-hidden="true" />
              <h3>Menjaga privasi</h3>
              <p>Data kesehatan individu tidak pernah dipublikasikan. Statistik hanya ditampilkan secara agregat.</p>
            </div>
            <div className="value-card">
              <HandHeart aria-hidden="true" />
              <h3>Berpusat pada Masisir</h3>
              <p>Bahasa sederhana, mudah diakses dari ponsel, dan relevan dengan kehidupan di Mesir.</p>
            </div>
            <div className="value-card">
              <Users aria-hidden="true" />
              <h3>Berkelanjutan</h3>
              <p>Dibangun agar dapat dikelola dan diwariskan kepada kepengurusan berikutnya.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container split">
          <div className="stack" style={{ gap: "var(--s-4)" }}>
            <span className="eyebrow">Pengelola</span>
            <h2>Peran Menkes PPMI Mesir</h2>
            <p>
              Kementerian Kesehatan PPMI Mesir adalah pengelola utama Masisir Health Pass. Menkes memeriksa, memverifikasi, dan
              menerbitkan seluruh konten publik, mengelola direktori fasilitas dan kontak bantuan, serta mengoordinasikan Satgas
              Kesehatan di wilayah dan kekeluargaan.
            </p>
          </div>
          <div className="panel" style={{ background: "rgba(233,243,239,0.06)", borderColor: "rgba(233,243,239,0.15)", color: "var(--c-mint-200)" }}>
            <h3 style={{ color: "var(--c-white)" }}>Kontak & informasi organisasi</h3>
            <dl className="def-list">
              <div>
                <dt style={{ color: "var(--c-soft-green)" }}>Organisasi</dt>
                <dd>Kementerian Kesehatan PPMI Mesir</dd>
              </div>
              <div>
                <dt style={{ color: "var(--c-soft-green)" }}>Email</dt>
                <dd><span className="placeholder-text">[Email resmi]</span></dd>
              </div>
              <div>
                <dt style={{ color: "var(--c-soft-green)" }}>Media sosial</dt>
                <dd><span className="placeholder-text">[Akun resmi]</span></dd>
              </div>
              <div>
                <dt style={{ color: "var(--c-soft-green)" }}>Sekretariat</dt>
                <dd><span className="placeholder-text">[Alamat sekretariat]</span></dd>
              </div>
            </dl>
            <Link to="/bantuan" className="btn btn--light btn--sm" style={{ justifySelf: "start" }}>
              Kontak bantuan kesehatan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
