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

    it("keeps the initial emoji slot width when dimensions resolve later", async () => {
        const view = render(PostHistoryPreviewContent, {
            props: {
                previewContent,
                emojiLoadStateByUrl: { [emojiUrl]: "loading" },
            },
        });
        const slot = view.container.querySelector(
            ".post-history-custom-emoji-slot",
        );
        const initialStyle = slot?.getAttribute("style");
        expect(initialStyle).toContain("width: 30px");

        await view.rerender({
            previewContent,
            emojiLoadStateByUrl: { [emojiUrl]: "ready" },
            emojiImageMetaByUrl: { [emojiUrl]: { aspectRatio: 2 } },
        });

        expect(
            view.container.querySelector(".post-history-custom-emoji-slot")
                ?.getAttribute("style"),
        ).toBe(initialStyle);

        await view.rerender({
            previewContent,
            emojiLoadStateByUrl: { [emojiUrl]: "failed" },
            emojiImageMetaByUrl: { [emojiUrl]: { aspectRatio: 2 } },
        });

        const failedEmoji = view.container.querySelector(
            ".post-history-custom-emoji-failed",
        );
        expect(failedEmoji?.getAttribute("style")).toBe(initialStyle);
        expect(failedEmoji?.getAttribute("aria-label")).toBe(":blobcat:");
        expect(failedEmoji?.getAttribute("tabindex")).toBe("0");
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

        const failedSlot = container.querySelector(
            ".post-history-custom-emoji-failed",
        );
        expect(failedSlot).toBeTruthy();
        expect(failedSlot?.getAttribute("style")).toContain("width: 30px");
        expect(failedSlot?.getAttribute("aria-label")).toBe(":blobcat:");
        expect(failedSlot?.getAttribute("title")).toBe(":blobcat:");
    });

    it("renders native links with safe external attributes while preserving surrounding text", () => {
        const { container } = render(PostHistoryPreviewContent, {
            props: {
                previewContent: {
                    segments: [
                        { type: "text", text: "before\n" },
                        {
                            type: "link",
                            text: "https://例え.テスト/パス",
                            href: "https://xn--r8jz45g.xn--zckzah/%E3%83%91%E3%82%B9",
                        },
                        { type: "text", text: " after" },
                    ],
                    emojiUrls: [],
                },
                isCollapsed: true,
            },
        });

        const link = screen.getByRole("link", {
            name: "https://例え.テスト/パス",
        });
        expect(link.getAttribute("href")).toBe(
            "https://xn--r8jz45g.xn--zckzah/%E3%83%91%E3%82%B9",
        );
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
        expect(container.querySelector(".post-history-preview-text")?.textContent)
            .toBe("before\nhttps://例え.テスト/パス after");
        expect(container.querySelector(".post-history-preview-text")?.classList)
            .toContain("post-history-preview-text-collapsed");
    });
});
