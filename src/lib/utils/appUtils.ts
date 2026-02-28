import type {
  SharedImageData,
  StorageAdapter,
  NavigatorAdapter,
  WindowAdapter,
  TimeoutAdapter,
} from "../types";
import {
  STORAGE_KEYS,
  uploadEndpoints,
  getDefaultEndpoint,
  SHARE_HANDLER_CONFIG
} from '../constants';

// =============================================================================
// External Dependencies (Injectable for Testing)
// =============================================================================

// Default implementations
export const defaultStorageAdapter: StorageAdapter = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value)
};

export const defaultNavigatorAdapter: NavigatorAdapter = {
  language: navigator.language
};

export const defaultWindowAdapter: WindowAdapter = {
  location: {
    reload: () => window.location.reload()
  }
};

export const defaultTimeoutAdapter: TimeoutAdapter = {
  setTimeout: (callback: () => void, delay: number) => setTimeout(callback, delay)
};

// =============================================================================
// ID Generation Utilities
// =============================================================================

/**
 * メディアギャラリーアイテム用のユニークIDを生成
 * @returns ユニークなID文字列
 */
export function generateMediaItemId(): string {
  return crypto.randomUUID();
}

/**
 * 簡易UUID生成関数
 */
export function generateSimpleUUID(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// =============================================================================
// Settings Utilities (Refactored for Testability)
// =============================================================================

/**
 * 有効なロケールを取得
 */
function getEffectiveLocale(
  storage: StorageAdapter,
  navigator: NavigatorAdapter
): string {
  const storedLocale = storage.getItem(STORAGE_KEYS.LOCALE);
  const browserLocale = navigator.language;
  return storedLocale || (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");
}

/**
 * アップロード先エンドポイントを取得
 */
function getEndpoint(
  effectiveLocale: string,
  storage: StorageAdapter,
  selectedEndpoint?: string
): string {
  const savedEndpoint = storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT);
  if (savedEndpoint && uploadEndpoints.some((ep) => ep.url === savedEndpoint)) {
    return savedEndpoint;
  }
  return selectedEndpoint || getDefaultEndpoint(effectiveLocale);
}

/**
 * クライアントタグ設定を取得
 */
function getClientTagEnabled(storage: StorageAdapter): boolean {
  const clientTagSetting = storage.getItem(STORAGE_KEYS.CLIENT_TAG_ENABLED);
  const enabled = clientTagSetting === null ? true : clientTagSetting === "true";
  if (clientTagSetting === null) {
    storage.setItem(STORAGE_KEYS.CLIENT_TAG_ENABLED, "true");
  }
  return enabled;
}

/**
 * 圧縮設定を取得
 */
function getCompression(storage: StorageAdapter, selectedCompression?: string): string {
  const savedCompression = storage.getItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL);
  return savedCompression || selectedCompression || "medium";
}

/**
 * 設定の初期化処理
 */
export function initializeSettingsValues(
  options: {
    selectedEndpoint?: string;
    selectedCompression?: string;
    storage?: StorageAdapter;
    navigator?: NavigatorAdapter;
  } = {}
) {
  const {
    selectedEndpoint,
    selectedCompression,
    storage = defaultStorageAdapter,
    navigator: nav = defaultNavigatorAdapter
  } = options;

  const effectiveLocale = getEffectiveLocale(storage, nav);
  const endpoint = getEndpoint(effectiveLocale, storage, selectedEndpoint);
  const clientTagEnabled = getClientTagEnabled(storage);
  const compression = getCompression(storage, selectedCompression);

  return {
    endpoint,
    clientTagEnabled,
    compression
  };
}

/**
 * Service Worker更新処理
 */
export function handleServiceWorkerRefresh(
  handleSwUpdate: () => void,
  setUpdating: (value: boolean) => void,
  options: {
    timeout?: number;
    windowAdapter?: WindowAdapter;
    timeoutAdapter?: TimeoutAdapter;
  } = {}
) {
  const {
    timeout = 1000,
    windowAdapter = defaultWindowAdapter,
    timeoutAdapter = defaultTimeoutAdapter
  } = options;

  setUpdating(true);
  handleSwUpdate();
  timeoutAdapter.setTimeout(() => {
    windowAdapter.location.reload();
  }, timeout);
}

// =============================================================================
// IndexedDB Utilities (Common Operations)
// =============================================================================

/**
 * IndexedDBを開いてストアを取得する共通関数
 */
