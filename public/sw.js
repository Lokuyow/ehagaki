import {
    getProfilePictureCacheKeyUrl,
    normalizeProfilePictureUrl,
} from "../src/lib/profilePictureUrlUtils";
import {
    getLegacyCachesToDelete,
} from "../src/lib/swCacheUtils";
import {
    focusAndNotifySharedClient,
    openNewSharedClientWindow,
    redirectToAvailableSharedClient,
} from "../src/lib/swClientUtils";
import {
    cacheCustomEmojiImagesBatch,
    cacheOpaqueCustomEmojiImage,
} from "../src/lib/swCustomEmojiCacheUtils";
import { resolveCustomEmojiImageRequestResponse } from "../src/lib/swCustomEmojiRequestUtils";
import { dispatchServiceWorkerFetchRoute } from "../src/lib/swFetchDispatchUtils";
import { logServiceWorkerFetchRoute } from "../src/lib/swFetchRouteLogUtils";
import {
    processServiceWorkerActivate,
    processServiceWorkerInstall,
} from "../src/lib/swLifecycleUtils";
import { processServiceWorkerMessageEvent } from "../src/lib/swMessageDispatchUtils";
import {
    createActivateEventListener,
    createFetchEventListener,
    createInstallEventListener,
    createMessageEventListener,
    registerServiceWorkerEventListeners,
} from "../src/lib/swListenerUtils";
import { resolveServiceWorkerFetchRoute } from "../src/lib/swRoutingUtils";
import {
    processServiceWorkerUploadRequest,
    summarizeExtractedSharedMedia,
} from "../src/lib/swUploadRequestUtils";
import {
    processServiceWorkerProfileImageRequest,
} from "../src/lib/swProfileImageRequestUtils";
import { findProfileImageCacheMatch } from "../src/lib/swProfileImageCacheUtils";
import {
    fetchAndCacheOpaqueProfileImageResponse,
    fetchAndCacheProfileImageResponse,
} from "../src/lib/swProfileImageFetchUtils";
import {
    cleanupServiceWorkerDuplicateProfileCache,
    clearServiceWorkerProfileCache,
} from "../src/lib/swProfileCacheActionUtils";
import { ensureCurrentEHagakiDbSchema } from "../src/lib/swIndexedDbSchema";
import {
    createClearSharedMediaDbOperation,
    createPutSharedMediaDbOperation,
    executeServiceWorkerIndexedDbOperation,
} from "../src/lib/swIndexedDbOperationUtils";
import { postServiceWorkerSharedMediaResponse } from "../src/lib/swSharedMediaResponseUtils";
import { persistSharedMediaIndexedDbRecord } from "../src/lib/swSharedMediaPersistence";
import {
    createCorsRequest,
    createServiceWorkerRedirectResponse,
    createTransparentImageResponse,
    extractSharedMediaFromFormData,
} from "../src/lib/swUtilities";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

// 定数定義
const SW_VERSION = '1.18.0';
const LEGACY_PRECACHE_PREFIX = 'ehagaki-cache-';
const PROFILE_CACHE_NAME = 'ehagaki-profile-images-v2';
const LEGACY_PROFILE_CACHE_NAMES = ['ehagaki-profile-images'];
const CUSTOM_EMOJI_CACHE_NAME = 'ehagaki-custom-emoji-images-v2';
const LEGACY_CUSTOM_EMOJI_CACHE_NAMES = ['ehagaki-custom-emoji-images'];
const RUNTIME_LARGE_ASSET_CACHE_NAME = 'ehagaki-runtime-large-assets';
const INDEXEDDB_NAME = 'eHagakiDB';
const INDEXEDDB_VERSION = 1;
const SHARED_MEDIA_STORE_NAME = 'sharedMedia';
const SHARED_MEDIA_RECORD_ID = 'latest';
const SHARED_MEDIA_SCHEMA_VERSION = 1;
const CUSTOM_EMOJI_MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// IndexedDB永続化時のファイルサイズ上限（100MB）
const MAX_INDEXEDDB_FILE_SIZE = 100 * 1024 * 1024;

