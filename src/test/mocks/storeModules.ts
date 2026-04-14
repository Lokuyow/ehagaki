import { vi } from 'vitest';

export function createUploadStoreLocalMock(overrides?: Record<string, any>) {
    const base = {
        uploadAbortFlagStore: {
            value: false,
            set: vi.fn(),
            reset: vi.fn(),
        },
        mediaFreePlacementStore: {
            value: true,
            set: vi.fn(),
        },
    };

    return {
        ...base,
        ...overrides,
        uploadAbortFlagStore: {
            ...base.uploadAbortFlagStore,
            ...(overrides?.uploadAbortFlagStore ?? {}),
        },
        mediaFreePlacementStore: {
            ...base.mediaFreePlacementStore,
            ...(overrides?.mediaFreePlacementStore ?? {}),
        },
    };
}

export const mockAuthStoreModule = {
    updateAuthState: vi.fn(),
    setAuthInitialized: vi.fn(),
    setNsecAuth: vi.fn(),
    setNip07Auth: vi.fn(),
    setNip46Auth: vi.fn(),
    clearAuthState: vi.fn(),
    secretKeyStore: {
        value: null,
        set: vi.fn(),
    },
    accountListStore: {
        value: [],
        set: vi.fn(),
    },
    accountProfileCacheStore: {
        value: new Map(),
        set: vi.fn(),
        setProfile: vi.fn(),
    },
    authState: {
        value: {
            isAuthenticated: true,
            type: 'nsec',
            pubkey: 'testpubkey123',
        },
    },
};

export const mockUploadStoreModule = {
    imageSizeInfoStore: {
        value: { info: null, visible: false },
        set: vi.fn(),
    },
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
        reset: vi.fn(),
    },
    setUploadProgress: vi.fn(),
    resetUploadProgress: vi.fn(),
    sharedMediaErrorStore: {
        value: null,
        set: vi.fn(),
        clear: vi.fn(),
    },
    setSharedMediaError: vi.fn(),
    clearSharedMediaError: vi.fn(),
    resetUploadDisplayState: vi.fn(),
    setVideoCompressionService: vi.fn(),
    getVideoCompressionService: vi.fn(() => null),
    setImageCompressionService: vi.fn(),
    getImageCompressionService: vi.fn(() => null),
    abortAllUploads: vi.fn(),
    videoCompressionProgressStore: {
        value: 0,
        set: vi.fn(),
    },
    imageCompressionProgressStore: {
        value: 0,
        set: vi.fn(),
    },
    uploadAbortFlagStore: {
        value: false,
        set: vi.fn(),
        reset: vi.fn(),
    },
    isUploadingStore: {
        value: false,
        set: vi.fn(),
    },
    mediaFreePlacementStore: {
        value: true,
        set: vi.fn(),
    },
};

export const mockSharedContentStoreModule = {
    sharedMediaStore: {
        files: [],
        metadata: undefined,
        received: false,
    },
    updateSharedMediaStore: vi.fn(),
    clearSharedMediaStore: vi.fn(),
    getSharedMediaFiles: vi.fn(() => []),
    getSharedMediaMetadata: vi.fn(() => undefined),
    urlQueryContentStore: {
        content: null,
        received: false,
    },
    updateUrlQueryContentStore: vi.fn(),
    clearUrlQueryContentStore: vi.fn(),
    isSharedMediaReceived: vi.fn(),
};

mockSharedContentStoreModule.isSharedMediaReceived.mockImplementation(
    () => mockSharedContentStoreModule.sharedMediaStore.received,
);

export const mockSwStoreModule = {
    swNeedRefresh: {
        subscribe: vi.fn(() => () => { }),
    },
    swUpdateServiceWorker: vi.fn(),
    swVersionStore: {
        value: null,
        set: vi.fn(),
    },
    handleSwUpdate: vi.fn(),
    fetchSwVersion: vi.fn(async () => null),
};

export const mockProfileStoreModule = {
    profileDataStore: {
        value: { name: '', picture: '', npub: '', nprofile: '' },
        set: vi.fn(),
    },
    profileLoadedStore: {
        value: false,
        set: vi.fn(),
    },
    isLoadingProfileStore: {
        value: false,
        set: vi.fn(),
    },
};

export const mockRelayStoreModule = {
    writeRelaysStore: {
        value: [],
        set: vi.fn(),
    },
    relayConfigStore: {
        value: null,
        set: vi.fn(),
    },
    showRelaysStore: {
        value: false,
        set: vi.fn(),
    },
    isSwUpdatingStore: {
        value: false,
        set: vi.fn(),
    },
    relayListUpdatedStore: {
        value: 0,
        set: vi.fn(),
    },
    setRelayManager: vi.fn(),
    loadRelayConfigFromStorage: vi.fn(),
    saveRelayConfigToStorage: vi.fn(),
};

export const mockPostUIStoreModule = {
    postComponentUIStore: {
        value: {
            showSecretKeyDialog: false,
            pendingPost: '',
            showImageFullscreen: false,
            fullscreenImageSrc: '',
            fullscreenImageAlt: '',
            showPopupModal: false,
            popupX: 0,
            popupY: 0,
            popupMessage: '',
        },
        showSecretKeyDialog: vi.fn(),
        hideSecretKeyDialog: vi.fn(),
        getPendingPost: vi.fn(() => ''),
        showImageFullscreen: vi.fn(),
        hideImageFullscreen: vi.fn(),
        showPopupMessage: vi.fn(),
        hidePopupMessage: vi.fn(),
    },
};

export const mockThemeStoreModule = {
    darkModeStore: {
        value: false,
        set: vi.fn(),
        reset: vi.fn(),
    },
};