import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import {
    mockAuthStoreModule,
    mockProfileStoreModule,
    mockUploadStoreModule,
} from '../mocks/storeModules';

const PARENT_CLIENT_PUBKEY = 'ab'.repeat(32);

const mockState = vi.hoisted(() => {
    const setNsec = vi.fn();
    const logoutAccount = vi.fn(() => null);
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
    }) => {
        params.markLocaleInitialized();
    });
    const cleanupVisibilityHandler = vi.fn();
    const remoteLogoutCleanup = vi.fn();
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
        initializeNostrSession,
        completePostAuthBootstrap,
        runAppInitializationBootstrap,
        cleanupVisibilityHandler,
        remoteLogoutCleanup,
        syncAccountStores,
        accountManager,
        parentRemoteLogoutListener: null as ((pubkeyHex: string | null) => void) | null,
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
        authenticateWithParentClient: vi.fn(),
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
        onRemoteLogout: vi.fn((listener: (pubkeyHex: string | null) => void) => {
            mockState.parentRemoteLogoutListener = listener;
            return mockState.remoteLogoutCleanup;
        }),
    },
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
        mockState.parentRemoteLogoutListener = null;
        mockState.logoutAccount.mockReturnValue(null);
        mockState.accountManager.getAccountType.mockReturnValue('parentClient');
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
        mockState.syncAccountStores.mockClear();
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

    it('remote logout は parentClient 以外のアカウントでは無視する', async () => {
        mockState.accountManager.getAccountType.mockReturnValue('nip07');

        render(App);

        await waitFor(() => {
            expect(mockState.parentRemoteLogoutListener).toBeTruthy();
        });

        mockState.parentRemoteLogoutListener?.(PARENT_CLIENT_PUBKEY);

        await waitFor(() => {
            expect(mockState.accountManager.getAccountType).toHaveBeenCalledWith(PARENT_CLIENT_PUBKEY);
        });

        expect(mockState.logoutAccount).not.toHaveBeenCalled();
        expect(mockAuthStoreModule.clearAuthState).not.toHaveBeenCalled();
    });
});