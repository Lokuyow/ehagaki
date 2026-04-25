import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import { applyEmbedSettingsBootstrap } from '../../lib/bootstrap/embedSettingsBootstrap';
import {
    getPreferenceSource,
    markEmbedBootstrapApplied,
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

    it('embed 初回は parent supplied settings を適用して query を掃除する', () => {
        const context = createBootstrapContext(
            '?parentOrigin=https%3A%2F%2Fparent.example.com&embedLocale=en&embedTheme=dark&embedShowMascot=false',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('dark');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentBootstrap');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentBootstrap');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentBootstrap');
        expect(context.documentObj.documentElement.lang).toBe('en');
        expect(context.windowObj.history.replaceState).toHaveBeenCalledWith(
            {},
            '',
            '/embed?parentOrigin=https%3A%2F%2Fparent.example.com',
        );
    });

    it('embedQuoteNotification=true を初回 bootstrap で適用して query を掃除する', () => {
        const context = createBootstrapContext(
            '?parentOrigin=https%3A%2F%2Fparent.example.com&embedQuoteNotification=true',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('true');
        expect(getPreferenceSource(storage, 'quoteNotificationEnabled')).toBe(
            'parentBootstrap',
        );
        expect(context.windowObj.history.replaceState).toHaveBeenCalledWith(
            {},
            '',
            '/embed?parentOrigin=https%3A%2F%2Fparent.example.com',
        );
    });

    it('embedTheme=light を初回 bootstrap で themeMode=light として保存する', () => {
        const context = createBootstrapContext('?embedTheme=light');

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('light');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentBootstrap');
    });

    it('embedTheme=system を初回 bootstrap で themeMode=system として保存する', () => {
        const context = createBootstrapContext('?embedTheme=system');

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(true);
        expect(result.parsedSettings.themeMode).toBe('system');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('system');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(getPreferenceSource(storage, 'darkMode')).toBe('parentBootstrap');
    });

    it('user source の設定は embed 初回でも上書きしない', () => {
        setLocalePreference(storage, 'ja', 'user');
        setThemeModePreference(storage, 'light', 'user');
        setQuoteNotificationEnabledPreference(storage, false, 'user');

        const context = createBootstrapContext(
            '?embedLocale=en&embedTheme=dark&embedShowMascot=false&embedQuoteNotification=true',
        );

        applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('ja');
        expect(storage.getItem(STORAGE_KEYS.THEME_MODE)).toBe('light');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBeNull();
        expect(getPreferenceSource(storage, 'locale')).toBe('user');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('user');
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentBootstrap');
        expect(storage.getItem(STORAGE_KEYS.QUOTE_NOTIFICATION_ENABLED)).toBe('false');
        expect(getPreferenceSource(storage, 'quoteNotificationEnabled')).toBe('user');
        expect(context.documentObj.documentElement.lang).toBe('ja');
    });

    it('embed 初回適用済みなら親設定を再適用しない', () => {
        setLocalePreference(storage, 'ja', 'parentBootstrap');
        markEmbedBootstrapApplied(storage);

        const context = createBootstrapContext('?embedLocale=en');

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(false);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('ja');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentBootstrap');
        expect(context.windowObj.history.replaceState).toHaveBeenCalledWith({}, '', '/embed');
    });
});
