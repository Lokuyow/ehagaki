// 定数定義
const PRECACHE_VERSION = '1.11.0';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;
const PROFILE_CACHE_NAME = 'ehagaki-profile-images';
const INDEXEDDB_NAME = 'eHagakiSharedData';
const INDEXEDDB_VERSION = 1;

// ベースパスの動的計算（GitHub Pagesなどのサブディレクトリ対応）
const BASE_PATH = (() => {
    const pathname = self.location.pathname;
    // sw.jsのファイル名を除いたパスをベースパスとする
    const pathParts = pathname.split('/').filter(p => p && p !== 'sw.js');
    return pathParts.length > 0 ? '/' + pathParts.join('/') + '/' : '/';
})();

// マニフェスト注入ポイントの確実な初期化
let PRECACHE_MANIFEST = [];
try {
    // Workboxによるマニフェスト注入
    PRECACHE_MANIFEST = self.__WB_MANIFEST || [];
    if (PRECACHE_MANIFEST.length === 0) {
        console.warn('SW: Precache manifest is empty');
    } else {
        console.log(`SW: Precache manifest loaded with ${PRECACHE_MANIFEST.length} entries`);
    }
} catch (error) {
    console.error('SW: Failed to load precache manifest:', error);
    PRECACHE_MANIFEST = [];
}

