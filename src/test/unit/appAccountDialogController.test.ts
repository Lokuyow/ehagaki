import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAppAccountDialogController } from '../../lib/appAccountDialogController';

function createController(overrides: Record<string, unknown> = {}) {
    let pendingLastLogoutPubkey: string | null = null;
    let isLoggingOut = false;

    const deps = {
        accountManager: {
            getAccounts: vi.fn(() => [{ pubkeyHex: 'ab'.repeat(32) }]),
        },
        requestLogoutAccount: vi.fn(async () => undefined),
        closeLogoutDialog: vi.fn(),
        openAddAccountDialog: vi.fn(),
        getPendingLastLogoutPubkey: () => pendingLastLogoutPubkey,
        setPendingLastLogoutPubkey: (next: string | null) => {
            pendingLastLogoutPubkey = next;
        },
        setLastAccountLogoutError: vi.fn(),
        setShowTransitionOverlay: vi.fn(),
        getIsLoggingOut: () => isLoggingOut,
        setIsLoggingOut: (next: boolean) => {
            isLoggingOut = next;
        },
        setShowLastAccountLogoutConfirm: vi.fn(),
        resetUploadDisplayState: vi.fn(),
        getCurrentRxNostr: vi.fn(() => ({ dispose: vi.fn() })),
        setCurrentRxNostr: vi.fn(),
        disposeNostrSession: vi.fn(() => undefined),
        logoutLastAccount: vi.fn(async () => undefined),
        reloadWindow: vi.fn(),
        logger: { error: vi.fn() },
        transitionDelayMs: 50,
        ...overrides,
    };

    return {
        deps,
        controller: createAppAccountDialogController(deps as never),
    };
}

describe('createAppAccountDialogController', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('最後のアカウントでない logout は即時リクエストする', async () => {
        const { deps, controller } = createController({
            accountManager: {
                getAccounts: vi.fn(() => [
                    { pubkeyHex: 'ab'.repeat(32) },
                    { pubkeyHex: 'cd'.repeat(32) },
                ]),
            },
        });

        controller.requestLogoutAccount('ab'.repeat(32));

        expect(deps.requestLogoutAccount).toHaveBeenCalledWith('ab'.repeat(32));
        expect(deps.setShowLastAccountLogoutConfirm).not.toHaveBeenCalled();
    });

    it('最後のアカウント logout は確認ダイアログへ遷移する', () => {
        vi.useFakeTimers();
        const { deps, controller } = createController();

        controller.requestLogoutAccount('ab'.repeat(32));

        expect(deps.closeLogoutDialog).toHaveBeenCalledTimes(1);
        expect(deps.setShowTransitionOverlay).toHaveBeenNthCalledWith(1, true);

        vi.advanceTimersByTime(50);

        expect(deps.setShowLastAccountLogoutConfirm).toHaveBeenCalledWith(true);
        expect(deps.setShowTransitionOverlay).toHaveBeenNthCalledWith(2, false);
    });

    it('confirm は logoutLastAccount 成功時に reload する', async () => {
        const { deps, controller } = createController({
            getPendingLastLogoutPubkey: () => 'ab'.repeat(32),
        });

        await controller.confirmLastAccountLogout();

        expect(deps.resetUploadDisplayState).toHaveBeenCalledTimes(1);
        expect(deps.disposeNostrSession).toHaveBeenCalledTimes(1);
        expect(deps.logoutLastAccount).toHaveBeenCalledWith('ab'.repeat(32));
        expect(deps.reloadWindow).toHaveBeenCalledTimes(1);
    });

    it('handleAddAccount は overlay つきで add account dialog を開く', () => {
        vi.useFakeTimers();
        const { deps, controller } = createController();

        controller.handleAddAccount();

        expect(deps.setShowTransitionOverlay).toHaveBeenNthCalledWith(1, true);
        expect(deps.closeLogoutDialog).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(50);

        expect(deps.openAddAccountDialog).toHaveBeenCalledTimes(1);
        expect(deps.setShowTransitionOverlay).toHaveBeenNthCalledWith(2, false);
    });
});
