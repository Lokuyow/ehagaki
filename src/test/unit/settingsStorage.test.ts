import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    clearDarkModePreference,
    getPreferenceSource,
    hasAppliedEmbedBootstrap,
    markEmbedBootstrapApplied,
    setDarkModePreference,
    setLocalePreference,
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
});