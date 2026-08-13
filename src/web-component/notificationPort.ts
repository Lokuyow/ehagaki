import type { AppEmbedNotificationPort } from "../lib/appEmbedController";
import type { AppPostNotificationPort } from "../lib/appNotificationPort";
import type { EHagakiComposerElement } from "./element";

/**
 * In-process notification adapter. It deliberately has no postMessage path:
 * Web Components run in the host Window realm and communicate with their host
 * through DOM events instead.
 */
export function createWebComponentNotificationPort(
    element: EHagakiComposerElement,
): AppPostNotificationPort & AppEmbedNotificationPort {
    return {
        notifyPostSuccess(options = {}) {
            element.dispatchSafeEvent("ehagaki-post-success", {
                ...options,
                ...(options.quotedEventIds
                    ? { quotedEventIds: [...options.quotedEventIds] }
                    : {}),
            });
            return true;
        },
        notifyPostError(error) {
            const code = typeof error === "object" && error?.code
                ? error.code
                : "post_failed";
            element.dispatchSafeEvent("ehagaki-post-error", { code });
            return true;
        },
        notifyComposerContextApplied() {
            return true;
        },
        notifyComposerContextError(error) {
            element.dispatchSafeEvent("ehagaki-initialization-error", {
                code: error.code,
                message: "Composer context could not be applied.",
            });
            return true;
        },
        notifyComposerContextUpdated(payload) {
            element.dispatchSafeEvent("ehagaki-composer-context-updated", {
                reply: payload.reply,
                quotes: [...payload.quotes],
                channel: payload.channel ?? null,
            });
            return true;
        },
        notifySettingsApplied() {
            return true;
        },
        notifySettingsError(error) {
            element.dispatchSafeEvent("ehagaki-initialization-error", {
                code: error.code,
                message: "Settings could not be applied.",
            });
            return true;
        },
    };
}
