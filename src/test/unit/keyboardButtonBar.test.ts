import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { readable } from 'svelte/store';
import { clearAuthState, updateAuthState } from '../../stores/authStore.svelte';
import { editorState, resetPostStatus } from '../../stores/editorStore.svelte';
import { contentWarningStore } from '../../stores/tagsStore.svelte';
import { settingsStore } from '../../stores/settingsStore.svelte';

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
        clearAuthState();
        resetPostStatus();
        contentWarningStore.reset();
        settingsStore.failClosedContentWarning = false;
    });

    it('CWアイコンは新CW設定にリアクティブに追従し、投稿ごとのCW状態とは独立する', async () => {
        settingsStore.failClosedContentWarning = false;
        contentWarningStore.set(false);

        const { container } = render(KeyboardButtonBarWithProvider);
        const button = screen.getByRole('button', {
            name: '閲覧注意を切り替え',
        });
        const icon = button.querySelector('.content-warning-icon');

        expect(icon).toBeTruthy();
        expect(icon?.classList.contains('fail-closed-format')).toBe(false);
        expect(button.classList.contains('selected')).toBe(false);

        settingsStore.failClosedContentWarning = true;
        await tick();

        expect(container.querySelector('.content-warning-icon')).toBe(icon);
        expect(icon?.classList.contains('fail-closed-format')).toBe(true);
        expect(button.classList.contains('selected')).toBe(false);

        contentWarningStore.set(true);
        await tick();

        expect(button.classList.contains('selected')).toBe(true);
        expect(icon?.classList.contains('fail-closed-format')).toBe(true);

        settingsStore.failClosedContentWarning = false;
        await tick();

        expect(button.classList.contains('selected')).toBe(true);
        expect(icon?.classList.contains('fail-closed-format')).toBe(false);
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

    it('送信中はカスタム絵文字Pickerを開くボタンを無効化する', () => {
        updateAuthState({ type: 'nip46', isValid: true });
        editorState.postStatus.sending = true;

        render(KeyboardButtonBarWithProvider);

        const button = screen.getByRole('button', { name: 'カスタム絵文字' });
        expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('投稿ボタンは既定で表示され、内部propで投稿surfaceだけを隠せる', () => {
        const { unmount } = render(KeyboardButtonBarWithProvider);
        expect(screen.getByRole('button', { name: '投稿' })).toBeTruthy();
        unmount();

        render(KeyboardButtonBarWithProvider, { props: { showPostButton: false } });
        expect(screen.queryByRole('button', { name: '投稿' })).toBeNull();
        expect(screen.getByRole('button', { name: 'カスタム絵文字' })).toBeTruthy();
    });
});
