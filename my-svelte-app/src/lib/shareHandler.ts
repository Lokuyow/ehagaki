/**
 * 外部アプリからの共有画像を処理するハンドラークラス
 */
export class ShareHandler {
  private sharedImageFile: File | null = null;
  private sharedImageMetadata: any = null;
  private isProcessingSharedImage: boolean = false;

  // リクエスト追跡用のマップ
  private requestCallbacks: Map<string, (result: SharedImageData | null) => void> = new Map();

  constructor() {
    this.setupServiceWorkerListeners();
    console.log('ShareHandler: 初期化完了');
  }

  /**
   * サービスワーカーのメッセージリスナーをセットアップ
   */
  private setupServiceWorkerListeners() {
    if ('serviceWorker' in navigator) {
      // グローバルなメッセージリスナー
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
      console.log('ShareHandler: サービスワーカーのメッセージリスナーを設定しました');
    } else {
      console.warn('ShareHandler: サービスワーカーがサポートされていません');
    }
  }

  /**
   * サービスワーカーからのメッセージを処理
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    // 共有画像データを含むメッセージかチェック
    if (event.data?.type === 'SHARED_IMAGE') {
      console.log('ShareHandler: 共有画像データを受信しました', event.data?.data?.image?.name || 'データなし');

      const sharedData = event.data.data;
      const requestId = event.data.requestId;

      if (sharedData?.image) {
        // 共有画像を保存
        this.sharedImageFile = sharedData.image;
        this.sharedImageMetadata = sharedData.metadata || {};

        // カスタムイベントを発火
        this.dispatchSharedImageEvent();

        // リクエストIDが指定されていれば対応するコールバックを実行
        if (requestId && this.requestCallbacks.has(requestId)) {
          const callback = this.requestCallbacks.get(requestId);
          if (callback) {
            if (this.sharedImageFile) {
              callback({
                image: this.sharedImageFile,
                metadata: this.sharedImageMetadata
              });
            } else {
              callback(null);
            }
            this.requestCallbacks.delete(requestId);
          }
        }
      } else if (requestId && this.requestCallbacks.has(requestId)) {
        // データがない場合も、対応するコールバックにnullを返す
        const callback = this.requestCallbacks.get(requestId);
        if (callback) {
          callback(null);
          this.requestCallbacks.delete(requestId);
        }
      }
    }
  }

  /**
   * 共有画像イベントを発行
   */
  private dispatchSharedImageEvent(): void {
    if (!this.sharedImageFile) return;

    try {
      const sharedImageEvent = new CustomEvent('shared-image-received', {
        detail: {
          file: this.sharedImageFile,
          metadata: this.sharedImageMetadata
        }
      });

      window.dispatchEvent(sharedImageEvent);
      console.log('ShareHandler: shared-image-receivedイベントを発行しました');
    } catch (error) {
      console.error('ShareHandler: イベント発行エラー', error);
    }
  }

