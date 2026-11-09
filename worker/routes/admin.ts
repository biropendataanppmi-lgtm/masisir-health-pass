import { Hono } from "hono";
import type { AppEnv } from "../app";

// Internal Management System API — Phase 2.
//
// Until authentication and server-side RBAC are implemented, every admin
// endpoint denies access. Access control is enforced here on the server; the
// client UI is never relied on to protect data.
export const adminRoutes = new Hono<AppEnv>();

adminRoutes.all("*", (c) =>
  c.json(
    {
      error: {
        code: "unauthorized",
        message: "Sistem internal belum diaktifkan. Autentikasi akan tersedia pada Phase 2.",
      },
    },
    401,
  ),
);
