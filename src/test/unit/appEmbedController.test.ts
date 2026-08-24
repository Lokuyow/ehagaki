import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finalizeEvent, generateSecretKey, nip19 } from 'nostr-tools';

import {
    createAppEmbedController,
    type AppEmbedRuntimeSnapshot,
} from '../../lib/appEmbedController';
import type {
    ReplyQuoteComposerState,
    ReplyQuoteHydrationTarget,
    ReplyQuoteState,
} from '../../lib/types';
import { createPlainNostrEventSnapshot } from '../../lib/postHistoryEventUtils';

function createRuntimeSnapshot(): AppEmbedRuntimeSnapshot {
    return {
        rxNostr: undefined,
        relayConfig: null,
    };
}

function createReplyQuoteState() {
    return {
        reply: null,
        quotes: [],
    };
}

function createChannelContextState() {
    return null;
}

function createSelectedReplyQuoteState(
    references: ReplyQuoteHydrationTarget[],
): ReplyQuoteComposerState {
    const toState = (reference: ReplyQuoteHydrationTarget): ReplyQuoteState => ({
        ...reference,
        quoteNotificationEnabled: false,
        replyNotificationRecipients: [],
        authorDisplayName: null,
        authorPicture: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: true,
        error: null,
    });

    return {
        reply: references.find((reference) => reference.mode === 'reply')
            ? toState(references.find((reference) => reference.mode === 'reply')!)
            : null,
        quotes: references
            .filter((reference) => reference.mode === 'quote')
            .map(toState),
    };
}

function createController(overrides: Record<string, unknown> = {}) {
    const composerInput = {
        resetContent: vi.fn(),
        insertText: vi.fn(),
    };
    const sharedContent = {
        clearUrlQueryContentStore: vi.fn(),
        updateUrlQueryContentStore: vi.fn(),
    };
    const parentFrame = {
        notifyComposerContextApplied: vi.fn(),
        notifyComposerContextError: vi.fn(),
        notifyComposerContextUpdated: vi.fn(),
        notifySettingsApplied: vi.fn(),
        notifySettingsError: vi.fn(),
    };
    const composerContextApply = {
        applyReplyQuoteSelection: vi.fn(() => []),
        hydrateReplyQuoteReferences: vi.fn().mockResolvedValue(undefined),
        clearReplyQuote: vi.fn(),
        applyChannelContextQuery: vi.fn(),
        clearChannelContext: vi.fn(),
    };
    const settingsApply = {
        applySettings: vi.fn().mockResolvedValue([]),
    };
    const storage = {
        getEmbedStorageSnapshot: vi.fn().mockResolvedValue({}),
        applyEmbedStorageSnapshot: vi.fn(() => ({ appliedKeys: [] })),
        applyStoredSettingsSnapshot: vi.fn(),
        persistEmbedStorageKeys: vi.fn(),
    };
    const logger = {
        warn: vi.fn(),
        error: vi.fn(),
    };
    let bootstrappingApp = false;
    let parentClientTransitioning = false;
    let replyQuoteState: ReplyQuoteComposerState = createReplyQuoteState();
    let runtimeSnapshot = createRuntimeSnapshot();

    const runtime = {
        isBootstrappingApp: vi.fn(() => bootstrappingApp),
        isParentClientTransitioning: vi.fn(() => parentClientTransitioning),
        getReplyQuoteState: vi.fn(() => replyQuoteState),
        getChannelContextState: vi.fn(createChannelContextState),
        getChannelContextProvenance: vi.fn(() => null),
        getRuntimeSnapshot: vi.fn(() => runtimeSnapshot),
    };

    const controller = createAppEmbedController({
        composerInput: {
            get: vi.fn(() => composerInput),
        },
        sharedContent,
        composerContextApply,
        settingsApply,
        parentFrame,
        runtime,
        storage,
        logger,
        ...overrides,
    });

    return {
        controller,
        composerInput,
        sharedContent,
        composerContextApply,
        settingsApply,
        parentFrame,
        runtime,
        storage,
        logger,
        setBootstrappingApp(value: boolean) {
            bootstrappingApp = value;
        },
        setParentClientTransitioning(value: boolean) {
            parentClientTransitioning = value;
        },
        setReplyQuoteState(value: ReplyQuoteComposerState) {
            replyQuoteState = value;
        },
        setRuntimeSnapshot(value: ReturnType<typeof createRuntimeSnapshot>) {
            runtimeSnapshot = value;
        },
    };
}

