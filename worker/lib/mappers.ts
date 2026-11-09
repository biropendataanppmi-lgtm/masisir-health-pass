import type {
  ArticleDetail,
  ArticleSummary,
  FacilityDetail,
  FacilitySummary,
  Hotline,
  ProgramDetail,
  ProgramSummary,
  Source,
} from "../../shared/types";

// Database rows -> API shapes. Only fields that are meant to be public are
// copied; anything not listed here never leaves the Worker.

type Row = Record<string, unknown>;

const str = (v: unknown): string | null => (typeof v === "string" && v !== "" ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

function jsonArray<T>(v: unknown, guard: (x: unknown) => x is T): T[] {
  if (typeof v !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
}

const isString = (x: unknown): x is string => typeof x === "string" && x.length > 0;
const isSource = (x: unknown): x is Source =>
  typeof x === "object" && x !== null && typeof (x as Source).title === "string" &&
  ((x as Source).url === undefined || typeof (x as Source).url === "string");

export function toArticleSummary(r: Row): ArticleSummary {
  return {
    slug: String(r.slug),
    kind: r.kind as ArticleSummary["kind"],
    title: String(r.title),
    summary: String(r.summary ?? ""),
    coverImage: str(r.cover_image),
    category: r.category_slug ? { slug: String(r.category_slug), name: String(r.category_name) } : null,
    publishedAt: str(r.published_at),
    isSample: r.is_sample === 1,
  };
}

export function toArticleDetail(r: Row): ArticleDetail {
  return {
    ...toArticleSummary(r),
    body: String(r.body ?? ""),
    authorName: str(r.author_name),
    reviewedBy: str(r.reviewed_by),
    reviewedAt: str(r.reviewed_at),
    updatedAt: String(r.updated_at),
    sources: jsonArray(r.sources, isSource),
  };
}

export function toFacilitySummary(r: Row): FacilitySummary {
  return {
    slug: String(r.slug),
    name: String(r.name),
    type: { slug: String(r.type_slug), name: String(r.type_name) },
    region: r.region_slug ? { slug: String(r.region_slug), name: String(r.region_name) } : null,
    address: str(r.address),
    latitude: num(r.latitude),
    longitude: num(r.longitude),
    photoUrl: str(r.photo_url),
    verificationStatus: r.verification_status as FacilitySummary["verificationStatus"],
    isSample: r.is_sample === 1,
  };
}

export function toFacilityDetail(r: Row): FacilityDetail {
  return {
    ...toFacilitySummary(r),
    phone: str(r.phone),
    website: str(r.website),
    socialUrl: str(r.social_url),
    // Unverified opening hours are never published.
    openingHours: r.hours_verified === 1 ? str(r.opening_hours) : null,
    services: jsonArray(r.services, isString),
    accessNotes: str(r.access_notes),
    notes: str(r.notes),
    lastVerifiedAt: str(r.last_verified_at),
    updatedAt: String(r.updated_at),
  };
}

export function toHotline(r: Row): Hotline {
  return {
    id: Number(r.id),
    name: String(r.name),
    category: r.category as Hotline["category"],
    phone: str(r.phone),
    whatsapp: str(r.whatsapp),
    usageNote: str(r.usage_note),
    lastVerifiedAt: str(r.last_verified_at),
    isSample: r.is_sample === 1,
  };
}

export function toProgramSummary(r: Row): ProgramSummary {
  return {
    slug: String(r.slug),
    title: String(r.title),
    summary: String(r.summary ?? ""),
    programStatus: r.program_status as ProgramSummary["programStatus"],
    startDate: str(r.start_date),
    endDate: str(r.end_date),
    location: str(r.location),
    coverImage: str(r.cover_image),
    isSample: r.is_sample === 1,
  };
}

export function toProgramDetail(r: Row): ProgramDetail {
  return {
    ...toProgramSummary(r),
    body: String(r.body ?? ""),
    registrationUrl: str(r.registration_url),
    registrationInfo: str(r.registration_info),
    updatedAt: String(r.updated_at),
  };
}
