
/**
 * 外部アプリからの共有画像を処理するハンドラークラス
 */
export class ShareHandler {
  private isProcessingSharedImage: boolean = false;
  private sharedImageFile: File | null = null;
  private sharedImageMetadata: any = null;
  private messageChannelPromiseResolvers: Map<string, Function> = new Map();

  constructor() {
    this.setupServiceWorkerListeners();
    console.log('ShareHandler: コンストラクタが実行されました');
  }

  /**
   * サービスワーカーのメッセージリスナーをセットアップ
   */
  private setupServiceWorkerListeners() {
    if ('serviceWorker' in navigator) {
      // グローバルなメッセージリスナー
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      // コントローラーの変更を監視
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('ShareHandler: ServiceWorkerコントローラーが変更されました、リスナーを再設定します');

        // 少し待機してから新しいコントローラーにリスナーを設定
        setTimeout(() => {
          if (navigator.serviceWorker.controller) {
            console.log('ShareHandler: 新しいコントローラーでリスナーを再設定しました');
          }
        }, 1000);
      });

      console.log('ShareHandler: サービスワーカーのメッセージリスナーを設定しました');
    } else {
      console.warn('ShareHandler: サービスワーカーがサポートされていません');
    }
  }

  /**
   * サービスワーカーからのメッセージを処理
   */
  private async handleServiceWorkerMessage(event: MessageEvent): Promise<void> {
    console.log('ShareHandler: メッセージ受信', event.data?.type);

    // 共有画像データを含むメッセージかチェック
    if (event.data && event.data.type === 'SHARED_IMAGE' && event.data.data) {
      console.log('ShareHandler: 共有画像データを受信しました', event.data.data?.image?.name);
      const sharedData = event.data.data;

      if (sharedData.image) {
        this.isProcessingSharedImage = true;
        this.sharedImageFile = sharedData.image;
        this.sharedImageMetadata = sharedData.metadata;

        try {
          // 受信した画像を処理 (カスタムイベントとして発火)
          const sharedImageEvent = new CustomEvent('shared-image-received', {
            detail: {
              file: this.sharedImageFile,
              metadata: this.sharedImageMetadata
            }
          });

          window.dispatchEvent(sharedImageEvent);
          console.log('ShareHandler: shared-image-receivedイベントを発行しました');

          // MessageChannelでの応答待ちがあれば解決
          const requestId = event.data.requestId;
          if (requestId && this.messageChannelPromiseResolvers.has(requestId)) {
            const resolver = this.messageChannelPromiseResolvers.get(requestId);
            if (resolver) {
              resolver({
                image: this.sharedImageFile,
                metadata: this.sharedImageMetadata
              });
              this.messageChannelPromiseResolvers.delete(requestId);
            }
          }
        } catch (error) {
          console.error('ShareHandler: 画像処理エラー', error);
        } finally {
          this.isProcessingSharedImage = false;
        }
      }
    }
  }

  /**
   * アプリ起動時に共有された画像をチェックして取得する
   * @returns 共有された画像ファイル、またはnull
   */
  public async checkForSharedImageOnLaunch(): Promise<File | null> {
    console.log('ShareHandler: 起動時の共有画像チェック');

    // URLパラメータで共有から起動されたかチェック
    const urlParams = new URLSearchParams(window.location.search);
    const wasShared = urlParams.has('shared') && urlParams.get('shared') === 'true';

    console.log('ShareHandler: URLパラメータ確認', { wasShared, search: window.location.search });

    if (wasShared) {
      console.log('ShareHandler: 共有から起動されました');
      this.isProcessingSharedImage = true;

      try {
        // IndexedDBから共有フラグを確認
        try {
          const hasSharedFlag = await this.checkSharedFlagInIndexedDB();
          console.log('ShareHandler: IndexedDBの共有フラグ:', hasSharedFlag);
        } catch (dbErr) {
          console.error('ShareHandler: IndexedDB確認エラー:', dbErr);
        }

        // サービスワーカーへの複数回の要求を試みる
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
          console.log(`ShareHandler: 画像データ取得試行 ${attempts + 1}/${maxAttempts}`);

          // サービスワーカーから共有画像を取得 (複数の方法を試行)
          const sharedImageData = await this.getSharedImageFromServiceWorker();

          if (sharedImageData && sharedImageData.image) {
            console.log('ShareHandler: サービスワーカーから画像を取得しました',
              sharedImageData.image.name,
              `${Math.round(sharedImageData.image.size / 1024)}KB`
            );

            this.sharedImageFile = sharedImageData.image;
            this.sharedImageMetadata = sharedImageData.metadata;

            // カスタムイベントとして発火
            const sharedImageEvent = new CustomEvent('shared-image-received', {
              detail: {
                file: this.sharedImageFile,
                metadata: this.sharedImageMetadata
              }
            });

            window.dispatchEvent(sharedImageEvent);
            console.log('ShareHandler: shared-image-receivedイベントを発行しました');
            return this.sharedImageFile;
          }

          attempts++;

          if (attempts < maxAttempts) {
            // 少し待機してから再試行
            console.log('ShareHandler: 画像データ取得を再試行します...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        console.log('ShareHandler: 共有画像が見つかりませんでした');
        return null;
      } catch (error) {
        console.error('ShareHandler: 共有画像取得エラー', error);
        return null;
      } finally {
        this.isProcessingSharedImage = false;
      }
    } else {
      console.log('ShareHandler: 共有からの起動ではありません');
      return null;
    }
  }

  /**
   * IndexedDBから共有フラグを確認
   */
  private async checkSharedFlagInIndexedDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('eHagakiSharedData', 1);

        request.onupgradeneeded = (event) => {
          if (!event.target) {
            reject(new Error('IndexedDB event.target is null'));
            return;
          }
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('flags')) {
            db.createObjectStore('flags', { keyPath: 'id' });
          }
        };

        request.onerror = (event) => {
          reject(new Error('IndexedDB open failed'));
        };

        request.onsuccess = (event) => {
          try {
            if (!event.target) {
              reject(new Error('IndexedDB onsuccess event.target is null'));
              return;
            }
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['flags'], 'readonly');
            const store = transaction.objectStore('flags');

            const getRequest = store.get('sharedImage');

            getRequest.onsuccess = () => {
              const flag = getRequest.result;
              if (flag && flag.value === true) {
                // フラグが存在し、trueならば共有されている
                console.log('SharedHandler: IndexedDBから共有フラグを確認しました', flag);

                // フラグを削除（一度だけ使用）
                try {
                  const deleteTransaction = db.transaction(['flags'], 'readwrite');
                  const deleteStore = deleteTransaction.objectStore('flags');
                  deleteStore.delete('sharedImage');
                } catch (e) {
                  console.error('SharedHandler: フラグ削除エラー', e);
                }

                resolve(true);
              } else {
                resolve(false);
              }
            };

            getRequest.onerror = (e) => {
              reject(new Error('Failed to get shared flag'));
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

  /**
   * サービスワーカーから共有画像を取得する (複数の方法を試行)
   */
  private async getSharedImageFromServiceWorker(): Promise<{ image: File, metadata: any } | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('ShareHandler: ServiceWorkerがサポートされていません');
      return null;
    }

    // コントローラーがなければ待機
    if (!navigator.serviceWorker.controller) {
      console.log('ShareHandler: ServiceWorkerコントローラーがありません、登録を待ちます');
      try {
        await this.waitForServiceWorkerController(5000); // 5秒待機
      } catch (error) {
        console.error('ShareHandler: ServiceWorkerコントローラーの待機中にタイムアウト', error);
      }
    }

    if (!navigator.serviceWorker.controller) {
      console.error('ShareHandler: ServiceWorkerコントローラーを取得できませんでした');
      return null;
    }

    console.log('ShareHandler: 共有画像の取得を試みます');

    try {
      // 方法1: MessageChannel APIを使用
      const messageChannelResult = await this.getSharedImageViaMessageChannel();
      if (messageChannelResult) {
        console.log('ShareHandler: MessageChannelで共有画像を取得しました');
        return messageChannelResult;
      }

      // 方法2: 通常のメッセージングを使用
      const standardMessagingResult = await this.getSharedImageViaStandardMessaging();
      if (standardMessagingResult) {
        console.log('ShareHandler: 通常のメッセージングで共有画像を取得しました');
        return standardMessagingResult;
      }

      // どちらの方法も失敗した場合
      console.log('ShareHandler: すべての方法で共有画像の取得に失敗しました');
      return null;
    } catch (error) {
      console.error('ShareHandler: 共有画像取得中にエラーが発生しました', error);
      return null;
    }
  }

  /**
   * ServiceWorkerコントローラーが利用可能になるまで待機
   */
  private async waitForServiceWorkerController(timeout: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (navigator.serviceWorker.controller) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('ServiceWorkerコントローラーの待機中にタイムアウトしました'));
      }, timeout);

      const controllerChangeListener = () => {
        clearTimeout(timeoutId);
        navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeListener);

        // controllerchangeイベント後、コントローラーが設定されるまで少し待機
        setTimeout(() => {
          if (navigator.serviceWorker.controller) {
            resolve();
          } else {
            reject(new Error('controllerchangeイベント後もコントローラーが設定されていません'));
          }
        }, 500);
      };

      navigator.serviceWorker.addEventListener('controllerchange', controllerChangeListener);
    });
  }

  /**
   * MessageChannel APIを使用して共有画像を取得
   */
  private async getSharedImageViaMessageChannel(): Promise<{ image: File, metadata: any } | null> {
    return new Promise<{ image: File, metadata: any } | null>((resolve, reject) => {
      try {
        if (!navigator.serviceWorker.controller) {
          resolve(null);
          return;
        }

        const messageChannel = new MessageChannel();
        const requestId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // タイムアウト設定
        const timeoutId = setTimeout(() => {
          this.messageChannelPromiseResolvers.delete(requestId);
          resolve(null);
        }, 3000);

        // メッセージチャネルの応答ハンドラー
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeoutId);

          if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
            resolve({
              image: event.data.data.image,
              metadata: event.data.data.metadata || {}
            });
          } else {
            resolve(null);
          }
        };

        // リクエストをServiceWorkerに送信
        navigator.serviceWorker.controller.postMessage(
          {
            action: 'getSharedImage',
            requestId: requestId
          },
          [messageChannel.port2]
        );

        // プロミスレゾルバーを登録 (グローバルメッセージイベントでも解決できるように)
        this.messageChannelPromiseResolvers.set(requestId, resolve);

      } catch (error) {
        console.error('ShareHandler: MessageChannelでの共有画像取得中にエラー', error);
        resolve(null);
      }
    });
  }

  /**
   * 通常のメッセージングを使用して共有画像を取得
   */
  private async getSharedImageViaStandardMessaging(): Promise<{ image: File, metadata: any } | null> {
    return new Promise<{ image: File, metadata: any } | null>((resolve, reject) => {
      try {
        if (!navigator.serviceWorker.controller) {
          resolve(null);
          return;
        }

        const requestId = `std-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // タイムアウト設定
        const timeoutId = setTimeout(() => {
          this.messageChannelPromiseResolvers.delete(requestId);
          resolve(null);
        }, 3000);

        // グローバルメッセージハンドラーでレスポンスを処理するため、
        // プロミスレゾルバーを登録
        this.messageChannelPromiseResolvers.set(requestId, (result: any) => {
          clearTimeout(timeoutId);
          resolve(result);
        });

        // リクエストをServiceWorkerに送信
        navigator.serviceWorker.controller.postMessage({
          action: 'getSharedImage',
          requestId: requestId
        });

      } catch (error) {
        console.error('ShareHandler: 標準メッセージングでの共有画像取得中にエラー', error);
        resolve(null);
      }
    });
  }

  /**
   * 処理中かどうかを返す
   */
  public isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  /**
   * 共有された画像ファイルを返す
   */
  public getSharedImageFile(): File | null {
    return this.sharedImageFile;
  }
}

/**
 * SharedImageData型の定義
 */
export interface SharedImageData {
  image: File;
  metadata?: any;
}
