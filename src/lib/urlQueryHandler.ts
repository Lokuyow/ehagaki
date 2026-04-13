/**
 * URLクエリパラメータからコンテンツを取得する
 */
import { nip19 } from 'nostr-tools';
import { normalizeLineBreaks } from './utils/editorUtils';
import type { ReplyQuoteQueryResult } from './types';
export function getContentFromUrlQuery(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;

  const urlParams = new URLSearchParams(window.location.search);
  const content = urlParams.get('content');

  if (!content) return null;

  try {
    // URLエンコードされたテキストをデコード
    const decoded = decodeURIComponent(content);
    // 改行コードを統一
    return normalizeLineBreaks(decoded);
  } catch (error) {
    console.error('URLクエリパラメータのデコードに失敗:', error);
    return null;
  }
}

/**
 * URLクエリパラメータからリプライ/引用情報を取得する
 * ?reply=nevent1... / ?reply=note1... / ?quote=nevent1... / ?quote=note1...
 */
export function getReplyQuoteFromUrlQuery(): ReplyQuoteQueryResult | null {
  if (typeof window === 'undefined' || !window.location) return null;

  const urlParams = new URLSearchParams(window.location.search);
  const replyValue = urlParams.get('reply');
  const quoteValue = urlParams.get('quote');

  const value = replyValue || quoteValue;
  const mode = replyValue ? 'reply' : quoteValue ? 'quote' : null;

  if (!value || !mode) return null;

  try {
    const decoded = nip19.decode(value);

    if (decoded.type === 'nevent') {
      const data = decoded.data as nip19.EventPointer;
      return {
        mode,
        eventId: data.id,
        relayHints: data.relays ? [...data.relays] : [],
        authorPubkey: data.author ?? null,
      };
    }

    if (decoded.type === 'note') {
      return {
        mode,
        eventId: decoded.data as string,
        relayHints: [],
        authorPubkey: null,
      };
    }

    return null;
  } catch (error) {
    console.error('リプライ/引用パラメータのデコードに失敗:', error);
    return null;
  }
}

/**
 * URLクエリパラメータにreplyまたはquoteが含まれているかチェック
 */
export function hasReplyQuoteQueryParam(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('reply') || urlParams.has('quote');
}

/**
 * すべての不要なクエリパラメータをクリーンアップ
 * 空のcontentパラメータや想定外のパラメータを削除してURLを整理
 */
export function cleanupAllQueryParams(): void {
  if (typeof window === 'undefined' || !window.location) return;

  const urlParams = new URLSearchParams(window.location.search);

  // 許可されたパラメータのリスト（将来的に追加の場合はここに追加）
  const allowedParams: string[] = [];

  let needsCleanup = false;

  // contentパラメータが空または存在する場合は削除
  if (urlParams.has('content')) {
    urlParams.delete('content');
    needsCleanup = true;
  }

  // reply/quoteパラメータを削除（処理済み）
  if (urlParams.has('reply')) {
    urlParams.delete('reply');
    needsCleanup = true;
  }
  if (urlParams.has('quote')) {
    urlParams.delete('quote');
    needsCleanup = true;
  }

  // 許可されていないパラメータを削除
  const paramsToDelete: string[] = [];
  urlParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      paramsToDelete.push(key);
      needsCleanup = true;
    }
  });

  paramsToDelete.forEach(key => urlParams.delete(key));

  // クリーンアップが必要な場合のみURLを更新
  if (needsCleanup) {
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * URLクエリパラメータにcontentが含まれているかチェック
 */
export function hasContentQueryParam(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('content');
}
