import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
    const state = {
        resolveReferencedEvent: null as ((value: any) => void) | null,
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
    ReplyQuoteService: vi.fn(function () {
        return {
            fetchReferencedEvent: mockState.fetchReferencedEvent,
            extractThreadInfo: mockState.extractThreadInfo,
        };
    }),
}));

vi.mock('../../lib/shareHandler', () => ({
    checkIfOpenedFromShare: mockState.checkIfOpenedFromShare,
}));

vi.mock('../../lib/utils/swCommunication', () => ({
    checkServiceWorkerStatus: mockState.checkServiceWorkerStatus,
    testServiceWorkerCommunication: mockState.testServiceWorkerCommunication,
    getSharedMediaWithFallback: mockState.getSharedMediaWithFallback,
}));

import {
    applyReplyQuoteQuery,
    runExternalInputBootstrap,
} from '../../lib/bootstrap/externalInputBootstrap';

function createParams() {
    const setReplyQuote = vi.fn((value: any) => [
        ...(value.reply
            ? [{
                ...value.reply,
                mode: 'reply' as const,
                ownerToken: Symbol(`reply:${value.reply.eventId}`),
            }]
            : []),
        ...value.quotes.map((quote: any) => ({
            ...quote,
            mode: 'quote' as const,
            ownerToken: Symbol(`quote:${quote.eventId}`),
        })),
    ]);
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
        applyChannelContextQuery: vi.fn(),
        setReplyQuote,
        updateReferencedEvent: vi.fn(),
        initializeReplyNotificationRecipients: vi.fn(),
        setReplyQuoteError: vi.fn(),
        rxNostr: { tag: 'rxnostr' },
        relayConfig: null,
        locationHref: 'http://localhost/?reply=test',
    };
}

describe('runExternalInputBootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.resolveReferencedEvent = null;
        mockState.hasChannelQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue(null);
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
    });

    it('reply/quote選択後は参照イベントhydrateを待たずにbootstrapを完了する', async () => {
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
        await bootstrapPromise;
        expect(resolved).toBe(true);
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
        expect(params.updateReferencedEvent).not.toHaveBeenCalled();

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

        await vi.waitFor(() => {
            expect(params.updateReferencedEvent).toHaveBeenCalledWith(
                expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
                event,
                {
                    rootEventId: null,
                    rootRelayHint: null,
                    rootPubkey: null,
                },
            );
        });
    });

    it('非同期hydrate後に参照イベントと通知受信者を初期化する', async () => {
        const params = createParams();
        const bootstrapPromise = runExternalInputBootstrap(params as never);

        await Promise.resolve();
        await Promise.resolve();

        const event = {
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [['p', 'recipient-pubkey']],
            content: 'hello',
            sig: 'sig',
        };
        mockState.resolveReferencedEvent?.(event);

        await bootstrapPromise;
        await vi.waitFor(() => {
            expect(params.updateReferencedEvent).toHaveBeenCalledWith(
                expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
                event,
                expect.any(Object),
            );
            expect(params.initializeReplyNotificationRecipients).toHaveBeenCalledWith(
                expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
                event,
            );
        });
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

    it('preloaded event がある場合は rxNostr なしでも reply preview を解決する', async () => {
        const params = createParams();
        const event = {
            id: 'event-1',
            pubkey: 'author-pubkey',
            created_at: 1,
            kind: 1,
            tags: [],
            content: 'hello',
            sig: 'sig',
        };

        await applyReplyQuoteQuery({
            replyQuoteQuery: {
                reply: {
                    eventId: 'event-1',
                    relayHints: ['wss://hint-relay.example.com/'],
                    authorPubkey: 'author-pubkey',
                },
                quotes: [],
            },
            rxNostr: undefined,
            relayConfig: null,
            setReplyQuote: params.setReplyQuote,
            updateReferencedEvent: params.updateReferencedEvent,
            setReplyQuoteError: params.setReplyQuoteError,
            preloadedEvents: {
                'event-1': event,
            },
        });

        expect(params.setReplyQuote).toHaveBeenCalledWith({
            reply: {
                eventId: 'event-1',
                relayHints: ['wss://hint-relay.example.com/'],
                authorPubkey: 'author-pubkey',
            },
            quotes: [],
        });
        expect(params.updateReferencedEvent).toHaveBeenCalledWith(
            expect.objectContaining({ eventId: 'event-1', mode: 'reply' }),
            event,
            {
                rootEventId: null,
                rootRelayHint: null,
                rootPubkey: null,
            },
        );
        expect(mockState.fetchReferencedEvent).not.toHaveBeenCalled();
        expect(params.setReplyQuoteError).not.toHaveBeenCalled();
    });

    it('channel metadata がある場合は parent preview をそのまま使い自身の relays を使う', async () => {
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

        expect(params.applyChannelContextQuery).toHaveBeenCalledWith({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        });
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
    });

    it('channel relays が parent から渡された場合はそのまま適用する', async () => {
        mockState.hasChannelQueryParam.mockReturnValue(true);
        mockState.hasReplyQuoteQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            channelRelays: [
                'wss://channel-write.example.com/',
                'wss://channel-backup.example.com/',
            ],
            name: 'General',
            about: null,
            picture: null,
        } as any);

        const params = createParams();

        await runExternalInputBootstrap(params as never);

        expect(params.applyChannelContextQuery).toHaveBeenCalledWith({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            channelRelays: [
                'wss://channel-write.example.com/',
                'wss://channel-backup.example.com/',
            ],
            name: 'General',
            about: null,
            picture: null,
        });
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
    });

    it('channel metadata がない場合も共通Coordinator入口へ同期委譲して cleanup する', async () => {
        mockState.hasChannelQueryParam.mockReturnValue(true);
        mockState.hasReplyQuoteQueryParam.mockReturnValue(false);
        mockState.getChannelFromUrlQuery.mockReturnValue({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
        } as any);

        const params = createParams();
        await runExternalInputBootstrap(params as never);

        expect(params.applyChannelContextQuery).toHaveBeenCalledWith({
            eventId: 'channel-root-event',
            relayHints: ['wss://channel-relay.example.com/'],
            name: null,
            about: null,
            picture: null,
        });
        expect(mockState.cleanupAllQueryParams).toHaveBeenCalledOnce();
    });
});
