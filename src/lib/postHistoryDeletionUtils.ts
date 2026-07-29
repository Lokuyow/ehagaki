import { cloneNostrEvent } from "./postHistoryEventUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryDeletionRequestRecord } from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";

export const POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION = 2;

export interface PostHistoryDeletionRequestRecordInput {
    deletionEvent: NostrEvent;
    targetEvent: NostrEvent;
    relayUrls?: string[];
    fetchedAt: number;
}

export interface PostHistoryDeletionRequestReferenceRecordInput {
    deletionEvent: NostrEvent;
    targetEventId: string;
    targetVerified: boolean;
    relayUrls?: string[];
    fetchedAt: number;
}

export interface PostHistoryDeletionState {
    deletedAt: number;
    deletionEventId: string;
}

export function extractDeletionTargetEventIds(
    deletionEvent: Pick<NostrEvent, "kind" | "tags"> | null | undefined,
): string[] {
    if (!deletionEvent || deletionEvent.kind !== 5) {
        return [];
    }

    const eventIds = deletionEvent.tags
        .filter((tag) => tag[0] === "e" && typeof tag[1] === "string" && tag[1].length > 0)
        .map((tag) => tag[1]);

    return Array.from(new Set(eventIds));
}

export function isValidDeletionRequestForTarget(
    deletionEvent: Pick<NostrEvent, "kind" | "pubkey" | "tags"> | null | undefined,
    targetEvent: Pick<NostrEvent, "id" | "pubkey"> | null | undefined,
): boolean {
    if (!deletionEvent || !targetEvent || deletionEvent.kind !== 5) {
        return false;
    }

    if (deletionEvent.pubkey !== targetEvent.pubkey) {
        return false;
    }

    return extractDeletionTargetEventIds(deletionEvent).includes(targetEvent.id);
}

export function buildPostHistoryDeletionRequestRecordId(
    targetAuthorPubkey: string,
    targetEventId: string,
    deletionEventId: string,
): string {
    return `${targetAuthorPubkey}:${targetEventId}:${deletionEventId}`;
}

export function isPostHistoryDeletionTargetVerified(
    record: Pick<PostHistoryDeletionRequestRecord, "targetVerified">,
): boolean {
    return record.targetVerified !== false;
}

export function comparePostHistoryDeletionRequests(
    left: Pick<PostHistoryDeletionRequestRecord, "deletedAt" | "deletionEventId">,
    right: Pick<PostHistoryDeletionRequestRecord, "deletedAt" | "deletionEventId">,
): number {
    return left.deletedAt - right.deletedAt
        || left.deletionEventId.localeCompare(right.deletionEventId);
}

export function toPostHistoryDeletionState(
    record: Pick<PostHistoryDeletionRequestRecord, "deletedAt" | "deletionEventId">,
): PostHistoryDeletionState {
    return {
        deletedAt: record.deletedAt * 1000,
        deletionEventId: record.deletionEventId,
    };
}

export function toPostHistoryDeletionRequestReferenceRecord(
    input: PostHistoryDeletionRequestReferenceRecordInput,
    now: () => number = Date.now,
): PostHistoryDeletionRequestRecord {
    const { deletionEvent } = input;
    return {
        id: buildPostHistoryDeletionRequestRecordId(
            deletionEvent.pubkey,
            input.targetEventId,
            deletionEvent.id,
        ),
        targetAuthorPubkey: deletionEvent.pubkey,
        targetEventId: input.targetEventId,
        deletionEventId: deletionEvent.id,
        deletionEventPubkey: deletionEvent.pubkey,
        targetVerified: input.targetVerified,
        deletedAt: deletionEvent.created_at,
        reason: deletionEvent.content.trim() || null,
        rawEvent: cloneNostrEvent(deletionEvent),
        relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls(input.relayUrls ?? []),
        fetchedAt: input.fetchedAt,
        updatedAt: now(),
        schemaVersion: POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    };
}

export function toPostHistoryDeletionRequestRecord(
    input: PostHistoryDeletionRequestRecordInput,
    now: () => number = Date.now,
): PostHistoryDeletionRequestRecord | null {
    const { deletionEvent, targetEvent } = input;
    if (!deletionEvent.id || !isValidDeletionRequestForTarget(deletionEvent, targetEvent)) {
        return null;
    }

    return toPostHistoryDeletionRequestReferenceRecord({
        deletionEvent,
        targetEventId: targetEvent.id,
        targetVerified: true,
        relayUrls: input.relayUrls,
        fetchedAt: input.fetchedAt,
    }, now);
}
