/**
 * 汎用的なユーティリティ関数
 */

// ハッシュタグを検出する正規表現（半角スペース、改行、タブ以外の文字を全て含む）
const HASHTAG_REGEX = /(?:^|[\s\n])#([^\s\n\t]+)/g;

/**
 * テキストからハッシュタグを抽出する
 * @param content テキストコンテンツ
 * @returns ハッシュタグの配列（#なし）
 */
export function extractHashtags(content: string): string[] {
  const hashtags: string[] = [];
  let match;
  const regex = new RegExp(HASHTAG_REGEX);

  while ((match = regex.exec(content)) !== null) {
    const hashtag = match[1];
    if (hashtag && hashtag.trim()) {
      hashtags.push(hashtag);
    }
  }

  return hashtags;
}

/**
 * ハッシュタグからNostrのtタグを生成する
 * @param content テキストコンテンツ
 * @returns tタグの配列
 */
export function generateHashtagTags(content: string): string[][] {
  const hashtags = extractHashtags(content);
  return hashtags.map(hashtag => ["t", hashtag]);
}

/**
 * テキスト内のハッシュタグをHTMLスパンタグでラップする
 * @param text テキスト
 * @returns ハッシュタグがスタイル付きHTMLに変換されたテキスト
 */
export function formatTextWithHashtags(text: string): string {
  return text.replace(
    /(?:^|[\s\n])#([^\s\n\t]+)/g,
    (match, hashtag) => {
      const prefix = match.charAt(0) === '#' ? '' : match.charAt(0);
      return `${prefix}<span class="hashtag">#${hashtag}</span>`;
    }
  );
}

/**
 * テキストにハッシュタグが含まれているかチェックする
 * @param content テキストコンテンツ
 * @returns ハッシュタグが含まれている場合true
 */
export function containsHashtags(content: string): boolean {
  return /(?:^|[\s\n])#([^\s\n\t]+)/.test(content);
}

/**
 * テキスト内のURLを検出し、HTMLリンクに変換する
 * @param text テキスト
 * @returns URLがリンクに変換されたテキスト
 */
export function formatTextWithLinks(text: string): string {
  if (!text) return "";

  // URLパターンを定義（前後に文字がない場合のみマッチ）
  const urlRegex = /(?<![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])(https?:\/\/[^\s<>"{}|\\^`[\]]+)(?![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])/gi;

  return text.replace(urlRegex, (url) => {
    // ここでのエスケープ処理は不要。サニタイズはSvelte側で行う。
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="preview-link">${url}</a>`;
  });
}

/**
 * テキスト内のハッシュタグとURLを同時に処理する
 * @param text テキスト
 * @returns ハッシュタグとURLが適切に処理されたテキスト
 */
export function formatTextWithHashtagsAndLinks(text: string): string {
  if (!text) return "";

  // 最初にURLをリンクに変換
  let formattedText = formatTextWithLinks(text);

  // 次にハッシュタグを処理（リンク内のハッシュタグは除外）
  formattedText = formattedText.replace(
    /(?<!<a[^>]*>.*?)(?:^|[\s\n])#([^\s\n\t]+)(?![^<]*<\/a>)/g,
    (match, hashtag) => {
      const prefix = match.charAt(0) === '#' ? '' : match.charAt(0);
      return `${prefix}<span class="hashtag">#${hashtag}</span>`;
    }
  );

  return formattedText;
}

/**
 * ファイルサイズ情報の型定義
 */
export interface FileSizeInfo {
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  compressionRatio: number;
  sizeReduction: string;
}

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
 * サイズ情報表示用の構造化データ
 */
export interface SizeDisplayInfo {
  wasCompressed: boolean;
  originalSize: string;
  compressedSize: string;
  compressionRatio: number;
}

/**
 * サイズ情報から表示用の構造化データを生成
 * @param sizeInfo ファイルサイズ情報
 * @returns 表示用構造化データ、または圧縮されていない場合はnull
 */
export function generateSizeDisplayInfo(sizeInfo: FileSizeInfo | null): SizeDisplayInfo | null {
  if (!sizeInfo || !sizeInfo.wasCompressed) {
    return null;
  }

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
  if (!sizeInfo || !sizeInfo.wasCompressed) {
    return null;
  }

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

import { getPublicKey, nip19 } from "nostr-tools";

/**
 * 公開鍵データの型定義
 */
export interface PublicKeyData {
  hex: string;
  npub: string;
  nprofile: string;
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
    if (!key) {
      return { hex: "", npub: "", nprofile: "" };
    }
    let hex = key;
    // npub形式の場合はデコードしてhexに変換
    if (/^npub1[023456789acdefghjklmnpqrstuvwxyz]+$/.test(key)) {
      const { nip19 } = require("nostr-tools");
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
