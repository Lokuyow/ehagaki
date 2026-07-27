import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { readable } from "svelte/store";
import PostHistoryActionMenu from "../../components/PostHistoryActionMenu.svelte";

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => key),
    locale: readable("ja-JP"),
}));

describe("PostHistoryActionMenu", () => {
    it("shows a tooltip for the footer action trigger", async () => {
        render(PostHistoryActionMenu, {
            triggerAriaLabel: "アクションを表示",
            tooltipContent: "アクションを表示",
            enableTooltip: true,
            items: undefined,
        });

        const trigger = screen.getByRole("button", { name: "アクションを表示" });
        await fireEvent.mouseOver(trigger);

        await waitFor(() => {
            expect(trigger.hasAttribute("data-tooltip-trigger")).toBe(true);
        });
    });
});
