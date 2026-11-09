import { ArrowRight, LifeBuoy, Menu, ShieldCheck, Siren, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from "react-router";
import { t } from "../../i18n";
import { NAV } from "../../lib/nav";
import { BrandMark } from "../BrandMark";
import { EmergencyDialog } from "../EmergencyDialog";

const EmergencyContext = createContext<() => void>(() => {});
/** Opens the emergency-contacts dialog from anywhere in the public portal. */
export const useOpenEmergency = () => useContext(EmergencyContext);

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const openEmergency = useCallback(() => setEmergencyOpen(true), []);
  const closeEmergency = useCallback(() => setEmergencyOpen(false), []);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <EmergencyContext.Provider value={openEmergency}>
      <div className="app">
        <a className="skip-link" href="#main">
          {t("nav.skip")}
        </a>
        <div className="emergency-bar">
          <div className="container">
            <span className="emergency-bar__msg">
              <Siren size={16} aria-hidden="true" />
              <span className="emergency-bar__long">{t("emergency.bar")}</span>
              <span className="emergency-bar__short">{t("emergency.barShort")}</span>
            </span>
            <button type="button" className="btn btn--sm btn--light" onClick={openEmergency}>
              {t("emergency.cta")}
            </button>
          </div>
        </div>
        <SiteHeader onMenu={() => setMenuOpen(true)} />
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <SiteFooter />
        <BottomNav onMenu={() => setMenuOpen(true)} />
        <EmergencyDialog open={emergencyOpen} onClose={closeEmergency} />
        <ScrollRestoration />
      </div>
    </EmergencyContext.Provider>
  );
}

function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${t("brand.name")} — ${t("nav.home")}`}>
      <BrandMark />
      <span className="brand__text">
        <span className="brand__name">{t("brand.name")}</span>
        <span className="brand__org">{t("brand.org")}</span>
      </span>
    </Link>
  );
}

function SiteHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="site-header">
      <div className="container">
        <Brand />
        <nav className="main-nav" aria-label="Navigasi utama">
          <ul>
            {NAV.filter((n) => n.to !== "/" && n.to !== "/bantuan").map((n) => (
              <li key={n.to}>
                <NavLink to={n.to}>{t(n.label)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <Link to="/bantuan" className="btn btn--sm btn--help-desktop">
            <LifeBuoy size={16} aria-hidden="true" /> Bantuan Kesehatan
          </Link>
        </div>
        <button type="button" className="btn btn--ghost btn--icon menu-toggle" onClick={onMenu} aria-label={t("nav.openMenu")}>
          <Menu aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);
  return (
    <div className="mobile-menu" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <nav className="mobile-menu__panel" aria-label="Menu">
        <div className="mobile-menu__head">
          <Brand />
          <button type="button" className="btn btn--ghost btn--icon" onClick={onClose} aria-label={t("nav.closeMenu")} autoFocus>
            <X aria-hidden="true" />
          </button>
        </div>
        <ul>
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} end={n.to === "/"}>
                <n.icon size={20} aria-hidden="true" /> {t(n.label)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function BottomNav({ onMenu }: { onMenu: () => void }) {
  const items = NAV.filter((n) => ["/", "/edukasi", "/fasilitas", "/bantuan"].includes(n.to));
  return (
    <nav className="bottom-nav" aria-label="Navigasi cepat">
      <ul>
        {items.map((n) => (
          <li key={n.to}>
            <NavLink to={n.to} end={n.to === "/"} className={n.to === "/bantuan" ? "bottom-nav__help" : undefined}>
              <n.icon size={22} aria-hidden="true" />
              {t(n.label)}
            </NavLink>
          </li>
        ))}
        <li>
          <button type="button" onClick={onMenu}>
            <Menu size={22} aria-hidden="true" />
            {t("nav.menu")}
          </button>
        </li>
      </ul>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <Brand />
            <p>
              Platform informasi dan pengelolaan kesehatan komunitas Masyarakat Indonesia di Mesir, dikelola oleh Kementerian
              Kesehatan PPMI Mesir.
            </p>
            <p style={{ display: "flex", gap: 8 }}>
              <ShieldCheck size={18} aria-hidden="true" style={{ flex: "none", color: "var(--c-soft-green)" }} />
              <span>Informasi di situs ini tidak menggantikan konsultasi langsung dengan tenaga kesehatan.</span>
            </p>
          </div>
          <div>
            <h2>Informasi</h2>
            <ul>
              <li><Link to="/edukasi">Edukasi Kesehatan</Link></li>
              <li><Link to="/berita">Berita & Informasi</Link></li>
              <li><Link to="/program">Program Kesehatan</Link></li>
              <li><Link to="/statistik">Statistik Kesehatan</Link></li>
            </ul>
          </div>
          <div>
            <h2>Layanan</h2>
            <ul>
              <li><Link to="/fasilitas">Fasilitas Kesehatan</Link></li>
              <li><Link to="/bantuan">Bantuan Kesehatan</Link></li>
              <li><Link to="/profil">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h2>Kontak</h2>
            <ul>
              {/* Official channels must be supplied by Menkes PPMI Mesir — see docs/OWNER-INPUT.md */}
              <li><span className="placeholder-text">[Email resmi Menkes]</span></li>
              <li><span className="placeholder-text">[Instagram resmi]</span></li>
              <li>
                <Link to="/bantuan" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                  Kontak bantuan <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Kementerian Kesehatan PPMI Mesir</span>
          <span>{t("brand.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
