import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { nip19 } from 'nostr-tools';
import {
    mockAuthStoreModule,
    mockProfileStoreModule,
    mockSharedContentStoreModule,
    mockUploadStoreModule,
} from '../mocks/storeModules';

const PARENT_CLIENT_PUBKEY = 'ab'.repeat(32);
const SECOND_PARENT_CLIENT_PUBKEY = 'cd'.repeat(32);
const DEFAULT_REPLY_EVENT_ID = '11'.repeat(32);
const DEFAULT_QUOTE_EVENT_ID = '22'.repeat(32);
const QUEUED_REPLY_EVENT_ID = '33'.repeat(32);
const CLEAR_REPLY_EVENT_ID = '44'.repeat(32);
const CLEAR_QUOTE_EVENT_ID = '55'.repeat(32);
const CHANNEL_EVENT_ID = '66'.repeat(32);
const HISTORY_QUOTE_EVENT_ID = '77'.repeat(32);

const mockDraftState = vi.hoisted(() => {
    const drafts: any[] = [];
    let saveMode: 'saved' | 'confirmation-required' = 'saved';
    let replacementFailuresRemaining = 0;
    let sequence = 0;

    const saveDraft = vi.fn(async () => {
        if (saveMode === 'confirmation-required') {
            return { status: 'confirmation-required' as const, drafts: [...drafts] };
        }
        sequence += 1;
        const draft = {
            id: `app-draft-${sequence}`,
            content: '<p>App draft</p>',
            preview: `App draft ${sequence}`,
            timestamp: sequence,
        };
        drafts.unshift(draft);
        return { status: 'saved' as const, draft, drafts: [...drafts] };
    });
    const saveDraftWithReplaceOldest = vi.fn(async () => {
        if (replacementFailuresRemaining > 0) {
            replacementFailuresRemaining -= 1;
            throw new Error('replacement failed');
        }
        sequence += 1;
        const draft = {
            id: `app-replacement-${sequence}`,
            content: '<p>App replacement</p>',
            preview: `App replacement ${sequence}`,
            timestamp: sequence,
        };
        drafts.splice(0, drafts.length, draft);
        return { status: 'saved' as const, draft, drafts: [...drafts] };
    });

    return {
        drafts,
        saveDraft,
        saveDraftWithReplaceOldest,
        loadDrafts: vi.fn(async () => [...drafts]),
        deleteDraft: vi.fn(async () => [...drafts]),
        deleteAllDrafts: vi.fn(async () => []),
        toggleDraftPinned: vi.fn(async () => [...drafts]),
        setSaveMode(value: 'saved' | 'confirmation-required') {
            saveMode = value;
        },
        setReplacementFailures(value: number) {
            replacementFailuresRemaining = value;
        },
        reset() {
            drafts.splice(0);
            saveMode = 'saved';
            replacementFailuresRemaining = 0;
            sequence = 0;
        },
    };
});

