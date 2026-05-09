import { describe, expect, it } from "vitest";

import {
    buildPreview,
    buildPreviewContent,
} from "../../lib/postHistoryDialogUtils";

describe("postHistoryDialogUtils", () => {
    it("buildPreview trims content and preserves a blank placeholder", () => {
        expect(buildPreview("  hello\n")).toBe("hello");
        expect(buildPreview("   ")).toBe(" ");
    });

    it("buildPreviewContent resolves emoji from event tags only", () => {
        const result = buildPreviewContent({
            content: "before :blobcat: after :missing:\n:party:",
            tags: [
                ["emoji", "blobcat", "https://example.com/blobcat.webp"],
                ["emoji", "party", "https://example.com/party.webp"],
            ],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "before " },
            {
                type: "emoji",
                shortcode: "blobcat",
                shortcodeLower: "blobcat",
                rawShortcodeText: ":blobcat:",
                url: "https://example.com/blobcat.webp",
            },
            { type: "text", text: " after :missing:\n" },
            {
                type: "emoji",
                shortcode: "party",
                shortcodeLower: "party",
                rawShortcodeText: ":party:",
                url: "https://example.com/party.webp",
            },
        ]);
        expect(result.emojiUrls).toEqual([
            "https://example.com/blobcat.webp",
            "https://example.com/party.webp",
        ]);
    });

    it("ignores invalid tags and keeps the first valid duplicate shortcode mapping", () => {
        const result = buildPreviewContent({
            content: ":blobcat: :BLOBCAT: :bad:",
            tags: [
                ["emoji", "blobcat", "notaurl"],
                ["emoji", "blobcat", "https://example.com/first.webp"],
                ["emoji", "blobcat", "https://example.com/second.webp"],
            ],
        });

        expect(result.segments).toEqual([
            {
                type: "emoji",
                shortcode: "blobcat",
                shortcodeLower: "blobcat",
                rawShortcodeText: ":blobcat:",
                url: "https://example.com/first.webp",
            },
            { type: "text", text: " " },
            {
                type: "emoji",
                shortcode: "blobcat",
                shortcodeLower: "blobcat",
                rawShortcodeText: ":BLOBCAT:",
                url: "https://example.com/first.webp",
            },
            { type: "text", text: " :bad:" },
        ]);
        expect(result.emojiUrls).toEqual(["https://example.com/first.webp"]);
    });
});