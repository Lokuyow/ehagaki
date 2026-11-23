import { describe, expect, it } from "vitest";

import {
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

    it("buildPreviewContent splits hashtags with the editor's boundary rule", () => {
        const result = buildPreviewContent({
            content: "#start mid#not 　#全角 https://example.com/#frag :e:#after",
            tags: [["emoji", "e", "https://example.com/e.webp"]],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "start" },
            { type: "text", text: " mid#not 　" },
            { type: "hashtag", hashtag: "全角" },
            { type: "text", text: " " },
            { type: "link", text: "https://example.com/#frag", href: "https://example.com/#frag" },
            { type: "text", text: " " },
            {
                type: "emoji",
                shortcode: "e",
                shortcodeLower: "e",
                rawShortcodeText: ":e:",
                url: "https://example.com/e.webp",
            },
            { type: "text", text: "#after" },
        ]);
    });

    it("buildPreviewContent trims trailing punctuation from hashtags without a matching t tag", () => {
        const result = buildPreviewContent({
            content: "#nostr。 #タグ」 #ok!?",
            tags: [],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "nostr" },
            { type: "text", text: "。 " },
            { type: "hashtag", hashtag: "タグ" },
            { type: "text", text: "」 " },
            { type: "hashtag", hashtag: "ok" },
            { type: "text", text: "!?" },
        ]);
    });

    it("buildPreviewContent keeps a URL after an untagged hashtag clickable and honors matching t tags", () => {
        const npub = "nostr:npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6";
        const withoutTags = buildPreviewContent({
            content: `#taghttps://example.com/ #x${npub}`,
            tags: [],
        });
        expect(withoutTags.segments).toEqual([
            { type: "hashtag", hashtag: "tag" },
            { type: "link", text: "https://example.com/", href: "https://example.com/" },
            { type: "text", text: " " },
            { type: "hashtag", hashtag: `x${npub}` },
        ]);

        const withTags = buildPreviewContent({
            content: `#taghttps://example.com/ #x${npub}`,
            tags: [["t", "taghttps://example.com/"], ["t", "x"]],
        });
        expect(withTags.segments).toEqual([
            { type: "hashtag", hashtag: "taghttps://example.com/" },
            { type: "text", text: " " },
            { type: "hashtag", hashtag: "x" },
            // 英数字の直後の nostr: は従来どおりメンションにしない
            { type: "text", text: npub },
        ]);
    });

    it("buildPreviewContent stops an untagged hashtag before a known custom emoji", () => {
        const result = buildPreviewContent({
            content: "#tag:e:",
            tags: [["emoji", "e", "https://example.com/e.webp"]],
        });
        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "tag" },
            {
                type: "emoji",
                shortcode: "e",
                shortcodeLower: "e",
                rawShortcodeText: ":e:",
                url: "https://example.com/e.webp",
            },
        ]);
    });

    it("buildPreviewContent does not cut an ASCII word at a shorter t tag", () => {
        const result = buildPreviewContent({
            content: "#nostr #nostrich",
            tags: [["t", "nostr"]],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "nostr" },
            { type: "text", text: " " },
            { type: "hashtag", hashtag: "nostrich" },
        ]);
    });

    it("buildPreviewContent accepts a t tag that ends right before a URL", () => {
        const result = buildPreviewContent({
            content: "#taghttps://example.com/",
            tags: [["t", "tag"]],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "tag" },
            { type: "link", text: "https://example.com/", href: "https://example.com/" },
        ]);
    });

    it("buildPreviewContent leaves a trailing unregistered shortcode as text", () => {
        const result = buildPreviewContent({
            content: "#tag:unknown: #time:12:30",
            tags: [],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "tag" },
            { type: "text", text: ":unknown: " },
            { type: "hashtag", hashtag: "time:12:30" },
        ]);
    });

    it("buildPreviewContent resolves a very long hashtag against t tags in linear time", () => {
        const longTag = "a".repeat(200_000);
        const result = buildPreviewContent({
            content: `#${longTag}`,
            tags: [["t", "a"], ["t", "b"]],
        });

        expect(result.segments).toEqual([{ type: "hashtag", hashtag: longTag }]);
    });

    it("buildPreviewContent prefers the longest t tag that prefixes the hashtag", () => {
        const result = buildPreviewContent({
            content: "#Nostrは楽しい #wow。",
            tags: [["t", "nostr"], ["t", "wow。"]],
        });

        expect(result.segments).toEqual([
            { type: "hashtag", hashtag: "Nostr" },
            { type: "text", text: "は楽しい " },
            { type: "hashtag", hashtag: "wow。" },
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

    it("classifies valid non-media URLs as link segments and preserves trailing punctuation", () => {
        const result = buildPreviewContent({
            content:
                "before https://例え.テスト/パス?q=値#場所）。 after http://localhost:4173/test",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "before " },
            {
                type: "link",
                text: "https://例え.テスト/パス?q=値#場所",
                href: "https://xn--r8jz45g.xn--zckzah/%E3%83%91%E3%82%B9?q=%E5%80%A4#%E5%A0%B4%E6%89%80",
            },
            { type: "text", text: "）。 after " },
            {
                type: "link",
                text: "http://localhost:4173/test",
                href: "http://localhost:4173/test",
            },
        ]);
    });

    it("keeps internal punctuation in link segments and stops at angle brackets", () => {
        const result = buildPreviewContent({
            content:
                "https://example.com/foo'bar https://example.com/記事。続き）。 <https://example.org/path>",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            {
                type: "link",
                text: "https://example.com/foo'bar",
                href: "https://example.com/foo'bar",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/記事。続き",
                href: "https://example.com/%E8%A8%98%E4%BA%8B%E3%80%82%E7%B6%9A%E3%81%8D",
            },
            { type: "text", text: "）。 <" },
            {
                type: "link",
                text: "https://example.org/path",
                href: "https://example.org/path",
            },
            { type: "text", text: ">" },
        ]);
    });

    it("keeps internal closing brackets in link segments", () => {
        const result = buildPreviewContent({
            content:
                "https://example.com/foo)bar https://example.com/search?q=) https://example.com/path)",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            {
                type: "link",
                text: "https://example.com/foo)bar",
                href: "https://example.com/foo)bar",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/search?q=)",
                href: "https://example.com/search?q=)",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/path",
                href: "https://example.com/path",
            },
            { type: "text", text: ")" },
        ]);
    });

    it("keeps surrounding Japanese brackets out of link segments", () => {
        const result = buildPreviewContent({
            content: "（https://example.com/image.jpg）。動画",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "（" },
            {
                type: "link",
                text: "https://example.com/image.jpg",
                href: "https://example.com/image.jpg",
            },
            { type: "text", text: "）。動画" },
        ]);
    });

    it("keeps closing brackets inside outer-bracketed link segments", () => {
        const result = buildPreviewContent({
            content: "（https://example.com/foo）bar）",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "（" },
            {
                type: "link",
                text: "https://example.com/foo）bar",
                href: "https://example.com/foo%EF%BC%89bar",
            },
            { type: "text", text: "）" },
        ]);
    });

    it("keeps URL syntax continuing after an outer-bracket candidate", () => {
        const url = "https://example.com/foo)bar?q=1";
        const result = buildPreviewContent({
            content: `(${url})`,
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "(" },
            { type: "link", text: url, href: url },
            { type: "text", text: ")" },
        ]);
    });

    it("does not include prose after an outer Japanese bracket in link segments", () => {
        const result = buildPreviewContent({
            content: "（https://example.com/path）。次の説明（補足）",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "（" },
            {
                type: "link",
                text: "https://example.com/path",
                href: "https://example.com/path",
            },
            { type: "text", text: "）。次の説明（補足）" },
        ]);
    });

    it("keeps prose after a punctuation-confirmed outer boundary in preview text", () => {
        const result = buildPreviewContent({
            content: "(https://example.com/path.)next)",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "(" },
            {
                type: "link",
                text: "https://example.com/path",
                href: "https://example.com/path",
            },
            { type: "text", text: ".)next)" },
        ]);
    });

    it("keeps the earliest natural boundary after an internal closing bracket", () => {
        const result = buildPreviewContent({
            content: "(https://example.com/foo)bar.)next)",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            { type: "text", text: "(" },
            {
                type: "link",
                text: "https://example.com/foo)bar",
                href: "https://example.com/foo)bar",
            },
            { type: "text", text: ".)next)" },
        ]);
    });

    it("keeps invalid and non-HTTP values as text", () => {
        const result = buildPreviewContent({
            content:
                "https://] javascript:alert(1) data:text/plain,hello /relative",
            tags: [],
            media: [],
        });

        expect(result.segments).toEqual([
            {
                type: "text",
                text:
                    "https://] javascript:alert(1) data:text/plain,hello /relative",
            },
        ]);
    });

    it("keeps custom emoji around links while removing separately rendered media URLs", () => {
        const result = buildPreviewContent({
            content:
                ":blobcat: https://example.com/page https://example.com/image.jpg :party:",
            tags: [
                ["emoji", "blobcat", "https://emoji.example/blobcat.webp"],
                ["emoji", "party", "https://emoji.example/party.webp"],
            ],
            media: [
                {
                    url: "https://example.com/image.jpg",
                    mimeType: "image/jpeg",
                },
            ],
        });

        expect(result.segments.map((segment) => segment.type)).toEqual([
            "emoji",
            "text",
            "link",
            "text",
            "media",
            "text",
            "emoji",
        ]);
        expect(
            result.segments.find((segment) => segment.type === "link"),
        ).toEqual({
            type: "link",
            text: "https://example.com/page",
            href: "https://example.com/page",
        });
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

    it("formatPostHistoryMonthLabel keeps reused formatters separate per locale", () => {
        const now = new Date(2025, 5, 10, 12, 0, 0).getTime();
        const today = new Date(2025, 5, 10, 9, 0, 0).getTime();
        const sameYear = new Date(2025, 2, 15, 14, 0, 0).getTime();
        const options: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric", weekday: "short" };

        expect(formatPostHistoryMonthLabel(today, "ja", now)).toBe("今日");
        expect(formatPostHistoryMonthLabel(today, "en", now)).toBe("today");
        expect(formatPostHistoryMonthLabel(sameYear, "ja", now))
            .toBe(new Intl.DateTimeFormat("ja", options).format(new Date(sameYear)));
        expect(formatPostHistoryMonthLabel(sameYear, "en", now))
            .toBe(new Intl.DateTimeFormat("en", options).format(new Date(sameYear)));
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
