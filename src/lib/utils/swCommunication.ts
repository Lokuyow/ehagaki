import type { SharedMediaData } from "../types";
import { SHARE_HANDLER_CONFIG } from '../constants';

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
 * IndexedDBから共有メディアデータを取得・削除
 */
async function getAndClearSharedMediaFromIndexedDB(): Promise<SharedMediaData | null> {
  const result = await getFromIndexedDB(
    SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
    SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
    SHARE_HANDLER_CONFIG.STORE_NAME,
    'sharedMediaData'
  );

  if (result?.data) {
    await deleteFromIndexedDB(
      SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
      SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
      SHARE_HANDLER_CONFIG.STORE_NAME,
      'sharedMediaData'
    );

    // 複数メディア対応: images配列から File を再構築
    const rawImages: Array<{ name?: string; type?: string; size?: number; arrayBuffer?: ArrayBuffer; _isFile?: boolean }> =
      result.data.images ?? (result.data.image ? [result.data.image] : []);

    if (rawImages.length > 0) {
      const files = rawImages.map((img) => {
        if (img.arrayBuffer && img._isFile) {
          return new File(
            [img.arrayBuffer],
            img.name || 'shared-media',
            { type: img.type || 'application/octet-stream' }
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
      } as SharedMediaData;
    }
  }
  return null;
}

/**
 * MessageChannelを使ってServiceWorkerから共有メディアを取得
 */
async function requestSharedMediaWithMessageChannel(): Promise<SharedMediaData | null> {
  try {
    const data = await sendMessageToServiceWorker({ action: 'getSharedMedia' });
    return data && Array.isArray(data.images) && data.images.length > 0 ? data : null;
  } catch (error) {
    console.error('Failed to send message to ServiceWorker:', error);
    return null;
  }
}

/**
 * 複数の方法で共有メディアを取得（フォールバック付き）
 */
export async function getSharedMediaWithFallback(): Promise<SharedMediaData | null> {
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
      const swResult = await requestSharedMediaWithMessageChannel();
      if (swResult) {
        console.log('Shared media retrieved via ServiceWorker MessageChannel');
        return swResult;
      }
    } catch (swError) {
      console.warn('Service Worker MessageChannel failed:', swError);
    }

    try {
      const dbResult = await getAndClearSharedMediaFromIndexedDB();
      if (dbResult) {
        console.log('Shared media retrieved via IndexedDB fallback');
        return dbResult;
      }
    } catch (dbError) {
      console.warn('IndexedDB fallback failed:', dbError);
    }

    try {
      const data = await sendMessageToServiceWorker({ action: 'getSharedMediaForce' }, 1000);
      const result = data && Array.isArray(data.images) && data.images.length > 0 ? data : null;
      if (result) {
        console.log('Shared media retrieved via forced Service Worker request');
        return result;
      }
    } catch (forceError) {
      console.warn('Forced Service Worker request failed:', forceError);
    }

    console.log('No shared media found through any method');
    return null;
  } catch (error) {
    console.error('Error in getSharedMediaWithFallback:', error);
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
