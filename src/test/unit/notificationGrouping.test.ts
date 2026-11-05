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
    it('combines multiple reposts and reactions across intervening notifications, even without a target', () => {
        const newest = record('repost-new', 6), older = record('repost-old', 6);
        const mention = record('mention', 1), reaction = record('reaction');
        const groups = groupNotifications([newest, mention, reaction, older], () => null);
        expect(groups.map(group => group.id)).toEqual(['repost-new', 'mention']);
        expect(groups[0]!.reposts.map(item => item.id)).toEqual(['repost-new', 'repost-old']);
        expect(groups[0]!.reactions.map(item => item.id)).toEqual(['reaction']);
        expect(groups[0]!.record).toBe(reaction);
        const appended = groupNotifications([newest, mention, reaction, older, record('older-page')], () => target);
        expect(appended[0]!.reactions.map(item => item.id)).toEqual(['reaction', 'older-page']);
    });
    it('groups repost-only targets and ignores repeated delivery of the same source event', () => {
        const first = record('first', 6), second = record('second', 6);
        const groups = groupNotifications([first, second, { ...first, id: 'relay-duplicate' }], () => target);
        expect(groups).toHaveLength(1);
        expect(groups[0]!.reposts).toEqual([first, second]);
        expect(groups[0]!.reactions).toEqual([]);
    });
    it('keeps different target IDs, conflicting authors and kind hints separate before resolution', () => {
        const repost = record('repost', 6);
        const otherTarget = record('other-target', 6, [['p', owner], ['e', 'e'.repeat(64)]]);
        const authorConflict = record('other-author', 7, [['p', author], ['e', targetId]]);
        const kindConflict = record('other-kind', 7, [['p', owner], ['e', targetId], ['k', '42']]);
        const malformed = record('bad-repost', 6, [['p', owner], ['e', 'invalid']]);
        expect(groupNotifications([repost, otherTarget, authorConflict, kindConflict, malformed], () => null)).toHaveLength(5);
    });
    it('groups generic reposts with matching reactions but never joins a kind 6 repost', () => {
        const generic = record('generic', 16, [['p', owner], ['e', targetId], ['k', '1111']]);
        const reaction = record('reaction', 7, [['p', owner], ['e', targetId], ['k', '1111']]);
        const standard = record('standard', 6);
        const groups = groupNotifications([generic, reaction, standard], () => null);
        expect(groups).toHaveLength(2);
        expect(groups[0]!.reposts).toEqual([generic]);
        expect(groups[0]!.reactions).toEqual([reaction]);
        const resolved = groupNotifications([generic, reaction, standard], () => ({ ...target, kind: 1111 }));
        expect(resolved).toHaveLength(2);
        expect(resolved[1]!.targetId).toBeUndefined();
    });
    it('preserves generic repost exclusion of kind 1 even without an explicit k tag', () => {
        const generic = record('generic', 16);
        const unspecified = record('unspecified');
        const standard = record('standard', 6);
        expect(groupNotifications([generic, unspecified, standard], () => null)).toHaveLength(2);
        const groups = groupNotifications([generic, unspecified, standard], () => target);
        expect(groups).toHaveLength(2);
        expect(groups[0]!.reposts).toEqual([generic]);
        expect(groups[1]!.reposts).toEqual([standard]);
        expect(groups[1]!.reactions).toEqual([unspecified]);
    });
    it('intersects multiple repost author hints and separates invalid hints when the target resolves', () => {
        const ambiguous = record('ambiguous', 6, [['p', owner], ['p', author], ['e', targetId]]);
        const valid = record('valid');
        const wrong = record('wrong', 7, [['p', author], ['e', targetId]]);
        const pending = groupNotifications([ambiguous, valid, wrong], () => null);
        expect(pending).toHaveLength(2);
        expect(pending[0]!.reposts).toEqual([ambiguous]);
        expect(pending[0]!.reactions).toEqual([valid]);
        const resolved = groupNotifications([ambiguous, wrong, valid], () => target);
        expect(resolved).toHaveLength(2);
        expect(resolved[0]!.reactions).toEqual([valid]);
        expect(resolved[1]!.reactions).toEqual([wrong]);
    });

});
