import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// One build: the React SPA (public portal + future /admin UI) is served as
// static assets, and every /api/* request is handled by the Hono Worker.
export default defineConfig({
  plugins: [react(), cloudflare()],
});
