import { describe, expect, it, vi } from 'vitest';

import { createPostHistoryDialogApplyController } from '../../lib/postHistoryDialogApplyController';

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

describe('createPostHistoryDialogApplyController', () => {
    it('reply 適用で channel と reply query を実行する', async () => {
        const applyChannelContextQuery = vi.fn().mockResolvedValue(undefined);
        const applyReplyQuoteQuery = vi.fn().mockResolvedValue(undefined);
        const controller = createPostHistoryDialogApplyController({
            applyChannelContextQuery,
            applyReplyQuoteQuery,
            hydrateReplyQuoteReferences: vi.fn(),
            getChannelContextApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setChannelContext: vi.fn(),
            }),
            getReplyQuoteApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setReplyQuote: vi.fn(),
                updateReferencedEvent: vi.fn(),
                setReplyQuoteError: vi.fn(),
            }),
            clearChannelContext: vi.fn(),
            hasReplyOrQuotes: vi.fn().mockReturnValue(false),
            clearReplyQuote: vi.fn(),
            addQuoteReference: vi.fn().mockReturnValue(true),
            focusEditor: vi.fn(),
            logger: { error: vi.fn() },
        });

        const channelEventId = 'c'.repeat(64);
        await controller.applyReply(createRecord({
            kind: 42,
            tags: [['e', channelEventId, '', 'root']],
            channelEventId: 'stale-channel-event',
        }) as never);

        expect(applyChannelContextQuery).toHaveBeenCalledTimes(1);
        expect(applyReplyQuoteQuery).toHaveBeenCalledTimes(1);
    });

    it('reply 適用で channel query が無ければ context をクリアする', async () => {
        const clearChannelContext = vi.fn();
        const controller = createPostHistoryDialogApplyController({
            applyChannelContextQuery: vi.fn().mockResolvedValue(undefined),
            applyReplyQuoteQuery: vi.fn().mockResolvedValue(undefined),
            hydrateReplyQuoteReferences: vi.fn().mockResolvedValue(undefined),
            getChannelContextApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setChannelContext: vi.fn(),
            }),
            getReplyQuoteApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setReplyQuote: vi.fn(),
                updateReferencedEvent: vi.fn(),
                setReplyQuoteError: vi.fn(),
            }),
            clearChannelContext,
            hasReplyOrQuotes: vi.fn().mockReturnValue(false),
            clearReplyQuote: vi.fn(),
            addQuoteReference: vi.fn().mockReturnValue(true),
            focusEditor: vi.fn(),
            logger: { error: vi.fn() },
        });

        await controller.applyReply(createRecord() as never);

        expect(clearChannelContext).toHaveBeenCalledTimes(1);
    });

    it('quote 適用で追加不可なら hydrate せずフォーカスする', () => {
        const focusEditor = vi.fn();
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const clearReplyQuote = vi.fn();
        const controller = createPostHistoryDialogApplyController({
            applyChannelContextQuery: vi.fn().mockResolvedValue(undefined),
            applyReplyQuoteQuery: vi.fn().mockResolvedValue(undefined),
            hydrateReplyQuoteReferences,
            getChannelContextApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setChannelContext: vi.fn(),
            }),
            getReplyQuoteApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setReplyQuote: vi.fn(),
                updateReferencedEvent: vi.fn(),
                setReplyQuoteError: vi.fn(),
            }),
            clearChannelContext: vi.fn(),
            hasReplyOrQuotes: vi.fn().mockReturnValue(true),
            clearReplyQuote,
            addQuoteReference: vi.fn().mockReturnValue(false),
            focusEditor,
            logger: { error: vi.fn() },
        });

        controller.applyQuote(createRecord() as never);

        expect(clearReplyQuote).toHaveBeenCalledTimes(1);
        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();
        expect(focusEditor).toHaveBeenCalledTimes(1);
    });

    it('quote 適用で追加成功時は hydrate する', () => {
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const controller = createPostHistoryDialogApplyController({
            applyChannelContextQuery: vi.fn().mockResolvedValue(undefined),
            applyReplyQuoteQuery: vi.fn().mockResolvedValue(undefined),
            hydrateReplyQuoteReferences,
            getChannelContextApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setChannelContext: vi.fn(),
            }),
            getReplyQuoteApplyParams: () => ({
                rxNostr: undefined,
                relayConfig: {},
                setReplyQuote: vi.fn(),
                updateReferencedEvent: vi.fn(),
                setReplyQuoteError: vi.fn(),
            }),
            clearChannelContext: vi.fn(),
            hasReplyOrQuotes: vi.fn().mockReturnValue(false),
            clearReplyQuote: vi.fn(),
            addQuoteReference: vi.fn().mockReturnValue(true),
            focusEditor: vi.fn(),
            logger: { error: vi.fn() },
        });

        controller.applyQuote(createRecord() as never);

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledTimes(1);
    });
});
