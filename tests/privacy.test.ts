import { describe, expect, it } from "vitest";
import { publicTotal, suppressSmallCells } from "../shared/privacy";

describe("suppressSmallCells", () => {
  it("keeps groups at or above the threshold", () => {
    expect(suppressSmallCells([{ label: "A", count: 10 }, { label: "B", count: 25 }], 10)).toEqual([
      { label: "A", count: 10 },
      { label: "B", count: 25 },
    ]);
  });

  it("hides small groups and adds complementary suppression when only one is hidden", () => {
    const out = suppressSmallCells(
      [
        { label: "A", count: 3 },
        { label: "B", count: 40 },
        { label: "C", count: 12 },
      ],
      10,
    );
    // A is too small; C (next smallest) is also hidden so A can't be derived from the total.
    expect(out).toEqual([
      { label: "A", count: null },
      { label: "B", count: 40 },
      { label: "C", count: null },
    ]);
  });

  it("does not add extra suppression when two or more cells are already hidden", () => {
    const out = suppressSmallCells(
      [
        { label: "A", count: 2 },
        { label: "B", count: 4 },
        { label: "C", count: 50 },
      ],
      10,
    );
    expect(out.map((c) => c.count)).toEqual([null, null, 50]);
  });

  it("shows zero counts (they reveal no individual)", () => {
    expect(suppressSmallCells([{ label: "A", count: 0 }, { label: "B", count: 20 }], 10).map((c) => c.count)).toEqual([0, 20]);
  });

  it("rejects an invalid threshold", () => {
    expect(() => suppressSmallCells([], 0)).toThrow();
  });

  it("hides totals below the threshold", () => {
    expect(publicTotal(9, 10)).toBeNull();
    expect(publicTotal(10, 10)).toBe(10);
  });
});
