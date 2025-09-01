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
 * @returns ファイルサイズ情報
 */
export function createFileSizeInfo(
  originalSize: number,
  compressedSize: number,
  wasCompressed: boolean
): FileSizeInfo {
  const compressionRatio = originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : 100;
  const sizeReduction = `${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`;

  return {
    originalSize,
    compressedSize,
    wasCompressed,
    compressionRatio,
    sizeReduction
  };
}

/**
 * サイズ情報から表示用の構造化データを生成
 * @param sizeInfo ファイルサイズ情報
 * @returns 表示用構造化データ、または圧縮されていない場合はnull
 */
export function generateSizeDisplayInfo(sizeInfo: FileSizeInfo | null): SizeDisplayInfo | null {
  if (!sizeInfo || !sizeInfo.wasCompressed) return null;

  return {
    wasCompressed: true,
    originalSize: formatFileSize(sizeInfo.originalSize),
    compressedSize: formatFileSize(sizeInfo.compressedSize),
    compressionRatio: sizeInfo.compressionRatio
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
  return /nsec1[023456789acdefghjklmnpqrstuvwxyz]{10,}/.test(text);
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
 * HEX形式またはnpub形式の公開鍵からnpubとnprofileを生成する
 * @param key HEX形式またはnpub形式の公開鍵
 * @returns 公開鍵データ（hex, npub, nprofile）
 */
export function generatePublicKeyFormats(key: string): PublicKeyData {
  try {
    if (!key) return { hex: "", npub: "", nprofile: "" };
    let hex = key;
    // npub形式の場合はデコードしてhexに変換
    if (/^npub1[023456789acdefghjklmnpqrstuvwxyz]+$/.test(key)) {
      const decoded = nip19.decode(key);
      if (decoded.type === "npub") {
        hex = decoded.data as string;
      } else {
        return { hex: "", npub: "", nprofile: "" };
      }
    }
    const npub = nip19.npubEncode(hex);
    const nprofile = nip19.nprofileEncode({ pubkey: hex, relays: [] });
    return { hex, npub, nprofile };
  } catch (e) {
    console.error("公開鍵フォーマットの生成に失敗:", e);
    return { hex: "", npub: "", nprofile: "" };
  }
}

/**
 * nsec形式の秘密鍵が有効かチェックする
 * @param key チェック対象の文字列
 * @returns 有効な場合true
 */
export function isValidNsec(key: string): boolean {
  return /^nsec1[023456789acdefghjklmnpqrstuvwxyz]{58,}$/.test(key);
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
 * ズーム計算を実行
 */
export function calculateZoom(
    currentScale: number,
    currentTranslate: MousePosition,
    newScale: number,
    offsetX: number,
    offsetY: number
): ZoomCalculation {
    const scaleRatio = newScale / currentScale;
    
    return {
        newScale,
        newTranslate: {
            x: currentTranslate.x * scaleRatio - offsetX * (scaleRatio - 1),
            y: currentTranslate.y * scaleRatio - offsetY * (scaleRatio - 1)
        }
    };
}

/**
 * ダブルクリック時のズーム位置計算
 */
export function calculateDoubleClickZoom(
    targetScale: number,
    offsetX: number,
    offsetY: number
): ZoomCalculation {
    return {
        newScale: targetScale,
        newTranslate: {
            x: -offsetX,
            y: -offsetY
        }
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
