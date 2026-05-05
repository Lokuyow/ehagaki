import {
    getProfilePictureCacheKeyUrl,
    normalizeProfilePictureUrl,
} from "../src/lib/profilePictureUrlUtils";
import {
    createBaseCacheLookupEntries,
    getLegacyCachesToDelete,
    getDuplicateProfileCacheRequests,
    matchCacheByPriority,
} from "../src/lib/swCacheUtils";
import {
    createSharedClientUrl,
    persistSharedMediaIfPresent,
} from "../src/lib/swClientUtils";
import {
    createPingTestResponse,
    createVersionResponse,
    postMessageEventResponse,
    postPortEventResponse,
} from "../src/lib/swEventResponseUtils";
import { dispatchServiceWorkerFetchRoute } from "../src/lib/swFetchDispatchUtils";
import {
    createServiceWorkerActionHandlers,
    createServiceWorkerTypeMessageHandlers,
} from "../src/lib/swMessageHandlerFactories";
import { dispatchServiceWorkerMessageRoute } from "../src/lib/swMessageDispatchUtils";
import {
    createActivateEventListener,
    createFetchEventListener,
    createInstallEventListener,
    createMessageEventListener,
    registerServiceWorkerEventListeners,
} from "../src/lib/swListenerUtils";
import {
    resolveServiceWorkerFetchRoute,
    resolveServiceWorkerMessageRoute,
} from "../src/lib/swRoutingUtils";
import {
    resolveUploadRequestOutcome,
    summarizeExtractedSharedMedia,
} from "../src/lib/swUploadRequestUtils";
import { resolveProfileImageRequestResult } from "../src/lib/swProfileImageRequestUtils";
import { ensureCurrentEHagakiDbSchema } from "../src/lib/swIndexedDbSchema";
import {
    createClientSharedMediaNotification,
} from "../src/lib/swMessageUtils";
import { postServiceWorkerSharedMediaResponse } from "../src/lib/swSharedMediaResponseUtils";
import { buildSharedMediaIndexedDbRecord } from "../src/lib/swSharedMediaPersistence";
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
        return new Promise((resolve, reject) => {
            try {
                const req = this.indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION);

                req.onupgradeneeded = (e) => {
                    ensureCurrentEHagakiDbSchema(e.target.result, SHARED_MEDIA_STORE_NAME);
                };

                req.onerror = () => reject(new Error('IndexedDB open failed'));

                req.onsuccess = (e) => {
                    const db = e.target.result;
                    try {
                        operation(db, resolve, reject);
                    } catch (error) {
                        db.close();
                        reject(error);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    async putSharedMedia(record) {
        return this.executeOperation((db, resolve, reject) => {
            if (!db.objectStoreNames.contains(SHARED_MEDIA_STORE_NAME)) {
                db.close();
                reject(new Error('Shared media store is not available'));
                return;
            }

            const tx = db.transaction([SHARED_MEDIA_STORE_NAME], 'readwrite');
            const store = tx.objectStore(SHARED_MEDIA_STORE_NAME);
            store.put(record).onsuccess = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(new Error('Failed to persist shared media'));
            };
        });
    }

    async clearSharedMedia() {
        try {
            await this.executeOperation((db, resolve) => {
                if (!db.objectStoreNames.contains(SHARED_MEDIA_STORE_NAME)) {
                    db.close();
                    resolve();
                    return;
                }
                const tx = db.transaction([SHARED_MEDIA_STORE_NAME], 'readwrite');
                const store = tx.objectStore(SHARED_MEDIA_STORE_NAME);
                store.delete(SHARED_MEDIA_RECORD_ID).onsuccess = () => {
                    db.close();
                    resolve();
                };
                tx.onerror = () => {
                    db.close();
                    resolve(); // エラーでも正常終了扱い
                };
            });
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

            const cachedMatch = await matchCacheByPriority(
                cache,
                createBaseCacheLookupEntries(
                    baseUrl,
                    request,
                    Utilities.createCorsRequest,
                ),
            );

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
        const profileFetchRequest = Utilities.createCorsRequest(baseUrl, {
            mode: 'no-cors',
            cache: 'reload'
        });
        const response = await this.fetch(profileFetchRequest);
        if (!response || response.type !== 'opaque') {
            return null;
        }

        const cache = await this.caches.open(PROFILE_CACHE_NAME);
        const cacheKey = Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' });
        try {
            await cache.put(cacheKey, response.clone());
            this.console.log('プロフィール画像をopaqueキャッシュに保存完了:', baseUrl);
        } catch (cacheError) {
            this.console.warn('プロフィール画像のopaqueキャッシュ保存に失敗:', cacheError, baseUrl);
        }

        return response;
    }

    // プロフィール画像をネットワークから取得してキャッシュ
    async fetchAndCacheProfileImage(request) {
        // ネットワーク取得はオフライン時はスキップ
        if (ServiceWorkerDependencies.navigator && ServiceWorkerDependencies.navigator.onLine === false) return null;

        let baseUrl = null;
        try {
            const normalizedUrl = Utilities.normalizeProfileImageUrl(request.url);
            baseUrl = Utilities.getBaseUrl(request.url);
            if (!normalizedUrl || !baseUrl) {
                this.console.warn('プロフィール画像 URL を拒否:', request.url);
                return null;
            }

            const profileFetchRequest = Utilities.createCorsRequest(baseUrl, {
                mode: 'cors',
                cache: 'reload'
            });

            this.console.log('プロフィール画像をネットワークから取得中:', baseUrl);
            const response = await this.fetch(profileFetchRequest);

            if (response && response.ok && response.type !== 'opaque') {
                const cache = await this.caches.open(PROFILE_CACHE_NAME);

                // キャッシュキーは同じ生成ルールで作成（cors のベースRequest）
                const cacheKey = Utilities.createCorsRequest(baseUrl);

                try {
                    // レスポンスをクローンしてキャッシュに保存
                    await cache.put(cacheKey, response.clone());
                    this.console.log('プロフィール画像をキャッシュに保存完了:', baseUrl);
                } catch (cacheError) {
                    // 一部ブラウザや opaque レスポンスでキャッシュに失敗する場合があるので警告のみ
                    this.console.warn('プロフィール画像のキャッシュ保存に失敗:', cacheError, baseUrl);
                }

                // オリジナルのレスポンスを返す
                return response;
            } else {
                this.console.warn('プロフィール画像の取得に失敗または非OKレスポンス:', response && response.type, response && response.status, response && response.statusText);
            }
        } catch (networkError) {
            this.console.log('プロフィール画像のネットワークエラー:', networkError && networkError.message);
            if (baseUrl) {
                return this.fetchAndCacheOpaqueProfileImage(baseUrl);
            }
        }

        return null;
    }

    async handleCustomEmojiImageRequest(request) {
        try {
            const cache = await this.caches.open(CUSTOM_EMOJI_CACHE_NAME);
            const baseUrl = Utilities.getBaseUrl(request.url);
            if (baseUrl) {
                const cachedMatch = await matchCacheByPriority(
                    cache,
                    createBaseCacheLookupEntries(
                        baseUrl,
                        request,
                        Utilities.createCorsRequest,
                    ),
                );
                if (cachedMatch) {
                    return cachedMatch.response;
                }
            }
        } catch (error) {
            this.console.warn('カスタム絵文字キャッシュ取得に失敗:', error);
        }

        return this.fetch(request);
    }

    async cacheOpaqueCustomEmojiImage(cache, baseUrl) {
        const request = Utilities.createCorsRequest(baseUrl, {
            mode: 'no-cors',
            cache: 'reload'
        });
        const response = await this.fetch(request);
        if (!response || response.type !== 'opaque') {
            return false;
        }

        await cache.put(Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' }), response.clone());
        return true;
    }

    async cacheCustomEmojiImages(urls) {
        if (!Array.isArray(urls) || urls.length === 0) {
            return { success: true, cached: 0, failed: 0 };
        }

        const cache = await this.caches.open(CUSTOM_EMOJI_CACHE_NAME);
        let cached = 0;
        let failed = 0;

        for (const rawUrl of [...new Set(urls)].slice(0, 300)) {
            let baseUrl = null;
            try {
                baseUrl = Utilities.getBaseUrl(rawUrl);
                if (!baseUrl) {
                    failed++;
                    continue;
                }

                const request = Utilities.createCorsRequest(baseUrl, {
                    mode: 'cors',
                    cache: 'reload'
                });
                const response = await this.fetch(request);
                if (await Utilities.isCacheableCustomEmojiResponse(response)) {
                    await cache.put(Utilities.createCorsRequest(baseUrl), response.clone());
                    cached++;
                } else {
                    failed++;
                }
            } catch (error) {
                try {
                    if (baseUrl && await this.cacheOpaqueCustomEmojiImage(cache, baseUrl)) {
                        cached++;
                    } else {
                        failed++;
                    }
                } catch (opaqueError) {
                    failed++;
                    this.console.warn('カスタム絵文字画像のopaqueキャッシュ保存に失敗:', opaqueError, rawUrl);
                }
            }
        }

        return { success: true, cached, failed };
    }

    // プロフィール画像キャッシュをクリア
    async clearProfileCache() {
        try {
            const deleted = await this.caches.delete(PROFILE_CACHE_NAME);
            this.console.log('プロフィール画像キャッシュクリア:', deleted);
            return { success: true };
        } catch (err) {
            this.console.error('プロフィールキャッシュクリアエラー:', err);
            return { success: false, error: err.message };
        }
    }

    // 重複プロフィール画像キャッシュのクリーンアップ
    async cleanupDuplicateProfileCache() {
        try {
            const cache = await this.caches.open(PROFILE_CACHE_NAME);
            const keys = await cache.keys();
            const duplicateKeys = getDuplicateProfileCacheRequests(
                keys,
                Utilities.getBaseUrl,
            );

            // 重複するキャッシュエントリを削除
            let deletedCount = 0;
            for (const duplicateKey of duplicateKeys) {
                await cache.delete(duplicateKey);
                deletedCount++;
                this.console.log('重複キャッシュを削除:', duplicateKey.url);
            }

            this.console.log(`重複プロフィールキャッシュクリーンアップ完了: ${deletedCount}件削除`);
            return { success: true, deletedCount };
        } catch (error) {
            this.console.error('重複キャッシュクリーンアップエラー:', error);
            return { success: false, error: error.message };
        }
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
        try {
            const clients = await this.clients.matchAll({ type: 'window', includeUncontrolled: true });
            if (clients.length > 0) {
                return await this.focusAndNotifyClient(clients[0]);
            } else {
                return await this.openNewClient();
            }
        } catch (error) {
            this.console.error('クライアント処理エラー:', error);
            return Utilities.createRedirectResponse(undefined, 'client-error', this.location);
        }
    }

    // 新しいクライアントウィンドウを開いて共有データを渡す
    async openNewClient() {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        // IndexedDBに共有データを永続化（新しいウィンドウからの取得用）
        await persistSharedMediaIfPresent({
            sharedCache,
            persist: async (cache) => {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
            },
            onPersisted: () => {
                this.console.log('SW: Shared media persisted to IndexedDB for new client');
            },
            onError: (dbError) => {
                this.console.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
            },
        });

        // ?shared=true 付きでアプリを新規ウィンドウで開く
        const url = createSharedClientUrl(BASE_PATH, this.location.origin);
        try {
            await this.clients.openWindow(url);
            this.console.log('SW: New client window opened:', url);
        } catch (openError) {
            this.console.warn('SW: Failed to open new window:', openError);
        }

        // createRedirectResponseはfetchイベントのレスポンスとして必要
        return Utilities.createRedirectResponse();
    }

    // 既存クライアント通知の改善
    async focusAndNotifyClient(client) {
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        // 共有データをIndexedDBに永続化（focus/メッセージ送信の成否に関係なく必ず先に実行）
        await persistSharedMediaIfPresent({
            sharedCache,
            persist: async (cache) => {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(cache, indexedDBManager);
            },
            onPersisted: () => {
                this.console.log('SW: Shared media persisted to IndexedDB for fallback');
            },
            onError: (dbError) => {
                this.console.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
            },
        });

        // フォーカス試行（Androidバックグラウンド時は失敗しうるが、エラーにしない）
        try {
            await client.focus();
        } catch (focusError) {
            this.console.warn('SW: Client focus failed (may be backgrounded):', focusError);
        }

        this.console.log('SW: Attempting to notify client', {
            hasClient: !!client,
            hasPostMessage: typeof client.postMessage === 'function',
            hasSharedCache: !!sharedCache,
            clientId: client.id || 'unknown'
        });

        // メッセージ送信（失敗してもエラーにしない）
        if (client && typeof client.postMessage === 'function') {
            try {
                const message = createClientSharedMediaNotification(sharedCache);
                client.postMessage(message);
                this.console.log('SW: Message sent to client successfully');
            } catch (messageError) {
                this.console.warn('SW: Failed to send message to client (will rely on IndexedDB fallback):', messageError);
            }
        }

        // メッセージ送信の成否に関係なく、リダイレクトは成功とする
        // IndexedDBに保存されているため、クライアント側でフォールバック取得可能
        return Utilities.createRedirectResponse();
    }

    // IndexedDBに共有メディアデータを永続化（複数メディア対応、サイズ上限付き）
    async persistSharedMediaToIndexedDB(sharedData, indexedDBManager) {
        const record = await buildSharedMediaIndexedDbRecord({
            sharedData,
            maxFileSize: MAX_INDEXEDDB_FILE_SIZE,
            recordId: SHARED_MEDIA_RECORD_ID,
            schemaVersion: SHARED_MEDIA_SCHEMA_VERSION,
        });

        await indexedDBManager.putSharedMedia(record);
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
        try {
            this.console.log('SW: Processing upload request', request.url);

            const formData = await request.formData();
            const extractedData = await Utilities.extractMediaFromFormData(formData);

            if (!extractedData) {
                this.console.warn('SW: No media data found in FormData');
                return await resolveUploadRequestOutcome({
                    extractedData,
                    location: this.location,
                    redirectClient: () => this.clientManager.redirectClient(),
                    createRedirectResponse: Utilities.createRedirectResponse,
                    setSharedMediaCache: (sharedMedia) =>
                        ServiceWorkerState.setSharedMediaCache(sharedMedia),
                });
            }

            this.console.log(
                'SW: Media data extracted successfully',
                summarizeExtractedSharedMedia(extractedData),
            );

            return await resolveUploadRequestOutcome({
                extractedData,
                location: this.location,
                redirectClient: () => this.clientManager.redirectClient(),
                createRedirectResponse: Utilities.createRedirectResponse,
                setSharedMediaCache: (sharedMedia) =>
                    ServiceWorkerState.setSharedMediaCache(sharedMedia),
            });
        } catch (error) {
            this.console.error('SW: Upload processing error:', error);
            return Utilities.createRedirectResponse(undefined, 'processing-error', this.location);
        }
    }

    // プロフィール画像リクエスト処理
    async handleProfileImageRequest(request) {
        try {
            this.console.log('プロフィール画像リクエスト処理開始:', request.url);

            const result = await resolveProfileImageRequestResult({
                request,
                normalizeProfileImageUrl: Utilities.normalizeProfileImageUrl,
                handleProfileImageCache: (profileRequest) =>
                    this.cacheManager.handleProfileImageCache(profileRequest),
                fetchAndCacheProfileImage: (profileRequest) =>
                    this.cacheManager.fetchAndCacheProfileImage(profileRequest),
                createTransparentImageResponse: Utilities.createTransparentImageResponse,
            });

            if (result.source === 'policy-blocked') {
                this.console.warn('プロフィール画像 URL がポリシー外のため transparent image を返却:', request.url);
                return result.response;
            }

            if (result.source === 'cache') {
                this.console.log('プロフィール画像をキャッシュから返却:', request.url);
                return result.response;
            }

            if (result.source === 'network') {
                this.console.log('プロフィール画像をネットワークから返却:', request.url);
                return result.response;
            }

            this.console.log('フォールバック画像を返却:', request.url);
            return result.response;

        } catch (error) {
            this.console.error('プロフィール画像処理エラー:', error);
            return Utilities.createTransparentImageResponse(404);
        }
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
        ServiceWorkerDependencies.console.log('SW installing...', SW_VERSION);
        ServiceWorkerDependencies.console.log('SW installed, waiting for user action');
    }

    // アクティベートイベント処理
    async handleActivate(event) {
        ServiceWorkerDependencies.console.log('SW activating...', SW_VERSION);
        await this.cacheManager.cleanupOldCaches();
        await ServiceWorkerDependencies.clients.claim();
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

        if (route === 'upload') {
            ServiceWorkerDependencies.console.log('SW: 内部アップロードリクエストを処理', url.href);
        }

        if (route === 'profile-image') {
            if (url.origin !== ServiceWorkerDependencies.location.origin) {
                ServiceWorkerDependencies.console.log('SW: 外部プロフィール画像リクエストを処理:', event.request.url);
            }
        }

        return await dispatchServiceWorkerFetchRoute({
            route,
            uploadHandler: () => this.requestHandler.handleUploadRequest(event.request),
            profileImageHandler: () => this.requestHandler.handleProfileImageRequest(event.request),
            customEmojiImageHandler: () => this.cacheManager.handleCustomEmojiImageRequest(event.request),
        });
    }

    // メッセージイベント処理
    async handleMessage(event) {
        const route = resolveServiceWorkerMessageRoute(event.data);
        await dispatchServiceWorkerMessageRoute({
            route,
            messageHandlers: createServiceWorkerTypeMessageHandlers({
                event,
                version: SW_VERSION,
                skipWaiting: () => self.skipWaiting(),
                logger: ServiceWorkerDependencies.console,
                createVersion: createVersionResponse,
                createPingTest: createPingTestResponse,
                postPortResponse: postPortEventResponse,
                postMessageResponse: postMessageEventResponse,
            }),
            actionHandlers: createServiceWorkerActionHandlers({
                event,
                messageHandler: this.messageHandler,
                cacheManager: this.cacheManager,
                postPortResponse: postPortEventResponse,
            }),
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
