import { describe, expect, it } from "vitest";
import { isHex64 } from "../../lib/utils/nostrHexUtils";

describe("isHex64", () => {
    it("accepts lowercase 64-character hex strings", () => {
        expect(isHex64("a".repeat(64))).toBe(true);
    });

    it("accepts uppercase characters in 64-character hex strings", () => {
        expect(isHex64("A".repeat(32) + "b".repeat(32))).toBe(true);
    });

    it("rejects strings with 63 or 65 characters", () => {
        expect(isHex64("a".repeat(63))).toBe(false);
        expect(isHex64("a".repeat(65))).toBe(false);
    });

    it("rejects non-hex characters", () => {
        expect(isHex64("g".repeat(64))).toBe(false);
        expect(isHex64("0".repeat(63) + "g")).toBe(false);
    });

    it("rejects non-string values", () => {
        expect(isHex64(123)).toBe(false);
        expect(isHex64(null)).toBe(false);
        expect(isHex64(undefined)).toBe(false);
        expect(isHex64({ value: "a".repeat(64) })).toBe(false);
    });
});
