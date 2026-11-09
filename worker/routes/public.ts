import { Hono } from "hono";
import type { ZodType } from "zod";
import type { AppEnv } from "../app";
import { PublicRepo } from "../lib/repo";
import { articleListQuery, facilityListQuery, programListQuery, slugParam } from "../lib/validation";

// Public, read-only API. No authentication, no personal data, GET only.

export const publicRoutes = new Hono<AppEnv>();

publicRoutes.use("*", async (c, next) => {
  c.set(
    "repo",
    new PublicRepo(c.env.DB, {
      // Sample rows are only ever served outside production.
      includeSample: c.env.APP_ENV !== "production",
    }),
  );
  await next();
  if (c.res.status === 200) c.header("Cache-Control", "public, max-age=60");
});

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const r = schema.safeParse(input);
  if (!r.success) throw new BadRequest(r.error.issues[0]?.message ?? "Parameter tidak valid");
  return r.data;
}

export class BadRequest extends Error {}

const notFound = { error: { code: "not_found", message: "Data tidak ditemukan" } };

publicRoutes.get("/home", async (c) => c.json(await c.var.repo.home()));

publicRoutes.get("/articles", async (c) => c.json(await c.var.repo.listArticles(parse(articleListQuery, c.req.query()))));

publicRoutes.get("/article-categories", async (c) => c.json(await c.var.repo.listArticleCategories()));

publicRoutes.get("/articles/:slug", async (c) => {
  const { slug } = parse(slugParam, c.req.param());
  const a = await c.var.repo.getArticle(slug);
  return a ? c.json(a) : c.json(notFound, 404);
});

publicRoutes.get("/facilities", async (c) => c.json(await c.var.repo.listFacilities(parse(facilityListQuery, c.req.query()))));

publicRoutes.get("/facility-filters", async (c) => c.json(await c.var.repo.facilityFilters()));

publicRoutes.get("/facilities/:slug", async (c) => {
  const { slug } = parse(slugParam, c.req.param());
  const f = await c.var.repo.getFacility(slug);
  return f ? c.json(f) : c.json(notFound, 404);
});

publicRoutes.get("/hotlines", async (c) => c.json(await c.var.repo.listHotlines()));

publicRoutes.get("/programs", async (c) => c.json(await c.var.repo.listPrograms(parse(programListQuery, c.req.query()))));

publicRoutes.get("/programs/:slug", async (c) => {
  const { slug } = parse(slugParam, c.req.param());
  const p = await c.var.repo.getProgram(slug);
  return p ? c.json(p) : c.json(notFound, 404);
});

// Statistics are Phase 3. The endpoint exists so the page can show an honest
// "not yet available" state instead of fabricated numbers.
publicRoutes.get("/stats", (c) => c.json({ available: false, sections: [] }));
