import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    clearDarkModePreference,
    getStoredThemeModePreference,
    getQuoteNotificationEnabledPreference,
    getReplyNotificationEnabledPreference,
    getPreferenceSource,
    getExternalNostrClientPreference,
    getImageCompressionLevelPreference,
    hasAppliedEmbedBootstrap,
    markEmbedBootstrapApplied,
    setDarkModePreference,
    setThemeModePreference,
    setLocalePreference,
    setImageCompressionLevelPreference,
    setQuoteNotificationEnabledPreference,
    setReplyNotificationEnabledPreference,
    setExternalNostrClientCustomUrlPreference,
    setExternalNostrClientPreference,
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

    it('リプライ通知設定はデフォルトfalseで、setter呼び出し時にsourceを記録する', () => {
        expect(getReplyNotificationEnabledPreference(storage)).toBe(false);
        expect(storage.getItem(STORAGE_KEYS.REPLY_NOTIFICATION_ENABLED)).toBe('false');

        setReplyNotificationEnabledPreference(storage, true, 'parentBootstrap');

        expect(storage.getItem(STORAGE_KEYS.REPLY_NOTIFICATION_ENABLED)).toBe('true');
        expect(getPreferenceSource(storage, 'replyNotificationEnabled')).toBe(
            'parentBootstrap',
        );
    });

    it('画像品質設定は新キーへ保存して source を記録する', () => {
        setImageCompressionLevelPreference(storage, 'high', 'parentBootstrap');

        expect(storage.getItem(STORAGE_KEYS.IMAGE_QUALITY_LEVEL)).toBe('high');
        expect(storage.getItem(STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL)).toBeNull();
        expect(getPreferenceSource(storage, 'imageQualityLevel')).toBe(
            'parentBootstrap',
        );
    });

    it('legacy 画像圧縮設定は UI 品質の意味を維持して新キーへ移行する', () => {
        storage.setItem(STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL, 'low');

        expect(getImageCompressionLevelPreference(storage)).toBe('high');
        expect(storage.getItem(STORAGE_KEYS.IMAGE_QUALITY_LEVEL)).toBe('high');
        expect(storage.getItem(STORAGE_KEYS.LEGACY_IMAGE_COMPRESSION_LEVEL)).toBeNull();
    });

});

describe('external Nostr client preference', () => {
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
    });

    it('未保存かつ日本語ではnostterを初期値として保存する', () => {
        expect(getExternalNostrClientPreference(storage, 'ja')).toEqual({
            client: 'nostter',
            customUrlTemplate: '',
        });
        expect(storage.getItem(STORAGE_KEYS.EXTERNAL_NOSTR_CLIENT)).toBe('nostter');
    });

    it('未保存かつ英語ではJumbleを初期値として保存する', () => {
        expect(getExternalNostrClientPreference(storage, 'en').client).toBe('jumble');
    });

    it('保存済み設定をlocaleより優先し、locale変更でも保持する', () => {
        setExternalNostrClientPreference(storage, 'primal');

        expect(getExternalNostrClientPreference(storage, 'ja').client).toBe('primal');
        expect(getExternalNostrClientPreference(storage, 'en').client).toBe('primal');
    });

    it.each(['nostter', 'jumble', 'primal', 'njump', 'lumilumi', 'custom'])(
        '%sを保存して再読込できる',
        (client) => {
            expect(setExternalNostrClientPreference(storage, client)).toBe(client);
            expect(getExternalNostrClientPreference(storage, 'en').client).toBe(client);
        },
    );

    it('カスタムURLを正規化して保存し、無効なURLは拒否する', () => {
        expect(
            setExternalNostrClientCustomUrlPreference(
                storage,
                ' https://example.com/note/{nevent} ',
            ),
        ).toBe('https://example.com/note/{nevent}');
        expect(
            getExternalNostrClientPreference(storage, 'en').customUrlTemplate,
        ).toBe('');

        setExternalNostrClientPreference(storage, 'custom');
        expect(getExternalNostrClientPreference(storage, 'en').customUrlTemplate).toBe(
            'https://example.com/note/{nevent}',
        );
        expect(
            setExternalNostrClientCustomUrlPreference(
                storage,
                'javascript:alert(1)/{nevent}',
            ),
        ).toBeNull();
    });
});
