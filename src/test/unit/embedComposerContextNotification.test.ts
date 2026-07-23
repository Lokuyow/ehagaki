import { describe, expect, it } from 'vitest';
import {
    buildComposerContextSignature,
    buildComposerContextUpdatedPayload,
    encodeComposerContextReference,
} from '../../lib/embedComposerContextNotification';
import { getChannelFromEmbedPayload } from '../../lib/urlQueryHandler';

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
                authorPicture: null,
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
                    authorPicture: null,
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
        }, null, 12345);

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

    it('provenanceにある明示nullだけを通知し、未取得nullは省略する', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: '55'.repeat(32),
            relayHints: [],
            name: null,
            about: null,
            picture: null,
        }, {
            source: 'iframe',
            metadataOverrides: { name: null },
        }, 123);

        expect(payload.channel).toEqual({
            reference: expect.stringMatching(/^note1/),
            name: null,
        });
        expect(payload.channel).not.toHaveProperty('about');
        expect(payload.channel).not.toHaveProperty('picture');
    });

    it('外部provenanceではoverride relayだけを通知しverified relayを再分類させない', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: '66'.repeat(32),
            relayHints: ['wss://read.example.com/'],
            channelRelays: ['wss://verified.example.com/'],
            name: 'Verified',
            about: null,
            picture: null,
        }, {
            source: 'iframe',
            metadataOverrides: { name: 'Parent' },
            channelRelayOverrides: ['wss://external.example.com/'],
        }, 123);

        expect(payload.channel).toEqual({
            reference: expect.stringMatching(/^nevent1/),
            relays: ['wss://external.example.com/'],
            name: 'Parent',
        });
        expect(payload.channel?.relays).not.toContain('wss://verified.example.com/');

        const reapplied = getChannelFromEmbedPayload({ channel: payload.channel! });
        expect(reapplied?.channelRelays).toEqual(['wss://external.example.com/']);
        expect(reapplied?.channelRelays).not.toContain('wss://verified.example.com/');
    });

    it.each(['iframe', 'url'] as const)(
        '%s provenanceにrelay overrideがなければstable write relayを通知しない',
        (source) => {
            const payload = buildComposerContextUpdatedPayload({
                reply: null,
                quotes: [],
            }, {
                eventId: '77'.repeat(32),
                relayHints: [],
                channelRelays: ['wss://verified.example.com/'],
                name: null,
                about: null,
                picture: null,
            }, {
                source,
                metadataOverrides: {},
            });

            expect(payload.channel).not.toHaveProperty('relays');
        },
    );

    it('URL provenanceでもoverride relayだけを通知する', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: '88'.repeat(32),
            relayHints: [],
            channelRelays: ['wss://verified.example.com/'],
            name: null,
            about: null,
            picture: null,
        }, {
            source: 'url',
            metadataOverrides: {},
            channelRelayOverrides: ['wss://url-override.example.com/'],
        });

        expect(payload.channel?.relays).toEqual([
            'wss://url-override.example.com/',
        ]);
        expect(payload.channel?.relays).not.toContain(
            'wss://verified.example.com/',
        );
    });

    it('draft provenanceではstable relayとmetadata overrideを同時に通知する', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: '99'.repeat(32),
            relayHints: ['wss://read.example.com/'],
            channelRelays: ['wss://verified.example.com/'],
            name: 'Verified name',
            about: 'Verified about',
            picture: 'https://example.com/verified.png',
        }, {
            source: 'draft',
            metadataOverrides: {
                name: 'Draft override',
            },
        });

        expect(payload.channel).toEqual({
            reference: expect.stringMatching(/^nevent1/),
            relays: ['wss://verified.example.com/'],
            name: 'Draft override',
            about: 'Verified about',
            picture: 'https://example.com/verified.png',
        });
    });

    it('draft provenanceの明示nullと未指定metadataを区別しstable relayを通知する', () => {
        const payload = buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: 'aa'.repeat(32),
            relayHints: [],
            channelRelays: ['wss://verified.example.com/'],
            name: 'Verified name',
            about: 'Verified about',
            picture: 'https://example.com/verified.png',
        }, {
            source: 'draft',
            metadataOverrides: {
                name: null,
                picture: null,
            },
        });

        expect(payload.channel).toEqual({
            reference: expect.stringMatching(/^note1/),
            relays: ['wss://verified.example.com/'],
            name: null,
            about: 'Verified about',
            picture: null,
        });
    });

    it('draft provenanceではstable relayだけの変更もsignatureへ反映する', () => {
        const build = (relay: string) => buildComposerContextUpdatedPayload({
            reply: null,
            quotes: [],
        }, {
            eventId: 'bb'.repeat(32),
            relayHints: [],
            channelRelays: [relay],
            name: 'Verified',
            about: null,
            picture: null,
        }, {
            source: 'draft',
            metadataOverrides: { name: 'Draft override' },
        });

        const first = build('wss://relay-a.example.com/');
        const second = build('wss://relay-b.example.com/');

        expect(buildComposerContextSignature(first))
            .not.toBe(buildComposerContextSignature(second));
        expect(first.channel?.relays).toEqual(['wss://relay-a.example.com/']);
        expect(second.channel?.relays).toEqual(['wss://relay-b.example.com/']);
    });
});
