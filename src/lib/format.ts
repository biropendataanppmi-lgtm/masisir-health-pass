import type { ProgramStatus, VerificationStatus } from "../../shared/types";

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" });
const shortFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Cairo" });

function parse(iso: string): Date | null {
  // Date-only strings are treated as calendar dates (no timezone shift).
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(iso: string | null | undefined, short = false): string {
  if (!iso) return "";
  const d = parse(iso);
  return d ? (short ? shortFmt : dateFmt).format(d) : "";
}

export function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "Jadwal menyusul";
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start, true)} – ${formatDate(end, true)}`;
}

export const programStatusLabel: Record<ProgramStatus, string> = {
  upcoming: "Akan datang",
  ongoing: "Sedang berjalan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export const verificationLabel: Record<VerificationStatus, string> = {
  verified: "Terverifikasi",
  unverified: "Belum diverifikasi",
  needs_update: "Perlu pembaruan",
};

/** wa.me link from a phone number in any common format. */
export function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
