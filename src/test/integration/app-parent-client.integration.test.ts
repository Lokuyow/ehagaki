import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import {
    mockAuthStoreModule,
    mockProfileStoreModule,
    mockUploadStoreModule,
} from '../mocks/storeModules';

const PARENT_CLIENT_PUBKEY = 'ab'.repeat(32);
const SECOND_PARENT_CLIENT_PUBKEY = 'cd'.repeat(32);

const mockState = vi.hoisted(() => {
    const setNsec = vi.fn();
    const logoutAccount = vi.fn(() => null);
    const applyReplyQuoteQuery = vi.fn().mockResolvedValue(undefined);
    const authenticateWithParentClient = vi.fn(async () => ({
        success: true,
        pubkeyHex: PARENT_CLIENT_PUBKEY,
    }));
    const getReplyQuoteFromEmbedPayload = vi.fn(() => ({
        reply: {
            eventId: 'event-1',
            relayHints: ['wss://hint-relay.example.com'],
            authorPubkey: null,
        },
        quotes: [],
    }));
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
    const remoteComposerClearContextCleanup = vi.fn();
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
        runAppInitializationBootstrap,
        cleanupVisibilityHandler,
        getReplyQuoteFromEmbedPayload,
        remoteLoginCleanup,
        remoteLogoutCleanup,
        remoteComposerSetContextCleanup,
        remoteComposerClearContextCleanup,
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
        composerRemoteSetContextListener: null as ((payload: { reply?: string | null; quotes?: string[] }) => void) | null,
        composerRemoteClearContextListener: null as (() => void) | null,
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
        onRemoteSetContext: vi.fn((listener: (payload: { reply?: string | null; quotes?: string[] }) => void) => {
            mockState.composerRemoteSetContextListener = listener;
            return mockState.remoteComposerSetContextCleanup;
        }),
        onRemoteClearContext: vi.fn((listener: () => void) => {
            mockState.composerRemoteClearContextListener = listener;
            return mockState.remoteComposerClearContextCleanup;
        }),
    },
}));

vi.mock('../../lib/bootstrap/externalInputBootstrap', () => ({
    applyReplyQuoteQuery: mockState.applyReplyQuoteQuery,
}));

vi.mock('../../lib/urlQueryHandler', () => ({
    getReplyQuoteFromEmbedPayload: mockState.getReplyQuoteFromEmbedPayload,
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
        showTips: vi.fn(),
    })),
}));

vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
}));

import App from '../../App.svelte';

describe('App parentClient integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.bootstrapParams = null;
        mockState.parentRemoteLoginListener = null;
        mockState.parentRemoteLogoutListener = null;
        mockState.composerRemoteSetContextListener = null;
        mockState.composerRemoteClearContextListener = null;
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
        mockState.initializeNostrSession.mockClear();
        mockState.completePostAuthBootstrap.mockClear();
        mockState.applyReplyQuoteQuery.mockClear();
        mockState.getReplyQuoteFromEmbedPayload.mockClear();
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

    it('remote composer.setContext を受け取ると最新 session で runtime 適用する', async () => {
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
        };
        const replyQuoteQuery = {
            reply: {
                eventId: 'event-1',
                relayHints: ['wss://hint-relay.example.com'],
                authorPubkey: null,
            },
            quotes: [],
        };
        mockState.completePostAuthBootstrap.mockResolvedValue(latestSession as any);
        mockState.getReplyQuoteFromEmbedPayload.mockReturnValue(replyQuoteQuery);

        render(App);

        await waitFor(() => {
            expect(mockState.composerRemoteSetContextListener).toBeTruthy();
            expect(mockState.bootstrapParams).toBeTruthy();
        });

        await mockState.bootstrapParams?.handleAuthenticated(PARENT_CLIENT_PUBKEY);
        mockState.composerRemoteSetContextListener?.(payload);

        await waitFor(() => {
            expect(mockState.getReplyQuoteFromEmbedPayload).toHaveBeenCalledWith(payload);
        });
        await waitFor(() => {
            expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    replyQuoteQuery,
                    rxNostr: latestSession.rxNostr,
                    relayProfileService: latestSession.relayProfileService,
                }),
            );
        });
    });

    it('bootstrapping 中の remote composer.setContext は完了後に 1 回だけ適用する', async () => {
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
        };
        const replyQuoteQuery = {
            reply: {
                eventId: 'event-queued',
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
        mockState.composerRemoteSetContextListener?.(payload);
        expect(mockState.applyReplyQuoteQuery).not.toHaveBeenCalled();

        resolveBootstrap?.();

        await waitFor(() => {
            expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledTimes(1);
        });
        expect(mockState.applyReplyQuoteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                replyQuoteQuery,
                rxNostr: latestSession.rxNostr,
                relayProfileService: latestSession.relayProfileService,
            }),
        );
    });
});