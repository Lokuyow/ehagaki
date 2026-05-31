import type { PostHistoryRelationKind } from "./postHistoryRelationLifecycleTypes";

export const POST_HISTORY_RELATION_REPAIR_KINDS: PostHistoryRelationKind[] = [
    "reply",
    "reaction",
    "quote",
];

export type PostHistoryRelationRefreshSource =
    | "listing-current-view"
    | "listing-older-reveal"
    | "listing-manual-refetch";

export interface PostHistoryRelationDescriptor {
    relationKind: PostHistoryRelationKind;
    parentEventId: string;
    targetEventId: string;
}

export interface PostHistoryRelationLifecycleResultContract {
    status: "success" | "partial" | "cancelled";
    relationKinds: PostHistoryRelationKind[];
    savedParentEventIds: string[];
    checkedParentEventIds: string[];
    quoteRepairApplied: boolean;
}

export interface PostHistoryRelationRefreshSignalContract {
    source: PostHistoryRelationRefreshSource;
    relationKinds: PostHistoryRelationKind[];
    parentEventIds: string[];
    shouldRefreshQuotePreviews: boolean;
}

export interface PostHistoryRelationRepairRequestContract {
    relationKinds: PostHistoryRelationKind[];
}

export function normalizePostHistoryRelationKinds(
    relationKinds?: PostHistoryRelationKind[],
): PostHistoryRelationKind[] {
    const candidates = relationKinds ?? POST_HISTORY_RELATION_REPAIR_KINDS;
    return Array.from(new Set(candidates.filter((kind) =>
        kind === "reply" || kind === "reaction" || kind === "quote"
    )));
}

export function resolvePostHistoryRelationRefreshSignal(
    source: PostHistoryRelationRefreshSource,
    lifecycle: PostHistoryRelationLifecycleResultContract,
): PostHistoryRelationRefreshSignalContract {
    const relationKinds = normalizePostHistoryRelationKinds(
        lifecycle.relationKinds,
    );

    return {
        source,
        relationKinds,
        parentEventIds: Array.from(new Set(lifecycle.savedParentEventIds)),
        shouldRefreshQuotePreviews:
            relationKinds.includes("quote") && lifecycle.quoteRepairApplied,
    };
}