// ベースパスの動的計算（GitHub Pagesなどのサブディレクトリ対応）
const BASE_PATH = (() => {
    const pathname = self.location.pathname;
    // sw.jsのファイル名を除いたパスをベースパスとする
    const pathParts = pathname.split('/').filter(p => p && p !== 'sw.js');
    return pathParts.length > 0 ? '/' + pathParts.join('/') + '/' : '/';
})();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(
    ({ request, url }) =>
        request.method === 'GET' &&
        url.origin === self.location.origin &&
        (url.pathname.includes('/ffmpeg-core/') || url.pathname.endsWith('.wasm')),
    new CacheFirst({
        cacheName: RUNTIME_LARGE_ASSET_CACHE_NAME
    })
);

// グローバル状態管理
const ServiceWorkerState = {
    sharedMediaCache: null,

    getSharedMediaCache() {
        return this.sharedMediaCache;
    },

    setSharedMediaCache(data) {
        this.sharedMediaCache = data;
    },

    clearSharedMediaCache() {
        this.sharedMediaCache = null;
    }
};

// 依存性注入可能なAPI群
const ServiceWorkerDependencies = {
    // Cache API
    caches: self.caches,

    // IndexedDB API
    indexedDB: self.indexedDB,

    // Client API
    clients: self.clients,

    // Fetch API
    fetch: self.fetch.bind(self),

    // Console API
    console: self.console,

    // Location
    location: self.location,

    // Navigator
    navigator: self.navigator,

    // タイマー
    setTimeout: self.setTimeout.bind(self)
};

// =============================================================================
// ユーティリティ関数群（純粋関数）
// =============================================================================

const Utilities = {
    // 透明画像レスポンスを生成
    createTransparentImageResponse(statusCode = 200) {
        return createTransparentImageResponse(statusCode);
    },

    // 共通のHTTPリクエスト作成
    createCorsRequest(url, options = {}) {
        return createCorsRequest(url, options);
    },

    // URLからベースURL（クエリパラメータなし）を取得
    getBaseUrl(url) {
        return getProfilePictureCacheKeyUrl(url, {
            currentOrigin: ServiceWorkerDependencies.location.origin
        });
    },

    // リダイレクトレスポンス
    createRedirectResponse(path = BASE_PATH, error = null, location = ServiceWorkerDependencies.location, { shared = true } = {}) {
        return createServiceWorkerRedirectResponse({
            path,
            error,
            location,
            shared,
        });
    },

    // アップロードリクエスト判定（内部のWeb Share Targetのみ）
    isUploadRequest(request, url) {
        return request.method === 'POST' &&
            (url.pathname.endsWith('/upload') || url.pathname.includes('/upload'));
    },

    // プロフィール画像リクエスト判定
    isProfileImageRequest(request) {
        if (request.method !== 'GET') return false;
        const url = new URL(request.url);
        // profile=true クエリパラメータがある場合のみプロフィール画像として扱う
        return url.searchParams.get('profile') === 'true';
    },

    normalizeProfileImageUrl(url) {
        return normalizeProfilePictureUrl(url, {
            currentOrigin: ServiceWorkerDependencies.location.origin
        });
    },

    async isCacheableCustomEmojiResponse(response) {
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

    // 共有メディアデータから FormData を抽出（複数メディア対応）
    async extractMediaFromFormData(formData) {
        return extractSharedMediaFromFormData(formData);
    }
};

// =============================================================================
// IndexedDB操作クラス
// =============================================================================

class IndexedDBManager {
    constructor(dependencies = ServiceWorkerDependencies) {
        this.indexedDB = dependencies.indexedDB;
        this.console = dependencies.console;
    }

    // IndexedDB操作の共通処理
    async executeOperation(operation) {
        return await executeServiceWorkerIndexedDbOperation({
            indexedDb: this.indexedDB,
            dbName: INDEXEDDB_NAME,
            dbVersion: INDEXEDDB_VERSION,
            onUpgradeNeeded: (db) => {
                ensureCurrentEHagakiDbSchema(db, SHARED_MEDIA_STORE_NAME);
            },
            operation,
        });
    }

    async putSharedMedia(record) {
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
            // エラーは無視
            this.console.error('IndexedDB error:', error);
        }
    }
}

// =============================================================================
// キャッシュ管理クラス
// =============================================================================

class CacheManager {
    constructor(dependencies = ServiceWorkerDependencies) {
        this.caches = dependencies.caches;
        this.fetch = dependencies.fetch;
        this.console = dependencies.console;
    }

