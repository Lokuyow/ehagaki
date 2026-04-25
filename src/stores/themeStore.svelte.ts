/**
 * themeStore.svelte.ts - テーマ設定の状態管理
 *
 * - デフォルト: system
 * - system の場合は OS/ブラウザの color-scheme 設定に従う
 * - light/dark の場合は明示設定として localStorage に保存する
 */

import {
    getStoredThemeModePreference,
    setThemeModePreference,
    type PreferenceSource,
    type ThemeMode,
} from '../lib/utils/settingsStorage';

function getSystemDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getEffectiveDarkMode(mode: ThemeMode): boolean {
    if (mode === 'dark') {
        return true;
    }

    if (mode === 'light') {
        return false;
    }

    return getSystemDarkMode();
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
const initialThemeMode = getStoredThemeModePreference(localStorage);
const initialDarkMode = getEffectiveDarkMode(initialThemeMode);
let themeMode = $state<ThemeMode>(initialThemeMode);
let darkMode = $state(initialDarkMode);

// 初期テーマを適用
applyTheme(initialDarkMode);

// OS設定変化に追従（system の場合のみ）
if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => {
        if (themeMode === 'system') {
            darkMode = e.matches;
            applyTheme(e.matches);
        }
    });
}

/**
 * テーマモードストア
 */
export const themeModeStore = {
    get value() {
        return themeMode;
    },
    get isDark() {
        return darkMode;
    },
    set: (mode: ThemeMode, source: PreferenceSource = 'user') => {
        const nextMode = setThemeModePreference(localStorage, mode, source);
        const nextDarkMode = getEffectiveDarkMode(nextMode);
        themeMode = nextMode;
        darkMode = nextDarkMode;
        applyTheme(nextDarkMode);
    },
    reset: (source: PreferenceSource = 'user') => {
        themeModeStore.set('system', source);
    },
};

/**
 * 旧 darkModeStore 互換 API。
 */
export const darkModeStore = {
    get value() {
        return darkMode;
    },
    set: (isDark: boolean, source: PreferenceSource = 'user') => {
        themeModeStore.set(isDark ? 'dark' : 'light', source);
    },
    reset: (source: PreferenceSource = 'user') => {
        themeModeStore.reset(source);
    },
};
