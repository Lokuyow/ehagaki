import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentClientAuthService } from '../../lib/parentClientAuthService';
import type { ParentClientSessionData } from '../../lib/types';
import { MockStorage } from '../helpers';

function createMockWindow(search = '?parentOrigin=https%3A%2F%2Fparent.example.com') {
    const listeners = new Map<string, (event: MessageEvent) => void>();
    const parent = {
        postMessage: vi.fn(),
    };

    const windowObj = {
        self: {},
        top: {},
        parent,
        location: { search },
        document: { referrer: '' },
        addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
            listeners.set(type, handler);
        }),
        removeEventListener: vi.fn((type: string) => {
            listeners.delete(type);
        }),
    } as unknown as Window;

    return { windowObj, parent, listeners };
}

describe('ParentClientAuthService', () => {
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
    });

    it('auth.request/auth.result で接続し signer を生成する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const promise = service.connect({ capabilities: ['signEvent'] });

        expect(parent.postMessage).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ type: 'ready' }),
            'https://parent.example.com',
        );
        expect(parent.postMessage).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ type: 'auth.request' }),
            'https://parent.example.com',
        );

        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: 'ehagaki.parentClient',
                version: 1,
                type: 'auth.result',
                requestId: authRequest.requestId,
                payload: {
                    pubkeyHex: 'ab'.repeat(32),
                    capabilities: ['signEvent'],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(promise).resolves.toBe('ab'.repeat(32));
        expect(service.isConnected()).toBe(true);
        expect(service.getSigner()).not.toBeNull();
    });

    it('rpc.request/rpc.result で signEvent を委譲する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: 'ehagaki.parentClient',
                version: 1,
                type: 'auth.result',
                requestId: authRequest.requestId,
                payload: {
                    pubkeyHex: 'cd'.repeat(32),
                    capabilities: ['signEvent'],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);
        await connectPromise;

        const signPromise = service.signEvent({ kind: 1, content: 'hello', tags: [] });
        const rpcRequest = vi.mocked(parent.postMessage).mock.calls[2][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: 'ehagaki.parentClient',
                version: 1,
                type: 'rpc.result',
                requestId: rpcRequest.requestId,
                payload: {
                    result: {
                        id: 'signed-event',
                        sig: 'signature',
                    },
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(signPromise).resolves.toEqual({
            id: 'signed-event',
            sig: 'signature',
        });
    });

    it('session を保存・復元できる', () => {
        const storage = new MockStorage();
        const session: ParentClientSessionData = {
            version: 1,
            pubkeyHex: 'ef'.repeat(32),
            parentOrigin: 'https://parent.example.com',
            capabilities: ['signEvent'],
            connectedAt: 123,
        };

        ParentClientAuthService.saveSession(storage, session);

        expect(
            ParentClientAuthService.loadSession(storage, session.pubkeyHex),
        ).toEqual(session);
    });
});