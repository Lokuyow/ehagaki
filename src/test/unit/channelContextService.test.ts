import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import { ChannelContextService } from '../../lib/channelContextService';

describe('ChannelContextService', () => {
    let service: ChannelContextService;
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as any;
        service = new ChannelContextService({ console: mockConsole });
    });

    it('kind 40 と最新 kind 41 から channel metadata と relays を解決する', async () => {
        const rootEvent = {
            id: 'a'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 100,
            kind: 40,
            tags: [],
            content: JSON.stringify({
                name: 'General',
                about: 'Root about',
                picture: 'https://example.com/root.png',
                relays: ['wss://root-relay.example.com'],
            }),
            sig: 'sig-root',
        };
        const updatedEvent = {
            id: 'c'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 200,
            kind: 41,
            tags: [['e', 'a'.repeat(64), 'wss://meta-source.example.com', 'root']],
            content: JSON.stringify({
                about: 'Updated about',
                picture: 'https://example.com/updated.png',
                relays: ['wss://channel-write.example.com', 'wss://channel-backup.example.com'],
            }),
            sig: 'sig-update',
        };

        const mockRxNostr: RxNostr = {
            use: vi.fn()
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: rootEvent, from: 'wss://root-source.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: updatedEvent, from: 'wss://meta-source.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                }),
        } as any;

        const result = await service.resolveChannelMetadata({
            eventId: 'a'.repeat(64),
            relayHints: ['wss://hint-relay.example.com'],
        }, mockRxNostr, null);

        expect(result).toEqual({
            channelEventId: 'a'.repeat(64),
            relayHints: [
                'wss://hint-relay.example.com/',
                'wss://root-source.example.com/',
                'wss://meta-source.example.com/',
            ],
            channelRelays: [
                'wss://channel-write.example.com/',
                'wss://channel-backup.example.com/',
                'wss://root-relay.example.com/',
            ],
            name: 'General',
            about: 'Updated about',
            picture: 'https://example.com/updated.png',
            creatorPubkey: 'b'.repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: 'c'.repeat(64),
            metadataCreatedAt: 200,
        });
    });

    it('author が異なる kind 41 は無視する', async () => {
        const rootEvent = {
            id: 'a'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 100,
            kind: 40,
            tags: [],
            content: JSON.stringify({
                name: 'General',
                about: 'Root about',
            }),
            sig: 'sig-root',
        };
        const invalidAuthorEvent = {
            id: 'x'.repeat(64),
            pubkey: 'c'.repeat(64),
            created_at: 200,
            kind: 41,
            tags: [['e', 'a'.repeat(64)]],
            content: JSON.stringify({ about: 'Wrong author about' }),
            sig: 'sig-invalid-author',
        };

        const mockRxNostr: RxNostr = {
            use: vi.fn()
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: rootEvent, from: 'wss://root-source.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: invalidAuthorEvent, from: 'wss://meta-source.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                }),
        } as any;

        const result = await service.resolveChannelMetadata({
            eventId: 'a'.repeat(64),
            relayHints: ['wss://hint-relay.example.com'],
        }, mockRxNostr, null);

        expect(result).toEqual({
            channelEventId: 'a'.repeat(64),
            relayHints: [
                'wss://hint-relay.example.com/',
                'wss://root-source.example.com/',
            ],
            name: 'General',
            about: 'Root about',
            picture: null,
            creatorPubkey: 'b'.repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: null,
            metadataCreatedAt: null,
        });
    });

    it('JSON が壊れた新しい kind 41 より古い valid kind 41 を優先する', async () => {
        const rootEvent = {
            id: 'a'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 100,
            kind: 40,
            tags: [],
            content: JSON.stringify({
                name: 'General',
                about: 'Root about',
            }),
            sig: 'sig-root',
        };
        const validUpdatedEvent = {
            id: 'c'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 150,
            kind: 41,
            tags: [['e', 'a'.repeat(64)]],
            content: JSON.stringify({ about: 'Valid update' }),
            sig: 'sig-valid-update',
        };
        const invalidUpdatedEvent = {
            id: 'd'.repeat(64),
            pubkey: 'b'.repeat(64),
            created_at: 200,
            kind: 41,
            tags: [['e', 'a'.repeat(64)]],
            content: '{invalid-json',
            sig: 'sig-invalid-update',
        };

        const mockRxNostr: RxNostr = {
            use: vi.fn()
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: rootEvent, from: 'wss://root-source.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: vi.fn((observer: any) => {
                        observer.next?.({ event: validUpdatedEvent, from: 'wss://valid-meta.example.com' });
                        observer.next?.({ event: invalidUpdatedEvent, from: 'wss://invalid-meta.example.com' });
                        observer.complete?.();
                        return { unsubscribe: vi.fn() };
                    }),
                }),
        } as any;

        const result = await service.resolveChannelMetadata({
            eventId: 'a'.repeat(64),
            relayHints: ['wss://hint-relay.example.com'],
        }, mockRxNostr, null);

        expect(result).toEqual({
            channelEventId: 'a'.repeat(64),
            relayHints: [
                'wss://hint-relay.example.com/',
                'wss://root-source.example.com/',
                'wss://valid-meta.example.com/',
            ],
            name: 'General',
            about: 'Valid update',
            picture: null,
            creatorPubkey: 'b'.repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: 'c'.repeat(64),
            metadataCreatedAt: 150,
        });
    });

    it('イベントが取得できない場合は relayHints のみ保持して metadata を空にする', async () => {
        const mockRxNostr: RxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer: any) => {
                    observer.complete?.();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        } as any;

        const result = await service.resolveChannelContext({
            eventId: 'd'.repeat(64),
            relayHints: ['wss://hint-relay.example.com'],
        }, mockRxNostr, null);

        expect(result).toEqual({
            eventId: 'd'.repeat(64),
            relayHints: ['wss://hint-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
        });
    });
});