    // Workbox移行前のプリキャッシュだけを削除
    async cleanupOldCaches() {
        try {
            const cacheNames = await this.caches.keys();
            const cachesToDelete = getLegacyCachesToDelete(cacheNames, {
                legacyPrecachePrefix: LEGACY_PRECACHE_PREFIX,
                legacyProfileCacheNames: LEGACY_PROFILE_CACHE_NAMES,
                legacyCustomEmojiCacheNames: LEGACY_CUSTOM_EMOJI_CACHE_NAMES,
            });
            await Promise.all(
                cachesToDelete.map((name) => this.caches.delete(name))
            );
        } catch (error) {
            this.console.error('キャッシュクリーンアップエラー:', error);
        }
    }

    // プロフィール画像キャッシュの処理
    async handleProfileImageCache(request) {
        try {
            const cache = await this.caches.open(PROFILE_CACHE_NAME);
            const baseUrl = Utilities.getBaseUrl(request.url);
            if (!baseUrl) {
                return null;
            }

            const cachedMatch = await findProfileImageCacheMatch({
                request,
                cache,
                getBaseUrl: Utilities.getBaseUrl,
                createRequest: Utilities.createCorsRequest,
            });

            if (cachedMatch?.source === 'base-cors') {
                this.console.log('プロフィール画像をキャッシュから返却（ベースURL）:', baseUrl);
                return cachedMatch.response;
            }

            if (cachedMatch?.source === 'base-no-cors') {
                this.console.log('プロフィール画像をopaqueキャッシュから返却（ベースURL）:', baseUrl);
                return cachedMatch.response;
            }

            if (cachedMatch?.source === 'original') {
                this.console.log('プロフィール画像をキャッシュから返却（元URL）:', request.url);
                return cachedMatch.response;
            }

            return null; // キャッシュにない場合はnullを返す
        } catch (error) {
            this.console.error('プロフィールキャッシュエラー:', error);
            return null;
        }
    }

    async fetchAndCacheOpaqueProfileImage(baseUrl) {
        return await fetchAndCacheOpaqueProfileImageResponse({
            baseUrl,
            cacheStorage: this.caches,
            cacheName: PROFILE_CACHE_NAME,
            fetchRequest: (request) => this.fetch(request),
            createRequest: Utilities.createCorsRequest,
            logger: this.console,
        });
    }

    // プロフィール画像をネットワークから取得してキャッシュ
    async fetchAndCacheProfileImage(request) {
        return await fetchAndCacheProfileImageResponse({
            request,
            isOnline: ServiceWorkerDependencies.navigator?.onLine,
            normalizeProfileImageUrl: Utilities.normalizeProfileImageUrl,
            getBaseUrl: Utilities.getBaseUrl,
            createRequest: Utilities.createCorsRequest,
            fetchRequest: (targetRequest) => this.fetch(targetRequest),
            cacheStorage: this.caches,
            cacheName: PROFILE_CACHE_NAME,
            fetchOpaqueProfileImage: (baseUrl) => this.fetchAndCacheOpaqueProfileImage(baseUrl),
            logger: this.console,
        });
    }

    async handleCustomEmojiImageRequest(request) {
        try {
            const cache = await this.caches.open(CUSTOM_EMOJI_CACHE_NAME);
            return await resolveCustomEmojiImageRequestResponse({
                request,
                cache,
                getBaseUrl: Utilities.getBaseUrl,
                createRequest: Utilities.createCorsRequest,
                fetchRequest: (targetRequest) => this.fetch(targetRequest),
            });
        } catch (error) {
            this.console.warn('カスタム絵文字キャッシュ取得に失敗:', error);
        }

        return this.fetch(request);
    }

    async cacheOpaqueCustomEmojiImage(cache, baseUrl) {
        return await cacheOpaqueCustomEmojiImage({
            cache,
            baseUrl,
            fetchRequest: (request) => this.fetch(request),
            createRequest: Utilities.createCorsRequest,
        });
    }

    async cacheCustomEmojiImages(urls) {
        return await cacheCustomEmojiImagesBatch({
            urls,
            cacheStorage: this.caches,
            cacheName: CUSTOM_EMOJI_CACHE_NAME,
            fetchRequest: (request) => this.fetch(request),
            createRequest: Utilities.createCorsRequest,
            getBaseUrl: Utilities.getBaseUrl,
            isCacheableCustomEmojiResponse: (response) =>
                Utilities.isCacheableCustomEmojiResponse(response),
            cacheOpaqueImage: (cache, baseUrl) => this.cacheOpaqueCustomEmojiImage(cache, baseUrl),
            logger: this.console,
        });
    }

