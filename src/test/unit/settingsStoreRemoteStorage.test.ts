import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
import {
    EMBED_SETTING_STORAGE_KEYS,
    LEGACY_EMBED_SETTING_STORAGE_KEYS,
} from '../../lib/embedStorageKeys';
import { getPreferenceSource } from '../../lib/utils/settingsStorage';
import { MockStorage } from '../helpers';

describe('settings/theme stores remote storage persistence', () => {
    let storage: MockStorage;

    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        storage = new MockStorage();
        Object.defineProperty(globalThis, 'localStorage', {
            value: storage,
            writable: true,
        });
        Object.defineProperty(globalThis, 'navigator', {
            value: { language: 'ja' },
            writable: true,
        });
        Object.defineProperty(globalThis, 'document', {
            value: {
                documentElement: {
                    lang: '',
                    setAttribute: vi.fn(),
                    classList: {
                        add: vi.fn(),
                        remove: vi.fn(),
                    },
                    style: {},
                },
            },
            writable: true,
        });
        Object.defineProperty(globalThis, 'window', {
            value: {
                localStorage: storage,
                document: globalThis.document,
                matchMedia: vi.fn(() => ({
                    matches: false,
                    addEventListener: vi.fn(),
                })),
            },
            writable: true,
        });
    });

    it('settingsStore のユーザー変更を親 storage へ通知する', async () => {
        const { embedStorageService } = await import('../../lib/embedStorageService');
        const persistSpy = vi
            .spyOn(embedStorageService, 'persistLocalStorageKeys')
            .mockImplementation(() => { });
        const { settingsStore } = await import('../../stores/settingsStore.svelte');

        settingsStore.locale = 'en';

        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(persistSpy).toHaveBeenCalledWith([
            STORAGE_KEYS.LOCALE,
            STORAGE_KEYS.UPLOAD_ENDPOINT,
            STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
        ]);
    });

    it('単一設定のユーザー変更も metadata 付きで親 storage へ通知する', async () => {
        const { embedStorageService } = await import('../../lib/embedStorageService');
        const persistSpy = vi
            .spyOn(embedStorageService, 'persistLocalStorageKeys')
            .mockImplementation(() => { });
        const { settingsStore } = await import('../../stores/settingsStore.svelte');

        settingsStore.mediaFreePlacement = true;

        expect(storage.getItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT)).toBe('true');
        expect(persistSpy).toHaveBeenCalledWith([
            STORAGE_KEYS.MEDIA_FREE_PLACEMENT,
            STORAGE_KEYS.SETTINGS_PREFERENCE_METADATA,
        ]);
    });

    it('applyParentSettings は source を保持して embed 設定一式を親 storage へ通知する', async () => {
        const { embedStorageService } = await import('../../lib/embedStorageService');
        const persistSpy = vi
            .spyOn(embedStorageService, 'persistLocalStorageKeys')
            .mockImplementation(() => { });
        const { settingsStore } = await import('../../stores/settingsStore.svelte');

        storage.removeItem(STORAGE_KEYS.UPLOAD_ENDPOINT);

        const applied = settingsStore.applyParentSettings(
            {
                locale: 'en',
                mediaFreePlacement: true,
                showMascot: false,
                showFlavorText: false,
            },
            'parentForced',
        );

        expect(applied).toEqual([
            'locale',
            'mediaFreePlacement',
            'showMascot',
            'showFlavorText',
        ]);
        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBe('en');
        expect(storage.getItem(STORAGE_KEYS.UPLOAD_ENDPOINT)).toBe(
            'https://nostrcheck.me/api/v2/media',
        );
        expect(storage.getItem(STORAGE_KEYS.MEDIA_FREE_PLACEMENT)).toBe('true');
        expect(storage.getItem(STORAGE_KEYS.SHOW_MASCOT)).toBe('false');
        expect(storage.getItem(STORAGE_KEYS.SHOW_FLAVOR_TEXT)).toBe('false');
        expect(getPreferenceSource(storage, 'locale')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'mediaFreePlacement')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'showMascot')).toBe('parentForced');
        expect(getPreferenceSource(storage, 'showFlavorText')).toBe('parentForced');
        expect(globalThis.document.documentElement.lang).toBe('en');
        expect(persistSpy).toHaveBeenLastCalledWith([
            ...EMBED_SETTING_STORAGE_KEYS,
            ...LEGACY_EMBED_SETTING_STORAGE_KEYS,
        ]);
    });
});
