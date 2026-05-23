import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/bootstrap/externalInputBootstrap', () => ({
    runExternalInputBootstrap: vi.fn(),
}));

import { runExternalInputBootstrap } from '../../lib/bootstrap/externalInputBootstrap';
import {
    NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS,
    registerNip46VisibilityHandler,
    runAppInitializationBootstrap,
} from '../../lib/bootstrap/appInitializationBootstrap';

function createExternalInputParams() {
    return {
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
        setReplyQuote: vi.fn(),
        updateReferencedEvent: vi.fn(),
        updateAuthorDisplayName: vi.fn(),
        setReplyQuoteError: vi.fn(),
        relayProfileService: undefined,
        rxNostr: undefined,
        relayConfig: {},
        locationHref: 'http://localhost/?error=processing-error',
    };
}

function createBootstrapParams(overrides: Record<string, unknown> = {}) {
    return {
        reloadSettings: vi.fn(),
        locationSearch: '?error=processing-error',
        clearSharedMediaError: vi.fn(),
        waitForLocale: vi.fn().mockResolvedValue(undefined),
        markLocaleInitialized: vi.fn(),
        initializeAuth: vi.fn().mockResolvedValue({ hasAuth: true, pubkeyHex: 'pubkey-1' }),
        handleAuthenticated: vi.fn().mockResolvedValue(undefined),
        initializeGuestSession: vi.fn().mockResolvedValue(undefined),
        stopProfileLoading: vi.fn(),
        refreshAccountList: vi.fn(),
        markAuthInitialized: vi.fn(),
        getExternalInputBootstrapParams: vi.fn(() => createExternalInputParams()),
        console: {
            error: vi.fn(),
        },
        ...overrides,
    };
}

function createDocumentMock() {
    let handler: (() => void) | undefined;
    const document = {
        visibilityState: 'visible' as Document['visibilityState'],
        addEventListener: vi.fn((event: string, listener: () => void) => {
            if (event === 'visibilitychange') {
                handler = listener;
            }
        }),
        removeEventListener: vi.fn(),
    };

    return {
        document,
        setVisibilityState: (visibilityState: Document['visibilityState']) => {
            document.visibilityState = visibilityState;
        },
        triggerVisibilityChange: () => handler?.(),
    };
}

describe('runAppInitializationBootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('認証復元成功時に認証済みフローと external input bootstrap を実行する', async () => {
        const params = createBootstrapParams();

        await runAppInitializationBootstrap(params as never);

        expect(params.reloadSettings).toHaveBeenCalledOnce();
        expect(params.clearSharedMediaError).toHaveBeenCalledOnce();
        expect(params.waitForLocale).toHaveBeenCalledOnce();
        expect(params.markLocaleInitialized).toHaveBeenCalledOnce();
        expect(params.handleAuthenticated).toHaveBeenCalledWith('pubkey-1');
        expect(params.refreshAccountList).toHaveBeenCalledOnce();
        expect(params.markAuthInitialized).toHaveBeenCalledOnce();
        expect(runExternalInputBootstrap).toHaveBeenCalledWith(
            expect.objectContaining({
                sharedError: 'processing-error',
            }),
        );
    });

    it('未認証時にゲスト初期化へフォールバックする', async () => {
        const params = createBootstrapParams({
            initializeAuth: vi.fn().mockResolvedValue({ hasAuth: false }),
        });

        await runAppInitializationBootstrap(params as never);

        expect(params.handleAuthenticated).not.toHaveBeenCalled();
        expect(params.initializeGuestSession).toHaveBeenCalledOnce();
        expect(params.stopProfileLoading).toHaveBeenCalledOnce();
        expect(params.refreshAccountList).toHaveBeenCalledOnce();
        expect(params.markAuthInitialized).toHaveBeenCalledOnce();
    });

    it('親クライアント自動認証が成功した場合はその結果を優先する', async () => {
        const resolveAuthenticatedSession = vi.fn().mockResolvedValue({
            hasAuth: true,
            pubkeyHex: 'parent-pubkey',
        });
        const params = createBootstrapParams({
            initializeAuth: vi.fn().mockResolvedValue({ hasAuth: false }),
            resolveAuthenticatedSession,
        });

        await runAppInitializationBootstrap(params as never);

        expect(resolveAuthenticatedSession).toHaveBeenCalledWith({ hasAuth: false });
        expect(params.handleAuthenticated).toHaveBeenCalledWith('parent-pubkey');
        expect(params.initializeGuestSession).not.toHaveBeenCalled();
    });

    it('親クライアント自動認証で例外が出ても既存の認証結果を維持する', async () => {
        const error = new Error('auto auth failed');
        const resolveAuthenticatedSession = vi.fn().mockRejectedValue(error);
        const params = createBootstrapParams({
            initializeAuth: vi.fn().mockResolvedValue({ hasAuth: true, pubkeyHex: 'restored-pubkey' }),
            resolveAuthenticatedSession,
        });

        await runAppInitializationBootstrap(params as never);

        expect(params.console.error).toHaveBeenCalledWith('親クライアント連携自動認証中にエラー:', error);
        expect(params.handleAuthenticated).toHaveBeenCalledWith('restored-pubkey');
    });

    it('認証初期化エラー時も guest 初期化と external input bootstrap を継続する', async () => {
        const error = new Error('auth failed');
        const params = createBootstrapParams({
            initializeAuth: vi.fn().mockRejectedValue(error),
        });

        await runAppInitializationBootstrap(params as never);

        expect(params.console.error).toHaveBeenCalledWith('認証初期化中にエラー:', error);
        expect(params.initializeGuestSession).toHaveBeenCalledOnce();
        expect(params.stopProfileLoading).toHaveBeenCalledOnce();
        expect(params.refreshAccountList).not.toHaveBeenCalled();
        expect(params.markAuthInitialized).toHaveBeenCalledOnce();
        expect(runExternalInputBootstrap).toHaveBeenCalledOnce();
    });
});

