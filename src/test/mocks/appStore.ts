import { vi } from 'vitest';

const mockAppStore = {
    setAuthInitialized: vi.fn(),
    setNsecAuth: vi.fn(),
    setNostrLoginAuth: vi.fn(),
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
    updateSharedImageStore: vi.fn(),
    clearSharedImageStore: vi.fn(),
    getSharedImageFile: vi.fn(() => null),
    getSharedImageMetadata: vi.fn(() => undefined),
    showImageSizeInfo: vi.fn(),
    setVideoCompressionService: vi.fn(),
    setImageCompressionService: vi.fn(),
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
    // メディア下部固定モード
    mediaBottomModeStore: {
        value: false,
        set: vi.fn()
    }
};

export default mockAppStore;