async function openIndexedDBStore(
  dbName: string,
  version: number,
  storeName: string,
  mode: IDBTransactionMode = 'readonly'
): Promise<{ db: IDBDatabase; transaction: IDBTransaction; store: IDBObjectStore } | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onerror = () => resolve(null);

      request.onsuccess = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.close();
            resolve(null);
            return;
          }

          const transaction = db.transaction([storeName], mode);
          const store = transaction.objectStore(storeName);
          resolve({ db, transaction, store });
        } catch {
          resolve(null);
        }
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * IndexedDBからデータを取得する共通関数
 */
async function getFromIndexedDB(
  dbName: string,
  version: number,
  storeName: string,
  key: string
): Promise<any> {
  const result = await openIndexedDBStore(dbName, version, storeName, 'readonly');
  if (!result) return null;

  const { db, store } = result;
  return new Promise((resolve) => {
    const getRequest = store.get(key);
    getRequest.onsuccess = () => {
      db.close();
      resolve(getRequest.result);
    };
    getRequest.onerror = () => {
      db.close();
      resolve(null);
    };
  });
}

/**
 * IndexedDBからデータを削除する共通関数
 */
async function deleteFromIndexedDB(
  dbName: string,
  version: number,
  storeName: string,
  key: string
): Promise<boolean> {
  const result = await openIndexedDBStore(dbName, version, storeName, 'readwrite');
  if (!result) return false;

  const { db, store } = result;
  return new Promise((resolve) => {
    const deleteRequest = store.delete(key);
    deleteRequest.onsuccess = () => {
      db.close();
      resolve(true);
    };
    deleteRequest.onerror = () => {
      db.close();
      resolve(false);
    };
  });
}

/**
 * リクエストIDを生成
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// Service Worker Communication Utilities (Common Operations)
// =============================================================================

/**
 * Service Workerにメッセージを送信し、レスポンスを待つ共通関数
 */
async function sendMessageToServiceWorker(
  message: any,
  timeoutMs: number = SHARE_HANDLER_CONFIG.REQUEST_TIMEOUT
): Promise<any> {
  if (!navigator.serviceWorker.controller) {
    throw new Error('No ServiceWorker controller available');
  }

  const messageChannel = new MessageChannel();
  const requestId = generateRequestId();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      messageChannel.port1.close();
      reject(new Error('ServiceWorker communication timeout'));
    }, timeoutMs);

    messageChannel.port1.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);
      messageChannel.port1.close();
      const { data } = event.data || {};
      resolve(data);
    };

    messageChannel.port1.addEventListener('error', (error) => {
      clearTimeout(timeout);
      messageChannel.port1.close();
      reject(error);
    });

    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { ...message, requestId },
          [messageChannel.port2]
        );
      } else {
        throw new Error('ServiceWorker controller became unavailable');
      }
    } catch (error) {
      clearTimeout(timeout);
      messageChannel.port1.close();
      reject(error);
    }
  });
}

/**
 * IndexedDBから共有フラグをチェックして削除 - 削除（外部未使用）
 *
 * ServiceWorkerの準備を待つ
 */
async function waitForServiceWorkerController(): Promise<void> {
  if (navigator.serviceWorker.controller) return;

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      reject(new Error('ServiceWorkerコントローラー待機タイムアウト'));
    }, SHARE_HANDLER_CONFIG.REQUEST_TIMEOUT);

    const onControllerChange = () => {
      clearTimeout(timeout);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      setTimeout(resolve, SHARE_HANDLER_CONFIG.SW_CONTROLLER_WAIT_TIMEOUT);
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
  });
}

/**
 * IndexedDBから共有画像データを取得・削除
 */
async function getAndClearSharedImageFromIndexedDB(): Promise<SharedImageData | null> {
  const result = await getFromIndexedDB(
    SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
    SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
    SHARE_HANDLER_CONFIG.STORE_NAME,
    'sharedImageData'
  );

  if (result?.data) {
    await deleteFromIndexedDB(
      SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
      SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
      SHARE_HANDLER_CONFIG.STORE_NAME,
      'sharedImageData'
    );

    // 複数画像対応: images配列から File を再構築
    const rawImages: Array<{ name?: string; type?: string; size?: number; arrayBuffer?: ArrayBuffer; _isFile?: boolean }> =
      result.data.images ?? (result.data.image ? [result.data.image] : []);

    if (rawImages.length > 0) {
      const files = rawImages.map((img) => {
        if (img.arrayBuffer && img._isFile) {
          return new File(
            [img.arrayBuffer],
            img.name || 'shared-image',
            { type: img.type || 'image/jpeg' }
          );
        }
        return img as unknown as File;
      });

      const metadataArr = result.data.metadata ?? result.data.images?.map((img: { name?: string; type?: string; size?: number }) => ({
        name: img.name,
        type: img.type,
        size: img.size
      })) ?? [];

      return {
        images: files,
        metadata: metadataArr
      } as SharedImageData;
    }
  }
  return null;
}

