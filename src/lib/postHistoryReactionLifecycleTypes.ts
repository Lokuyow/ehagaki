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

export interface PostHistoryReactionLifecycleCandidate {
    requestKey: string;
    parentEventId: string;
    reactionEventId: string;
    kind: typeof POST_HISTORY_REACTION_LIFECYCLE_KIND;
}

export interface PostHistoryReactionLifecycleStateRecord {
    requestKey: string;
    parentEventId: string;
    reactionEventId: string;
    kind: typeof POST_HISTORY_REACTION_LIFECYCLE_KIND;
    source: PostHistoryReactionLifecycleSource;
    status: PostHistoryReactionLifecycleStateStatus;
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
): PostHistoryReactionLifecycleCandidate | null {
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