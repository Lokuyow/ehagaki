import { getPublicKey, nip19 } from "nostr-tools";
import type { FileSizeInfo, SizeDisplayInfo, PublicKeyData } from "./types";
import { BALLOON_MESSAGE_KEYS } from "./constants";
import { STORAGE_KEYS, uploadEndpoints, getDefaultEndpoint } from './constants';

// =============================================================================
// External Dependencies (Injectable for Testing)
// =============================================================================

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface NavigatorAdapter {
  language: string;
}

export interface WindowAdapter {
  location: {
    reload(): void;
  };
}

export interface TimeoutAdapter {
  setTimeout(callback: () => void, delay: number): void;
}

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

/**
 * @deprecated 後方互換性のために保持
 */
export function generateSizeDisplayText(sizeInfo: FileSizeInfo | null): string | null {
  if (!sizeInfo || !sizeInfo.wasCompressed) return null;
  return `データサイズ:<br>${sizeInfo.sizeReduction} （${sizeInfo.compressionRatio}%）`;
}

// =============================================================================
// Nostr Key Utilities (Pure Functions)
// =============================================================================

/**
 * nsec形式の正規表現パターン
 */
export const NSEC_PATTERN = /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/;
export const NSEC_FULL_PATTERN = /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;

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
    console.error("公開鍵の導出に失敗:", e);
    return { hex: "", npub: "", nprofile: "" };
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
// DOM Utilities (副作用のある関数)
// =============================================================================

/**
 * DOM要素のstyleプロパティを設定（テスト時にモック可能）
 */
export const domUtils = {
  setBodyStyle(property: string, value: string): void {
    document.body.style.setProperty(property, value);
  },

  querySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector) as HTMLElement;
  },

  focusElement(element: HTMLElement): void {
    element.focus();
  }
};

export function setBodyStyle(property: string, value: string): void {
  domUtils.setBodyStyle(property, value);
}

export function clearBodyStyles(): void {
  setBodyStyle("overflow", "");
  setBodyStyle("user-select", "");
  setBodyStyle("-webkit-user-select", "");
}

export function focusEditor(selector: string, delay: number, timeoutAdapter: TimeoutAdapter = defaultTimeoutAdapter): void {
  timeoutAdapter.setTimeout(() => {
    const editorElement = domUtils.querySelector(selector);
    if (editorElement) {
      domUtils.focusElement(editorElement);
    }
  }, delay);
}

// =============================================================================
// Type Definitions
// =============================================================================

export interface MousePosition {
  x: number;
  y: number;
}

export interface ViewportInfo {
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
}

export interface ZoomCalculation {
  newScale: number;
  newTranslate: MousePosition;
}

export interface TouchPosition {
  x: number;
  y: number;
}

export interface PinchInfo {
  distance: number;
  centerX: number;
  centerY: number;
}

export interface ZoomParams {
  scale: number;
  offsetX: number;
  offsetY: number;
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
 * 要素の中心からのオフセットを計算
 */
export function calculateViewportInfo(
  element: HTMLElement,
  mouseX: number,
  mouseY: number
): ViewportInfo {
  const rect = element.getBoundingClientRect();
  const center = calculateElementCenter(rect);

  return {
    centerX: center.x,
    centerY: center.y,
    offsetX: mouseX - rect.left - center.x,
    offsetY: mouseY - rect.top - center.y
  };
}

/**
 * ドラッグの移動量計算
 */
export function calculateDragDelta(
  currentMouse: MousePosition,
  startMouse: MousePosition
): MousePosition {
  return {
    x: currentMouse.x - startMouse.x,
    y: currentMouse.y - startMouse.y
  };
}

/**
 * 2点の中心座標を計算
 */
export function calculatePinchCenter(touch1: Touch, touch2: Touch): TouchPosition {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  };
}

/**
 * ピンチ情報を計算
 */
export function calculatePinchInfo(touch1: Touch, touch2: Touch): PinchInfo {
  const center = calculatePinchCenter(touch1, touch2);
  return {
    distance: calculateDistance(touch1, touch2),
    centerX: center.x,
    centerY: center.y
  };
}

/**
 * イベントとコンテナ要素からズームパラメータを計算
 */
export function calculateZoomFromEvent(
  event: MouseEvent | WheelEvent,
  containerElement: HTMLElement,
  currentScale: number,
  currentTranslate: MousePosition,
  targetScale: number
): ZoomParams {
  const rect = containerElement.getBoundingClientRect();
  const center = calculateElementCenter(rect);

  return {
    scale: targetScale,
    offsetX: event.clientX - rect.left - center.x,
    offsetY: event.clientY - rect.top - center.y
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
// Balloon Message Utilities (Pure Functions)
// =============================================================================

/**
 * ランダムなバルーンメッセージを取得
 * @param $_ svelte-i18nの$_関数
 */
export function getRandomHeaderBalloon(
  $_: (key: string) => string | undefined
): string {
  const keys: readonly string[] = BALLOON_MESSAGE_KEYS;
  const idx: number = Math.floor(Math.random() * keys.length);
  return $_(keys[idx]) ?? "";
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
