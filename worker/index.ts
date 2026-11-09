import { createApp } from "./app";

// Cloudflare Worker entry. Static assets (the React app) are served by the
// assets binding; only /api/* reaches this handler (see wrangler.jsonc).
export default createApp() satisfies ExportedHandler<Env>;
