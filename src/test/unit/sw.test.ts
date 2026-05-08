import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getProfilePictureCacheKeyUrl,
    normalizeProfilePictureUrl,
} from '../../lib/profilePictureUrlUtils';
import { dispatchServiceWorkerFetchRoute } from '../../lib/swFetchDispatchUtils';
import { logServiceWorkerFetchRoute } from '../../lib/swFetchRouteLogUtils';
import {
    processServiceWorkerActivate,
    processServiceWorkerInstall,
} from '../../lib/swLifecycleUtils';
import { processServiceWorkerMessageEvent } from '../../lib/swMessageDispatchUtils';
import {
    cacheCustomEmojiImagesBatch,
    cacheOpaqueCustomEmojiImage,
} from '../../lib/swCustomEmojiCacheUtils';
import {
    focusAndNotifySharedClient,
    openNewSharedClientWindow,
    redirectToAvailableSharedClient,
} from '../../lib/swClientUtils';
import { resolveCustomEmojiImageRequestResponse } from '../../lib/swCustomEmojiRequestUtils';
import { findProfileImageCacheMatch } from '../../lib/swProfileImageCacheUtils';
import {
    fetchAndCacheOpaqueProfileImageResponse,
    fetchAndCacheProfileImageResponse,
} from '../../lib/swProfileImageFetchUtils';
import {
    processServiceWorkerProfileImageRequest,
} from '../../lib/swProfileImageRequestUtils';
import {
    cleanupServiceWorkerDuplicateProfileCache,
    clearServiceWorkerProfileCache,
} from '../../lib/swProfileCacheActionUtils';
import {
    createClearSharedMediaDbOperation,
    createPutSharedMediaDbOperation,
    executeServiceWorkerIndexedDbOperation,
} from '../../lib/swIndexedDbOperationUtils';
import { ensureCurrentEHagakiDbSchema } from '../../lib/swIndexedDbSchema';
import { resolveServiceWorkerFetchRoute } from '../../lib/swRoutingUtils';
import { postServiceWorkerSharedMediaResponse } from '../../lib/swSharedMediaResponseUtils';
import { persistSharedMediaIndexedDbRecord } from '../../lib/swSharedMediaPersistence';
import {
    summarizeExtractedSharedMedia,
} from '../../lib/swUploadRequestUtils';
import {
    createCorsRequest,
    createServiceWorkerRedirectResponse,
    createTransparentImageResponse,
    extractSharedMediaFromFormData,
} from '../../lib/swUtilities';
import { processServiceWorkerUploadRequest } from '../../lib/swUploadRequestUtils';

// Service Workerのモジュール型定義
interface ServiceWorkerModule {
    ServiceWorkerCore: any;
    ServiceWorkerState: any;
    ServiceWorkerDependencies: any;
    Utilities: any;
    IndexedDBManager: any;
    CacheManager: any;
    ClientManager: any;
    MessageHandler: any;
    RequestHandler: any;
    SW_VERSION: string;
    RUNTIME_LARGE_ASSET_CACHE_NAME: string;
    CUSTOM_EMOJI_CACHE_NAME: string;
    PROFILE_CACHE_NAME: string;
    INDEXEDDB_NAME: string;
    INDEXEDDB_VERSION: number;
    SHARED_MEDIA_STORE_NAME: string;
    SHARED_MEDIA_RECORD_ID: string;
}

