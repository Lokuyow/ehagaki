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

    it('uploadEndpoint query は localStorage に書かず IndexedDB bootstrap 用に返す', () => {
        const context = createBootstrapContext(
            '?embedUploadEndpoint=https%3A%2F%2Fnostr.build%2Fapi%2Fv2%2Fnip96%2Fupload&defaultUploadEndpoint=https%3A%2F%2Fshare.yabu.me%2Fapi%2Fv2%2Fmedia',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.applied).toBe(false);
        expect(result.appliedSettings).toEqual([]);
        expect(result.uploadEndpointPreference).toEqual({
            endpoint: 'https://nostr.build/api/v2/nip96/upload',
            mode: 'forced',
        });
        expect(storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT)).toBeNull();
    });

    it('defaultUploadEndpoint は IndexedDB bootstrap 用の default preference として返す', () => {
        const context = createBootstrapContext(
            '?defaultUploadEndpoint=https%3A%2F%2Fshare.yabu.me%2Fapi%2Fv2%2Fmedia',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.uploadEndpointPreference).toEqual({
            endpoint: 'https://share.yabu.me/api/v2/media',
            mode: 'default',
        });
        expect(storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT)).toBeNull();
    });

    it('embedImageQuality は UI 品質の意味で保存する', () => {
        const context = createBootstrapContext(
            '?embedImageQuality=high&embedVideoQuality=low',
        );

        const result = applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(result.appliedSettings).toEqual([
            'imageQualityLevel',
            'videoQualityLevel',
        ]);
        expect(storage.getItem(STORAGE_KEYS.IMAGE_QUALITY_LEVEL)).toBe('high');
        expect(storage.getItem(STORAGE_KEYS.VIDEO_QUALITY_LEVEL)).toBe('low');
        expect(getPreferenceSource(storage, 'imageQualityLevel')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'videoQualityLevel')).toBe('parentForced');
    });

    it('legacy embedImageCompression は旧 UI 表示の意味を維持して移行する', () => {
        const context = createBootstrapContext(
            '?embedImageCompression=low&embedVideoCompression=high',
        );

        applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(storage.getItem(STORAGE_KEYS.IMAGE_QUALITY_LEVEL)).toBe('high');
        expect(storage.getItem(STORAGE_KEYS.VIDEO_QUALITY_LEVEL)).toBe('low');
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
