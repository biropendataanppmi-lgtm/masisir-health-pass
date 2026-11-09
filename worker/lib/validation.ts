import { z } from "zod";

// All query parameters are validated on the server. Unknown values are
// rejected with 400 rather than silently ignored.

const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug tidak valid");

const optionalSlug = slug.optional();

const search = z
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((v) => (v ? v : undefined));

const page = z.coerce.number().int().min(1).max(1000).default(1);

export const slugParam = z.object({ slug });

export const articleListQuery = z.object({
  section: z.enum(["education", "news"]).default("education"),
  category: optionalSlug,
  q: search,
  page,
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export const facilityListQuery = z.object({
  type: optionalSlug,
  region: optionalSlug,
  q: search,
});

export const programListQuery = z.object({
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
});

/** Escape LIKE wildcards so user input is matched literally. */
export function likePattern(q: string): string {
  return `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}
