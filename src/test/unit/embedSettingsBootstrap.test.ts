import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import { applyEmbedSettingsBootstrap } from '../../lib/bootstrap/embedSettingsBootstrap';
import {
    getPreferenceSource,
    setLocalePreference,
    setQuoteNotificationEnabledPreference,
    setThemeModePreference,
} from '../../lib/utils/settingsStorage';
import { MockStorage } from '../helpers';

describe('embedSettingsBootstrap', () => {
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
    });

    function createBootstrapContext(search: string) {
        return {
            navigatorObj: {
                language: 'ja-JP',
            },
            documentObj: {
                documentElement: {
                    lang: 'ja',
                },
            } as any,
            windowObj: {
                location: {
                    search,
                    pathname: '/embed',
                },
                history: {
                    replaceState: vi.fn(),
                },
            } as any,
        };
    }

    it('embed~ は保存済み user 設定も毎回上書きして query を掃除する', () => {
        setLocalePreference(storage, 'ja', 'user');
        setThemeModePreference(storage, 'light', 'user');
        setQuoteNotificationEnabledPreference(storage, false, 'user');
        const context = createBootstrapContext(
            '?parentOrigin=https%3A%2F%2Fparent.example.com&embedLocale=en&embedTheme=dark&embedShowMascot=false&embedQuoteNotification=true',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(result.appliedSettings).toEqual([
            'locale',
            'themeMode',
            'quoteNotificationEnabled',
            'showMascot',
        ]);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('true');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'quoteNotificationEnabled')).toBe('parentForced');
        expect(context.documentObj.documentElement.lang).toBe('en');
        expect(context.windowObj.history.replaceState).toHaveBeenCalledWith(
            {},
            '',
            '/embed?parentOrigin=https%3A%2F%2Fparent.example.com',
        );
    });

    it('default~ は対応キー未保存時だけ適用する', () => {
        setLocalePreference(storage, 'ja', 'user');
        const context = createBootstrapContext(
            '?defaultLocale=en&defaultTheme=dark&defaultShowMascot=false',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(result.appliedSettings).toEqual(['themeMode', 'showMascot']);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('ja');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(getPreferenceSource(storage, 'locale')).toBe('user');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentDefault');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentDefault');
        expect(context.documentObj.documentElement.lang).toBe('ja');
    });

    it('embed~ と default~ が同時指定されたら embed~ が勝つ', () => {
        const context = createBootstrapContext(
            '?embedTheme=light&defaultTheme=dark&embedLocale=en&defaultLocale=ja',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.appliedSettings).toEqual(['locale', 'themeMode']);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('light');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentForced');
    });

    it('query cleanup は embed~/default~ だけを消して他の query を残す', () => {
        const context = createBootstrapContext(
            '?parentOrigin=https%3A%2F%2Fparent.example.com&content=hello&defaultTheme=dark&embedShowMascot=false',
        );

        applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(context.windowObj.history.replaceState).toHaveBeenCalledWith(
            {},
            '',
            '/embed?parentOrigin=https%3A%2F%2Fparent.example.com&content=hello',
        );
    });

    it('設定 query がない場合は document lang だけ同期する', () => {
        const context = createBootstrapContext('?parentOrigin=https%3A%2F%2Fparent.example.com');

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(false);
        expect(result.appliedSettings).toEqual([]);
        expect(context.documentObj.documentElement.lang).toBe('ja');
        expect(context.windowObj.history.replaceState).not.toHaveBeenCalled();
    });
});
