import { describe, expect, it } from "vitest";
import { shortenMiddle } from "../../lib/utils/textDisplayUtils";

describe("shortenMiddle", () => {
    it("keeps short values unchanged", () => {
        expect(shortenMiddle("short-value", 10, 4)).toBe("short-value");
    });

    it("keeps boundary-length values unchanged", () => {
        expect(shortenMiddle("12345678901234567", 10, 4)).toBe("12345678901234567");
    });

    it("shortens long values with a middle ellipsis", () => {
        expect(shortenMiddle("123456789012345678", 10, 4)).toBe("1234567890...5678");
    });
});
