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
    KeyManager: vi.fn().mockImplementation(function () {
        return {
        isValidNsec: vi.fn(),
        saveToStorage: vi.fn(),
        derivePublicKey: vi.fn(),
        loadFromStorage: vi.fn(),
        pubkeyToNpub: vi.fn(),
        getFromStore: vi.fn(),
        hasStoredKey: vi.fn().mockReturnValue(false),
        isWindowNostrAvailable: vi.fn().mockReturnValue(false),
        getPublicKeyFromWindowNostr: vi.fn()
        };
    }),
    ExternalAuthChecker: vi.fn().mockImplementation(function (win?: Window) {
        return {
            isWindowNostrAvailable: vi.fn().mockImplementation(() => {
                if (!win) return false;
                return 'nostr' in (win as any) &&
                    typeof (win as any).nostr === 'object' &&
                    (win as any).nostr !== null &&
                    typeof (win as any).nostr.getPublicKey === 'function';
            }),
            getPublicKeyFromWindowNostr: vi.fn()
        };
    }),
    PublicKeyState: vi.fn().mockImplementation(function () {
        let _currentIsValid = false;
        let _currentHex = '';
        let _currentNsec = '';
        let _currentNpub = '';
        let _currentNprofile = '';

        return {
            setNsec: vi.fn((nsec) => {
                _currentNsec = nsec ?? '';
                // 簡易的な実装（テスト用）
                if (nsec && nsec.startsWith('nsec')) {
                    _currentIsValid = true;
                    _currentHex = '00'.repeat(32);
                    _currentNpub = 'npub1' + '00'.repeat(32).slice(0, 10) + '...';
                    _currentNprofile = 'nprofile1' + '00'.repeat(32).slice(0, 10) + '...';
                } else {
                    _currentIsValid = false;
                    _currentHex = '';
                    _currentNpub = '';
                    _currentNprofile = '';
                }
            }),
            clear: vi.fn(() => {
                _currentNsec = '';
                _currentIsValid = false;
                _currentHex = '';
                _currentNpub = '';
                _currentNprofile = '';
            }),
            get currentIsValid() {
                return _currentIsValid;
            },
            get currentHex() {
                return _currentHex;
            },
            get isValid() {
                return _currentIsValid;
            },
            get hex() {
                return _currentHex;
            },
            get nsec() {
                return _currentNsec;
            },
            get npub() {
                return _currentNpub;
            },
            get nprofile() {
                return _currentNprofile;
            },
            get data() {
                return {
                    hex: _currentHex,
                    npub: _currentNpub,
                    nprofile: _currentNprofile,
                };
            }
        };
    })
};

export default mockKeyManager;
