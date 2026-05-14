import { afterEach, describe, expect, it, vi } from "vitest";

vi.unmock("../../stores/postUIStore.svelte");

import { postComponentUIStore } from "../../stores/postUIStore.svelte";

describe("postComponentUIStore floating message", () => {
    afterEach(() => {
        postComponentUIStore.hideFloatingMessage();
        vi.useRealTimers();
    });

    it("shows and auto-hides a floating message", () => {
        vi.useFakeTimers();

        postComponentUIStore.showFloatingMessage(10, 20, "Copied", 1000);

        expect(postComponentUIStore.value.showFloatingMessage).toBe(true);
        expect(postComponentUIStore.value.floatingMessageX).toBe(10);
        expect(postComponentUIStore.value.floatingMessageY).toBe(20);
        expect(postComponentUIStore.value.floatingMessageText).toBe("Copied");

        vi.advanceTimersByTime(1000);

        expect(postComponentUIStore.value.showFloatingMessage).toBe(false);
    });

    it("does not let an older timeout hide a newer floating message", () => {
        vi.useFakeTimers();

        postComponentUIStore.showFloatingMessage(10, 20, "First", 1000);
        vi.advanceTimersByTime(500);
        postComponentUIStore.showFloatingMessage(30, 40, "Second", 1000);

        vi.advanceTimersByTime(600);

        expect(postComponentUIStore.value.showFloatingMessage).toBe(true);
        expect(postComponentUIStore.value.floatingMessageText).toBe("Second");

        vi.advanceTimersByTime(400);

        expect(postComponentUIStore.value.showFloatingMessage).toBe(false);
    });

    it("clears the active timeout when manually hidden", () => {
        vi.useFakeTimers();

        postComponentUIStore.showFloatingMessage(10, 20, "Copied", 1000);
        postComponentUIStore.hideFloatingMessage();
        vi.advanceTimersByTime(1000);

        expect(postComponentUIStore.value.showFloatingMessage).toBe(false);
    });
});
