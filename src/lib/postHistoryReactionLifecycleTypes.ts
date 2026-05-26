export type PostHistoryReactionLifecycleSource =
    | "dialog-inbound-save"
    | "dialog-inbound-sync"
    | "inbound-realtime"
    | "listing-current-view"
    | "listing-older-reveal";

export type PostHistoryReactionLifecycleStateStatus =
    | "pending"
    | "processing"
    | "success"
    | "failed";

export const POST_HISTORY_REACTION_LIFECYCLE_KIND = 7;
export const POST_HISTORY_REACTION_LIFECYCLE_MAX_RETRY_COUNT = 3;
export const POST_HISTORY_REACTION_LIFECYCLE_RETRY_COOLDOWN_MS = 5_000;

export interface PostHistoryReactionLifecycleKeyCandidate {
    requestKey: string;
    parentEventId: string;
    reactionEventId: string;
    kind: typeof POST_HISTORY_REACTION_LIFECYCLE_KIND;
}

export interface PostHistoryReactionLifecycleCandidate
    extends PostHistoryReactionLifecycleKeyCandidate {
    reactionAuthorPubkey: string;
}

export interface PostHistoryReactionLifecycleStateRecord {
    requestKey: string;
    parentEventId: string;
    reactionEventId: string;
    reactionAuthorPubkey: string;
    kind: typeof POST_HISTORY_REACTION_LIFECYCLE_KIND;
    source: PostHistoryReactionLifecycleSource;
    status: PostHistoryReactionLifecycleStateStatus;
    attemptCount: number;
    updatedAt: number;
    schemaVersion: number;
}

export function buildPostHistoryReactionLifecycleRequestKey(
    parentEventId: string,
    reactionEventId: string,
    kind = POST_HISTORY_REACTION_LIFECYCLE_KIND,
): string {
    return `${parentEventId}:${reactionEventId}:${kind}`;
}

export function parsePostHistoryReactionLifecycleRequestKey(
    requestKey: string,
): PostHistoryReactionLifecycleKeyCandidate | null {
    const [parentEventId, reactionEventId, kindText] = requestKey.split(":");
    const kind = Number.parseInt(kindText ?? "", 10);
    if (
        !parentEventId
        || !reactionEventId
        || kind !== POST_HISTORY_REACTION_LIFECYCLE_KIND
    ) {
        return null;
    }

    return {
        requestKey,
        parentEventId,
        reactionEventId,
        kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
    };
}

export function isActivePostHistoryReactionLifecycleStateStatus(
    status: PostHistoryReactionLifecycleStateStatus,
): boolean {
    return status === "pending" || status === "processing";
}

export function canRetryPostHistoryReactionLifecycle(
    record: Pick<
        PostHistoryReactionLifecycleStateRecord,
        "status" | "attemptCount" | "updatedAt"
    >,
    now = Date.now(),
): boolean {
    return record.status === "failed"
        && record.attemptCount < POST_HISTORY_REACTION_LIFECYCLE_MAX_RETRY_COUNT
        && now - record.updatedAt >= POST_HISTORY_REACTION_LIFECYCLE_RETRY_COOLDOWN_MS;
}