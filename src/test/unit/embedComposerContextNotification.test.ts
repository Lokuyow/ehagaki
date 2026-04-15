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
                    authorDisplayName: null,
                    referencedEvent: null,
                    rootEventId: null,
                    rootRelayHint: null,
                    rootPubkey: null,
                    loading: false,
                    error: null,
                },
            ],
        }, 12345);

        expect(payload).toEqual({
            timestamp: 12345,
            reply: expect.stringMatching(/^nevent1/),
            quotes: [expect.stringMatching(/^note1/)],
        });
    });

    it('signature は timestamp を無視して reply / quotes だけで決まる', () => {
        const first = buildComposerContextSignature({
            reply: 'nevent1reply',
            quotes: ['note1quote'],
        });
        const second = buildComposerContextSignature({
            reply: 'nevent1reply',
            quotes: ['note1quote'],
        });

        expect(first).toBe(second);
    });
});