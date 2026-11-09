import { describe, expect, it } from "vitest";
import { createApp } from "../worker/app";
import { createTestDb } from "./d1-shim";

function setup(env: "development" | "production" = "development", seed = true) {
  const app = createApp();
  const DB = createTestDb({ seed });
  const get = async (path: string, init?: RequestInit) => {
    const res = await app.request(path, init, { DB, APP_ENV: env } as unknown as Env);
    return { res, body: (await res.json()) as any };
  };
  return { get, DB };
}

describe("public API", () => {
  it("reports health", async () => {
    const { get } = setup();
    const { res, body } = await get("/api/health");
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("lists only published education articles, newest first", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/articles?section=education");
    const slugs = body.items.map((a: any) => a.slug);
    expect(slugs).not.toContain("contoh-draft-tidak-tampil");
    expect(body.items.every((a: any) => a.kind === "education")).toBe(true);
    const dates = body.items.map((a: any) => a.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("never serves draft articles by slug", async () => {
    const { get } = setup();
    const { res } = await get("/api/public/articles/contoh-draft-tidak-tampil");
    expect(res.status).toBe(404);
  });

  it("hides articles scheduled for the future", async () => {
    const { get, DB } = setup();
    DB.raw.exec(`INSERT INTO articles (slug, title, status, published_at) VALUES ('future', 'F', 'published', '2999-01-01T00:00:00Z')`);
    const { res } = await get("/api/public/articles/future");
    expect(res.status).toBe(404);
  });

  it("filters articles by category and search text", async () => {
    const { get } = setup();
    const byCat = await get("/api/public/articles?section=education&category=kesehatan-mental");
    expect(byCat.body.items.map((a: any) => a.slug)).toEqual(["contoh-kesehatan-mental"]);
    const byQ = await get("/api/public/articles?section=education&q=pertolongan");
    expect(byQ.body.items.map((a: any) => a.slug)).toEqual(["contoh-pertolongan-pertama"]);
  });

  it("treats LIKE wildcards in search literally", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/articles?section=education&q=%25");
    expect(body.total).toBe(0);
  });

  it("paginates", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/articles?section=education&pageSize=2&page=2");
    expect(body.items).toHaveLength(1);
    expect(body.total).toBe(3);
  });

  it("rejects invalid query parameters", async () => {
    const { get } = setup();
    expect((await get("/api/public/articles?category=DROP%20TABLE")).res.status).toBe(400);
    expect((await get("/api/public/articles?section=secret")).res.status).toBe(400);
    expect((await get("/api/public/facilities?q=" + "x".repeat(101))).res.status).toBe(400);
  });

  it("lists only active facilities and filters by type, region and text", async () => {
    const { get } = setup();
    const all = await get("/api/public/facilities");
    const slugs = all.body.map((f: any) => f.slug);
    expect(slugs).not.toContain("contoh-klinik-nonaktif");
    expect(slugs).toHaveLength(4);
    const clinics = await get("/api/public/facilities?type=klinik");
    expect(clinics.body.map((f: any) => f.slug)).toEqual(["contoh-klinik-b"]);
    const region = await get("/api/public/facilities?region=wilayah-contoh-1");
    expect(region.body).toHaveLength(2);
    const text = await get("/api/public/facilities?q=apotek");
    expect(text.body.map((f: any) => f.slug)).toEqual(["contoh-apotek-c"]);
  });

  it("only publishes opening hours that are verified", async () => {
    const { get } = setup();
    const verified = await get("/api/public/facilities/contoh-klinik-b");
    expect(verified.body.openingHours).toBe("[Jam operasional contoh]");
    const { DB } = setup();
    DB.raw.exec(`UPDATE facilities SET opening_hours = '24 jam', hours_verified = 0 WHERE slug = 'contoh-rumah-sakit-a'`);
    const app = createApp();
    const res = await app.request("/api/public/facilities/contoh-rumah-sakit-a", undefined, { DB, APP_ENV: "development" } as unknown as Env);
    expect(((await res.json()) as any).openingHours).toBeNull();
  });

  it("only offers regions that have visible facilities", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/facility-filters");
    expect(body.types.length).toBe(6);
    expect(body.regions.map((r: any) => r.slug)).toEqual(["wilayah-contoh-1", "wilayah-contoh-2", "wilayah-contoh-3"]);
  });

  it("lists only active hotlines in priority order", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/hotlines");
    expect(body.map((h: any) => h.category)).toEqual(["emergency", "menkes", "satgas"]);
  });

  it("returns home data with counts derived from the database", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/home");
    expect(body.counts).toEqual({ articles: 3, facilities: 4, programs: 2 });
    expect(body.latestNews.every((a: any) => a.kind !== "education")).toBe(true);
    expect(body.featuredFacilities).toHaveLength(3);
  });

  it("never leaks sample data in production", async () => {
    const { get } = setup("production");
    const home = await get("/api/public/home");
    expect(home.body.latestArticles).toEqual([]);
    expect(home.body.counts).toEqual({ articles: 0, facilities: 0, programs: 0 });
    expect((await get("/api/public/facilities")).body).toEqual([]);
    expect((await get("/api/public/hotlines")).body).toEqual([]);
    expect((await get("/api/public/facilities/contoh-klinik-b")).res.status).toBe(404);
  });

  it("does not expose internal-only columns", async () => {
    const { get } = setup();
    const { body } = await get("/api/public/facilities/contoh-klinik-b");
    expect(body).not.toHaveProperty("is_active");
    expect(body).not.toHaveProperty("hours_verified");
    expect(body).not.toHaveProperty("created_at");
  });

  it("is read-only", async () => {
    const { get } = setup();
    const { res } = await get("/api/public/articles", { method: "POST", body: "{}" });
    expect(res.status).toBe(405);
  });

  it("works on an empty database (no seed)", async () => {
    const { get } = setup("development", false);
    const { res, body } = await get("/api/public/home");
    expect(res.status).toBe(200);
    expect(body.counts).toEqual({ articles: 0, facilities: 0, programs: 0 });
  });
});

describe("admin API", () => {
  it("denies every request until authentication exists", async () => {
    const { get } = setup();
    for (const [path, method] of [
      ["/api/admin", "GET"],
      ["/api/admin/articles", "GET"],
      ["/api/admin/articles", "POST"],
      ["/api/admin/users/1", "DELETE"],
    ] as const) {
      const { res } = await get(path, { method });
      expect(res.status).toBe(401);
    }
  });
});
