import { getPublicKey, nip19 } from "nostr-tools";
import type {
  FileSizeInfo,
  SizeDisplayInfo,
  PublicKeyData,
  SharedImageData,
  StorageAdapter,
  NavigatorAdapter,
  WindowAdapter,
  TimeoutAdapter,
  MousePosition,
  ZoomCalculation,
  ZoomParams,
  ImageDimensions
} from "../types";
import {
  STORAGE_KEYS,
  uploadEndpoints,
  getDefaultEndpoint,
  NSEC_PATTERN,
  NSEC_FULL_PATTERN,
  SHARE_HANDLER_CONFIG
} from '../constants';
import { calculateImageDisplaySize } from '../utils/imageUtils';

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
// File Size Utilities (Pure Functions)
// =============================================================================

/**
 * ファイルサイズを人間に読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0KB';
  const kb = Math.round(bytes / 1024);
  return `${kb}KB`;
}

/**
 * 圧縮率を計算
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : 100;
}

/**
 * サイズ削減表示文字列を生成
 */
export function createSizeReductionText(originalSize: number, compressedSize: number): string {
  return `${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`;
}

/**
 * ファイルサイズ情報を生成
 */
export function createFileSizeInfo(
  originalSize: number,
  compressedSize: number,
  wasCompressed: boolean,
  originalFilename?: string,
  compressedFilename?: string,
  wasSkipped?: boolean
): FileSizeInfo {
  return {
    originalSize,
    compressedSize,
    wasCompressed,
    compressionRatio: calculateCompressionRatio(originalSize, compressedSize),
    sizeReduction: createSizeReductionText(originalSize, compressedSize),
    originalFilename,
    compressedFilename,
    wasSkipped
  };
}

/**
 * ファイルサイズ情報に変化があるかチェック
 */
export function hasFileSizeChanges(sizeInfo: FileSizeInfo): boolean {
  return sizeInfo.wasCompressed ||
    (sizeInfo.originalFilename !== sizeInfo.compressedFilename) ||
    (sizeInfo.originalSize !== sizeInfo.compressedSize) ||
    !!sizeInfo.wasSkipped;
}

/**
 * サイズ情報から表示用の構造化データを生成
 */
export function generateSizeDisplayInfo(sizeInfo: FileSizeInfo | null): SizeDisplayInfo | null {
  if (!sizeInfo || !hasFileSizeChanges(sizeInfo)) {
    return null;
  }

  return {
    wasCompressed: sizeInfo.wasCompressed,
    originalSize: formatFileSize(sizeInfo.originalSize),
    compressedSize: formatFileSize(sizeInfo.compressedSize),
    compressionRatio: sizeInfo.compressionRatio,
    originalFilename: sizeInfo.originalFilename,
    compressedFilename: sizeInfo.compressedFilename,
    wasSkipped: sizeInfo.wasSkipped
  };
}

// =============================================================================
// Nostr Key Utilities (Pure Functions)
// =============================================================================

/**
 * 秘密鍵(nsec)が含まれているかチェック
 */
export function containsSecretKey(text: string): boolean {
  return NSEC_PATTERN.test(text);
}

/**
 * nsec形式の秘密鍵が有効かチェック
 */
export function isValidNsec(key: string): boolean {
  return NSEC_FULL_PATTERN.test(key);
}

/**
 * nsecから公開鍵のhex形式を導出
 */
export function derivePublicKeyHex(nsecData: Uint8Array): string {
  return getPublicKey(nsecData);
}

/**
 * 公開鍵のhex形式からnpubとnprofileを生成
 */
export function createPublicKeyFormats(hex: string): { npub: string; nprofile: string } {
  return {
    npub: nip19.npubEncode(hex),
    nprofile: nip19.nprofileEncode({ pubkey: hex, relays: [] })
  };
}

/**
 * nsec形式の秘密鍵から公開鍵情報を導出する
 */
