import type { RxNostr } from "rx-nostr";
import {
    postHistoryReactionDeletionCleanupService,
    type PostHistoryReactionDeletionCleanupResult,
} from "./postHistoryReactionDeletionCleanupService";
import type { RelayConfig } from "./types";

export type PostHistoryReactionLifecycleSource =
    | "dialog-inbound-save"
    | "dialog-inbound-sync"
    | "inbound-realtime"
    | "listing-current-view"
    | "listing-older-reveal";

export interface PostHistoryReactionLifecycleTriggerRequest {
    source: PostHistoryReactionLifecycleSource;
    parentEventIds: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryReactionLifecycleTriggerResult
    extends PostHistoryReactionDeletionCleanupResult {
    source: PostHistoryReactionLifecycleSource;
}

function normalizeParentEventIds(parentEventIds: string[]): string[] {
    return Array.from(new Set(parentEventIds.filter((eventId) => !!eventId)));
}

export async function triggerPostHistoryReactionLifecycle(
    request: PostHistoryReactionLifecycleTriggerRequest,
): Promise<PostHistoryReactionLifecycleTriggerResult> {
    const parentEventIds = normalizeParentEventIds(request.parentEventIds);
    if (!request.rxNostr || parentEventIds.length === 0) {
        return {
            source: request.source,
            status: "completed",
            checkedParentEventIds: parentEventIds,
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: false,
        };
    }

    const result = await postHistoryReactionDeletionCleanupService.cleanupReactionDeletions(
        request.rxNostr,
        {
            parentEventIds,
            relayConfig: request.relayConfig,
            isActive: request.isActive,
        },
    );

    return {
        source: request.source,
        ...result,
    };
}