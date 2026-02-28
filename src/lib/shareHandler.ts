import {
  updateSharedMediaStore,
  clearSharedMediaStore,
  getSharedMediaFiles,
  getSharedMediaMetadata
} from '../stores/appStore.svelte';
import { FileUploadManager } from './fileUploadManager';
import type {
  SharedMediaData,
  SharedMediaMetadata,
  SharedMediaProcessingResult,
  FileUploadDependencies
} from './types';

export class ShareHandler {
  private fileUploadManager: FileUploadManager;
  private isProcessingSharedMedia = false;

  constructor(dependencies?: FileUploadDependencies) {
    this.fileUploadManager = new FileUploadManager(dependencies);
    this.setupServiceWorkerListeners();
  }

  private setupServiceWorkerListeners(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { data, type } = event.data || {};
    if (type !== 'SHARED_MEDIA') return;

    if (data?.images?.length) {
      updateSharedMediaStore(data.images, data.metadata);
    }
  }

  // 共有メディアの統一処理メソッド
  async checkForSharedMediaOnLaunch(): Promise<SharedMediaProcessingResult> {
    if (this.isProcessingSharedMedia) {
      return { success: false, error: '既に処理中です' };
    }

    if (!this.fileUploadManager.checkIfOpenedFromShare()) {
      return { success: false, error: '共有経由での起動ではありません' };
    }

    this.isProcessingSharedMedia = true;

    try {
      // FileUploadManagerの統合メソッドを使用
      const result = await this.fileUploadManager.processSharedMediaOnLaunch();

      if (result.success && result.data) {
        updateSharedMediaStore(result.data.images, result.data.metadata);
      }

      return result;
    } finally {
      this.isProcessingSharedMedia = false;
    }
  }

  // Service Workerからの取得（FileUploadManagerに委譲）
  async getSharedMediaFromServiceWorker(): Promise<SharedMediaData | null> {
    return await this.fileUploadManager.getSharedMediaFromServiceWorker();
  }

  // 共有判定（FileUploadManagerに委譲）
  checkIfOpenedFromShare(): boolean {
    return this.fileUploadManager.checkIfOpenedFromShare();
  }

  // その他のメソッド（既存機能維持）
  isProcessing(): boolean {
    return this.isProcessingSharedMedia;
  }

  getSharedMediaFiles(): File[] {
    return getSharedMediaFiles();
  }

  getSharedMediaMetadata(): SharedMediaMetadata[] | undefined {
    return getSharedMediaMetadata();
  }

  clearSharedMedia(): void {
    clearSharedMediaStore();
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
export async function getSharedMediaFromServiceWorker(): Promise<SharedMediaData | null> {
  return await getShareHandler().getSharedMediaFromServiceWorker();
}

export function checkIfOpenedFromShare(): boolean {
  return getShareHandler().checkIfOpenedFromShare();
}

