import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nip19 } from 'nostr-tools';

import { createAppEmbedController } from '../../lib/appEmbedController';
import type { ReplyQuoteComposerState } from '../../lib/types';

function createRuntimeSnapshot() {
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
    let pendingParentAuth = false;

    const runtime = {
        isBootstrappingApp: vi.fn(() => bootstrappingApp),
        hasPendingParentAuth: vi.fn(() => pendingParentAuth),
        getReplyQuoteState: vi.fn(createReplyQuoteState),
        getChannelContextState: vi.fn(createChannelContextState),
        getChannelContextProvenance: vi.fn(() => null),
        getRuntimeSnapshot: vi.fn(createRuntimeSnapshot),
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
        setPendingParentAuth(value: boolean) {
            pendingParentAuth = value;
        },
    };
}

describe('createAppEmbedController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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

    it('reply選択を同期適用してhydrate完了前にackし、hydrateはack後に開始する', async () => {
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
        const { controller, parentFrame } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });

        await controller.handleRemoteComposerSetContext({
            reply: nip19.noteEncode(reply.eventId),
        }, 'req-reply-fast-ack');

        expect(applyReplyQuoteSelection).toHaveBeenCalledOnce();
        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-reply-fast-ack');
        expect(hydrateReplyQuoteReferences).toHaveBeenCalledOnce();
        expect(parentFrame.notifyComposerContextApplied.mock.invocationCallOrder[0])
            .toBeLessThan(hydrateReplyQuoteReferences.mock.invocationCallOrder[0]);
        resolveHydration();
        await hydration;
    });

    it('quoteだけのpayloadも選択設定直後にackしてからhydrateする', async () => {
        const quote = {
            eventId: '5'.repeat(64),
            mode: 'quote' as const,
            ownerToken: Symbol('quote-owner'),
            relayHints: [],
            authorPubkey: null,
        };
        const applyReplyQuoteSelection = vi.fn(() => [quote]);
        const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
        const { controller, parentFrame } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery: vi.fn(),
                clearChannelContext: vi.fn(),
            },
        });

        await controller.handleRemoteComposerSetContext({
            quotes: [nip19.noteEncode(quote.eventId)],
        }, 'req-quote-fast-ack');

        expect(parentFrame.notifyComposerContextApplied).toHaveBeenCalledWith('req-quote-fast-ack');
        expect(parentFrame.notifyComposerContextApplied.mock.invocationCallOrder[0])
            .toBeLessThan(hydrateReplyQuoteReferences.mock.invocationCallOrder[0]);
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
        const { controller, parentFrame, logger } = createController({
            composerContextApply: {
                applyReplyQuoteSelection,
                hydrateReplyQuoteReferences,
                clearReplyQuote: vi.fn(),
                applyChannelContextQuery,
                clearChannelContext: vi.fn(),
            },
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

    it('pending parent auth 中の composer.setContext も保留し、解除後 flush で適用する', async () => {
        const { controller, composerInput, parentFrame, setPendingParentAuth } = createController();
        setPendingParentAuth(true);

        await controller.handleRemoteComposerSetContext({ content: 'pending auth message' }, 'req-pa-1');

        expect(composerInput.insertText).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();

        setPendingParentAuth(false);
        await controller.flushPendingComposerAction();

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
                hasPendingParentAuth: vi.fn(() => false),
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
