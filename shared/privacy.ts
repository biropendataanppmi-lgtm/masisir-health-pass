// Small-cell suppression for public health statistics.
//
// Public statistics must only show aggregates. Any group whose count is below
// the minimum threshold is hidden, because small groups (e.g. "2 people from
// family X with condition Y") can identify individuals. When exactly one cell
// in a breakdown is suppressed, its value could be recovered from the total,
// so the next-smallest cell is suppressed as well (complementary suppression).

/** Default minimum group size before a count may be published. Decided by the owner; see docs/DECISIONS.md. */
export const MIN_PUBLIC_CELL_SIZE = 10;

export interface Cell {
  label: string;
  count: number;
}

export interface PublicCell {
  label: string;
  /** null = suppressed (too few records to publish safely). */
  count: number | null;
}

export function suppressSmallCells(cells: Cell[], min = MIN_PUBLIC_CELL_SIZE): PublicCell[] {
  if (!Number.isInteger(min) || min < 1) throw new Error("min must be a positive integer");
  const suppressed = new Set<number>();
  cells.forEach((c, i) => {
    if (c.count > 0 && c.count < min) suppressed.add(i);
  });
  if (suppressed.size === 1) {
    // Complementary suppression: hide the smallest remaining non-zero cell.
    let candidate = -1;
    cells.forEach((c, i) => {
      if (suppressed.has(i) || c.count <= 0) return;
      if (candidate === -1 || c.count < cells[candidate].count) candidate = i;
    });
    if (candidate !== -1) suppressed.add(candidate);
  }
  return cells.map((c, i) => ({ label: c.label, count: suppressed.has(i) ? null : c.count }));
}

/** Total that is safe to publish: hidden entirely when itself below the threshold. */
export function publicTotal(total: number, min = MIN_PUBLIC_CELL_SIZE): number | null {
  return total >= min ? total : null;
}
