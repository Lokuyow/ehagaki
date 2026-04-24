import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const state = {
        resolveReferencedEvent: null as ((value: any) => void) | null,
        resolveProfile: null as ((value: any) => void) | null,
        hasChannelQueryParam: vi.fn(() => false),
        getChannelFromUrlQuery: vi.fn(() => null),
        hasReplyQuoteQueryParam: vi.fn(() => true),
        getReplyQuoteFromUrlQuery: vi.fn(() => ({
            reply: {
                eventId: 'event-1',
                relayHints: ['wss://hint-relay.example.com'],
            },
            quotes: [],
        })),
        hasContentQueryParam: vi.fn(() => false),
        getContentFromUrlQuery: vi.fn(() => null),
        cleanupAllQueryParams: vi.fn(),
        resolveChannelContext: vi.fn().mockResolvedValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-write.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        }),
        fetchReferencedEvent: vi.fn(() => new Promise((resolve) => {
            state.resolveReferencedEvent = resolve;
        })),
        extractThreadInfo: vi.fn(() => ({
            rootEventId: null,
            rootRelayHint: null,
            rootPubkey: null,
        })),
        checkIfOpenedFromShare: vi.fn(() => false),
        checkServiceWorkerStatus: vi.fn().mockResolvedValue({
            isReady: true,
            hasController: true,
        }),
        testServiceWorkerCommunication: vi.fn().mockResolvedValue(true),
        getSharedMediaWithFallback: vi.fn().mockResolvedValue(null),
        fetchProfileRealtime: vi.fn().mockResolvedValue(null),
    };

    return state;
});

vi.mock('../../lib/urlQueryHandler', () => ({
    getContentFromUrlQuery: mockState.getContentFromUrlQuery,
    hasContentQueryParam: mockState.hasContentQueryParam,
    cleanupAllQueryParams: mockState.cleanupAllQueryParams,
    getChannelFromUrlQuery: mockState.getChannelFromUrlQuery,
    hasChannelQueryParam: mockState.hasChannelQueryParam,
    getReplyQuoteFromUrlQuery: mockState.getReplyQuoteFromUrlQuery,
    hasReplyQuoteQueryParam: mockState.hasReplyQuoteQueryParam,
}));

vi.mock('../../lib/replyQuoteService', () => ({
    ReplyQuoteService: vi.fn(() => ({
        fetchReferencedEvent: mockState.fetchReferencedEvent,
        extractThreadInfo: mockState.extractThreadInfo,
    })),
}));

vi.mock('../../lib/channelContextService', () => ({
    ChannelContextService: vi.fn(() => ({
        resolveChannelContext: mockState.resolveChannelContext,
    })),
}));

vi.mock('../../lib/shareHandler', () => ({
    checkIfOpenedFromShare: mockState.checkIfOpenedFromShare,
}));

vi.mock('../../lib/utils/swCommunication', () => ({
    checkServiceWorkerStatus: mockState.checkServiceWorkerStatus,
    testServiceWorkerCommunication: mockState.testServiceWorkerCommunication,
    getSharedMediaWithFallback: mockState.getSharedMediaWithFallback,
}));

import { runExternalInputBootstrap } from '../../lib/bootstrap/externalInputBootstrap';

function createParams() {
    return {
        sharedError: null,
        sharedMediaStore: {
            files: [],
            metadata: undefined,
            received: false,
        },
        isSharedMediaProcessed: vi.fn(() => false),
        markSharedMediaProcessed: vi.fn(),
        setSharedMediaError: vi.fn(),
        consumeFirstVisitFlag: vi.fn(() => false),
        showWelcomeDialog: vi.fn(),
        updateUrlQueryContentStore: vi.fn(),
        setChannelContext: vi.fn(),
        setReplyQuote: vi.fn(),
        updateReferencedEvent: vi.fn(),
        updateAuthorDisplayName: vi.fn(),
        setReplyQuoteError: vi.fn(),
        relayProfileService: {
            fetchProfileRealtime: mockState.fetchProfileRealtime,
        },
        rxNostr: { tag: 'rxnostr' },
        relayConfig: null,
        locationHref: 'http://localhost/?reply=test',
    };
}

