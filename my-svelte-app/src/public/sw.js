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
                            // フォーカスしてからデータを送信
                            await client.focus();
                            
                            // データを送信 - 即時送信
                            client.postMessage({
                                type: 'SHARED_IMAGE',
                                data: sharedImageCache
                            });
                            log('クライアントに画像データを送信しました');
                            
                            // 複数回送信を試みる (信頼性向上)
                            setTimeout(() => {
                                try {
                                    client.postMessage({
                                        type: 'SHARED_IMAGE',
                                        data: sharedImageCache
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
                                        data: sharedImageCache
                                    });
                                    log('画像データ再送信（2回目）');
                                } catch (e) {
                                    error('再送信エラー:', e);
                                }
                            }, 2000);
                            
                            return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                        } catch (msgErr) {
                            error('メッセージ送信エラー:', msgErr);
                            return Response.redirect(new URL('/ehagaki/?error=messaging', self.location.origin).href, 303);
                        }
                    } else {
                        // クライアントが開かれていない場合、新しいウィンドウを開く
                        log('クライアントがないので新規ウィンドウを開きます');
                        
                        try {
                            // 新しいウィンドウを開いて、URLにクエリパラメータを付与
                            const windowClient = await self.clients.openWindow(
                                new URL('/ehagaki/?shared=true', self.location.origin).href
                            );
                            
                            if (windowClient) {
                                log('新しいウィンドウを開きました');
                                return Response.redirect(new URL('/ehagaki/', self.location.origin).href, 303);
                            } else {
                                error('新しいウィンドウを開けませんでした');
                                return Response.redirect(new URL('/ehagaki/?error=window', self.location.origin).href, 303);
                            }
                        } catch (windowErr) {
                            error('ウィンドウオープンエラー:', windowErr);
                            return Response.redirect(new URL('/ehagaki/?error=openWindow', self.location.origin).href, 303);
                        }
                    }
                } catch (err) {
                    error('画像処理エラー:', err);
                    // エラー時も適切にリダイレクト
                    return Response.redirect(new URL('/ehagaki/?error=processing', self.location.origin).href, 303);
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
                event.ports[0].postMessage({
                    type: 'SHARED_IMAGE',
                    data: sharedImageCache
                });
                log('MessageChannelでデータを送信');
            } else {
                // 通常のメッセージ応答
                event.source.postMessage({
                    type: 'SHARED_IMAGE',
                    data: sharedImageCache
                });
                log('通常の応答でデータを送信');
            }
            
            log('送信したデータ:', sharedImageCache.metadata);
            
            // 送信後もキャッシュを保持（複数回の取得に対応）
            // 30秒後に削除（時間を延長）
            setTimeout(() => {
                sharedImageCache = null;
                log('共有画像キャッシュをクリアしました');
            }, 30000);
        } else {
            log('共有画像キャッシュがありません');
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({ type: 'SHARED_IMAGE', data: null });
            } else if (event.source) {
                event.source.postMessage({ type: 'SHARED_IMAGE', data: null });
            }
        }
    }
});