import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { FacilitySummary } from "../../shared/types";

// Default view: Cairo. Tiles from OpenStreetMap (attribution required).
const CAIRO: L.LatLngTuple = [30.0444, 31.2357];

export default function FacilityMap({ facilities }: { facilities: FacilitySummary[] }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { scrollWheelZoom: false }).setView(CAIRO, 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    const g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    const pts: L.LatLngTuple[] = [];
    const icon = L.divIcon({ className: "", html: '<div class="map-pin"></div>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
    for (const f of facilities) {
      if (f.latitude == null || f.longitude == null) continue;
      const ll: L.LatLngTuple = [f.latitude, f.longitude];
      pts.push(ll);
      // Built with DOM APIs (not HTML strings) so names cannot inject markup.
      const box = document.createElement("div");
      box.className = "map-popup";
      const name = document.createElement("strong");
      name.textContent = f.name;
      const type = document.createElement("span");
      type.textContent = f.type.name + (f.isSample ? " · Data contoh" : "");
      const link = document.createElement("a");
      link.href = `/fasilitas/${f.slug}`;
      link.textContent = "Lihat detail";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(`/fasilitas/${f.slug}`);
      });
      box.append(name, type, link);
      L.marker(ll, { icon, title: f.name, alt: f.name }).bindPopup(box).addTo(g);
    }
    if (pts.length === 1) m.setView(pts[0], 14);
    else if (pts.length > 1) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 15 });
  }, [facilities, navigate]);

  return <div ref={el} className="map-box" role="region" aria-label="Peta fasilitas kesehatan" />;
}
