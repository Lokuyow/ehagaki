import { describe, expect, it } from "vitest";

import {
    buildPostHistoryImageGridRows,
    buildPostHistoryMediaLayout,
    buildPostHistoryFullscreenMediaItems,
    buildPreview,
    buildPreviewContent,
    resolvePostHistoryMediaAspectRatio,
    resolvePostHistoryMedia,
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

    it("replaces media urls in text with media segments", () => {
        const result = buildPreviewContent({
            content: "before https://example.com/image.jpg after\nhttps://example.com/video.mp4",
            tags: [],
            media: [
                { url: "https://example.com/image.jpg", mimeType: "image/jpeg" },
                { url: "https://example.com/video.mp4", mimeType: "video/mp4" },
            ],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "before " },
            {
                type: "media",
                url: "https://example.com/image.jpg",
                normalizedUrl: "https://example.com/image.jpg",
                media: { url: "https://example.com/image.jpg", mimeType: "image/jpeg" },
            },
            { type: "text", text: " after\n" },
            {
                type: "media",
                url: "https://example.com/video.mp4",
                normalizedUrl: "https://example.com/video.mp4",
                media: { url: "https://example.com/video.mp4", mimeType: "video/mp4" },
            },
        ]);
    });

    it("resolvePostHistoryMedia dedupes normalized URLs and classifies media kinds", () => {
        const result = resolvePostHistoryMedia([
            {
                url: "https://example.com/image.jpg#viewer",
                mimeType: "image/jpeg",
                alt: "first image",
                dim: "800x600",
            },
            {
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
            },
            {
                url: "https://example.com/video.mp4",
                mimeType: "video/mp4",
            },
            {
                url: "https://example.com/file.bin",
                mimeType: "application/octet-stream",
            },
        ]);

        expect(result).toEqual([
            {
                id: "https://example.com/image.jpg",
                url: "https://example.com/image.jpg#viewer",
                normalizedUrl: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
                alt: "first image",
                dim: "800x600",
                kind: "image",
            },
            {
                id: "https://example.com/video.mp4",
                url: "https://example.com/video.mp4",
                normalizedUrl: "https://example.com/video.mp4",
                mimeType: "video/mp4",
                kind: "video",
            },
            {
                id: "https://example.com/file.bin",
                url: "https://example.com/file.bin",
                normalizedUrl: "https://example.com/file.bin",
                mimeType: "application/octet-stream",
                kind: "other",
            },
        ]);
    });

    it("buildPostHistoryImageGridRows keeps 5-image second row full width", () => {
        const images = resolvePostHistoryMedia([
            { url: "https://example.com/1.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/2.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/3.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/4.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/5.jpg", mimeType: "image/jpeg" },
        ]);

        expect(
            buildPostHistoryImageGridRows(images).map((row) => ({
                itemCount: row.items.length,
                slotCount: row.slotCount,
            })),
        ).toEqual([
            { itemCount: 3, slotCount: 3 },
            { itemCount: 2, slotCount: 2 },
        ]);
    });

    it("buildPostHistoryImageGridRows keeps 7-8 image final rows at thumbnail width", () => {
        const sevenImages = resolvePostHistoryMedia([
            { url: "https://example.com/1.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/2.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/3.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/4.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/5.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/6.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/7.jpg", mimeType: "image/jpeg" },
        ]);
        const eightImages = resolvePostHistoryMedia([
            { url: "https://example.com/1.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/2.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/3.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/4.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/5.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/6.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/7.jpg", mimeType: "image/jpeg" },
            { url: "https://example.com/8.jpg", mimeType: "image/jpeg" },
        ]);

        expect(
            buildPostHistoryImageGridRows(sevenImages).map((row) => ({
                itemCount: row.items.length,
                slotCount: row.slotCount,
            })),
        ).toEqual([
            { itemCount: 3, slotCount: 3 },
            { itemCount: 3, slotCount: 3 },
            { itemCount: 1, slotCount: 3 },
        ]);
        expect(
            buildPostHistoryImageGridRows(eightImages).map((row) => ({
                itemCount: row.items.length,
                slotCount: row.slotCount,
            })),
        ).toEqual([
            { itemCount: 3, slotCount: 3 },
            { itemCount: 3, slotCount: 3 },
            { itemCount: 2, slotCount: 3 },
        ]);
    });

    it("buildPostHistoryMediaLayout returns image-only fullscreen items", () => {
        const result = buildPostHistoryMediaLayout([
            {
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
                alt: "image alt",
                dim: "1024x768",
            },
            {
                url: "https://example.com/video.mp4",
                mimeType: "video/mp4",
                alt: "video alt",
            },
        ]);

        expect(result.images).toHaveLength(1);
        expect(result.videos).toHaveLength(1);
        expect(result.others).toHaveLength(0);
        expect(result.fullscreenMediaItems).toEqual(
            buildPostHistoryFullscreenMediaItems(result.images),
        );
        expect(result.fullscreenMediaItems).toEqual([
            {
                id: "https://example.com/image.jpg",
                src: "https://example.com/image.jpg",
                alt: "image alt",
                type: "image",
                dim: "1024x768",
            },
        ]);
    });

    it("resolvePostHistoryMediaAspectRatio parses imeta dim safely", () => {
        expect(resolvePostHistoryMediaAspectRatio({
            dim: "1200x800",
            kind: "image",
        })).toBe("1200 / 800");
        expect(resolvePostHistoryMediaAspectRatio({
            dim: " 1920 x 1080 ",
            kind: "video",
        })).toBe("1920 / 1080");
    });

    it("resolvePostHistoryMediaAspectRatio falls back on invalid dim", () => {
        expect(resolvePostHistoryMediaAspectRatio({
            dim: "oops",
            kind: "image",
        })).toBe("1 / 1");
        expect(resolvePostHistoryMediaAspectRatio({
            dim: "0x1080",
            kind: "video",
        })).toBe("16 / 9");
    });
});