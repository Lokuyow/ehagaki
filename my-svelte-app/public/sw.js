// 画像データをキャッシュするためのインメモリストア
let sharedImageCache = null;

// キャッシュバージョン管理用定数
const PRECACHE_VERSION = 'v0.1.12';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;

// VitePWAがここにマニフェストを注入
const precacheManifest = self.__WB_MANIFEST;

// プリキャッシュの設定（シンプルに）
if (precacheManifest && precacheManifest.length > 0) {
    const CACHE_NAME = PRECACHE_NAME;

    // インストール時にプリキャッシュ
    self.addEventListener('install', (event) => {
        event.waitUntil(
            (async () => {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    const urls = precacheManifest.map(entry => entry.url);
                    await cache.addAll(urls);
                } catch (err) {
                    // ...existing error handling...
                }
                await self.skipWaiting();
            })()
        );
    });
}

// fetch時のCache First戦略
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // アップロードリクエストの処理
    const isUploadRequest = event.request.method === 'POST' &&
        (url.pathname.endsWith('/upload') || url.pathname.includes('/ehagaki/upload'));

    if (isUploadRequest) {
        event.respondWith((async () => {
            try {
                const formData = await event.request.formData();
                const image = formData.get('image');

                // 画像データの存在確認
                if (!image) {
                    return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
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

                try {
                    // indexedDBに共有フラグを保存
                    await saveSharedFlag();
                } catch (dbErr) {
                    // ...existing error handling...
                }

                // アクティブなクライアントを探してフォーカス
                const clients = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true
                });

                if (clients.length > 0) {
                    // すでに開いているクライアントを選択
                    const client = clients[0];

                    try {
                        // フォーカスしてからデータを送信
                        await client.focus();

                        // メッセージを送信する関数
                        const sendMessage = (retry = 0) => {
                            try {
                                client.postMessage({
                                    type: 'SHARED_IMAGE',
                                    data: sharedImageCache,
                                    timestamp: Date.now(),
                                    retry
                                });
                            } catch (e) {
                                // ...existing error handling...
                            }
                        };

                        // 即時送信
                        sendMessage();

                        // 信頼性向上のため、遅延して再送信
                        setTimeout(() => sendMessage(1), 1000);
                        setTimeout(() => sendMessage(2), 2000);

                        // リダイレクト
                        return Response.redirect(new URL('/ehagaki/?shared=true', self.location.origin).href, 303);
                    } catch (msgErr) {
                        return Response.redirect(new URL('/ehagaki/?shared=true&error=messaging', self.location.origin).href, 303);
                    }
                } else {
                    // クライアントが開かれていない場合、新しいウィンドウを開く
                    try {
                        // 新しいウィンドウを開いて、URLにクエリパラメータを付与
                        const newWindowUrl = new URL('/ehagaki/?shared=true', self.location.origin).href;

                        const windowClient = await self.clients.openWindow(newWindowUrl);

                        if (windowClient) {
                            // リダイレクトせず、直接返す
                            return new Response('', {
                                status: 200,
                                headers: {
                                    'Content-Type': 'text/plain'
                                }
                            });
                        } else {
                            return Response.redirect(new URL('/ehagaki/?shared=true&error=window', self.location.origin).href, 303);
                        }
                    } catch (windowErr) {
                        return Response.redirect(new URL('/ehagaki/?shared=true&error=openWindow', self.location.origin).href, 303);
                    }
                }
            } catch (err) {
                // エラー時も適切にリダイレクト
                return Response.redirect(new URL('/ehagaki/?shared=true&error=processing', self.location.origin).href, 303);
            }
        })());
    } else {
        // オリジン判定を追加
        if (url.origin === self.location.origin) {
            // Cache First戦略を実装（自サイトのみ）
            event.respondWith((async () => {
                try {
                    const cache = await caches.open(PRECACHE_NAME);
                    const cachedResponse = await cache.match(event.request);

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    const networkResponse = await fetch(event.request);

                    if (networkResponse.ok && event.request.method === 'GET') {
                        const responseToCache = networkResponse.clone();
                        await cache.put(event.request, responseToCache);
                    }

                    return networkResponse;
                } catch (error) {
                    return new Response('Not Found', { status: 404 });
                }
            })());
        } else {
            // 外部リソースはキャッシュせず、ネットワークから直接取得
            event.respondWith(fetch(event.request));
        }
    }
});

// IndexedDBに共有フラグを保存する関数
async function saveSharedFlag() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open('eHagakiSharedData', 1);

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

                    storeRequest.onsuccess = () => resolve();
                    storeRequest.onerror = () => reject(new Error('Failed to store shared flag'));
                } catch (err) {
                    reject(err);
                }
            };
        } catch (err) {
            reject(err);
        }
    });
}

// サービスワーカーのインストールイベントを処理
self.addEventListener('install', (event) => {
    // 高速インストールのためにskipWaitingを即実行
    event.waitUntil(self.skipWaiting());
});

// サービスワーカーのアクティベートイベントを処理
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // 有効なキャッシュ名
            const validCaches = [PRECACHE_NAME];
            // すべてのキャッシュ名を取得
            const cacheNames = await caches.keys();
            // 有効なキャッシュ以外を削除
            await Promise.all(
                cacheNames.map(name => {
                    if (!validCaches.includes(name)) {
                        return caches.delete(name);
                    }
                })
            );
            // 即座にcontrollerに
            await self.clients.claim();
        })()
    );
});

// クライアントからの要求に応じて、キャッシュした画像データを送信
self.addEventListener('message', (event) => {
    // SW更新用メッセージ - 優先的に処理
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        return;
    }

    const client = event.source;

    // クライアントが共有データを要求
    if (event.data && event.data.action === 'getSharedImage') {
        const requestId = event.data.requestId || null;

        // 応答データを準備
        const responseMessage = {
            type: 'SHARED_IMAGE',
            data: sharedImageCache,
            requestId: requestId,
            timestamp: Date.now()
        };

        // 応答の送信方法を決定
        if (event.ports && event.ports[0]) {
            // MessageChannelが使用されている場合
            event.ports[0].postMessage(responseMessage);
        } else if (client) {
            // 通常のメッセージ応答
            client.postMessage(responseMessage);
        }

        if (sharedImageCache) {
            // 送信後も30秒間はキャッシュを保持（複数回の取得に対応）
            setTimeout(() => {
                sharedImageCache = null;
            }, 30000);
        }
    }
});