    // プロフィール画像キャッシュをクリア
    async clearProfileCache() {
        return await clearServiceWorkerProfileCache({
            cacheStorage: this.caches,
            cacheName: PROFILE_CACHE_NAME,
            logger: this.console,
        });
    }

    // 重複プロフィール画像キャッシュのクリーンアップ
    async cleanupDuplicateProfileCache() {
        return await cleanupServiceWorkerDuplicateProfileCache({
            cacheStorage: this.caches,
            cacheName: PROFILE_CACHE_NAME,
            logger: this.console,
            getBaseUrl: Utilities.getBaseUrl,
        });
    }
}

// =============================================================================
// クライアント管理クラス
// =============================================================================

class ClientManager {
    constructor(dependencies = ServiceWorkerDependencies) {
        this.clients = dependencies.clients;
        this.console = dependencies.console;
        this.location = dependencies.location;
        this.setTimeout = dependencies.setTimeout;
    }

    // クライアントリダイレクト
    async redirectClient() {
        return await redirectToAvailableSharedClient({
            clientSet: this.clients,
            focusAndNotifyClient: (client) => this.focusAndNotifyClient(client),
            openNewClient: () => this.openNewClient(),
            logger: this.console,
            createErrorRedirectResponse: () =>
                Utilities.createRedirectResponse(undefined, 'client-error', this.location),
        });
    }

    // 新しいクライアントウィンドウを開いて共有データを渡す
    async openNewClient() {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        return await openNewSharedClientWindow({
            sharedCache,
            persistSharedMedia: async (cache) => {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
            },
            logger: this.console,
            basePath: BASE_PATH,
            origin: this.location.origin,
            openWindow: (url) => this.clients.openWindow(url),
            createRedirectResponse: () => Utilities.createRedirectResponse(),
        });
    }

    // 既存クライアント通知の改善
    async focusAndNotifyClient(client) {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        return await focusAndNotifySharedClient({
            client,
            sharedCache,
            persistSharedMedia: async (cache) => {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
            },
            logger: this.console,
            createRedirectResponse: () => Utilities.createRedirectResponse(),
        });
    }

    // IndexedDBに共有メディアデータを永続化（複数メディア対応、サイズ上限付き）
    async persistSharedMediaToIndexedDB(sharedData, indexedDBManager) {
        await persistSharedMediaIndexedDbRecord({
            sharedData,
            indexedDBManager,
            maxFileSize: MAX_INDEXEDDB_FILE_SIZE,
            recordId: SHARED_MEDIA_RECORD_ID,
            schemaVersion: SHARED_MEDIA_SCHEMA_VERSION,
        });
    }
}

// =============================================================================
// メッセージ処理クラス
// =============================================================================

class MessageHandler {
    constructor(indexedDBManager = new IndexedDBManager(), dependencies = ServiceWorkerDependencies) {
        this.indexedDBManager = indexedDBManager;
        this.console = dependencies.console;
    }

    postSharedMediaResponse(event, { fallbackRequired = false, clearAfterSend = false } = {}) {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        return postServiceWorkerSharedMediaResponse({
            event,
            sharedMedia: sharedCache,
            fallbackRequired,
            clearAfterSend,
            clearSharedMediaCache: () => ServiceWorkerState.clearSharedMediaCache(),
            clearPersistedSharedMedia: () => this.indexedDBManager.clearSharedMedia(),
        });
    }

    // 共有メディアリクエスト応答
    respondSharedMedia(event) {
        this.postSharedMediaResponse(event, {
            clearAfterSend: true,
        });

        // メディア送信後すぐキャッシュと永続化レコードをクリア
    }

    // 強制的な共有メディア取得リクエスト（フォールバック用）
    respondSharedMediaForce(event) {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        // キャッシュがない場合でもIndexedDBから取得を試みる
        if (!sharedCache) {
            this.console.log('SW: No shared cache, client should try IndexedDB fallback');
        }

        this.postSharedMediaResponse(event, {
            fallbackRequired: !sharedCache,
        });

        // 強制取得ではメディア送信後もキャッシュをクリアしない
        // （複数回の取得試行に対応）
    }
}

