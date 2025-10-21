/**
 * URLクエリパラメータからコンテンツを取得する
 */
export function getContentFromUrlQuery(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const content = urlParams.get('content');
  
  if (!content) return null;
  
  try {
    // URLエンコードされたテキストをデコード
    const decoded = decodeURIComponent(content);
    // 改行コードを統一（\r\n, \r を \n に変換）
    return decoded.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  } catch (error) {
    console.error('URLクエリパラメータのデコードに失敗:', error);
    return null;
  }
}

/**
 * URLクエリパラメータからcontentを取得した後、URLをクリーンアップする
 */
export function cleanupContentQueryParam(): void {
  if (typeof window === 'undefined' || !window.location) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('content')) {
    urlParams.delete('content');
    
    // URLを更新（履歴に残さない）
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
