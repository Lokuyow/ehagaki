import { sharedImageStore } from './stores';

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

type ServiceWorkerMessage = {
  type: 'SHARED_IMAGE';
  data: SharedImageData | null;
  requestId?: string;
  timestamp?: number;
};

export class ShareHandler {
  private static readonly REQUEST_TIMEOUT = 5000;
  private static readonly RETRY_COUNT = 3;
  private static readonly RETRY_DELAY = 1000;

  private sharedImageFile: File | null = null;
  private sharedImageMetadata: SharedImageMetadata | null = null;
  private isProcessingSharedImage = false;
  private requestCallbacks = new Map<string, (result: SharedImageData | null) => void>();

  constructor() {
    this.setupServiceWorkerListeners();
  }

  private setupServiceWorkerListeners(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent<ServiceWorkerMessage>): void {
    const { data, type, requestId } = event.data || {};
    if (type !== 'SHARED_IMAGE') return;

    if (data?.image) {
      this.sharedImageFile = data.image;
      this.sharedImageMetadata = data.metadata || null;
      // Storeを更新
      sharedImageStore.set({
        file: this.sharedImageFile,
        metadata: this.sharedImageMetadata,
        received: true
      });
    }

    if (requestId && this.requestCallbacks.has(requestId)) {
      this.requestCallbacks.get(requestId)!(data);
      this.requestCallbacks.delete(requestId);
    }
  }

  private dispatchSharedImageEvent(): void {
    // ここはもう使われないので空実装に
  }

  public static checkIfOpenedFromShare(): boolean {
    return new URLSearchParams(window.location.search).get('shared') === 'true';
  }

  public async checkForSharedImageOnLaunch(): Promise<SharedImageData | null> {
    if (!ShareHandler.checkIfOpenedFromShare()) return null;
    this.isProcessingSharedImage = true;
    try {
      this.checkSharedFlagInIndexedDB().catch(() => { });
      for (let attempt = 0; attempt < ShareHandler.RETRY_COUNT; attempt++) {
        const sharedImageData = await this.getSharedImageFromServiceWorker();
        if (sharedImageData) {
          this.sharedImageFile = sharedImageData.image;
          this.sharedImageMetadata = sharedImageData.metadata || null;
          // Storeを更新
          sharedImageStore.set({
            file: this.sharedImageFile,
            metadata: this.sharedImageMetadata,
            received: true
          });
          // windowイベントの発火は不要
          // this.dispatchSharedImageEvent();
          return sharedImageData;
        }
        if (attempt < ShareHandler.RETRY_COUNT - 1) await this.delay(ShareHandler.RETRY_DELAY);
      }
      return null;
    } catch (error) {
      console.error('ShareHandler: 共有画像取得エラー', error);
      return null;
    } finally {
      this.isProcessingSharedImage = false;
    }
  }

  public async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    if (!('serviceWorker' in navigator)) return null;
    if (!navigator.serviceWorker.controller) {
      try { await this.waitForServiceWorkerController(); } catch { return null; }
    }
    if (!navigator.serviceWorker.controller) return null;
    try {
      return (await this.requestWithMessageChannel()) || (await this.requestWithEventListener());
    } catch (error) {
      console.error('ShareHandler: ServiceWorker通信エラー', error);
      return null;
    }
  }

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
    navigator.serviceWorker.controller.postMessage({ action: 'getSharedImage', requestId });
    return promise;
  }

  private async waitForServiceWorkerController(): Promise<void> {
    if (navigator.serviceWorker.controller) return;
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        reject(new Error('ServiceWorkerコントローラー待機タイムアウト'));
      }, ShareHandler.REQUEST_TIMEOUT);
      const onControllerChange = () => {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        setTimeout(resolve, 500);
      };
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    });
  }

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
              db.close(); resolve(false); return;
            }
            const transaction = db.transaction(['flags'], 'readwrite');
            const store = transaction.objectStore('flags');
            const getRequest = store.get('sharedImage');
            getRequest.onsuccess = () => {
              const flag = getRequest.result;
              if (flag?.value === true) {
                store.delete('sharedImage').onsuccess = () => { db.close(); resolve(true); };
              } else {
                db.close(); resolve(false);
              }
            };
            getRequest.onerror = () => { db.close(); resolve(false); };
          } catch { resolve(false); }
        };
      } catch { resolve(false); }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public isProcessing(): boolean { return this.isProcessingSharedImage; }
  public getSharedImageFile(): File | null { return this.sharedImageFile; }
  public getSharedImageMetadata(): SharedImageMetadata | null { return this.sharedImageMetadata; }
  public clearSharedImage(): void {
    this.sharedImageFile = null;
    this.sharedImageMetadata = null;
  }
}

let globalShareHandler: ShareHandler | null = null;

export function getShareHandler(): ShareHandler {
  if (!globalShareHandler) globalShareHandler = new ShareHandler();
  return globalShareHandler;
}

