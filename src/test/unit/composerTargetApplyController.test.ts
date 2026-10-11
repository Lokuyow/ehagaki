import { describe, expect, it, vi } from "vitest";
import { createComposerTargetApplyController } from "../../lib/composerTargetApplyController";
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { reactionComposerState, setReactionTarget, clearReactionTarget } from '../../stores/reactionComposerStore.svelte';
import { createDeferred } from '../deferredTestUtils';

function target(overrides: Record<string, unknown> = {}) {
    return {
        source: "manual" as const,
        kind: 1,
        eventId: "1".repeat(64),
        relayHints: ["wss://relay.example/"],
        authorPubkey: "2".repeat(64),
        event: {
            id: "1".repeat(64),
            pubkey: "2".repeat(64),
            kind: 1,
            created_at: 1,
            tags: [],
            content: "hello",
            sig: "3".repeat(128),
        },
        channelQuery: null,
        ...overrides,
    };
}

function dependencies(overrides: Record<string, unknown> = {}) {
    return {
        startChannelContextQuery: vi.fn(() => ({ release: vi.fn() })),
        applyReplyQuoteQuery: vi.fn().mockResolvedValue(undefined),
        hydrateReplyQuoteReferences: vi.fn().mockResolvedValue(undefined),
        getReplyQuoteApplyParams: () => ({
            rxNostr: undefined,
            relayConfig: null,
            setReplyQuote: vi.fn(),
            updateReferencedEvent: vi.fn(),
            setReplyQuoteError: vi.fn(),
        }),
        clearChannelContext: vi.fn(),
        hasReplyOrQuotes: vi.fn(() => false),
        clearReplyQuote: vi.fn(),
        clearReplyReference: vi.fn(),
        addQuoteReference: vi.fn((reference) => ({
            ...reference,
            mode: "quote",
            ownerToken: Symbol("quote"),
        })),
        focusEditor: vi.fn(),
        logger: { error: vi.fn() },
        ...overrides,
    };
}

