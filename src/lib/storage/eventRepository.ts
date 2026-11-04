import { EVENT_RECORD_TABLES, splitEventRecord, type StoredEvent, type RecordValue, type VerifiedEventInput, type EventRecordTableName } from "./eventStorageModel";
export type { StoredEvent } from "./eventStorageModel";
import type { Table } from 'dexie';
import type { EHagakiDB, PostHistoryRecord, PostHistoryChildInteractionRecord, PostHistoryDeletionRequestRecord, SensitivePayloadRecord } from './ehagakiDb';
import type { NotificationRecord } from './notificationRepository';
import type { NostrEvent } from '../types';
import { RelayConfigUtils } from '../relayConfigUtils';
import { isSameSignedNostrEvent } from '../postHistoryEventUtils';
import { attestFullyVerifiedPostHistoryRawEvent, RAW_EVENT_VERIFICATION_RULE_VERSION } from '../postHistoryRawEventVerification';

const relayUrls = (urls: string[]) => RelayConfigUtils.sanitizeExternalRelayUrls(urls);
/** Only storage adapters call this with events already verified by their repository. */
async function storeVerifiedEvents(db: EHagakiDB, items: VerifiedEventInput[]) {
    const unique = new Map<string, typeof items[number]>();
    for (const item of items) {
        const previous = unique.get(item.event.id);
        unique.set(item.event.id, { ...previous, ...item, relayUrls: [...(previous?.relayUrls ?? []), ...(item.relayUrls ?? [])] });
    }
    const previous = await db.events.bulkGet([...unique.keys()]);
    const rows = [...unique.values()].map((item, index): StoredEvent => {
        const old = previous[index];
        // A verified event ID identifies immutable signing fields. Keep the
        // original wire snapshot, including its signature, on duplicate replay.
        const event = old && isSameSignedNostrEvent(old.rawEvent, item.event) ? old.rawEvent : item.event;
        const now = item.receivedAt ?? Date.now();
        return { id: event.id, rawEvent: event,
            verification: item.verification ?? { status: 'valid', ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION },
            relayUrls: relayUrls([...(old?.relayUrls ?? []), ...(item.relayUrls ?? [])]),
            receivedAt: Math.min(old?.receivedAt ?? now, now), lastSeenAt: Math.max(old?.lastSeenAt ?? now, now),
            relatedEventIds: [...new Set([...(old?.relatedEventIds ?? []), ...(item.relatedEventIds ?? []),
                ...event.tags.flatMap(tag => ['e', 'q', 'c'].includes(tag[0]) && /^[0-9a-f]{64}$/.test(tag[1] ?? '') ? [tag[1]] : [])])],
            deletedAt: old?.deletedAt ?? item.deletedAt, deletionEventId: old?.deletionEventId ?? item.deletionEventId };
    });
    if (rows.length) await db.events.bulkPut(rows);
}

export async function hydrateEventRecords<T>(db: EHagakiDB, records: T[], name: EventRecordTableName): Promise<T[]> {
    const rows = records as RecordValue[];
    const ids = rows.flatMap(row => [eventId(row, name), row.repostTarget?.eventId].filter(Boolean));
    const events = new Map((await db.events.bulkGet([...new Set(ids)])).flatMap(event => event ? [[event.id, event] as const] : []));
    return rows.map(row => {
        const saved = events.get(eventId(row, name));
        if (!saved) return row;
        const event = saved.rawEvent;
        const target = events.get(row.repostTarget?.eventId);
        return { ...row, ...(name === 'notifications' ? { event, relayUrls: saved.relayUrls }
            : { rawEvent: event, ...(name !== 'postHistoryChildInteractions' ? { rawEventVerification: saved.verification } : {}),
                ...(name === 'postHistory' || name === 'postHistoryChildInteractions' ? { content: event.content, tags: event.tags } : {}),
                ...(name === 'postHistory' || name === 'sensitivePayloads' ? { fetchedRelays: saved.relayUrls } : { relayUrls: saved.relayUrls }) }),
            ...(target ? { repostTarget: { rawEvent: target.rawEvent, rawEventVerification: target.verification, relayHints: row.repostTarget.relayHints } }
                : row.repostTarget?.eventId ? { repostTarget: undefined } : {}),
            ...(saved.deletedAt !== undefined ? { deletedAt: saved.deletedAt, deletionEventId: saved.deletionEventId } : {}) };
    }) as T[];
}

function eventId(row: RecordValue, name: EventRecordTableName): string {
    return name === 'postHistoryDeletionRequests' ? row.deletionEventId : row.eventId ?? row.id;
}

