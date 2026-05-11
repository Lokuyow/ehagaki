import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import PostHistoryPreviewContent from "../../components/PostHistoryPreviewContent.svelte";

const emojiUrl = "https://example.com/blobcat.webp";

const previewContent = {
    segments: [
        { type: "text" as const, text: "before " },
        {
            type: "emoji" as const,
            shortcode: "blobcat",
            shortcodeLower: "blobcat",
            rawShortcodeText: ":blobcat:",
            url: emojiUrl,
        },
        { type: "text" as const, text: " after" },
    ],
    emojiUrls: [emojiUrl],
};

describe("PostHistoryPreviewContent", () => {
    it("renders a placeholder slot while loading and uses stored aspect ratio width", () => {
        const { container } = render(PostHistoryPreviewContent, {
            props: {
                previewContent,
                emojiLoadStateByUrl: {
                    [emojiUrl]: "loading",
                },
                emojiImageMetaByUrl: {
                    [emojiUrl]: {
                        aspectRatio: 2,
                    },
                },
            },
        });

        const slot = container.querySelector(
            ".post-history-custom-emoji-slot",
        ) as HTMLSpanElement | null;
        expect(slot).toBeTruthy();
        expect(slot?.getAttribute("style")).toContain("60px");
        expect(
            container.querySelector(".post-history-custom-emoji-placeholder"),
        ).toBeTruthy();
        expect(screen.queryByText(":blobcat:")).toBeNull();
    });

    it("falls back to the default slot width when metadata is unavailable", () => {
        const { container } = render(PostHistoryPreviewContent, {
            props: {
                previewContent,
                emojiLoadStateByUrl: {
                    [emojiUrl]: "loading",
                },
            },
        });

        const slot = container.querySelector(
            ".post-history-custom-emoji-slot",
        ) as HTMLSpanElement | null;
        expect(slot?.getAttribute("style")).toContain("30px");
    });

    it("renders the emoji image inside the same 30px high bottom-aligned slot when ready", () => {
        const { container } = render(PostHistoryPreviewContent, {
            props: {
                previewContent,
                emojiLoadStateByUrl: {
                    [emojiUrl]: "ready",
                },
                emojiImageMetaByUrl: {
                    [emojiUrl]: {
                        aspectRatio: 1.5,
                    },
                },
            },
        });

        const slot = container.querySelector(
            ".post-history-custom-emoji-slot",
        ) as HTMLSpanElement | null;
        const image = screen.getByRole("img", { name: ":blobcat:" });

        expect(slot).toBeTruthy();
        expect(
            container.querySelector(".post-history-custom-emoji-placeholder"),
        ).toBeNull();
        expect(slot?.getAttribute("style")).toContain("height: 30px");
        expect(slot?.getAttribute("style")).toContain("vertical-align: bottom");
        expect((image as HTMLImageElement).className).toContain(
            "post-history-custom-emoji",
        );
    });

    it("shows shortcode fallback only when the emoji load failed", () => {
        const { container } = render(PostHistoryPreviewContent, {
            props: {
                previewContent,
                emojiLoadStateByUrl: {
                    [emojiUrl]: "failed",
                },
            },
        });

        expect(container.querySelector(".post-history-custom-emoji-slot")).toBeNull();
        expect(screen.getByText(":blobcat:")).toBeTruthy();
    });
});
