import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    DEFAULT_PARENT_CLIENT_CAPABILITIES,
    ParentClientAuthService,
} from '../../lib/parentClientAuthService';
import { STORAGE_KEYS } from '../../lib/constants';
import type { ParentClientSessionData } from '../../lib/types';
import { createMockConsole, type MockConsole, MockStorage } from '../helpers';
import { EMBED_MESSAGE_NAMESPACE } from '../../lib/embedProtocol';
import { createMockWindow } from '../embedWindowTestUtils';

function dispatchParentMessage(
    listeners: Map<string, (event: MessageEvent) => void>,
    parent: { postMessage: ReturnType<typeof vi.fn> },
    type: string,
    requestId: string,
    payload: unknown,
): void {
    listeners.get('message')?.({
        data: {
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: 1,
            type,
            requestId,
            payload,
        },
        origin: 'https://parent.example.com',
        source: parent,
    } as unknown as MessageEvent);
}

describe('ParentClientAuthService', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
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
                namespace: EMBED_MESSAGE_NAMESPACE,
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
                namespace: EMBED_MESSAGE_NAMESPACE,
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
                namespace: EMBED_MESSAGE_NAMESPACE,
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

    it('auth pending への rpc.result は protocol error で reject し、後続の auth.result を無視する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        dispatchParentMessage(listeners, parent, 'rpc.result', authRequest.requestId, {
            result: {
                id: 'wrong-family-result',
                sig: 'wrong-family-signature',
            },
        });

        await expect(connectPromise).rejects.toThrow('parent_client_invalid_response');
        expect(service.isConnected()).toBe(false);

        dispatchParentMessage(listeners, parent, 'auth.result', authRequest.requestId, {
            pubkeyHex: 'ab'.repeat(32),
            capabilities: ['signEvent'],
        });

        expect(service.isConnected()).toBe(false);
    });

    it('auth pending への rpc.error は error code/message を伝播せず cleanup する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        dispatchParentMessage(listeners, parent, 'rpc.error', authRequest.requestId, {
            code: 'wrong_rpc_code',
            message: 'wrong rpc message',
        });

        await expect(connectPromise).rejects.toThrow('parent_client_invalid_response');
        expect(service.isConnected()).toBe(false);

        dispatchParentMessage(listeners, parent, 'auth.result', authRequest.requestId, {
            pubkeyHex: 'cd'.repeat(32),
            capabilities: ['signEvent'],
        });

        expect(service.isConnected()).toBe(false);
    });

    it('rpc pending への auth.result は protocol error で reject し、後続の rpc.result を無視する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        dispatchParentMessage(listeners, parent, 'auth.result', authRequest.requestId, {
            pubkeyHex: 'ef'.repeat(32),
            capabilities: ['signEvent'],
        });
        await connectPromise;
        const sessionBeforeRpc = service.getSessionData();

        const rpcPromise = service.signEvent({ kind: 1, content: 'hello', tags: [] });
        const rpcRequest = vi.mocked(parent.postMessage).mock.calls[2][0] as any;
        dispatchParentMessage(listeners, parent, 'auth.result', rpcRequest.requestId, {
            pubkeyHex: '12'.repeat(32),
            capabilities: ['signEvent'],
        });

        await expect(rpcPromise).rejects.toThrow('parent_client_invalid_response');
        expect(service.getSessionData()).toEqual(sessionBeforeRpc);

        dispatchParentMessage(listeners, parent, 'rpc.result', rpcRequest.requestId, {
            result: {
                id: 'late-result',
                sig: 'late-signature',
            },
        });

        expect(service.getSessionData()).toEqual(sessionBeforeRpc);
    });

    it('rpc pending への auth.error は error code/message を伝播せず cleanup する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        dispatchParentMessage(listeners, parent, 'auth.result', authRequest.requestId, {
            pubkeyHex: '34'.repeat(32),
            capabilities: ['signEvent'],
        });
        await connectPromise;

        const rpcPromise = service.signEvent({ kind: 1, content: 'hello', tags: [] });
        const rpcRequest = vi.mocked(parent.postMessage).mock.calls[2][0] as any;
        dispatchParentMessage(listeners, parent, 'auth.error', rpcRequest.requestId, {
            code: 'wrong_auth_code',
            message: 'wrong auth message',
        });

        await expect(rpcPromise).rejects.toThrow('parent_client_invalid_response');
        expect(service.isConnected()).toBe(true);

        dispatchParentMessage(listeners, parent, 'rpc.result', rpcRequest.requestId, {
            result: {
                id: 'late-result',
                sig: 'late-signature',
            },
        });

        expect(service.isConnected()).toBe(true);
    });

    it('rpc.error は同familyの error code/message を維持する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        dispatchParentMessage(listeners, parent, 'auth.result', authRequest.requestId, {
            pubkeyHex: '56'.repeat(32),
            capabilities: ['signEvent'],
        });
        await connectPromise;

        const rpcPromise = service.signEvent({ kind: 1, content: 'hello', tags: [] });
        const rpcRequest = vi.mocked(parent.postMessage).mock.calls[2][0] as any;
        dispatchParentMessage(listeners, parent, 'rpc.error', rpcRequest.requestId, {
            code: 'rpc_failed',
            message: 'rpc failed',
        });

        await expect(rpcPromise).rejects.toThrow('rpc failed');
    });

    it('response 未着時は通常どおり timeout で reject する', async () => {
        vi.useFakeTimers();
        try {
            const { windowObj } = createMockWindow();
            const service = new ParentClientAuthService(windowObj, mockConsole);
            const connectPromise = service.connect({ timeoutMs: 100 });
            const timeoutExpectation = expect(connectPromise).rejects.toThrow('parent_client_timeout');

            await vi.advanceTimersByTimeAsync(100);

            await timeoutExpectation;
            expect(service.isConnected()).toBe(false);
        } finally {
            vi.useRealTimers();
        }
    });

    it('capabilities 未指定時は signEvent のみを既定要求する', () => {
        const { windowObj, parent } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        void service.connect({ timeoutMs: 1 }).catch(() => undefined);

        const readyMessage = vi.mocked(parent.postMessage).mock.calls[0][0] as any;
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;

        expect(DEFAULT_PARENT_CLIENT_CAPABILITIES).toEqual(['signEvent']);
        expect(readyMessage.payload.capabilities).toEqual(['signEvent']);
        expect(authRequest.payload.capabilities).toEqual(['signEvent']);
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

    it('旧 session に残る nip04 capability は読み飛ばして復元する', () => {
        const storage = new MockStorage();
        const pubkeyHex = '12'.repeat(32);

        storage.setItem(
            STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + pubkeyHex,
            JSON.stringify({
                version: 1,
                pubkeyHex,
                parentOrigin: 'https://parent.example.com',
                capabilities: ['signEvent', 'nip04.encrypt', 'nip44.encrypt'],
                connectedAt: 123,
            }),
        );

        expect(ParentClientAuthService.loadSession(storage, pubkeyHex)).toEqual({
            version: 1,
            pubkeyHex,
            parentOrigin: 'https://parent.example.com',
            capabilities: ['signEvent', 'nip44.encrypt'],
            connectedAt: 123,
        });
    });

    it('auth.error を受け取ると接続要求を明示的な認証エラーとして reject する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const promise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.error',
                requestId: authRequest.requestId,
                payload: {
                    code: 'parent_client_not_logged_in',
                    message: 'parent_client_not_logged_in',
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(promise).rejects.toThrow('parent_client_not_logged_in');
        expect(service.isConnected()).toBe(false);
    });

    it('要求していない capability を含む auth.result を reject する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const promise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.result',
                requestId: authRequest.requestId,
                payload: {
                    pubkeyHex: 'ab'.repeat(32),
                    capabilities: ['signEvent', 'nip44.encrypt'],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(promise).rejects.toThrow('parent_client_invalid_response');
    });

    it('malformed な rpc.result を reject する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
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
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'rpc.result',
                requestId: rpcRequest.requestId,
                payload: {
                    result: {
                        id: 'signed-event',
                    },
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        await expect(signPromise).rejects.toThrow('parent_client_invalid_response');
    });

    it('requestId がない auth.result は warn して無視する', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);

        const promise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.result',
                payload: {
                    pubkeyHex: 'ab'.repeat(32),
                    capabilities: ['signEvent'],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(mockConsole.warn).toHaveBeenCalled();
        expect(service.isConnected()).toBe(false);

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
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
    });

    it('auth.logout を受け取ると remote logout listener が呼ばれる', async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);
        const onRemoteLogout = vi.fn();
        service.onRemoteLogout(onRemoteLogout);

        const connectPromise = service.connect({ capabilities: ['signEvent'] });
        const authRequest = vi.mocked(parent.postMessage).mock.calls[1][0] as any;
        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.result',
                requestId: authRequest.requestId,
                payload: {
                    pubkeyHex: 'aa'.repeat(32),
                    capabilities: ['signEvent'],
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);
        await connectPromise;

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.logout',
                payload: {
                    pubkeyHex: 'aa'.repeat(32),
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteLogout).toHaveBeenCalledWith('aa'.repeat(32));
        expect(service.isConnected()).toBe(false);
    });

    it('auth.login を受け取ると remote login listener が呼ばれる', () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new ParentClientAuthService(windowObj, mockConsole);
        const onRemoteLogin = vi.fn();
        service.onRemoteLogin(onRemoteLogin);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'auth.login',
                payload: {
                    pubkeyHex: 'bb'.repeat(32),
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteLogin).toHaveBeenCalledWith('bb'.repeat(32));
    });
});