/**
 * MessageChannelを使ってServiceWorkerから共有画像を取得
 */
async function requestSharedImageWithMessageChannel(): Promise<SharedImageData | null> {
  try {
    const data = await sendMessageToServiceWorker({ action: 'getSharedImage' });
    return data && Array.isArray(data.images) && data.images.length > 0 ? data : null;
  } catch (error) {
    console.error('Failed to send message to ServiceWorker:', error);
    return null;
  }
}

/**
 * 複数の方法で共有画像を取得（フォールバック付き）
 */
export async function getSharedImageWithFallback(): Promise<SharedImageData | null> {
  try {
    try {
      await Promise.race([
        waitForServiceWorkerController(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SW controller timeout')), 2000))
      ]);
    } catch (swError) {
      console.warn('Service Worker controller not ready, trying alternatives:', swError);
    }

    try {
      const swResult = await requestSharedImageWithMessageChannel();
      if (swResult) {
        console.log('Shared image retrieved via ServiceWorker MessageChannel');
        return swResult;
      }
    } catch (swError) {
      console.warn('Service Worker MessageChannel failed:', swError);
    }

    try {
      const dbResult = await getAndClearSharedImageFromIndexedDB();
      if (dbResult) {
        console.log('Shared image retrieved via IndexedDB fallback');
        return dbResult;
      }
    } catch (dbError) {
      console.warn('IndexedDB fallback failed:', dbError);
    }

    try {
      const data = await sendMessageToServiceWorker({ action: 'getSharedImageForce' }, 1000);
      const result = data && Array.isArray(data.images) && data.images.length > 0 ? data : null;
      if (result) {
        console.log('Shared image retrieved via forced Service Worker request');
        return result;
      }
    } catch (forceError) {
      console.warn('Forced Service Worker request failed:', forceError);
    }

    console.log('No shared image found through any method');
    return null;
  } catch (error) {
    console.error('Error in getSharedImageWithFallback:', error);
    return null;
  }
}

/**
 * Service Workerの状態をチェック
 */
export async function checkServiceWorkerStatus(): Promise<{
  isReady: boolean;
  hasController: boolean;
  error?: string;
}> {
  if (!('serviceWorker' in navigator)) {
    return { isReady: false, hasController: false, error: 'Service Worker not supported' };
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const hasController = !!navigator.serviceWorker.controller;

  if (!registration) {
    return { isReady: false, hasController, error: 'Service Worker not registered' };
  }

  const isReady = registration.active !== null;
  return { isReady, hasController };
}

/**
 * Service Workerとの通信テスト
 */
export async function testServiceWorkerCommunication(): Promise<boolean> {
  try {
    const data = await sendMessageToServiceWorker({ type: 'PING_TEST' }, 3000);
    console.log('ServiceWorker communication test successful:', data);
    return true;
  } catch (error) {
    console.warn('ServiceWorker communication test timeout');
    console.error('ServiceWorker communication test error:', error);
    return false;
  }
}

/**
 * イベントから位置座標を取得（クリックまたはタップ）
 */
export function getEventPosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
  if (event.type.startsWith('touch')) {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  } else {
    const mouseEvent = event as MouseEvent;
    return { x: mouseEvent.clientX, y: mouseEvent.clientY };
  }
}

/**
 * コンテキストメニューの位置をビューポート内に収める
 */
export function calculateContextMenuPosition(
  x: number,
  y: number,
  margin?: number,
  popupWidth?: number,
  popupHeight?: number
): { x: number; y: number } {
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;

  // marginが未指定なら0
  const safeMargin = typeof margin === "number" ? margin : 0;

  // ポップアップサイズが指定されていればその分だけ余白を取る
  const maxX = popupWidth
    ? viewportWidth - popupWidth - safeMargin
    : viewportWidth - safeMargin;
  const maxY = popupHeight
    ? viewportHeight - popupHeight - safeMargin
    : viewportHeight - safeMargin;

  return {
    x: Math.max(safeMargin, Math.min(maxX, x)),
    y: Math.max(safeMargin, Math.min(maxY, y)),
  };
}

// =============================================================================
// Array Utilities
// =============================================================================

/**
 * 配列を指定サイズのチャンクに分割する
 * @param array 分割する配列
 * @param size 各チャンクのサイズ
 * @returns チャンクの配列
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

