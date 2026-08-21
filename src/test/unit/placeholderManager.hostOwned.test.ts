import { describe, expect, it, vi } from "vitest";
import { replacePlaceholdersWithResults } from "../../lib/editor/placeholderManager";

describe("Host-owned media metadata replacement", () => {
    it("keeps host MIME and imeta fields on a video node without URL inference", async () => {
        const file = new File(["video"], "clip.bin", { type: "video/mp4" });
        let replacedAttrs: Record<string, unknown> | undefined;
        const node = {
            type: { name: "video" },
            attrs: { src: "placeholder-video", isPlaceholder: true },
            nodeSize: 1,
        };
        const editor: any = {
            state: {
                doc: {
                    descendants: (callback: (value: typeof node, pos: number) => void) => callback(node, 1),
                },
                tr: {
                    setNodeMarkup: vi.fn((_pos: number, _type: unknown, attrs: Record<string, unknown>) => {
                        replacedAttrs = attrs;
                        return {};
                    }),
                },
            },
            view: { dispatch: vi.fn() },
        };

        await replacePlaceholdersWithResults(
            [{
                success: true,
                hostOwnedMedia: true,
                url: "https://host.example/media/abcdef",
                uploadProtocol: "custom-http",
                nip94: { m: "video/mp4", alt: "clip", size: "42", dim: "640x360", x: "a".repeat(64) },
            }],
            [{ file, placeholderId: "placeholder-video" }],
            editor,
            {},
            {},
            { update: vi.fn() },
            async () => null,
            false,
        );

        expect(replacedAttrs).toMatchObject({
            src: "https://host.example/media/abcdef",
            isPlaceholder: false,
            m: "video/mp4",
            alt: "clip",
            size: "42",
            dim: "640x360",
            x: "a".repeat(64),
            uploadProtocol: "custom-http",
        });
    });

    it("does not treat self-publish custom-http results as Host-owned metadata", async () => {
        const file = new File(["png"], "original.png", { type: "image/png" });
        let replacedImageAttrs: Record<string, unknown> | undefined;
        const imageNode = {
            type: { name: "image" },
            attrs: { src: "placeholder-image", isPlaceholder: true },
            nodeSize: 1,
        };
        const imageEditor: any = {
            state: {
                doc: { descendants: (callback: (value: typeof imageNode, pos: number) => void) => callback(imageNode, 1) },
                tr: {
                    setNodeMarkup: vi.fn((_pos: number, _type: unknown, attrs: Record<string, unknown>) => {
                        replacedImageAttrs = attrs;
                        return {};
                    }),
                },
            },
            view: { dispatch: vi.fn() },
        };

        await replacePlaceholdersWithResults(
            [{
                success: true,
                url: "https://self.example/media/converted.webp",
                uploadProtocol: "custom-http",
                nip94: { m: "image/webp", alt: "self response alt" },
            }],
            [{ file, placeholderId: "placeholder-image" }],
            imageEditor,
            {},
            {},
            { update: vi.fn() },
            async () => null,
            false,
        );

        expect(replacedImageAttrs).toMatchObject({
            src: "https://self.example/media/converted.webp",
            isPlaceholder: false,
            uploadProtocol: "custom-http",
        });
        expect(replacedImageAttrs).not.toHaveProperty("m");
        expect(replacedImageAttrs).not.toHaveProperty("alt");

        let replacedVideoAttrs: Record<string, unknown> | undefined;
        const videoFile = new File(["video"], "clip.mp4", { type: "video/mp4" });
        const videoNode = {
            type: { name: "video" },
            attrs: { src: "placeholder-video", isPlaceholder: true },
            nodeSize: 1,
        };
        const videoEditor: any = {
            state: {
                doc: { descendants: (callback: (value: typeof videoNode, pos: number) => void) => callback(videoNode, 1) },
                tr: {
                    setNodeMarkup: vi.fn((_pos: number, _type: unknown, attrs: Record<string, unknown>) => {
                        replacedVideoAttrs = attrs;
                        return {};
                    }),
                },
            },
            view: { dispatch: vi.fn() },
        };

        await replacePlaceholdersWithResults(
            [{
                success: true,
                url: "https://self.example/media/clip",
                uploadProtocol: "custom-http",
                nip94: { m: "video/mp4", alt: "self video alt", dim: "640x360" },
            }],
            [{ file: videoFile, placeholderId: "placeholder-video" }],
            videoEditor,
            {},
            {},
            { update: vi.fn() },
            async () => null,
            false,
        );

        expect(replacedVideoAttrs).toEqual({
            src: "https://self.example/media/clip",
            isPlaceholder: false,
        });
    });
});
