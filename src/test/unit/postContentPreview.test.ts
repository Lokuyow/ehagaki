import { describe, expect, it } from "vitest";
import {
    buildPostContentRenderModel,
    resolveEventContentBody,
} from "../../lib/postContentPreview";

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

    it("resolves the third content-warning element and retains the warning reason", () => {
        const model = buildPostContentRenderModel({
            sourceContent: "",
            tags: [["content-warning", "Spoiler", "protected body"]],
        });

        expect(resolveEventContentBody("", [["content-warning", "Spoiler", "protected body"]]))
            .toBe("protected body");
        expect(model.previewContent.segments).toEqual([
            { type: "text", text: "protected body" },
        ]);
        expect(model.contentWarning).toEqual({ reason: "Spoiler" });
    });

    it("uses the third content-warning element even when it is empty", () => {
        const tags = [["content-warning", "", ""]];
        const model = buildPostContentRenderModel({
            sourceContent: "must not be used",
            tags,
        });

        expect(resolveEventContentBody("must not be used", tags)).toBe("");
        expect(model.hasRenderableText).toBe(false);
        expect(model.contentWarning).toEqual({ reason: "" });
    });

    it("keeps legacy content-warning events on event.content", () => {
        const tags = [["content-warning", "Spoiler"]];
        const model = buildPostContentRenderModel({
            sourceContent: "legacy body",
            tags,
        });

        expect(resolveEventContentBody("legacy body", tags)).toBe("legacy body");
        expect(model.previewContent.segments).toEqual([
            { type: "text", text: "legacy body" },
        ]);
        expect(model.contentWarning).toEqual({ reason: "Spoiler" });
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

    it("adds media found in tagged body while preserving saved media metadata", () => {
        const savedMedia = {
            url: "https://example.com/saved.png",
            mimeType: "image/png",
            blurhash: "saved-blurhash",
        };
        const model = buildPostContentRenderModel({
            sourceContent: "",
            tags: [[
                "content-warning",
                "",
                "https://example.com/in-body.jpg",
            ]],
            media: [savedMedia],
        });

        expect(model.media.map((item) => item.url)).toEqual([
            savedMedia.url,
            "https://example.com/in-body.jpg",
        ]);
        expect(model.media[0]).toBe(savedMedia);
    });
});
