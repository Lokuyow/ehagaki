/**
 * themeStore.svelte.ts - ダークモード設定の状態管理
 *
 * - デフォルト: OS/ブラウザの color-scheme 設定に従う
 * - ユーザーが手動でSwitchを操作した場合は localStorage に保存し次回以降に引き継ぐ
 * - localStorage に保存値がない場合、OS設定変化を自動追従する
 */

import { STORAGE_KEYS } from '../lib/constants';

/**
 * localStorage の保存値を考慮しつつ、現在の有効なダークモード状態を返す
 */
function getEffectiveDarkMode(): boolean {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) {
        return saved === 'true';
    }
    // 保存値なし → OS設定に従う
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * <html> 要素にテーマクラスを適用し、color-scheme プロパティも更新
 */
function applyTheme(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
    }
}

// --- ストア状態 ---
const initialDarkMode = getEffectiveDarkMode();
let darkMode = $state(initialDarkMode);

// 初期テーマを適用
applyTheme(initialDarkMode);

// OS設定変化に追従（localStorage に保存値がない場合のみ）
if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => {
        const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
        if (saved === null) {
            darkMode = e.matches;
            applyTheme(e.matches);
        }
    });
}

/**
 * ダークモードストア
 */
export const darkModeStore = {
    get value() {
        return darkMode;
    },
    set: (isDark: boolean) => {
        darkMode = isDark;
        applyTheme(isDark);
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark ? 'true' : 'false');
    },
    /** localStorage の保存値を削除し OS 設定に戻す */
    reset: () => {
        localStorage.removeItem(STORAGE_KEYS.DARK_MODE);
        const nextDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        darkMode = nextDarkMode;
        applyTheme(nextDarkMode);
    },
};
