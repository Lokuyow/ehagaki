// 定数定義
const PRECACHE_VERSION = 'v0.1.12';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;
const REQUEST_TIMEOUT = 5000;
const INDEXEDDB_NAME = 'eHagakiSharedData';
const INDEXEDDB_VERSION = 1;

// 画像データをキャッシュするためのインメモリストア
let sharedImageCache = null;

// VitePWAがここにマニフェストを注入
const precacheManifest = self.__WB_MANIFEST || [];

/**
 * プリキャッシュの設定
 */
if (precacheManifest.length > 0) {
    self.addEventListener('install', (event) => {
        event.waitUntil(
            (async () => {
                try {
                    const cache = await caches.open(PRECACHE_NAME);
                    const urls = precacheManifest.map(entry => entry.url);
                    await cache.addAll(urls);
                } catch (error) {
                    console.error('プリキャッシュエラー:', error);
                }
                await self.skipWaiting();
            })()
        );
    });
}

/**
 * fetch時のキャッシュ戦略
 */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // アップロードリクエストの処理
    if (isUploadRequest(event.request, url)) {
        event.respondWith(handleUploadRequest(event.request));
    } else if (url.origin === self.location.origin) {
        // 自サイトのリソースはCache First戦略
        event.respondWith(handleCacheFirstStrategy(event.request));
    }
    // 外部リソースはキャッシュせず、ネットワークから直接取得（デフォルト動作）
});

/**
 * アップロードリクエストかどうかを判定
 */
function isUploadRequest(request, url) {
    return request.method === 'POST' && 
           (url.pathname.endsWith('/upload') || url.pathname.includes('/ehagaki/upload'));
}

/**
 * アップロードリクエストの処理
 */
async function handleUploadRequest(request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');

        if (!image) {
            return createRedirectResponse('/ehagaki/', 'no-image');
        }

        // 画像データをキャッシュに保存
        sharedImageCache = {
            image,
            metadata: {
                name: image.name,
                type: image.type,
                size: image.size,
                timestamp: new Date().toISOString()
            }
        };

        // IndexedDBに共有フラグを保存（バックグラウンド処理）
        saveSharedFlag().catch(err => 
            console.error('IndexedDB保存エラー:', err)
        );

        // クライアント処理
        return await handleClientRedirection();

    } catch (error) {
        console.error('アップロード処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'processing-error');
    }
}

/**
 * クライアントのリダイレクション処理
 */
async function handleClientRedirection() {
    try {
        const clients = await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        });

        if (clients.length > 0) {
            return await handleExistingClient(clients[0]);
        } else {
            return await handleNewClient();
        }
    } catch (error) {
        console.error('クライアント処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'client-error');
    }
}

/**
 * 既存クライアントの処理
 */
async function handleExistingClient(client) {
    try {
        await client.focus();
        
        // メッセージを複数回送信（信頼性向上）
        const sendMessage = (retry = 0) => {
            try {
                client.postMessage({
                    type: 'SHARED_IMAGE',
                    data: sharedImageCache,
                    timestamp: Date.now(),
                    retry
                });
            } catch (error) {
                console.error(`メッセージ送信エラー (retry: ${retry}):`, error);
            }
        };

        sendMessage(0);
        setTimeout(() => sendMessage(1), 1000);
        setTimeout(() => sendMessage(2), 2000);

        return createRedirectResponse('/ehagaki/', 'success');
    } catch (error) {
        console.error('既存クライアント処理エラー:', error);
        return createRedirectResponse('/ehagaki/', 'messaging-error');
    }
}

/**
 * 新しいクライアントの処理
 */
async function handleNewClient() {
    try {
        const newWindowUrl = new URL('/ehagaki/?shared=true', self.location.origin).href;
        const windowClient = await self.clients.openWindow(newWindowUrl);

        if (windowClient) {
            return new Response('', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        } else {
            return createRedirectResponse('/ehagaki/', 'window-error');
        }
    } catch (error) {
        console.error('新しいウィンドウ作成エラー:', error);
        return createRedirectResponse('/ehagaki/', 'open-window-error');
    }
}

/**
 * Cache First戦略の実装
 */
async function handleCacheFirstStrategy(request) {
    try {
        const cache = await caches.open(PRECACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        if (networkResponse.ok && request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            await cache.put(request, responseToCache);
        }

        return networkResponse;
    } catch (error) {
        console.error('キャッシュ戦略エラー:', error);
        return new Response('Not Found', { status: 404 });
    }
}

/**
 * リダイレクトレスポンスを作成
 */
function createRedirectResponse(path, error = null) {
    const url = new URL(path, self.location.origin);
    if (error) {
        url.searchParams.set('shared', 'true');
        url.searchParams.set('error', error);
    }
    return Response.redirect(url.href, 303);
}

/**
 * IndexedDBに共有フラグを保存
 */
async function saveSharedFlag() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('flags')) {
                    db.createObjectStore('flags', { keyPath: 'id' });
                }
            };

            request.onerror = () => reject(new Error('IndexedDB open failed'));

            request.onsuccess = (event) => {
                try {
                    const db = event.target.result;
                    const transaction = db.transaction(['flags'], 'readwrite');
                    const store = transaction.objectStore('flags');

                    const sharedFlag = {
                        id: 'sharedImage',
                        timestamp: Date.now(),
                        value: true
                    };

                    const storeRequest = store.put(sharedFlag);
                    storeRequest.onsuccess = () => {
                        db.close();
                        resolve();
                    };
                    storeRequest.onerror = () => {
                        db.close();
                        reject(new Error('Failed to store shared flag'));
                    };
                } catch (error) {
                    reject(error);
                }
            };
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * インストールイベント
 */
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

/**
 * アクティベートイベント
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            try {
                // 古いキャッシュを削除
                const validCaches = [PRECACHE_NAME];
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(name => {
                        if (!validCaches.includes(name)) {
                            return caches.delete(name);
                        }
                    })
                );
                
                await self.clients.claim();
            } catch (error) {
                console.error('アクティベートエラー:', error);
            }
        })()
    );
});

/**
 * メッセージイベント
 */
self.addEventListener('message', (event) => {
    // SW更新用メッセージ - 優先的に処理
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
        return;
    }

    // 共有データ要求の処理
    if (event.data?.action === 'getSharedImage') {
        handleSharedImageRequest(event);
    }
});

/**
 * 共有画像リクエストの処理
 */
function handleSharedImageRequest(event) {
    const client = event.source;
    const requestId = event.data.requestId || null;

    const responseMessage = {
        type: 'SHARED_IMAGE',
        data: sharedImageCache,
        requestId: requestId,
        timestamp: Date.now()
    };

    // 応答の送信
    if (event.ports?.[0]) {
        // MessageChannelが使用されている場合
        event.ports[0].postMessage(responseMessage);
    } else if (client) {
        // 通常のメッセージ応答
        client.postMessage(responseMessage);
    }

    // キャッシュを30秒間保持（複数回の取得に対応）
    if (sharedImageCache) {
        setTimeout(() => {
            sharedImageCache = null;
        }, 30000);
    }
}