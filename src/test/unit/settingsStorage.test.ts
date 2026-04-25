import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    clearDarkModePreference,
    getStoredThemeModePreference,
    getQuoteNotificationEnabledPreference,
    getPreferenceSource,
    hasAppliedEmbedBootstrap,
    markEmbedBootstrapApplied,
    setDarkModePreference,
    setThemeModePreference,
    setLocalePreference,
    setQuoteNotificationEnabledPreference,
} from '../../lib/utils/settingsStorage';
import { MockStorage } from '../helpers';

describe('settingsStorage preference metadata', () => {
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
    });

    it('setter 呼び出し時に source を記録する', () => {
        setLocalePreference(storage, 'en', 'parentBootstrap');

        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentBootstrap');

        setLocalePreference(storage, 'ja');

        expect(getPreferenceSource(storage, 'locale')).toBe('user');
    });

    it('embed 初回適用済みマーカーを保持する', () => {
        expect(hasAppliedEmbedBootstrap(storage)).toBe(false);

        markEmbedBootstrapApplied(storage);

        expect(hasAppliedEmbedBootstrap(storage)).toBe(true);
    });

    it('明示テーマを解除しても user source を保持する', () => {
        setDarkModePreference(storage, true, 'parentBootstrap');

        clearDarkModePreference(storage, 'user');

        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('system');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('user');
    });

    it('テーマ設定は未保存時に system を保存して返す', () => {
        expect(getStoredThemeModePreference(storage)).toBe('system');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('system');
    });

    it('themeMode の system/light/dark を正しく読む', () => {
        storage.setItem(STORAGE_KEYS.THEME_MODE, 'system');
        expect(getStoredThemeModePreference(storage)).toBe('system');

        storage.setItem(STORAGE_KEYS.THEME_MODE, 'light');
        expect(getStoredThemeModePreference(storage)).toBe('light');

        storage.setItem(STORAGE_KEYS.THEME_MODE, 'dark');
        expect(getStoredThemeModePreference(storage)).toBe('dark');
    });

    it('legacy darkMode=true/false を themeMode に移行する', () => {
        storage.setItem(STORAGE_KEYS.DARK_MODE, 'true');
        expect(getStoredThemeModePreference(storage)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();

        storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.DARK_MODE, 'false');
        expect(getStoredThemeModePreference(storage)).toBe('light');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('light');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
    });

    it('不正な themeMode は system に戻す', () => {
        storage.setItem(STORAGE_KEYS.THEME_MODE, 'sepia');
        storage.setItem(STORAGE_KEYS.DARK_MODE, 'true');

        expect(getStoredThemeModePreference(storage)).toBe('system');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('system');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
    });

    it('themeMode setter は新キーに保存して source を記録する', () => {
        setThemeModePreference(storage, 'dark', 'parentBootstrap');

        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentBootstrap');

        setThemeModePreference(storage, 'system');

        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('system');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('user');
    });

    it('引用通知設定はデフォルトfalseで、setter呼び出し時にsourceを記録する', () => {
        expect(getQuoteNotificationEnabledPreference(storage)).toBe(false);
        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('false');

        setQuoteNotificationEnabledPreference(storage, true, 'parentBootstrap');

        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('true');
        expect(getPreferenceSource(storage, 'quoteNotificationEnabled')).toBe(
            'parentBootstrap',
        );

        setQuoteNotificationEnabledPreference(storage, false);

        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('false');
        expect(getPreferenceSource(storage, 'quoteNotificationEnabled')).toBe('user');
    });
});
