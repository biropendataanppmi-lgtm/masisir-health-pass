import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

// Minimal D1Database implementation over node:sqlite, enough for the
// prepared-statement API used by the Worker (prepare/bind/first/all/run).
// It lets the API be tested against the real migrations without Wrangler.

type Value = string | number | null | bigint | Uint8Array;

class Statement {
  constructor(
    private db: DatabaseSync,
    private sql: string,
    private params: Value[] = [],
  ) {}
  bind(...values: unknown[]) {
    return new Statement(this.db, this.sql, values as Value[]);
  }
  async first<T>(): Promise<T | null> {
    return (this.db.prepare(this.sql).get(...this.params) as T | undefined) ?? null;
  }
  async all<T>(): Promise<{ results: T[]; success: true; meta: object }> {
    return { results: this.db.prepare(this.sql).all(...this.params) as T[], success: true, meta: {} };
  }
  async run() {
    const r = this.db.prepare(this.sql).run(...this.params);
    return { success: true, meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } };
  }
}

export function createTestDb(opts: { seed?: boolean } = {}) {
  const db = new DatabaseSync(":memory:");
  const root = join(import.meta.dirname, "..");
  const migrations = readdirSync(join(root, "migrations")).filter((f) => f.endsWith(".sql")).sort();
  for (const m of migrations) db.exec(readFileSync(join(root, "migrations", m), "utf8"));
  if (opts.seed) db.exec(readFileSync(join(root, "seed", "dev-sample.sql"), "utf8"));
  const shim = {
    raw: db,
    prepare: (sql: string) => new Statement(db, sql),
  };
  return shim;
}
