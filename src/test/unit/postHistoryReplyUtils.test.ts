import { describe, expect, it } from 'vitest';

import {
    buildPostHistoryReferenceTarget,
    buildPostHistoryReplyChannelContextQuery,
    buildPostHistoryReplySeedEvents,
} from '../../lib/postHistoryReplyUtils';

function createRecord(overrides: Record<string, unknown> = {}) {
    return {
        id: 'event-1',
        eventId: 'event-1',
        pubkeyHex: 'a'.repeat(64),
        kind: 1,
        content: 'content',
        tags: [],
        createdAt: 1,
        postedAt: 1,
        relayHints: ['wss://hint.example.com/'],
        acceptedRelays: ['wss://accepted.example.com/'],
        media: [],
        rawEvent: null,
        updatedAt: 1,
        schemaVersion: 2,
        ...overrides,
    };
}

describe('postHistoryReplyUtils', () => {
    it('reply/quote 用の参照ターゲットを正規化して返す', () => {
        const record = createRecord({
            relayHints: [
                'wss://hint.example.com',
                'https://invalid.example.com',
            ],
            acceptedRelays: [
                'wss://accepted.example.com/',
                'wss://accepted.example.com',
            ],
        });

        expect(buildPostHistoryReferenceTarget(record as never)).toEqual({
            eventId: 'event-1',
            relayHints: [
                'wss://hint.example.com/',
                'wss://accepted.example.com/',
            ],
            authorPubkey: 'a'.repeat(64),
        });
    });

    it('kind42 では channel context query を返す', () => {
        const record = createRecord({
            kind: 42,
            channelEventId: 'channel-root-event',
            channelRelayHints: ['wss://channel-hint.example.com/'],
            relayHints: ['wss://history-hint.example.com/'],
            acceptedRelays: ['wss://channel-write.example.com/'],
        });

        expect(buildPostHistoryReplyChannelContextQuery(record as never)).toEqual({
            eventId: 'channel-root-event',
            relayHints: [
                'wss://channel-hint.example.com/',
                'wss://history-hint.example.com/',
                'wss://channel-write.example.com/',
            ],
            channelRelays: ['wss://channel-write.example.com/'],
        });
    });

    it('rawEvent しか無くても kind42 の channel context を導出できる', () => {
        const record = createRecord({
            kind: 42,
            rawEvent: {
                id: 'event-1',
                pubkey: 'a'.repeat(64),
                created_at: 1,
                kind: 42,
                tags: [['e', 'channel-root-event', 'wss://channel-hint.example.com/', 'root']],
                content: 'content',
                sig: 'sig',
            },
        });

        expect(buildPostHistoryReplyChannelContextQuery(record as never)).toEqual({
            eventId: 'channel-root-event',
            relayHints: [
                'wss://channel-hint.example.com/',
                'wss://hint.example.com/',
                'wss://accepted.example.com/',
            ],
            channelRelays: ['wss://accepted.example.com/'],
        });
    });

    it('kind42 以外では channel context query を返さない', () => {
        expect(buildPostHistoryReplyChannelContextQuery(createRecord() as never)).toBeNull();
    });

    it('signed rawEvent がある時だけ reply seed event を返す', () => {
        const record = createRecord({
            rawEvent: {
                id: 'event-1',
                pubkey: 'a'.repeat(64),
                created_at: 1,
                kind: 1,
                tags: [],
                content: 'content',
                sig: 'sig',
            },
        });

        expect(buildPostHistoryReplySeedEvents(record as never)).toEqual({
            'event-1': record.rawEvent,
        });
        expect(buildPostHistoryReplySeedEvents(createRecord() as never)).toBeUndefined();
    });
});