import { beforeEach, describe, expect, it, vi } from 'vitest';

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
        applyReplyQuoteQuery: vi.fn(),
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

    it('無効な composer.setContext はエラー通知に変換する', async () => {
        const { controller, parentFrame } = createController();

        await controller.handleRemoteComposerSetContext(
            {
                channel: {
                    reference: 'not-a-pointer',
                },
            },
            'req-3',
        );

        expect(parentFrame.notifyComposerContextApplied).not.toHaveBeenCalled();
        expect(parentFrame.notifyComposerContextError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'composer_context_apply_failed',
                message: 'invalid_composer_context',
            }),
            'req-3',
        );
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
