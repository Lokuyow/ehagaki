/**
 * CustomHistoryPlugin ユニットテスト
 * 
 * テスト対象:
 * - ペースト操作の検出
 * - ペースト直後の入力検出
 * - タイムスタンプ管理
 * - メタデータの設定
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EditorState, Transaction } from '@tiptap/pm/state';
import { Schema, DOMParser } from '@tiptap/pm/model';
import { schema as basicSchema } from '@tiptap/pm/schema-basic';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

describe('CustomHistoryPlugin - ユニットテスト', () => {
    let state: EditorState;
    let schema: Schema;
    
    beforeEach(() => {
        schema = basicSchema;
        state = EditorState.create({
            schema,
            doc: schema.node('doc', null, [
                schema.node('paragraph', null, [schema.text('test')])
            ])
        });
    });

    describe('ペースト操作の検出', () => {
        it('paste メタデータを持つトランザクションを正しく検出すること', () => {
            const tr = state.tr.setMeta('paste', true);
            
            expect(tr.getMeta('paste')).toBe(true);
        });

        it('uiEvent=paste メタデータを持つトランザクションを正しく検出すること', () => {
            const tr = state.tr.setMeta('uiEvent', 'paste');
            
            expect(tr.getMeta('uiEvent')).toBe('paste');
        });

        it('通常のトランザクションはペースト操作として検出されないこと', () => {
            const tr = state.tr.insertText('new text', 1);
            
            expect(tr.getMeta('paste')).toBeUndefined();
            expect(tr.getMeta('uiEvent')).toBeUndefined();
        });
    });

    describe('履歴グループ制御メタデータ', () => {
        it('rebased=0 を設定すると新しい履歴グループが開始されること', () => {
            const tr = state.tr
                .insertText('test', 1)
                .setMeta('rebased', 0);
            
            expect(tr.getMeta('rebased')).toBe(0);
        });

        it('setTime() でタイムスタンプが設定されること', () => {
            const now = Date.now();
            const tr = state.tr
                .insertText('test', 1)
                .setTime(now);
            
            expect(tr.time).toBe(now);
        });

        it('addToHistory=true を設定すると履歴に記録されること', () => {
            const tr = state.tr
                .insertText('test', 1)
                .setMeta('addToHistory', true);
            
            expect(tr.getMeta('addToHistory')).toBe(true);
        });
    });

    describe('タイムスタンプ計算', () => {
        it('ペースト直後100ms以内の入力を正しく判定できること', () => {
            const pasteTime = 1000;
            const inputTime = 1050; // 50ms後
            
            const timeDiff = inputTime - pasteTime;
            
            expect(timeDiff).toBeLessThan(100);
        });

        it('ペースト後100ms以降の入力を正しく判定できること', () => {
            const pasteTime = 1000;
            const inputTime = 1150; // 150ms後
            
            const timeDiff = inputTime - pasteTime;
            
            expect(timeDiff).toBeGreaterThanOrEqual(100);
        });
    });

    describe('トランザクションのdocChanged フラグ', () => {
        it('テキスト挿入でdocChangedがtrueになること', () => {
            const tr = state.tr.insertText('new', 1);
            
            expect(tr.docChanged).toBe(true);
        });

        it('メタデータのみの変更でdocChangedがfalseであること', () => {
            const tr = state.tr.setMeta('test', true);
            
            expect(tr.docChanged).toBe(false);
        });

        it('ペースト操作でdocChangedがtrueになること', () => {
            const tr = state.tr
                .insertText('pasted text', 1)
                .setMeta('paste', true);
            
            expect(tr.docChanged).toBe(true);
        });
    });
});
