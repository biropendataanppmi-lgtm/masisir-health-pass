import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import type { PublicRepo } from "./lib/repo";
import { adminRoutes } from "./routes/admin";
import { BadRequest, publicRoutes } from "./routes/public";

export type AppEnv = {
  Bindings: Env;
  Variables: { repo: PublicRepo };
};

export function createApp() {
  const app = new Hono<AppEnv>().basePath("/api");

  app.use("*", secureHeaders());

  // The public API is read-only.
  app.use("/public/*", async (c, next) => {
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      return c.json({ error: { code: "method_not_allowed", message: "Metode tidak diizinkan" } }, 405);
    }
    await next();
  });

  app.get("/health", (c) => c.json({ ok: true, env: c.env.APP_ENV }));
  app.route("/public", publicRoutes);
  app.route("/admin", adminRoutes);

  app.notFound((c) => c.json({ error: { code: "not_found", message: "Endpoint tidak ditemukan" } }, 404));

  app.onError((err, c) => {
    if (err instanceof BadRequest) {
      return c.json({ error: { code: "bad_request", message: err.message } }, 400);
    }
    // Log only the error message and path — never request bodies or personal data.
    console.error(`[api] ${c.req.method} ${new URL(c.req.url).pathname}: ${err.message}`);
    return c.json({ error: { code: "internal", message: "Terjadi kesalahan pada server" } }, 500);
  });

  return app;
}
