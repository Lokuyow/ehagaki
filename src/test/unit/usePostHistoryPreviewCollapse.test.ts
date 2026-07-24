import { cleanup, render, screen, waitFor } from "@testing-library/svelte";
import { afterEach, describe, expect, it } from "vitest";
import PostHistoryPreviewCollapseHarness from "./fixtures/PostHistoryPreviewCollapseHarness.svelte";

describe("usePostHistoryPreviewCollapse", () => {
    afterEach(() => {
        cleanup();
    });

    it("forceCollapsibleを測定前の初回描画から同期的に折りたたむ", () => {
        const content = Array.from(
            { length: 2_001 },
            (_, index) => `line ${index + 1}`,
        ).join("\n");
        const { container } = render(PostHistoryPreviewCollapseHarness, {
            content,
            forceCollapsible: true,
        });

        const previewContent = container.querySelector(".event-content");
        const expandButton = screen.getByRole("button", {
            name: "もっと見る",
        });
        expect(previewContent?.classList).toContain(
            "event-content-collapsed",
        );
        expect(previewContent?.getAttribute("style")).toContain(
            "max-height: calc(7.25em)",
        );
        expect(expandButton.getAttribute("aria-expanded")).toBe("false");
        expect(expandButton.getAttribute("aria-controls")).toBe(
            previewContent?.id,
        );
    });

    it("通常contentは初回描画では決め打ちせず非同期測定後に折りたたむ", async () => {
        const content = Array.from(
            { length: 6 },
            (_, index) => `line ${index + 1}`,
        ).join("\n");
        const { container } = render(PostHistoryPreviewCollapseHarness, {
            content,
            forceCollapsible: false,
        });

        const previewContent = container.querySelector(".event-content");
        expect(previewContent?.classList).not.toContain(
            "event-content-collapsed",
        );
        expect(
            screen.queryByRole("button", { name: "もっと見る" }),
        ).toBeNull();

        await waitFor(() => {
            expect(previewContent?.classList).toContain(
                "event-content-collapsed",
            );
            expect(
                screen.getByRole("button", { name: "もっと見る" }),
            ).not.toBeNull();
        });
    });
});
