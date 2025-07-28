// サービスワーカーのデバッグ用
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[ServiceWorker]', ...args);
const error = (...args) => console.error('[ServiceWorker]', ...args);

// 画像データをキャッシュするためのインメモリストア
let sharedImageCache = null;

// キャッシュバージョン管理用定数
const PRECACHE_VERSION = 'v0.1.1';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;

// VitePWAがここにマニフェストを注入
const precacheManifest = self.__WB_MANIFEST;

// プリキャッシュの設定（シンプルに）
if (precacheManifest && precacheManifest.length > 0) {
    const CACHE_NAME = PRECACHE_NAME;

    // インストール時にプリキャッシュ
    self.addEventListener('install', (event) => {
        log('インストールされました - プリキャッシュ開始');
        event.waitUntil(
            (async () => {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    const urls = precacheManifest.map(entry => entry.url);
                    await cache.addAll(urls);
                    log('プリキャッシュ完了:', urls);
                } catch (err) {
                    error('プリキャッシュ失敗:', err);
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
            log('画像アップロードリクエストをWorkboxで処理します', event.request.url);
            try {
                log('フォームデータを処理中...');
                const formData = await event.request.formData();
                const image = formData.get('image');

                // 画像データの存在確認
                if (!image) {
                    error('画像データがありません');
                    return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                }

                log('画像を受信しました:',
                    image.name,
                    `タイプ: ${image.type}`,
                    `サイズ: ${Math.round(image.size / 1024)}KB`
                );

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
                    log('IndexedDBに共有フラグを保存しました');
                } catch (dbErr) {
                    error('IndexedDB保存エラー:', dbErr);
                }

                // アクティブなクライアントを探してフォーカス
                const clients = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true
                });

                if (clients.length > 0) {
                    // すでに開いているクライアントを選択
                    const client = clients[0];
                    log('既存のクライアントにフォーカス:', client.id);

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
                                log(`画像データ${retry > 0 ? '再' : ''}送信 (${retry}回目)`);
                            } catch (e) {
                                error('メッセージ送信エラー:', e);
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
                        error('メッセージ送信エラー:', msgErr);
                        return Response.redirect(new URL('/ehagaki/?shared=true&error=messaging', self.location.origin).href, 303);
                    }
                } else {
                    // クライアントが開かれていない場合、新しいウィンドウを開く
                    log('クライアントがないので新規ウィンドウを開きます');

                    try {
                        // 新しいウィンドウを開いて、URLにクエリパラメータを付与
                        const newWindowUrl = new URL('/ehagaki/?shared=true', self.location.origin).href;
                        log('新規ウィンドウを開きます:', newWindowUrl);

                        const windowClient = await self.clients.openWindow(newWindowUrl);

                        if (windowClient) {
                            log('新しいウィンドウを開きました');
                            // リダイレクトせず、直接返す
                            return new Response('', {
                                status: 200,
                                headers: {
                                    'Content-Type': 'text/plain'
                                }
                            });
                        } else {
                            error('新しいウィンドウを開けませんでした');
                            return Response.redirect(new URL('/ehagaki/?shared=true&error=window', self.location.origin).href, 303);
                        }
                    } catch (windowErr) {
                        error('ウィンドウオープンエラー:', windowErr);
                        return Response.redirect(new URL('/ehagaki/?shared=true&error=openWindow', self.location.origin).href, 303);
                    }
                }
            } catch (err) {
                error('画像処理エラー:', err);
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
                        log('キャッシュからレスポンス:', event.request.url);
                        return cachedResponse;
                    }

                    log('ネットワークからフェッチ:', event.request.url);
                    const networkResponse = await fetch(event.request);

                    if (networkResponse.ok && event.request.method === 'GET') {
                        const responseToCache = networkResponse.clone();
                        await cache.put(event.request, responseToCache);
                        log('ネットワーク応答をキャッシュに保存:', event.request.url);
                    }

                    return networkResponse;
                } catch (error) {
                    error('フェッチエラー:', event.request.url, error);
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
    log('インストールされました');
    event.waitUntil(self.skipWaiting());
});

// サービスワーカーのアクティベートイベントを処理
self.addEventListener('activate', (event) => {
    log('アクティブになりました - スコープ:', self.registration.scope);
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
                        log('不要なキャッシュを削除:', name);
                        return caches.delete(name);
                    }
                })
            );
            await self.clients.claim();
        })()
    );
});

// クライアントからの要求に応じて、キャッシュした画像データを送信
self.addEventListener('message', (event) => {
    const client = event.source;
    log('メッセージ受信:', event.data?.action, 'from client:', client?.id);

    // SW更新用メッセージ
    if (event.data && event.data.type === 'SKIP_WAITING') {
        log('SKIP_WAITINGを受信、skipWaiting実行');
        self.skipWaiting();
        return;
    }

    // クライアントが共有データを要求
    if (event.data && event.data.action === 'getSharedImage') {
        log('クライアントに共有画像データのリクエストを受信');
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
            log('MessageChannelでデータを送信');
        } else if (client) {
            // 通常のメッセージ応答
            client.postMessage(responseMessage);
            log('通常の応答でデータを送信');
        }

        if (sharedImageCache) {
            log('送信したデータ:', sharedImageCache.image?.name, sharedImageCache.metadata);

            // 送信後も30秒間はキャッシュを保持（複数回の取得に対応）
            setTimeout(() => {
                sharedImageCache = null;
                log('共有画像キャッシュをクリアしました');
            }, 30000);
        } else {
            log('共有画像キャッシュがありません');
        }
    }
});