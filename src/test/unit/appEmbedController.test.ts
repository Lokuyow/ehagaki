import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAppEmbedController } from '../../lib/appEmbedController';

function createRuntimeSnapshot() {
    return {
        rxNostr: undefined,
        relayProfileService: undefined,
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
        composerContextApply: {
            applyReplyQuoteQuery: vi.fn(),
            clearReplyQuote: vi.fn(),
            applyChannelContextQuery: vi.fn(),
            clearChannelContext: vi.fn(),
        },
        settingsApply: {
            applySettings: vi.fn().mockResolvedValue([]),
        },
        parentFrame,
        runtime,
        storage: {
            getEmbedStorageSnapshot: vi.fn().mockResolvedValue({}),
            applyEmbedStorageSnapshot: vi.fn(() => ({ appliedKeys: [] })),
            applyStoredSettingsSnapshot: vi.fn(),
            persistEmbedStorageKeys: vi.fn(),
        },
        logger: {
            warn: vi.fn(),
            error: vi.fn(),
        },
        ...overrides,
    });

    return {
        controller,
        composerInput,
        sharedContent,
        parentFrame,
        runtime,
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
});
