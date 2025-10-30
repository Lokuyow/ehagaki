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
    }
};

export default mockAppStore;