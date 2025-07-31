/**
 * 共有画像データ型
 */
export interface SharedImageData {
  image: File;
  metadata?: SharedImageMetadata;
}

/**
 * 共有画像のメタデータ型
 */
export interface SharedImageMetadata {
  name?: string;
  type?: string;
  size?: number;
  timestamp?: string;
}

/**
 * ServiceWorkerメッセージ型
 */
interface ServiceWorkerMessage {
  type: 'SHARED_IMAGE';
  data: SharedImageData | null;
  requestId?: string;
  timestamp?: number;
}

/**
 * 外部アプリからの共有画像を処理する中央ハンドラークラス
 * 責務: ServiceWorkerとの通信、共有画像の取得・管理、カスタムイベントの発行
 */
export class ShareHandler {
  private static readonly REQUEST_TIMEOUT = 5000;
  private static readonly RETRY_COUNT = 3;
  private static readonly RETRY_DELAY = 1000;

  private sharedImageFile: File | null = null;
  private sharedImageMetadata: SharedImageMetadata | null = null;
  private isProcessingSharedImage: boolean = false;
  private requestCallbacks: Map<string, (result: SharedImageData | null) => void> = new Map();

  constructor() {
    this.setupServiceWorkerListeners();
  }

  /**
   * サービスワーカーのメッセージリスナーをセットアップ
   */
  private setupServiceWorkerListeners(): void {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
  }

  /**
   * サービスワーカーからのメッセージを処理
   */
  private handleServiceWorkerMessage(event: MessageEvent<ServiceWorkerMessage>): void {
    const { data, type } = event.data || {};
    
    if (type !== 'SHARED_IMAGE') return;

    const { requestId } = event.data;
    const sharedData = data;

    if (sharedData?.image) {
      this.sharedImageFile = sharedData.image;
      this.sharedImageMetadata = sharedData.metadata || null;
      this.dispatchSharedImageEvent();
    }

    // リクエストIDに対応するコールバックを実行
    if (requestId && this.requestCallbacks.has(requestId)) {
      const callback = this.requestCallbacks.get(requestId)!;
      callback(sharedData);
      this.requestCallbacks.delete(requestId);
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
    return urlParams.get('shared') === 'true';
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
      // IndexedDBのフラグをチェック（バックグラウンド処理）
      this.checkSharedFlagInIndexedDB().catch(() => {});

      // 複数回試行してServiceWorkerから画像を取得
      for (let attempt = 0; attempt < ShareHandler.RETRY_COUNT; attempt++) {
        const sharedImageData = await this.getSharedImageFromServiceWorker();
        
        if (sharedImageData) {
          this.sharedImageFile = sharedImageData.image;
          this.sharedImageMetadata = sharedImageData.metadata || null;
          this.dispatchSharedImageEvent();
          return sharedImageData;
        }

        // 最後の試行でなければ待機
        if (attempt < ShareHandler.RETRY_COUNT - 1) {
          await this.delay(ShareHandler.RETRY_DELAY);
        }
      }

      return null;
    } catch (error) {
      console.error('ShareHandler: 共有画像取得エラー', error);
      return null;
    } finally {
      this.isProcessingSharedImage = false;
    }
  }

  /**
   * ServiceWorkerから共有画像を取得
   */
  public async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!('serviceWorker' in navigator)) return null;

    // ServiceWorkerコントローラーが利用可能になるまで待機
    if (!navigator.serviceWorker.controller) {
      try {
        await this.waitForServiceWorkerController();
      } catch {
        return null;
      }
    }

    if (!navigator.serviceWorker.controller) return null;

    try {
      // MessageChannelを優先的に使用
      const messageChannelResult = await this.requestWithMessageChannel();
      if (messageChannelResult) return messageChannelResult;

      // フォールバック: 通常のメッセージイベント
      return await this.requestWithEventListener();
    } catch (error) {
      console.error('ShareHandler: ServiceWorker通信エラー', error);
      return null;
    }
  }

  /**
   * MessageChannelを使用したServiceWorkerとの通信
   */
  private async requestWithMessageChannel(): Promise<SharedImageData | null> {
    if (!navigator.serviceWorker.controller) return null;

    const messageChannel = new MessageChannel();
    const requestId = this.generateRequestId();

    const promise = new Promise<SharedImageData | null>((resolve) => {
      const timeout = setTimeout(() => resolve(null), ShareHandler.REQUEST_TIMEOUT);

      messageChannel.port1.onmessage = (event: MessageEvent<ServiceWorkerMessage>) => {
        clearTimeout(timeout);
        
        const { data } = event.data || {};
        resolve(data && data.image ? data : null);
      };
    });

    navigator.serviceWorker.controller.postMessage(
      { action: 'getSharedImage', requestId },
      [messageChannel.port2]
    );

    return promise;
  }

  /**
   * 通常のイベントリスナーを使用したServiceWorkerとの通信
   */
  private async requestWithEventListener(): Promise<SharedImageData | null> {
    if (!navigator.serviceWorker.controller) return null;

    const requestId = this.generateRequestId();

    const promise = new Promise<SharedImageData | null>((resolve) => {
      this.requestCallbacks.set(requestId, resolve);

      setTimeout(() => {
        this.requestCallbacks.delete(requestId);
        resolve(null);
      }, ShareHandler.REQUEST_TIMEOUT);
    });

    navigator.serviceWorker.controller.postMessage({ 
      action: 'getSharedImage', 
      requestId 
    });

    return promise;
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

      const timeout = setTimeout(() => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        reject(new Error('ServiceWorkerコントローラー待機タイムアウト'));
      }, ShareHandler.REQUEST_TIMEOUT);

      const onControllerChange = () => {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        // 少し待ってからresolve
        setTimeout(resolve, 500);
      };

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    });
  }

  /**
   * IndexedDBから共有フラグを確認して削除
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
              db.close();
              resolve(false);
              return;
            }

            const transaction = db.transaction(['flags'], 'readwrite');
            const store = transaction.objectStore('flags');
            const getRequest = store.get('sharedImage');

            getRequest.onsuccess = () => {
              const flag = getRequest.result;
              if (flag?.value === true) {
                // フラグを削除
                store.delete('sharedImage').onsuccess = () => {
                  db.close();
                  resolve(true);
                };
              } else {
                db.close();
                resolve(false);
              }
            };

            getRequest.onerror = () => {
              db.close();
              resolve(false);
            };
          } catch (error) {
            resolve(false);
          }
        };
      } catch (error) {
        resolve(false);
      }
    });
  }

  /**
   * 遅延処理のためのユーティリティメソッド
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ユニークなリクエストIDを生成
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // パブリックメソッド
  public isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  public getSharedImageFile(): File | null {
    return this.sharedImageFile;
  }

  public getSharedImageMetadata(): SharedImageMetadata | null {
    return this.sharedImageMetadata;
  }

  public clearSharedImage(): void {
    this.sharedImageFile = null;
    this.sharedImageMetadata = null;
  }
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

