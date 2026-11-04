import { RelayConfigUtils } from '../relayConfigUtils';
import { EVENT_RECORD_TABLES, splitEventRecord, type StoredEvent } from './eventStorageModel';
import { RAW_EVENT_VERIFICATION_RULE_VERSION } from '../rawEventVerificationState';
import { validateEvent, verifyEvent } from 'nostr-tools';
import { getEventHash } from '@rx-nostr/crypto';
import { createPlainNostrEventSnapshot, isSignedNostrEvent } from '../postHistoryEventUtils';

function verifiedSnapshot(input: unknown) {
    try {
        if (!isSignedNostrEvent(input)) return null;
        const event = createPlainNostrEventSnapshot(input);
        return validateEvent(event as never) && getEventHash(event as never) === event.id && verifyEvent(event as never) ? { event } : null;
    } catch { return null; }
}

const MIGRATION_ID = 'shared-events-v19';
const BATCH_SIZE = 100;
interface Progress { id: string; tableIndex: number; lastKey: string; done: boolean }
const initial = (): Progress => ({ id: MIGRATION_ID, tableIndex: 0, lastKey: '', done: false });
const request = <T>(req: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
});
const completed = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve(); tx.onabort = tx.onerror = () => reject(tx.error ?? new Error('event_store_migration_aborted'));
});

/** Bounded, restartable data conversion, outside the versionchange transaction. */
export async function migrateEventStore(db: IDBDatabase): Promise<void> {
    for (;;) {
        const reading = db.transaction(['eventStoreMigration', ...EVENT_RECORD_TABLES], 'readonly');
        const progress = await request(reading.objectStore('eventStoreMigration').get(MIGRATION_ID)) as Progress | undefined ?? initial();
        if (progress.done) return;
        const name = EVENT_RECORD_TABLES[progress.tableIndex];
        const rows = await request(reading.objectStore(name).getAll(progress.lastKey ? IDBKeyRange.lowerBound(progress.lastKey, true) : undefined, BATCH_SIZE));
        // Full verification is deliberately outside any write transaction.
        const split = rows.map(row => splitEventRecord(row, name));
        const incoming = new Map<string, StoredEvent>();
        for (const item of split.flatMap(row => row.items)) {
            const verified = verifiedSnapshot(item.event);
            if (!verified) continue;
            const old = incoming.get(verified.event.id);
            const time = item.receivedAt ?? Date.now();
            incoming.set(verified.event.id, { id: verified.event.id, rawEvent: verified.event,
                verification: { status: 'valid', ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION },
                relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([...(old?.relayUrls ?? []), ...(item.relayUrls ?? [])]),
                receivedAt: Math.min(old?.receivedAt ?? time, time), lastSeenAt: Math.max(old?.lastSeenAt ?? time, time),
                relatedEventIds: [...new Set([...(old?.relatedEventIds ?? []), ...(item.relatedEventIds ?? []),
                    ...verified.event.tags.flatMap(tag => ['e', 'q', 'c'].includes(tag[0]) && /^[0-9a-f]{64}$/.test(tag[1] ?? '') ? [tag[1]] : [])])],
                deletedAt: old?.deletedAt ?? item.deletedAt, deletionEventId: old?.deletionEventId ?? item.deletionEventId });
        }
        const writing = db.transaction(['eventStoreMigration', 'events', name], 'readwrite');
        const done = completed(writing);
        try {
            const checkpoints = writing.objectStore('eventStoreMigration');
            const current = await request(checkpoints.get(MIGRATION_ID)) as Progress | undefined ?? initial();
            // Concurrent tabs may verify the same batch, but only one commits it.
            if (current.tableIndex !== progress.tableIndex || current.lastKey !== progress.lastKey || current.done) {
                await done; continue;
            }
            const events = writing.objectStore('events');
            for (const item of incoming.values()) {
                const old = await request(events.get(item.id)) as StoredEvent | undefined;
                events.put({ ...item, ...(old ? { rawEvent: old.rawEvent,
                    relayUrls: RelayConfigUtils.sanitizeExternalRelayUrls([...old.relayUrls, ...item.relayUrls]),
                    receivedAt: Math.min(old.receivedAt, item.receivedAt), lastSeenAt: Math.max(old.lastSeenAt, item.lastSeenAt),
                    relatedEventIds: [...new Set([...old.relatedEventIds, ...item.relatedEventIds])],
                    deletedAt: old.deletedAt ?? item.deletedAt, deletionEventId: old.deletionEventId ?? item.deletionEventId } : {}) });
            }
            for (const row of split) writing.objectStore(name).put(row.metadata);
            const finishedTable = rows.length < BATCH_SIZE;
            checkpoints.put({ id: MIGRATION_ID, tableIndex: progress.tableIndex + (finishedTable ? 1 : 0),
                lastKey: finishedTable ? '' : String(rows.at(-1)!.id),
                done: finishedTable && progress.tableIndex === EVENT_RECORD_TABLES.length - 1 } satisfies Progress);
            await done;
        } catch (error) {
            try { writing.abort(); } catch { /* already aborted */ }
            await done.catch(() => undefined);
            throw error;
        }
    }
}
