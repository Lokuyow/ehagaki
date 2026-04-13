import { vi } from 'vitest';

const mockAppStore = {
    setAuthInitialized: vi.fn(),
    setNsecAuth: vi.fn(),
    setNip07Auth: vi.fn(),
    setNip46Auth: vi.fn(),
    clearAuthState: vi.fn(),
    secretKeyStore: {
        value: null,
        set: vi.fn()
    },
    authState: {
        value: {
            isAuthenticated: true,
            type: "nsec",
            pubkey: "testpubkey123"
        }
    },
    updateSharedMediaStore: vi.fn(),
    clearSharedMediaStore: vi.fn(),
    getSharedMediaFiles: vi.fn(() => []),
    getSharedMediaMetadata: vi.fn(() => undefined),
    setImageSizeInfoFromFileSize: vi.fn(),
    uploadProgressStore: {
        value: {
            total: 0,
            completed: 0,
            failed: 0,
            aborted: 0,
            inProgress: false,
        },
        set: vi.fn(),
        reset: vi.fn()
    },
    setUploadProgress: vi.fn(),
    resetUploadProgress: vi.fn(),
    sharedMediaErrorStore: {
        value: null,
        set: vi.fn(),
        clear: vi.fn()
    },
    setSharedMediaError: vi.fn(),
    clearSharedMediaError: vi.fn(),
    resetUploadDisplayState: vi.fn(),
    setVideoCompressionService: vi.fn(),
    setImageCompressionService: vi.fn(),
    videoCompressionProgressStore: {
        value: 0,
        set: vi.fn()
    },
    imageCompressionProgressStore: {
        value: 0,
        set: vi.fn()
    },
    uploadAbortFlagStore: {
        value: false,
        set: vi.fn(),
        reset: vi.fn()
    },
    // リレー関連のストア
    writeRelaysStore: {
        value: [],
        set: vi.fn()
    },
    relayListUpdatedStore: {
        value: 0,
        set: vi.fn()
    },
    profileDataStore: {
        value: { name: '', picture: '', npub: '', nprofile: '' },
        set: vi.fn()
    },
    profileLoadedStore: {
        value: false,
        set: vi.fn()
    },
    isLoadingProfileStore: {
        value: false,
        set: vi.fn()
    },
    isUploadingStore: {
        value: false,
        set: vi.fn()
    },
    // リレー設定保存関数
    saveRelayConfigToStorage: vi.fn(),
    // メディア自由配置モード
    mediaFreePlacementStore: {
        value: true,
        set: vi.fn()
    }
};

export default mockAppStore;