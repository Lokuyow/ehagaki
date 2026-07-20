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

function createDependencies(overrides: Record<string, unknown> = {}) {
    return {
        startChannelContextQuery: vi.fn().mockReturnValue({ release: vi.fn() }),
        applyReplyQuoteQuery: vi.fn().mockResolvedValue(undefined),
        hydrateReplyQuoteReferences: vi.fn().mockResolvedValue(undefined),
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
        addQuoteReference: vi.fn((reference) => ({
            ...reference,
            mode: 'quote',
            ownerToken: Symbol('quote-owner'),
        })),
        focusEditor: vi.fn(),
        logger: { error: vi.fn() },
        ...overrides,
    };
}

describe('createPostHistoryDialogApplyController', () => {
    const channelEventId = 'c'.repeat(64);

    it('reply 適用でchannelを開始し、hydrate完了を待たずにfocusする', async () => {
        let resolveHydration: (() => void) | undefined;
        const applyReplyQuoteQuery = vi.fn(() => new Promise<void>((resolve) => {
            resolveHydration = resolve;
        }));
        const deps = createDependencies({ applyReplyQuoteQuery });
        const controller = createPostHistoryDialogApplyController(deps as never);

        await expect(controller.applyReply(createRecord({
            kind: 42,
            tags: [['e', channelEventId, '', 'root']],
            channelEventId: 'stale-channel-event',
        }) as never)).resolves.toBe(true);

        expect(deps.startChannelContextQuery).toHaveBeenCalledTimes(1);
        expect(applyReplyQuoteQuery).toHaveBeenCalledTimes(1);
        expect(deps.focusEditor).toHaveBeenCalledTimes(1);
        resolveHydration?.();
    });

    it('channel queryが無いreplyでは以前のconsumerを解放してcontextをクリアする', async () => {
        const release = vi.fn();
        const deps = createDependencies({
            startChannelContextQuery: vi.fn().mockReturnValue({ release }),
        });
        const controller = createPostHistoryDialogApplyController(deps as never);

        await controller.applyReply(createRecord({
            kind: 42,
            tags: [['e', channelEventId, '', 'root']],
        }) as never);
        await controller.applyReply(createRecord() as never);

        expect(release).toHaveBeenCalledTimes(1);
        expect(deps.clearChannelContext).toHaveBeenCalledTimes(1);
    });

    it('reply hydrate失敗は適用済みchannelを維持する非致命的失敗にする', async () => {
        const error = new Error('reply failed');
        const deps = createDependencies({
            applyReplyQuoteQuery: vi.fn().mockRejectedValue(error),
        });
        const controller = createPostHistoryDialogApplyController(deps as never);

        await expect(controller.applyReply(createRecord({
            kind: 42,
            tags: [['e', channelEventId, '', 'root']],
        }) as never)).resolves.toBe(true);
        await Promise.resolve();

        expect(deps.clearChannelContext).not.toHaveBeenCalled();
        expect(deps.focusEditor).toHaveBeenCalledTimes(1);
        expect(deps.logger.error).toHaveBeenCalledWith(
            '投稿履歴からのリプライhydrateに失敗:',
            error,
        );
    });

    it('quote 適用で追加不可なら hydrate せずフォーカスする', () => {
        const deps = createDependencies({
            hasReplyOrQuotes: vi.fn().mockReturnValue(true),
            addQuoteReference: vi.fn().mockReturnValue(null),
        });
        const controller = createPostHistoryDialogApplyController(deps as never);

        controller.applyQuote(createRecord() as never);

        expect(deps.clearReplyQuote).toHaveBeenCalledTimes(1);
        expect(deps.hydrateReplyQuoteReferences).not.toHaveBeenCalled();
        expect(deps.focusEditor).toHaveBeenCalledTimes(1);
    });

    it('quote 適用で追加成功時は hydrate する', () => {
        const deps = createDependencies();
        const controller = createPostHistoryDialogApplyController(deps as never);

        controller.applyQuote(createRecord() as never);

        expect(deps.hydrateReplyQuoteReferences).toHaveBeenCalledTimes(1);
    });
});
