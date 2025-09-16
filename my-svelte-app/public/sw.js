// 定数定義
const PRECACHE_VERSION = '1.3.0';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;
const PROFILE_CACHE_NAME = 'ehagaki-profile-images';
const INDEXEDDB_NAME = 'eHagakiSharedData';
const INDEXEDDB_VERSION = 1;

let sharedImageCache = null;
const precacheManifest = self.__WB_MANIFEST || [];

// 共通ユーティリティ関数

// 透明な1x1ピクセルPNG画像データ
const TRANSPARENT_PNG_DATA = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

// 透明画像レスポンスを生成
function createTransparentImageResponse(statusCode = 200) {
    return new Response(TRANSPARENT_PNG_DATA, {
        status: statusCode,
        statusText: statusCode === 200 ? 'OK' : 'Error',
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': statusCode === 200 ? 'max-age=31536000' : 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// 共通のHTTPリクエスト作成
function createCorsRequest(url, options = {}) {
    return new Request(url, {
        method: 'GET',
        headers: new Headers({
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            ...options.headers
        }),
        mode: 'cors',
        credentials: 'omit',
        ...options
    });
}

// URLからベースURL（クエリパラメータなし）を取得
function getBaseUrl(url) {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
}

// IndexedDB操作の共通処理
function indexedDBOperation(operation) {
    return new Promise((resolve, reject) => {
        try {
            const req = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION);

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

// installイベント（skipWaitingは手動制御）
self.addEventListener('install', (event) => {
    console.log('SW installing...', PRECACHE_VERSION);
    event.waitUntil(
        (async () => {
            if (precacheManifest.length > 0) {
                try {
                    const cache = await caches.open(PRECACHE_NAME);
                    const urls = precacheManifest.map(entry => entry.url);
                    await cache.addAll(urls);
                    console.log('SW cached resources:', urls.length);
                } catch (error) {
                    console.error('プリキャッシュエラー:', error);
                }
            }
            console.log('SW installed, waiting for user action');
        })()
    );
});

// activateイベント
self.addEventListener('activate', (event) => {
    console.log('SW activating...', PRECACHE_VERSION);
    event.waitUntil(
        (async () => {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(name => {
                        // プリキャッシュとプロフィール画像キャッシュは保護する
                        if (name !== PRECACHE_NAME && name !== PROFILE_CACHE_NAME) {
                            return caches.delete(name);
                        }
                        return undefined;
                    })
                );
                await self.clients.claim();
            } catch (error) {
                console.error('アクティベートエラー:', error);
            }
        })()
    );
});

// fetchイベント
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // 修正: オリジンが同じ場合のみ横取り
    if (isUploadRequest(event.request, url) && url.origin === self.location.origin) {
        event.respondWith(handleUploadRequest(event.request));
    } else if (isProfileImageRequest(event.request)) {
        event.respondWith(handleProfileImageRequest(event.request));
    } else if (url.origin === self.location.origin) {
        event.respondWith(handleCacheFirst(event.request));
    }
});

// messageイベント
self.addEventListener('message', (event) => {
    const messageHandlers = {
        'SKIP_WAITING': () => {
            console.log('SW received SKIP_WAITING, updating...');
            self.skipWaiting();
        },
        'GET_VERSION': () => {
            event.ports?.[0]?.postMessage({ version: PRECACHE_VERSION });
        }
    };

    const actionHandlers = {
        'getSharedImage': () => respondSharedImage(event),
        'clearProfileCache': () => handleClearProfileCache(event),
        'cleanupDuplicateProfileCache': () => handleCleanupDuplicateProfileCache(event)
    };

    const { type, action } = event.data || {};

    if (type && messageHandlers[type]) {
        messageHandlers[type]();
    } else if (action && actionHandlers[action]) {
        actionHandlers[action]();
    }
});

// アップロードリクエスト判定
function isUploadRequest(request, url) {
    return request.method === 'POST' &&
        (url.pathname.endsWith('/upload') || url.pathname.includes('/ehagaki/upload'));
}

// アップロードリクエスト処理
async function handleUploadRequest(request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');
        if (!image) return createRedirectResponse('/ehagaki/', 'no-image');

        sharedImageCache = {
            image,
            metadata: {
                name: image.name,
                type: image.type,
                size: image.size,
                timestamp: new Date().toISOString()
            }
        };
        saveSharedFlag().catch(err => console.error('IndexedDB保存エラー:', err));
        return await redirectClient();
    } catch (error) {
        console.error('アップロード処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'processing-error');
    }
}

// クライアントリダイレクト
async function redirectClient() {
    try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (clients.length > 0) {
            return await focusAndNotifyClient(clients[0]);
        } else {
            return await openNewClient();
        }
    } catch (error) {
        console.error('クライアント処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'client-error');
    }
}

// 既存クライアント通知
async function focusAndNotifyClient(client) {
    try {
        await client.focus();
        for (let retry = 0; retry < 3; retry++) {
            setTimeout(() => {
                try {
                    client.postMessage({
                        type: 'SHARED_IMAGE',
                        data: sharedImageCache,
                        timestamp: Date.now(),
                        retry
                    });
                } catch (e) {
                    console.error(`メッセージ送信エラー (retry: ${retry}):`, e);
                }
            }, retry * 1000);
        }
        return createRedirectResponse('/ehagaki/', 'success');
    } catch (error) {
        console.error('既存クライアント処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'messaging-error');
    }
}

// 新規クライアントオープン
async function openNewClient() {
    try {
        const url = new URL('/ehagaki/?shared=true', self.location.origin).href;
        const windowClient = await self.clients.openWindow(url);
        if (windowClient) {
            return new Response('', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }
        return createRedirectResponse('/ehagaki/', 'window-error');
    } catch (error) {
        console.error('新しいウィンドウ作成エラー:', error);
        return createRedirectResponse('/ehagaki/', 'open-window-error');
    }
}

// Cache First戦略
async function handleCacheFirst(request) {
    try {
        const cache = await caches.open(PRECACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const network = await fetch(request);
        if (network.ok && request.method === 'GET') {
            await cache.put(request, network.clone());
        }
        return network;
    } catch (error) {
        console.error('キャッシュ戦略エラー:', error);
        return new Response('Not Found', { status: 404 });
    }
}

// プロフィール画像リクエスト判定
function isProfileImageRequest(request) {
    if (request.method !== 'GET') return false;
    const url = new URL(request.url);
    // profile=true クエリパラメータがある場合のみプロフィール画像として扱う
    return url.searchParams.get('profile') === 'true';
}

// プロフィール画像リクエスト処理
async function handleProfileImageRequest(request) {
    try {
        const cache = await caches.open(PROFILE_CACHE_NAME);
        const baseUrl = getBaseUrl(request.url);
        const baseRequest = createCorsRequest(baseUrl);

        // キャッシュから検索（ベースURL優先）
        const cachedBase = await cache.match(baseRequest);
        if (cachedBase) {
            console.log('プロフィール画像をキャッシュから返却（ベースURL）:', baseUrl);
            return cachedBase;
        }

        // 念のため元のURLでも検索（既存キャッシュとの互換性）
        const cached = await cache.match(request);
        if (cached) {
            console.log('プロフィール画像をキャッシュから返却（元URL）:', request.url);
            return cached;
        }

        // ネットワークから取得を試行
        if (navigator.onLine !== false) {
            try {
                const corsRequest = createCorsRequest(request.url, {
                    headers: { 'Cache-Control': 'no-cache' },
                    cache: 'no-cache'
                });

                const response = await fetch(corsRequest);

                if (response.ok && response.status === 200) {
                    // ベースURLのみでキャッシュに保存（重複を防ぐ）
                    const responseClone = response.clone();
                    await cache.put(baseRequest, responseClone);
                    console.log('プロフィール画像をキャッシュに保存（ベースURL）:', baseUrl);
                    return response;
                }
            } catch (networkError) {
                console.log('ネットワークエラー:', networkError.message);
            }
        }

        // フォールバック: 透明な1x1ピクセル画像を返す
        console.log('フォールバック画像を返却:', request.url);
        return createTransparentImageResponse();

    } catch (error) {
        console.error('プロフィール画像処理エラー:', error);
        // エラー時も透明画像を返す
        return createTransparentImageResponse();
    }
}

// プロフィール画像キャッシュクリア処理
async function handleClearProfileCache(event) {
    try {
        const deleted = await caches.delete(PROFILE_CACHE_NAME);
        console.log('プロフィール画像キャッシュクリア:', deleted);
        event.ports?.[0]?.postMessage({ success: true });
    } catch (err) {
        console.error('プロフィールキャッシュクリアエラー:', err);
        event.ports?.[0]?.postMessage({ success: false, error: err.message });
    }
}

// 重複プロフィール画像キャッシュのクリーンアップ処理
async function handleCleanupDuplicateProfileCache(event) {
    try {
        await cleanupDuplicateProfileCache();
        event.ports?.[0]?.postMessage({ success: true });
    } catch (err) {
        console.error('重複キャッシュクリーンアップエラー:', err);
        event.ports?.[0]?.postMessage({ success: false, error: err.message });
    }
}

// 重複プロフィール画像キャッシュのクリーンアップ
async function cleanupDuplicateProfileCache() {
    const cache = await caches.open(PROFILE_CACHE_NAME);
    const keys = await cache.keys();

    const baseUrls = new Set();
    const duplicateKeys = [];

    // ベースURLとクエリ付きURLを識別
    keys.forEach(request => {
        const url = new URL(request.url);
        const baseUrl = getBaseUrl(request.url);

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
        const baseUrl = getBaseUrl(duplicateKey.url);

        // ベースURLが既にキャッシュされている場合、クエリ付きを削除
        if (baseUrls.has(baseUrl)) {
            await cache.delete(duplicateKey);
            deletedCount++;
            console.log('重複キャッシュを削除:', duplicateKey.url);
        }
    }

    console.log(`重複プロフィールキャッシュクリーンアップ完了: ${deletedCount}件削除`);
    return true;
}

// リダイレクトレスポンス
function createRedirectResponse(path, error = null) {
    const url = new URL(path, self.location.origin);
    if (error) {
        url.searchParams.set('shared', 'true');
        url.searchParams.set('error', error);
    }
    return Response.redirect(url.href, 303);
}

// IndexedDBに共有フラグ保存
async function saveSharedFlag() {
    return indexedDBOperation((db, resolve, reject) => {
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

// 共有画像リクエスト応答
function respondSharedImage(event) {
    const client = event.source;
    const requestId = event.data.requestId || null;
    const msg = {
        type: 'SHARED_IMAGE',
        data: sharedImageCache,
        requestId,
        timestamp: Date.now()
    };

    if (event.ports?.[0]) {
        event.ports[0].postMessage(msg);
    } else if (client) {
        client.postMessage(msg);
    }

    // 画像送信後すぐキャッシュとフラグをクリア
    if (sharedImageCache) {
        sharedImageCache = null;
        clearSharedFlagInIndexedDB();
    }
}

// IndexedDBの共有フラグ削除
function clearSharedFlagInIndexedDB() {
    indexedDBOperation((db, resolve) => {
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
    }).catch(() => {
        // エラーは無視
    });
}