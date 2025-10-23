/**
 * URLクエリパラメータからコンテンツを取得する
 */
import { normalizeLineBreaks } from './utils/editorUtils';
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
    const contentValue = urlParams.get('content');
    if (!contentValue || contentValue.trim() === '') {
      needsCleanup = true;
    }
    // 空でなくても削除（処理済みなので）
    urlParams.delete('content');
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
