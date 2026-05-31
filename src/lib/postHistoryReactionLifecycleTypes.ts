import {
    buildPostHistoryRelationLifecycleRequestKey,
    isActivePostHistoryRelationLifecycleStateStatus,
    parsePostHistoryRelationLifecycleRequestKey,
    type PostHistoryRelationLifecycleSource,
    type PostHistoryRelationLifecycleStateStatus,
} from "./postHistoryRelationLifecycleTypes";

export type PostHistoryReactionLifecycleSource = PostHistoryRelationLifecycleSource;

export type PostHistoryReactionLifecycleStateStatus = PostHistoryRelationLifecycleStateStatus;

export const POST_HISTORY_REACTION_LIFECYCLE_KIND = 7;
export const POST_HISTORY_REACTION_LIFECYCLE_MAX_RETRY_COUNT = 3;
export const POST_HISTORY_REACTION_LIFECYCLE_RETRY_COOLDOWN_MS = 5_000;
const POST_HISTORY_REACTION_RELATION_KIND = "reaction";

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
    return buildPostHistoryRelationLifecycleRequestKey(
        parentEventId,
        reactionEventId,
        kind,
    );
}

export function parsePostHistoryReactionLifecycleRequestKey(
    requestKey: string,
): PostHistoryReactionLifecycleKeyCandidate | null {
    const parsed = parsePostHistoryRelationLifecycleRequestKey(
        requestKey,
        POST_HISTORY_REACTION_LIFECYCLE_KIND,
        POST_HISTORY_REACTION_RELATION_KIND,
    );
    if (!parsed) {
        return null;
    }

    return {
        requestKey: parsed.requestKey,
        parentEventId: parsed.parentEventId,
        reactionEventId: parsed.targetEventId,
        kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
    };
}

export function isActivePostHistoryReactionLifecycleStateStatus(
    status: PostHistoryReactionLifecycleStateStatus,
): boolean {
    return isActivePostHistoryRelationLifecycleStateStatus(status);
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