// グローバル状態管理
const ServiceWorkerState = {
    sharedImageCache: null,
    precacheManifest: PRECACHE_MANIFEST,

    getSharedImageCache() {
        return this.sharedImageCache;
    },

    setSharedImageCache(data) {
        this.sharedImageCache = data;
    },

    clearSharedImageCache() {
        this.sharedImageCache = null;
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
    // mode をオプション化してプロフィール取得時に 'no-cors' を選べるようにする
    createCorsRequest(url, options = {}) {
        const mode = options.mode || 'cors'; // default 'cors', can be overridden to 'no-cors'
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
        const urlObj = new URL(url);
        return `${urlObj.origin}${urlObj.pathname}`;
    },

    // リダイレクトレスポンス
    createRedirectResponse(path = BASE_PATH, error = null, location = ServiceWorkerDependencies.location) {
        const url = new URL(path, location.origin);
        if (error) {
            url.searchParams.set('shared', 'true');
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

    // 共有画像データから FormData を抽出
    async extractImageFromFormData(formData) {
        const image = formData.get('image');
        if (!image) return null;

        return {
            image,
            metadata: {
                name: image.name,
                type: image.type,
                size: image.size,
                timestamp: new Date().toISOString()
            }
        };
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
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('flags')) {
                        db.createObjectStore('flags', { keyPath: 'id' });
                    }
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

    // 共有フラグを保存
    async saveSharedFlag() {
        return this.executeOperation((db, resolve, reject) => {
            const tx = db.transaction(['flags'], 'readwrite');
            const store = tx.objectStore('flags');
            store.put({ id: 'sharedImage', timestamp: Date.now(), value: true }).onsuccess = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                reject(new Error('Failed to store shared flag'));
            };
        });
    }

    // 共有フラグを削除
    async clearSharedFlag() {
        try {
            await this.executeOperation((db, resolve) => {
                if (!db.objectStoreNames.contains('flags')) {
                    db.close();
                    resolve();
                    return;
                }
                const tx = db.transaction(['flags'], 'readwrite');
                const store = tx.objectStore('flags');
                store.delete('sharedImage').onsuccess = () => {
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

    // プリキャッシュの実行を改善
    async precacheResources(manifest) {
        if (!manifest || manifest.length === 0) {
            this.console.warn('SW: No resources to precache');
            return;
        }

        try {
            const cache = await this.caches.open(PRECACHE_NAME);
            const urls = manifest.map(entry => {
                // エントリが文字列の場合とオブジェクトの場合に対応
                if (typeof entry === 'string') {
                    return entry;
                } else if (entry && typeof entry === 'object' && entry.url) {
                    return entry.url;
                } else {
                    this.console.warn('SW: Invalid manifest entry:', entry);
                    return null;
                }
            }).filter(Boolean);

            if (urls.length > 0) {
                // バッチサイズを小さくしてVercel環境での成功率を向上
                const batchSize = 10;
                for (let i = 0; i < urls.length; i += batchSize) {
                    const batch = urls.slice(i, i + batchSize);
                    try {
                        await cache.addAll(batch);
                        this.console.log(`SW: Cached batch ${Math.floor(i / batchSize) + 1}: ${batch.length} resources`);
                    } catch (batchError) {
                        this.console.error(`SW: Failed to cache batch ${Math.floor(i / batchSize) + 1}:`, batchError);
                        // 個別にリトライ
                        for (const url of batch) {
                            try {
                                await cache.add(url);
                            } catch (individualError) {
                                this.console.error(`SW: Failed to cache individual resource: ${url}`, individualError);
                            }
                        }
                    }
                }
                this.console.log(`SW: Successfully cached ${urls.length} resources`);
            } else {
                this.console.warn('SW: No valid URLs to cache');
            }
        } catch (error) {
            this.console.error('SW: Precache error:', error);
        }
    }

    // 古いキャッシュの削除
    async cleanupOldCaches() {
        try {
            const cacheNames = await this.caches.keys();
            await Promise.all(
                cacheNames.map(name => {
                    // プリキャッシュとプロフィール画像キャッシュは保護する
                    if (name !== PRECACHE_NAME && name !== PROFILE_CACHE_NAME) {
                        return this.caches.delete(name);
                    }
                    return undefined;
                })
            );
        } catch (error) {
            this.console.error('キャッシュクリーンアップエラー:', error);
        }
    }

    // Cache First戦略
    async handleCacheFirst(request) {
        try {
            const cache = await this.caches.open(PRECACHE_NAME);
            const cached = await cache.match(request);
            if (cached) return cached;

            const network = await this.fetch(request);
            if (network.ok && request.method === 'GET') {
                await cache.put(request, network.clone());
            }
            return network;
        } catch (error) {
            this.console.error('キャッシュ戦略エラー:', error);
            return new Response('Not Found', { status: 404 });
        }
    }

    // プロフィール画像キャッシュの処理
    async handleProfileImageCache(request) {
        try {
            const cache = await this.caches.open(PROFILE_CACHE_NAME);
            const baseUrl = Utilities.getBaseUrl(request.url);

            // キャッシュキーは fetch時と同じ生成方法（no-cors モードのベースRequest）で検索する
            const baseRequest = Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' });

            // まずベースURLで検索
            const cachedBase = await cache.match(baseRequest);
            if (cachedBase) {
                this.console.log('プロフィール画像をキャッシュから返却（ベースURL）:', baseUrl);
                return cachedBase;
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

    // プロフィール画像をネットワークから取得してキャッシュ
    async fetchAndCacheProfileImage(request) {
        // ネットワーク取得はオフライン時はスキップ
        if (ServiceWorkerDependencies.navigator && ServiceWorkerDependencies.navigator.onLine === false) return null;

        try {
            const baseUrl = Utilities.getBaseUrl(request.url);

            // クロスオリジン画像は no-cors リクエストで取得（サーバの CORS 設定に依存せず取得可能）
            const profileFetchRequest = Utilities.createCorsRequest(baseUrl, {
                mode: 'no-cors',
                headers: { 'Cache-Control': 'no-cache' },
                cache: 'no-cache'
            });

            this.console.log('プロフィール画像をネットワークから取得中:', baseUrl);
            const response = await this.fetch(profileFetchRequest);

            // opaque（no-cors の不透明レスポンス）も許容してキャッシュする
            if (response && (response.ok || response.type === 'opaque')) {
                const cache = await this.caches.open(PROFILE_CACHE_NAME);

                // キャッシュキーは同じ生成ルールで作成（no-cors のベースRequest）
                const cacheKey = Utilities.createCorsRequest(baseUrl, { mode: 'no-cors' });

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
        }

        return null;
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

    // 既存クライアント通知の改善
    async focusAndNotifyClient(client) {
        try {
            await client.focus();
            const sharedCache = ServiceWorkerState.getSharedImageCache();

            this.console.log('SW: Attempting to notify client', {
                hasClient: !!client,
                hasPostMessage: typeof client.postMessage === 'function',
                hasSharedCache: !!sharedCache,
                clientId: client.id || 'unknown'
            });

            // 共有データをIndexedDBに永続化（メッセージ送信に関係なく必ず実行）
            if (sharedCache) {
                try {
                    const indexedDBManager = new IndexedDBManager();
                    await this.persistSharedImageToIndexedDB(sharedCache, indexedDBManager);
                    this.console.log('SW: Shared image persisted to IndexedDB for fallback');
                } catch (dbError) {
                    this.console.warn('SW: Failed to persist shared image to IndexedDB:', dbError);
                }
            }

            // メッセージ送信（失敗してもエラーにしない）
            if (client && typeof client.postMessage === 'function') {
                try {
                    client.postMessage({
                        type: 'SHARED_IMAGE',
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

        } catch (error) {
            this.console.error('SW: Client focus/notification error:', error);
            // 重大なエラーの場合のみエラーリダイレクト
            return Utilities.createRedirectResponse(undefined, 'client-error', this.location);
        }
    }

    // IndexedDBに共有画像データを永続化
    async persistSharedImageToIndexedDB(sharedData, indexedDBManager) {
        return indexedDBManager.executeOperation((db, resolve, reject) => {
            const tx = db.transaction(['flags'], 'readwrite');
            const store = tx.objectStore('flags');

            // 共有画像データを保存（フォールバック用）
            const sharedImageData = {
                id: 'sharedImageData',
                timestamp: Date.now(),
                data: {
                    image: {
                        name: sharedData.image?.name,
                        type: sharedData.image?.type,
                        size: sharedData.image?.size,
                        // Fileオブジェクトは直接保存できないため、後でBlobから再構築する
                        _isFile: true
                    },
                    metadata: sharedData.metadata
                }
            };

            // FileオブジェクトをArrayBufferに変換して保存
            if (sharedData.image instanceof File) {
                sharedData.image.arrayBuffer().then(buffer => {
                    sharedImageData.data.image.arrayBuffer = buffer;

                    store.put(sharedImageData).onsuccess = () => {
                        db.close();
                        resolve();
                    };
                }).catch(error => {
                    db.close();
                    reject(error);
                });
            } else {
                store.put(sharedImageData).onsuccess = () => {
                    db.close();
                    resolve();
                };
            }

            tx.onerror = () => {
                db.close();
                reject(new Error('Failed to persist shared image data'));
            };
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

    // 共有画像リクエスト応答
    respondSharedImage(event) {
        const client = event.source;
        const requestId = event.data.requestId || null;
        const sharedCache = ServiceWorkerState.getSharedImageCache();

        const msg = {
            type: 'SHARED_IMAGE',
            data: sharedCache,
            requestId,
            timestamp: Date.now()
        };

        if (event.ports?.[0]) {
            event.ports[0].postMessage(msg);
        } else if (client) {
            client.postMessage(msg);
        }

        // 画像送信後すぐキャッシュとフラグをクリア
        if (sharedCache) {
            ServiceWorkerState.clearSharedImageCache();
            this.indexedDBManager.clearSharedFlag();
        }
    }

    // 強制的な共有画像取得リクエスト（フォールバック用）
    respondSharedImageForce(event) {
        const client = event.source;
        const requestId = event.data.requestId || null;
        const sharedCache = ServiceWorkerState.getSharedImageCache();

        // キャッシュがない場合でもIndexedDBから取得を試みる
        if (!sharedCache) {
            this.console.log('SW: No shared cache, client should try IndexedDB fallback');
        }

        const msg = {
            type: 'SHARED_IMAGE',
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

        // 強制取得では画像送信後もキャッシュをクリアしない
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
            const extractedData = await Utilities.extractImageFromFormData(formData);

            if (!extractedData) {
                this.console.warn('SW: No image data found in FormData');
                return Utilities.createRedirectResponse(undefined, 'no-image', this.location);
            }

            this.console.log('SW: Image data extracted successfully', {
                hasImage: !!extractedData.image,
                imageType: extractedData.image?.type,
                imageSize: extractedData.image?.size,
                imageName: extractedData.image?.name
            });

            ServiceWorkerState.setSharedImageCache(extractedData);

            // IndexedDB保存を同期的に待つ
            try {
                await this.indexedDBManager.saveSharedFlag();
                this.console.log('SW: Shared flag saved to IndexedDB');
            } catch (dbError) {
                this.console.error('SW: IndexedDB save error:', dbError);
                // IndexedDBエラーでも続行
            }

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
        ServiceWorkerDependencies.console.log('SW installing...', PRECACHE_VERSION);
        await this.cacheManager.precacheResources(ServiceWorkerState.precacheManifest);
        ServiceWorkerDependencies.console.log('SW installed, waiting for user action');
    }

    // アクティベートイベント処理
    async handleActivate(event) {
        ServiceWorkerDependencies.console.log('SW activating...', PRECACHE_VERSION);
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
        // 同一オリジンの通常リクエスト
        else {
            return await this.cacheManager.handleCacheFirst(event.request);
        }
    }

    // メッセージイベント処理
    async handleMessage(event) {
        const messageHandlers = {
            'SKIP_WAITING': () => {
                ServiceWorkerDependencies.console.log('SW received SKIP_WAITING, updating...');
                self.skipWaiting();
            },
            'GET_VERSION': () => {
                event.ports?.[0]?.postMessage({ version: PRECACHE_VERSION });
            },
            'PING_TEST': () => {
                // Service Worker通信テスト用
                const response = { type: 'PONG', timestamp: Date.now(), version: PRECACHE_VERSION };
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
            'getSharedImage': () => this.messageHandler.respondSharedImage(event),
            'getSharedImageForce': () => this.messageHandler.respondSharedImageForce(event),
            'clearProfileCache': async () => {
                const result = await this.cacheManager.clearProfileCache();
                event.ports?.[0]?.postMessage(result);
            },
            'cleanupDuplicateProfileCache': async () => {
                const result = await this.cacheManager.cleanupDuplicateProfileCache();
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

    // 同一オリジンのリクエストを厳密に判定して処理
    if (new URL(event.request.url).origin === self.location.origin) {
        const response = serviceWorkerCore.handleFetch(event);
        if (response !== undefined) {
            event.respondWith(response);
        }
    }
    // 外部ドメインのプロフィール画像リクエストも処理
    else if (Utilities.isProfileImageRequest(event.request)) {
        ServiceWorkerDependencies.console.log('SW: 外部プロフィール画像リクエストを処理:', event.request.url);
        event.respondWith(serviceWorkerCore.requestHandler.handleProfileImageRequest(event.request));
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
        PRECACHE_VERSION,
        PRECACHE_NAME,
        PROFILE_CACHE_NAME,
        INDEXEDDB_NAME,
        INDEXEDDB_VERSION
    };
}