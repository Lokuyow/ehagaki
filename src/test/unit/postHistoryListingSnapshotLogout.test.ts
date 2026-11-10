import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';

import {
    PUBKEY_HEX,
    PostHistoryDialog,
    cleanupPostHistoryDialogHarness,
    createRecord,
    repositoryMock,
    resetPostHistoryDialogHarness,
} from './postHistoryDialogTestHarness';
import { createAppAccountSessionController } from '../../lib/appAccountSessionController';
import { readPersistedPostHistoryListingSnapshotForPubkey } from '../../lib/hooks/usePostHistoryListing.svelte';
import { clearRegisteredPersistedPostHistoryListingSnapshots } from '../../lib/postHistoryListingSnapshotCleanup';

async function seedPreviousAccountSnapshot(): Promise<void> {
    const post = createRecord({
        eventId: 'd'.repeat(64),
        content: 'ログアウト前の投稿',
    });
    repositoryMock.countForPubkey.mockResolvedValue(1);
    repositoryMock.getLatestVisibleChunk.mockImplementation(async () => [post]);

    const view = render(PostHistoryDialog, {
        props: {
            show: true,
            onClose: vi.fn(),
            pubkeyHex: PUBKEY_HEX,
        },
    });

    await screen.findByText('ログアウト前の投稿');
    await waitFor(() => {
        expect(readPersistedPostHistoryListingSnapshotForPubkey(PUBKEY_HEX).loadedPosts)
            .toEqual(expect.arrayContaining([
                expect.objectContaining({ eventId: post.eventId }),
            ]));
    });
    view.unmount();
}

function createSessionController(
    overrides: Record<string, unknown> = {},
) {
    const reloadWindow = vi.fn();
    const initializeNostr = vi.fn(async () => undefined);
    const controller = createAppAccountSessionController({
        getIsSwitchingAccount: () => false,
        setIsSwitchingAccount: vi.fn(),
        getIsLoggingOut: () => false,
        setIsLoggingOut: vi.fn(),
        setProfileLoading: vi.fn(),
        getAuthStateSnapshot: () => ({ type: 'nsec', pubkey: PUBKEY_HEX }),
        getCurrentRxNostr: () => ({ dispose: vi.fn() }),
        setCurrentRxNostr: vi.fn(),
        disposeNostrSession: vi.fn(() => undefined),
        nip46Service: { disconnect: vi.fn(async () => undefined) },
        parentClientService: { disconnect: vi.fn() },
        accountManager: {
            getAccountType: vi.fn((pubkeyHex: string) => pubkeyHex === PUBKEY_HEX ? 'nsec' as const : null),
            hasAccount: vi.fn(() => false),
            setActiveAccount: vi.fn(),
            getActiveAccountPubkey: vi.fn(() => null),
            clearActiveAccount: vi.fn(),
        },
        restoreManagedAccountSession: vi.fn(async () => ({
            success: false as const,
            reason: 'restore-failed' as const,
        })),
        restoreAccount: vi.fn(async () => ({ hasAuth: false })),
        handlePostAuth: vi.fn(async () => undefined),
        resetUploadDisplayState: vi.fn(),
        invalidatePendingAccountScopedAsyncState: vi.fn(),
        clearAccountScopedAsyncState: vi.fn(),
        clearPersistedPostHistoryListingSnapshots: clearRegisteredPersistedPostHistoryListingSnapshots,
        logoutAccountFromAuthService: vi.fn(async () => null),
        resolveLogoutAccountAction: vi.fn(() => ({ kind: 'guest' as const })),
        clearAuthState: vi.fn(),
        setGuestProfile: vi.fn(),
        setProfileLoaded: vi.fn(),
        initializeNostr,
        setSecretKey: vi.fn(),
        setErrorMessage: vi.fn(),
        refreshAccountList: vi.fn(),
        reloadWindow,
        closeLogoutDialog: vi.fn(),
        logger: { error: vi.fn() },
        ...overrides,
    } as never);

    return { controller, reloadWindow, initializeNostr };
}

describe('logout clears persisted post history listing snapshots', () => {
    beforeEach(() => {
        resetPostHistoryDialogHarness();
    });

    afterEach(() => {
        cleanupPostHistoryDialogHarness();
    });

    it('guest logout drops the previous account snapshot without reloading', async () => {
        await seedPreviousAccountSnapshot();
        const { controller, reloadWindow, initializeNostr } = createSessionController();

        await controller.logoutAccount(PUBKEY_HEX);

        expect(initializeNostr).toHaveBeenCalledOnce();
        expect(reloadWindow).not.toHaveBeenCalled();
        expect(readPersistedPostHistoryListingSnapshotForPubkey(PUBKEY_HEX).loadedPosts).toEqual([]);
    });

    it('account invalidation to guest drops the previous account snapshot without reloading', async () => {
        await seedPreviousAccountSnapshot();
        const targetPubkey = 'e'.repeat(64);
        const { controller, reloadWindow, initializeNostr } = createSessionController({
            getAuthStateSnapshot: () => ({ type: 'none', pubkey: '' }),
            accountManager: {
                getAccountType: vi.fn((pubkeyHex: string) => pubkeyHex === targetPubkey ? 'nip07' as const : null),
                hasAccount: vi.fn(() => false),
                setActiveAccount: vi.fn(),
                getActiveAccountPubkey: vi.fn(() => null),
                clearActiveAccount: vi.fn(),
            },
        });

        await expect(controller.switchAccount(targetPubkey)).resolves.toBe(false);

        expect(initializeNostr).toHaveBeenCalledOnce();
        expect(reloadWindow).not.toHaveBeenCalled();
        expect(readPersistedPostHistoryListingSnapshotForPubkey(PUBKEY_HEX).loadedPosts).toEqual([]);
    });
});
