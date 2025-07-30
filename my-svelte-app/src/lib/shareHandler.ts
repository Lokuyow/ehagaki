/**
 * 外部アプリからの共有画像を処理する中央ハンドラークラス
 * - ServiceWorkerとの通信
 * - 共有画像の取得・管理
 * - カスタムイベントの発行
 */
export class ShareHandler {
  private sharedImageFile: File | null = null;
  private sharedImageMetadata: any = null;
  private isProcessingSharedImage: boolean = false;

  // リクエスト追跡用のマップ
  private requestCallbacks: Map<string, (result: SharedImageData | null) => void> = new Map();

  constructor() {
    this.setupServiceWorkerListeners();
  }

  /**
   * サービスワーカーのメッセージリスナーをセットアップ
   */
  private setupServiceWorkerListeners() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
    }
  }

  /**
   * サービスワーカーからのメッセージを処理
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    if (event.data?.type === 'SHARED_IMAGE') {
      const sharedData = event.data.data;
      const requestId = event.data.requestId;

      if (sharedData?.image) {
        this.sharedImageFile = sharedData.image;
        this.sharedImageMetadata = sharedData.metadata || {};
        this.dispatchSharedImageEvent();

        // リクエストIDが指定されていれば対応するコールバックを実行
        if (requestId && this.requestCallbacks.has(requestId)) {
          const callback = this.requestCallbacks.get(requestId);
          if (callback) {
            callback({
              image: this.sharedImageFile!,
              metadata: this.sharedImageMetadata
            });
            this.requestCallbacks.delete(requestId);
          }
        }
      } else if (requestId && this.requestCallbacks.has(requestId)) {
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
    } catch (error) {
      console.error('ShareHandler: イベント発行エラー', error);
    }
  }

  /**
   * URLパラメータから共有フラグを確認
   */
  public static checkIfOpenedFromShare(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('shared') && urlParams.get('shared') === 'true';
  }

  /**
   * アプリ起動時に共有された画像をチェックして取得する
   */
  public async checkForSharedImageOnLaunch(): Promise<SharedImageData | null> {
    if (!ShareHandler.checkIfOpenedFromShare()) {
      return null;
    }

    this.isProcessingSharedImage = true;

    try {
      const hasSharedFlag = await this.checkSharedFlagInIndexedDB();

      // 最大3回試行
      for (let i = 0; i < 3; i++) {
        const sharedImageData = await this.getSharedImageFromServiceWorker();
        if (sharedImageData) {
          this.sharedImageFile = sharedImageData.image;
          this.sharedImageMetadata = sharedImageData.metadata;
          this.dispatchSharedImageEvent();

          return sharedImageData;
        }

        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return null;
    } catch (error) {
      return null;
    } finally {
      this.isProcessingSharedImage = false;
    }
  }

  /**
   * ServiceWorkerから共有画像を取得（統合メソッド）
   */
  public async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    if (!navigator.serviceWorker.controller) {
      try {
        await this.waitForServiceWorkerController();
      } catch (e) {
        return null;
      }
    }

    if (!navigator.serviceWorker.controller) {
      return null;
    }

    return this.requestSharedImageFromServiceWorker();
  }

  /**
   * ServiceWorkerコントローラーが利用可能になるまで待機
   */
  private async waitForServiceWorkerController(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (navigator.serviceWorker.controller) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => reject(new Error('タイムアウト')), 5000);

      const onControllerChange = () => {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        setTimeout(() => resolve(), 500);
      };

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    });
  }

  /**
   * ServiceWorkerに共有画像をリクエスト
   */
  private async requestSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!navigator.serviceWorker.controller) {
      return null;
    }

    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const messageChannel = new MessageChannel();

    const promise = new Promise<SharedImageData | null>((resolve) => {
      const timeout = setTimeout(() => {
        this.requestCallbacks.delete(requestId);
        resolve(null);
      }, 3000);

      this.requestCallbacks.set(requestId, (result) => {
        clearTimeout(timeout);
        resolve(result);
      });

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
   * IndexedDBから共有フラグを確認して削除する
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
            resolve(false);
          }
        };
      } catch (err) {
        resolve(false);
      }
    });
  }

  // パブリックメソッド
  public isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  public getSharedImageFile(): File | null {
    return this.sharedImageFile;
  }

  public getSharedImageMetadata(): any {
    return this.sharedImageMetadata;
  }

  /**
   * 処理済み状態を取得
   */
  public hasProcessed(): boolean {
    return false;
  }
}

/**
 * 共有画像データ型
 */
export interface SharedImageData {
  image: File;
  metadata?: any;
}

// グローバルなShareHandlerインスタンス（シングルトン）
let globalShareHandler: ShareHandler | null = null;

/**
 * ShareHandlerのシングルトンインスタンスを取得
 */
export function getShareHandler(): ShareHandler {
  if (!globalShareHandler) {
    globalShareHandler = new ShareHandler();
  }
  return globalShareHandler;
}