// モック用のService Workerモジュールを作成
const createServiceWorkerMocks = (): ServiceWorkerModule => {
    // グローバル変数のモック
    const mockSelf = {
        __WB_MANIFEST: [],
        caches: {
            open: vi.fn(),
            keys: vi.fn(),
            delete: vi.fn(),
            match: vi.fn()
        },
        indexedDB: {
            open: vi.fn()
        },
        clients: {
            matchAll: vi.fn(),
            claim: vi.fn(),
            openWindow: vi.fn()
        },
        fetch: vi.fn(),
        console: {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn()
        },
        location: {
            origin: 'https://example.com'
        },
        navigator: {
            onLine: true
        },
        setTimeout: vi.fn(),
        skipWaiting: vi.fn(),
        addEventListener: vi.fn()
    };

    // Service Worker実装をここに組み込み（実際のコードから抽出）
    const SW_VERSION = '1.3.0';
    const LEGACY_PRECACHE_PREFIX = 'ehagaki-cache-';
    const PROFILE_CACHE_NAME = 'ehagaki-profile-images-v2';
    const LEGACY_PROFILE_CACHE_NAMES = ['ehagaki-profile-images'];
    const CUSTOM_EMOJI_CACHE_NAME = 'ehagaki-custom-emoji-images-v2';
    const LEGACY_CUSTOM_EMOJI_CACHE_NAMES = ['ehagaki-custom-emoji-images'];
    const RUNTIME_LARGE_ASSET_CACHE_NAME = 'ehagaki-runtime-large-assets';
    const INDEXEDDB_NAME = 'eHagakiDB';
    const INDEXEDDB_VERSION = 5;
    const SHARED_MEDIA_STORE_NAME = 'sharedMedia';
    const SHARED_MEDIA_RECORD_ID = 'latest';
    const SHARED_MEDIA_SCHEMA_VERSION = 1;
    const CUSTOM_EMOJI_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
    const MAX_INDEXEDDB_FILE_SIZE = 100 * 1024 * 1024;

    const ServiceWorkerState = {
        sharedMediaCache: null,
        getSharedMediaCache() { return this.sharedMediaCache; },
        setSharedMediaCache(data: any) { this.sharedMediaCache = data; },
        clearSharedMediaCache() { this.sharedMediaCache = null; }
    };

    const ServiceWorkerDependencies = {
        caches: mockSelf.caches,
        indexedDB: mockSelf.indexedDB,
        clients: mockSelf.clients,
        fetch: mockSelf.fetch,
        console: mockSelf.console,
        location: mockSelf.location,
        navigator: mockSelf.navigator,
        setTimeout: mockSelf.setTimeout
    };

    const Utilities = {
        createTransparentImageResponse(statusCode = 200) {
            return createTransparentImageResponse(statusCode);
        },

        createCorsRequest(url: string, options = {}) {
            return createCorsRequest(url, options);
        },

        getBaseUrl(url: string) {
            return getProfilePictureCacheKeyUrl(url, {
                currentOrigin: ServiceWorkerDependencies.location.origin
            });
        },

        createRedirectResponse(path: string = '/', error: string | null = null, location = ServiceWorkerDependencies.location) {
            return createServiceWorkerRedirectResponse({
                path,
                error,
                location,
            });
        },

        isUploadRequest(request: Request, url: URL) {
            return request.method === 'POST' &&
                (url.pathname.endsWith('/upload') || url.pathname.includes('/upload'));
        },

        isProfileImageRequest(request: Request) {
            if (request.method !== 'GET') return false;
            const url = new URL(request.url);
            return url.searchParams.get('profile') === 'true';
        },

        normalizeProfileImageUrl(url: string) {
            return normalizeProfilePictureUrl(url, {
                currentOrigin: ServiceWorkerDependencies.location.origin
            });
        },

        async isCacheableCustomEmojiResponse(response: Response) {
            if (!response || !response.ok || response.type === 'opaque') return false;

            const contentType = response.headers.get('Content-Type') || '';
            if (!contentType.toLowerCase().startsWith('image/')) return false;

            const contentLength = Number(response.headers.get('Content-Length'));
            if (Number.isFinite(contentLength) && contentLength > CUSTOM_EMOJI_MAX_IMAGE_BYTES) {
                return false;
            }

            try {
                const blob = await response.clone().blob();
                return blob.size <= CUSTOM_EMOJI_MAX_IMAGE_BYTES;
            } catch {
                return false;
            }
        },

        async extractMediaFromFormData(formData: FormData) {
            return await extractSharedMediaFromFormData(formData);
        }
    };

    class IndexedDBManager {
        constructor(public dependencies = ServiceWorkerDependencies) { }

        async executeOperation(operation: any) {
            const mockRequest = {
                onupgradeneeded: null as any,
                onerror: null as any,
                onsuccess: null as any,
            };
            const createStoreRequest = () => {
                const request = { onsuccess: null as (() => void) | null };
                queueMicrotask(() => {
                    request.onsuccess?.();
                });
                return request;
            };
            const mockDb = {
                objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
                createObjectStore: vi.fn(),
                transaction: vi.fn().mockReturnValue({
                    objectStore: vi.fn().mockReturnValue({
                        put: vi.fn().mockImplementation(() => createStoreRequest()),
                        delete: vi.fn().mockImplementation(() => createStoreRequest()),
                    }),
                    onerror: null,
                }),
                close: vi.fn(),
            };

            queueMicrotask(() => {
                mockRequest.onupgradeneeded?.({ target: { result: mockDb } });
                mockRequest.onsuccess?.({ target: { result: mockDb } });
            });

            return await executeServiceWorkerIndexedDbOperation({
                indexedDb: {
                    open: (dbName: string, dbVersion: number) => {
                        this.dependencies.indexedDB.open(dbName, dbVersion);
                        return mockRequest;
                    },
                },
                dbName: INDEXEDDB_NAME,
                dbVersion: INDEXEDDB_VERSION,
                onUpgradeNeeded: (db: any) => {
                    ensureCurrentEHagakiDbSchema(db, SHARED_MEDIA_STORE_NAME);
                },
                operation,
            });
        }

        async putSharedMedia(record: any) {
            return await this.executeOperation(
                createPutSharedMediaDbOperation({
                    storeName: SHARED_MEDIA_STORE_NAME,
                    record,
                }),
            );
        }

        async clearSharedMedia() {
            try {
                await this.executeOperation(
                    createClearSharedMediaDbOperation({
                        storeName: SHARED_MEDIA_STORE_NAME,
                        recordId: SHARED_MEDIA_RECORD_ID,
                    }),
                );
            } catch (error) {
                this.dependencies.console.error('IndexedDB error:', error);
            }
        }
    }

    class CacheManager {
        constructor(public dependencies = ServiceWorkerDependencies) { }

        async cleanupOldCaches() {
            const cacheNames = [
                'old-cache-1',
                `${LEGACY_PRECACHE_PREFIX}1.2.0`,
                LEGACY_PROFILE_CACHE_NAMES[0],
                LEGACY_CUSTOM_EMOJI_CACHE_NAMES[0],
                PROFILE_CACHE_NAME,
                RUNTIME_LARGE_ASSET_CACHE_NAME,
                'workbox-precache-v2-example'
            ];
            this.dependencies.caches.keys.mockResolvedValue(cacheNames);
            this.dependencies.caches.delete.mockResolvedValue(true);

            // 実際にメソッド呼び出しを実行
            await this.dependencies.caches.keys();

            const toDelete = cacheNames.filter(name =>
                name.startsWith(LEGACY_PRECACHE_PREFIX) ||
                LEGACY_PROFILE_CACHE_NAMES.includes(name) ||
                LEGACY_CUSTOM_EMOJI_CACHE_NAMES.includes(name)
            );

            await Promise.all(toDelete.map(name => this.dependencies.caches.delete(name)));
        }

        async clearProfileCache() {
            return await clearServiceWorkerProfileCache({
                cacheStorage: this.dependencies.caches,
                cacheName: PROFILE_CACHE_NAME,
                logger: this.dependencies.console,
            });
        }

        async cleanupDuplicateProfileCache() {
            return await cleanupServiceWorkerDuplicateProfileCache({
                cacheStorage: this.dependencies.caches,
                cacheName: PROFILE_CACHE_NAME,
                logger: this.dependencies.console,
                getBaseUrl: Utilities.getBaseUrl,
            });
        }

        async handleProfileImageCache(request: Request) {
            const cache = await this.dependencies.caches.open(PROFILE_CACHE_NAME);
            const cachedMatch = await findProfileImageCacheMatch({
                request,
                cache,
                getBaseUrl: Utilities.getBaseUrl,
                createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            });

            return cachedMatch?.response ?? null;
        }

        async fetchAndCacheOpaqueProfileImage(baseUrl: string) {
            return await fetchAndCacheOpaqueProfileImageResponse({
                baseUrl,
                cacheStorage: this.dependencies.caches,
                cacheName: PROFILE_CACHE_NAME,
                fetchRequest: (request) => this.dependencies.fetch(request),
                createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
                logger: this.dependencies.console,
            });
        }

        async fetchAndCacheProfileImage(request: Request) {
            return await fetchAndCacheProfileImageResponse({
                request,
                isOnline: this.dependencies.navigator?.onLine,
                normalizeProfileImageUrl: Utilities.normalizeProfileImageUrl,
                getBaseUrl: Utilities.getBaseUrl,
                createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
                fetchRequest: (targetRequest) => this.dependencies.fetch(targetRequest),
                cacheStorage: this.dependencies.caches,
                cacheName: PROFILE_CACHE_NAME,
                fetchOpaqueProfileImage: (baseUrl) => this.fetchAndCacheOpaqueProfileImage(baseUrl),
                logger: this.dependencies.console,
            });
        }

        async handleCustomEmojiImageRequest(request: Request) {
            try {
                const cache = await this.dependencies.caches.open(CUSTOM_EMOJI_CACHE_NAME);
                return await resolveCustomEmojiImageRequestResponse({
                    request,
                    cache,
                    getBaseUrl: Utilities.getBaseUrl,
                    createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
                    fetchRequest: (targetRequest) => this.dependencies.fetch(targetRequest),
                });
            } catch {
                return this.dependencies.fetch(request);
            }
        }

        async cacheOpaqueCustomEmojiImage(cache: any, baseUrl: string) {
            return await cacheOpaqueCustomEmojiImage({
                cache,
                baseUrl,
                fetchRequest: (request) => this.dependencies.fetch(request),
                createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            });
        }

        async cacheCustomEmojiImages(urls: string[] | undefined) {
            return await cacheCustomEmojiImagesBatch({
                urls,
                cacheStorage: this.dependencies.caches,
                cacheName: CUSTOM_EMOJI_CACHE_NAME,
                fetchRequest: (request) => this.dependencies.fetch(request),
                createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
                getBaseUrl: Utilities.getBaseUrl,
                isCacheableCustomEmojiResponse: (response) =>
                    Utilities.isCacheableCustomEmojiResponse(response),
                cacheOpaqueImage: (cache, baseUrl) => this.cacheOpaqueCustomEmojiImage(cache, baseUrl),
                logger: this.dependencies.console,
            });
        }
    }

    class ClientManager {
        constructor(public dependencies = ServiceWorkerDependencies) { }

        async redirectClient() {
            return await redirectToAvailableSharedClient({
                clientSet: this.dependencies.clients,
                focusAndNotifyClient: (client) => this.focusAndNotifyClient(client),
                openNewClient: () => this.openNewClient(),
                logger: this.dependencies.console,
                createErrorRedirectResponse: () =>
                    Utilities.createRedirectResponse('/', 'client-error', this.dependencies.location),
            });
        }

        async focusAndNotifyClient(client: any) {
            const sharedCache = ServiceWorkerState.getSharedMediaCache();

            return await focusAndNotifySharedClient({
                client,
                sharedCache,
                persistSharedMedia: async (cache) => {
                    const indexedDBManager = new IndexedDBManager();
                    await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
                },
                logger: this.dependencies.console,
                createRedirectResponse: () =>
                    Utilities.createRedirectResponse('/', 'success', this.dependencies.location),
            });
        }

        async openNewClient() {
            const sharedCache = ServiceWorkerState.getSharedMediaCache();

            return await openNewSharedClientWindow({
                sharedCache,
                persistSharedMedia: async (cache) => {
                    const indexedDBManager = new IndexedDBManager();
                    await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
                },
                logger: this.dependencies.console,
                basePath: '/',
                origin: this.dependencies.location.origin,
                openWindow: (url) => this.dependencies.clients.openWindow(url),
                createRedirectResponse: () =>
                    Utilities.createRedirectResponse('/', null, this.dependencies.location),
            });
        }

        async persistSharedMediaToIndexedDB(sharedData: any, indexedDBManager: any) {
            await persistSharedMediaIndexedDbRecord({
                sharedData,
                indexedDBManager,
                maxFileSize: MAX_INDEXEDDB_FILE_SIZE,
                recordId: SHARED_MEDIA_RECORD_ID,
                schemaVersion: SHARED_MEDIA_SCHEMA_VERSION,
            });
        }
    }

    class MessageHandler {
        constructor(public indexedDBManager = new IndexedDBManager()) { }

        respondSharedMedia(event: any) {
            const sharedCache = ServiceWorkerState.getSharedMediaCache();

            postServiceWorkerSharedMediaResponse({
                event,
                sharedMedia: sharedCache,
                clearAfterSend: true,
                clearSharedMediaCache: () => ServiceWorkerState.clearSharedMediaCache(),
                clearPersistedSharedMedia: () => this.indexedDBManager.clearSharedMedia(),
            });
        }

        respondSharedMediaForce(event: any) {
            const sharedCache = ServiceWorkerState.getSharedMediaCache();

            if (!sharedCache) {
                ServiceWorkerDependencies.console.log('SW: No shared cache, client should try IndexedDB fallback');
            }

            postServiceWorkerSharedMediaResponse({
                event,
                sharedMedia: sharedCache,
                fallbackRequired: !sharedCache,
                clearSharedMediaCache: () => ServiceWorkerState.clearSharedMediaCache(),
            });
        }
    }

    class RequestHandler {
        constructor(
            public cacheManager = new CacheManager(),
            public clientManager = new ClientManager(),
            public indexedDBManager = new IndexedDBManager()
        ) { }

        async handleUploadRequest(request: Request) {
            return await processServiceWorkerUploadRequest({
                request,
                location: ServiceWorkerDependencies.location,
                logger: ServiceWorkerDependencies.console,
                extractMediaFromFormData: (formData) => Utilities.extractMediaFromFormData(formData),
                redirectClient: () => this.clientManager.redirectClient(),
                createRedirectResponse: Utilities.createRedirectResponse,
                setSharedMediaCache: (sharedMedia) =>
                    ServiceWorkerState.setSharedMediaCache(sharedMedia),
                summarizeExtractedData: summarizeExtractedSharedMedia,
            });
        }

        async handleProfileImageRequest(request: Request) {
            return await processServiceWorkerProfileImageRequest({
                request,
                logger: ServiceWorkerDependencies.console,
                normalizeProfileImageUrl: Utilities.normalizeProfileImageUrl,
                handleProfileImageCache: (profileRequest) =>
                    this.cacheManager.handleProfileImageCache(profileRequest),
                fetchAndCacheProfileImage: async (profileRequest) =>
                    await this.cacheManager.fetchAndCacheProfileImage(profileRequest) as Response | null,
                createTransparentImageResponse: Utilities.createTransparentImageResponse,
            });
        }
    }

    class ServiceWorkerCore {
        constructor(
            public cacheManager = new CacheManager(),
            public indexedDBManager = new IndexedDBManager(),
            public clientManager = new ClientManager(),
            public messageHandler = new MessageHandler(indexedDBManager),
            public requestHandler = new RequestHandler(cacheManager, clientManager, indexedDBManager)
        ) { }

        async handleInstall(event: any) {
            await processServiceWorkerInstall({
                logger: ServiceWorkerDependencies.console,
                version: SW_VERSION,
            });
        }

        async handleActivate(event: any) {
            await processServiceWorkerActivate({
                logger: ServiceWorkerDependencies.console,
                version: SW_VERSION,
                cleanupOldCaches: () => this.cacheManager.cleanupOldCaches(),
                claimClients: () => ServiceWorkerDependencies.clients.claim(),
            });
        }

        async handleFetch(event: any) {
            const url = new URL(event.request.url);
            const route = resolveServiceWorkerFetchRoute({
                request: event.request,
                url,
                currentOrigin: ServiceWorkerDependencies.location.origin,
                isUploadRequest: Utilities.isUploadRequest,
                isProfileImageRequest: Utilities.isProfileImageRequest,
            });

            logServiceWorkerFetchRoute({
                route,
                url,
                requestUrl: event.request.url,
                currentOrigin: ServiceWorkerDependencies.location.origin,
                logger: ServiceWorkerDependencies.console,
            });

            return await dispatchServiceWorkerFetchRoute({
                route,
                uploadHandler: () => this.requestHandler.handleUploadRequest(event.request),
                profileImageHandler: () => this.requestHandler.handleProfileImageRequest(event.request),
                customEmojiImageHandler: () => this.cacheManager.handleCustomEmojiImageRequest(event.request),
            });
        }

        async handleMessage(event: any) {
            await processServiceWorkerMessageEvent({
                event,
                version: SW_VERSION,
                skipWaiting: () => mockSelf.skipWaiting(),
                logger: ServiceWorkerDependencies.console,
                messageHandler: this.messageHandler,
                cacheManager: this.cacheManager,
            });
        }
    }

    return {
        ServiceWorkerCore,
        ServiceWorkerState,
        ServiceWorkerDependencies,
        Utilities,
        IndexedDBManager,
        CacheManager,
        ClientManager,
        MessageHandler,
        RequestHandler,
        SW_VERSION,
        RUNTIME_LARGE_ASSET_CACHE_NAME,
        CUSTOM_EMOJI_CACHE_NAME,
        PROFILE_CACHE_NAME,
        INDEXEDDB_NAME,
        INDEXEDDB_VERSION,
        SHARED_MEDIA_STORE_NAME,
        SHARED_MEDIA_RECORD_ID
    };
};

