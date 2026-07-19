import { describe, expect, it } from "vitest";

import {
    buildPostHistoryImageGridRows,
    buildPostHistoryMediaLayout,
    buildPostHistoryFullscreenMediaItems,
    buildPreview,
    buildPreviewContent,
    buildChannelRelayHints,
    formatPostedAtExact,
    formatPostHistoryMonthLabel,
    resolvePostHistoryMediaDimensionHints,
    resolvePostHistoryMediaAspectRatio,
    resolvePostHistoryMediaRenderState,
    resolvePostHistoryMedia,
} from "../../lib/postHistoryDialogUtils";

describe("postHistoryDialogUtils", () => {
    it("channel表示のread候補を取得元、履歴hint、accepted fallback、DBの順で組み立てる", () => {
        const post = {
            channelRelayHints: ["wss://root.example.com/"],
            fetchedRelays: ["wss://fetched.example.com/"],
            relayHints: ["wss://history.example.com/"],
            acceptedRelays: ["wss://accepted.example.com/"],
        };
        const cache = {
            relayHints: ["wss://verified-source.example.com/"],
            relays: ["wss://verified-write.example.com/"],
        };

        expect(buildChannelRelayHints(post as never, cache as never)).toEqual([
            "wss://root.example.com/",
            "wss://fetched.example.com/",
            "wss://history.example.com/",
            "wss://accepted.example.com/",
            "wss://verified-source.example.com/",
            "wss://verified-write.example.com/",
        ]);
    });

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
                url: "https://example.com/image.jpg",
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

    it("resolvePostHistoryMedia filters non-http(s) media URLs", () => {
        const result = resolvePostHistoryMedia([
            {
                url: "javascript:alert(1)",
                mimeType: "image/jpeg",
            },
            {
                url: "data:text/html,<svg></svg>",
                mimeType: "image/jpeg",
            },
            {
                url: "https://example.com/safe.jpg#viewer",
                mimeType: "image/jpeg",
            },
            {
                url: "http://example.com/safe.mp4",
                mimeType: "video/mp4",
            },
        ]);

        expect(result).toEqual([
            {
                id: "https://example.com/safe.jpg",
                url: "https://example.com/safe.jpg",
                normalizedUrl: "https://example.com/safe.jpg",
                mimeType: "image/jpeg",
                kind: "image",
            },
            {
                id: "http://example.com/safe.mp4",
                url: "http://example.com/safe.mp4",
                normalizedUrl: "http://example.com/safe.mp4",
                mimeType: "video/mp4",
                kind: "video",
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

    it("resolvePostHistoryMediaDimensionHints keeps exact dimensions when available", () => {
        expect(resolvePostHistoryMediaDimensionHints({
            dim: "1200x800",
            kind: "image",
        })).toEqual({
            width: 1200,
            height: 800,
            aspectRatio: "1200 / 800",
            hasExactDimensions: true,
        });

        expect(resolvePostHistoryMediaDimensionHints({
            dim: "oops",
            kind: "video",
        })).toEqual({
            aspectRatio: "16 / 9",
            hasExactDimensions: false,
        });
    });

    it("resolvePostHistoryMediaRenderState distinguishes ready and placeholder states", () => {
        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: true,
            cached: true,
            previewObjectUrl: "blob:cached-image",
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: false,
            hasMetadataHint: true,
        })).toBe("ready");

        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: true,
            cached: true,
            previewObjectUrl: undefined,
            isLoadingPreview: true,
            isCaching: false,
            hasFetchFailed: false,
            hasMetadataHint: true,
        })).toBe("cache-materializing");

        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: false,
            cached: false,
            previewObjectUrl: undefined,
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: false,
            hasMetadataHint: true,
        })).toBe("placeholder");

        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: true,
            cached: false,
            previewObjectUrl: undefined,
            isLoadingPreview: false,
            isCaching: true,
            hasFetchFailed: false,
            hasMetadataHint: false,
        })).toBe("loading");

        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: true,
            cached: false,
            previewObjectUrl: undefined,
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: true,
            hasMetadataHint: true,
        })).toBe("error");

        expect(resolvePostHistoryMediaRenderState({
            hasResolvedCache: true,
            cached: false,
            previewObjectUrl: undefined,
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: false,
            hasMetadataHint: false,
        })).toBe("unknown");
    });

    it("formatPostHistoryMonthLabel returns 今日 for today and 昨日 for yesterday in Japanese", () => {
        const now = new Date(2025, 5, 10, 12, 0, 0).getTime();
        const today = new Date(2025, 5, 10, 9, 0, 0).getTime();
        const yesterday = new Date(2025, 5, 9, 23, 0, 0).getTime();

        expect(formatPostHistoryMonthLabel(today, "ja", now)).toBe("今日");
        expect(formatPostHistoryMonthLabel(yesterday, "ja", now)).toBe("昨日");
    });

    it("formatPostHistoryMonthLabel returns month/day/weekday for same-year dates", () => {
        const now = new Date(2025, 5, 10, 12, 0, 0).getTime();
        const postedAt = new Date(2025, 2, 15, 14, 0, 0).getTime();

        expect(formatPostHistoryMonthLabel(postedAt, "ja", now)).toBe(
            new Intl.DateTimeFormat("ja", {
                month: "numeric",
                day: "numeric",
                weekday: "short",
            }).format(new Date(postedAt)),
        );
    });

    it("formatPostHistoryMonthLabel returns year/month for previous-year dates", () => {
        const now = new Date(2025, 5, 10, 12, 0, 0).getTime();
        const postedAt = new Date(2024, 11, 31, 12, 0, 0).getTime();

        expect(formatPostHistoryMonthLabel(postedAt, "ja", now)).toBe(
            new Intl.DateTimeFormat("ja", {
                year: "numeric",
                month: "numeric",
            }).format(new Date(postedAt)),
        );
    });

    it("formatPostedAtExact returns full date and time with seconds", () => {
        const postedAt = new Date(2025, 5, 10, 12, 34, 56).getTime();

        expect(formatPostedAtExact(postedAt, "ja")).toBe(
            new Intl.DateTimeFormat("ja", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).format(new Date(postedAt)),
        );
    });
});
