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
                            // データを送信
                            client.postMessage(sharedImageCache);
                            log('クライアントに画像データを送信しました');
                            
                            // 複数回送信を試みる
                            setTimeout(() => {
                                try {
                                    client.postMessage(sharedImageCache);
                                    log('画像データ再送信（1回目）');
                                } catch (e) {
                                    error('再送信エラー:', e);
                                }
                            }, 1000);
                        } catch (msgErr) {
                            error('メッセージ送信エラー:', msgErr);
                        }
                        
                        // クライアントにフォーカス
                        await client.focus();
                        return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                    } else {
                        // クライアントが開かれていない場合、新しいウィンドウを開く
                        log('クライアントがないので新規ウィンドウを開きます');
                        
                        // 新しいウィンドウを開いて、URLにクエリパラメータを付与
                        const windowClient = await self.clients.openWindow(
                            new URL('/ehagaki/?shared=true', self.location.origin).href
                        );
                        
                        if (windowClient) {
                            return new Response('', {
                                status: 303,
                                headers: { 'Location': new URL('/ehagaki/', self.location.origin).href }
                            });
                        } else {
                            return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                        }
                    }
                } catch (err) {
                    error('画像処理エラー:', err);
                    // エラー時も適切にリダイレクト
                    return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                }
            })()
        );
        return;
    }
});

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
    log('メッセージ受信:', event.data);

    // SW更新用メッセージ
    if (event.data && event.data.type === 'SKIP_WAITING') {
        log('SKIP_WAITINGを受信、skipWaiting実行');
        self.skipWaiting();
        return;
    }

    // クライアントが共有データを要求
    if (event.data && event.data.action === 'getSharedImage') {
        log('クライアントに共有画像データを送信');
        
        if (sharedImageCache) {
            // MessageChannelを使用している場合
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage(sharedImageCache);
                log('MessageChannelでデータを送信');
            } else {
                // 通常のメッセージ応答
                event.source.postMessage(sharedImageCache);
                log('通常の応答でデータを送信');
            }
            
            log('送信したデータ:', sharedImageCache.metadata);
            
            // 送信後もキャッシュを保持（複数回の取得に対応）
            // 10秒後に削除
            setTimeout(() => {
                sharedImageCache = null;
                log('共有画像キャッシュをクリアしました');
            }, 10000);
        } else {
            log('共有画像キャッシュがありません');
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage(null);
            } else if (event.source) {
                event.source.postMessage({ error: 'No shared image available' });
            }
        }
    }
});