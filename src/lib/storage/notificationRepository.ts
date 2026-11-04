import { ehagakiDb, type EHagakiDB } from './ehagakiDb';
import type { NostrEvent } from '../types';
import { isNotificationEvent } from '../notification';
import { verifyRelatedEvent } from '../relatedEventVerification';
import { RelayConfigUtils } from '../relayConfigUtils';
import { eventRecords } from './eventRepository';

export interface NotificationRecord {
    id: string;
    ownerPubkeyHex: string;
    eventId: string;
    createdAt: number;
    event: NostrEvent;
    relayUrls: string[];
    receivedAt: number;
    unread: 0 | 1;
}
export interface NotificationSyncState {
    id: string;
    ownerPubkeyHex: string;
    recentSince: number;
    olderUntil: number;
    exhausted: boolean;
    updatedAt: number;
    pendingUntil?: number | null;
    pendingSince?: number;
    pendingThrough?: number;
}

export class NotificationRepository {
    constructor(private db: EHagakiDB = ehagakiDb, private now = Date.now) {}

    async upsert(owner: string, items: Array<{ event: NostrEvent; relayUrls?: string[] }>, isActive = () => true) {
        const verified = items.filter(item => isNotificationEvent(item.event, owner))
            .flatMap(item => {
                const result = verifyRelatedEvent(item.event);
                return result ? [{ ...item, event: result.event }] : [];
            });
        if (!verified.length || !isActive()) return;
        await this.db.transaction('rw', this.db.events, this.db.notifications, async tx => {
            for (const item of verified) {
                if (!isActive()) { tx.abort(); return; }
                const id = `${owner}:${item.event.id}`;
                const previous = await this.db.notifications.get(id);
                const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(item.relayUrls ?? []),
                ]);
                if (!isActive()) { tx.abort(); return; }
                await eventRecords(this.db, 'notifications').put({ id, ownerPubkeyHex: owner, eventId: item.event.id,
                    createdAt: item.event.created_at, event: item.event, relayUrls,
                    receivedAt: previous?.receivedAt ?? this.now(), unread: previous?.unread ?? 1 });
            }
            if (!isActive()) tx.abort();
        });
    }

    list(owner: string, limit = 100): Promise<NotificationRecord[]> {
        return this.db.notifications.where('[ownerPubkeyHex+createdAt+eventId]')
            .between([owner, -Infinity, ''], [owner, Infinity, '\uffff']).reverse().limit(limit).toArray()
            .then(rows => eventRecords(this.db, 'notifications').hydrate(rows))
            .then(rows => rows.filter(row => row.event && isNotificationEvent(row.event, owner)));
    }
    async hasUnread(owner: string) {
        return !!await this.db.notifications.where('[ownerPubkeyHex+unread]').equals([owner, 1]).first();
    }
    async unreadEventIds(owner: string): Promise<string[]> {
        const keys = await this.db.notifications.where('[ownerPubkeyHex+unread]').equals([owner, 1]).primaryKeys();
        return keys.map(id => id.slice(owner.length + 1));
    }
    async markRead(owner: string, eventIds: string[], isActive = () => true) {
        await this.db.transaction('rw', this.db.notifications, async () => {
            if (!isActive()) return;
            await this.db.notifications.where('id').anyOf(eventIds.map(id => `${owner}:${id}`))
                .modify({ unread: 0 });
        });
    }
    getSyncState(id: string) { return this.db.notificationSyncState.get(id); }
    async updateSyncState(id: string, update: (previous: NotificationSyncState | undefined) => NotificationSyncState,
        isActive = () => true) {
        return this.db.transaction('rw', this.db.notificationSyncState, async () => {
            const previous = await this.db.notificationSyncState.get(id);
            if (!isActive()) return previous;
            const next = update(previous);
            await this.db.notificationSyncState.put(next);
            return next;
        });
    }
}
export const notificationRepository = new NotificationRepository();
