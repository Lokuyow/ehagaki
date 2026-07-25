import { describe, expect, it } from "vitest";
import { extractPostHistoryMedia } from "../../lib/postHistoryMediaUtils";

describe("postHistoryMediaUtils", () => {
    it("uses shared trailing parsing for content media URLs", () => {
        expect(
            extractPostHistoryMedia({
                content:
                    "画像（https://example.com/image.jpg）。動画 https://example.com/video.mp4!?",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
            },
            {
                url: "https://example.com/video.mp4",
                mimeType: "video/mp4",
            },
        ]);
    });

    it("keeps balanced URL parentheses when extracting media", () => {
        expect(
            extractPostHistoryMedia({
                content: "https://example.com/image_(small).jpg)",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/image_(small).jpg",
                mimeType: "image/jpeg",
            },
        ]);
    });

    it("ignores invalid, relative, and non-HTTP media-looking values", () => {
        expect(
            extractPostHistoryMedia({
                content:
                    "https://] /image.jpg data:image/png,abc ftp://example.com/image.jpg",
                tags: [],
            }),
        ).toEqual([]);
    });
});
