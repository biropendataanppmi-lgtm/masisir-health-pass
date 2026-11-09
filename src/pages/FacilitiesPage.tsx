import { List, Map as MapIcon, MapPin, SearchX } from "lucide-react";
import { lazy, Suspense, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { FacilityFilters, FacilitySummary } from "../../shared/types";
import { FacilityCard } from "../components/cards/FacilityCard";
import { PageHero } from "../components/ui/PageHero";
import { SearchInput } from "../components/ui/SearchInput";
import { SelectFilter } from "../components/ui/Select";
import { EmptyState, ErrorState, LoadingBlock, LoadingCards } from "../components/ui/States";
import { Tabs } from "../components/ui/Tabs";
import { qs, useApi } from "../lib/api";
import { useDocumentTitle } from "../lib/useDocumentTitle";

// Leaflet is only downloaded when the map view is opened.
const FacilityMap = lazy(() => import("../components/FacilityMap"));

type View = "daftar" | "peta";

export function FacilitiesPage() {
  useDocumentTitle("Fasilitas Kesehatan");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const type = params.get("jenis") ?? "";
  const region = params.get("wilayah") ?? "";
  const view: View = params.get("tampilan") === "peta" ? "peta" : "daftar";

  const update = useCallback(
    (patch: Record<string, string>) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  const filters = useApi<FacilityFilters>("/facility-filters");
  const list = useApi<FacilitySummary[]>(`/facilities${qs({ q, type, region })}`);
  const filtered = Boolean(q || type || region);

  return (
    <>
      <PageHero
        eyebrow="Direktori"
        title="Fasilitas Kesehatan"
        lead="Rumah sakit, klinik, dokter praktik, apotek, dan laboratorium yang dapat diakses Masisir. Informasi dihimpun dan diverifikasi oleh pengelola."
        photo="stethoscope-notebook"
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Fasilitas Kesehatan" }]}
      />
      <section className="section section--tight">
        <div className="container">
          <div className="list-toolbar">
            <div className="filter-bar">
              <SearchInput label="Cari fasilitas" placeholder="Nama, alamat, atau layanan…" value={q} onChange={(v) => update({ q: v })} />
              <SelectFilter
                label="Jenis fasilitas"
                value={type}
                onChange={(v) => update({ jenis: v })}
                options={filters.status === "success" ? filters.data.types.map((t) => ({ value: t.slug, label: t.name })) : []}
              />
              <SelectFilter
                label="Wilayah"
                value={region}
                onChange={(v) => update({ wilayah: v })}
                options={filters.status === "success" ? filters.data.regions.map((r) => ({ value: r.slug, label: r.name })) : []}
              />
            </div>
            <div className="list-summary">
              <span aria-live="polite">
                {list.status === "success" && (
                  <>
                    <strong>{list.data.length}</strong> fasilitas{filtered && " sesuai filter"}
                  </>
                )}
              </span>
              <Tabs<View>
                label="Tampilan"
                value={view}
                onChange={(v) => update({ tampilan: v === "peta" ? "peta" : "" })}
                options={[
                  { value: "daftar", label: "Daftar", icon: List },
                  { value: "peta", label: "Peta", icon: MapIcon },
                ]}
              />
            </div>
          </div>

          <div className="notice" style={{ marginBottom: "var(--s-5)" }}>
            <MapPin size={20} aria-hidden="true" />
            <p>
              Jam operasional dan layanan dapat berubah. Hubungi fasilitas terlebih dahulu sebelum berkunjung. Status
              verifikasi ditampilkan pada setiap fasilitas.
            </p>
          </div>

          {list.status === "loading" && <LoadingCards count={6} media={false} />}
          {list.status === "error" && <ErrorState message={list.error.message} onRetry={list.reload} />}
          {list.status === "success" &&
            (list.data.length === 0 ? (
              filtered ? (
                <EmptyState
                  icon={SearchX}
                  title="Tidak ada fasilitas yang cocok"
                  action={
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => update({ q: "", jenis: "", wilayah: "" })}>
                      Hapus filter
                    </button>
                  }
                >
                  Coba kata kunci lain, atau ubah jenis dan wilayah.
                </EmptyState>
              ) : (
                <EmptyState icon={MapPin} title="Direktori sedang disusun">
                  Data fasilitas kesehatan akan ditampilkan setelah dihimpun dan diverifikasi oleh Menkes PPMI Mesir.
                </EmptyState>
              )
            ) : view === "peta" ? (
              <>
                <Suspense fallback={<LoadingBlock />}>
                  <FacilityMap facilities={list.data} />
                </Suspense>
                <p className="map-note">
                  {list.data.filter((f) => f.latitude == null || f.longitude == null).length > 0 &&
                    `${list.data.filter((f) => f.latitude == null || f.longitude == null).length} fasilitas belum memiliki koordinat dan hanya tampil pada tampilan daftar. `}
                  Peta © kontributor OpenStreetMap.
                </p>
              </>
            ) : (
              <div className="grid grid--3">
                {list.data.map((f) => (
                  <FacilityCard key={f.slug} facility={f} />
                ))}
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
