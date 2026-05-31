export type PostHistoryRelationKind = "reply" | "reaction" | "quote";

export type PostHistoryRelationLifecycleSource =
    | "dialog-inbound-save"
    | "dialog-inbound-sync"
    | "inbound-realtime"
    | "listing-current-view"
    | "listing-older-reveal";

export type PostHistoryRelationLifecycleStateStatus =
    | "pending"
    | "processing"
    | "success"
    | "failed";

export interface PostHistoryRelationLifecycleKeyCandidate<
    Kind extends number = number,
    RelationKind extends PostHistoryRelationKind = PostHistoryRelationKind,
> {
    requestKey: string;
    parentEventId: string;
    targetEventId: string;
    kind: Kind;
    relationKind: RelationKind;
}

export interface PostHistoryRelationLifecycleCandidate<
    Kind extends number = number,
    RelationKind extends PostHistoryRelationKind = PostHistoryRelationKind,
> extends PostHistoryRelationLifecycleKeyCandidate<Kind, RelationKind> {
    targetAuthorPubkey: string;
}

export interface PostHistoryRelationLifecycleStateRecord<
    Kind extends number = number,
    RelationKind extends PostHistoryRelationKind = PostHistoryRelationKind,
> {
    requestKey: string;
    parentEventId: string;
    targetEventId: string;
    targetAuthorPubkey: string;
    kind: Kind;
    relationKind: RelationKind;
    source: PostHistoryRelationLifecycleSource;
    status: PostHistoryRelationLifecycleStateStatus;
    attemptCount: number;
    updatedAt: number;
    schemaVersion: number;
}

export function buildPostHistoryRelationLifecycleRequestKey(
    parentEventId: string,
    targetEventId: string,
    kind: number,
): string {
    return `${parentEventId}:${targetEventId}:${kind}`;
}

export function parsePostHistoryRelationLifecycleRequestKey(
    requestKey: string,
    expectedKind: number,
    relationKind: PostHistoryRelationKind,
): PostHistoryRelationLifecycleKeyCandidate<number> | null {
    const [parentEventId, targetEventId, kindText] = requestKey.split(":");
    const kind = Number.parseInt(kindText ?? "", 10);
    if (!parentEventId || !targetEventId || kind !== expectedKind) {
        return null;
    }

    return {
        requestKey,
        parentEventId,
        targetEventId,
        kind,
        relationKind,
    };
}

export function isActivePostHistoryRelationLifecycleStateStatus(
    status: PostHistoryRelationLifecycleStateStatus,
): boolean {
    return status === "pending" || status === "processing";
}
