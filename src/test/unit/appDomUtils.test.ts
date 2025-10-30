import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    domUtils,
    setBodyStyle,
    clearBodyStyles,
    getActiveElement,
    isEditorElement,
    isFormControl,
    blurActiveElement,
    isTouchDevice,
    blurEditorAndBody,
    defaultTimeoutAdapter,
    focusEditor
} from '../../lib/utils/appDomUtils';

describe('appDomUtils', () => {
    beforeEach(() => {
        // DOM をクリアしてテスト環境をリセット
        document.body.innerHTML = '';
        document.body.removeAttribute('style');
        vi.clearAllMocks();

        // すべてのモックをリセット
        vi.restoreAllMocks();
    });

    afterEach(() => {
        // テスト後のクリーンアップ
        document.body.innerHTML = '';
        document.body.removeAttribute('style');
        vi.restoreAllMocks();
    });

    describe('domUtils', () => {
        describe('setBodyStyle', () => {
            it('bodyのスタイルプロパティを設定できる', () => {
                domUtils.setBodyStyle('overflow', 'hidden');
                expect(document.body.style.overflow).toBe('hidden');
            });

            it('複数のスタイルプロパティを設定できる', () => {
                domUtils.setBodyStyle('overflow', 'hidden');
                domUtils.setBodyStyle('user-select', 'none');

                expect(document.body.style.overflow).toBe('hidden');
                expect(document.body.style.userSelect).toBe('none');
            });
        });

        describe('querySelector', () => {
            it('セレクタで要素を取得できる', () => {
                const div = document.createElement('div');
                div.className = 'test-element';
                document.body.appendChild(div);

                const found = domUtils.querySelector('.test-element');
                expect(found).toBe(div);
            });

            it('存在しない要素の場合はnullを返す', () => {
                const found = domUtils.querySelector('.non-existent');
                expect(found).toBeNull();
            });
        });

        describe('querySelectorAll', () => {
            it('セレクタで複数要素を取得できる', () => {
                const div1 = document.createElement('div');
                div1.className = 'test-element';
                const div2 = document.createElement('div');
                div2.className = 'test-element';

                document.body.appendChild(div1);
                document.body.appendChild(div2);

                const elements = domUtils.querySelectorAll('.test-element');
                expect(elements.length).toBe(2);
                expect(elements[0]).toBe(div1);
                expect(elements[1]).toBe(div2);
            });

            it('存在しない要素の場合は空のNodeListを返す', () => {
                const elements = domUtils.querySelectorAll('.non-existent');
                expect(elements.length).toBe(0);
            });
        });

        describe('focusElement', () => {
            it('要素にフォーカスできる', () => {
                const input = document.createElement('input');
                document.body.appendChild(input);

                const focusSpy = vi.spyOn(input, 'focus');
                domUtils.focusElement(input);

                expect(focusSpy).toHaveBeenCalled();
            });
        });
    });

    describe('setBodyStyle', () => {
        it('domUtils.setBodyStyleが呼ばれる', () => {
            const spy = vi.spyOn(domUtils, 'setBodyStyle');

            setBodyStyle('overflow', 'hidden');

            expect(spy).toHaveBeenCalledWith('overflow', 'hidden');
        });
    });

    describe('clearBodyStyles', () => {
        it('bodyのスタイルをクリアできる', () => {
            // スタイルを設定
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = 'none';

            clearBodyStyles();

            expect(document.body.style.overflow).toBe('');
            expect(document.body.style.userSelect).toBe('');
        });
    });

    describe('getActiveElement', () => {
        it('アクティブな要素を返す', () => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();

            const active = getActiveElement();
            expect(active).toBe(input);
        });

        it('フォーカスされていない場合はbodyを返す', () => {
            const active = getActiveElement();
            expect(active).toBe(document.body);
        });
    });

    describe('isEditorElement', () => {
        it('tiptap-editorクラスを持つ要素はtrueを返す', () => {
            const div = document.createElement('div');
            div.className = 'tiptap-editor';

            expect(isEditorElement(div)).toBe(true);
        });

        it('tiptap-editor内の要素もtrueを返す', () => {
            const parent = document.createElement('div');
            parent.className = 'tiptap-editor';
            const child = document.createElement('span');
            parent.appendChild(child);
            document.body.appendChild(parent);

            expect(isEditorElement(child)).toBe(true);
        });

        it('エディタ以外の要素はfalseを返す', () => {
            const div = document.createElement('div');
            div.className = 'other-element';

            expect(isEditorElement(div)).toBe(false);
        });

        it('classListがない要素でもエラーにならずfalseを返す', () => {
            const element = {} as HTMLElement;
            expect(isEditorElement(element)).toBe(false);
        });
    });

    describe('isFormControl', () => {
        it('INPUT要素はtrueを返す', () => {
            const input = document.createElement('input');
            expect(isFormControl(input)).toBe(true);
        });

        it('TEXTAREA要素はtrueを返す', () => {
            const textarea = document.createElement('textarea');
            expect(isFormControl(textarea)).toBe(true);
        });

        it('contentEditableな要素はtrueを返す', () => {
            const div = document.createElement('div');
            // JSDOMではcontentEditableプロパティの設定方法を修正
            Object.defineProperty(div, 'isContentEditable', {
                value: true,
                configurable: true
            });
            expect(isFormControl(div)).toBe(true);
        });

        it('通常の要素はfalseを返す', () => {
            const div = document.createElement('div');
            // isContentEditableが未定義の場合はfalseになることを確認
            Object.defineProperty(div, 'isContentEditable', {
                value: false,
                configurable: true
            });
            expect(isFormControl(div)).toBe(false);
        });
    });

    describe('blurActiveElement', () => {
        it('アクティブなエディタ要素をblurできる', () => {
            const div = document.createElement('div');
            div.className = 'tiptap-editor';
            div.tabIndex = 0; // フォーカス可能にする
            document.body.appendChild(div);
            div.focus();

            const blurSpy = vi.spyOn(div, 'blur');
            const bodyFocusSpy = vi.spyOn(document.body, 'focus');

            blurActiveElement();

            expect(blurSpy).toHaveBeenCalled();
            expect(bodyFocusSpy).toHaveBeenCalled();
        });

        it('アクティブなフォームコントロール要素をblurできる', () => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();

            const blurSpy = vi.spyOn(input, 'blur');
            const bodyFocusSpy = vi.spyOn(document.body, 'focus');

            blurActiveElement();

            expect(blurSpy).toHaveBeenCalled();
            expect(bodyFocusSpy).toHaveBeenCalled();
        });

        it('フォーム以外の要素はblurしない', () => {
            const div = document.createElement('div');
            div.tabIndex = 0;
            document.body.appendChild(div);
            div.focus();

            const blurSpy = vi.spyOn(div, 'blur');

            blurActiveElement();

            expect(blurSpy).not.toHaveBeenCalled();
        });

        it('blurメソッドがない要素でもエラーにならない', () => {
            const mockElement = {
                tagName: 'INPUT'
            } as HTMLElement;

            // document.activeElement をモック
            Object.defineProperty(document, 'activeElement', {
                value: mockElement,
                configurable: true
            });

            expect(() => blurActiveElement()).not.toThrow();
        });
    });

    describe('isTouchDevice', () => {
        let originalWindow: any;
        let originalNavigator: any;

        beforeEach(() => {
            originalWindow = global.window;
            originalNavigator = global.navigator;
        });

        afterEach(() => {
            global.window = originalWindow;
            global.navigator = originalNavigator;
        });

        it('ontouchstartがある場合はtrueを返す', () => {
            // @ts-ignore
            global.window = { ontouchstart: null };

            expect(isTouchDevice()).toBe(true);
        });

        it('maxTouchPointsが1以上ならtrueを返す', () => {
            // @ts-ignore
            global.window = {};
            // @ts-ignore
            global.navigator = { maxTouchPoints: 1 };

            expect(isTouchDevice()).toBe(true);
        });

        it('モバイルのuserAgentならtrueを返す', () => {
            // @ts-ignore
            global.window = {};
            // @ts-ignore
            global.navigator = {
                maxTouchPoints: 0,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
            };

            expect(isTouchDevice()).toBe(true);
        });

        it('デスクトップデバイスならfalseを返す', () => {
            // @ts-ignore
            global.window = {};
            // @ts-ignore
            global.navigator = {
                maxTouchPoints: 0,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            };

            expect(isTouchDevice()).toBe(false);
        });

        it('windowがundefinedならfalseを返す', () => {
            // @ts-ignore
            global.window = undefined;

            expect(isTouchDevice()).toBe(false);
        });
    });

    describe('blurEditorAndBody', () => {
        it('input要素の場合はblurActiveElementが呼ばれる', () => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();

            // blurActiveElementの内部動作を直接検証
            const blurSpy = vi.spyOn(input, 'blur');
            const bodyFocusSpy = vi.spyOn(document.body, 'focus');

            // getActiveElementをスパイして、inputが実際にアクティブであることを保証
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(input);

            blurEditorAndBody();

            expect(blurSpy).toHaveBeenCalled();
            expect(bodyFocusSpy).toHaveBeenCalled();
        });

        it('タッチデバイスではtiptap-editorをblurする', () => {
            // タッチデバイスをシミュレート
            // @ts-ignore
            global.window = { ontouchstart: null };

            const editor = document.createElement('div');
            editor.className = 'tiptap-editor';
            document.body.appendChild(editor);

            const blurSpy = vi.spyOn(editor, 'blur').mockImplementation(() => { });

            blurEditorAndBody();

            expect(blurSpy).toHaveBeenCalled();
        });

        it('エラー発生時も例外にならない', () => {
            // querySelector でエラーが発生する状況をシミュレート
            const originalQuerySelector = document.querySelector;
            document.querySelector = vi.fn().mockImplementation(() => {
                throw new Error('DOM error');
            });

            expect(() => blurEditorAndBody()).not.toThrow();

            // 復元
            document.querySelector = originalQuerySelector;
        });
    });

    describe('defaultTimeoutAdapter', () => {
        it('setTimeoutが使われる', () => {
            // グローバルのsetTimeoutをモック
            const mockSetTimeout = vi.fn().mockReturnValue(1);
            global.setTimeout = mockSetTimeout as any;

            const callback = vi.fn();
            defaultTimeoutAdapter.setTimeout(callback, 1000);

            expect(mockSetTimeout).toHaveBeenCalledWith(callback, 1000);

            // クリーンアップ
            delete (global as any).setTimeout;
        });
    });

    describe('focusEditor', () => {
        beforeEach(() => {
            // グローバルのsetTimeoutを設定
            global.setTimeout = vi.fn().mockImplementation((callback, delay) => {
                // テスト環境では即座に実行
                if (typeof callback === 'function') {
                    callback();
                }
                return 1;
            }) as any;
        });

        afterEach(() => {
            delete (global as any).setTimeout;
        });

        it('指定したエディタ要素に遅延後フォーカスできる', () => {
            const editor = document.createElement('div');
            editor.className = 'tiptap-editor';
            document.body.appendChild(editor);

            const focusSpy = vi.spyOn(editor, 'focus');
            const mockTimeoutAdapter = {
                setTimeout: vi.fn((callback: () => void, delay: number) => {
                    // すぐにコールバックを実行
                    callback();
                    return 1 as any; // 簡単なダミー値を返す
                })
            };

            focusEditor('.tiptap-editor', 100, mockTimeoutAdapter);

            expect(mockTimeoutAdapter.setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('存在しないエディタでも例外にならない', () => {
            const mockTimeoutAdapter = {
                setTimeout: vi.fn((callback: () => void, delay: number) => {
                    callback();
                    return 1 as any;
                })
            };

            expect(() => {
                focusEditor('.non-existent-editor', 100, mockTimeoutAdapter);
            }).not.toThrow();
        });

        it('timeoutAdapter未指定時はデフォルトを使う', () => {
            const spy = vi.spyOn(global, 'setTimeout');

            focusEditor('.tiptap-editor', 100);

            expect(spy).toHaveBeenCalledWith(expect.any(Function), 100);
        });
    });

    describe('domUtilsのモック機能', () => {
        it('domUtilsのメソッドをモックできる', () => {
            const mockQuerySelector = vi.fn().mockReturnValue(null);
            vi.spyOn(domUtils, 'querySelector').mockImplementation(mockQuerySelector);

            domUtils.querySelector('.test');

            expect(mockQuerySelector).toHaveBeenCalledWith('.test');
        });

        it('setBodyStyleもモックできる', () => {
            const mockSetBodyStyle = vi.fn();
            vi.spyOn(domUtils, 'setBodyStyle').mockImplementation(mockSetBodyStyle);

            domUtils.setBodyStyle('overflow', 'hidden');

            expect(mockSetBodyStyle).toHaveBeenCalledWith('overflow', 'hidden');
        });
    });
});