const mockState = vi.hoisted(() => {
    const setNsec = vi.fn();
    const logoutAccount = vi.fn(() => null);
    const applyReplyQuoteQuery = vi.fn(({ replyQuoteQuery, setReplyQuote }: any) => {
        setReplyQuote(replyQuoteQuery);
        return [
            ...(replyQuoteQuery.reply ? [replyQuoteQuery.reply] : []),
            ...replyQuoteQuery.quotes,
        ];
    });
    const authenticateWithParentClient = vi.fn(async () => ({
        success: true,
        pubkeyHex: PARENT_CLIENT_PUBKEY,
    }));
    const getReplyQuoteFromEmbedPayload = vi.fn(() => ({
        reply: {
            eventId: DEFAULT_REPLY_EVENT_ID,
            relayHints: ['wss://hint-relay.example.com'],
            authorPubkey: null,
        },
        quotes: [],
    }) as any);
    const getChannelFromEmbedPayload = vi.fn(() => null);
    const initializeNostrSession = vi.fn(async () => ({
        rxNostr: undefined,
        relayProfileService: {
            getRelayManager: () => ({
                loadRelayConfigForUI: vi.fn(),
            }),
        },
    }));
    const runInitializeNostrSession = vi.fn(async () => ({
        rxNostr: undefined,
        relayProfileService: {
            getRelayManager: () => ({
                loadRelayConfigForUI: vi.fn(),
            }),
        },
    }));
    const completePostAuthBootstrap = vi.fn(async () => ({
        rxNostr: undefined,
        relayProfileService: {
            getRelayManager: () => ({
                loadRelayConfigForUI: vi.fn(),
            }),
        },
    }));
    const runAppInitializationBootstrap = vi.fn((params: {
        markLocaleInitialized: () => void;
        handleAuthenticated: (pubkeyHex: string) => Promise<void>;
        getExternalInputBootstrapParams: () => {
            rxNostr?: unknown;
            relayProfileService?: unknown;
        };
        resolveAuthenticatedSession?: (currentResult: {
            hasAuth: boolean;
            pubkeyHex?: string;
        }) => Promise<{
            hasAuth: boolean;
            pubkeyHex?: string;
        }>;
    }) => {
        mockState.bootstrapParams = params;
        params.markLocaleInitialized();
        return Promise.resolve();
    });
    const cleanupVisibilityHandler = vi.fn();
    const remoteLoginCleanup = vi.fn();
    const remoteLogoutCleanup = vi.fn();
    const remoteComposerSetContextCleanup = vi.fn();
    const remoteSettingsSetCleanup = vi.fn();
    const remoteSettingsErrorCleanup = vi.fn();
    const notifyComposerContextApplied = vi.fn();
    const notifyComposerContextError = vi.fn();
    const notifyComposerContextUpdated = vi.fn();
    const notifySettingsApplied = vi.fn();
    const notifySettingsError = vi.fn();
    const applyUploadEndpointPreference = vi.fn(async () => null);
    const hydrateReplyQuoteReferences = vi.fn().mockResolvedValue(undefined);
    const syncAccountStores = vi.fn();
    const accountManager = {
        addAccount: vi.fn(),
        removeAccount: vi.fn(() => null),
        cleanupAccountData: vi.fn(),
        cleanupNostrLoginData: vi.fn(),
        migrateFromSingleAccount: vi.fn(),
        getAccounts: vi.fn(() => []),
        getAccountType: vi.fn(() => 'parentClient'),
        getActiveAccountPubkey: vi.fn(() => PARENT_CLIENT_PUBKEY),
        setActiveAccount: vi.fn(),
        hasAccount: vi.fn(() => true),
    };

    return {
        setNsec,
        logoutAccount,
        authenticateWithParentClient,
        initializeNostrSession,
        runInitializeNostrSession,
        completePostAuthBootstrap,
        applyReplyQuoteQuery,
        runAppInitializationBootstrap,
        cleanupVisibilityHandler,
        getReplyQuoteFromEmbedPayload,
        getChannelFromEmbedPayload,
        remoteLoginCleanup,
        remoteLogoutCleanup,
        remoteComposerSetContextCleanup,
        remoteSettingsSetCleanup,
        remoteSettingsErrorCleanup,
        notifyComposerContextApplied,
        notifyComposerContextError,
        notifyComposerContextUpdated,
        notifySettingsApplied,
        notifySettingsError,
        applyUploadEndpointPreference,
        hydrateReplyQuoteReferences,
        syncAccountStores,
        accountManager,
        bootstrapParams: null as {
            handleAuthenticated: (pubkeyHex: string) => Promise<void>;
            getExternalInputBootstrapParams: () => {
                rxNostr?: unknown;
                relayProfileService?: unknown;
            };
            resolveAuthenticatedSession?: (currentResult: {
                hasAuth: boolean;
                pubkeyHex?: string;
            }) => Promise<{
                hasAuth: boolean;
                pubkeyHex?: string;
            }>;
        } | null,
        parentRemoteLoginListener: null as ((pubkeyHex: string | null) => void) | null,
        parentRemoteLogoutListener: null as ((pubkeyHex: string | null) => void) | null,
        composerRemoteSetContextListener: null as ((payload: { reply?: string | null; quotes?: string[] | null; content?: string | null }, requestId: string) => void) | null,
        settingsRemoteSetListener: null as ((payload: { locale?: string; uploadEndpoint?: string }, requestId: string) => void) | null,
    };
});