describe('Service Worker Tests', () => {
    let swModule: ServiceWorkerModule;

    beforeEach(() => {
        vi.clearAllMocks();
        swModule = createServiceWorkerMocks();

        swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue({
            match: vi.fn().mockResolvedValue(null),
            put: vi.fn().mockResolvedValue(undefined),
            keys: vi.fn().mockResolvedValue([])
        });

        // ClientManagerテスト用のモック設定
        swModule.ServiceWorkerDependencies.clients.matchAll.mockResolvedValue([
            { focus: vi.fn(), postMessage: vi.fn() }
        ]);
    });

    describe('Utilities', () => {
        it('should create transparent image response', () => {
            const response = swModule.Utilities.createTransparentImageResponse();
            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('image/png');
        });

        it('should create error transparent image response', () => {
            const response = swModule.Utilities.createTransparentImageResponse(404);
            expect(response.status).toBe(404);
            expect(response.headers.get('Cache-Control')).toBe('no-cache');
        });

        it('should get base URL', () => {
            const baseUrl = swModule.Utilities.getBaseUrl('https://example.com/path?param=value');
            expect(baseUrl).toBe('https://example.com/path');
        });

        it('should reject private profile image URL when building base URL', () => {
            const baseUrl = swModule.Utilities.getBaseUrl('https://127.0.0.1/path?profile=true');
            expect(baseUrl).toBeNull();
        });

        it('should identify upload requests', () => {
            const request = new Request('https://example.com/upload', { method: 'POST' });
            const url = new URL(request.url);
            expect(swModule.Utilities.isUploadRequest(request, url)).toBe(true);
        });

        it('should identify profile image requests', () => {
            const request = new Request('https://example.com/image.jpg?profile=true');
            expect(swModule.Utilities.isProfileImageRequest(request)).toBe(true);
        });

        it('should extract media from FormData', async () => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('media', file);

            const result = await swModule.Utilities.extractMediaFromFormData(formData);
            expect(result).toEqual({
                images: [file],
                metadata: [expect.objectContaining({
                    name: 'test.jpg',
                    type: 'image/jpeg'
                })]
            });
        });
    });

    describe('ServiceWorkerState', () => {
        it('should manage shared media cache', () => {
            const testData = { image: 'test' };

            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toBeNull();

            swModule.ServiceWorkerState.setSharedMediaCache(testData);
            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toBe(testData);

            swModule.ServiceWorkerState.clearSharedMediaCache();
            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toBeNull();
        });
    });

    describe('IndexedDBManager', () => {
        it('should save shared media in the app database', async () => {
            const manager = new swModule.IndexedDBManager();
            await manager.putSharedMedia({ id: swModule.SHARED_MEDIA_RECORD_ID, images: [] });

            expect(swModule.ServiceWorkerDependencies.indexedDB.open).toHaveBeenCalledWith(
                swModule.INDEXEDDB_NAME,
                swModule.INDEXEDDB_VERSION
            );
        }, 5000); // タイムアウトを5秒に短縮

        it('should clear shared media from the app database', async () => {
            const manager = new swModule.IndexedDBManager();
            await manager.clearSharedMedia();

            expect(swModule.ServiceWorkerDependencies.indexedDB.open).toHaveBeenCalled();
        }, 5000); // タイムアウトを5秒に短縮
    });

    describe('CacheManager', () => {
        it('should clean up only legacy precache caches', async () => {
            const manager = new swModule.CacheManager();
            await manager.cleanupOldCaches();

            expect(swModule.ServiceWorkerDependencies.caches.keys).toHaveBeenCalled();
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledTimes(3);
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledWith('ehagaki-cache-1.2.0');
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledWith('ehagaki-profile-images');
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledWith('ehagaki-custom-emoji-images');
            expect(swModule.ServiceWorkerDependencies.caches.delete).not.toHaveBeenCalledWith(swModule.PROFILE_CACHE_NAME);
            expect(swModule.ServiceWorkerDependencies.caches.delete).not.toHaveBeenCalledWith(swModule.RUNTIME_LARGE_ASSET_CACHE_NAME);
            expect(swModule.ServiceWorkerDependencies.caches.delete).not.toHaveBeenCalledWith(swModule.CUSTOM_EMOJI_CACHE_NAME);
            expect(swModule.ServiceWorkerDependencies.caches.delete).not.toHaveBeenCalledWith('workbox-precache-v2-example');
        });

        it('should clear profile cache', async () => {
            const manager = new swModule.CacheManager();
            const result = await manager.clearProfileCache();

            expect(result.success).toBe(true);
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledWith(swModule.PROFILE_CACHE_NAME);
        });

        it('should prefer cached base profile image responses', async () => {
            const manager = new swModule.CacheManager();
            const cachedResponse = new Response('cached-base-profile');
            const mockCache = {
                match: vi.fn(async (request: Request) => {
                    if (request.mode === 'cors' && request.url === 'https://example.com/profile.jpg') {
                        return cachedResponse;
                    }

                    return null;
                }),
                put: vi.fn(),
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);

            const response = await manager.handleProfileImageCache(
                new Request('https://example.com/profile.jpg?profile=true'),
            );

            expect(response).toBe(cachedResponse);
            expect(mockCache.match).toHaveBeenCalledTimes(1);
        });

        it('should clean up duplicate profile cache entries', async () => {
            const manager = new swModule.CacheManager();
            const queryRequest = new Request('https://example.com/profile.jpg?profile=true');
            const baseRequest = new Request('https://example.com/profile.jpg');
            const otherQueryRequest = new Request('https://example.com/other.jpg?profile=true');
            const mockCache = {
                keys: vi.fn().mockResolvedValue([baseRequest, queryRequest, otherQueryRequest]),
                delete: vi.fn().mockResolvedValue(true),
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);

            const result = await manager.cleanupDuplicateProfileCache();

            expect(result).toEqual({ success: true, deletedCount: 1 });
            expect(swModule.ServiceWorkerDependencies.caches.open).toHaveBeenCalledWith(swModule.PROFILE_CACHE_NAME);
            expect(mockCache.delete).toHaveBeenCalledTimes(1);
            expect(mockCache.delete).toHaveBeenCalledWith(queryRequest);
        });

        it('should fetch and cache profile image from network', async () => {
            const manager = new swModule.CacheManager();
            const request = new Request('https://example.com/profile.jpg?profile=true');

            // Cacheオブジェクトのモック（match, put両方を持つ）
            const mockCache = {
                match: vi.fn().mockResolvedValue(null), // キャッシュヒットしない
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);

            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(new Response('image', {
                status: 200,
                headers: { 'Content-Type': 'image/jpeg' }
            }));

            const response = await manager.fetchAndCacheProfileImage(request);

            expect(response).toBeDefined();
            expect(response.status).toBe(200);

            // キャッシュは PROFILE_CACHE_NAME を開いて put が呼ばれていること
            expect(swModule.ServiceWorkerDependencies.caches.open).toHaveBeenCalledWith(swModule.PROFILE_CACHE_NAME);
            expect(mockCache.put).toHaveBeenCalled();

            // put に渡されたキャッシュキーがベースURL（クエリ無し）になっていることを検証
            const putCallFirstArg = mockCache.put.mock.calls[0][0];
            // Requestオブジェクトの場合は .url を確認、文字列等の場合も想定してハンドリング
            const putKeyUrl = putCallFirstArg && (putCallFirstArg.url || putCallFirstArg);
            expect(putKeyUrl).toBe('https://example.com/profile.jpg');
            expect(putCallFirstArg.mode).toBe('cors');
        });

        it('should not cache opaque profile image responses', async () => {
            const manager = new swModule.CacheManager();
            const request = new Request('https://example.com/profile.jpg?profile=true');
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue({
                ok: false,
                type: 'opaque',
                status: 0,
                statusText: '',
                clone: () => ({})
            });

            const response = await manager.fetchAndCacheProfileImage(request);

            expect(response).toBeNull();
            expect(mockCache.put).not.toHaveBeenCalled();
        });

        it('should fall back to opaque profile image cache when cors fetch fails', async () => {
            const manager = new swModule.CacheManager();
            const request = new Request('https://example.com/profile.jpg?profile=true');
            const opaqueResponse = {
                type: 'opaque',
                clone: vi.fn(() => ({ type: 'opaque' }))
            };
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch
                .mockRejectedValueOnce(new TypeError('Failed to fetch'))
                .mockResolvedValueOnce(opaqueResponse);

            const response = await manager.fetchAndCacheProfileImage(request);

            expect(response).toBe(opaqueResponse);
            expect(swModule.ServiceWorkerDependencies.fetch).toHaveBeenCalledTimes(2);
            expect(swModule.ServiceWorkerDependencies.fetch.mock.calls[0][0].mode).toBe('cors');
            expect(swModule.ServiceWorkerDependencies.fetch.mock.calls[1][0].mode).toBe('no-cors');
            expect(mockCache.put).toHaveBeenCalledTimes(1);
            expect(mockCache.put.mock.calls[0][0].url).toBe('https://example.com/profile.jpg');
            expect(mockCache.put.mock.calls[0][0].mode).toBe('no-cors');
        });

        it('should reject private profile image fetches', async () => {
            const manager = new swModule.CacheManager();
            const request = new Request('https://127.0.0.1/profile.jpg?profile=true');

            const response = await manager.fetchAndCacheProfileImage(request);

            expect(response).toBeNull();
            expect(swModule.ServiceWorkerDependencies.fetch).not.toHaveBeenCalled();
        });

        it('should cache custom emoji images with a dedicated cache', async () => {
            const manager = new swModule.CacheManager();
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(new Response('emoji', {
                status: 200,
                headers: { 'Content-Type': 'image/webp' }
            }));

            const result = await manager.cacheCustomEmojiImages([
                'https://example.com/emoji.webp?size=small',
                'https://example.com/emoji.webp?size=small',
            ]);

            expect(result).toEqual({ success: true, cached: 1, failed: 0 });
            expect(swModule.ServiceWorkerDependencies.caches.open).toHaveBeenCalledWith(
                swModule.CUSTOM_EMOJI_CACHE_NAME,
            );
            expect(mockCache.put).toHaveBeenCalledTimes(1);
        });

        it('should not cache opaque custom emoji image responses', async () => {
            const manager = new swModule.CacheManager();
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue({
                ok: false,
                type: 'opaque',
                headers: new Headers(),
                clone: () => ({})
            });

            const result = await manager.cacheCustomEmojiImages([
                'https://example.com/emoji.webp',
            ]);

            expect(result).toEqual({ success: true, cached: 0, failed: 1 });
            expect(mockCache.put).not.toHaveBeenCalled();
        });

        it('should fall back to opaque custom emoji cache when cors fetch fails', async () => {
            const manager = new swModule.CacheManager();
            const opaqueResponse = {
                type: 'opaque',
                clone: vi.fn(() => ({ type: 'opaque' }))
            };
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch
                .mockRejectedValueOnce(new TypeError('Failed to fetch'))
                .mockResolvedValueOnce(opaqueResponse);

            const result = await manager.cacheCustomEmojiImages([
                'https://example.com/emoji.webp?size=small',
            ]);

            expect(result).toEqual({ success: true, cached: 1, failed: 0 });
            expect(swModule.ServiceWorkerDependencies.fetch).toHaveBeenCalledTimes(2);
            expect(swModule.ServiceWorkerDependencies.fetch.mock.calls[0][0].mode).toBe('cors');
            expect(swModule.ServiceWorkerDependencies.fetch.mock.calls[1][0].mode).toBe('no-cors');
            expect(mockCache.put).toHaveBeenCalledTimes(1);
            expect(mockCache.put.mock.calls[0][0].url).toBe('https://example.com/emoji.webp');
            expect(mockCache.put.mock.calls[0][0].mode).toBe('no-cors');
        });

        it('should cache custom emoji image responses up to 10MB', async () => {
            const manager = new swModule.CacheManager();
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(new Response('emoji', {
                status: 200,
                headers: {
                    'Content-Type': 'image/webp',
                    'Content-Length': String(10 * 1024 * 1024),
                }
            }));

            const result = await manager.cacheCustomEmojiImages([
                'https://example.com/emoji.webp',
            ]);

            expect(result).toEqual({ success: true, cached: 1, failed: 0 });
            expect(mockCache.put).toHaveBeenCalledTimes(1);
        });

        it('should not cache custom emoji image responses over 10MB', async () => {
            const manager = new swModule.CacheManager();
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(new Response('emoji', {
                status: 200,
                headers: {
                    'Content-Type': 'image/webp',
                    'Content-Length': String(10 * 1024 * 1024 + 1),
                }
            }));

            const result = await manager.cacheCustomEmojiImages([
                'https://example.com/emoji.webp',
            ]);

            expect(result).toEqual({ success: true, cached: 0, failed: 1 });
            expect(mockCache.put).not.toHaveBeenCalled();
        });

        it('should fetch custom emoji image when cache misses', async () => {
            const manager = new swModule.CacheManager();
            const networkResponse = new Response('emoji-network');
            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn(),
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(networkResponse);

            const response = await manager.handleCustomEmojiImageRequest(
                new Request('https://example.com/emoji.webp?size=small'),
            );

            expect(response).toBe(networkResponse);
            expect(swModule.ServiceWorkerDependencies.fetch).toHaveBeenCalledTimes(1);
        });

        it('should return cached custom emoji image before network', async () => {
            const manager = new swModule.CacheManager();
            const cachedResponse = new Response('emoji');
            const mockCache = {
                match: vi.fn().mockResolvedValue(cachedResponse),
                put: vi.fn()
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);

            const response = await manager.handleCustomEmojiImageRequest(
                new Request('https://example.com/emoji.webp'),
            );

            expect(response).toBe(cachedResponse);
            expect(swModule.ServiceWorkerDependencies.fetch).not.toHaveBeenCalled();
        });
    });

    describe('ClientManager', () => {
        it('should redirect client when clients exist', async () => {
            const client = { id: 'client-1', focus: vi.fn(), postMessage: vi.fn() };
            swModule.ServiceWorkerDependencies.clients.matchAll.mockResolvedValue([client]);
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            Object.defineProperty(file, 'arrayBuffer', {
                value: async () => new TextEncoder().encode('test').buffer,
                configurable: true,
            });
            swModule.ServiceWorkerState.setSharedMediaCache({ images: [file] });

            const manager = new swModule.ClientManager();
            const response = await manager.redirectClient();

            expect(swModule.ServiceWorkerDependencies.clients.matchAll).toHaveBeenCalled();
            expect(client.focus).toHaveBeenCalledTimes(1);
            expect(client.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'SHARED_MEDIA',
                    data: { images: [file] },
                    requestId: expect.stringMatching(/^sw-/),
                }),
            );
            expect(swModule.ServiceWorkerDependencies.indexedDB.open).toHaveBeenCalledWith(
                swModule.INDEXEDDB_NAME,
                swModule.INDEXEDDB_VERSION,
            );
            expect(response.status).toBe(303);
        });

        it('should open new client when no clients exist', async () => {
            // 空の配列を返すようにモックを再設定
            swModule.ServiceWorkerDependencies.clients.matchAll.mockResolvedValue([]);

            const manager = new swModule.ClientManager();
            const response = await manager.redirectClient();

            expect(swModule.ServiceWorkerDependencies.clients.openWindow).toHaveBeenCalledWith(
                'https://example.com/?shared=true',
            );
            expect(response.status).toBe(303);
        });
    });

    describe('MessageHandler', () => {
        it('should respond shared media', () => {
            const testData = { image: 'test' };
            swModule.ServiceWorkerState.setSharedMediaCache(testData);

            const handler = new swModule.MessageHandler();
            const mockEvent = {
                source: { postMessage: vi.fn() },
                data: { requestId: 'test-123' },
                ports: null
            };

            handler.respondSharedMedia(mockEvent);

            expect(mockEvent.source.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'SHARED_MEDIA',
                    data: testData,
                    requestId: 'test-123'
                })
            );
            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toBeNull();
        });

        it('should respond shared media force without clearing cache', () => {
            const testData = { image: 'force-test' };
            swModule.ServiceWorkerState.setSharedMediaCache(testData);

            const handler = new swModule.MessageHandler();
            const mockEvent = {
                source: { postMessage: vi.fn() },
                data: { requestId: 'force-123' },
                ports: null,
            };

            handler.respondSharedMediaForce(mockEvent);

            expect(mockEvent.source.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'SHARED_MEDIA',
                    data: testData,
                    requestId: 'force-123',
                }),
            );
            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toEqual(testData);
        });
    });

    describe('RequestHandler', () => {
        it('should handle upload request successfully', async () => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('media', file);

            const request = new Request('https://example.com/upload', {
                method: 'POST',
                body: formData
            });

            // FormDataのモック
            vi.spyOn(request, 'formData').mockResolvedValue(formData);

            const handler = new swModule.RequestHandler();
            const response = await handler.handleUploadRequest(request);

            expect(response).toBeDefined();
            expect(swModule.ServiceWorkerState.getSharedMediaCache()).toBeTruthy();
        });

        it('should handle upload request with no image', async () => {
            const formData = new FormData();
            const request = new Request('https://example.com/upload', {
                method: 'POST',
                body: formData
            });

            vi.spyOn(request, 'formData').mockResolvedValue(formData);

            const handler = new swModule.RequestHandler();
            const response = await handler.handleUploadRequest(request);

            expect(response.status).toBe(303); // Redirect
            expect(response.headers.get('Location')).toContain('error=no-image');
        });

        it('should handle profile image request', async () => {
            const request = new Request('https://example.com/image.jpg?profile=true');
            const handler = new swModule.RequestHandler();

            const mockCache = {
                match: vi.fn().mockResolvedValue(null),
                put: vi.fn().mockResolvedValue(undefined)
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            swModule.ServiceWorkerDependencies.fetch.mockResolvedValue(new Response('image', {
                status: 200,
                headers: { 'Content-Type': 'image/jpeg' }
            }));

            const response = await handler.handleProfileImageRequest(request);

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('image/jpeg');
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'プロフィール画像リクエスト処理開始:',
                'https://example.com/image.jpg?profile=true',
            );
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'プロフィール画像をネットワークから返却:',
                'https://example.com/image.jpg?profile=true',
            );
        });

        it('should return transparent image for policy-blocked profile image request', async () => {
            const request = new Request('https://192.168.0.20/image.jpg?profile=true');
            const handler = new swModule.RequestHandler();

            const response = await handler.handleProfileImageRequest(request);

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('image/png');
            expect(swModule.ServiceWorkerDependencies.fetch).not.toHaveBeenCalled();
            expect(swModule.ServiceWorkerDependencies.console.warn).toHaveBeenCalledWith(
                'プロフィール画像 URL がポリシー外のため transparent image を返却:',
                'https://192.168.0.20/image.jpg?profile=true',
            );
        });
    });

    describe('ServiceWorkerCore', () => {
        it('should handle install event', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockEvent = {};

            await core.handleInstall(mockEvent);

            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW installing...',
                swModule.SW_VERSION
            );
            expect(swModule.ServiceWorkerDependencies.caches.open).not.toHaveBeenCalled();
        });

        it('should handle activate event', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockEvent = {};

            await core.handleActivate(mockEvent);

            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW activating...',
                swModule.SW_VERSION
            );
            expect(swModule.ServiceWorkerDependencies.caches.delete).toHaveBeenCalledWith('ehagaki-cache-1.2.0');
            expect(swModule.ServiceWorkerDependencies.clients.claim).toHaveBeenCalled();
        });

        it('should handle fetch event for upload', async () => {
            const core = new swModule.ServiceWorkerCore();
            const request = new Request('https://example.com/upload', { method: 'POST' });
            const mockEvent = { request };

            const response = await core.handleFetch(mockEvent);

            expect(response).toBeDefined();
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW: 内部アップロードリクエストを処理',
                'https://example.com/upload',
            );
        });

        it('should handle fetch event for external profile image', async () => {
            const core = new swModule.ServiceWorkerCore();
            const request = new Request('https://external.com/profile.jpg?profile=true');
            const mockEvent = { request };

            const response = await core.handleFetch(mockEvent);

            expect(response).toBeDefined();
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW: 外部プロフィール画像リクエストを処理:',
                'https://external.com/profile.jpg?profile=true',
            );
        });

        it('should leave normal same-origin GET requests to Workbox routes', async () => {
            const core = new swModule.ServiceWorkerCore();
            const request = new Request('https://example.com/test.js');
            const mockEvent = { request };

            const response = await core.handleFetch(mockEvent);

            expect(response).toBeUndefined();
            expect(swModule.ServiceWorkerDependencies.fetch).not.toHaveBeenCalled();
            expect(swModule.ServiceWorkerDependencies.caches.open).not.toHaveBeenCalled();
        });

        it('should handle message event for SKIP_WAITING', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockEvent = {
                data: { type: 'SKIP_WAITING' },
                ports: null
            };

            await core.handleMessage(mockEvent);

            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW received SKIP_WAITING, updating...'
            );
        });

        it('should handle message event for GET_VERSION', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockPort = { postMessage: vi.fn() };
            const mockEvent = {
                data: { type: 'GET_VERSION' },
                ports: [mockPort]
            };

            await core.handleMessage(mockEvent);

            expect(mockPort.postMessage).toHaveBeenCalledWith({
                version: swModule.SW_VERSION
            });
        });

        it('should handle message event for PING_TEST via source', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockSource = { postMessage: vi.fn() };
            const mockEvent = {
                data: { type: 'PING_TEST' },
                ports: null,
                source: mockSource,
            };

            await core.handleMessage(mockEvent);

            expect(mockSource.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'PONG',
                    version: swModule.SW_VERSION,
                }),
            );
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW: PING_TEST responded via source',
            );
        });

        it('should handle action message event for getSharedMediaForce', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockPort = { postMessage: vi.fn() };
            const mockEvent = {
                data: { action: 'getSharedMediaForce', requestId: 'force-1' },
                ports: [mockPort],
            };

            await core.handleMessage(mockEvent);

            expect(mockPort.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'SHARED_MEDIA',
                    data: null,
                    requestId: 'force-1',
                    fallbackRequired: true,
                }),
            );
            expect(swModule.ServiceWorkerDependencies.console.log).toHaveBeenCalledWith(
                'SW: No shared cache, client should try IndexedDB fallback',
            );
        });

        it('should handle action message event for cleanupDuplicateProfileCache', async () => {
            const core = new swModule.ServiceWorkerCore();
            const mockPort = { postMessage: vi.fn() };
            const baseRequest = new Request('https://example.com/profile.jpg');
            const queryRequest = new Request('https://example.com/profile.jpg?profile=true');
            const mockCache = {
                keys: vi.fn().mockResolvedValue([baseRequest, queryRequest]),
                delete: vi.fn().mockResolvedValue(true),
            };
            swModule.ServiceWorkerDependencies.caches.open.mockResolvedValue(mockCache);
            const mockEvent = {
                data: { action: 'cleanupDuplicateProfileCache' },
                ports: [mockPort],
            };

            await core.handleMessage(mockEvent);

            expect(mockPort.postMessage).toHaveBeenCalledWith({
                success: true,
                deletedCount: 1,
            });
        });
    });
});
