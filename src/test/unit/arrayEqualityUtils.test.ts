import { describe, expect, it } from "vitest";
import { areStringArraysEqual } from "../../lib/utils/arrayEqualityUtils";

describe("areStringArraysEqual", () => {
    it("treats undefined and empty arrays as equal", () => {
        expect(areStringArraysEqual(undefined, [])).toBe(true);
    });

    it("treats null and empty arrays as equal", () => {
        expect(areStringArraysEqual(null, [])).toBe(true);
    });

    it("returns true for equal contents in the same order", () => {
        expect(areStringArraysEqual(["a", "b"], ["a", "b"])).toBe(true);
    });

    it("returns false when the order differs", () => {
        expect(areStringArraysEqual(["a", "b"], ["b", "a"])).toBe(false);
    });

    it("returns false when the lengths differ", () => {
        expect(areStringArraysEqual(["a"], ["a", "b"])).toBe(false);
    });

    it("compares duplicate elements position by position", () => {
        expect(areStringArraysEqual(["a", "a", "b"], ["a", "b", "a"])).toBe(false);
    });

    it("does not mutate the input arrays", () => {
        const left = ["a", "b"];
        const right = ["a", "b"];
        const leftSnapshot = [...left];
        const rightSnapshot = [...right];

        expect(areStringArraysEqual(left, right)).toBe(true);
        expect(left).toEqual(leftSnapshot);
        expect(right).toEqual(rightSnapshot);
    });
});
