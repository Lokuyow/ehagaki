import { vi } from 'vitest';

vi.mock('nip07-awaiter', () => ({
    waitNostr: vi.fn().mockResolvedValue(undefined),
    getNostr: vi.fn().mockReturnValue(undefined),
    isNostr: vi.fn().mockReturnValue(false),
}));

vi.mock('../../lib/nip46Service', () => ({
    nip46Service: {
        connect: vi.fn(),
        reconnect: vi.fn(),
        disconnect: vi.fn().mockResolvedValue(undefined),
        isConnected: vi.fn().mockReturnValue(false),
        getSigner: vi.fn().mockReturnValue(null),
        getUserPubkey: vi.fn().mockReturnValue(null),
        saveSession: vi.fn(),
    },
    Nip46Service: {
        loadSession: vi.fn().mockReturnValue(null),
        clearSession: vi.fn(),
    },
    BUNKER_REGEX: /^bunker:\/\/[0-9a-f]{64}\??[?\/\w:.=&%-]*$/,
}));

vi.mock('../../lib/parentClientAuthService', () => ({
    parentClientAuthService: {
        initialize: vi.fn().mockReturnValue(false),
        isAvailable: vi.fn().mockReturnValue(false),
        announceReady: vi.fn().mockReturnValue(true),
        connect: vi.fn(),
        reconnect: vi.fn(),
        disconnect: vi.fn(),
        isConnected: vi.fn().mockReturnValue(false),
        getSigner: vi.fn().mockReturnValue(null),
        getUserPubkey: vi.fn().mockReturnValue(null),
        getSessionData: vi.fn().mockReturnValue(null),
    },
    ParentClientAuthService: {
        loadSession: vi.fn().mockReturnValue(null),
        saveSession: vi.fn(),
        clearSession: vi.fn(),
    },
    DEFAULT_PARENT_CLIENT_CAPABILITIES: [
        'signEvent',
        'nip04.encrypt',
        'nip04.decrypt',
        'nip44.encrypt',
        'nip44.decrypt',
    ],
}));