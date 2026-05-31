import { describe, expect, it, vi } from 'vitest';

import { createNip46AuthFlowController } from '../../lib/nip46AuthFlowCoordinator';
import type { PendingNip46AuthSession } from '../../lib/authService';

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}

function createPendingSession() {
    const ready = createDeferred<void>();
    const handshakeStarted = createDeferred<void>();
    const completion = createDeferred<{ success: true; pubkeyHex: string }>();
    const cancel = vi.fn().mockResolvedValue(undefined);

    const session: PendingNip46AuthSession = {
        connectionUri: 'nostrconnect://client?relay=wss%3A%2F%2Frelay.example.com%2F',
        ready: ready.promise,
        handshakeStarted: handshakeStarted.promise,
        completion: completion.promise,
        cancel,
    };

    return {
        session,
        ready,
        handshakeStarted,
        completion,
        cancel,
    };
}

describe('createNip46AuthFlowController', () => {
    it('nostrconnect 開始時に pending state を更新し、完了時に authenticated を呼ぶ', async () => {
        const pendingSession = createPendingSession();
        const startNip46NostrConnect = vi.fn().mockResolvedValue(pendingSession.session);
        const finalizeNip46Authentication = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: 'pubkey-1',
        });
        const onAuthenticated = vi.fn().mockResolvedValue(undefined);
        const saveLastUsedRelayCandidates = vi.fn();
        const state = {
            setPendingAuthSession: vi.fn(),
            setHasPendingAuthSession: vi.fn(),
            setConnectionUri: vi.fn(),
            setHandshakeStarted: vi.fn(),
            setLoading: vi.fn(),
            setErrorMessage: vi.fn(),
        };
        const controller = createNip46AuthFlowController({
            startNip46NostrConnect,
            finalizeNip46Authentication,
            onAuthenticated,
            saveLastUsedRelayCandidates,
            console: { error: vi.fn() },
            state,
        });

        const startPromise = controller.handleNostrConnectStart(['wss://relay.example.com']);
        await Promise.resolve();

        expect(startNip46NostrConnect).toHaveBeenCalledWith(['wss://relay.example.com']);
        expect(saveLastUsedRelayCandidates).toHaveBeenCalledWith(['wss://relay.example.com']);
        expect(state.setLoading).toHaveBeenCalledWith(true);
        expect(state.setPendingAuthSession).toHaveBeenCalledWith(pendingSession.session);

        pendingSession.ready.resolve();
        pendingSession.handshakeStarted.resolve();
        pendingSession.completion.resolve({ success: true, pubkeyHex: 'pubkey-1' });
        await startPromise;
        await Promise.resolve();

        expect(finalizeNip46Authentication).toHaveBeenCalledWith('pubkey-1');
        expect(onAuthenticated).toHaveBeenCalledWith('pubkey-1');
        expect(state.setConnectionUri).toHaveBeenCalledWith(pendingSession.session.connectionUri);
        expect(state.setHandshakeStarted).toHaveBeenCalledWith(true);
        expect(state.setLoading).toHaveBeenLastCalledWith(false);
        expect(state.setErrorMessage).toHaveBeenCalledWith('');
    });

    it('キャンセル後に古い completion が届いても無視する', async () => {
        const pendingSession = createPendingSession();
        const startNip46NostrConnect = vi.fn().mockResolvedValue(pendingSession.session);
        const finalizeNip46Authentication = vi.fn().mockResolvedValue({
            success: true,
            pubkeyHex: 'pubkey-2',
        });
        const onAuthenticated = vi.fn().mockResolvedValue(undefined);
        const state = {
            setPendingAuthSession: vi.fn(),
            setHasPendingAuthSession: vi.fn(),
            setConnectionUri: vi.fn(),
            setHandshakeStarted: vi.fn(),
            setLoading: vi.fn(),
            setErrorMessage: vi.fn(),
        };
        const controller = createNip46AuthFlowController({
            startNip46NostrConnect,
            finalizeNip46Authentication,
            onAuthenticated,
            saveLastUsedRelayCandidates: vi.fn(),
            console: { error: vi.fn() },
            state,
        });

        const startPromise = controller.handleNostrConnectStart(['wss://relay.example.com']);
        await Promise.resolve();
        await controller.cancelPendingAuth();
        pendingSession.completion.resolve({ success: true, pubkeyHex: 'pubkey-2' });
        pendingSession.ready.resolve();
        pendingSession.handshakeStarted.resolve();
        await startPromise;
        await Promise.resolve();

        expect(pendingSession.cancel).toHaveBeenCalledOnce();
        expect(finalizeNip46Authentication).not.toHaveBeenCalled();
        expect(onAuthenticated).not.toHaveBeenCalled();
        expect(state.setLoading).toHaveBeenLastCalledWith(false);
        expect(state.setPendingAuthSession).toHaveBeenLastCalledWith(null);
    });
});
