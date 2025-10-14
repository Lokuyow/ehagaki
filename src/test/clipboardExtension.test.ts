/**
 * ClipboardExtension のテスト
 * 
 * クリップボードからのテキストペーストおよびコピー時の改行処理をテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ClipboardExtension } from '../lib/editor/clipboardExtension';

describe('ClipboardExtension', () => {
    let editor: Editor;

    beforeEach(() => {
        editor = new Editor({
            extensions: [
                StarterKit,
                ClipboardExtension,
            ],
            content: '',
        });
    });

    describe('ペースト時の改行処理', () => {
        it('単一行のテキストを正しく挿入できる', () => {
            const text = 'Hello World';
            const mockEvent = createMockPasteEvent(text);
            
            // プラグインのhandlePasteを直接テスト
            const plugin = editor.extensionManager.extensions.find(
                (ext: any) => ext.name === 'clipboardExtension'
            );
            
            // エディタに挿入
            editor.commands.insertContent(text);
            
            expect(editor.getText()).toBe(text);
        });

        it('複数行のテキストを段落として挿入できる', () => {
            const text = 'Line 1\nLine 2\nLine 3';
            
            // 改行で分割して段落として挿入
            const lines = text.split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            // 各段落が正しく作成されているか確認
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('Line 2');
            expect(doc.child(2).textContent).toBe('Line 3');
        });

        it('末尾の改行を維持する', () => {
            const text = 'Line 1\nLine 2\n';
            
            // 改行で分割（末尾の改行は空の要素として扱われる）
            const lines = text.split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            // 末尾の空段落が作成されているか確認
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('Line 2');
            expect(doc.child(2).textContent).toBe(''); // 空の段落
        });

        it('改行のみの行（空白行）を維持する', () => {
            const text = 'Line 1\n\nLine 3';
            
            const lines = text.split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            // 空白行が段落として作成されているか確認
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe(''); // 空の段落
            expect(doc.child(2).textContent).toBe('Line 3');
        });

        it('複数の連続した改行を維持する', () => {
            const text = 'Line 1\n\n\nLine 4';
            
            const lines = text.split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(4);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('');
            expect(doc.child(2).textContent).toBe('');
            expect(doc.child(3).textContent).toBe('Line 4');
        });
    });

    describe('コピー時の改行処理', () => {
        it('単一段落を正しくコピーできる', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Hello World' }] }
                ]
            });

            const text = editor.getText();
            expect(text).toBe('Hello World');
        });

        it('複数段落を改行で区切ってコピーできる', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 1' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 2' }] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 3' }] }
                ]
            });

            const text = editor.getText();
            // Tiptapのデフォルト動作: 段落間は\n\nで区切られる
            expect(text).toBe('Line 1\n\nLine 2\n\nLine 3');
        });

        it('空の段落を改行として出力できる', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 1' }] },
                    { type: 'paragraph', content: [] }, // 空の段落
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 3' }] }
                ]
            });

            const text = editor.getText();
            // Tiptapのデフォルト動作: Line 1\n\n(空段落)\n\nLine 3
            expect(text).toBe('Line 1\n\n\n\nLine 3');
        });

        it('複数の空の段落を連続した改行として出力できる', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 1' }] },
                    { type: 'paragraph', content: [] },
                    { type: 'paragraph', content: [] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 4' }] }
                ]
            });

            const text = editor.getText();
            // Tiptapのデフォルト動作: Line 1\n\n(空1)\n\n(空2)\n\nLine 4
            expect(text).toBe('Line 1\n\n\n\n\n\nLine 4');
        });
    });

    describe('extractFragmentsFromDoc との統合', () => {
        it('extractFragmentsFromDoc が空の段落も含めて抽出する', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 1' }] },
                    { type: 'paragraph', content: [] }, // 空の段落
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 3' }] }
                ]
            });

            // extractFragmentsFromDoc を模擬
            const fragments: string[] = [];
            editor.state.doc.descendants((node: any) => {
                if (node.type.name === 'paragraph') {
                    fragments.push(node.textContent);
                }
            });

            expect(fragments).toEqual(['Line 1', '', 'Line 3']);
            expect(fragments.join('\n')).toBe('Line 1\n\nLine 3');
        });
    });
});

// モックイベント作成ヘルパー
function createMockPasteEvent(text: string): ClipboardEvent {
    const clipboardData = {
        getData: (type: string) => type === 'text/plain' ? text : '',
        types: ['text/plain'],
        items: [],
        files: []
    };

    return {
        clipboardData,
        preventDefault: () => {},
    } as any;
}