export function derivePublicKeyFromNsec(nsec: string): PublicKeyData {
  try {
    const { type, data } = nip19.decode(nsec);
    if (type !== "nsec") {
      console.warn("無効なnsec形式です");
      return { hex: "", npub: "", nprofile: "" };
    }

    const hex = derivePublicKeyHex(data as Uint8Array);
    const { npub, nprofile } = createPublicKeyFormats(hex);

    return { hex, npub, nprofile };
  } catch (e) {
    // エラー時は静かに空データを返す（テスト時のエラーログ抑制）
    return { hex: "", npub: "", nprofile: "" };
  }
}

/**
 * 公開鍵hexからnpub文字列を生成
 */
export function toNpub(pubkeyHex: string): string {
  try {
    return nip19.npubEncode(pubkeyHex);
  } catch {
    return `npub1${pubkeyHex.slice(0, 10)}...`;
  }
}

// =============================================================================
// Math Utilities (Pure Functions)
// =============================================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isNearScale(scale: number, target: number, threshold: number): boolean {
  return Math.abs(scale - target) < threshold;
}

/**
 * 2点間の距離を計算
 */
export function calculateDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// =============================================================================
// File Upload Utilities (Pure Functions)
// =============================================================================

/**
 * 画像のSHA-256ハッシュ計算
 */