describe("createComposerTargetApplyController", () => {
    it.each(['fetch', 'signature', 'identity', 'ownership', 'cancel'])('Reaction %s failure preserves document, media, Reply/Quote/channel and existing Reaction', async failure => {
        const event = finalizeEvent({ kind: 6, content: '{"content":"opaque"}', tags: [], created_at: 100 }, generateSecretKey());
        setReactionTarget(event, []); const previousReaction = reactionComposerState.value;
        const context = { document: 'AB', media: ['existing.png'], reply: { id: 'reply' }, quotes: ['quote'], channel: { id: 'channel' } };
        const before = structuredClone(context); const deferred = createDeferred<{ event: typeof event; relayHints: string[] } | null>();
        let active = true;
        const deps = dependencies({ prepareReactionTarget: () => deferred.promise, captureReactionOwnership: () => () => active,
            clearReplyQuote: vi.fn(() => { context.reply = null as never; context.quotes = []; }),
            clearChannelContext: vi.fn(() => { context.channel = null as never; }) });
        const controller = createComposerTargetApplyController(deps as never);
        const pending = controller.applyReaction(target({ event: undefined, eventId: event.id, authorPubkey: event.pubkey, kind: 6 }) as never);
        expect(context).toEqual(before); expect(reactionComposerState.value).toBe(previousReaction);
        if (failure === 'ownership') active = false;
        if (failure === 'cancel') controller.dispose();
        deferred.resolve(failure === 'fetch' ? null : { event: failure === 'signature' ? { ...event, sig: '0'.repeat(128) }
            : failure === 'identity' ? finalizeEvent({ kind: 6, content: '', tags: [], created_at: 1 }, generateSecretKey()) : event, relayHints: [] });
        expect(await pending).toBe(false); expect(context).toEqual(before);
        expect(reactionComposerState.value).toBe(previousReaction); expect(deps.focusEditor).not.toHaveBeenCalled();
        clearReactionTarget();
    });
    it('commits verified Reaction and reference release synchronously, before focus', async () => {
        clearReactionTarget();
        const event = finalizeEvent({ kind: 7, content: '+', tags: [], created_at: 100 }, generateSecretKey());
        let cleared = 0;
        const deps = dependencies({ clearReplyQuote: () => cleared++, clearChannelContext: () => cleared++,
            focusEditor: vi.fn(() => { expect(cleared).toBe(2); expect(reactionComposerState.value?.eventId).toBe(event.id); }) });
        expect(await createComposerTargetApplyController(deps as never).applyReaction(target({ event, eventId: event.id, authorPubkey: event.pubkey, kind: 7 }) as never)).toBe(true);
        expect(deps.focusEditor).toHaveBeenCalledOnce(); clearReactionTarget();
    });
    it("kind 1返信でchannelを解除し、取得済みイベントをhydrateへ渡す", () => {
        const deps = dependencies();
        const controller = createComposerTargetApplyController(deps as never);
        expect(controller.applyReply(target() as never)).toBe(true);
        expect(deps.clearChannelContext).toHaveBeenCalledOnce();
        expect(deps.applyReplyQuoteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                replyQuoteQuery: {
                    reply: {
                        eventId: "1".repeat(64),
                        relayHints: ["wss://relay.example/"],
                        authorPubkey: "2".repeat(64),
                    },
                    quotes: [],
                },
                preloadedEvents: {
                    ["1".repeat(64)]: expect.objectContaining({ kind: 1 }),
                },
            }),
        );
    });

    it("kind 1引用で既存状態を置換して既存hydrateを使う", () => {
        const deps = dependencies({
            hasReplyOrQuotes: vi.fn(() => true),
        });
        const controller = createComposerTargetApplyController(deps as never);
        expect(controller.applyQuote(target() as never)).toBe(true);
        expect(deps.clearReplyQuote).toHaveBeenCalledOnce();
        expect(deps.hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
    });

    it("kind 40投稿でmanual channelを適用し、返信だけ解除する", () => {
        const deps = dependencies();
        const controller = createComposerTargetApplyController(deps as never);
        const channelQuery = {
            eventId: "4".repeat(64),
            relayHints: ["wss://verified.example/"],
        };
        expect(controller.applyChannel(target({
            kind: 40,
            channelQuery,
        }) as never)).toBe(true);
        expect(deps.startChannelContextQuery).toHaveBeenCalledWith(
            channelQuery,
            "manual",
        );
        expect(deps.clearReplyReference).toHaveBeenCalledOnce();
        expect(deps.clearReplyQuote).not.toHaveBeenCalled();
    });

    it("kind 42引用でchannelを設定し、返信を含む既存状態を引用1件へ置換する", () => {
        const deps = dependencies({
            hasReplyOrQuotes: vi.fn(() => true),
        });
        const controller = createComposerTargetApplyController(deps as never);
        expect(controller.applyQuote(target({
            kind: 42,
            channelQuery: {
                eventId: "4".repeat(64),
                relayHints: ["wss://verified.example/"],
            },
        }) as never)).toBe(true);
        expect(deps.startChannelContextQuery).toHaveBeenCalledOnce();
        expect(deps.clearReplyQuote).toHaveBeenCalledOnce();
        expect(deps.addQuoteReference).toHaveBeenCalledOnce();
    });

    it("manual kind 42でchannel適用に失敗した場合はcomposerを変更しない", () => {
        const deps = dependencies({
            startChannelContextQuery: vi.fn(() => {
                throw new Error("failed");
            }),
        });
        const controller = createComposerTargetApplyController(deps as never);
        expect(controller.applyReply(target({
            kind: 42,
            channelQuery: {
                eventId: "4".repeat(64),
                relayHints: [],
            },
        }) as never)).toBe(false);
        expect(deps.applyReplyQuoteQuery).not.toHaveBeenCalled();
        expect(deps.focusEditor).not.toHaveBeenCalled();
    });
});
