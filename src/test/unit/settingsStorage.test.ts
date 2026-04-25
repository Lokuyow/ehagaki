import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    clearDarkModePreference,
    getQuoteNotificationEnabledPreference,
    getPreferenceSource,
    hasAppliedEmbedBootstrap,
    markEmbedBootstrapApplied,
    setDarkModePreference,
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
