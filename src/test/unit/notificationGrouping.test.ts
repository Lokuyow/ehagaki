import { describe, expect, it } from 'vitest';
import { groupNotifications } from '../../lib/notificationGrouping';
import type { NotificationRecord } from '../../lib/storage/notificationRepository';
import type { NostrEvent } from '../../lib/types';

const targetId = 'a'.repeat(64), owner = 'b'.repeat(64), author = 'c'.repeat(64);
const target: NostrEvent = { id: targetId, pubkey: owner, kind: 1, content: 'target', tags: [], created_at: 1, sig: 'd'.repeat(128) };
function record(id: string, kind = 7, tags: string[][] = [['p', owner], ['e', targetId]]): NotificationRecord {
    return { id, ownerPubkeyHex: owner, eventId: id, createdAt: 1, receivedAt: 1, unread: 1, relayUrls: [],
        event: { id, pubkey: author, kind, content: '+', tags, created_at: 1, sig: 'd'.repeat(128) } };
}

describe('groupNotifications', () => {
    it('groups nonadjacent reactions by target and keeps the newest group position', () => {
        const newest = record('new'), mention = record('mention', 1), older = record('old', 7, [['p', owner], ['e', targetId], ['k', '1']]);
        const groups = groupNotifications([newest, mention, older], () => target);
        expect(groups.map(group => group.id)).toEqual(['new', 'mention']);
        expect(groups[0]!.reactions.map(item => item.id)).toEqual(['new', 'old']);
    });
    it('keeps mismatched and malformed references separate and preserves other targets', () => {
        const good = record('good'), badKind = record('bad', 7, [['p', owner], ['e', targetId], ['k', '42']]);
        const malformed = record('malformed', 7, [['p', owner], ['e', 'invalid']]);
        const other = record('other', 7, [['p', owner], ['e', 'e'.repeat(64)]]);
        const groups = groupNotifications([good, badKind, malformed, other], id => id === targetId ? target : null);
        expect(groups.map(group => group.reactions.map(item => item.id))).toEqual([['good'], ['bad'], ['malformed'], ['other']]);
    });
    it('coalesces missing and matching kind hints without weakening explicit incompatible hints', () => {
        const first = record('with-kind', 7, [['p', owner], ['e', targetId], ['k', '1']]);
        const unspecified = record('without-kind');
        const conflict = record('conflict', 7, [['p', owner], ['e', targetId], ['k', '42']]);
        const groups = groupNotifications([first, unspecified, conflict], () => null);
        expect(groups.map(group => group.reactions.map(item => item.id))).toEqual([['with-kind', 'without-kind'], ['conflict']]);
        expect(groups[0]!.record.id).toBe('without-kind');
    });
});
