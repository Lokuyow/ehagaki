import {
  updateSharedImageStore,
  clearSharedImageStore,
  getSharedImageFile,
  getSharedImageMetadata
} from '../stores/appStore.svelte';
import type { SharedImageData, SharedImageMetadata } from './types';
import {
  checkIfOpenedFromShare,
  checkAndClearSharedFlagInIndexedDB,
  waitForServiceWorkerController,
  requestSharedImageWithMessageChannel
} from './utils/appUtils';

// 型定義はtypes.tsから再エクスポート
export type { SharedImageData, SharedImageMetadata } from './types';

type ServiceWorkerMessage = {
  type: 'SHARED_IMAGE';
  data: SharedImageData | null;
  requestId?: string;
  timestamp?: number;
};

export class ShareHandler {
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
      updateSharedImageStore(data.image, data.metadata);
    }

    if (requestId && this.requestCallbacks.has(requestId)) {
      this.requestCallbacks.get(requestId)!(data);
      this.requestCallbacks.delete(requestId);
    }
  }

  public static checkIfOpenedFromShare(): boolean {
    return checkIfOpenedFromShare();
  }

  public async checkForSharedImageOnLaunch(): Promise<SharedImageData | null> {
    // このメソッドはfileUploadManager.tsに集約するため削除
    // 利用側で直接fileUploadManagerのメソッドを呼ぶように変更
    return null;
  }

  public async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    try {
      await waitForServiceWorkerController();

      // MessageChannelを試す
      // MessageChannelを試す
      let result = await requestSharedImageWithMessageChannel();
      if (result) return result;

      // EventListener方式は未サポートまたは未実装

      // IndexedDBをチェック
      const hasFlag = await checkAndClearSharedFlagInIndexedDB();
      return hasFlag ? null : null; // フラグがあっても実際のデータは別途取得が必要
    } catch (error) {
      console.error('共有画像取得エラー:', error);
      return null;
    }
  }

  public isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  public getSharedImageFile(): File | null {
    return getSharedImageFile();
  }

  public getSharedImageMetadata(): SharedImageMetadata | undefined {
    return getSharedImageMetadata();
  }

  public clearSharedImage(): void {
    clearSharedImageStore();
  }
}

let globalShareHandler: ShareHandler | null = null;

export function getShareHandler(): ShareHandler {
  if (!globalShareHandler) globalShareHandler = new ShareHandler();
  return globalShareHandler;
}

