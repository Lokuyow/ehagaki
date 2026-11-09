import { describe, expect, it } from "vitest";
import { isRecord } from "../../lib/utils/typeGuards";

describe("isRecord", () => {
    it("accepts plain objects", () => {
        expect(isRecord({})).toBe(true);
        expect(isRecord({ key: "value" })).toBe(true);
        expect(isRecord(Object.create(null))).toBe(true);
    });

    it("rejects null, arrays and primitives", () => {
        expect(isRecord(null)).toBe(false);
        expect(isRecord(undefined)).toBe(false);
        expect(isRecord([])).toBe(false);
        expect(isRecord("text")).toBe(false);
        expect(isRecord(1)).toBe(false);
        expect(isRecord(true)).toBe(false);
    });
});
