/**
 * AndroidCompositionFix Extension
 * 
 * ProseMirrorはAndroidで5秒間compositionイベントがないと、
 * 自動的にcompositionを終了させる仕様があります。
 * (prosemirror-view/src/input.ts の timeoutComposition = 5000)
 * 
 * この拡張は、composition中に定期的にcompositionupdateイベントを
 * シミュレートして、タイマーをリセットし続けることで、
 * 日本語入力中の自動確定を防ぎます。
 */

import { Extension } from '@tiptap/core';

// Androidデバイスかどうかを判定
const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

// キープアライブの間隔（ProseMirrorのタイムアウトより短く設定）
const KEEPALIVE_INTERVAL = 4000; // 4秒

export const AndroidCompositionFix = Extension.create({
    name: 'androidCompositionFix',

    addStorage() {
        return {
            keepAliveInterval: null as ReturnType<typeof setInterval> | null,
            isComposing: false,
        };
    },

    onCreate() {
        // Android以外では何もしない
        if (!isAndroid) return;

        const editor = this.editor;
        const storage = this.storage;

        const handleCompositionStart = () => {
            storage.isComposing = true;

            // 既存のインターバルをクリア
            if (storage.keepAliveInterval) {
                clearInterval(storage.keepAliveInterval);
            }

            // キープアライブインターバルを開始
            // 定期的にcompositionupdateイベントを発火させてProseMirrorのタイマーをリセット
            storage.keepAliveInterval = setInterval(() => {
                if (storage.isComposing && editor.view.composing) {
                    // compositionupdateイベントをシミュレート
                    // これによりProseMirrorの5秒タイマーがリセットされる
                    const event = new CompositionEvent('compositionupdate', {
                        bubbles: true,
                        cancelable: true,
                        data: '', // データは空でOK、イベント自体がタイマーリセットのトリガー
                    });
                    editor.view.dom.dispatchEvent(event);
                }
            }, KEEPALIVE_INTERVAL);
        };

        const handleCompositionEnd = () => {
            storage.isComposing = false;

            // インターバルをクリア
            if (storage.keepAliveInterval) {
                clearInterval(storage.keepAliveInterval);
                storage.keepAliveInterval = null;
            }
        };

        // イベントリスナーを登録
        editor.view.dom.addEventListener('compositionstart', handleCompositionStart);
        editor.view.dom.addEventListener('compositionend', handleCompositionEnd);

        // クリーンアップ用に参照を保存
        (this as any).__compositionStartHandler = handleCompositionStart;
        (this as any).__compositionEndHandler = handleCompositionEnd;
    },

    onDestroy() {
        // Android以外では何もしない
        if (!isAndroid) return;

        const storage = this.storage;

        // インターバルをクリア
        if (storage.keepAliveInterval) {
            clearInterval(storage.keepAliveInterval);
            storage.keepAliveInterval = null;
        }

        // イベントリスナーを削除
        const startHandler = (this as any).__compositionStartHandler;
        const endHandler = (this as any).__compositionEndHandler;

        if (this.editor?.view?.dom) {
            if (startHandler) {
                this.editor.view.dom.removeEventListener('compositionstart', startHandler);
            }
            if (endHandler) {
                this.editor.view.dom.removeEventListener('compositionend', endHandler);
            }
        }
    },
});
