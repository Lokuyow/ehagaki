import { getPublicKey, nip19 } from "nostr-tools";
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';
import type {
  FileSizeInfo,
  SizeDisplayInfo,
  PublicKeyData,
  SharedImageData,
  StorageAdapter,
  NavigatorAdapter,
  WindowAdapter,
  TimeoutAdapter,
  UploadHelperDependencies,
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
import { calculateImageDisplaySize } from './editorImageUtils';

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

/**
 * 公開鍵hexとリレーリストからnprofile文字列を生成
 * @param pubkeyHex 公開鍵のhex形式
 * @param profileRelays kind:0を受信したリレーのリスト
 * @param writeRelays 書き込み先リレーのリスト
 * @returns nprofile文字列
 */
export function toNprofile(
  pubkeyHex: string,
  profileRelays: string[] = [],
  writeRelays: string[] = []
): string {
  try {
    // kind:0を受信したリレー1つ + writeリレー上から2つ = 最大3つ
    const relays: string[] = [];
    
    // 1. kind:0を受信したリレーから1つ
    if (profileRelays.length > 0) {
      relays.push(profileRelays[0]);
    }
    
    // 2. writeリレーから2つ（profileRelaysと重複しないもの）
    const remainingSlots = 3 - relays.length;
    if (remainingSlots > 0) {
      const uniqueWriteRelays = writeRelays.filter(r => !relays.includes(r));
      relays.push(...uniqueWriteRelays.slice(0, Math.min(remainingSlots, 2)));
    }
    
    return nip19.nprofileEncode({
      pubkey: pubkeyHex,
      relays
    });
  } catch {
    return "";
  }
}

// =============================================================================
// File Upload Utilities (Pure Functions)
// =============================================================================

/**
 * 画像のSHA-256ハッシュ計算
 */
export async function calculateSHA256Hex(file: File, crypto: SubtleCrypto = window.crypto.subtle): Promise<string> {
  // 中止フラグをチェック（計算開始前のみ）
  if (uploadAbortFlagStore.value) {
    throw new Error('Upload aborted by user');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.digest("SHA-256", arrayBuffer);
  
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function tryCalculateSHA256Hex(
  file: File,
  crypto: SubtleCrypto
): Promise<string | undefined> {
  try {
    return await calculateSHA256Hex(file, crypto);
  } catch {
    return undefined;
  }
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
 * IndexedDBから共有フラグをチェックして削除
 */
export async function checkAndClearSharedFlagInIndexedDB(): Promise<boolean> {
  const flag = await getFromIndexedDB(
    SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
    SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
    SHARE_HANDLER_CONFIG.STORE_NAME,
    SHARE_HANDLER_CONFIG.FLAG_KEY
  );

  if (flag?.value === true) {
    await deleteFromIndexedDB(
      SHARE_HANDLER_CONFIG.INDEXEDDB_NAME,
      SHARE_HANDLER_CONFIG.INDEXEDDB_VERSION,
      SHARE_HANDLER_CONFIG.STORE_NAME,
      SHARE_HANDLER_CONFIG.FLAG_KEY
    );
    return true;
  }
  return false;
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

    if (result.data.image?.arrayBuffer && result.data.image._isFile) {
      const file = new File(
        [result.data.image.arrayBuffer],
        result.data.image.name || 'shared-image',
        {
          type: result.data.image.type || 'image/jpeg'
        }
      );

      return {
        image: file,
        metadata: result.data.metadata
      };
    } else {
      return result.data as SharedImageData;
    }
  }
  return null;
}

/**
 * MessageChannelを使ってServiceWorkerから共有画像を取得
 */
export async function requestSharedImageWithMessageChannel(): Promise<SharedImageData | null> {
  try {
    const data = await sendMessageToServiceWorker({ action: 'getSharedImage' });
    return data && data.image ? data : null;
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
      const result = data && data.image ? data : null;
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

// === ファイル処理とプレースホルダー作成 ===
/**
 * アップロードするファイルを処理し、ハッシュとサイズ情報を計算する
 * @param files 処理するファイル配列
 * @param dependencies 依存関係
 * @returns 処理結果の配列（ファイル、インデックス、ox、dimensions）
 */
export async function processFilesForUpload(
    files: File[],
    dependencies: UploadHelperDependencies
): Promise<Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>> {
    // 中止フラグをインポート
    const results: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }> = [];
    
    // 処理前に1度だけ中止チェック
    if (uploadAbortFlagStore.value) {
        throw new Error('Upload aborted by user');
    }
    
    // 順次処理
    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const [oxResult, dimensionsResult] = await Promise.all([
            // ox計算
      tryCalculateSHA256Hex(file, dependencies.crypto),
            // サイズ計算
            dependencies.getImageDimensions(file)
        ]);

        results.push({ file, index, ox: oxResult, dimensions: dimensionsResult ?? undefined });
    }

    return results;
}

// === メタデータ準備 ===
/**
 * アップロード用のメタデータリストを作成する
 * @param fileArray ファイル配列
 * @returns メタデータレコードの配列
 */
export function prepareMetadataList(fileArray: File[]): Array<Record<string, string | number | undefined>> {
    return fileArray.map((f) => ({
        caption: f.name,
        expiration: "",
        size: f.size,
        alt: f.name,
        media_type: undefined,
        content_type: f.type || "",
        no_transform: "true"
    }));
}