describe('runExternalInputBootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.resolveReferencedEvent = null;
        mockState.resolveProfile = null;
        mockState.hasChannelQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue(null);
        mockState.resolveChannelContext.mockResolvedValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-write.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
        mockState.hasReplyQuoteQueryParam.mockReturnValue(true);
        mockState.getReplyQuoteFromUrlQuery.mockReturnValue({
            reply: {
                eventId: 'event-1',
                relayHints: ['wss://hint-relay.example.com'],
            },
            quotes: [],
        });
        mockState.hasContentQueryParam.mockReturnValue(false);
        mockState.getContentFromUrlQuery.mockReturnValue(null);
        mockState.checkIfOpenedFromShare.mockReturnValue(false);
        mockState.fetchProfileRealtime.mockResolvedValue(null);
    });

    it('reply/quote の参照イベント取得が完了するまで完了しない', async () => {
        const params = createParams();
        let resolved = false;

        const bootstrapPromise = runExternalInputBootstrap(params as never).then(() => {
            resolved = true;
        });

        await Promise.resolve();
        await Promise.resolve();

        expect(params.setReplyQuote).toHaveBeenCalledWith({
            reply: {
                eventId: 'event-1',
                relayHints: ['wss://hint-relay.example.com/'],
            },
            quotes: [],
        });
        expect(mockState.fetchReferencedEvent).toHaveBeenCalledWith(
            'event-1',
            ['wss://hint-relay.example.com/'],
            params.rxNostr,
            null,
        );
        expect(resolved).toBe(false);
        expect(mockState.cleanupAllQueryParams).not.toHaveBeenCalled();

        const event = {
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'hello',
            sig: 'sig',
        };
        mockState.resolveReferencedEvent?.(event);

        await bootstrapPromise;

        expect(params.updateReferencedEvent).toHaveBeenCalledWith(
            'event-1',
            event,
            {
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
            },
        );
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
        expect(resolved).toBe(true);
    });

    it('プロフィール取得に relay hint を渡し、displayName 更新まで待つ', async () => {
        const params = createParams();
        let resolved = false;
        mockState.fetchProfileRealtime.mockImplementationOnce(() => new Promise((resolve) => {
            mockState.resolveProfile = resolve;
        }));

        const bootstrapPromise = runExternalInputBootstrap(params as never).then(() => {
            resolved = true;
        });

        await Promise.resolve();
        await Promise.resolve();

        const event = {
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'hello',
            sig: 'sig',
        };
        mockState.resolveReferencedEvent?.(event);

        await Promise.resolve();
        await Promise.resolve();

        expect(mockState.fetchProfileRealtime).toHaveBeenCalledWith('author-pubkey', {
            additionalRelays: ['wss://hint-relay.example.com/'],
        });
        expect(params.updateAuthorDisplayName).not.toHaveBeenCalled();
        expect(resolved).toBe(false);

        mockState.resolveProfile?.({
            name: 'Author Name',
            displayName: '',
            picture: '',
            npub: 'npub1author',
            nprofile: 'nprofile1author',
        });

        await bootstrapPromise;

        expect(params.updateAuthorDisplayName).toHaveBeenCalledWith('event-1', 'Author Name');
        expect(resolved).toBe(true);
    });

    it('無効な relay hint は参照イベント取得とプロフィール取得へ渡さない', async () => {
        mockState.getReplyQuoteFromUrlQuery.mockReturnValue({
            reply: {
                eventId: 'event-1',
                relayHints: [
                    'https://invalid.example.com',
                    'wss://hint-relay.example.com',
                    'wss://hint-relay.example.com/',
                ],
            },
            quotes: [],
        });

        const params = createParams();
        const bootstrapPromise = runExternalInputBootstrap(params as never);

        await Promise.resolve();
        await Promise.resolve();

        expect(mockState.fetchReferencedEvent).toHaveBeenCalledWith(
            'event-1',
            ['wss://hint-relay.example.com/'],
            params.rxNostr,
            null,
        );

        mockState.resolveReferencedEvent?.({
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'hello',
            sig: 'sig',
        });

        await bootstrapPromise;
    });

    it('channel クエリがある場合は channel context を適用してから cleanup する', async () => {
        mockState.hasChannelQueryParam.mockReturnValue(true);
        mockState.hasReplyQuoteQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        } as any);

        const params = createParams();

        await runExternalInputBootstrap(params as never);

        expect(mockState.resolveChannelContext).not.toHaveBeenCalled();

        expect(params.setChannelContext).toHaveBeenCalledWith({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
    });

    it('channel metadata がない場合は relay から解決して cleanup する', async () => {
        mockState.hasChannelQueryParam.mockReturnValue(true);
        mockState.hasReplyQuoteQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
        } as any);

        let resolveChannelContextPromise: ((value: any) => void) | null = null;
        mockState.resolveChannelContext.mockImplementationOnce(() => new Promise<any>((resolve) => {
            resolveChannelContextPromise = resolve;
        }));

        const params = createParams();
        let resolved = false;

        const bootstrapPromise = runExternalInputBootstrap(params as never).then(() => {
            resolved = true;
        });

        await Promise.resolve();
        await Promise.resolve();

        expect(params.setChannelContext).toHaveBeenNthCalledWith(1, {
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
            isMetadataLoading: true,
        });
        expect(resolved).toBe(false);

        expect(mockState.resolveChannelContext).toHaveBeenCalledWith(
            {
                eventId: 'channel-root-event',
                relayHints: ['wss://channel-relay.example.com/'],
                name: null,
                about: null,
                picture: null,
            },
            params.rxNostr,
            null,
        );

        if (!resolveChannelContextPromise) {
            throw new Error('resolveChannelContextPromise was not initialized');
        }

        const resolveChannelContext = resolveChannelContextPromise as (value: any) => void;

        resolveChannelContext({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-write.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });

        await bootstrapPromise;

        expect(params.setChannelContext).toHaveBeenNthCalledWith(2, {
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-write.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
    });
});