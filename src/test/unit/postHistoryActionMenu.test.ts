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

    it("initializes a deferred menu from its accessible trigger", async () => {
        render(PostHistoryActionMenu, {
            triggerAriaLabel: "アクションを表示",
            tooltipContent: "アクションを表示",
            enableTooltip: true,
            lazy: true,
            items: undefined,
        });

        const trigger = screen.getByRole("button", {
            name: "アクションを表示",
        });
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.hasAttribute("data-dropdown-menu-trigger")).toBe(false);

        await fireEvent.click(trigger);

        await waitFor(() => {
            expect(
                screen
                    .getByRole("button", { name: "アクションを表示" })
                    .hasAttribute("data-dropdown-menu-trigger"),
            ).toBe(true);
        });
        expect(
            screen
                .getByRole("button", { name: "アクションを表示" })
                .getAttribute("aria-expanded"),
        ).toBe("true");
    });

    it("opens a deferred menu with ArrowDown from the trigger", async () => {
        const onOpenChange = vi.fn();
        render(PostHistoryActionMenu, {
            triggerAriaLabel: "アクションを表示",
            lazy: true,
            onOpenChange,
            items: undefined,
        });

        await fireEvent.keyDown(
            screen.getByRole("button", { name: "アクションを表示" }),
            { key: "ArrowDown" },
        );

        await waitFor(() => {
            expect(
                screen
                    .getByRole("button", { name: "アクションを表示" })
                    .getAttribute("aria-expanded"),
            ).toBe("true");
        });
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });
});
