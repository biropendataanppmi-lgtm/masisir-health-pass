import type {
  ArticleDetail,
  ArticleSummary,
  Category,
  FacilityDetail,
  FacilityFilters,
  FacilitySummary,
  HomeData,
  Hotline,
  Paginated,
  ProgramDetail,
  ProgramStatus,
  ProgramSummary,
} from "../../shared/types";
import {
  toArticleDetail,
  toArticleSummary,
  toFacilityDetail,
  toFacilitySummary,
  toHotline,
  toProgramDetail,
  toProgramSummary,
} from "./mappers";
import { likePattern } from "./validation";

// Read-only queries for the public portal.
//
// Visibility rules live here, in one place, and are enforced in SQL:
//   articles / programs : status = 'published' AND published_at <= now (articles)
//   facilities / hotlines: is_active = 1
//   production          : is_sample = 0 (sample rows can never leak to the live site)

type Row = Record<string, unknown>;

export class PublicRepo {
  constructor(
    private db: D1Database,
    private opts: { includeSample: boolean },
  ) {}

  private sample(alias: string): string {
    return this.opts.includeSample ? "" : ` AND ${alias}.is_sample = 0`;
  }

  // ------------------------------------------------------------ articles
  private articleSelect = `
    SELECT a.*, c.slug AS category_slug, c.name AS category_name
    FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id`;

  private articleVisible(): string {
    return `a.status = 'published' AND a.published_at IS NOT NULL
      AND a.published_at <= strftime('%Y-%m-%dT%H:%M:%SZ', 'now')${this.sample("a")}`;
  }

  async listArticles(p: {
    section: "education" | "news";
    category?: string;
    q?: string;
    page: number;
    pageSize: number;
  }): Promise<Paginated<ArticleSummary>> {
    const where = [this.articleVisible()];
    const args: unknown[] = [];
    if (p.section === "education") where.push(`a.kind = 'education'`);
    else where.push(`a.kind <> 'education'`);
    if (p.category) {
      where.push("c.slug = ?");
      args.push(p.category);
    }
    if (p.q) {
      where.push(`(a.title LIKE ? ESCAPE '\\' OR a.summary LIKE ? ESCAPE '\\')`);
      const pat = likePattern(p.q);
      args.push(pat, pat);
    }
    const whereSql = where.join(" AND ");
    const total = await this.db
      .prepare(`SELECT COUNT(*) AS n FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id WHERE ${whereSql}`)
      .bind(...args)
      .first<{ n: number }>();
    const { results } = await this.db
      .prepare(`${this.articleSelect} WHERE ${whereSql} ORDER BY a.published_at DESC, a.id DESC LIMIT ? OFFSET ?`)
      .bind(...args, p.pageSize, (p.page - 1) * p.pageSize)
      .all<Row>();
    return { items: results.map(toArticleSummary), page: p.page, pageSize: p.pageSize, total: total?.n ?? 0 };
  }

  async getArticle(slug: string): Promise<ArticleDetail | null> {
    const row = await this.db
      .prepare(`${this.articleSelect} WHERE a.slug = ? AND ${this.articleVisible()}`)
      .bind(slug)
      .first<Row>();
    return row ? toArticleDetail(row) : null;
  }

  async listArticleCategories(): Promise<Category[]> {
    const { results } = await this.db
      .prepare("SELECT slug, name FROM article_categories ORDER BY sort_order, name")
      .all<Category>();
    return results;
  }

  // ---------------------------------------------------------- facilities
  private facilitySelect = `
    SELECT f.*, t.slug AS type_slug, t.name AS type_name, r.slug AS region_slug, r.name AS region_name
    FROM facilities f
    JOIN facility_types t ON t.id = f.type_id
    LEFT JOIN regions r ON r.id = f.region_id`;