  /**
   * アプリ起動時に共有された画像をチェックして取得する
   * @returns 共有された画像ファイル、またはnull
   */
  public async checkForSharedImageOnLaunch(): Promise<SharedImageData | null> {
    // URLパラメータで共有から起動されたかチェック
    const urlParams = new URLSearchParams(window.location.search);
    const wasShared = urlParams.has('shared') && urlParams.get('shared') === 'true';

    if (!wasShared) {
      console.log('ShareHandler: 共有からの起動ではありません');
      return null;
    }

    console.log('ShareHandler: 共有から起動されました、共有画像を確認します');
    this.isProcessingSharedImage = true;

    try {
      // IndexedDBから共有フラグを確認
      const hasSharedFlag = await this.checkSharedFlagInIndexedDB();
      console.log('ShareHandler: IndexedDBの共有フラグ:', hasSharedFlag);

      // 最大3回試行
      for (let i = 0; i < 3; i++) {
        console.log(`ShareHandler: サービスワーカーから共有画像を取得試行 (${i + 1}/3)`);

        const sharedImageData = await this.getSharedImageFromServiceWorker();
        if (sharedImageData) {
          // 成功した場合
          this.sharedImageFile = sharedImageData.image;
          this.sharedImageMetadata = sharedImageData.metadata;

          // カスタムイベントを発行
          this.dispatchSharedImageEvent();

          console.log('ShareHandler: 共有画像を取得しました',
            sharedImageData.image.name,
            `${Math.round(sharedImageData.image.size / 1024)}KB`
          );

          return sharedImageData;
        }

        // 失敗した場合は少し待機してから再試行
        if (i < 2) { // 最後の試行では待機しない
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
  }

  /**
   * IndexedDBから共有フラグを確認して削除する
   * @returns フラグが存在するかどうか
   */
  private async checkSharedFlagInIndexedDB(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('eHagakiSharedData', 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('flags')) {
            db.createObjectStore('flags', { keyPath: 'id' });
          }
        };

        request.onerror = () => resolve(false);

        request.onsuccess = (event) => {
          try {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('flags')) {
              resolve(false);
              return;
            }

            const transaction = db.transaction(['flags'], 'readwrite');
            const store = transaction.objectStore('flags');

            const getRequest = store.get('sharedImage');

            getRequest.onsuccess = () => {
              const flag = getRequest.result;
              if (flag && flag.value === true) {
                // フラグが存在し、trueなら共有されている
                // フラグを削除（一度だけ使用）
                try {
                  store.delete('sharedImage');
                } catch (e) {
                  console.error('ShareHandler: フラグ削除エラー', e);
                }

                resolve(true);
              } else {
                resolve(false);
              }
            };

            getRequest.onerror = () => resolve(false);
          } catch (err) {
            console.error('ShareHandler: IndexedDB操作エラー', err);
            resolve(false);
          }
        };
      } catch (err) {
        console.error('ShareHandler: IndexedDB初期化エラー', err);
        resolve(false);
      }
    });
  }

  /**
   * サービスワーカーから共有画像を取得する
   * @returns 共有画像データまたはnull
   */
  private async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return this.waitForServiceWorkerAndGetImage();
    }

    return this.requestSharedImageFromServiceWorker();
  }

  /**
   * ServiceWorkerが利用可能になるまで待機してから画像を取得
   */
  private async waitForServiceWorkerAndGetImage(): Promise<SharedImageData | null> {
    // ServiceWorkerが利用可能になるまで最大3秒待機
    try {
      await new Promise<void>((resolve, reject) => {
        if (navigator.serviceWorker.controller) {
          resolve();
          return;
        }

        const timeout = setTimeout(() => reject(new Error('タイムアウト')), 3000);

        const onControllerChange = () => {
          clearTimeout(timeout);
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
          // コントローラー変更後少し待機
          setTimeout(() => resolve(), 500);
        };

        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
      });

      // コントローラーが利用可能になったら画像取得を試行
      if (navigator.serviceWorker.controller) {
        return this.requestSharedImageFromServiceWorker();
      }
    } catch (error) {
      console.error('ShareHandler: ServiceWorker待機エラー', error);
    }

    return null;
  }

  /**
   * ServiceWorkerに共有画像をリクエスト
   */
  private async requestSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!navigator.serviceWorker.controller) {
      return null;
    }

    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // MessageChannelを作成
    const messageChannel = new MessageChannel();

    // プロミスを作成
    const promise = new Promise<SharedImageData | null>((resolve) => {
      // タイムアウト設定
      const timeout = setTimeout(() => {
        this.requestCallbacks.delete(requestId);
        resolve(null);
      }, 3000);

      // リクエストのコールバックを登録
      this.requestCallbacks.set(requestId, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

      // MessageChannel のメッセージハンドラ
      messageChannel.port1.onmessage = (event) => {
        clearTimeout(timeout);

        if (event.data?.type === 'SHARED_IMAGE' && event.data?.data?.image) {
          const data = event.data.data;
          resolve({
            image: data.image,
            metadata: data.metadata || {}
          });
        } else {
          resolve(null);
        }
      };
    });

    // リクエストをServiceWorkerに送信
    navigator.serviceWorker.controller.postMessage(
      {
        action: 'getSharedImage',
        requestId: requestId
      },
      [messageChannel.port2]
    );

    return promise;
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
    return this?.sharedImageFile ?? null;
  }

  /**
   * 共有されたメタデータを返す
   */
  public getSharedImageMetadata(): any {
    return this.sharedImageMetadata;
  }
}

/**
 * 共有画像データ型
 */
export interface SharedImageData {
  image: File;
  metadata?: any;
}

