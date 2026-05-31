import {
    buildPostHistoryRelationLifecycleRequestKey,
    isActivePostHistoryRelationLifecycleStateStatus,
    parsePostHistoryRelationLifecycleRequestKey,
    type PostHistoryRelationLifecycleSource,
    type PostHistoryRelationLifecycleStateStatus,
} from "./postHistoryRelationLifecycleTypes";

export type PostHistoryDirectReplyLifecycleSource = PostHistoryRelationLifecycleSource;

export type PostHistoryDirectReplyLifecycleStateStatus = PostHistoryRelationLifecycleStateStatus;

export const POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND = 1;
export const POST_HISTORY_DIRECT_REPLY_LIFECYCLE_MAX_RETRY_COUNT = 3;
export const POST_HISTORY_DIRECT_REPLY_LIFECYCLE_RETRY_COOLDOWN_MS = 5_000;
const POST_HISTORY_DIRECT_REPLY_RELATION_KIND = "reply";

export interface PostHistoryDirectReplyLifecycleKeyCandidate {
    requestKey: string;
    parentEventId: string;
    replyEventId: string;
    kind: typeof POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND;
}

export interface PostHistoryDirectReplyLifecycleCandidate
    extends PostHistoryDirectReplyLifecycleKeyCandidate {
    replyAuthorPubkey: string;
}

export interface PostHistoryDirectReplyLifecycleStateRecord {
    requestKey: string;
    parentEventId: string;
    replyEventId: string;
    replyAuthorPubkey: string;
    kind: typeof POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND;
    source: PostHistoryDirectReplyLifecycleSource;
    status: PostHistoryDirectReplyLifecycleStateStatus;
    attemptCount: number;
    updatedAt: number;
    schemaVersion: number;
}

export function buildPostHistoryDirectReplyLifecycleRequestKey(
    parentEventId: string,
    replyEventId: string,
    kind = POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
): string {
    return buildPostHistoryRelationLifecycleRequestKey(
        parentEventId,
        replyEventId,
        kind,
    );
}

export function parsePostHistoryDirectReplyLifecycleRequestKey(
    requestKey: string,
): PostHistoryDirectReplyLifecycleKeyCandidate | null {
    const parsed = parsePostHistoryRelationLifecycleRequestKey(
        requestKey,
        POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
        POST_HISTORY_DIRECT_REPLY_RELATION_KIND,
    );
    if (!parsed) {
        return null;
    }

    return {
        requestKey: parsed.requestKey,
        parentEventId: parsed.parentEventId,
        replyEventId: parsed.targetEventId,
        kind: POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
    };
}

export function isActivePostHistoryDirectReplyLifecycleStateStatus(
    status: PostHistoryDirectReplyLifecycleStateStatus,
): boolean {
    return isActivePostHistoryRelationLifecycleStateStatus(status);
}

export function canRetryPostHistoryDirectReplyLifecycle(
    record: Pick<
        PostHistoryDirectReplyLifecycleStateRecord,
        "status" | "attemptCount" | "updatedAt"
    >,
    now = Date.now(),
): boolean {
    return record.status === "failed"
        && record.attemptCount < POST_HISTORY_DIRECT_REPLY_LIFECYCLE_MAX_RETRY_COUNT
        && now - record.updatedAt >= POST_HISTORY_DIRECT_REPLY_LIFECYCLE_RETRY_COOLDOWN_MS;
}
