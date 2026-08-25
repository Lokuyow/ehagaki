import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { configureAppRuntimeEnvironment } from '../../lib/appRuntimeEnvironment';
import { STORAGE_KEYS } from '../../lib/constants';
import { EMBED_SETTING_STORAGE_KEYS } from '../../lib/embedStorageKeys';
import { themeColorStore } from '../../stores/themeColorStore.svelte';
import { MockStorage } from '../helpers';

describe('themeColorStore', () => {
    let storage: MockStorage;
    let styleTarget: HTMLDivElement;

    beforeEach(() => {
        storage = new MockStorage();
        styleTarget = document.createElement('div');
        configureAppRuntimeEnvironment({
            storage,
            window,
            document,
            domRoot: document,
            styleTarget,
            layoutTarget: document.body,
            overlayTarget: document.body,
            themeTarget: styleTarget,
            layoutMode: 'viewport',
            runtimeKind: 'standalone',
        });
        themeColorStore.setExternalLayers({});
        themeColorStore.reset();
        themeColorStore.reload();
    });

    afterEach(() => {
        themeColorStore.setExternalLayers({});
        themeColorStore.reset();
        configureAppRuntimeEnvironment({
            storage: window.localStorage,
            window,
            document,
            domRoot: document,
            styleTarget: document.documentElement,
            layoutTarget: document.body,
            overlayTarget: document.body,
            themeTarget: document.documentElement,
            layoutMode: 'viewport',
            runtimeKind: 'standalone',
        });
    });

    it('persists valid colors as user layers and applies them immediately', () => {
        expect(themeColorStore.setAccentColor('ff0000')).toBe('#ff0000');
        expect(themeColorStore.setBaseColor('#0000ff')).toBe('#0000ff');

        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBe('#ff0000');
        expect(storage.getItem(STORAGE_KEYS.BASE_COLOR)).toBe('#0000ff');
        expect(styleTarget.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
        expect(styleTarget.style.getPropertyValue('--base-color-user')).toBe('#0000ff');
    });

    it('keeps the last valid color when an invalid value is submitted', () => {
        themeColorStore.setAccentColor('#ff0000');

        expect(themeColorStore.setAccentColor('#f00')).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBe('#ff0000');
        expect(styleTarget.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
    });

    it('resets only user colors and preserves external layers', () => {
        themeColorStore.setAccentColor('#ff0000');
        themeColorStore.setBaseColor('#0000ff');
        themeColorStore.setExternalLayers({
            forcedAccentColor: '#00ff00',
            defaultBaseColor: '#abcdef',
        });

        themeColorStore.reset();

        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.BASE_COLOR)).toBeNull();
        expect(styleTarget.style.getPropertyValue('--accent-color-user')).toBe('');
        expect(styleTarget.style.getPropertyValue('--base-color-user')).toBe('');
        expect(styleTarget.style.getPropertyValue('--accent-color-forced')).toBe('#00ff00');
        expect(styleTarget.style.getPropertyValue('--base-color-external-default')).toBe('#abcdef');
    });

    it('supports iframe user colors and runtime forced color changes', () => {
        configureAppRuntimeEnvironment({
            window: { top: {} } as unknown as Window,
            layoutMode: 'viewport',
            runtimeKind: 'iframe',
        });
        themeColorStore.reload();

        expect(themeColorStore.isAvailable).toBe(true);
        expect(themeColorStore.setAccentColor('#ff0000')).toBe('#ff0000');
        themeColorStore.setExternalLayers({
            forcedAccentColor: '#00ff00',
            defaultAccentColor: '#0000ff',
        });
        expect(styleTarget.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
        expect(styleTarget.style.getPropertyValue('--accent-color-forced')).toBe('#00ff00');

        themeColorStore.applyExternalSettings({ forcedAccentColor: null });
        expect(styleTarget.style.getPropertyValue('--accent-color-forced')).toBe('');
        expect(styleTarget.style.getPropertyValue('--accent-color-external-default')).toBe('#0000ff');
    });

    it('includes user colors in the delegated iframe settings allowlist', () => {
        expect(EMBED_SETTING_STORAGE_KEYS).toContain(STORAGE_KEYS.ACCENT_COLOR);
        expect(EMBED_SETTING_STORAGE_KEYS).toContain(STORAGE_KEYS.BASE_COLOR);
    });
});
