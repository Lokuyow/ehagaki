import type { PostHistoryQuotePreviewState } from "./hooks/usePostHistoryQuotePreviews.svelte";

export type PostHistoryQuoteLifecycleStatus =
    | "loading"
    | "deleted"
    | "not-found"
    | "error";

const QUOTE_LIFECYCLE_STATUS_PRIORITY: PostHistoryQuoteLifecycleStatus[] = [
    "loading",
    "error",
    "deleted",
    "not-found",
];

export function resolvePostHistoryQuoteLifecycleStatus(
    previewStates: PostHistoryQuotePreviewState[],
): PostHistoryQuoteLifecycleStatus | null {
    for (const status of QUOTE_LIFECYCLE_STATUS_PRIORITY) {
        if (previewStates.some((preview) => preview.status === status)) {
            return status;
        }
    }

    return null;
}
