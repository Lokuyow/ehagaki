import { describe, expect, it } from "vitest";
import { buildPostContentRenderModel } from "../../lib/postContentPreview";

describe("postContentPreview", () => {
    it("uses sourceContent for media and displayContent for rendered text", () => {
        const model = buildPostContentRenderModel({
            sourceContent:
                "visible text https://example.com/late.jpg :late_emoji:",
            displayContent: "visible text",
            tags: [
                [
                    "emoji",
                    "late_emoji",
                    "https://example.com/late-emoji.webp",
                ],
            ],
        });

        expect(model.previewContent.segments).toEqual([
            { type: "text", text: "visible text" },
        ]);
        expect(model.previewContent.emojiUrls).toEqual([]);
        expect(model.mediaLayout.images.map((item) => item.url)).toEqual([
            "https://example.com/late.jpg",
        ]);
    });

    it("defaults displayContent to sourceContent", () => {
        const model = buildPostContentRenderModel({
            sourceContent: "before :party: after",
            tags: [
                ["emoji", "party", "https://example.com/party.webp"],
            ],
        });

        expect(model.previewContent.emojiUrls).toEqual([
            "https://example.com/party.webp",
        ]);
        expect(model.hasRenderableText).toBe(true);
    });

    it("extracts media only when media is omitted", () => {
        const omitted = buildPostContentRenderModel({
            sourceContent: "https://example.com/image.jpg",
            tags: [],
        });
        const explicitEmpty = buildPostContentRenderModel({
            sourceContent: "https://example.com/image.jpg",
            tags: [],
            media: [],
        });

        expect(omitted.mediaLayout.images).toHaveLength(1);
        expect(omitted.previewContent.segments).toEqual([
            {
                type: "media",
                url: "https://example.com/image.jpg",
                normalizedUrl: "https://example.com/image.jpg",
                media: {
                    url: "https://example.com/image.jpg",
                    mimeType: "image/jpeg",
                },
            },
        ]);
        expect(explicitEmpty.media).toEqual([]);
        expect(explicitEmpty.mediaLayout.items).toEqual([]);
        expect(explicitEmpty.previewContent.segments).toEqual([
            {
                type: "link",
                text: "https://example.com/image.jpg",
                href: "https://example.com/image.jpg",
            },
        ]);
    });

    it("preserves explicit media metadata and order", () => {
        const media = [
            {
                url: "https://example.com/video.mp4",
                mimeType: "video/mp4",
                blurhash: "video-hash",
                dim: "1920x1080",
                alt: "video alt",
                size: 123,
                uploadProtocol: "blossom" as const,
            },
            {
                url: "https://example.com/image.jpg",
                mimeType: "image/jpeg",
                blurhash: "image-hash",
                dim: "800x600",
                alt: "image alt",
                size: 456,
                uploadProtocol: "nip96" as const,
            },
        ];

        const model = buildPostContentRenderModel({
            sourceContent: media.map((item) => item.url).join(" "),
            tags: [],
            media,
        });

        expect(model.media).toBe(media);
        expect(model.mediaLayout.items.map((item) => ({
            url: item.url,
            mimeType: item.mimeType,
            blurhash: item.blurhash,
            dim: item.dim,
            alt: item.alt,
            size: item.size,
            uploadProtocol: item.uploadProtocol,
        }))).toEqual(media);
    });

    it("keeps unmatched imeta as an eHagaki compatibility behavior", () => {
        const model = buildPostContentRenderModel({
            sourceContent: "text only",
            tags: [
                [
                    "imeta",
                    "url https://example.com/unmatched.jpg",
                    "m image/jpeg",
                ],
            ],
        });

        expect(model.mediaLayout.images.map((item) => item.url)).toEqual([
            "https://example.com/unmatched.jpg",
        ]);
    });
});
