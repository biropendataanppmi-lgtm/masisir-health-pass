import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Separate from vite.config.ts so tests do not start the Cloudflare plugin.
// Worker/API tests run in Node against a real SQLite database (node:sqlite)
// with the same migrations; UI tests opt into jsdom per file.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["tests/setup.ts"],
  },
});
