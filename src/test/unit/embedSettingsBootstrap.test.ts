import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import { applyEmbedSettingsBootstrap } from '../../lib/bootstrap/embedSettingsBootstrap';
import {
    getPreferenceSource,
    markEmbedBootstrapApplied,
    setDarkModePreference,
    setLocalePreference,
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
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBe('true');
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

    it('user source の設定は embed 初回でも上書きしない', () => {
        setLocalePreference(storage, 'ja', 'user');
        setDarkModePreference(storage, false, 'user');

        const context = createBootstrapContext(
            '?embedLocale=en&embedTheme=dark&embedShowMascot=false',
        );

        applyEmbedSettingsBootstrap({
            storage,
            ...context,
            locationSearch: context.windowObj.location.search,
        });

        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('ja');
        expect(storage.getItem(STORAGE_KEYS.DARK_MODE)).toBe('false');
        expect(getPreferenceSource(storage, 'locale')).toBe('user');
        expect(getPreferenceSource(storage, 'darkMode')).toBe('user');
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentBootstrap');
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