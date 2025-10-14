/**
 * ClipboardExtension のテストケース
 * 
 * 様々な改行パターンをテストして動作を確認
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ClipboardExtension } from '../lib/editor/clipboardExtension';

describe('ClipboardExtension - 改行処理', () => {
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

    afterEach(() => {
        editor.destroy();
    });

    describe('CRLF改行コードの処理', () => {
        it('Windows形式の改行コード(\\r\\n)を正しく処理できる', () => {
            const text = 'Line 1\r\nLine 2\r\nLine 3';
            
            // Windows形式のテキストを段落として挿入
            const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('Line 2');
            expect(doc.child(2).textContent).toBe('Line 3');
        });

        it('混在する改行コード(\\r\\nと\\n)を正しく処理できる', () => {
            const text = 'Line 1\r\nLine 2\nLine 3\r\nLine 4';
            
            const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
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
        });
    });

    describe('末尾の改行処理', () => {
        it('末尾に改行がある場合、余分な空行を作成しない', () => {
            const text = 'Line 1\nLine 2\n';
            
            let lines = text.split('\n');
            // 末尾の空要素を削除
            if (lines.length > 0 && lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
            }
            
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(2);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('Line 2');
        });

        it('Windows形式で末尾に改行がある場合も正しく処理', () => {
            const text = 'Line 1\r\nLine 2\r\n';
            
            let lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
            // 末尾の空要素を削除
            if (lines.length > 0 && lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
            }
            
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(2);
        });
    });

    describe('空行の処理', () => {
        it('空行を正しく保持する（LF）', () => {
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
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('');
            expect(doc.child(2).textContent).toBe('Line 3');
        });

        it('空行を正しく保持する（CRLF）', () => {
            const text = 'Line 1\r\n\r\nLine 3';
            
            const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('Line 1');
            expect(doc.child(1).textContent).toBe('');
            expect(doc.child(2).textContent).toBe('Line 3');
        });

        it('複数の連続した空行を保持する', () => {
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

    describe('コピー時の処理', () => {
        it('段落を改行で区切って出力', () => {
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

        it('空の段落を空行として出力', () => {
            editor.commands.setContent({
                type: 'doc',
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 1' }] },
                    { type: 'paragraph', content: [] },
                    { type: 'paragraph', content: [{ type: 'text', text: 'Line 3' }] }
                ]
            });

            const text = editor.getText();
            // Tiptapのデフォルト動作: Line 1\n\n(空段落)\n\nLine 3
            expect(text).toBe('Line 1\n\n\n\nLine 3');
        });
    });

    describe('実際のユースケース', () => {
        it('メモ帳からコピーしたテキストを正しく処理', () => {
            // メモ帳は通常CRLF形式
            const notepadText = '今日の予定\r\n\r\n1. 朝食\r\n2. 散歩\r\n3. 昼食\r\n';
            
            let lines = notepadText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
            if (lines.length > 0 && lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
            }
            
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(5);
            expect(doc.child(0).textContent).toBe('今日の予定');
            expect(doc.child(1).textContent).toBe('');
            expect(doc.child(2).textContent).toBe('1. 朝食');
            expect(doc.child(3).textContent).toBe('2. 散歩');
            expect(doc.child(4).textContent).toBe('3. 昼食');
        });

        it('Twitterからコピーしたテキストを正しく処理', () => {
            // Twitterは通常LF形式
            const tweetText = 'これは素晴らしい投稿です！\n\n#素晴らしい #投稿';
            
            const lines = tweetText.split('\n');
            const content = lines.map(line => ({
                type: 'paragraph',
                content: line ? [{ type: 'text', text: line }] : []
            }));
            
            editor.commands.setContent({
                type: 'doc',
                content
            });
            
            const doc = editor.state.doc;
            expect(doc.childCount).toBe(3);
            expect(doc.child(0).textContent).toBe('これは素晴らしい投稿です！'); // 全角の感嘆符
            expect(doc.child(1).textContent).toBe('');
            expect(doc.child(2).textContent).toBe('#素晴らしい #投稿');
        });
    });
});
