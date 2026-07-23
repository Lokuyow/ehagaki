import { describe, expect, it, vi } from "vitest";
import { createComposerTargetApplyController } from "../../lib/composerTargetApplyController";

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
