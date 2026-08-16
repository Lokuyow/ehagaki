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
            themeTarget: document.documentElement,
            layoutMode: 'viewport',
        });
        themeColorStore.reset();
        themeColorStore.reload();
    });

    afterEach(() => {
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
        });
    });

    it('persists valid colors and applies them immediately to the standalone style target', () => {
        expect(themeColorStore.setAccentColor('ff0000')).toBe('#ff0000');
        expect(themeColorStore.setBaseColor('#0000ff')).toBe('#0000ff');

        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBe('#ff0000');
        expect(storage.getItem(STORAGE_KEYS.BASE_COLOR)).toBe('#0000ff');
        expect(styleTarget.style.getPropertyValue('--accent-color')).toBe('#ff0000');
        expect(styleTarget.style.getPropertyValue('--base-color')).toBe('#0000ff');
    });

    it('keeps the last valid color when an invalid value is submitted', () => {
        themeColorStore.setAccentColor('#ff0000');

        expect(themeColorStore.setAccentColor('#f00')).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBe('#ff0000');
        expect(styleTarget.style.getPropertyValue('--accent-color')).toBe('#ff0000');
    });

    it('removes custom CSS properties and persisted values when reset', () => {
        themeColorStore.setAccentColor('#ff0000');
        themeColorStore.setBaseColor('#0000ff');

        themeColorStore.reset();

        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.BASE_COLOR)).toBeNull();
        expect(styleTarget.style.getPropertyValue('--accent-color')).toBe('');
        expect(styleTarget.style.getPropertyValue('--base-color')).toBe('');
    });

    it('does not write or override host styles in Web Component container mode', () => {
        styleTarget.style.setProperty('--accent-color', '#abcdef');
        configureAppRuntimeEnvironment({ layoutMode: 'container' });
        themeColorStore.reload();

        expect(themeColorStore.setAccentColor('#ff0000')).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.ACCENT_COLOR)).toBeNull();
        expect(styleTarget.style.getPropertyValue('--accent-color')).toBe('#abcdef');
    });

    it('does not apply standalone preferences from an iframe viewport runtime', () => {
        styleTarget.style.setProperty('--accent-color', '#abcdef');
        configureAppRuntimeEnvironment({
            window: { top: {} } as unknown as Window,
            layoutMode: 'viewport',
        });
        themeColorStore.reload();

        expect(themeColorStore.isAvailable).toBe(false);
        expect(themeColorStore.setAccentColor('#ff0000')).toBeNull();
        expect(styleTarget.style.getPropertyValue('--accent-color')).toBe('#abcdef');
    });

    it('keeps color preferences outside the iframe embed settings persistence contract', () => {
        expect(EMBED_SETTING_STORAGE_KEYS).not.toContain(STORAGE_KEYS.ACCENT_COLOR);
        expect(EMBED_SETTING_STORAGE_KEYS).not.toContain(STORAGE_KEYS.BASE_COLOR);
    });
});
