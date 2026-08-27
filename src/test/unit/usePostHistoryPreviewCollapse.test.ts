import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import PostHistoryPreviewCollapseHarness from "./fixtures/PostHistoryPreviewCollapseHarness.svelte";

describe("usePostHistoryPreviewCollapse", () => {
    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    function createItems(count: number, startAt = 0) {
        return Array.from({ length: count }, (_, index) => ({
            eventId: `preview-${startAt + index}`,
            content: Array.from(
                { length: 6 },
                (_, lineIndex) => `item ${startAt + index}, line ${lineIndex}`,
            ).join("\n"),
        }));
    }

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

    it("mount と posts 更新が重なっても、新規 50 件だけを一度ずつ測定する", async () => {
        const getComputedStyleSpy = vi.spyOn(window, "getComputedStyle");
        const initialItems = createItems(50);
        const view = render(PostHistoryPreviewCollapseHarness, {
            items: initialItems,
        });

        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(50);
        });

        await view.rerender({
            items: [...initialItems, ...createItems(50, 50)],
        });

        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(100);
        });
    });

    it("resize と emoji 再判定では visible preview 全件を一度だけ再測定する", async () => {
        let resizeCallback: ResizeObserverCallback | undefined;
        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(callback: ResizeObserverCallback) {
                    resizeCallback = callback;
                }

                disconnect() {}
                observe() {}
                unobserve() {}
            },
        );
        const getComputedStyleSpy = vi.spyOn(window, "getComputedStyle");
        render(PostHistoryPreviewCollapseHarness, {
            items: createItems(50),
        });

        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(50);
        });

        await fireEvent.click(screen.getByTestId("remeasure"));
        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(100);
        });

        resizeCallback?.([], {} as ResizeObserver);
        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(150);
        });
    });

    it("forceCollapsible は測定せず、展開状態は維持する", async () => {
        const getComputedStyleSpy = vi.spyOn(window, "getComputedStyle");
        const forceContent = Array.from(
            { length: 6 },
            (_, index) => `line ${index + 1}`,
        ).join("\n");
        const { getByTestId } = render(PostHistoryPreviewCollapseHarness, {
            items: [
                {
                    eventId: "forced",
                    content: forceContent,
                    forceCollapsible: true,
                },
                {
                    eventId: "measured",
                    content: forceContent,
                },
            ],
        });

        await waitFor(() => {
            expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
        });

        const forcePreview = getByTestId("preview-forced");
        expect(forcePreview.classList).toContain("event-content-collapsed");
        const forceButton = screen.getAllByRole("button", {
            name: "もっと見る",
        })[0];
        await fireEvent.click(forceButton);

        expect(forcePreview.classList).not.toContain("event-content-collapsed");
        expect(forceButton.getAttribute("aria-expanded")).toBe("true");
    });
});