vi.mock('svelte-i18n', () => ({
    _: readable((key: string) => key),
    locale: readable('ja'),
    waitLocale: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../i18n', () => ({}));

vi.mock('../../components/PostComponent.svelte', async () =>
    await import('../mocks/DraftPostComponentMock.svelte'));
vi.mock('../../components/SettingsDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ProfileComponent.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/LoginDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/WelcomeDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/HeaderComponent.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/FooterComponent.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/KeyboardButtonBar.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ReasonInput.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ReplyQuotePreview.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ChannelContextPreview.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/PostHistoryDialog.svelte', async () =>
    await import('../mocks/PostHistoryDialogMock.svelte'));

vi.mock('../../lib/authService', () => ({
    authService: {
        getPublicKeyState: vi.fn(() => ({ setNsec: mockState.setNsec })),
        setAccountManager: vi.fn(),
        authenticateWithNsec: vi.fn(),
        authenticateWithNip07: vi.fn(),
        authenticateWithNip46: vi.fn(),
        authenticateWithParentClient: mockState.authenticateWithParentClient,
        initializeAuth: vi.fn(async () => ({ hasAuth: true, pubkeyHex: PARENT_CLIENT_PUBKEY })),
        markAuthInitialized: vi.fn(),
        logoutAccount: mockState.logoutAccount,
        restoreAccount: vi.fn(),
        isNip07Available: vi.fn(() => false),
    },
}));

vi.mock('../../lib/accountManager', () => ({
    AccountManager: vi.fn(function () {
        return mockState.accountManager;
    }),
}));

vi.mock('../../lib/parentClientAuthService', () => ({
    parentClientAuthService: {
        initialize: vi.fn(() => true),
        announceReady: vi.fn(() => true),
        onRemoteLogin: vi.fn((listener: (pubkeyHex: string | null) => void) => {
            mockState.parentRemoteLoginListener = listener;
            return mockState.remoteLoginCleanup;
        }),
        onRemoteLogout: vi.fn((listener: (pubkeyHex: string | null) => void) => {
            mockState.parentRemoteLogoutListener = listener;
            return mockState.remoteLogoutCleanup;
        }),
        isConnected: vi.fn(() => false),
        getUserPubkey: vi.fn(() => null),
    },
}));

vi.mock('../../lib/embedComposerContextService', () => ({
    embedComposerContextService: {
        initialize: vi.fn(() => true),
        onRemoteSetContext: vi.fn((listener: (payload: { reply?: string | null; quotes?: string[] | null; content?: string | null }, requestId: string) => void) => {
            mockState.composerRemoteSetContextListener = listener;
            return mockState.remoteComposerSetContextCleanup;
        }),
    },
}));

vi.mock('../../lib/embedSettingsService', () => ({
    embedSettingsService: {
        initialize: vi.fn(() => true),
        onRemoteSetSettings: vi.fn((listener: (payload: { locale?: string; uploadEndpoint?: string }, requestId: string) => void) => {
            mockState.settingsRemoteSetListener = listener;
            return mockState.remoteSettingsSetCleanup;
        }),
        onRemoteSettingsError: vi.fn(() => mockState.remoteSettingsErrorCleanup),
    },
}));

vi.mock('../../lib/storage/uploadDestinationsRepository', () => ({
    uploadDestinationsRepository: {
        applyUploadEndpointPreference: mockState.applyUploadEndpointPreference,
    },
}));

vi.mock('../../lib/iframeMessageService', () => ({
    iframeMessageService: {
        notifyComposerContextApplied: mockState.notifyComposerContextApplied,
        notifyComposerContextError: mockState.notifyComposerContextError,
        notifyComposerContextUpdated: mockState.notifyComposerContextUpdated,
        notifySettingsApplied: mockState.notifySettingsApplied,
        notifySettingsError: mockState.notifySettingsError,
    },
}));

vi.mock('../../lib/bootstrap/externalInputBootstrap', () => ({
    applyReplyQuoteSelection: mockState.applyReplyQuoteQuery,
    applyReplyQuoteQuery: mockState.applyReplyQuoteQuery,
    hydrateReplyQuoteReferences: mockState.hydrateReplyQuoteReferences,
}));

vi.mock('../../lib/urlQueryHandler', () => ({
    getReplyQuoteFromEmbedPayload: mockState.getReplyQuoteFromEmbedPayload,
    getChannelFromEmbedPayload: mockState.getChannelFromEmbedPayload,
}));

vi.mock('../../lib/bootstrap/appInitializationBootstrap', () => ({
    runAppInitializationBootstrap: mockState.runAppInitializationBootstrap,
    registerNip46VisibilityHandler: vi.fn(() => mockState.cleanupVisibilityHandler),
}));

vi.mock('../../lib/bootstrap/authBootstrap', () => ({
    initializeNostrSession: mockState.initializeNostrSession,
    runInitializeNostrSession: mockState.runInitializeNostrSession,
    completePostAuthBootstrap: mockState.completePostAuthBootstrap,
    refreshRelaysAndProfileForAccount: vi.fn(),
    syncAccountStores: mockState.syncAccountStores,
}));

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        disconnect: vi.fn().mockResolvedValue(undefined),
        getSigner: vi.fn().mockReturnValue(null),
        waitForPendingOperation: vi.fn().mockResolvedValue(true),
        runManualConnectionCheck: vi.fn().mockResolvedValue({ success: false }),
        getOperationState: vi.fn().mockReturnValue({ kind: 'idle', inProgress: false }),
        subscribeOperationState: vi.fn(() => () => undefined),
        hasRecoverableSession: vi.fn().mockReturnValue(false),
        isManualCheckInProgress: vi.fn().mockReturnValue(false),
        ensureConnection: vi.fn().mockResolvedValue(true),
    },
    BUNKER_REGEX: /^bunker:\/\/.+$/,
}));