// =============================================================================
// リクエストハンドラークラス
// =============================================================================

class RequestHandler {
    constructor(
        cacheManager = new CacheManager(),
        clientManager = new ClientManager(),
        indexedDBManager = new IndexedDBManager(),
        dependencies = ServiceWorkerDependencies
    ) {
        this.cacheManager = cacheManager;
        this.clientManager = clientManager;
        this.indexedDBManager = indexedDBManager;
        this.console = dependencies.console;
        this.location = dependencies.location;
    }

    // アップロードリクエスト処理
    async handleUploadRequest(request) {
        return await processServiceWorkerUploadRequest({
            request,
            location: this.location,
            logger: this.console,
            extractMediaFromFormData: (formData) => Utilities.extractMediaFromFormData(formData),
            redirectClient: () => this.clientManager.redirectClient(),
            createRedirectResponse: Utilities.createRedirectResponse,
            setSharedMediaCache: (sharedMedia) =>
                ServiceWorkerState.setSharedMediaCache(sharedMedia),
            summarizeExtractedData: summarizeExtractedSharedMedia,
        });
    }

    // プロフィール画像リクエスト処理
    async handleProfileImageRequest(request) {
        return await processServiceWorkerProfileImageRequest({
            request,
            logger: this.console,
            normalizeProfileImageUrl: Utilities.normalizeProfileImageUrl,
            handleProfileImageCache: (profileRequest) =>
                this.cacheManager.handleProfileImageCache(profileRequest),
            fetchAndCacheProfileImage: (profileRequest) =>
                this.cacheManager.fetchAndCacheProfileImage(profileRequest),
            createTransparentImageResponse: Utilities.createTransparentImageResponse,
        });
    }
}

// =============================================================================
// メインのサービスワーカークラス
// =============================================================================

class ServiceWorkerCore {
    constructor() {
        this.cacheManager = new CacheManager();
        this.indexedDBManager = new IndexedDBManager();
        this.clientManager = new ClientManager();
        this.messageHandler = new MessageHandler(this.indexedDBManager);
        this.requestHandler = new RequestHandler(
            this.cacheManager,
            this.clientManager,
            this.indexedDBManager
        );
    }

    // インストールイベント処理
    async handleInstall(event) {
        await processServiceWorkerInstall({
            logger: ServiceWorkerDependencies.console,
            version: SW_VERSION,
        });
    }

    // アクティベートイベント処理
    async handleActivate(event) {
        await processServiceWorkerActivate({
            logger: ServiceWorkerDependencies.console,
            version: SW_VERSION,
            cleanupOldCaches: () => this.cacheManager.cleanupOldCaches(),
            claimClients: () => ServiceWorkerDependencies.clients.claim(),
        });
    }

    // フェッチイベント処理を修正
    async handleFetch(event) {
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

    // メッセージイベント処理
    async handleMessage(event) {
        await processServiceWorkerMessageEvent({
            event,
            version: SW_VERSION,
            skipWaiting: () => self.skipWaiting(),
            logger: ServiceWorkerDependencies.console,
            messageHandler: this.messageHandler,
            cacheManager: this.cacheManager,
        });
    }
}

// =============================================================================
// サービスワーカーのセットアップとイベントリスナー
// =============================================================================

const serviceWorkerCore = new ServiceWorkerCore();

registerServiceWorkerEventListeners({
    serviceWorkerGlobal: self,
    installListener: createInstallEventListener((event) =>
        serviceWorkerCore.handleInstall(event),
    ),
    activateListener: createActivateEventListener((event) =>
        serviceWorkerCore.handleActivate(event),
    ),
    fetchListener: createFetchEventListener({
        handleFetch: (event) => serviceWorkerCore.handleFetch(event),
        currentOrigin: self.location.origin,
        isUploadRequest: Utilities.isUploadRequest,
        isProfileImageRequest: Utilities.isProfileImageRequest,
        resolveServiceWorkerFetchRoute,
    }),
    messageListener: createMessageEventListener((event) =>
        serviceWorkerCore.handleMessage(event),
    ),
});

// テスト用エクスポート（実際のService Workerでは使用されない）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
}
