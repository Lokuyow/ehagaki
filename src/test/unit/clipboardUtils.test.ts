/**
 * clipboardUtils のテスト
 */

import { describe, it, expect } from 'vitest';
import { 
    normalizeClipboardText, 
    serializeParagraphs, 
    visualizeLineBreaks,
    analyzeLineBreaks 
} from '../../lib/utils/clipboardUtils';

describe('clipboardUtils', () => {
    describe('normalizeClipboardText', () => {
        it('LF改行を正しく処理', () => {
            const text = 'Line 1\nLine 2\nLine 3';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
            expect(result.normalized).toBe('Line 1\nLine 2\nLine 3');
        });

        it('CRLF改行を正しく処理', () => {
            const text = 'Line 1\r\nLine 2\r\nLine 3';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
            expect(result.normalized).toBe('Line 1\nLine 2\nLine 3');
        });

        it('CR改行を正しく処理', () => {
            const text = 'Line 1\rLine 2\rLine 3';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
            expect(result.normalized).toBe('Line 1\nLine 2\nLine 3');
        });

        it('混在する改行コードを正しく処理', () => {
            const text = 'Line 1\r\nLine 2\nLine 3\rLine 4';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2', 'Line 3', 'Line 4']);
        });

        it('末尾の改行を削除', () => {
            const text = 'Line 1\nLine 2\n';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2']);
        });

        it('末尾のCRLF改行を削除', () => {
            const text = 'Line 1\r\nLine 2\r\n';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', 'Line 2']);
        });

        it('空行を保持', () => {
            const text = 'Line 1\n\nLine 3';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', '', 'Line 3']);
        });

        it('複数の連続した空行を保持', () => {
            const text = 'Line 1\n\n\nLine 4';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual(['Line 1', '', '', 'Line 4']);
        });

        it('空のテキストを処理', () => {
            const text = '';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual([]);
            expect(result.normalized).toBe('');
        });

        it('改行のみのテキストを処理', () => {
            const text = '\n';
            const result = normalizeClipboardText(text);
            
            expect(result.lines).toEqual([]);
        });
    });

    describe('連続空行の制限オプション', () => {
        it('collapseEmptyLinesオプションで連続空行を1つに集約', () => {
            const text = 'Line 1\n\n\nLine 4';
            const result = normalizeClipboardText(text, {
                collapseEmptyLines: true,
                maxConsecutiveEmptyLines: 1
            });
            
            expect(result.lines).toEqual(['Line 1', '', 'Line 4']);
        });

        it('collapseEmptyLinesオプションで複数の連続空行を制限', () => {
            const text = 'Line 1\n\n\n\n\nLine 6';
            const result = normalizeClipboardText(text, {
                collapseEmptyLines: true,
                maxConsecutiveEmptyLines: 1
            });
            
            expect(result.lines).toEqual(['Line 1', '', 'Line 6']);
        });

        it('maxConsecutiveEmptyLines=2で空行2つまで許可', () => {
            const text = 'Line 1\n\n\n\nLine 5';
            const result = normalizeClipboardText(text, {
                collapseEmptyLines: true,
                maxConsecutiveEmptyLines: 2
            });
            
            expect(result.lines).toEqual(['Line 1', '', '', 'Line 5']);
        });

        it('collapseEmptyLines=falseの場合は制限しない', () => {
            const text = 'Line 1\n\n\nLine 4';
            const result = normalizeClipboardText(text, {
                collapseEmptyLines: false
            });
            
            expect(result.lines).toEqual(['Line 1', '', '', 'Line 4']);
        });

        it('複数箇所の連続空行を一括処理', () => {
            const text = 'Line 1\n\n\nLine 4\n\n\n\nLine 8';
            const result = normalizeClipboardText(text, {
                collapseEmptyLines: true,
                maxConsecutiveEmptyLines: 1
            });
            
            expect(result.lines).toEqual(['Line 1', '', 'Line 4', '', 'Line 8']);
        });
    });

    describe('serializeParagraphs', () => {
        it('段落を改行で区切る', () => {
            const paragraphs = ['Line 1', 'Line 2', 'Line 3'];
            const result = serializeParagraphs(paragraphs);
            
            expect(result).toBe('Line 1\nLine 2\nLine 3');
        });

        it('空の段落を保持', () => {
            const paragraphs = ['Line 1', '', 'Line 3'];
            const result = serializeParagraphs(paragraphs);
            
            expect(result).toBe('Line 1\n\nLine 3');
        });

        it('空の配列を処理', () => {
            const paragraphs: string[] = [];
            const result = serializeParagraphs(paragraphs);
            
            expect(result).toBe('');
        });
    });

    describe('visualizeLineBreaks', () => {
        it('CRLF改行を可視化', () => {
            const text = 'Line 1\r\nLine 2';
            const result = visualizeLineBreaks(text);
            
            expect(result).toBe('Line 1[CRLF]Line 2');
        });

        it('LF改行を可視化', () => {
            const text = 'Line 1\nLine 2';
            const result = visualizeLineBreaks(text);
            
            expect(result).toBe('Line 1[LF]Line 2');
        });

        it('CR改行を可視化', () => {
            const text = 'Line 1\rLine 2';
            const result = visualizeLineBreaks(text);
            
            expect(result).toBe('Line 1[CR]Line 2');
        });

        it('混在する改行を可視化', () => {
            const text = 'Line 1\r\nLine 2\nLine 3\rLine 4';
            const result = visualizeLineBreaks(text);
            
            expect(result).toBe('Line 1[CRLF]Line 2[LF]Line 3[CR]Line 4');
        });
    });

    describe('analyzeLineBreaks', () => {
        it('CRLF改行を分析', () => {
            const text = 'Line 1\r\nLine 2\r\nLine 3';
            const result = analyzeLineBreaks(text);
            
            expect(result.crlfCount).toBe(2);
            expect(result.lfCount).toBe(0);
            expect(result.crCount).toBe(0);
            expect(result.totalLines).toBe(3);
            expect(result.hasTrailingNewline).toBe(false);
        });

        it('LF改行を分析', () => {
            const text = 'Line 1\nLine 2\nLine 3';
            const result = analyzeLineBreaks(text);
            
            expect(result.crlfCount).toBe(0);
            expect(result.lfCount).toBe(2);
            expect(result.crCount).toBe(0);
            expect(result.totalLines).toBe(3);
        });

        it('末尾の改行を検出', () => {
            const text = 'Line 1\nLine 2\n';
            const result = analyzeLineBreaks(text);
            
            expect(result.hasTrailingNewline).toBe(true);
            expect(result.totalLines).toBe(2);
        });

        it('空のテキストを分析', () => {
            const text = '';
            const result = analyzeLineBreaks(text);
            
            expect(result.totalLines).toBe(1);
            expect(result.hasTrailingNewline).toBe(false);
        });
    });

    describe('実際のユースケース', () => {
        it('メモ帳のテキスト（CRLF、末尾改行あり）', () => {
            const notepadText = '今日の予定\r\n\r\n1. 朝食\r\n2. 散歩\r\n';
            const result = normalizeClipboardText(notepadText);
            
            expect(result.lines).toEqual(['今日の予定', '', '1. 朝食', '2. 散歩']);
        });

        it('Twitterのテキスト（LF、末尾改行なし）', () => {
            const tweetText = 'これは素晴らしい投稿です!\n\n#素晴らしい #投稿';
            const result = normalizeClipboardText(tweetText);
            
            expect(result.lines).toEqual(['これは素晴らしい投稿です!', '', '#素晴らしい #投稿']);
        });

        it('VS Codeからのコピー（LF、末尾改行あり）', () => {
            const vscodeText = 'const x = 1;\nconst y = 2;\n';
            const result = normalizeClipboardText(vscodeText);
            
            expect(result.lines).toEqual(['const x = 1;', 'const y = 2;']);
        });
    });
});
