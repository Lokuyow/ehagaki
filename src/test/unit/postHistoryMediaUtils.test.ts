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

    it("keeps URL-internal apostrophes and full-width punctuation in media URLs", () => {
        expect(
            extractPostHistoryMedia({
                content:
                    "https://example.com/foo'bar/image.jpg https://example.com/記事。続き/video.mp4",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/foo'bar/image.jpg",
                mimeType: "image/jpeg",
            },
            {
                url: "https://example.com/%E8%A8%98%E4%BA%8B%E3%80%82%E7%B6%9A%E3%81%8D/video.mp4",
                mimeType: "video/mp4",
            },
        ]);
    });

    it("keeps internal closing brackets in media URLs", () => {
        expect(
            extractPostHistoryMedia({
                content:
                    "https://example.com/foo)bar/image.jpg https://example.com/foo]bar/video.mp4",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/foo)bar/image.jpg",
                mimeType: "image/jpeg",
            },
            {
                url: "https://example.com/foo]bar/video.mp4",
                mimeType: "video/mp4",
            },
        ]);
    });

    it("keeps closing brackets inside outer-bracketed media URLs", () => {
        expect(
            extractPostHistoryMedia({
                content: "（https://example.com/foo）bar/image.jpg）",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/foo%EF%BC%89bar/image.jpg",
                mimeType: "image/jpeg",
            },
        ]);
    });

    it("extracts media when URL syntax continues after an outer-bracket candidate", () => {
        expect(
            extractPostHistoryMedia({
                content: "(https://example.com/foo)bar/image.jpg)",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/foo)bar/image.jpg",
                mimeType: "image/jpeg",
            },
        ]);
    });

    it("keeps prose after punctuation-confirmed media boundaries", () => {
        expect(
            extractPostHistoryMedia({
                content: "(https://example.com/image.jpg.)next)",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
            },
        ]);
    });

    it("keeps prose after the earliest natural media boundary", () => {
        expect(
            extractPostHistoryMedia({
                content: "(https://example.com/foo)bar/image.jpg.)next)",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/foo)bar/image.jpg",
                mimeType: "image/jpeg",
            },
        ]);
    });

    it("extracts media without absorbing prose after an outer Japanese bracket", () => {
        expect(
            extractPostHistoryMedia({
                content: "（https://example.com/image.jpg）。次の説明（補足）",
                tags: [],
            }),
        ).toEqual([
            {
                url: "https://example.com/image.jpg",
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