describe('registerNip46VisibilityHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('hidden後に30秒以上経ってvisibleへ戻ると再接続を試行する', async () => {
        const { document, setVisibilityState, triggerVisibilityChange } = createDocumentMock();
        let nowMs = 0;
        const nip46Service = {
            hasRecoverableSession: vi.fn(() => true),
            isManualCheckInProgress: vi.fn(() => false),
            ensureConnection: vi.fn().mockResolvedValue(undefined),
        };

        const cleanup = registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nip46' } },
            nip46Service,
            console: { error: vi.fn() },
            now: () => nowMs,
        });

        setVisibilityState('hidden');
        triggerVisibilityChange();
        nowMs += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS;
        setVisibilityState('visible');
        triggerVisibilityChange();
        await Promise.resolve();

        expect(nip46Service.ensureConnection).toHaveBeenCalledOnce();
        cleanup();
        expect(document.removeEventListener).toHaveBeenCalledOnce();
    });

    it('hidden経由でないvisibleでは再接続しない', () => {
        const { document, triggerVisibilityChange } = createDocumentMock();
        const nip46Service = {
            hasRecoverableSession: vi.fn(() => true),
            isManualCheckInProgress: vi.fn(() => false),
            ensureConnection: vi.fn().mockResolvedValue(undefined),
        };

        registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nip46' } },
            nip46Service,
            console: { error: vi.fn() },
        });

        triggerVisibilityChange();

        expect(nip46Service.ensureConnection).not.toHaveBeenCalled();
    });

    it('30秒未満の復帰では再接続しない', () => {
        const { document, setVisibilityState, triggerVisibilityChange } = createDocumentMock();
        let nowMs = 0;
        const nip46Service = {
            hasRecoverableSession: vi.fn(() => true),
            isManualCheckInProgress: vi.fn(() => false),
            ensureConnection: vi.fn().mockResolvedValue(undefined),
        };

        registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nip46' } },
            nip46Service,
            console: { error: vi.fn() },
            now: () => nowMs,
        });

        setVisibilityState('hidden');
        triggerVisibilityChange();
        nowMs += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS - 1;
        setVisibilityState('visible');
        triggerVisibilityChange();

        expect(nip46Service.ensureConnection).not.toHaveBeenCalled();
    });

    it('manual check中にvisibleへ戻ってもauto recoveryを開始しない', () => {
        const { document, setVisibilityState, triggerVisibilityChange } = createDocumentMock();
        let nowMs = 0;
        const nip46Service = {
            hasRecoverableSession: vi.fn(() => true),
            isManualCheckInProgress: vi.fn(() => true),
            ensureConnection: vi.fn().mockResolvedValue(undefined),
        };

        registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nip46' } },
            nip46Service,
            console: { error: vi.fn() },
            now: () => nowMs,
        });

        setVisibilityState('hidden');
        triggerVisibilityChange();
        nowMs += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS;
        setVisibilityState('visible');
        triggerVisibilityChange();

        expect(nip46Service.ensureConnection).not.toHaveBeenCalled();
    });

    it('NIP-46以外またはrecoverable sessionなしでは再接続しない', () => {
        const { document, setVisibilityState, triggerVisibilityChange } = createDocumentMock();
        let nowMs = 0;
        const nip46Service = {
            hasRecoverableSession: vi.fn(() => false),
            isManualCheckInProgress: vi.fn(() => false),
            ensureConnection: vi.fn().mockResolvedValue(undefined),
        };

        registerNip46VisibilityHandler({
            document: document as never,
            authState: { value: { type: 'nsec' } },
            nip46Service,
            console: { error: vi.fn() },
            now: () => nowMs,
        });

        setVisibilityState('hidden');
        triggerVisibilityChange();
        nowMs += NIP46_BACKGROUND_RECOVERY_THRESHOLD_MS;
        setVisibilityState('visible');
        triggerVisibilityChange();

        expect(nip46Service.ensureConnection).not.toHaveBeenCalled();
    });
});