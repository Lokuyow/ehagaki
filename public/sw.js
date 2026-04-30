import {
    getProfilePictureCacheKeyUrl,
    normalizeProfilePictureUrl,
} from "../src/lib/profilePictureUrlUtils";
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

// 透明な1x1ピクセルPNG画像データ
const TRANSPARENT_PNG_DATA = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

const Utilities = {
    // 透明画像レスポンスを生成
    createTransparentImageResponse(statusCode = 200) {
        return new Response(TRANSPARENT_PNG_DATA, {
            status: statusCode,
            statusText: statusCode === 200 ? 'OK' : 'Error',
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': statusCode === 200 ? 'max-age=31536000' : 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        });
    },

    // 共通のHTTPリクエスト作成
    createCorsRequest(url, options = {}) {
        const mode = options.mode || 'cors';
        const headers = new Headers({
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            ...(options.headers || {})
        });
        return new Request(url, {
            method: 'GET',
            headers,
            mode,
            credentials: 'omit',
            cache: options.cache || 'default',
            redirect: 'follow',
            ...options
        });
    },

    // URLからベースURL（クエリパラメータなし）を取得
    getBaseUrl(url) {
        return getProfilePictureCacheKeyUrl(url, {
            currentOrigin: ServiceWorkerDependencies.location.origin
        });
    },

    // リダイレクトレスポンス
    createRedirectResponse(path = BASE_PATH, error = null, location = ServiceWorkerDependencies.location, { shared = true } = {}) {
        const url = new URL(path, location.origin);
        if (shared) {
            url.searchParams.set('shared', 'true');
        }
        if (error) {
            url.searchParams.set('error', error);
        }
        return Response.redirect(url.href, 303);
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
        const mediaFiles = formData.getAll('media');
        if (!mediaFiles || mediaFiles.length === 0) return null;

        // File以外の値（文字列等）を除外
        const validFiles = mediaFiles.filter(f => f instanceof File && f.size > 0);
        if (validFiles.length === 0) return null;

        return {
            images: validFiles,
            metadata: validFiles.map(f => ({
                name: f.name,
                type: f.type,
                size: f.size,
                timestamp: new Date().toISOString()
            }))
        };
    }
};

// =============================================================================
// IndexedDB操作クラス
// =============================================================================

function createObjectStoreIfMissing(db, name, keyPath, indexes = []) {
    if (db.objectStoreNames.contains(name)) return;

    const store = db.createObjectStore(name, { keyPath });
    indexes.forEach((index) => {
        store.createIndex(index.name, index.keyPath);
    });
}

function ensureCurrentEHagakiDbSchema(db) {
    createObjectStoreIfMissing(db, 'meta', 'key', [
        { name: 'updatedAt', keyPath: 'updatedAt' }
    ]);
    createObjectStoreIfMissing(db, 'emojiItems', 'id', [
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'identityKey', keyPath: 'identityKey' },
        { name: 'shortcodeLower', keyPath: 'shortcodeLower' },
        { name: 'sortIndex', keyPath: 'sortIndex' },
        { name: 'sourceType', keyPath: 'sourceType' },
        { name: 'sourceAddress', keyPath: 'sourceAddress' },
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: '[pubkeyHex+sortIndex]', keyPath: ['pubkeyHex', 'sortIndex'] },
        { name: '[pubkeyHex+identityKey]', keyPath: ['pubkeyHex', 'identityKey'] }
    ]);
    createObjectStoreIfMissing(db, 'emojiCacheMeta', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' }
    ]);
    createObjectStoreIfMissing(db, 'drafts', 'id', [
        { name: 'scopeKey', keyPath: 'scopeKey' },
        { name: 'pubkeyHex', keyPath: 'pubkeyHex' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: '[scopeKey+updatedAt]', keyPath: ['scopeKey', 'updatedAt'] }
    ]);
    createObjectStoreIfMissing(db, 'profiles', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'updatedAtFromEvent', keyPath: 'updatedAtFromEvent' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' }
    ]);
    createObjectStoreIfMissing(db, 'relayConfigs', 'pubkeyHex', [
        { name: 'fetchedAt', keyPath: 'fetchedAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'updatedAtFromEvent', keyPath: 'updatedAtFromEvent' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' }
    ]);
    createObjectStoreIfMissing(db, SHARED_MEDIA_STORE_NAME, 'id', [
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' }
    ]);
    createObjectStoreIfMissing(db, 'hashtagHistory', 'tagLower', [
        { name: 'useCount', keyPath: 'useCount' },
        { name: 'lastUsed', keyPath: 'lastUsed' },
        { name: 'updatedAt', keyPath: 'updatedAt' },
        { name: 'schemaVersion', keyPath: 'schemaVersion' }
    ]);
}

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
                    ensureCurrentEHagakiDbSchema(e.target.result);
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
            await Promise.all(
                cacheNames.map(name => {
                    if (
                        name.startsWith(LEGACY_PRECACHE_PREFIX) ||
                        LEGACY_PROFILE_CACHE_NAMES.includes(name) ||
                        LEGACY_CUSTOM_EMOJI_CACHE_NAMES.includes(name)
                    ) {
                        return this.caches.delete(name);
                    }
                    return undefined;
                })
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

            // キャッシュキーは fetch時と同じ生成方法（cors モードのベースRequest）で検索する
            const baseRequest = Utilities.createCorsRequest(baseUrl);

            // まずベースURLで検索
            const cachedBase = await cache.match(baseRequest);
            if (cachedBase) {
                this.console.log('プロフィール画像をキャッシュから返却（ベースURL）:', baseUrl);
                return cachedBase;
            }

            const opaqueBaseRequest = Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' });
            const cachedOpaqueBase = await cache.match(opaqueBaseRequest);
            if (cachedOpaqueBase) {
                this.console.log('プロフィール画像をopaqueキャッシュから返却（ベースURL）:', baseUrl);
                return cachedOpaqueBase;
            }

            // 互換性のため、元のリクエストでも検索
            const cached = await cache.match(request);
            if (cached) {
                this.console.log('プロフィール画像をキャッシュから返却（元URL）:', request.url);
                return cached;
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
                const cacheKey = Utilities.createCorsRequest(baseUrl);
                const cachedBase = await cache.match(cacheKey);
                if (cachedBase) {
                    return cachedBase;
                }

                const opaqueCacheKey = Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' });
                const cachedOpaqueBase = await cache.match(opaqueCacheKey);
                if (cachedOpaqueBase) {
                    return cachedOpaqueBase;
                }
            }

            const cached = await cache.match(request);
            if (cached) {
                return cached;
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

            const baseUrls = new Set();
            const duplicateKeys = [];

            // ベースURLとクエリ付きURLを識別
            keys.forEach(request => {
                const url = new URL(request.url);
                const baseUrl = Utilities.getBaseUrl(request.url);
                if (!baseUrl) {
                    return;
                }

                if (url.search) {
                    // クエリパラメータ付きのURLは重複候補
                    duplicateKeys.push(request);
                } else {
                    // ベースURLを記録
                    baseUrls.add(baseUrl);
                }
            });

            // 重複するキャッシュエントリを削除
            let deletedCount = 0;
            for (const duplicateKey of duplicateKeys) {
                const baseUrl = Utilities.getBaseUrl(duplicateKey.url);
                if (!baseUrl) {
                    continue;
                }

                // ベースURLが既にキャッシュされている場合、クエリ付きを削除
                if (baseUrls.has(baseUrl)) {
                    await cache.delete(duplicateKey);
                    deletedCount++;
                    this.console.log('重複キャッシュを削除:', duplicateKey.url);
                }
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
        if (sharedCache) {
            try {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(sharedCache, indexedDBManager);
                this.console.log('SW: Shared media persisted to IndexedDB for new client');
            } catch (dbError) {
                this.console.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
            }
        }

        // ?shared=true 付きでアプリを新規ウィンドウで開く
        const url = new URL(BASE_PATH, this.location.origin);
        url.searchParams.set('shared', 'true');
        try {
            await this.clients.openWindow(url.href);
            this.console.log('SW: New client window opened:', url.href);
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
        if (sharedCache) {
            try {
                const indexedDBManager = new IndexedDBManager();
                await this.persistSharedMediaToIndexedDB(sharedCache, indexedDBManager);
                this.console.log('SW: Shared media persisted to IndexedDB for fallback');
            } catch (dbError) {
                this.console.warn('SW: Failed to persist shared media to IndexedDB:', dbError);
            }
        }

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
                client.postMessage({
                    type: 'SHARED_MEDIA',
                    data: sharedCache,
                    timestamp: Date.now(),
                    requestId: `sw-${Date.now()}`
                });
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
        const mediaFiles = sharedData.images || (sharedData.image ? [sharedData.image] : []);

        const mediaDataList = await Promise.all(
            mediaFiles.map(async (file) => {
                if (!(file instanceof File)) {
                    throw new Error('Shared media item is not a File');
                }
                if (file.size > MAX_INDEXEDDB_FILE_SIZE) {
                    throw new Error(`File too large for IndexedDB persistence: ${file.name}`);
                }

                return {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified || Date.now(),
                    arrayBuffer: await file.arrayBuffer()
                };
            })
        );

        const timestamp = Date.now();
        await indexedDBManager.putSharedMedia({
            id: SHARED_MEDIA_RECORD_ID,
            images: mediaDataList,
            metadata: sharedData.metadata,
            createdAt: timestamp,
            updatedAt: timestamp,
            schemaVersion: SHARED_MEDIA_SCHEMA_VERSION
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

    // 共有メディアリクエスト応答
    respondSharedMedia(event) {
        const client = event.source;
        const requestId = event.data.requestId || null;
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        const msg = {
            type: 'SHARED_MEDIA',
            data: sharedCache,
            requestId,
            timestamp: Date.now()
        };

        if (event.ports?.[0]) {
            event.ports[0].postMessage(msg);
        } else if (client) {
            client.postMessage(msg);
        }

        // メディア送信後すぐキャッシュと永続化レコードをクリア
        if (sharedCache) {
            ServiceWorkerState.clearSharedMediaCache();
            this.indexedDBManager.clearSharedMedia();
        }
    }

    // 強制的な共有メディア取得リクエスト（フォールバック用）
    respondSharedMediaForce(event) {
        const client = event.source;
        const requestId = event.data.requestId || null;
        const sharedCache = ServiceWorkerState.getSharedMediaCache();

        // キャッシュがない場合でもIndexedDBから取得を試みる
        if (!sharedCache) {
            this.console.log('SW: No shared cache, client should try IndexedDB fallback');
        }

        const msg = {
            type: 'SHARED_MEDIA',
            data: sharedCache,
            requestId,
            timestamp: Date.now(),
            fallbackRequired: !sharedCache
        };

        if (event.ports?.[0]) {
            event.ports[0].postMessage(msg);
        } else if (client) {
            client.postMessage(msg);
        }

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
                return Utilities.createRedirectResponse(undefined, 'no-image', this.location);
            }

            this.console.log('SW: Media data extracted successfully', {
                hasImages: !!extractedData.images,
                imageCount: extractedData.images?.length,
                firstImageType: extractedData.images?.[0]?.type,
                firstImageSize: extractedData.images?.[0]?.size
            });

            ServiceWorkerState.setSharedMediaCache(extractedData);

            return await this.clientManager.redirectClient();
        } catch (error) {
            this.console.error('SW: Upload processing error:', error);
            return Utilities.createRedirectResponse(undefined, 'processing-error', this.location);
        }
    }

    // プロフィール画像リクエスト処理
    async handleProfileImageRequest(request) {
        try {
            this.console.log('プロフィール画像リクエスト処理開始:', request.url);

            const normalizedUrl = Utilities.normalizeProfileImageUrl(request.url);
            if (!normalizedUrl) {
                this.console.warn('プロフィール画像 URL がポリシー外のため transparent image を返却:', request.url);
                return Utilities.createTransparentImageResponse();
            }

            // まずキャッシュから検索
            const cached = await this.cacheManager.handleProfileImageCache(request);
            if (cached) {
                this.console.log('プロフィール画像をキャッシュから返却:', request.url);
                return cached;
            }

            // キャッシュにない場合、ネットワークから取得してキャッシュ
            const networkResponse = await this.cacheManager.fetchAndCacheProfileImage(request);
            if (networkResponse) {
                this.console.log('プロフィール画像をネットワークから返却:', request.url);
                return networkResponse;
            }

            // すべて失敗した場合はフォールバック画像
            this.console.log('フォールバック画像を返却:', request.url);
            return Utilities.createTransparentImageResponse();

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

        // 同一オリジンのリクエストのみ処理（外部リクエストはここに来ない）
        if (Utilities.isUploadRequest(event.request, url)) {
            ServiceWorkerDependencies.console.log('SW: 内部アップロードリクエストを処理', url.href);
            return await this.requestHandler.handleUploadRequest(event.request);
        }
        // プロフィール画像リクエスト
        else if (Utilities.isProfileImageRequest(event.request)) {
            return await this.requestHandler.handleProfileImageRequest(event.request);
        }

        return undefined;
    }

    // メッセージイベント処理
    async handleMessage(event) {
        const messageHandlers = {
            'SKIP_WAITING': () => {
                ServiceWorkerDependencies.console.log('SW received SKIP_WAITING, updating...');
                self.skipWaiting();
            },
            'GET_VERSION': () => {
                event.ports?.[0]?.postMessage({ version: SW_VERSION });
            },
            'PING_TEST': () => {
                // Service Worker通信テスト用
                const response = { type: 'PONG', timestamp: Date.now(), version: SW_VERSION };
                try {
                    if (event.ports?.[0]) {
                        event.ports[0].postMessage(response);
                        ServiceWorkerDependencies.console.log('SW: PING_TEST responded via MessageChannel');
                    } else if (event.source) {
                        event.source.postMessage(response);
                        ServiceWorkerDependencies.console.log('SW: PING_TEST responded via source');
                    } else {
                        ServiceWorkerDependencies.console.warn('SW: PING_TEST no response channel available');
                    }
                } catch (error) {
                    ServiceWorkerDependencies.console.error('SW: PING_TEST response error:', error);
                }
            }
        };

        const actionHandlers = {
            'getSharedMedia': () => this.messageHandler.respondSharedMedia(event),
            'getSharedMediaForce': () => this.messageHandler.respondSharedMediaForce(event),
            'clearProfileCache': async () => {
                const result = await this.cacheManager.clearProfileCache();
                event.ports?.[0]?.postMessage(result);
            },
            'cleanupDuplicateProfileCache': async () => {
                const result = await this.cacheManager.cleanupDuplicateProfileCache();
                event.ports?.[0]?.postMessage(result);
            },
            'cacheCustomEmojiImages': async () => {
                const result = await this.cacheManager.cacheCustomEmojiImages(event.data?.urls);
                event.ports?.[0]?.postMessage(result);
            }
        };

        const { type, action } = event.data || {};

        if (type && messageHandlers[type]) {
            messageHandlers[type]();
        } else if (action && actionHandlers[action]) {
            await actionHandlers[action]();
        }
    }
}

// =============================================================================
// サービスワーカーのセットアップとイベントリスナー
// =============================================================================

const serviceWorkerCore = new ServiceWorkerCore();

// installイベント（skipWaitingは手動制御）
self.addEventListener('install', (event) => {
    event.waitUntil(serviceWorkerCore.handleInstall(event));
});

// activateイベント
self.addEventListener('activate', (event) => {
    event.waitUntil(serviceWorkerCore.handleActivate(event));
});

// fetchイベント
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 通常の同一オリジンGETはWorkbox precache/runtime routeに任せる
    if (url.origin === self.location.origin && Utilities.isUploadRequest(event.request, url)) {
        event.respondWith(serviceWorkerCore.requestHandler.handleUploadRequest(event.request));
    } else if (Utilities.isProfileImageRequest(event.request)) {
        if (url.origin !== self.location.origin) {
            ServiceWorkerDependencies.console.log('SW: 外部プロフィール画像リクエストを処理:', event.request.url);
        }
        event.respondWith(serviceWorkerCore.requestHandler.handleProfileImageRequest(event.request));
    } else if (event.request.method === 'GET' && event.request.destination === 'image') {
        event.respondWith(serviceWorkerCore.cacheManager.handleCustomEmojiImageRequest(event.request));
    }
});

// messageイベント
self.addEventListener('message', (event) => {
    serviceWorkerCore.handleMessage(event);
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
