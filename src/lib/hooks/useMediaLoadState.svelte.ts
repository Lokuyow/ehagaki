/**
 * useMediaLoadState - メディア読み込み状態フック
 *
 * 画像・動画要素の読み込み完了・エラー状態を管理します。
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const { isLoaded, handleLoad, handleError } = useMediaLoadState();
 * </script>
 *
 * <img onload={handleLoad} onerror={handleError} class:image-loading={!isLoaded} />
 * ```
 */

/**
 * メディア読み込み状態を管理するフック
 *
 * @returns `isLoaded`（読み込み済みフラグ）と `handleLoad` / `handleError` イベントハンドラー
 */
export function useMediaLoadState() {
    let isLoaded = $state(false);

    function handleLoad() {
        isLoaded = true;
    }

    function handleError() {
        isLoaded = false;
    }

    return {
        get isLoaded() {
            return isLoaded;
        },
        handleLoad,
        handleError,
    };
}
