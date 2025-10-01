import {
  updateSharedImageStore,
  clearSharedImageStore,
  getSharedImageFile,
  getSharedImageMetadata
} from '../stores/appStore.svelte';
import { FileUploadManager } from './fileUploadManager';
import type {
  SharedImageData,
  SharedImageMetadata,
  SharedImageProcessingResult,
  FileUploadDependencies
} from './types';

export class ShareHandler {
  private fileUploadManager: FileUploadManager;
  private isProcessingSharedImage = false;

  constructor(dependencies?: FileUploadDependencies) {
    this.fileUploadManager = new FileUploadManager(dependencies);
    console.log('[ShareHandler] constructed', { hasServiceWorker: 'serviceWorker' in navigator });
    this.setupServiceWorkerListeners();
  }

  private setupServiceWorkerListeners(): void {
    console.log('[ShareHandler] setupServiceWorkerListeners');
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
     }
   }

   private handleServiceWorkerMessage(event: MessageEvent): void {
    const { data, type } = event.data || {};
    console.log('[ShareHandler] handleServiceWorkerMessage', { type, data });
     if (type !== 'SHARED_IMAGE') return;

     if (data?.image) {
      console.log('[ShareHandler] updating shared image store from SW message', {
        name: data.image?.name,
        size: data.image?.size,
        metadata: data.metadata
      });
       updateSharedImageStore(data.image, data.metadata);
     }
   }

  // 共有判定（重複インポートを避けるため、独自実装）
  private checkIfOpenedFromShareInternal(): boolean {
    if (typeof window === 'undefined' || !window.location) return false;
    return new URLSearchParams(window.location.search).get('shared') === 'true';
  }

  // 共有画像の統一処理メソッド
  async checkForSharedImageOnLaunch(): Promise<SharedImageProcessingResult> {
    console.log('[ShareHandler] checkForSharedImageOnLaunch start', { alreadyProcessing: this.isProcessingSharedImage });
    if (this.isProcessingSharedImage) {
      return { success: false, error: '既に処理中です' };
    }

    if (!this.checkIfOpenedFromShareInternal()) {
      console.log('[ShareHandler] not opened from share (URL param missing)');
      return { success: false, error: '共有経由での起動ではありません' };
    }

    this.isProcessingSharedImage = true;

    try {
      // FileUploadManagerの統合メソッドを使用
      const result = await this.fileUploadManager.processSharedImageOnLaunch();

      console.log('[ShareHandler] processSharedImageOnLaunch result', result);
      if (result.success && result.data) {
        updateSharedImageStore(result.data.image, result.data.metadata);
      }

      return result;
    } finally {
      this.isProcessingSharedImage = false;
    }
  }

  // Service Workerからの取得（FileUploadManagerに委譲）
  async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
    return await this.fileUploadManager.getSharedImageFromServiceWorker();
  }

  // 共有判定（FileUploadManagerに委譲）
  checkIfOpenedFromShare(): boolean {
    return this.fileUploadManager.checkIfOpenedFromShare();
  }

  // その他のメソッド（既存機能維持）
  isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  getSharedImageFile(): File | null {
    return getSharedImageFile();
  }

  getSharedImageMetadata(): SharedImageMetadata | undefined {
    return getSharedImageMetadata();
  }

  clearSharedImage(): void {
    clearSharedImageStore();
  }
}

// シングルトンインスタンス
let globalShareHandler: ShareHandler | null = null;

export function getShareHandler(): ShareHandler {
  if (!globalShareHandler) {
    globalShareHandler = new ShareHandler();
  }
  return globalShareHandler;
}

// 後方互換性のための関数（統一）
export async function getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
  return await getShareHandler().getSharedImageFromServiceWorker();
}

export function checkIfOpenedFromShare(): boolean {
  return getShareHandler().checkIfOpenedFromShare();
}

