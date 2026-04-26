import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../lib/constants';
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
});
