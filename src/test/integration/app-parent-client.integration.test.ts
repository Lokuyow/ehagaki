import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
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

const mockState = vi.hoisted(() => {
    const setNsec = vi.fn();
    const logoutAccount = vi.fn(() => null);
    const applyReplyQuoteQuery = vi.fn().mockResolvedValue(undefined);
    const applyChannelContextQuery = vi.fn().mockImplementation(async ({ channelContextQuery }: any) => {
        const { setChannelContext } = await import('../../stores/channelContextStore.svelte');
        setChannelContext({
            eventId: channelContextQuery.eventId,
            relayHints: channelContextQuery.relayHints,
            name: channelContextQuery.name ?? 'General',
            about: channelContextQuery.about ?? 'Public chat',
            picture: channelContextQuery.picture ?? 'https://example.com/channel.png',
        });
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
        completePostAuthBootstrap,
        applyReplyQuoteQuery,
        applyChannelContextQuery,
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
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/SettingsDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ProfileComponent.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/LoginDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/WelcomeDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/DraftListDialog.svelte', async () =>
    await import('../mocks/EmptyComponent.svelte'));
vi.mock('../../components/ConfirmDialog.svelte', async () =>
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
    AccountManager: vi.fn(() => mockState.accountManager),
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
    applyReplyQuoteQuery: mockState.applyReplyQuoteQuery,
    applyChannelContextQuery: mockState.applyChannelContextQuery,
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
    completePostAuthBootstrap: mockState.completePostAuthBootstrap,
    refreshRelaysAndProfileForAccount: vi.fn(),
    syncAccountStores: mockState.syncAccountStores,
}));

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {},
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

import App from '../../App.svelte';

describe('App parentClient integration', () => {
    beforeEach(async () => {
        const { clearReplyQuote } = await import('../../stores/replyQuoteStore.svelte');
        const { showPostHistoryDialogStore } = await import('../../stores/dialogStore.svelte');

        vi.clearAllMocks();
        clearReplyQuote();
        showPostHistoryDialogStore.set(false);
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
        mockState.applyChannelContextQuery.mockClear();
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

    it('external input bootstrap params は認証後の最新 rxNostr と relayProfileService を返す', async () => {
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
        expect(externalInputParams?.relayProfileService).toEqual(latestSession.relayProfileService);
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
        expect(mockState.initializeNostrSession).toHaveBeenCalledTimes(1);
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
            reply: 'nevent1reply',
            quotes: ['note1quote'],
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
                    rxNostr: latestSession.rxNostr,
                    relayProfileService: latestSession.relayProfileService,
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
            reply: 'nevent1queued',
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
                rxNostr: latestSession.rxNostr,
                relayProfileService: latestSession.relayProfileService,
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
        const { channelContextState, clearChannelContext } = await import('../../stores/channelContextStore.svelte');
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
                    reference: `note1${CHANNEL_EVENT_ID}`,
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
            expect(mockState.applyChannelContextQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    channelContextQuery: {
                        eventId: CHANNEL_EVENT_ID,
                        relayHints: ['wss://channel-relay.example.com'],
                        name: 'General',
                        about: 'Public chat',
                        picture: 'https://example.com/channel.png',
                    },
                }),
            );
        });
        await waitFor(() => {
            expect(channelContextState.value).toEqual({
                eventId: CHANNEL_EVENT_ID,
                relayHints: ['wss://channel-relay.example.com'],
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
            eventId: 'history-quote-target',
            relayHints: ['wss://quote.example.com/', 'wss://accepted.example.com/'],
            authorPubkey: 'a'.repeat(64),
        }));
    });

});
