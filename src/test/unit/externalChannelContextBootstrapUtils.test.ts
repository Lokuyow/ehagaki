import { describe, expect, it, vi } from 'vitest';

import { processExternalChannelContextQuery } from '../../lib/bootstrap/externalChannelContextBootstrapUtils';

describe('externalChannelContextBootstrapUtils', () => {
    it('metadata が与えられている時は service 解決なしでそのまま適用する', async () => {
        const setChannelContext = vi.fn();
        const resolveChannelContext = vi.fn();

        await processExternalChannelContextQuery({
            channelContextQuery: {
                eventId: 'channel-root-event',
                relayHints: ['wss://channel-relay.example.com/'],
                name: 'General',
                about: 'Public chat',
                picture: 'https://example.com/channel.png',
            },
            channelContextService: { resolveChannelContext } as never,
            rxNostr: { tag: 'rxnostr' },
            relayConfig: null,
            setChannelContext,
        });

        expect(setChannelContext).toHaveBeenCalledWith({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
        expect(resolveChannelContext).not.toHaveBeenCalled();
    });

    it('metadata が無い時は loading を出して relay から解決する', async () => {
        const setChannelContext = vi.fn();
        const resolvedChannelContext = {
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            channelRelays: ['wss://channel-write.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        };
        const resolveChannelContext = vi.fn(async () => resolvedChannelContext);

        await processExternalChannelContextQuery({
            channelContextQuery: {
                eventId: 'channel-root-event',
                relayHints: ['wss://channel-relay.example.com/'],
                name: null,
                about: null,
                picture: null,
            },
            channelContextService: { resolveChannelContext } as never,
            rxNostr: { tag: 'rxnostr' },
            relayConfig: null,
            setChannelContext,
        });

        expect(setChannelContext).toHaveBeenNthCalledWith(1, {
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
            isMetadataLoading: true,
        });
        expect(setChannelContext).toHaveBeenNthCalledWith(2, resolvedChannelContext);
        expect(resolveChannelContext).toHaveBeenCalledWith(
            {
                eventId: 'channel-root-event',
                relayHints: ['wss://channel-relay.example.com/'],
                name: null,
                about: null,
                picture: null,
            },
            { tag: 'rxnostr' },
            null,
        );
    });
});