import type {
    PostHistoryRecord,
    PostHistoryReplyEventRecord,
} from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";
import { cloneNostrEvent, isSignedNostrEvent } from "./postHistoryEventUtils";
import { parseKind1ThreadReferences } from "./postHistoryNip10Utils";

export type PostHistoryThreadGraphSource =
    | "anchor"
    | "history-record"
    | "reply-db"
    | "fetched-parent"
    | "fetched-child"
    | "posted-reply";

export interface PostHistoryThreadGraphNode {
    eventId: string;
    event: NostrEvent;
    authorPubkey: string;
    rootEventId: string | null;
    parentEventId: string | null;
    profile: import("./types").ProfileData | null;
    relayUrls: string[];
    sources: PostHistoryThreadGraphSource[];
}

export interface PostHistoryThreadGraphExpansionState {
    loadedParent: boolean;
    visibleParent: boolean;
    loadingParent: boolean;
    parentError: string | null;
    parentMissing: boolean;
    parentDeleted: boolean;
    showParentLoadingIndicator: boolean;
    loadedChildren: boolean;
    visibleChildren: boolean;
    loadingChildren: boolean;
    childrenError: string | null;
    lastFetchedParentAt: number | null;
    lastFetchedChildrenAt: number | null;
}

const POST_HISTORY_THREAD_CONTEXT_PARENT_WINDOW_DEPTH = 3;
const POST_HISTORY_THREAD_CONTEXT_INDENT_STEP_REM = 0.5;
const POST_HISTORY_THREAD_CONTEXT_MAX_INDENT_REM = 1.5;

export function buildAnchorNodeKey(anchorEventId: string, nodeEventId: string): string {
    return `${anchorEventId}:${nodeEventId}`;
}

export function resolvePostHistoryThreadContextDepth(depthFromAnchor: number): number {
    if (depthFromAnchor < 0) {
        return Math.max(
            0,
            POST_HISTORY_THREAD_CONTEXT_PARENT_WINDOW_DEPTH + depthFromAnchor,
        );
    }

    return depthFromAnchor;
}

export function resolvePostHistoryThreadContextIndentRem(depthFromAnchor: number): number {
    return Math.min(
        resolvePostHistoryThreadContextDepth(depthFromAnchor)
            * POST_HISTORY_THREAD_CONTEXT_INDENT_STEP_REM,
        POST_HISTORY_THREAD_CONTEXT_MAX_INDENT_REM,
    );
}

export function buildInitialExpansionState(): PostHistoryThreadGraphExpansionState {
    return {
        loadedParent: false,
        visibleParent: false,
        loadingParent: false,
        parentError: null,
        parentMissing: false,
        parentDeleted: false,
        showParentLoadingIndicator: false,
        loadedChildren: false,
        visibleChildren: false,
        loadingChildren: false,
        childrenError: null,
        lastFetchedParentAt: null,
        lastFetchedChildrenAt: null,
    };
}

export function toEventFromPostHistoryRecord(record: PostHistoryRecord): NostrEvent {
    if (isSignedNostrEvent(record.rawEvent)) {
        return cloneNostrEvent(record.rawEvent);
    }

    return {
        id: record.eventId,
        pubkey: record.pubkeyHex,
        kind: record.kind,
        content: record.content,
        tags: record.tags.map((tag) => [...tag]),
        created_at: record.createdAt,
        sig: "",
    };
}

export function toEventFromReplyRecord(record: PostHistoryReplyEventRecord): NostrEvent {
    if (isSignedNostrEvent(record.rawEvent)) {
        return cloneNostrEvent(record.rawEvent);
    }

    return {
        id: record.eventId,
        pubkey: record.authorPubkey,
        kind: record.kind,
        content: record.content,
        tags: record.tags.map((tag) => [...tag]),
        created_at: record.createdAt,
        sig: "",
    };
}

export function buildThreadGraphNode(input: {
    event: NostrEvent;
    relayUrls?: string[];
    sources: PostHistoryThreadGraphSource[];
    profile?: import("./types").ProfileData | null;
}): PostHistoryThreadGraphNode {
    const references = parseKind1ThreadReferences(input.event);

    return {
        eventId: input.event.id,
        event: cloneNostrEvent(input.event),
        authorPubkey: input.event.pubkey,
        rootEventId: references.rootId,
        parentEventId: references.parentId,
        profile: input.profile ?? null,
        relayUrls: [...(input.relayUrls ?? [])],
        sources: [...input.sources],
    };
}

export function mergeThreadGraphNode(
    current: PostHistoryThreadGraphNode | undefined,
    next: PostHistoryThreadGraphNode,
): PostHistoryThreadGraphNode {
    if (!current) {
        return next;
    }

    const relayUrls = Array.from(new Set([
        ...current.relayUrls,
        ...next.relayUrls,
    ])).sort((left, right) => left.localeCompare(right));
    const sources = Array.from(new Set([
        ...current.sources,
        ...next.sources,
    ]));

    return {
        ...current,
        event: next.event,
        authorPubkey: next.authorPubkey,
        rootEventId: next.rootEventId,
        parentEventId: next.parentEventId,
        profile: next.profile ?? current.profile,
        relayUrls,
        sources,
    };
}

export function sortEventIdsByEvent(
    eventIds: string[],
    nodesById: Record<string, PostHistoryThreadGraphNode>,
): string[] {
    return [...eventIds].sort((leftId, rightId) => {
        const left = nodesById[leftId]?.event;
        const right = nodesById[rightId]?.event;
        if (!left || !right) {
            return leftId.localeCompare(rightId);
        }

        if (left.created_at !== right.created_at) {
            return left.created_at - right.created_at;
        }

        return left.id.localeCompare(right.id);
    });
}
