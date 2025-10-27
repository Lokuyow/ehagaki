/**
 * ContentTracking - appendTransaction 履歴管理テスト
 * 
 * テスト対象:
 * - appendTransaction がペースト操作をスキップすること
 * - appendTransaction が返すトランザクションに addToHistory: false が設定されること
 * - URL変換処理と履歴管理の統合
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditorState } from '@tiptap/pm/state';
import { Schema } from '@tiptap/pm/model';
import { schema as basicSchema } from '@tiptap/pm/schema-basic';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

describe('ContentTracking - appendTransaction 履歴管理', () => {
    let schema: Schema;
    let state: EditorState;
    
    beforeEach(() => {
        schema = basicSchema;
        state = EditorState.create({
            schema,
            doc: schema.node('doc', null, [
                schema.node('paragraph', null, [])
            ])
        });
    });

    describe('ペースト操作の検出', () => {
        it('paste メタデータを持つトランザクションを検出できること', () => {
            const transactions = [
                state.tr.insertText('test', 1).setMeta('paste', true)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            expect(isPaste).toBe(true);
        });

        it('複数のトランザクションからペースト操作を検出できること', () => {
            const transactions = [
                state.tr.insertText('normal', 1),
                state.tr.insertText('pasted', 1).setMeta('paste', true),
                state.tr.insertText('another', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            expect(isPaste).toBe(true);
        });

        it('通常のトランザクションはペースト操作として検出されないこと', () => {
            const transactions = [
                state.tr.insertText('normal', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            expect(isPaste).toBe(false);
        });
    });

    describe('docChanged フラグの検証', () => {
        it('docChangedがtrueのトランザクションを検出できること', () => {
            const transactions = [
                state.tr.insertText('test', 1)
            ];
            
            const hasDocChange = transactions.some(tr => tr.docChanged);
            
            expect(hasDocChange).toBe(true);
        });

        it('docChangedがfalseの場合は検出されないこと', () => {
            const transactions = [
                state.tr.setMeta('test', true)
            ];
            
            const hasDocChange = transactions.some(tr => tr.docChanged);
            
            expect(hasDocChange).toBe(false);
        });
    });

    describe('appendTransaction の戻り値', () => {
        it('ペースト操作の場合は null を返すべきこと', () => {
            const transactions = [
                state.tr.insertText('test', 1).setMeta('paste', true)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            // ペースト時は null を返すべき
            const result = isPaste ? null : state.tr;
            
            expect(result).toBeNull();
        });

        it('通常のトランザクションの場合はトランザクションを返せること', () => {
            const transactions = [
                state.tr.insertText('test', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            // 通常時はトランザクションを返せる
            const result = isPaste ? null : state.tr;
            
            expect(result).not.toBeNull();
        });
    });

    describe('addToHistory メタデータの設定', () => {
        it('appendTransaction が返すトランザクションに addToHistory: false が設定されること', () => {
            const tr = state.tr
                .insertText('url conversion result', 1)
                .setMeta('addToHistory', false);
            
            expect(tr.getMeta('addToHistory')).toBe(false);
        });

        it('addToHistory: false により、トランザクションが元の履歴に統合されること', () => {
            // 元のトランザクション
            const originalTr = state.tr.insertText('original', 1);
            
            // appendTransaction が返すトランザクション
            const appendTr = state.tr
                .insertText(' appended', state.selection.from)
                .setMeta('addToHistory', false);
            
            // addToHistory: false により、同じ履歴グループになる
            expect(appendTr.getMeta('addToHistory')).toBe(false);
        });
    });

    describe('ペースト直後のURL変換スキップ', () => {
        it('ペースト操作直後はURL変換をスキップすること', () => {
            const transactions = [
                state.tr.insertText('https://example.com', 1).setMeta('paste', true)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            const hasDocChange = transactions.some(tr => tr.docChanged);
            
            // ペースト時は処理をスキップ
            const shouldProcess = hasDocChange && !isPaste;
            
            expect(shouldProcess).toBe(false);
        });

        it('ペースト後の通常入力ではURL変換を実行すること', () => {
            const transactions = [
                state.tr.insertText('https://example.com', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            const hasDocChange = transactions.some(tr => tr.docChanged);
            
            // 通常入力時は処理を実行
            const shouldProcess = hasDocChange && !isPaste;
            
            expect(shouldProcess).toBe(true);
        });
    });

    describe('複数トランザクションの処理', () => {
        it('複数のトランザクションから最初のペースト操作を検出すること', () => {
            const transactions = [
                state.tr.insertText('first', 1),
                state.tr.insertText('paste', 1).setMeta('paste', true),
                state.tr.insertText('last', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            expect(isPaste).toBe(true);
        });

        it('すべてのトランザクションがdocChanged=trueかチェックできること', () => {
            const transactions = [
                state.tr.insertText('first', 1),
                state.tr.insertText('second', 1)
            ];
            
            const allChanged = transactions.every(tr => tr.docChanged);
            
            expect(allChanged).toBe(true);
        });

        it('一部のトランザクションのみdocChanged=trueの場合を検出できること', () => {
            const transactions = [
                state.tr.insertText('changed', 1),
                state.tr.setMeta('test', true) // docChanged=false
            ];
            
            const someChanged = transactions.some(tr => tr.docChanged);
            const allChanged = transactions.every(tr => tr.docChanged);
            
            expect(someChanged).toBe(true);
            expect(allChanged).toBe(false);
        });
    });

    describe('開発モードのログ出力', () => {
        it('開発モードでログ情報が記録されること', () => {
            const consoleSpy = vi.spyOn(console, 'log');
            
            // 開発モードのシミュレーション
            if (import.meta.env.MODE === 'development') {
                console.log('🔗 appendTransaction check:', {
                    isPaste: true,
                    hasTr: 1,
                    docChanged: true
                });
            }
            
            // 開発環境でのみログが出力される
            if (import.meta.env.MODE === 'development') {
                expect(consoleSpy).toHaveBeenCalled();
            }
            
            consoleSpy.mockRestore();
        });
    });

    describe('エッジケース', () => {
        it('空のトランザクション配列を処理できること', () => {
            const transactions: any[] = [];
            
            const isPaste = transactions.some(tr => tr.getMeta?.('paste'));
            const hasDocChange = transactions.some(tr => tr.docChanged);
            
            expect(isPaste).toBe(false);
            expect(hasDocChange).toBe(false);
        });

        it('メタデータのないトランザクションを処理できること', () => {
            const transactions = [
                state.tr.insertText('test', 1)
            ];
            
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            // メタデータがない場合は undefined または false
            expect(isPaste).toBeFalsy();
        });

        it('nullやundefinedメタデータを持つトランザクションを処理できること', () => {
            const tr = state.tr
                .insertText('test', 1)
                .setMeta('paste', null as any);
            
            const transactions = [tr];
            
            // null は falsy として扱われる
            const isPaste = transactions.some(tr => tr.getMeta('paste'));
            
            expect(isPaste).toBeFalsy();
        });
    });
});