vi.mock('../../lib/hooks/useBalloonMessage.svelte', () => ({
    useBalloonMessage: vi.fn(() => ({
        finalMessage: null,
        compactMessage: null,
        showTips: vi.fn(),
    })),
}));

vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../lib/draftManager', () => ({
    loadDrafts: mockDraftState.loadDrafts,
    saveDraft: mockDraftState.saveDraft,
    saveDraftWithReplaceOldest: mockDraftState.saveDraftWithReplaceOldest,
    deleteDraft: mockDraftState.deleteDraft,
    deleteAllDrafts: mockDraftState.deleteAllDrafts,
    toggleDraftPinned: mockDraftState.toggleDraftPinned,
    formatDraftTimestamp: (timestamp: number) => String(timestamp),
}));

import App from '../../App.svelte';

describe('App parentClient integration', () => {
    beforeEach(async () => {
        const { clearReplyQuote } = await import('../../stores/replyQuoteStore.svelte');
        const {
            showDraftLimitConfirmStore,
            showDraftListDialogStore,
            showPostHistoryDialogStore,
        } = await import('../../stores/dialogStore.svelte');
        const { editorState } = await import('../../stores/editorStore.svelte');

        vi.clearAllMocks();
        clearReplyQuote();
        showPostHistoryDialogStore.set(false);
        showDraftListDialogStore.set(false);
        showDraftLimitConfirmStore.set(false);
        mockDraftState.reset();
        editorState.canPost = false;
        mockState.bootstrapParams = null;
        mockState.parentRemoteLoginListener = null;
        mockState.parentRemoteLogoutListener = null;
        mockState.composerRemoteSetContextListener = null;
        mockState.logoutAccount.mockReturnValue(null);
        mockState.authenticateWithParentClient.mockResolvedValue({
            success: true,
            pubkeyHex: PARENT_CLIENT_PUBKEY,
        });
        mockState.accountManager.getAccountType.mockReturnValue('parentClient');
        mockState.accountManager.hasAccount.mockReturnValue(true);
        mockAuthStoreModule.authState.value = {
            isAuthenticated: true,
            isInitialized: true,
            isValid: true,
            type: 'parentClient',
            pubkey: PARENT_CLIENT_PUBKEY,
        } as any;
        mockAuthStoreModule.clearAuthState.mockClear();
        mockProfileStoreModule.profileDataStore.set.mockClear();
        mockProfileStoreModule.profileLoadedStore.set.mockClear();
        mockUploadStoreModule.resetUploadDisplayState.mockClear();
        mockSharedContentStoreModule.updateUrlQueryContentStore.mockClear();
        mockSharedContentStoreModule.clearUrlQueryContentStore.mockClear();
        mockState.initializeNostrSession.mockClear();
        mockState.completePostAuthBootstrap.mockClear();
        mockState.applyReplyQuoteQuery.mockClear();
        mockState.getReplyQuoteFromEmbedPayload.mockClear();
        mockState.getChannelFromEmbedPayload.mockClear();
        mockState.notifyComposerContextApplied.mockClear();
        mockState.notifyComposerContextError.mockClear();
        mockState.notifyComposerContextUpdated.mockClear();
        mockState.notifySettingsApplied.mockClear();
        mockState.notifySettingsError.mockClear();
        mockState.applyUploadEndpointPreference.mockClear();
        mockState.settingsRemoteSetListener = null;
        mockState.syncAccountStores.mockClear();
    });

    it('起動時は parentClient 自動認証を開始しない', async () => {
        mockState.accountManager.hasAccount.mockReturnValue(false);
        mockAuthStoreModule.authState.value = {
            isAuthenticated: false,
            isInitialized: false,
            isValid: false,
            type: 'none',
            pubkey: '',
        } as any;

        render(App);

        await waitFor(() => {
            expect(mockState.bootstrapParams).toBeTruthy();
        });

        expect(mockState.bootstrapParams?.resolveAuthenticatedSession).toBeUndefined();
        expect(mockState.authenticateWithParentClient).not.toHaveBeenCalled();
        expect(mockState.accountManager.addAccount).not.toHaveBeenCalled();
        expect(mockState.accountManager.setActiveAccount).not.toHaveBeenCalled();
    });

    it('external input bootstrap params は認証後の最新 rxNostr を返す', async () => {
        const latestSession = {
            rxNostr: { tag: 'latest-rxnostr' },
            relayProfileService: {
                getRelayManager: () => ({
                    loadRelayConfigForUI: vi.fn(),
                }),
            },
        };
        mockState.completePostAuthBootstrap.mockResolvedValue(latestSession as any);

        render(App);

        await waitFor(() => {
            expect(mockState.bootstrapParams).toBeTruthy();
        });

        await mockState.bootstrapParams?.handleAuthenticated(PARENT_CLIENT_PUBKEY);
        const externalInputParams = mockState.bootstrapParams?.getExternalInputBootstrapParams();

        expect(externalInputParams?.rxNostr).toEqual(latestSession.rxNostr);
        expect(externalInputParams).not.toHaveProperty('relayProfileService');
    });

    it('remote login を受け取ると silent parentClient 認証を行って post-auth bootstrap する', async () => {
        mockState.accountManager.hasAccount.mockReturnValue(false);
        mockAuthStoreModule.authState.value = {
            isAuthenticated: false,
            isInitialized: true,
            isValid: false,
            type: 'none',
            pubkey: '',
        } as any;
        mockState.authenticateWithParentClient.mockResolvedValue({
            success: true,
            pubkeyHex: SECOND_PARENT_CLIENT_PUBKEY,
        });

        render(App);

        await waitFor(() => {
            expect(mockState.parentRemoteLoginListener).toBeTruthy();
        });

        await Promise.resolve();
        await Promise.resolve();

        mockState.parentRemoteLoginListener?.(SECOND_PARENT_CLIENT_PUBKEY);

        await waitFor(() => {
            expect(mockState.authenticateWithParentClient).toHaveBeenCalledWith({
                silent: true,
                timeoutMs: 5000,
            });
        });

        await waitFor(() => {
            expect(mockState.accountManager.addAccount).toHaveBeenCalledWith(
                SECOND_PARENT_CLIENT_PUBKEY,
                'parentClient',
            );
        });
        await waitFor(() => {
            expect(mockState.completePostAuthBootstrap).toHaveBeenCalledWith(
                expect.objectContaining({
                    pubkeyHex: SECOND_PARENT_CLIENT_PUBKEY,
                }),
            );
        });
    });

    it('remote logout を受け取ると parentClient アカウントを notify なしでログアウトする', async () => {
        render(App);

        await waitFor(() => {
            expect(mockState.parentRemoteLogoutListener).toBeTruthy();
        });

        mockState.parentRemoteLogoutListener?.(PARENT_CLIENT_PUBKEY);

        await waitFor(() => {
            expect(mockState.logoutAccount).toHaveBeenCalledWith(
                PARENT_CLIENT_PUBKEY,
                { notifyParentClient: false },
            );
        });

        expect(mockUploadStoreModule.resetUploadDisplayState).toHaveBeenCalledTimes(1);
        expect(mockAuthStoreModule.clearAuthState).toHaveBeenCalledTimes(1);
        expect(mockProfileStoreModule.profileDataStore.set).toHaveBeenCalledWith({
            name: '',
            displayName: '',
            picture: '',
            npub: '',
            nprofile: '',
        });
        expect(mockProfileStoreModule.profileLoadedStore.set).toHaveBeenCalledWith(false);
        expect(mockState.runInitializeNostrSession).toHaveBeenCalledTimes(1);
        expect(mockState.syncAccountStores).toHaveBeenCalledTimes(1);
    });

    it('remote logout で保存済みtypeがparentClientでなければそのアカウントへ復帰する', async () => {
        const { authService } = await import('../../lib/authService');
        mockState.accountManager.getAccountType.mockReturnValue('nsec');
        vi.mocked(authService.restoreAccount).mockResolvedValue({
            hasAuth: true,
            pubkeyHex: PARENT_CLIENT_PUBKEY,
        });

        render(App);

        await waitFor(() => {
            expect(mockState.parentRemoteLogoutListener).toBeTruthy();
        });

        mockState.parentRemoteLogoutListener?.(PARENT_CLIENT_PUBKEY);

        await waitFor(() => {
            expect(authService.restoreAccount).toHaveBeenCalledWith(
                PARENT_CLIENT_PUBKEY,
                'nsec',
            );
        });

        expect(mockState.logoutAccount).not.toHaveBeenCalled();
    });

    it('remote logout は parentClient 以外のアカウントでは無視する', async () => {
        mockAuthStoreModule.authState.value = {
            isAuthenticated: true,
            isInitialized: true,
            isValid: true,
            type: 'nip07',
            pubkey: PARENT_CLIENT_PUBKEY,
        } as any;

        render(App);

        await waitFor(() => {
            expect(mockState.parentRemoteLogoutListener).toBeTruthy();
        });

        mockState.parentRemoteLogoutListener?.(PARENT_CLIENT_PUBKEY);

        expect(mockState.logoutAccount).not.toHaveBeenCalled();
        expect(mockAuthStoreModule.clearAuthState).not.toHaveBeenCalled();
    });

    it('remote composer.setContext を受け取ると content と reply/quote を適用して ack を返す', async () => {
        const latestSession = {
            rxNostr: { tag: 'latest-rxnostr' },
            relayProfileService: {
                getRelayManager: () => ({
                    loadRelayConfigForUI: vi.fn(),
                }),
            },
        };
        const payload = {
            reply: nip19.neventEncode({
                id: DEFAULT_REPLY_EVENT_ID,
                relays: ['wss://hint-relay.example.com'],
            }),
            quotes: [nip19.noteEncode(DEFAULT_QUOTE_EVENT_ID)],
            content: 'runtime composer content',
        };
        const requestId = 'composer-request-1';
        const replyQuoteQuery = {
            reply: {
                eventId: DEFAULT_REPLY_EVENT_ID,
                relayHints: ['wss://hint-relay.example.com'],
                authorPubkey: null,
            },
            quotes: [
                {
                    eventId: DEFAULT_QUOTE_EVENT_ID,
                    relayHints: [],
                    authorPubkey: null,
                },
            ],
        };
        mockState.completePostAuthBootstrap.mockResolvedValue(latestSession as any);
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(replyQuoteQuery);

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
            expect(mockState.bootstrapParams).toBeTruthy();
        });

        await mockState.bootstrapParams?.handleAuthenticated(PARENT_CLIENT_PUBKEY);
        mockState.composerRemoteSetContextListener?.(payload, requestId);

        await waitFor(() => {
            expect(mockState.getReplyQuoteFromEmbedPayload).toHaveBeenCalledWith(payload);
        });
        expect(mockSharedContentStoreModule.updateUrlQueryContentStore).toHaveBeenCalledWith('runtime composer content');
        await waitFor(() => {
            expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    replyQuoteQuery,
                }),
            );
        });
        expect(mockState.notifyComposerContextApplied).toHaveBeenCalledWith(requestId);
        expect(mockState.notifyComposerContextError).not.toHaveBeenCalled();
    });

    it('bootstrapping 中の remote composer.setContext は完了後に 1 回だけ適用して ack を返す', async () => {
        const latestSession = {
            rxNostr: { tag: 'latest-rxnostr' },
            relayProfileService: {
                getRelayManager: () => ({
                    loadRelayConfigForUI: vi.fn(),
                }),
            },
        };
        const payload = {
            reply: nip19.neventEncode({
                id: QUEUED_REPLY_EVENT_ID,
                relays: ['wss://hint-relay.example.com'],
            }),
            quotes: [],
            content: 'queued content',
        };
        const requestId = 'composer-request-queued';
        const replyQuoteQuery = {
            reply: {
                eventId: QUEUED_REPLY_EVENT_ID,
                relayHints: ['wss://hint-relay.example.com'],
                authorPubkey: null,
            },
            quotes: [],
        };
        let resolveBootstrap: (() => void) | undefined;
        mockState.completePostAuthBootstrap.mockResolvedValue(latestSession as any);
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(replyQuoteQuery);
        mockState.runAppInitializationBootstrap.mockImplementationOnce((params: {
            markLocaleInitialized: () => void;
            handleAuthenticated: (pubkeyHex: string) => Promise<void>;
            getExternalInputBootstrapParams: () => {
                rxNostr?: unknown;
                relayProfileService?: unknown;
            };
        }) => {
            mockState.bootstrapParams = params;
            params.markLocaleInitialized();
            return new Promise<void>((resolve) => {
                resolveBootstrap = resolve;
            });
        });

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
            expect(mockState.bootstrapParams).toBeTruthy();
        });

        await mockState.bootstrapParams?.handleAuthenticated(PARENT_CLIENT_PUBKEY);
        mockState.composerRemoteSetContextListener?.(payload, requestId);
        expect(mockState.applyReplyQuoteQuery).not.toHaveBeenCalled();
        expect(mockSharedContentStoreModule.updateUrlQueryContentStore).not.toHaveBeenCalled();

        resolveBootstrap?.();

        await waitFor(() => {
            expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledTimes(1);
        });
        expect(mockSharedContentStoreModule.updateUrlQueryContentStore).toHaveBeenCalledWith('queued content');
        expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                replyQuoteQuery,
            }),
        );
        expect(mockState.notifyComposerContextApplied).toHaveBeenCalledWith(requestId);
    });

    it('無効な remote composer.setContext は error ack を返す', async () => {
        const payload = {
            reply: 'invalid-reply',
            quotes: [],
        };
        const requestId = 'composer-request-invalid';
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(null as any);

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
        });

        mockState.composerRemoteSetContextListener?.(payload, requestId);

        await waitFor(() => {
            expect(mockState.notifyComposerContextError).toHaveBeenCalledWith(
                expect.objectContaining({
                    code: 'composer_context_apply_failed',
                    message: 'invalid_composer_context',
                }),
                requestId,
            );
        });
    });

    it('content のみの remote composer.setContext は ack を返し、reply/quote 適用を走らせない', async () => {
        const payload = {
            content: 'content only update',
        };
        const requestId = 'composer-request-content-only';
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(null as any);

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
        });

        mockState.composerRemoteSetContextListener?.(payload, requestId);

        await waitFor(() => {
            expect(mockSharedContentStoreModule.updateUrlQueryContentStore).toHaveBeenCalledWith('content only update');
        });
        expect(mockState.applyReplyQuoteQuery).not.toHaveBeenCalled();
        expect(mockState.notifyComposerContextApplied).toHaveBeenCalledWith(requestId);
        expect(mockState.notifyComposerContextError).not.toHaveBeenCalled();
    });

    it('remote settings.set の uploadEndpoint は IndexedDB destination を更新して ack に含める', async () => {
        render(App);

        await waitFor(() => {
            expect(mockState.settingsRemoteSetListener).toBeTruthy();
        });

        mockState.settingsRemoteSetListener?.(
            {
                uploadEndpoint: 'https://nostr.build/api/v2/nip96/upload',
            },
            'settings-request-upload',
        );

        await waitFor(() => {
            expect(mockState.applyUploadEndpointPreference).toHaveBeenCalledWith({
                endpoint: 'https://nostr.build/api/v2/nip96/upload',
                mode: 'forced',
                pubkeyHex: null,
            });
        });
        expect(mockState.notifySettingsApplied).toHaveBeenCalledWith(
            ['uploadEndpoint'],
            'settings-request-upload',
        );
        expect(mockState.notifySettingsError).not.toHaveBeenCalled();
    });

    it('channel を含む remote composer.setContext は channel context を適用して ack を返す', async () => {
        const {
            channelContextState,
            effectiveChannelContextState,
            clearChannelContext,
        } = await import('../../stores/channelContextStore.svelte');
        clearChannelContext();
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(null as any);
        mockState.getChannelFromEmbedPayload.mockReturnValue({
            eventId: CHANNEL_EVENT_ID,
            relayHints: ['wss://channel-relay.example.com'],
            name: 'General',
            about: 'Public chat',
            picture: 'https://example.com/channel.png',
        } as any);

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
        });

        mockState.composerRemoteSetContextListener?.(
            {
                channel: {
                    reference: nip19.noteEncode(CHANNEL_EVENT_ID),
                    name: 'General',
                    about: 'Public chat',
                    picture: 'https://example.com/channel.png',
                },
            } as any,
            'composer-request-channel',
        );

        await waitFor(() => {
            expect(mockState.getChannelFromEmbedPayload).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(channelContextState.value).toEqual({
                eventId: CHANNEL_EVENT_ID,
                relayHints: ['wss://channel-relay.example.com/'],
                name: null,
                about: null,
                picture: null,
            });
            expect(effectiveChannelContextState.value).toEqual({
                eventId: CHANNEL_EVENT_ID,
                relayHints: ['wss://channel-relay.example.com/'],
                name: 'General',
                about: 'Public chat',
                picture: 'https://example.com/channel.png',
            });
        });
        expect(mockState.notifyComposerContextApplied).toHaveBeenCalledWith('composer-request-channel');
        expect(mockState.notifyComposerContextError).not.toHaveBeenCalled();
    });

    it('reply / quote を null と空配列で clear する remote composer.setContext は ack を返し、content は変更しない', async () => {
        const { replyQuoteState, setReplyQuote } = await import('../../stores/replyQuoteStore.svelte');
        setReplyQuote({
            reply: {
                eventId: CLEAR_REPLY_EVENT_ID,
                relayHints: ['wss://hint-relay.example.com'],
                authorPubkey: null,
            },
            quotes: [
                {
                    eventId: CLEAR_QUOTE_EVENT_ID,
                    relayHints: [],
                    authorPubkey: null,
                },
            ],
        });

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
        });

        mockState.composerRemoteSetContextListener?.(
            {
                reply: null,
                quotes: [],
            },
            'composer-request-clear',
        );

        await waitFor(() => {
            expect(mockState.notifyComposerContextApplied).toHaveBeenCalledWith('composer-request-clear');
        });
        expect(replyQuoteState.value.reply).toBeNull();
        expect(replyQuoteState.value.quotes).toHaveLength(0);
        expect(mockState.applyReplyQuoteQuery).not.toHaveBeenCalled();
        expect(mockSharedContentStoreModule.clearUrlQueryContentStore).not.toHaveBeenCalled();
    });

    it('投稿履歴から引用すると既存 composer を置き換えて 1 件だけ追加する', async () => {
        const { replyQuoteState, setReplyQuote } = await import('../../stores/replyQuoteStore.svelte');
        const { showPostHistoryDialogStore } = await import('../../stores/dialogStore.svelte');

        setReplyQuote({
            reply: {
                eventId: CLEAR_REPLY_EVENT_ID,
                relayHints: ['wss://hint-relay.example.com'],
                authorPubkey: null,
            },
            quotes: [
                {
                    eventId: CLEAR_QUOTE_EVENT_ID,
                    relayHints: [],
                    authorPubkey: null,
                },
            ],
        });
        showPostHistoryDialogStore.set(true);

        render(App);

        await waitFor(() => {
            expect(mockState.bootstrapParams).toBeTruthy();
        });
        await waitFor(() => {
            expect(document.querySelector('[data-testid="post-history-dialog-quote"]')).toBeTruthy();
        });

        (document.querySelector('[data-testid="post-history-dialog-quote"]') as HTMLButtonElement)?.click();

        await waitFor(() => {
            expect(replyQuoteState.value.reply).toBeNull();
            expect(replyQuoteState.value.quotes).toHaveLength(1);
        });
        expect(replyQuoteState.value.quotes[0]).toEqual(expect.objectContaining({
            eventId: HISTORY_QUOTE_EVENT_ID,
            relayHints: ['wss://quote.example.com/', 'wss://accepted.example.com/'],
            authorPubkey: 'a'.repeat(64),
        }));
    });

    it('実際のAppとDraftListDialogを通して通常保存後に一覧と成功表示を更新する', async () => {
        const { editorState } = await import('../../stores/editorStore.svelte');
        const { showDraftListDialogStore } = await import('../../stores/dialogStore.svelte');
        editorState.canPost = true;
        showDraftListDialogStore.set(true);

        render(App);

        const saveButton = await screen.findByRole('button', { name: 'draft.save' });
        await waitFor(() =>
            expect((saveButton as HTMLButtonElement).disabled).toBe(false),
        );
        await fireEvent.click(saveButton);

        await waitFor(() => expect(mockDraftState.saveDraft).toHaveBeenCalledOnce());
        await waitFor(() => expect(screen.getByText('App draft')).toBeTruthy());
        expect(screen.getByText('draft.saved')).toBeTruthy();
    });

    it('実際のApp・ConfirmDialog・DraftListDialogで置換失敗を表示し、同じpayloadの再試行成功時だけ完了表示する', async () => {
        const { editorState } = await import('../../stores/editorStore.svelte');
        const { showDraftListDialogStore } = await import('../../stores/dialogStore.svelte');
        editorState.canPost = true;
        mockDraftState.setSaveMode('confirmation-required');
        mockDraftState.setReplacementFailures(1);
        showDraftListDialogStore.set(true);

        render(App);

        const saveButton = await screen.findByRole('button', { name: 'draft.save' });
        await waitFor(() =>
            expect((saveButton as HTMLButtonElement).disabled).toBe(false),
        );
        await fireEvent.click(saveButton);
        const confirmButton = await screen.findByRole('button', { name: 'common.ok' });

        await fireEvent.click(confirmButton);
        await waitFor(() =>
            expect(screen.getByRole('alert').textContent).toBe(
                'draft.replace_save_failed',
            ),
        );
        expect(screen.queryByText('draft.saved')).toBeNull();
        expect(mockDraftState.saveDraftWithReplaceOldest).toHaveBeenCalledOnce();

        await fireEvent.click(confirmButton);
        await waitFor(() =>
            expect(mockDraftState.saveDraftWithReplaceOldest).toHaveBeenCalledTimes(2),
        );
        await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
        await waitFor(() => expect(screen.getByText('App replacement')).toBeTruthy());
        expect(screen.getByText('draft.saved')).toBeTruthy();
        expect(
            mockDraftState.saveDraftWithReplaceOldest.mock.calls[0],
        ).toEqual(mockDraftState.saveDraftWithReplaceOldest.mock.calls[1]);
    });

});
