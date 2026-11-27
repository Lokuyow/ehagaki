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

    it("reports string post failures with the same codes as iframe post.error", () => {
        const dispatchSafeEvent = vi.fn((_type: string, _detail: Record<string, unknown>) => true);
        const port = createWebComponentNotificationPort({ dispatchSafeEvent } as never);

        port.notifyPostError("no_write_relays");
        port.notifyPostError("postComponent.error.reply_target_event_unavailable");
        port.notifyPostError("Unexpected free-form message");
        port.notifyPostError(undefined);

        expect(dispatchSafeEvent.mock.calls.map(([, detail]) => detail)).toEqual([
            { code: "no_write_relays" },
            { code: "reply_target_event_unavailable" },
            { code: "post_error" },
            { code: "post_error" },
        ]);
    });
});
