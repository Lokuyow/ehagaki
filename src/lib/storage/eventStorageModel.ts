import type { NostrEvent } from "../types";
import type { RawEventVerificationState } from "../rawEventVerificationState";

export interface StoredEvent {
    id: string;
    rawEvent: NostrEvent;
    verification?: RawEventVerificationState;
    relayUrls: string[];
    receivedAt: number;
    lastSeenAt: number;
    relatedEventIds: string[];
    deletedAt?: number;
    deletionEventId?: string;
}

export const EVENT_RECORD_TABLES = ['postHistory', 'postHistoryChildInteractions', 'sensitivePayloads', 'postHistoryDeletionRequests', 'notifications'] as const;
export type EventRecordTableName = typeof EVENT_RECORD_TABLES[number];
export type RecordValue = Record<string, any>;
/** Persisted projections exclude wire bodies. Repositories hydrate their DTOs. */
export type EventProjection<T> = Omit<T, 'rawEvent' | 'event' | 'content' | 'tags' | 'rawEventVerification' | 'fetchedRelays' | 'relayUrls' | 'repostTarget'> & {
    repostTarget?: { eventId: string; relayHints: string[] };
};
export interface VerifiedEventInput {
    event: NostrEvent;
    relayUrls?: string[];
    receivedAt?: number;
    verification?: RawEventVerificationState;
    deletedAt?: number;
    deletionEventId?: string;
    relatedEventIds?: string[];
}

export function splitEventRecord(row: RecordValue, name: EventRecordTableName): { metadata: RecordValue; items: VerifiedEventInput[] } {
    const { rawEvent, event, content: _content, tags: _tags, rawEventVerification, fetchedRelays, relayUrls: sourceRelays, repostTarget, ...metadata } = row;
    const wire = (name === 'notifications' ? event : rawEvent) as NostrEvent | undefined;
    const target = repostTarget?.rawEvent as NostrEvent | undefined;
    const deletionState = name === 'postHistory' || name === 'sensitivePayloads'
        ? { deletedAt: row.deletedAt, deletionEventId: row.deletionEventId } : {};
    return { metadata: { ...metadata, ...(repostTarget ? { repostTarget: { eventId: target?.id ?? repostTarget.eventId, relayHints: repostTarget.relayHints } } : {}) },
        items: [ ...(wire ? [{ event: wire, relayUrls: fetchedRelays ?? sourceRelays ?? [], receivedAt: row.receivedAt ?? row.fetchedAt,
            verification: rawEventVerification, ...deletionState,
            relatedEventIds: target ? [target.id] : [] }] : []),
        ...(target ? [{ event: target, relayUrls: repostTarget.relayHints, verification: repostTarget.rawEventVerification }] : []) ] };
}

