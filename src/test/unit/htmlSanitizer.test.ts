import { describe, expect, it } from "vitest";
import { sanitizeHtmlAllowingWbr } from "../../lib/utils/htmlSanitizer";

describe("sanitizeHtmlAllowingWbr", () => {
    it("escapes HTML special characters", () => {
        expect(sanitizeHtmlAllowingWbr('<img src=x onerror="alert(1)"> & text')).toBe(
            "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; text",
        );
    });

    it("preserves literal wbr tags as line break opportunities", () => {
        expect(sanitizeHtmlAllowingWbr("画像を<wbr>アップロード中")).toBe(
            "画像を<wbr>アップロード中",
        );
    });

    it("escapes tags that only resemble wbr", () => {
        expect(sanitizeHtmlAllowingWbr("a<WBR>b<wbr class=x>c")).toBe(
            "a&lt;WBR&gt;b&lt;wbr class=x&gt;c",
        );
    });
});
