import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    focusEditorWithoutKeyboardForCurrentTap,
    isComposerKeyboardVisible,
    isIosTouchDevice,
    isPostEditorFocusActive,
    preserveKeyboardForScrollableTouch,
    readComposerKeyboardHeight,
} from '../../lib/utils/keyboardFocusUtils';
import {
    configureAppRuntimeEnvironment,
    getAppRuntimeEnvironment,
} from '../../lib/appRuntimeEnvironment';

const previousRuntimeEnvironment = getAppRuntimeEnvironment();

function setNavigatorValue(name: keyof Navigator, value: unknown): void {
    Object.defineProperty(navigator, name, {
        value,
        configurable: true,
    });
}

function createShadowRuntime(): {
    host: HTMLDivElement;
    shadowRoot: ShadowRoot;
    styleTarget: HTMLDivElement;
} {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const styleTarget = document.createElement('div');
    shadowRoot.append(styleTarget);
    document.body.append(host);
    configureAppRuntimeEnvironment({
        window,
        document,
        domRoot: shadowRoot,
        styleTarget,
        layoutTarget: styleTarget,
        overlayTarget: styleTarget,
        themeTarget: host,
        layoutMode: 'container',
        runtimeKind: 'web-component',
    });

    return { host, shadowRoot, styleTarget };
}

afterEach(() => {
    configureAppRuntimeEnvironment(previousRuntimeEnvironment);
    document.documentElement.style.removeProperty('--keyboard-height');
});

describe('focusEditorWithoutKeyboardForCurrentTap', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        setNavigatorValue('userAgent', 'Mozilla/5.0');
        setNavigatorValue('platform', 'Win32');
        setNavigatorValue('maxTouchPoints', 0);
    });

    it('editor を inputmode none で focus してから元の inputmode に戻す', () => {
        vi.useFakeTimers();
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(didFocus).toBe(true);
        expect(document.activeElement).toBe(editorElement);
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });

    it('既存の inputmode がある場合は restore で復元する', () => {
        vi.useFakeTimers();
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        editorElement.setAttribute('inputmode', 'text');
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(didFocus).toBe(true);
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.getAttribute('inputmode')).toBe('text');
    });

    it('iPhone では focus せず、キーボード抑止を呼び出し元の疑似 caret に委ねる', () => {
        setNavigatorValue(
            'userAgent',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        );
        setNavigatorValue('platform', 'iPhone');
        setNavigatorValue('maxTouchPoints', 1);

        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(isIosTouchDevice()).toBe(true);
        expect(didFocus).toBe(false);
        expect(document.activeElement).toBe(button);
        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });
});

describe('isPostEditorFocusActive', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        window.getSelection()?.removeAllRanges();
    });

    it('投稿エディタールート内の focus を検出する', () => {
        const root = document.createElement('div');
        root.setAttribute('data-post-editor-root', '');
        const editor = document.createElement('div');
        editor.contentEditable = 'true';
        editor.tabIndex = 0;
        root.append(editor);
        document.body.append(root);

        editor.focus();

        expect(isPostEditorFocusActive()).toBe(true);
    });

    it('ShadowRoot 内の投稿エディター focus を runtime root から検出する', () => {
        const { host, shadowRoot, styleTarget } = createShadowRuntime();
        const root = document.createElement('div');
        root.setAttribute('data-post-editor-root', '');
        const editor = document.createElement('div');
        editor.contentEditable = 'true';
        editor.tabIndex = 0;
        root.append(editor);
        styleTarget.append(root);

        editor.focus();

        expect(document.activeElement).toBe(host);
        expect(shadowRoot.activeElement).toBe(editor);
        expect(isPostEditorFocusActive()).toBe(true);
    });

    it('投稿エディター内に selection が残っていてもダイアログ input の focus を優先する', () => {
        const root = document.createElement('div');
        root.setAttribute('data-post-editor-root', '');
        const editorText = document.createTextNode('draft');
        root.append(editorText);
        const input = document.createElement('input');
        document.body.append(root, input);
        const range = document.createRange();
        range.setStart(editorText, 2);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        input.focus();

        expect(isPostEditorFocusActive()).toBe(false);
    });

    it('ShadowRoot 内の別 input focus を残留 editor selection より優先する', () => {
        const { styleTarget } = createShadowRuntime();
        const root = document.createElement('div');
        root.setAttribute('data-post-editor-root', '');
        const editorText = document.createTextNode('draft');
        root.append(editorText);
        const input = document.createElement('input');
        styleTarget.append(root, input);
        const range = document.createRange();
        range.setStart(editorText, 2);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        input.focus();

        expect(isPostEditorFocusActive()).toBe(false);
    });
});

describe('composer keyboard runtime state', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('runtime styleTarget の keyboard height だけを参照する', () => {
        const { styleTarget } = createShadowRuntime();
        styleTarget.style.setProperty('--keyboard-height', '300px');

        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('');
        expect(readComposerKeyboardHeight()).toBe(300);
        expect(isComposerKeyboardVisible()).toBe(true);
    });

    it('document root だけにある keyboard height へ fallback しない', () => {
        const { styleTarget } = createShadowRuntime();
        document.documentElement.style.setProperty('--keyboard-height', '300px');
        styleTarget.style.setProperty('--keyboard-height', '0px');

        expect(readComposerKeyboardHeight()).toBe(0);
        expect(isComposerKeyboardVisible()).toBe(false);
    });

    it('keyboard 表示中の ShadowRoot touch では editor inputmode を変更しない', () => {
        vi.useFakeTimers();
        const { styleTarget } = createShadowRuntime();
        styleTarget.style.setProperty('--keyboard-height', '300px');
        const editor = document.createElement('div');
        editor.className = 'tiptap-editor';
        editor.tabIndex = 0;
        const surface = document.createElement('div');
        styleTarget.append(editor, surface);
        editor.focus();
        surface.addEventListener('touchstart', preserveKeyboardForScrollableTouch);

        surface.dispatchEvent(new Event('touchstart', {
            bubbles: true,
            cancelable: true,
        }));

        expect(editor.hasAttribute('inputmode')).toBe(false);
        vi.runAllTimers();
        vi.useRealTimers();
    });
});

describe('preserveKeyboardForScrollableTouch', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        document.documentElement.style.removeProperty('--keyboard-height');
    });

    it('touchstart のデフォルトスクロールを止めずに editor inputmode を一時抑制する', () => {
        vi.useFakeTimers();
        document.documentElement.style.setProperty('--keyboard-height', '0px');
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        document.body.append(editorElement);
        editorElement.focus();
        const preventDefault = vi.fn();

        preserveKeyboardForScrollableTouch({
            type: 'touchstart',
            preventDefault,
        } as unknown as Event);

        expect(preventDefault).not.toHaveBeenCalled();
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });
});