  async listFacilities(p: { type?: string; region?: string; q?: string }): Promise<FacilitySummary[]> {
    const where = [`f.is_active = 1${this.sample("f")}`];
    const args: unknown[] = [];
    if (p.type) {
      where.push("t.slug = ?");
      args.push(p.type);
    }
    if (p.region) {
      where.push("r.slug = ?");
      args.push(p.region);
    }
    if (p.q) {
      where.push(`(f.name LIKE ? ESCAPE '\\' OR f.address LIKE ? ESCAPE '\\' OR f.services LIKE ? ESCAPE '\\')`);
      const pat = likePattern(p.q);
      args.push(pat, pat, pat);
    }
    const { results } = await this.db
      .prepare(`${this.facilitySelect} WHERE ${where.join(" AND ")} ORDER BY t.sort_order, f.name LIMIT 500`)
      .bind(...args)
      .all<Row>();
    return results.map(toFacilitySummary);
  }

  async getFacility(slug: string): Promise<FacilityDetail | null> {
    const row = await this.db
      .prepare(`${this.facilitySelect} WHERE f.slug = ? AND f.is_active = 1${this.sample("f")}`)
      .bind(slug)
      .first<Row>();
    return row ? toFacilityDetail(row) : null;
  }

  async facilityFilters(): Promise<FacilityFilters> {
    const [types, regions] = await Promise.all([
      this.db.prepare("SELECT slug, name FROM facility_types ORDER BY sort_order, name").all<Category>(),
      // Only regions that actually have a visible facility are offered as filters.
      this.db
        .prepare(
          `SELECT DISTINCT r.slug, r.name, r.sort_order FROM regions r
           JOIN facilities f ON f.region_id = r.id
           WHERE f.is_active = 1${this.sample("f")} ORDER BY r.sort_order, r.name`,
        )
        .all<Category & { sort_order: number }>(),
    ]);
    return {
      types: types.results,
      regions: regions.results.map(({ slug, name }) => ({ slug, name })),
    };
  }

  // ------------------------------------------------------------ hotlines
  async listHotlines(): Promise<Hotline[]> {
    const { results } = await this.db
      .prepare(
        `SELECT * FROM hotline_contacts h WHERE h.is_active = 1${this.sample("h")}
         ORDER BY h.priority, h.name`,
      )
      .all<Row>();
    return results.map(toHotline);
  }

  // ------------------------------------------------------------ programs
  async listPrograms(p: { status?: ProgramStatus }): Promise<ProgramSummary[]> {
    const where = [`p.status = 'published'${this.sample("p")}`];
    const args: unknown[] = [];
    if (p.status) {
      where.push("p.program_status = ?");
      args.push(p.status);
    }
    const { results } = await this.db
      .prepare(
        `SELECT * FROM programs p WHERE ${where.join(" AND ")}
         ORDER BY CASE p.program_status WHEN 'ongoing' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END,
                  p.start_date DESC LIMIT 200`,
      )
      .bind(...args)
      .all<Row>();
    return results.map(toProgramSummary);
  }

  async getProgram(slug: string): Promise<ProgramDetail | null> {
    const row = await this.db
      .prepare(`SELECT * FROM programs p WHERE p.slug = ? AND p.status = 'published'${this.sample("p")}`)
      .bind(slug)
      .first<Row>();
    return row ? toProgramDetail(row) : null;
  }

  // ---------------------------------------------------------------- home
  async home(): Promise<HomeData> {
    const [edu, news, programs, facilities, hotlines] = await Promise.all([
      this.listArticles({ section: "education", page: 1, pageSize: 3 }),
      this.listArticles({ section: "news", page: 1, pageSize: 3 }),
      this.listPrograms({}),
      this.db
        .prepare(
          `${this.facilitySelect} WHERE f.is_active = 1 AND f.is_featured = 1${this.sample("f")}
           ORDER BY f.name LIMIT 3`,
        )
        .all<Row>(),
      this.listHotlines(),
    ]);
    const facilityCount = await this.db
      .prepare(`SELECT COUNT(*) AS n FROM facilities f WHERE f.is_active = 1${this.sample("f")}`)
      .first<{ n: number }>();
    const activePrograms = programs.filter((p) => p.programStatus === "ongoing" || p.programStatus === "upcoming");
    return {
      latestArticles: edu.items,
      latestNews: news.items,
      programs: activePrograms.slice(0, 3),
      featuredFacilities: facilities.results.map(toFacilitySummary),
      emergencyHotlines: hotlines.filter((h) => h.category === "emergency"),
      counts: { articles: edu.total, facilities: facilityCount?.n ?? 0, programs: activePrograms.length },
    };
  }
}
