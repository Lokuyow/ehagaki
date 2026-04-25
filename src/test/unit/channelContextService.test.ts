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

        const result = await service.resolveChannelContext({
            eventId: 'a'.repeat(64),
            relayHints: ['wss://hint-relay.example.com'],
        }, mockRxNostr, null);

        expect(result).toEqual({
            eventId: 'a'.repeat(64),
            relayHints: [
                'wss://hint-relay.example.com/',
                'wss://root-source.example.com/',
            ],
            channelRelays: [
                'wss://channel-write.example.com/',
                'wss://channel-backup.example.com/',
                'wss://root-relay.example.com/',
            ],
            name: 'General',
            about: 'Updated about',
            picture: 'https://example.com/updated.png',
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