import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import PostPreviewFooterActionButton from "../../components/PostPreviewFooterActionButton.svelte";
import PostHistoryActionMenu from "../../components/PostHistoryActionMenu.svelte";

function pointerEnter(target: Element, pointerType: string): Event {
    const event = new MouseEvent("pointerenter", { clientX: 4, clientY: 4 });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    target.dispatchEvent(event);
    return event;
}

const getButton = () => screen.getByRole("button", { name: "返信" });

describe("PostPreviewFooterActionButton lazy tooltip", () => {
    it("renders a plain button until it is hovered or focused", () => {
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信" });

        expect(getButton().hasAttribute("data-tooltip-trigger")).toBe(false);
    });

    it("builds the tooltip on mouse hover and opens it for that hover", async () => {
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信" });

        pointerEnter(getButton(), "mouse");

        await waitFor(() => {
            expect(getButton().hasAttribute("data-tooltip-trigger")).toBe(true);
        });
        // The replayed pointer entry starts the tooltip's own open delay.
        await waitFor(() => {
            expect(getButton().getAttribute("data-state")).not.toBe("closed");
        }, { timeout: 2000 });
    });

    it("keeps the plain button for touch so a tap is never interrupted", async () => {
        const onClick = vi.fn();
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信", onClick });
        const button = getButton();

        pointerEnter(button, "touch");
        await fireEvent.click(button);

        expect(getButton()).toBe(button);
        expect(button.hasAttribute("data-tooltip-trigger")).toBe(false);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("keeps focus on the button when focus builds the tooltip", async () => {
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信" });

        getButton().focus();

        await waitFor(() => {
            expect(getButton().hasAttribute("data-tooltip-trigger")).toBe(true);
        });
        expect(document.activeElement).toBe(getButton());
    });

    it("does not build the tooltip for the focus a press gives the button", async () => {
        const onClick = vi.fn();
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信", onClick });
        const button = getButton();

        button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
        document.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
        button.focus();
        await fireEvent.click(button);

        expect(getButton()).toBe(button);
        expect(button.hasAttribute("data-tooltip-trigger")).toBe(false);
        expect(onClick).toHaveBeenCalledOnce();

        // The click settled the press, so later focus builds the tooltip.
        button.blur();
        button.focus();
        await waitFor(() => {
            expect(getButton().hasAttribute("data-tooltip-trigger")).toBe(true);
        });
    });

    it("still runs the click handler after the tooltip is built", async () => {
        const onClick = vi.fn();
        render(PostPreviewFooterActionButton, { tooltipContent: "返信", ariaLabel: "返信", onClick });

        pointerEnter(getButton(), "mouse");
        await waitFor(() => {
            expect(getButton().hasAttribute("data-tooltip-trigger")).toBe(true);
        });
        await fireEvent.click(getButton());

        expect(onClick).toHaveBeenCalledOnce();
    });
});

describe("PostHistoryActionMenu deferred trigger lazy tooltip", () => {
    const getTrigger = () => screen.getByRole("button", { name: "アクションを表示" });
    const props = {
        triggerAriaLabel: "アクションを表示",
        tooltipContent: "アクションを表示",
        enableTooltip: true,
        lazy: true,
        items: undefined,
    };

    it("builds the tooltip on first mouse hover", async () => {
        render(PostHistoryActionMenu, props);
        expect(getTrigger().hasAttribute("data-tooltip-trigger")).toBe(false);

        pointerEnter(getTrigger(), "mouse");

        await waitFor(() => {
            expect(getTrigger().hasAttribute("data-tooltip-trigger")).toBe(true);
        });
        expect(getTrigger().getAttribute("aria-haspopup")).toBe("menu");
    });

    it("does not build the tooltip for touch", async () => {
        render(PostHistoryActionMenu, props);
        const trigger = getTrigger();

        pointerEnter(trigger, "touch");
        await Promise.resolve();

        expect(getTrigger()).toBe(trigger);
        expect(trigger.hasAttribute("data-tooltip-trigger")).toBe(false);
    });
});
