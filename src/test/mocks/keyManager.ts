import { vi } from 'vitest';

const mockKeyManager = {
    keyManager: {
        isValidNsec: vi.fn(),
        saveToStorage: vi.fn(),
        derivePublicKey: vi.fn(),
        loadFromStorage: vi.fn(),
        pubkeyToNpub: vi.fn(),
        getFromStore: vi.fn(),
        hasStoredKey: vi.fn().mockReturnValue(false)
    },
    KeyManager: vi.fn().mockImplementation(() => ({
        isValidNsec: vi.fn(),
        saveToStorage: vi.fn(),
        derivePublicKey: vi.fn(),
        loadFromStorage: vi.fn(),
        pubkeyToNpub: vi.fn(),
        getFromStore: vi.fn(),
        hasStoredKey: vi.fn().mockReturnValue(false),
        isWindowNostrAvailable: vi.fn().mockReturnValue(false),
        getPublicKeyFromWindowNostr: vi.fn()
    })),
    ExternalAuthChecker: vi.fn().mockImplementation((win?: Window) => ({
        isWindowNostrAvailable: vi.fn().mockImplementation(() => {
            if (!win) return false;
            return 'nostr' in (win as any) &&
                typeof (win as any).nostr === 'object' &&
                (win as any).nostr !== null &&
                typeof (win as any).nostr.getPublicKey === 'function';
        }),
        getPublicKeyFromWindowNostr: vi.fn()
    })),
    PublicKeyState: vi.fn().mockImplementation(() => {
        let _currentIsValid = false;
        let _currentIsNostrLogin = false;
        let _currentHex = '';

        return {
            setNsec: vi.fn((nsec) => {
                // 簡易的な実装（テスト用）
                if (nsec && nsec.startsWith('nsec')) {
                    _currentIsValid = true;
                    _currentHex = 'test-hex';
                    _currentIsNostrLogin = false;
                } else {
                    _currentIsValid = false;
                    _currentHex = '';
                }
            }),
            setNostrLoginAuth: vi.fn((auth) => {
                if (auth.type === 'login' && auth.pubkey) {
                    _currentIsValid = true;
                    _currentHex = auth.pubkey;
                    _currentIsNostrLogin = true;
                } else if (auth.type === 'logout') {
                    _currentIsValid = false;
                    _currentHex = '';
                    _currentIsNostrLogin = false;
                }
            }),
            clear: vi.fn(() => {
                _currentIsValid = false;
                _currentIsNostrLogin = false;
                _currentHex = '';
            }),
            get currentIsValid() {
                return _currentIsValid;
            },
            get currentIsNostrLogin() {
                return _currentIsNostrLogin;
            },
            get currentHex() {
                return _currentHex;
            }
        };
    })
};

export default mockKeyManager;