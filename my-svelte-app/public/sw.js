// サービスワーカーのデバッグ用
const DEBUG = true;
const log = (...args) => DEBUG && console.log('[ServiceWorker]', ...args);
const error = (...args) => console.error('[ServiceWorker]', ...args);

// 画像データをキャッシュするためのインメモリストア
let sharedImageCache = null;

// すべてのfetchイベントをリッスン
self.addEventListener('fetch', (event) => {
    const fetchEvent = event;
    const url = new URL(fetchEvent.request.url);
    
    log('リクエスト受信:', fetchEvent.request.method, url.pathname);

    // GitHub Pagesでの相対パスに対応
    const isUploadRequest = 
        fetchEvent.request.method === 'POST' && 
        (url.pathname.endsWith('/upload') || url.pathname.includes('/ehagaki/upload'));
    
    if (isUploadRequest) {
        log('画像アップロードリクエストを受信しました', url.pathname);
        
        fetchEvent.respondWith(
            (async () => {
                try {
                    log('フォームデータを処理中...');
                    const formData = await fetchEvent.request.formData();
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
                    
                    // セッションストレージに共有フラグをセット (代替方法)
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
                            
                            // データを送信 - 即時送信
                            client.postMessage({
                                type: 'SHARED_IMAGE',
                                data: sharedImageCache,
                                timestamp: Date.now()
                            });
                            log('クライアントに画像データを送信しました');
                            
                            // 複数回送信を試みる (信頼性向上)
                            setTimeout(() => {
                                try {
                                    client.postMessage({
                                        type: 'SHARED_IMAGE',
                                        data: sharedImageCache,
                                        timestamp: Date.now(),
                                        retry: 1
                                    });
                                    log('画像データ再送信（1回目）');
                                } catch (e) {
                                    error('再送信エラー:', e);
                                }
                            }, 1000);
                            
                            // さらに時間をおいて再送信
                            setTimeout(() => {
                                try {
                                    client.postMessage({
                                        type: 'SHARED_IMAGE',
                                        data: sharedImageCache,
                                        timestamp: Date.now(),
                                        retry: 2
                                    });
                                    log('画像データ再送信（2回目）');
                                } catch (e) {
                                    error('再送信エラー:', e);
                                }
                            }, 2000);
                            
                            // 正しいパラメータを保持したままリダイレクト
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
            })()
        );
        return;
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
            
            request.onerror = (event) => {
                reject(new Error('IndexedDB open failed'));
            };
            
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
                        resolve();
                    };
                    
                    storeRequest.onerror = (e) => {
                        reject(new Error('Failed to store shared flag'));
                    };
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
    event.waitUntil(self.clients.claim());
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
        log('クライアントに共有画像データを送信');
        const requestId = event.data.requestId || null;
        
        if (sharedImageCache) {
            // MessageChannelを使用している場合
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({
                    type: 'SHARED_IMAGE',
                    data: sharedImageCache,
                    requestId: requestId,
                    timestamp: Date.now()
                });
                log('MessageChannelでデータを送信');
            } else if (client) {
                // 通常のメッセージ応答
                client.postMessage({
                    type: 'SHARED_IMAGE',
                    data: sharedImageCache,
                    requestId: requestId,
                    timestamp: Date.now()
                });
                log('通常の応答でデータを送信');
            }
            
            log('送信したデータ:', sharedImageCache.image?.name, sharedImageCache.metadata);
            
            // 送信後もキャッシュを保持（複数回の取得に対応）
            // 30秒後に削除（時間を延長）
            setTimeout(() => {
                sharedImageCache = null;
                log('共有画像キャッシュをクリアしました');
            }, 30000);
        } else {
            log('共有画像キャッシュがありません');
            const responseMessage = { 
                type: 'SHARED_IMAGE', 
                data: null,
                requestId: requestId,
                error: 'No shared image available',
                timestamp: Date.now()
            };
            
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage(responseMessage);
            } else if (client) {
                client.postMessage(responseMessage);
            }
        }
    }
});