export async function calculateSHA256Hex(file: File, crypto: SubtleCrypto = window.crypto.subtle): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 画像サイズ取得関数
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const dimensions = calculateImageDisplaySize(img.naturalWidth, img.naturalHeight);
        URL.revokeObjectURL(url);
        resolve(dimensions);
      } catch (error) {
        console.error('Failed to calculate image display size:', error);
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * ファイル名をMIMEタイプに応じてリネーム
 */
export function renameByMimeType(filename: string, mime: string): string {
  const map: Record<string, string> = {
    "image/webp": ".webp",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/bmp": ".bmp"
  };
  const ext = map[mime];
  if (!ext) return filename;
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base}${ext}`;
}

// =============================================================================
// Coordinate and Zoom Utilities (Pure Functions)
// =============================================================================

/**
 * マウスイベントから相対座標を取得
 */
export function getMousePosition(event: MouseEvent): MousePosition {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

/**
 * 要素の矩形情報から中心座標を計算
 */
export function calculateElementCenter(rect: DOMRect): MousePosition {
  return {
    x: rect.width / 2,
    y: rect.height / 2
  };
}

/**
 * ピンチズーム用のパラメータを計算
 */
export function calculatePinchZoomParams(
  currentScale: number,
  scaleRatio: number,
  centerX: number,
  centerY: number,
  containerElement: HTMLElement
): ZoomParams {
  const rect = containerElement.getBoundingClientRect();
  const center = calculateElementCenter(rect);

  return {
    scale: clamp(currentScale * scaleRatio, 0.5, 5),
    offsetX: centerX - rect.left - center.x,
    offsetY: centerY - rect.top - center.y
  };
}

/**
 * ピンチズームの詳細な計算
 */
export function calculatePinchZoom(
  currentScale: number,
  currentTranslate: MousePosition,
  scaleRatio: number,
  centerX: number,
  centerY: number,
  containerElement: HTMLElement
): ZoomCalculation {
  const rect = containerElement.getBoundingClientRect();
  const center = calculateElementCenter(rect);
  const offsetX = centerX - rect.left - center.x;
  const offsetY = centerY - rect.top - center.y;

  const newScale = clamp(currentScale * scaleRatio, 0.5, 5);
  const actualScaleRatio = newScale / currentScale;

  return {
    newScale,
    newTranslate: {
      x: currentTranslate.x * actualScaleRatio - offsetX * (actualScaleRatio - 1),
      y: currentTranslate.y * actualScaleRatio - offsetY * (actualScaleRatio - 1)
    }
  };
}

// =============================================================================
// Settings Utilities (Refactored for Testability)
// =============================================================================

/**
 * 書き込み先リレーリストを取得
 */
export function loadWriteRelaysFromStorage(
  pubkeyHex: string,
  storage: StorageAdapter = defaultStorageAdapter
): string[] {
  if (!pubkeyHex) return [];

  const relayKey = `${STORAGE_KEYS.NOSTR_RELAYS}${pubkeyHex}`;
  try {
    const relays = JSON.parse(storage.getItem(relayKey) ?? "null");
    if (Array.isArray(relays)) {
      return relays;
    } else if (relays && typeof relays === "object") {
      return Object.entries(relays)
        .filter(
          ([, conf]) =>
            conf &&
            typeof conf === "object" &&
            "write" in conf &&
            (conf as { write?: boolean }).write,
        )
        .map(([url]) => url);
    }
    return [];
  } catch {
    return [];
  }
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

  const storedLocale = storage.getItem(STORAGE_KEYS.LOCALE);
  const browserLocale = nav.language;
  const effectiveLocale =
    storedLocale ||
    (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");

  // アップロード先設定
  let endpoint = "";
  const savedEndpoint = storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT);
  if (
    savedEndpoint &&
    uploadEndpoints.some((ep) => ep.url === savedEndpoint)
  ) {
    endpoint = savedEndpoint;
  } else if (selectedEndpoint) {
    endpoint = selectedEndpoint;
  } else {
    endpoint = getDefaultEndpoint(effectiveLocale);
  }

  // client tag設定
  const clientTagSetting = storage.getItem(STORAGE_KEYS.CLIENT_TAG_ENABLED);
  const clientTagEnabled =
    clientTagSetting === null ? true : clientTagSetting === "true";
  if (clientTagSetting === null) {
    storage.setItem(STORAGE_KEYS.CLIENT_TAG_ENABLED, "true");
  }

  // 圧縮設定
  let compression = "";
  const savedCompression = storage.getItem(STORAGE_KEYS.IMAGE_COMPRESSION_LEVEL);
  if (savedCompression) {
    compression = savedCompression;
  } else if (selectedCompression) {
    compression = selectedCompression;
  } else {
    compression = "medium";
  }

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
// Share Handler Utilities (Pure Functions & Testable)
// =============================================================================

/**
 * URLのクエリパラメータから共有モードかどうかをチェック
 */
export function checkIfOpenedFromShare(searchParams?: URLSearchParams): boolean {
  const params = searchParams || new URLSearchParams(window.location.search);
  return params.get('shared') === 'true';
}

/**
 * リクエストIDを生成
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * IndexedDBから共有フラグをチェックして削除
 */
export async function checkAndClearSharedFlagInIndexedDB(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(
        SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
        SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION
      );

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(SHARE_HANDLER_CONFIG.STORE_NAME)) {
          db.createObjectStore(SHARE_HANDLER_CONFIG.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onerror = () => resolve(false);

      request.onsuccess = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(SHARE_HANDLER_CONFIG.STORE_NAME)) {
            db.close();
            resolve(false);
            return;
          }

          const transaction = db.transaction([SHARE_HANDLER_CONFIG.STORE_NAME], 'readwrite');
          const store = transaction.objectStore(SHARE_HANDLER_CONFIG.STORE_NAME);
          const getRequest = store.get(SHARE_HANDLER_CONFIG.FLAG_KEY);

          getRequest.onsuccess = () => {
            const flag = getRequest.result;
            if (flag?.value === true) {
              store.delete(SHARE_HANDLER_CONFIG.FLAG_KEY).onsuccess = () => {
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
        } catch {
          resolve(false);
        }
      };
    } catch {
      resolve(false);
    }
  });
}

/**
 * ServiceWorkerコントローラーの準備を待つ
 */
export async function waitForServiceWorkerController(): Promise<void> {
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
export async function getAndClearSharedImageFromIndexedDB(): Promise<SharedImageData | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(
        SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
        SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION
      );

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(SHARE_HANDLER_CONFIG.STORE_NAME)) {
          db.createObjectStore(SHARE_HANDLER_CONFIG.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onerror = () => resolve(null);

      request.onsuccess = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(SHARE_HANDLER_CONFIG.STORE_NAME)) {
            db.close();
            resolve(null);
            return;
          }

          const transaction = db.transaction([SHARE_HANDLER_CONFIG.STORE_NAME], 'readwrite');
          const store = transaction.objectStore(SHARE_HANDLER_CONFIG.STORE_NAME);
          const getRequest = store.get('sharedImageData');

          getRequest.onsuccess = () => {
            const result = getRequest.result;
            if (result?.data) {
              store.delete('sharedImageData').onsuccess = () => {
                db.close();

                if (result.data.image?.arrayBuffer && result.data.image._isFile) {
                  const file = new File(
                    [result.data.image.arrayBuffer],
                    result.data.image.name || 'shared-image',
                    {
                      type: result.data.image.type || 'image/jpeg'
                    }
                  );

                  resolve({
                    image: file,
                    metadata: result.data.metadata
                  });
                } else {
                  resolve(result.data as SharedImageData);
                }
              };
            } else {
              db.close();
              resolve(null);
            }
          };

          getRequest.onerror = () => {
            db.close();
            resolve(null);
          };
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
 * MessageChannelを使ってServiceWorkerから共有画像を取得
 */
export async function requestSharedImageWithMessageChannel(): Promise<SharedImageData | null> {
  if (!navigator.serviceWorker.controller) return null;

  const messageChannel = new MessageChannel();
  const requestId = generateRequestId();

  const promise = new Promise<SharedImageData | null>((resolve) => {
    const timeout = setTimeout(() => resolve(null), SHARE_HANDLER_CONFIG.REQUEST_TIMEOUT);

    messageChannel.port1.onmessage = (event: MessageEvent) => {
      clearTimeout(timeout);
      const { data } = event.data || {};
      resolve(data && data.image ? data : null);
    };

    messageChannel.port1.addEventListener('error', (error) => {
      clearTimeout(timeout);
      console.error('MessageChannel error:', error);
      resolve(null);
    });
  });

  try {
    navigator.serviceWorker.controller.postMessage(
      { action: 'getSharedImage', requestId },
      [messageChannel.port2]
    );
  } catch (error) {
    console.error('Failed to send message to ServiceWorker:', error);
    return null;
  }

  return promise;
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
      if (navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        const result = await new Promise<SharedImageData | null>((resolve) => {
          const timeout = setTimeout(() => resolve(null), 1000);

          messageChannel.port1.onmessage = (event) => {
            clearTimeout(timeout);
            const { data } = event.data || {};
            resolve(data && data.image ? data : null);
          };

          messageChannel.port1.addEventListener('error', () => {
            clearTimeout(timeout);
            resolve(null);
          });

          try {
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage(
                { action: 'getSharedImageForce', requestId: generateRequestId() },
                [messageChannel.port2]
              );
            } else {
              clearTimeout(timeout);
              resolve(null);
            }
          } catch (error) {
            clearTimeout(timeout);
            resolve(null);
          }
        });

        if (result) {
          console.log('Shared image retrieved via forced Service Worker request');
          return result;
        }
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
 * 遅延ユーティリティ
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  if (!navigator.serviceWorker.controller) {
    console.warn('No ServiceWorker controller available for communication test');
    return false;
  }

  return new Promise<boolean>((resolve) => {
    const messageChannel = new MessageChannel();
    const timeout = setTimeout(() => {
      console.warn('ServiceWorker communication test timeout');
      resolve(false);
    }, 3000);

    messageChannel.port1.onmessage = (event) => {
      clearTimeout(timeout);
      console.log('ServiceWorker communication test successful:', event.data);
      resolve(true);
    };

    messageChannel.port1.addEventListener('error', (error) => {
      clearTimeout(timeout);
      console.error('ServiceWorker communication test error:', error);
      resolve(false);
    });

    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'PING_TEST' },
          [messageChannel.port2]
        );
        console.log('ServiceWorker PING_TEST message sent');
      } else {
        clearTimeout(timeout);
        console.warn('No ServiceWorker controller available when sending PING_TEST');
        resolve(false);
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error('Failed to send PING_TEST message:', error);
      resolve(false);
    }
  });
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

