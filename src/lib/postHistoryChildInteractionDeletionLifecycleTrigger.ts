import type { RxNostr } from "rx-nostr";
import {
    triggerPostHistoryReactionLifecycle,
} from "./postHistoryReactionLifecycleTrigger";
import type { PostHistoryReactionLifecycleSource } from "./postHistoryReactionLifecycleTypes";
import {
    triggerPostHistoryDirectReplyLifecycle,
} from "./postHistoryDirectReplyLifecycleTrigger";
import type { RelayConfig } from "./types";

export interface PostHistoryChildInteractionDeletionLifecycleTriggerRequest {
    source: PostHistoryReactionLifecycleSource;
    parentEventIds: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryChildInteractionDeletionLifecycleTriggerResult {
    source: PostHistoryReactionLifecycleSource;
    status: "completed" | "partial" | "cancelled";
    checkedParentEventIds: string[];
    deletedReactionEventIds: string[];
    deletedReplyEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

function mergeParentEventIds(...eventIdGroups: string[][]): string[] {
    return Array.from(new Set(eventIdGroups.flatMap((eventIds) => eventIds)));
}

export async function triggerPostHistoryChildInteractionDeletionLifecycle(
    request: PostHistoryChildInteractionDeletionLifecycleTriggerRequest,
): Promise<PostHistoryChildInteractionDeletionLifecycleTriggerResult> {
    const [reactionResult, replyResult] = await Promise.all([
        triggerPostHistoryReactionLifecycle(request),
        triggerPostHistoryDirectReplyLifecycle(request),
    ]);

    const deletedReactionEventIds = Array.from(new Set(
        reactionResult.deletedReactionEventIds,
    ));
    const deletedReplyEventIds = Array.from(new Set(
        replyResult.deletedReplyEventIds,
    ));
    const deletionConfirmationIncomplete =
        reactionResult.deletionConfirmationIncomplete
        || replyResult.deletionConfirmationIncomplete;
    const cancelledCount = [reactionResult.status, replyResult.status]
        .filter((status) => status === "cancelled")
        .length;

    return {
        source: request.source,
        status: cancelledCount === 2
            ? "cancelled"
            : deletionConfirmationIncomplete
                ? "partial"
                : "completed",
        checkedParentEventIds: mergeParentEventIds(
            reactionResult.checkedParentEventIds,
            replyResult.checkedParentEventIds,
        ),
        deletedReactionEventIds,
        deletedReplyEventIds,
        deletionConfirmationIncomplete,
    };
}