import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Regression test: commit ba654c5 accidentally removed the named export that
 * external callers use to push files into the composer when invoked from an
 * Android/iOS share target. This lightweight check makes sure the export stays
 * in place even if the component script is refactored again.
 */
describe("PostComponent upload API", () => {
  it("keeps the uploadFiles named export available", () => {
    const componentPath = path.resolve(
      process.cwd(),
      "src",
      "components",
      "PostComponent.svelte"
    );
    const source = readFileSync(componentPath, "utf8");

    expect(source).toMatch(/export\s+(?:async\s+)?function\s+uploadFiles\s*\(/);
  });
});
