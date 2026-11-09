// Types shared by the Worker API and the React client.
// The API returns these shapes; the client never sees raw database rows.

export type ArticleKind = "education" | "news" | "announcement" | "advisory" | "agenda";
export type PublishStatus = "draft" | "review" | "published" | "archived";
export type ProgramStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type VerificationStatus = "unverified" | "verified" | "needs_update";
export type HotlineCategory = "emergency" | "menkes" | "satgas" | "embassy" | "other";

export interface Category {
  slug: string;
  name: string;
}

export interface Source {
  title: string;
  url?: string;
}

export interface ArticleSummary {
  slug: string;
  kind: ArticleKind;
  title: string;
  summary: string;
  coverImage: string | null;
  category: Category | null;
  publishedAt: string | null;
  isSample: boolean;
}

export interface ArticleDetail extends ArticleSummary {
  body: string;
  authorName: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  updatedAt: string;
  sources: Source[];
}

export interface FacilitySummary {
  slug: string;
  name: string;
  type: Category;
  region: Category | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  photoUrl: string | null;
  verificationStatus: VerificationStatus;
  isSample: boolean;
}

export interface FacilityDetail extends FacilitySummary {
  phone: string | null;
  website: string | null;
  socialUrl: string | null;
  /** Only present when the hours have been verified by the managers. */
  openingHours: string | null;
  services: string[];
  accessNotes: string | null;
  notes: string | null;
  lastVerifiedAt: string | null;
  updatedAt: string;
}

export interface Hotline {
  id: number;
  name: string;
  category: HotlineCategory;
  phone: string | null;
  whatsapp: string | null;
  usageNote: string | null;
  lastVerifiedAt: string | null;
  isSample: boolean;
}

export interface ProgramSummary {
  slug: string;
  title: string;
  summary: string;
  programStatus: ProgramStatus;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  coverImage: string | null;
  isSample: boolean;
}

export interface ProgramDetail extends ProgramSummary {
  body: string;
  registrationUrl: string | null;
  registrationInfo: string | null;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface HomeData {
  latestArticles: ArticleSummary[];
  latestNews: ArticleSummary[];
  programs: ProgramSummary[];
  featuredFacilities: FacilitySummary[];
  emergencyHotlines: Hotline[];
  counts: { articles: number; facilities: number; programs: number };
}

export interface FacilityFilters {
  types: Category[];
  regions: Category[];
}

export interface ApiError {
  error: { code: string; message: string };
}
