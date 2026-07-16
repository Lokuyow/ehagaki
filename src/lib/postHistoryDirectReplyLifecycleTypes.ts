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
export type PostHistoryDirectReplyLifecycleKind = 1 | 42;
export const POST_HISTORY_DIRECT_REPLY_LIFECYCLE_MAX_RETRY_COUNT = 3;
export const POST_HISTORY_DIRECT_REPLY_LIFECYCLE_RETRY_COOLDOWN_MS = 5_000;
const POST_HISTORY_DIRECT_REPLY_RELATION_KIND = "reply";

export interface PostHistoryDirectReplyLifecycleKeyCandidate {
    requestKey: string;
    parentEventId: string;
    replyEventId: string;
    kind: PostHistoryDirectReplyLifecycleKind;
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
    kind: PostHistoryDirectReplyLifecycleKind;
    source: PostHistoryDirectReplyLifecycleSource;
    status: PostHistoryDirectReplyLifecycleStateStatus;
    attemptCount: number;
    updatedAt: number;
    schemaVersion: number;
}

export function buildPostHistoryDirectReplyLifecycleRequestKey(
    parentEventId: string,
    replyEventId: string,
    kind: PostHistoryDirectReplyLifecycleKind = POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
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
    const parsed = ([1, 42] as const)
        .map((kind) => parsePostHistoryRelationLifecycleRequestKey(
            requestKey,
            kind,
            POST_HISTORY_DIRECT_REPLY_RELATION_KIND,
        ))
        .find((candidate) => candidate !== null) ?? null;
    if (!parsed) {
        return null;
    }

    return {
        requestKey: parsed.requestKey,
        parentEventId: parsed.parentEventId,
        replyEventId: parsed.targetEventId,
        kind: parsed.kind as PostHistoryDirectReplyLifecycleKind,
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
