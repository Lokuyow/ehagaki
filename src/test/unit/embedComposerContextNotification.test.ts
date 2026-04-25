import { describe, expect, it } from 'vitest';
import {
    buildComposerContextSignature,
    buildComposerContextUpdatedPayload,
    encodeComposerContextReference,
} from '../../lib/embedComposerContextNotification';

describe('embedComposerContextNotification', () => {
    it('relay hint または author がある参照は nevent として encode する', () => {
        const encoded = encodeComposerContextReference({
            eventId: '11'.repeat(32),
            relayHints: ['wss://relay.example.com'],
            authorPubkey: '22'.repeat(32),
        });

        expect(encoded.startsWith('nevent1')).toBe(true);
    });

    it('relay hint も author もない参照は note として encode する', () => {
        const encoded = encodeComposerContextReference({
            eventId: '33'.repeat(32),
            relayHints: [],
            authorPubkey: null,
        });

        expect(encoded.startsWith('note1')).toBe(true);
    });

    it('reply / quote state から composer.contextUpdated payload を作る', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: {
                mode: 'reply',
                eventId: '11'.repeat(32),
                relayHints: ['wss://relay.example.com'],
                authorPubkey: '22'.repeat(32),
                quoteNotificationEnabled: false,
                authorDisplayName: null,
                referencedEvent: null,
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
                loading: false,
                error: null,
            },
            quotes: [
                {
                    mode: 'quote',
                    eventId: '33'.repeat(32),
                    relayHints: [],
                    authorPubkey: null,
                    quoteNotificationEnabled: true,
                    authorDisplayName: null,
                    referencedEvent: null,
                    rootEventId: null,
                    rootRelayHint: null,
                    rootPubkey: null,
                    loading: false,
                    error: null,
                },
            ],
        }, {
            eventId: '44'.repeat(32),
            relayHints: ['wss://channel-relay.example.com'],
            channelRelays: ['wss://channel-write.example.com'],
            name: 'General',
            about: 'General discussion',
            picture: 'https://example.com/channel.png',
        }, 12345);

        expect(payload).toEqual({
            timestamp: 12345,
            reply: expect.stringMatching(/^nevent1/),
            quotes: [expect.stringMatching(/^note1/)],
            channel: {
                reference: expect.stringMatching(/^nevent1/),
                relays: ['wss://channel-write.example.com'],
                name: 'General',
                about: 'General discussion',
                picture: 'https://example.com/channel.png',
            },
        });
    });

    it('signature は timestamp を無視して reply / quotes / channel だけで決まる', () => {
        const first = buildComposerContextSignature({
            reply: 'nevent1reply',
            quotes: ['note1quote'],
            channel: { reference: 'nevent1channel', name: 'General' },
        });
        const second = buildComposerContextSignature({
            reply: 'nevent1reply',
            quotes: ['note1quote'],
            channel: { reference: 'nevent1channel', name: 'General' },
        });

        expect(first).toBe(second);
    });
});
