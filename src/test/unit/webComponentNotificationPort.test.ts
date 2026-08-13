import { describe, expect, it, vi } from "vitest";
import { createWebComponentNotificationPort } from "../../web-component/notificationPort";

describe("Web Component notification port", () => {
    it("uses composed bubbling CustomEvents and never needs postMessage", () => {
        const dispatchSafeEvent = vi.fn(() => true);
        const port = createWebComponentNotificationPort({ dispatchSafeEvent } as never);

        port.notifyPostSuccess({ eventId: "event-id", quotedEventIds: ["quote"] });
        port.notifyPostError({ code: "post_failed", message: "not exposed" });
        port.notifyComposerContextUpdated({ reply: null, quotes: [], channel: null });

        expect(dispatchSafeEvent).toHaveBeenNthCalledWith(1, "ehagaki-post-success", {
            eventId: "event-id",
            quotedEventIds: ["quote"],
        });
        expect(dispatchSafeEvent).toHaveBeenNthCalledWith(2, "ehagaki-post-error", {
            code: "post_failed",
        });
        expect(dispatchSafeEvent).toHaveBeenNthCalledWith(
            3,
            "ehagaki-composer-context-updated",
            { reply: null, quotes: [], channel: null },
        );
    });
});
