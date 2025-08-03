import { writable } from 'svelte/store';
import type { SizeDisplayInfo } from './utils';

/**
 * ファイルサイズ情報表示用のグローバルストア
 */
export const imageSizeInfoStore = writable<{
    info: SizeDisplayInfo | null;
    visible: boolean;
}>({
    info: null,
    visible: false
});

/**
 * ファイルサイズ情報を表示する
 * @param info 表示する構造化データ
 * @param duration 表示時間（ミリ秒）
 */
export function showImageSizeInfo(info: SizeDisplayInfo | null, duration: number = 3000): void {
    imageSizeInfoStore.set({ info, visible: true });

    if (info) {
        setTimeout(() => {
            imageSizeInfoStore.update(state => ({ ...state, visible: false }));
        }, duration);
    }
}

/**
 * ファイルサイズ情報を非表示にする
 */
export function hideImageSizeInfo(): void {
    imageSizeInfoStore.set({ info: null, visible: false });
}
