import { tick } from "svelte";
import { getActiveElement } from "../utils/appDomUtils";

/**
 * Defers building a tooltip until its trigger is first hovered with a mouse or
 * pen, or focused other than by a press. Long lists render a tooltip per action
 * button, and most of them are never shown.
 *
 * The caller renders a plain trigger while `active` is false and the tooltip
 * variant afterwards. Activation replaces the trigger element, so this replays
 * the interaction on the replacement: the tooltip sees the same pointer entry or
 * focus it would have seen had it existed from the start.
 */
const PRESS_SETTLE_FALLBACK_MS = 1000;

export function useLazyTooltipActivation(getTrigger: () => HTMLElement | null) {
    let active = $state(false);
    let isPressInFlight = false;

    function createPointerEnterEvent(source: PointerEvent): Event {
        const init = {
            bubbles: false,
            cancelable: false,
            clientX: source.clientX,
            clientY: source.clientY,
            pointerType: source.pointerType,
            pointerId: source.pointerId,
            isPrimary: source.isPrimary,
        };
        if (typeof PointerEvent === "function") {
            return new PointerEvent("pointerenter", init);
        }
        const fallback = new MouseEvent("pointerenter", init);
        Object.defineProperty(fallback, "pointerType", { value: source.pointerType });
        return fallback;
    }

    async function activate(
        previousTrigger: EventTarget | null,
        replay: (trigger: HTMLElement) => void,
    ): Promise<void> {
        const hadFocus = previousTrigger !== null && getActiveElement() === previousTrigger;
        active = true;
        await tick();
        const trigger = getTrigger();
        if (!trigger || trigger === previousTrigger) {
            return;
        }
        replay(trigger);
        if (hadFocus && getActiveElement() !== trigger) {
            trigger.focus({ preventScroll: true });
        }
    }

    function onpointerenter(event: PointerEvent): void {
        // Touch never opens a tooltip, and replacing the trigger between
        // pointerdown and click would drop the tap.
        if (active || event.pointerType === "touch") {
            return;
        }
        void activate(event.currentTarget, (trigger) => {
            trigger.dispatchEvent(createPointerEnterEvent(event));
        });
    }

    function onpointerdown(event: PointerEvent): void {
        if (active) {
            return;
        }
        // A tap focuses the trigger after pointerup and before click, so the
        // press lasts until the click lands: replacing the trigger in between
        // would drop that click.
        isPressInFlight = true;
        const target = event.currentTarget;
        const ownerDocument = (target instanceof Node ? target.ownerDocument : null) ?? document;
        const settle = () => {
            isPressInFlight = false;
            clearTimeout(fallback);
            ownerDocument.removeEventListener("click", settle, true);
            ownerDocument.removeEventListener("pointercancel", settle, true);
        };
        // A press released elsewhere produces no click.
        const fallback = setTimeout(settle, PRESS_SETTLE_FALLBACK_MS);
        ownerDocument.addEventListener("click", settle, true);
        ownerDocument.addEventListener("pointercancel", settle, true);
    }

    function onfocus(event: FocusEvent): void {
        // Like the tooltip itself, ignore the focus a press or tap gives the
        // trigger; any other focus opens the tooltip.
        if (active || isPressInFlight) {
            return;
        }
        void activate(event.currentTarget, (trigger) => {
            trigger.focus({ preventScroll: true });
        });
    }

    return {
        get active() {
            return active;
        },
        onpointerenter,
        onpointerdown,
        onfocus,
    };
}
