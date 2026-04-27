import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'postComponent.upload_image': '画像をアップロード',
        'postComponent.post': '投稿',
        'keyboardButtonBar.custom_emoji': 'カスタム絵文字',
        'keyboardButtonBar.content_warning_toggle': '閲覧注意を切り替え',
        'keyboardButtonBar.hashtag_pin_toggle': 'ハッシュタグ固定を切り替え',
        'keyboardButtonBar.upload_image_tooltip': '画像をアップロード',
        'keyboardButtonBar.post_tooltip': '投稿',
        'keyboardButtonBar.content_warning_tooltip': '閲覧注意',
        'keyboardButtonBar.hashtag_pin_tooltip': 'ハッシュタグ固定',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

import KeyboardButtonBarWithProvider from './fixtures/KeyboardButtonBarWithProvider.svelte';

describe('KeyboardButtonBar', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.documentElement.style.removeProperty('--keyboard-height');
    });

    it('button 押下前の pointerdown で focus 移動を抑止する', () => {
        const editor = document.createElement('textarea');
        document.body.append(editor);
        editor.focus();

        render(KeyboardButtonBarWithProvider);

        const button = screen.getByRole('button', { name: 'カスタム絵文字' });
        const event = new Event('pointerdown', {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, 'pointerType', { value: 'touch' });

        expect(button.dispatchEvent(event)).toBe(false);
        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(editor);
    });

    it('Android で editor が focus 済みかつキーボード非表示の時は一時的に IME 起動を抑止する', async () => {
        vi.useFakeTimers();

        const editor = document.createElement('div');
        editor.className = 'tiptap-editor';
        editor.tabIndex = 0;
        editor.setAttribute('contenteditable', 'true');
        editor.setAttribute('inputmode', 'text');
        editor.setAttribute('virtualkeyboardpolicy', 'auto');
        Object.defineProperty(editor, 'isContentEditable', {
            value: true,
            configurable: true,
        });
        document.body.append(editor);
        editor.focus();

        render(KeyboardButtonBarWithProvider);

        const button = screen.getByRole('button', { name: 'カスタム絵文字' });
        const event = new Event('pointerdown', {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, 'pointerType', { value: 'touch' });

        expect(button.dispatchEvent(event)).toBe(false);
        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(editor);
        expect(editor.getAttribute('inputmode')).toBe('none');
        expect(editor.getAttribute('virtualkeyboardpolicy')).toBe('auto');

        await vi.runAllTimersAsync();

        expect(editor.getAttribute('inputmode')).toBe('text');
        expect(editor.getAttribute('virtualkeyboardpolicy')).toBe('auto');
        expect(document.activeElement).toBe(editor);
    });

    it('キーボード表示中は editor の入力属性を変更しない', () => {
        document.documentElement.style.setProperty('--keyboard-height', '300px');

        const editor = document.createElement('div');
        editor.className = 'tiptap-editor';
        editor.tabIndex = 0;
        editor.setAttribute('contenteditable', 'true');
        editor.setAttribute('inputmode', 'text');
        editor.setAttribute('virtualkeyboardpolicy', 'auto');
        Object.defineProperty(editor, 'isContentEditable', {
            value: true,
            configurable: true,
        });
        document.body.append(editor);
        editor.focus();

        render(KeyboardButtonBarWithProvider);

        const button = screen.getByRole('button', { name: 'カスタム絵文字' });
        const event = new Event('pointerdown', {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, 'pointerType', { value: 'touch' });

        expect(button.dispatchEvent(event)).toBe(false);
        expect(editor.getAttribute('inputmode')).toBe('text');
        expect(editor.getAttribute('virtualkeyboardpolicy')).toBe('auto');
        expect(document.activeElement).toBe(editor);
    });
});