/** Projection codecs live at the repository boundary; raw Dexie tables contain metadata only. */
export function eventRecords<N extends EventRecordTableName>(db: EHagakiDB, name: N) {
    type Rows = { postHistory: PostHistoryRecord; postHistoryChildInteractions: PostHistoryChildInteractionRecord;
        postHistoryDeletionRequests: PostHistoryDeletionRequestRecord; sensitivePayloads: SensitivePayloadRecord; notifications: NotificationRecord };
    type Row = Rows[N];
    const table = db[name] as unknown as Table<Row, string>;
    const hydrate = (rows: Array<Row | import('./eventStorageModel').EventProjection<Row>>) => hydrateEventRecords(db, rows as Row[], name);
    const bulkPut = async (rows: Row[]) => {
        const split = rows.map(row => splitEventRecord(row as RecordValue, name));
        return db.transaction('rw', db.events, table, async () => {
            await storeVerifiedEvents(db, split.flatMap(item => item.items));
            return table.bulkPut(split.map(item => item.metadata as Row));
        });
    };
    const get = async (id: string): Promise<Row | undefined> => {
        const row = await table.get(id);
        return row ? (await hydrate([row]))[0] : undefined;
    };
    return { hydrate, get,
        bulkGet: async (ids: string[]) => {
            const rows = await table.bulkGet(ids);
            const hydrated = await hydrate(rows.filter((row): row is Row => !!row));
            let index = 0;
            return rows.map(row => row ? hydrated[index++] : undefined);
        },
        put: async (row: Row) => {
            const split = splitEventRecord(row as RecordValue, name);
            return db.transaction('rw', db.events, table, async () => {
                await storeVerifiedEvents(db, split.items);
                return table.put(split.metadata as Row);
            });
        }, bulkPut,
        update: async (id: string, changes: Partial<Row>) => {
            return db.transaction('rw', db.events, table, async () => {
                const row = await get(id);
                if (!row) return 0;
                await bulkPut([{ ...row, ...changes }]);
                return 1;
            });
        },
    };
}

export class EventRepository {
    constructor(private db: EHagakiDB) {}
    async get(id: string): Promise<StoredEvent | undefined> {
        const saved = await this.db.events.get(id);
        if (!saved || saved.deletedAt !== undefined) return saved;
        const verified = attestFullyVerifiedPostHistoryRawEvent(saved.rawEvent);
        return verified ? { ...saved, rawEvent: verified.event } : undefined;
    }
    async save(event: NostrEvent, sources: string[], isActive: () => boolean, sourceEventId?: string) {
        const verified = attestFullyVerifiedPostHistoryRawEvent(event);
        if (!verified || !isActive()) return;
        await this.db.transaction('rw', this.db.events, async tx => {
            if (!isActive()) return;
            await storeVerifiedEvents(this.db, [{ event: verified.event, relayUrls: sources }]);
            if (sourceEventId) await this.link(sourceEventId, event.id, isActive);
            if (!isActive()) tx.abort();
        });
    }
    async link(sourceEventId: string, targetEventId: string, isActive: () => boolean) {
        await this.db.transaction('rw', this.db.events, async tx => {
            if (!isActive()) return;
            const source = await this.db.events.get(sourceEventId);
            if (source && !source.relatedEventIds.includes(targetEventId)) {
                await this.db.events.update(sourceEventId, { relatedEventIds: [...source.relatedEventIds, targetEventId] });
            }
            if (!isActive()) tx.abort();
        });
    }
}

/** Called in the same transaction as history clear. Notifications remain roots. */
export async function collectUnreferencedEvents(db: EHagakiDB) {
    const roots = new Set<string>();
    for (const name of EVENT_RECORD_TABLES) {
        const rows = await (db[name] as Table<any, string>).toArray();
        for (const row of rows) { roots.add(eventId(row, name)); if (row.repostTarget?.eventId) roots.add(row.repostTarget.eventId); }
    }
    const rows = await db.events.toArray();
    const byId = new Map(rows.map(row => [row.id, row]));
    const pending = [...roots];
    while (pending.length) {
        const current = byId.get(pending.pop()!);
        for (const id of [...(current?.relatedEventIds ?? []), ...(current?.deletionEventId ? [current.deletionEventId] : [])]) {
            if (!roots.has(id)) { roots.add(id); pending.push(id); }
        }
    }
    await db.events.bulkDelete(rows.filter(row => !roots.has(row.id) && row.deletedAt === undefined).map(row => row.id));
}
