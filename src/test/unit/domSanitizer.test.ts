import { describe, expect, it } from "vitest";
import { sanitizePlainText } from "../../lib/utils/domSanitizer";

describe("sanitizePlainText", () => {
    it("removes tags and attributes while keeping text", () => {
        expect(sanitizePlainText('<p>Hello <strong>World</strong><img src=x onerror="bad()"></p>')).toBe(
            "Hello World",
        );
    });

    it("does not trim surrounding whitespace", () => {
        expect(sanitizePlainText("  text  ")).toBe("  text  ");
    });
});