describe('createAppEmbedController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('exposes the same in-process context and settings paths without iframe acknowledgements', async () => {
        const { controller, composerInput, settingsApply, parentFrame } = createController();

        await controller.applyComposerContext({ content: 'web component content' });
        await controller.applySettings({ locale: 'en' });

        expect(composerInput.insertText).toHaveBeenCalledWith('web component content');
        expect(settingsApply.applySettings).toHaveBeenCalledWith({ locale: 'en' });
        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();
        expect(parentFrame.notifySettingsApplied).not.toHaveBeenCalled();
    });

    it('keeps the Full self-publish context path free of the Host-owned submission guard', async () => {
        const { controller, composerInput, runtime } = createController();

        expect((runtime as Record<string, unknown>).isSubmissionInProgress).toBeUndefined();
        await controller.applyComposerContext({ content: 'self-publish context' });

        expect(composerInput.insertText).toHaveBeenCalledWith('self-publish context');
    });

    it('direct setContext を送信中に拒否して既存contextを変更しない', async () => {
        const composerInput = {
            resetContent: vi.fn(),
            insertText: vi.fn(),
        };
        const { controller, sharedContent, composerContextApply } = createController({
            composerInput: { get: vi.fn(() => composerInput) },
            runtime: {
                isBootstrappingApp: vi.fn(() => false),
                isParentClientTransitioning: vi.fn(() => false),
                getReplyQuoteState: vi.fn(createReplyQuoteState),
                getChannelContextState: vi.fn(createChannelContextState),
                getChannelContextProvenance: vi.fn(() => null),
                getRuntimeSnapshot: vi.fn(createRuntimeSnapshot),
                isSubmissionInProgress: vi.fn(() => true),
            },
        });

        await expect(controller.applyComposerContext({ content: 'blocked' }))
            .rejects.toThrow('submission_in_progress');
        expect(composerInput.insertText).not.toHaveBeenCalled();
        expect(sharedContent.updateUrlQueryContentStore).not.toHaveBeenCalled();
        expect(composerContextApply.applyReplyQuoteSelection).not.toHaveBeenCalled();
    });

    it('bootstrapping 中の composer.setContext を保留し、flush で適用する', async () => {
        const { controller, composerInput, parentFrame, setBootstrappingApp } = createController();
        setBootstrappingApp(true);

        await controller.handleRemoteComposerSetContext({ content: 'queued message' }, 'req-1');

        expect(composerInput.insertText).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();

        setBootstrappingApp(false);
        await controller.flushPendingComposerAction();

        expect(composerInput.insertText).toHaveBeenCalledWith('queued message');
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-1');
    });

    it('content-only の composer.setContext では本文だけを反映する', async () => {
        const { controller, composerInput, sharedContent, parentFrame } = createController();

        await controller.handleRemoteComposerSetContext({ content: 'hello world' }, 'req-2');

        expect(composerInput.insertText).toHaveBeenCalledWith('hello world');
        expect(composerInput.resetContent).not.toHaveBeenCalled();
        expect(sharedContent.clearUrlQueryContentStore).toHaveBeenCalledOnce();
        expect(sharedContent.updateUrlQueryContentStore).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-2');
    });

    it('初期適用の状態変更をcontextUpdatedとして重複通知しない', async () => {
        const { controller, parentFrame } = createController();

        await controller.handleRemoteComposerSetContext({ content: 'initial' }, 'req-baseline');
        controller.notifyComposerContextUpdatedIfChanged();

        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-baseline');
        expect(parentFrame.notifyComposerContextUpdated).not.toHaveBeenCalled();
    });

    it('runtime未準備では選択とackだけを適用し、stable runtime後に1回だけhydrateする', async () => {
        let resolveHydration!: () => void;
        const hydration = new Promise<void>((resolve) => {
            resolveHydration = resolve;
        });
        const reply = {
            eventId: '1'.repeat(64),
            mode: 'reply' as const,
            ownerToken: Symbol('reply-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const applyReplyQuoteSelection = vi.fn(() => [reply]);
        const hydrateReplyQuoteReferences = vi.fn(() => hydration);
        const {
            controller,
            parentFrame,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([reply]));

        await controller.handleRemoteComposerSetContext({
            reply: nip19.noteEncode(reply.eventId),
        }, 'req-reply-fast-ack');

        expect(applyReplyQuoteSelection).toHaveBeenCalledOnce();
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-reply-fast-ack');
        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();

        const stableRxNostr = {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>;
        setRuntimeSnapshot({ rxNostr: stableRxNostr, relayConfig: null });
        await controller.flushPendingReplyQuoteHydration();
        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();

        setParentClientTransitioning(false);
        const hydrationFlush = controller.flushPendingReplyQuoteHydration();

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledWith(
            [reply],
            { rxNostr: stableRxNostr, relayConfig: null },
        );
        expect(parentFrame.notifyComposerContextApplied.mock.invocationCallOrder[0])
            .toBeLessThan(hydrateReplyQuoteReferences.mock.invocationCallOrder[0]);
        await controller.flushPendingReplyQuoteHydration();
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
        resolveHydration();
        await hydrationFlush;
    });

    it('reply/quotesを変更しないpatchはtransition中も即時適用し、pending hydrationを維持する', async () => {
        const quote = {
            eventId: '5'.repeat(64),
            mode: 'quote' as const,
            ownerToken: Symbol('quote-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const applyReplyQuoteSelection = vi.fn(() => [quote]);
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const applyChannelContextQuery = vi.fn();
        const {
            controller,
            composerInput,
            parentFrame,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery,
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([quote]));

        await controller.handleRemoteComposerSetContext({
            quotes: [nip19.noteEncode(quote.eventId)],
        }, 'req-quote-pending');
        await controller.handleRemoteComposerSetContext({
            content: 'content patch',
        }, 'req-content-patch');
        await controller.handleRemoteComposerSetContext({
            channel: { reference: nip19.noteEncode('6'.repeat(64)) },
        }, 'req-channel-patch');
        await controller.handleRemoteComposerSetContext({
            content: 'combined patch',
            channel: null,
        }, 'req-combined-patch');
        await controller.handleRemoteComposerSetContext({
            preloadedEvents: {},
        }, 'req-preload-only-patch');

        expect(composerInput.insertText).toHaveBeenCalledWith('content patch');
        expect(composerInput.insertText).toHaveBeenCalledWith('combined patch');
        expect(applyChannelContextQuery).toHaveBeenCalledOnce();
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledTimes(5);
        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();

        const stableRxNostr = {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>;
        setRuntimeSnapshot({ rxNostr: stableRxNostr, relayConfig: null });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledWith(
            [quote],
            { rxNostr: stableRxNostr, relayConfig: null },
        );
    });

    it('valid preloaded event は detached plain snapshot として hydration port へ渡す', async () => {
        const event = finalizeEvent({
            kind: 1,
            content: 'preloaded',
            tags: [],
            created_at: 1,
        }, generateSecretKey());
        const reply = {
            eventId: event.id,
            mode: 'reply' as const,
            ownerToken: Symbol('reply-owner'),
            relayHints: [],
            authorPubkey: event.pubkey,
        };
        const applyReplyQuoteSelection = vi.fn(() => [reply]);
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const {
            controller,
            setParentClientTransitioning,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        const externalEvent = {
            ...event,
            libraryMetadata: { shouldNotBeForwarded: true },
        } as typeof event & { libraryMetadata: unknown };

        await controller.handleRemoteComposerSetContext({
            reply: nip19.neventEncode({ id: event.id, author: event.pubkey }),
            preloadedEvents: { [event.id]: externalEvent },
        }, 'req-preloaded');

        externalEvent.content = 'mutated after selection';
        const selected = hydrateReplyQuoteReferences.mock.calls[0]?.[2];
        expect(selected[event.id]).toEqual(createPlainNostrEventSnapshot(event));
        expect(selected[event.id]).not.toBe(externalEvent);
        expect(selected[event.id].content).toBe('preloaded');
        expect(selected[event.id].libraryMetadata).toBeUndefined();
        expect(hydrateReplyQuoteReferences.mock.calls[0]?.[1].rxNostr).toBeUndefined();

        setRuntimeSnapshot({
            rxNostr: {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>,
            relayConfig: null,
        });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
    });

    it('valid preloadとmissing referenceの混在時はvalidだけを即時、missingだけを後でhydrateする', async () => {
        const event = finalizeEvent({
            kind: 1,
            content: 'mixed preload',
            tags: [],
            created_at: 2,
        }, generateSecretKey());
        const preloadedQuote: ReplyQuoteHydrationTarget = {
            eventId: event.id,
            mode: 'quote',
            ownerToken: Symbol('preloaded-quote-owner'),
            relayHints: [],
            authorPubkey: event.pubkey,
        };
        const relayQuote: ReplyQuoteHydrationTarget = {
            eventId: '7'.repeat(64),
            mode: 'quote',
            ownerToken: Symbol('relay-quote-owner'),
            relayHints: ['wss://relay.example.com'],
            authorPubkey: null,
        };
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const {
            controller,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection: vi.fn(() => [preloadedQuote, relayQuote]),
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([preloadedQuote, relayQuote]));

        await controller.handleRemoteComposerSetContext({
            quotes: [
                nip19.neventEncode({ id: event.id, author: event.pubkey }),
                nip19.noteEncode(relayQuote.eventId),
            ],
            preloadedEvents: { [event.id]: event },
        }, 'req-mixed-preload');

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledTimes(1);
        expect(hydrateReplyQuoteReferences.mock.calls[0]?.[0]).toEqual([preloadedQuote]);
        expect(hydrateReplyQuoteReferences.mock.calls[0]?.[1].rxNostr).toBeUndefined();
        expect(hydrateReplyQuoteReferences.mock.calls[0]?.[2]).toHaveProperty(event.id);

        const stableRxNostr = {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>;
        setRuntimeSnapshot({ rxNostr: stableRxNostr, relayConfig: null });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledTimes(2);
        expect(hydrateReplyQuoteReferences.mock.calls[1]).toEqual([
            [relayQuote],
            { rxNostr: stableRxNostr, relayConfig: null },
        ]);
    });

    it('invalidまたはmismatch preloadはpendingに残してstable runtimeでrelay fallbackする', async () => {
        const signedEvent = finalizeEvent({
            kind: 1,
            content: 'signed',
            tags: [],
            created_at: 3,
        }, generateSecretKey());
        const invalidTarget: ReplyQuoteHydrationTarget = {
            eventId: signedEvent.id,
            mode: 'quote',
            ownerToken: Symbol('invalid-preload-owner'),
            relayHints: [],
            authorPubkey: signedEvent.pubkey,
        };
        const mismatchTarget: ReplyQuoteHydrationTarget = {
            eventId: '8'.repeat(64),
            mode: 'quote',
            ownerToken: Symbol('mismatch-preload-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const {
            controller,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection: vi.fn(() => [invalidTarget, mismatchTarget]),
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([invalidTarget, mismatchTarget]));

        await controller.handleRemoteComposerSetContext({
            quotes: [
                nip19.neventEncode({ id: signedEvent.id, author: signedEvent.pubkey }),
                nip19.noteEncode(mismatchTarget.eventId),
            ],
            preloadedEvents: {
                [signedEvent.id]: { ...signedEvent, content: 'tampered' },
                [mismatchTarget.eventId]: signedEvent,
            },
        }, 'req-invalid-preloads');

        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();
        const stableRxNostr = {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>;
        setRuntimeSnapshot({ rxNostr: stableRxNostr, relayConfig: null });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledWith(
            [invalidTarget, mismatchTarget],
            { rxNostr: stableRxNostr, relayConfig: null },
        );
    });

    it('新しいselectionはpendingを置換し、旧ownerはrelay fetchしない', async () => {
        const oldTarget: ReplyQuoteHydrationTarget = {
            eventId: '9'.repeat(64),
            mode: 'reply',
            ownerToken: Symbol('old-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const newTarget: ReplyQuoteHydrationTarget = {
            eventId: 'a'.repeat(64),
            mode: 'reply',
            ownerToken: Symbol('new-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const applyReplyQuoteSelection = vi.fn()
            .mockReturnValueOnce([oldTarget])
            .mockReturnValueOnce([newTarget]);
        const {
            controller,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([oldTarget]));
        await controller.handleRemoteComposerSetContext({
            reply: nip19.noteEncode(oldTarget.eventId),
        }, 'req-old-owner');

        setReplyQuoteState(createSelectedReplyQuoteState([newTarget]));
        await controller.handleRemoteComposerSetContext({
            reply: nip19.noteEncode(newTarget.eventId),
        }, 'req-new-owner');

        const stableRxNostr = {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>;
        setRuntimeSnapshot({ rxNostr: stableRxNostr, relayConfig: null });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();

        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledWith(
            [newTarget],
            { rxNostr: stableRxNostr, relayConfig: null },
        );
    });

    it('reply/quotes clearはpending hydrationも破棄する', async () => {
        const reply: ReplyQuoteHydrationTarget = {
            eventId: 'b'.repeat(64),
            mode: 'reply',
            ownerToken: Symbol('clear-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const clearReplyQuote = vi.fn();
        const {
            controller,
            setParentClientTransitioning,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection: vi.fn(() => [reply]),
                hydrateReplyQuoteReferences,
                clearReplyQuote,
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });
        setParentClientTransitioning(true);
        setReplyQuoteState(createSelectedReplyQuoteState([reply]));
        await controller.handleRemoteComposerSetContext({
            reply: nip19.noteEncode(reply.eventId),
        }, 'req-before-clear');

        await controller.handleRemoteComposerSetContext({
            reply: null,
            quotes: null,
        }, 'req-clear');
        setReplyQuoteState(createReplyQuoteState());
        setRuntimeSnapshot({
            rxNostr: {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>,
            relayConfig: null,
        });
        setParentClientTransitioning(false);
        await controller.flushPendingReplyQuoteHydration();

        expect(clearReplyQuote).toHaveBeenCalledOnce();
        expect(hydrateReplyQuoteReferences).not.toHaveBeenCalled();
    });

    it('channel・reply・quotes同時指定でも初期状態だけでackし、hydrate失敗は非致命的に扱う', async () => {
        const reply = {
            eventId: '2'.repeat(64),
            mode: 'reply' as const,
            ownerToken: Symbol('reply-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const quote = {
            eventId: '3'.repeat(64),
            mode: 'quote' as const,
            ownerToken: Symbol('quote-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const applyChannelContextQuery = vi.fn();
        const applyReplyQuoteSelection = vi.fn(() => [reply, quote]);
        const hydrateError = new Error('hydrate failed');
        const hydrateReplyQuoteReferences = vi.fn().mockRejectedValue(hydrateError);
        const {
            controller,
            parentFrame,
            logger,
            setReplyQuoteState,
            setRuntimeSnapshot,
        } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery,
                clearChannelContext: vi.fn(),
            },
        });
        setReplyQuoteState(createSelectedReplyQuoteState([reply, quote]));
        setRuntimeSnapshot({
            rxNostr: {} as NonNullable<AppEmbedRuntimeSnapshot['rxNostr']>,
            relayConfig: null,
        });

        await controller.handleRemoteComposerSetContext({
            channel: { reference: nip19.noteEncode('4'.repeat(64)) },
            reply: nip19.noteEncode(reply.eventId),
            quotes: [nip19.noteEncode(quote.eventId)],
            content: 'initial content',
        }, 'req-all-fast-ack');
        await Promise.resolve();

        expect(applyChannelContextQuery).toHaveBeenCalledOnce();
        expect(applyReplyQuoteSelection).toHaveBeenCalledOnce();
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-all-fast-ack');
        expect(parentFrame.notifyComposerContextError).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(
            'composer context の非同期補完をスキップ:',
            hydrateError,
        );
    });

    it('無効な composer.setContext はエラー通知に変換する', async () => {
        const { controller, parentFrame, composerInput } = createController();

        await controller.handleRemoteComposerSetContext(
            {
                content: 'must not be partially applied',
                channel: {
                    reference: 'not-a-pointer',
                },
            },
            'req-3',
        );

        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();
        expect(composerInput.insertText).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'composer_context_apply_failed',
                message: 'invalid_composer_context',
            }),
            'req-3',
        );
    });

    it.each([
        ['content number', { content: 123 }],
        ['reply number', { reply: 123 }],
        ['quotes valid and invalid reference', {
            quotes: [nip19.noteEncode('7'.repeat(64)), 'invalid'],
        }],
        ['quotes valid and number', {
            quotes: [nip19.noteEncode('7'.repeat(64)), 123],
        }],
        ['empty metadata', {
            channel: { reference: nip19.noteEncode('8'.repeat(64)), name: '' },
        }],
        ['blank metadata', {
            channel: { reference: nip19.noteEncode('8'.repeat(64)), name: '   ' },
        }],
        ['metadata number', {
            channel: { reference: nip19.noteEncode('8'.repeat(64)), name: 123 },
        }],
        ['mixed relay types', {
            channel: {
                reference: nip19.noteEncode('8'.repeat(64)),
                relays: ['wss://valid.example.com', 123],
            },
        }],
        ['invalid relay protocol', {
            channel: {
                reference: nip19.noteEncode('8'.repeat(64)),
                relays: ['https://invalid.example.com'],
            },
        }],
        ['invalid channel reference', {
            channel: { reference: 'invalid' },
        }],
        ['valid channel and invalid reply', {
            channel: { reference: nip19.noteEncode('8'.repeat(64)) },
            reply: 'invalid',
        }],
        ['valid content and invalid quote', {
            content: 'must not be applied',
            quotes: ['invalid'],
        }],
        ['invalid relay in channel reference', {
            channel: {
                reference: nip19.neventEncode({
                    id: '8'.repeat(64),
                    relays: ['https://invalid.example.com'],
                }),
            },
        }],
        ['invalid relay in reply reference', {
            reply: nip19.neventEncode({
                id: '8'.repeat(64),
                relays: ['http://invalid.example.com'],
            }),
        }],
        ['valid quote and invalid-relay quote', {
            quotes: [
                nip19.noteEncode('7'.repeat(64)),
                nip19.neventEncode({
                    id: '8'.repeat(64),
                    relays: ['wss://user:password@invalid.example.com'],
                }),
            ],
        }],
        ['valid and invalid relays in one reference', {
            reply: nip19.neventEncode({
                id: '8'.repeat(64),
                relays: ['wss://valid.example.com', 'not-a-relay'],
            }),
        }],
    ])('不正payloadを原子的にrejectする: %s', async (_label, payload) => {
        const {
            controller,
            composerInput,
            sharedContent,
            composerContextApply,
            parentFrame,
        } = createController();

        await controller.handleRemoteComposerSetContext(payload, 'req-invalid');

        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextError).toHaveBeenCalledTimes(1);
        expect(parentFrame.notifyComposerContextError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'composer_context_apply_failed',
                message: 'invalid_composer_context',
            }),
            'req-invalid',
        );
        expect(composerInput.insertText).not.toHaveBeenCalled();
        expect(composerInput.resetContent).not.toHaveBeenCalled();
        expect(sharedContent.updateUrlQueryContentStore).not.toHaveBeenCalled();
        expect(sharedContent.clearUrlQueryContentStore).not.toHaveBeenCalled();
        expect(composerContextApply.applyChannelContextQuery).not.toHaveBeenCalled();
        expect(composerContextApply.clearChannelContext).not.toHaveBeenCalled();
        expect(composerContextApply.applyReplyQuoteSelection).not.toHaveBeenCalled();
        expect(composerContextApply.clearReplyQuote).not.toHaveBeenCalled();
        expect(composerContextApply.hydrateReplyQuoteReferences).not.toHaveBeenCalled();
    });

    it.each([
        ['undefined', undefined, false],
        ['null', null, true],
        ['trimmed string', ' Parent ', true],
    ])('channel.name %s を契約どおり適用する', async (_label, name, hasName) => {
        const { controller, composerContextApply, parentFrame } = createController();
        await controller.handleRemoteComposerSetContext({
            channel: {
                reference: nip19.noteEncode('9'.repeat(64)),
                name,
            },
        }, 'req-metadata');

        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-metadata');
        const query = composerContextApply.applyChannelContextQuery.mock.calls[0]?.[0];
        expect(Object.prototype.hasOwnProperty.call(query, 'name')).toBe(hasName);
        if (name === null) expect(query.name).toBeNull();
        if (typeof name === 'string') expect(query.name).toBe(name.trim());
    });

    it('重複quoteは現行方針どおりeventIdでdedupeする', async () => {
        const quote = nip19.noteEncode('a'.repeat(64));
        const { controller, composerContextApply, parentFrame } = createController();
        await controller.handleRemoteComposerSetContext({
            quotes: [quote, quote],
        }, 'req-duplicate-quotes');

        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-duplicate-quotes');
        expect(composerContextApply.applyReplyQuoteSelection).toHaveBeenCalledWith({
            reply: null,
            quotes: [{
                eventId: 'a'.repeat(64),
                relayHints: [],
                authorPubkey: null,
            }],
        });
    });

    it('settings.set の uploadEndpoint を applied key として通知する', async () => {
        const { controller, parentFrame } = createController({
            settingsApply: {
                applySettings: vi.fn().mockResolvedValue(['uploadEndpoint']),
            },
        });

        await controller.handleRemoteSettingsSet(
            {
                uploadEndpoint: 'https://upload.example.com',
            },
            'req-4',
        );

        expect(parentFrame.notifySettingsApplied).toHaveBeenCalledWith(
            ['uploadEndpoint'],
            'req-4',
        );
    });

    it('parent-client transition中もcontent patchとackは保留しない', async () => {
        const {
            controller,
            composerInput,
            parentFrame,
            setParentClientTransitioning,
        } = createController();
        setParentClientTransitioning(true);

        await controller.handleRemoteComposerSetContext({ content: 'pending auth message' }, 'req-pa-1');

        expect(composerInput.insertText).toHaveBeenCalledWith('pending auth message');
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-pa-1');
    });

    it('settings.set の適用失敗時は settings_apply_failed で error ack を返す', async () => {
        const failure = new Error('apply failed');
        const { controller, parentFrame } = createController({
            settingsApply: {
                applySettings: vi.fn().mockRejectedValue(failure),
            },
        });

        await controller.handleRemoteSettingsSet({ locale: 'ja' }, 'req-err-1');

        expect(parentFrame.notifySettingsApplied).not.toHaveBeenCalled();
        expect(parentFrame.notifySettingsError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'settings_apply_failed',
                message: 'apply failed',
            }),
            'req-err-1',
        );
    });

    it('composer.contextUpdated は同一シグネチャで再通知せず、reset 後は再通知する', () => {
        let bootstrapping = false;
        let replyState: ReplyQuoteComposerState = {
            reply: {
                mode: 'reply' as const,
                eventId: 'a'.repeat(64),
                relayHints: ['wss://relay.example.com'],
                authorPubkey: 'f'.repeat(64),
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
            quotes: [],
        };

        const { controller, parentFrame } = createController({
            runtime: {
                isBootstrappingApp: vi.fn(() => bootstrapping),
                isParentClientTransitioning: vi.fn(() => false),
                getReplyQuoteState: vi.fn(() => replyState),
                getChannelContextState: vi.fn(() => null),
                getChannelContextProvenance: vi.fn(() => null),
                getRuntimeSnapshot: vi.fn(createRuntimeSnapshot),
            },
        });

        controller.notifyComposerContextUpdatedIfChanged();
        controller.notifyComposerContextUpdatedIfChanged();

        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenCalledTimes(1);

        bootstrapping = true;
        controller.notifyComposerContextUpdatedIfChanged();
        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenCalledTimes(1);

        bootstrapping = false;
        controller.resetNotifiedComposerContextSignature();
        controller.notifyComposerContextUpdatedIfChanged();

        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenCalledTimes(2);

        replyState = {
            reply: replyState.reply,
            quotes: [
                {
                    mode: 'quote',
                    eventId: 'e'.repeat(64),
                    relayHints: ['wss://relay.example.com'],
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
        };
        controller.notifyComposerContextUpdatedIfChanged();

        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenCalledTimes(3);
    });

    it('draft provenanceはmetadata overrideとstable relayを通知し、relay変更も再通知する', () => {
        let channelContext = {
            eventId: 'c'.repeat(64),
            relayHints: ['wss://read.example.com/'],
            channelRelays: ['wss://relay-a.example.com/'],
            name: 'Verified name',
            about: 'Verified about',
            picture: null,
        };
        const provenance = {
            source: 'draft' as const,
            metadataOverrides: {
                name: 'Draft override',
            },
        };
        const { controller, parentFrame } = createController({
            runtime: {
                isBootstrappingApp: vi.fn(() => false),
                isParentClientTransitioning: vi.fn(() => false),
                getReplyQuoteState: vi.fn(createReplyQuoteState),
                getChannelContextState: vi.fn(() => channelContext),
                getChannelContextProvenance: vi.fn(() => provenance),
                getRuntimeSnapshot: vi.fn(createRuntimeSnapshot),
            },
        });

        controller.notifyComposerContextUpdatedIfChanged();
        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenLastCalledWith({
            reply: null,
            quotes: [],
            channel: {
                reference: expect.stringMatching(/^nevent1/),
                relays: ['wss://relay-a.example.com/'],
                name: 'Draft override',
                about: 'Verified about',
            },
        });

        channelContext = {
            ...channelContext,
            channelRelays: ['wss://relay-b.example.com/'],
        };
        controller.notifyComposerContextUpdatedIfChanged();

        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenCalledTimes(2);
        expect(parentFrame.notifyComposerContextUpdated).toHaveBeenLastCalledWith(
            expect.objectContaining({
                channel: expect.objectContaining({
                    relays: ['wss://relay-b.example.com/'],
                    name: 'Draft override',
                }),
            }),
        );
    });

    it('initializeEmbedStorageSync は snapshot を適用し、キーがあれば stored settings を反映する', async () => {
        const injectedStorage = {
            getEmbedStorageSnapshot: vi.fn().mockResolvedValue({ locale: 'ja' }),
            applyEmbedStorageSnapshot: vi.fn(() => ({ appliedKeys: ['locale'] })),
            applyStoredSettingsSnapshot: vi.fn(),
            persistEmbedStorageKeys: vi.fn(),
        };
        const { controller } = createController({
            storage: injectedStorage,
        });

        await controller.initializeEmbedStorageSync();

        expect(injectedStorage.getEmbedStorageSnapshot).toHaveBeenCalledTimes(1);
        expect(injectedStorage.applyEmbedStorageSnapshot).toHaveBeenCalledWith({ locale: 'ja' });
        expect(injectedStorage.applyStoredSettingsSnapshot).toHaveBeenCalledTimes(1);
        expect(injectedStorage.persistEmbedStorageKeys).toHaveBeenCalledTimes(1);
    });
});
