import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

import { expectConsoleCallsNotToContain } from '../logAssertions';

const mockPool = {
    ensureRelay: vi.fn().mockResolvedValue({}),
    destroy: vi.fn(),
};
const mockUseWebSocketImplementation = vi.fn();
const mockParseBunkerInput = vi.fn();
const mockSigner = {
    sendRequest: vi.fn().mockResolvedValue('ok'),
    getPublicKey: vi.fn().mockResolvedValue('b'.repeat(64)),
    close: vi.fn().mockResolvedValue(undefined),
};

vi.mock('nostr-tools', () => ({
    kinds: { NostrConnect: 24133 },
    nip44: {
        getConversationKey: vi.fn(() => new Uint8Array([1])),
        decrypt: vi.fn(),
    },
    utils: {
        normalizeURL: vi.fn((url: string) => url),
    },
}));

vi.mock('nostr-tools/nip46', () => ({
    BunkerSigner: {
        fromBunker: vi.fn(() => mockSigner),
    },
    BUNKER_REGEX: /^bunker:\/\//,
    createNostrConnectURI: vi.fn(),
    parseBunkerInput: mockParseBunkerInput,
}));

vi.mock('nostr-tools/pool', () => ({
    SimplePool: vi.fn(function () {
        return mockPool;
    }),
    useWebSocketImplementation: mockUseWebSocketImplementation,
}));

vi.mock('nostr-tools/utils', () => ({
    bytesToHex: vi.fn(() => 'a'.repeat(64)),
    hexToBytes: vi.fn(() => new Uint8Array(32)),
}));

vi.mock('nostr-tools/pure', () => ({
    generateSecretKey: vi.fn(() => new Uint8Array(32)),
    getPublicKey: vi.fn(() => 'c'.repeat(64)),
}));

class FakeWebSocket extends EventTarget {
    readonly sent: unknown[] = [];

    constructor(
        readonly url: string | URL,
        readonly protocols?: string | string[],
    ) {
        super();
    }

    send(data: unknown): void {
        this.sent.push(data);
    }
}

describe('NIP-46 WebSocket logging', () => {
    let Nip46Service: typeof import('../../lib/nip46Service').Nip46Service;
    let webSocketImplementation: new (
        url: string | URL,
        protocols?: string | string[],
    ) => FakeWebSocket;

    beforeAll(async () => {
        vi.stubGlobal('WebSocket', FakeWebSocket);
        ({ Nip46Service } = await import('../../lib/nip46Service'));
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it('受信本文・送信本文・close reason・URLをログへ渡さない', async () => {
        mockParseBunkerInput.mockResolvedValueOnce({
            pubkey: 'd'.repeat(64),
            relays: ['wss://relay.example.com'],
            secret: 'bunker-secret',
        });
        mockSigner.sendRequest.mockImplementation((method: string) =>
            method === 'get_public_key' ? 'b'.repeat(64) : 'ok');
        const service = new Nip46Service();
        await service.connect('bunker://ignored');

        webSocketImplementation = mockUseWebSocketImplementation.mock.calls
            .map(([implementation]) => implementation)
            .find((implementation) => implementation?.name === 'Nip46WebSocket');
        expect(webSocketImplementation).toBeDefined();

        const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => { });
        const socket = new webSocketImplementation('wss://secret-relay.example.com');
        const sentinel = 'encrypted-nip46-frame-secret';
        socket.dispatchEvent(new Event('message'));
        const closeEvent = new Event('close');
        Object.defineProperties(closeEvent, {
            code: { value: 4001 },
            reason: { value: sentinel },
        });
        socket.dispatchEvent(closeEvent);
        socket.send(JSON.stringify({ secret: sentinel, content: sentinel }));

        try {
            expect(debugSpy).toHaveBeenCalledWith(
                '[NIP-46 WS] receive',
                { direction: 'inbound' },
            );
            expect(debugSpy).toHaveBeenCalledWith(
                '[NIP-46 WS] close',
                { direction: 'transport', closeCode: 4001 },
            );
            expect(debugSpy).toHaveBeenCalledWith(
                '[NIP-46 WS] send',
                { direction: 'outbound' },
            );
            expectConsoleCallsNotToContain([debugSpy], [
                sentinel,
                'secret-relay.example.com',
            ]);
        } finally {
            debugSpy.mockRestore();
            await service.disconnect();
        }
    });
});
