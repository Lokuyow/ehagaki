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
});
