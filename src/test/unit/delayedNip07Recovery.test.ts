import { describe, expect, it, vi } from 'vitest';
import { createDelayedNip07RecoveryController } from '../../lib/delayedNip07Recovery';

const ACTIVE = 'aa'.repeat(32);
const OTHER = 'bb'.repeat(32);

function createHarness() {
    let visibilityState = 'visible';
    const listeners = new Map<string, Set<() => void>>();
    const window = {
        addEventListener: vi.fn((name: string, listener: () => void) => {
            const set = listeners.get(name) ?? new Set();
            set.add(listener);
            listeners.set(name, set);
        }),
        removeEventListener: vi.fn((name: string, listener: () => void) => listeners.get(name)?.delete(listener)),
    } as unknown as Window;
    const document = {
        get visibilityState() { return visibilityState; },
        addEventListener: vi.fn((name: string, listener: () => void) => {
            const set = listeners.get(name) ?? new Set();
            set.add(listener);
            listeners.set(name, set);
        }),
        removeEventListener: vi.fn((name: string, listener: () => void) => listeners.get(name)?.delete(listener)),
    } as unknown as Document;
    const fire = (name: string) => listeners.get(name)?.forEach(listener => listener());
    const setVisible = (visible: boolean) => { visibilityState = visible ? 'visible' : 'hidden'; };
    let generation = 0;
    let active = ACTIVE;
    let authenticated = false;
    const identity = (hex: string) => ({ hex, npub: `npub-${hex}`, nprofile: `nprofile-${hex}` });
    const readIdentity = vi.fn<() => Promise<ReturnType<typeof identity> | null>>();
    const restoreAccount = vi.fn().mockResolvedValue({ hasAuth: true, pubkeyHex: ACTIVE });
    const handlePostAuth = vi.fn().mockResolvedValue(undefined);
    const waitForExtension = vi.fn().mockResolvedValue(true);
    const service = {
        isAvailable: vi.fn().mockReturnValue(true),
        waitForExtension,
    };
    const controller = createDelayedNip07RecoveryController({
        window,
        document,
        nip07Service: service,
        readIdentity,
        restoreAccount,
        handlePostAuth,
        getActivePubkey: () => active,
        getAccountType: () => 'nip07',
        isAuthenticated: () => authenticated,
        getGeneration: () => generation,
        console: { error: vi.fn() },
    });
    return {
        controller, readIdentity, restoreAccount, handlePostAuth, service, waitForExtension, window, document,
        fire, setVisible, setGeneration: (value: number) => { generation = value; },
        setActive: (value: string) => { active = value; },
        setAuthenticated: (value: boolean) => { authenticated = value; },
        identity,
    };
}

describe('delayed NIP-07 recovery', () => {
    it('restores only matching active identity on focus and is single-flight', async () => {
        const h = createHarness();
        let resolveIdentity!: (value: ReturnType<typeof h.identity>) => void;
        h.readIdentity.mockReturnValueOnce(new Promise(resolve => { resolveIdentity = resolve; }));
        h.controller.start(ACTIVE);
        h.fire('focus');
        h.fire('focus');
        expect(h.readIdentity).toHaveBeenCalledOnce();
        resolveIdentity(h.identity(ACTIVE));
        await vi.waitFor(() => expect(h.handlePostAuth).toHaveBeenCalledWith(ACTIVE));
        expect(h.restoreAccount).toHaveBeenCalledOnce();
        expect(h.window.removeEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
        expect(h.document.removeEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
        expect(h.restoreAccount).toHaveBeenCalledWith(ACTIVE, 'nip07', {
            nip07Identity: h.identity(ACTIVE),
        });
    });

    it('waits for a provider without custom polling and aborts on dispose', async () => {
        const h = createHarness();
        h.service.isAvailable.mockReturnValue(false);
        let resolveWait!: (value: boolean) => void;
        h.waitForExtension.mockReturnValueOnce(new Promise(resolve => { resolveWait = resolve; }));
        h.controller.start(ACTIVE);
        expect(h.waitForExtension).toHaveBeenCalledWith(Number.POSITIVE_INFINITY, expect.any(Object));
        h.controller.dispose();
        resolveWait(true);
        await Promise.resolve();
        expect(h.readIdentity).not.toHaveBeenCalled();
        expect(h.waitForExtension.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
        expect(h.window.removeEventListener).toHaveBeenCalled();
        expect(h.document.removeEventListener).toHaveBeenCalled();
    });

    it('coalesces provider discovery and focus into one probe', async () => {
        const h = createHarness();
        h.service.isAvailable.mockReturnValue(false);
        let resolveWait!: (value: boolean) => void;
        h.waitForExtension.mockReturnValueOnce(new Promise(resolve => { resolveWait = resolve; }));
        h.readIdentity.mockResolvedValue(h.identity(ACTIVE));
        h.controller.start(ACTIVE);
        h.service.isAvailable.mockReturnValue(true);
        h.fire('focus');
        resolveWait(true);
        await vi.waitFor(() => expect(h.handlePostAuth).toHaveBeenCalledOnce());
        expect(h.readIdentity).toHaveBeenCalledOnce();
        expect(h.restoreAccount).toHaveBeenCalledOnce();
        expect(h.window.removeEventListener).toHaveBeenCalled();
        expect(h.document.removeEventListener).toHaveBeenCalled();
    });

    it('ignores mismatch identity and retries after a later visible trigger', async () => {
        const h = createHarness();
        h.readIdentity
            .mockResolvedValueOnce(h.identity(OTHER))
            .mockResolvedValueOnce(h.identity(ACTIVE));
        h.controller.start(ACTIVE);
        h.fire('focus');
        await vi.waitFor(() => expect(h.readIdentity).toHaveBeenCalledOnce());
        expect(h.restoreAccount).not.toHaveBeenCalled();
        await Promise.resolve();
        await Promise.resolve();
        h.setVisible(false);
        h.setVisible(true);
        await Promise.resolve();
        h.fire('visibilitychange');
        await vi.waitFor(() => expect(h.handlePostAuth).toHaveBeenCalledOnce());
        expect(h.restoreAccount).toHaveBeenCalledOnce();
    });

    it('rejects a late result after a manual transition or account change', async () => {
        const h = createHarness();
        let resolveIdentity!: (value: ReturnType<typeof h.identity>) => void;
        h.readIdentity.mockReturnValueOnce(new Promise(resolve => { resolveIdentity = resolve; }));
        h.controller.start(ACTIVE);
        h.fire('focus');
        h.setGeneration(1);
        h.controller.markTransition();
        resolveIdentity(h.identity(ACTIVE));
        await Promise.resolve();
        expect(h.restoreAccount).not.toHaveBeenCalled();
        expect(h.window.removeEventListener).toHaveBeenCalled();
        expect(h.document.removeEventListener).toHaveBeenCalled();

        const h2 = createHarness();
        h2.readIdentity.mockResolvedValueOnce(h2.identity(ACTIVE));
        h2.controller.start(ACTIVE);
        h2.setActive(OTHER);
        h2.fire('focus');
        await Promise.resolve();
        expect(h2.restoreAccount).not.toHaveBeenCalled();
        expect(h2.window.removeEventListener).toHaveBeenCalled();
        expect(h2.document.removeEventListener).toHaveBeenCalled();
    });
});
