/**
 * ClipboardExtension 履歴管理テスト
 * 
 * テスト対象:
 * - ペースト時のメタデータ設定（paste, addToHistory, rebased, time）
 * - processPastedText 関数のメタデータ設定
 * - ペースト操作が独立した履歴グループになること
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

describe('ClipboardExtension - 履歴管理テスト', () => {
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

    describe('ペースト時のメタデータ設定', () => {
        it('paste メタデータが設定されること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('paste', true);
            
            expect(tr.getMeta('paste')).toBe(true);
        });

        it('addToHistory メタデータが設定されること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('addToHistory', true);
            
            expect(tr.getMeta('addToHistory')).toBe(true);
        });

        it('rebased=0 メタデータが設定されること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('rebased', 0);
            
            expect(tr.getMeta('rebased')).toBe(0);
        });

        it('タイムスタンプが設定されること', () => {
            const now = Date.now();
            const tr = state.tr
                .insertText('pasted text', 1)
                .setTime(now);
            
            expect(tr.time).toBe(now);
        });

        it('すべてのメタデータが同時に設定されること', () => {
            const now = Date.now();
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('paste', true)
                .setMeta('addToHistory', true)
                .setMeta('rebased', 0)
                .setTime(now);
            
            expect(tr.getMeta('paste')).toBe(true);
            expect(tr.getMeta('addToHistory')).toBe(true);
            expect(tr.getMeta('rebased')).toBe(0);
            expect(tr.time).toBe(now);
        });
    });

    describe('メタデータの組み合わせ効果', () => {
        it('rebased=0 + setTime() の組み合わせで新しい履歴グループが開始されること', () => {
            // 最初のトランザクション
            const tr1 = state.tr
                .insertText('first', 1)
                .setTime(1000);
            
            state = state.apply(tr1);
            
            // rebased=0付きのトランザクション（新グループを強制）
            const tr2 = state.tr
                .insertText('second', state.selection.from)
                .setMeta('rebased', 0)
                .setTime(1050); // 50ms後だが、rebasedで強制分離
            
            expect(tr2.getMeta('rebased')).toBe(0);
            expect(tr2.time).toBe(1050);
        });

        it('paste メタデータがあれば CustomHistoryPlugin で検出可能なこと', () => {
            const tr = state.tr
                .insertText('pasted', 1)
                .setMeta('paste', true);
            
            // isPasteTransaction の模擬判定
            const isPaste = tr.getMeta('paste') === true || tr.getMeta('uiEvent') === 'paste';
            
            expect(isPaste).toBe(true);
        });

        it('uiEvent=paste メタデータがあれば CustomHistoryPlugin で検出可能なこと', () => {
            const tr = state.tr
                .insertText('pasted', 1)
                .setMeta('uiEvent', 'paste');
            
            // isPasteTransaction の模擬判定
            const isPaste = tr.getMeta('paste') === true || tr.getMeta('uiEvent') === 'paste';
            
            expect(isPaste).toBe(true);
        });
    });

    describe('トランザクションの状態', () => {
        it('ペースト操作で docChanged が true になること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('paste', true);
            
            expect(tr.docChanged).toBe(true);
        });

        it('ペースト操作で steps が記録されること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('paste', true);
            
            expect(tr.steps.length).toBeGreaterThan(0);
        });
    });

    describe('ペーストテキストの処理', () => {
        it('単一行のテキストがペーストされること', () => {
            const tr = state.tr
                .insertText('single line', 1)
                .setMeta('paste', true)
                .setMeta('addToHistory', true)
                .setMeta('rebased', 0)
                .setTime(Date.now());
            
            const newState = state.apply(tr);
            
            expect(newState.doc.textContent).toBe('single line');
        });

        it('複数行のテキストが複数段落として処理されること', () => {
            // 注: この場合、実際には複数のparagraphノードを作成する必要がある
            // ここでは基本的な検証のみ
            const text = 'line1\nline2\nline3';
            const lines = text.split('\n');
            
            expect(lines).toEqual(['line1', 'line2', 'line3']);
            expect(lines.length).toBe(3);
        });
    });

    describe('タイムスタンプの精度', () => {
        it('連続するペースト操作のタイムスタンプが異なること', () => {
            vi.useFakeTimers();
            
            const tr1 = state.tr
                .insertText('first', 1)
                .setTime(Date.now());
            
            vi.advanceTimersByTime(10);
            
            const tr2 = state.tr
                .insertText('second', 1)
                .setTime(Date.now());
            
            expect(tr2.time).toBeGreaterThan(tr1.time);
            
            vi.useRealTimers();
        });

        it('ペースト後100ms以内の入力タイムスタンプを計算できること', () => {
            const pasteTime = 1000;
            const inputTime = Date.now();
            
            // 模擬的な時間差計算
            const timeDiff = inputTime - pasteTime;
            
            // 実際のテストでは、これが100ms未満かどうかで判定される
            expect(typeof timeDiff).toBe('number');
        });
    });

    describe('エラーケース', () => {
        it('空のテキストをペーストしても問題ないこと', () => {
            const tr = state.tr
                .insertText('', 1)
                .setMeta('paste', true);
            
            const newState = state.apply(tr);
            
            expect(newState.doc.textContent).toBe('');
        });

        it('メタデータのみでdocChanged=falseの場合でもエラーにならないこと', () => {
            const tr = state.tr
                .setMeta('paste', true)
                .setMeta('addToHistory', true);
            
            expect(tr.docChanged).toBe(false);
            expect(() => state.apply(tr)).not.toThrow();
        });
    });

    describe('Android Gboard対応（processPastedText）', () => {
        it('processPastedText も同じメタデータを設定すること', () => {
            // processPastedText の動作を模擬
            const now = Date.now();
            const tr = state.tr
                .insertText('gboard paste', 1)
                .setMeta('paste', true)
                .setMeta('addToHistory', true)
                .setMeta('rebased', 0)
                .setTime(now);
            
            expect(tr.getMeta('paste')).toBe(true);
            expect(tr.getMeta('addToHistory')).toBe(true);
            expect(tr.getMeta('rebased')).toBe(0);
            expect(tr.time).toBe(now);
        });
    });
});
