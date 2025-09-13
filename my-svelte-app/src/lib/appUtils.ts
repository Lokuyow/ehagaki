import { getPublicKey, nip19 } from "nostr-tools";
import type { FileSizeInfo, SizeDisplayInfo, PublicKeyData } from "./types";

/**
 * ファイルサイズを人間に読みやすい形式に変換
 * @param bytes バイト数
 * @returns 読みやすい形式の文字列
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0KB';
  const kb = Math.round(bytes / 1024);
  return `${kb}KB`;
}

/**
 * ファイルサイズ情報を生成
 * @param originalSize 元のファイルサイズ（バイト）
 * @param compressedSize 圧縮後のファイルサイズ（バイト）
 * @param wasCompressed 圧縮されたかどうか
 * @param originalFilename 元ファイル名（省略可）
 * @param compressedFilename 圧縮後ファイル名（省略可）
 * @param wasSkipped 圧縮処理をスキップしたかどうか（省略可）
 * @returns ファイルサイズ情報
 */
export function createFileSizeInfo(
  originalSize: number,
  compressedSize: number,
  wasCompressed: boolean,
  originalFilename?: string,
  compressedFilename?: string,
  wasSkipped?: boolean
): FileSizeInfo {
  const compressionRatio = originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : 100;
  const sizeReduction = `${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`;

  return {
    originalSize,
    compressedSize,
    wasCompressed,
    compressionRatio,
    sizeReduction,
    originalFilename,
    compressedFilename,
    wasSkipped
  };
}

/**
 * サイズ情報から表示用の構造化データを生成
 * @param sizeInfo ファイルサイズ情報
 * @returns 表示用構造化データ、または表示する必要がない場合はnull
 */
export function generateSizeDisplayInfo(sizeInfo: FileSizeInfo | null): SizeDisplayInfo | null {
  if (!sizeInfo) return null;

  // wasCompressed フラグがtrueか、ファイル名やサイズに変化がある場合、またはスキップされた場合に表示
  const hasChanges = sizeInfo.wasCompressed ||
    (sizeInfo.originalFilename !== sizeInfo.compressedFilename) ||
    (sizeInfo.originalSize !== sizeInfo.compressedSize) ||
    sizeInfo.wasSkipped;

  if (!hasChanges) return null;

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
 * サイズ情報からHTML表示用の文字列を生成
 * @param sizeInfo ファイルサイズ情報
 * @returns 表示用HTML文字列、または圧縮されていない場合はnull
 */
export function generateSizeDisplayText(sizeInfo: FileSizeInfo | null): string | null {
  // 後方互換性のために保持（廃止予定）
  if (!sizeInfo || !sizeInfo.wasCompressed) return null;

  return `データサイズ:<br>${sizeInfo.sizeReduction} （${sizeInfo.compressionRatio}%）`;
}

/**
 * 秘密鍵(nsec)が含まれているかチェックする関数
 * @param text チェック対象のテキスト
 * @returns 秘密鍵が含まれている場合true
 */
export function containsSecretKey(text: string): boolean {
  // nsecで始まる文字列を検出（部分的な秘密鍵でも警告）
  return /nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{10,}/.test(text);
}

/**
 * nsec形式の秘密鍵から公開鍵情報を導出する
 * @param nsec nsec形式の秘密鍵
 * @returns 公開鍵データ（hex, npub, nprofile）
 */
export function derivePublicKeyFromNsec(nsec: string): PublicKeyData {
  try {
    const { type, data } = nip19.decode(nsec);
    if (type !== "nsec") {
      console.warn("無効なnsec形式です");
      return { hex: "", npub: "", nprofile: "" };
    }
    const hex = getPublicKey(data as Uint8Array);
    const npub = nip19.npubEncode(hex);
    const nprofile = nip19.nprofileEncode({ pubkey: hex, relays: [] });
    return { hex, npub, nprofile };
  } catch (e) {
    console.error("公開鍵の導出に失敗:", e);
    return { hex: "", npub: "", nprofile: "" };
  }
}

/**
 * nsec形式の秘密鍵が有効かチェックする
 * @param key チェック対象の文字列
 * @returns 有効な場合true
 */
export function isValidNsec(key: string): boolean {
  return /^nsec1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58,}$/.test(key);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function isNearScale(scale: number, target: number, threshold: number): boolean {
  return Math.abs(scale - target) < threshold;
}

export function setBodyStyle(property: string, value: string): void {
  document.body.style.setProperty(property, value);
}

export function clearBodyStyles(): void {
  setBodyStyle("overflow", "");
  setBodyStyle("user-select", "");
  setBodyStyle("-webkit-user-select", "");
}

export function focusEditor(selector: string, delay: number): void {
  setTimeout(() => {
    const editorElement = document.querySelector(selector) as HTMLElement;
    if (editorElement) {
      editorElement.focus();
    }
  }, delay);
}

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

// 統合されたズーム計算関数
export function calculateZoomFromEvent(
  event: MouseEvent | WheelEvent,
  containerElement: HTMLElement,
  currentScale: number,
  currentTranslate: MousePosition,
  targetScale: number
): { scale: number; offsetX: number; offsetY: number } {
  const rect = containerElement.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const offsetX = event.clientX - rect.left - centerX;
  const offsetY = event.clientY - rect.top - centerY;

  return {
    scale: targetScale,
    offsetX,
    offsetY
  };
}

// ピンチズーム用の計算を簡素化
export function calculatePinchZoomParams(
  currentScale: number,
  scaleRatio: number,
  centerX: number,
  centerY: number,
  containerElement: HTMLElement
): { scale: number; offsetX: number; offsetY: number } {
  const rect = containerElement.getBoundingClientRect();
  const offsetX = centerX - rect.left - rect.width / 2;
  const offsetY = centerY - rect.top - rect.height / 2;
  const newScale = clamp(currentScale * scaleRatio, 0.5, 5);

  return {
    scale: newScale,
    offsetX,
    offsetY
  };
}

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
 * 要素の中心からのオフセットを計算
 */
export function calculateViewportInfo(
  element: HTMLElement,
  mouseX: number,
  mouseY: number
): ViewportInfo {
  const rect = element.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  return {
    centerX,
    centerY,
    offsetX: mouseX - rect.left - centerX,
    offsetY: mouseY - rect.top - centerY
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
 * 2点間の距離を計算
 */
export function calculateDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
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

export function calculatePinchZoom(
  currentScale: number,
  currentTranslate: MousePosition,
  scaleRatio: number,
  centerX: number,
  centerY: number,
  containerElement: HTMLElement
): ZoomCalculation {
  const rect = containerElement.getBoundingClientRect();
  const offsetX = centerX - rect.left - rect.width / 2;
  const offsetY = centerY - rect.top - rect.height / 2;

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
