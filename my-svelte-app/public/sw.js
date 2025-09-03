// 定数定義
const PRECACHE_VERSION = '1.0.8';
const PRECACHE_NAME = `ehagaki-cache-${PRECACHE_VERSION}`;
const PROFILE_CACHE_NAME = 'ehagaki-profile-images';
const INDEXEDDB_NAME = 'eHagakiSharedData';
const INDEXEDDB_VERSION = 1;

let sharedImageCache = null;
const precacheManifest = self.__WB_MANIFEST || [];

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
                    cacheNames.map(name =>
                        name !== PRECACHE_NAME ? caches.delete(name) : undefined
                    )
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
    if (event.data?.type === 'SKIP_WAITING') {
        console.log('SW received SKIP_WAITING, updating...');
        self.skipWaiting();
        return;
    }
    if (event.data?.type === 'GET_VERSION') {
        event.ports?.[0]?.postMessage({ version: PRECACHE_VERSION });
        return;
    }
    if (event.data?.action === 'getSharedImage') {
        respondSharedImage(event);
    }
    if (event.data?.action === 'clearProfileCache') {
        clearProfileImageCache().then(() => {
            event.ports?.[0]?.postMessage({ success: true });
        }).catch(err => {
            console.error('プロフィールキャッシュクリアエラー:', err);
            event.ports?.[0]?.postMessage({ success: false, error: err.message });
        });
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
        const cached = await cache.match(request);

        if (cached) {
            console.log('プロフィール画像をキャッシュから返却:', request.url);
            return cached;
        }

        const response = await fetch(request);
        if (response.ok) {
            // レスポンスをクローンしてキャッシュに保存
            await cache.put(request, response.clone());
            console.log('プロフィール画像をキャッシュに保存:', request.url);
        }

        return response;
    } catch (error) {
        console.error('プロフィール画像処理エラー:', error);
        // エラー時はネットワークからの取得を試行
        return fetch(request);
    }
}

// プロフィール画像キャッシュクリア
async function clearProfileImageCache() {
    try {
        const deleted = await caches.delete(PROFILE_CACHE_NAME);
        console.log('プロフィール画像キャッシュクリア:', deleted);
        return deleted;
    } catch (error) {
        console.error('プロフィール画像キャッシュクリアエラー:', error);
        throw error;
    }
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
                try {
                    const db = e.target.result;
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
                } catch (error) {
                    reject(error);
                }
            };
        } catch (error) {
            reject(error);
        }
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
    if (sharedImageCache) {
        setTimeout(() => { sharedImageCache = null; }, 30000);
    }
}