import type {
  StorageAdapter,
  NavigatorAdapter,
  WindowAdapter,
  TimeoutAdapter,
} from "../types";
import {
  STORAGE_KEYS,
  uploadEndpoints,
  getDefaultEndpoint,
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

