/**
 * Twitter/X.comからのペーストに関する統合テスト
 */

import { describe, it, expect } from 'vitest';
import { normalizeClipboardText } from '../../lib/utils/clipboardUtils';
import { normalizeLineBreaks } from '../../lib/utils/editorUtils';

describe('Twitter/X.com ペースト処理', () => {
    describe('Twitterからの実際のテキストパターン', () => {
        it('空行が1つあるツイートを正しく処理', () => {
            // Twitterでは通常LF(\n)を使用
            const twitterText = '1行目のテキスト\n\n3行目のテキスト';

            const result = normalizeClipboardText(twitterText);

            // 期待: 3行（1行目、空行、3行目）
            expect(result.lines).toEqual([
                '1行目のテキスト',
                '',
                '3行目のテキスト'
            ]);
            expect(result.lines.length).toBe(3);
        });

        it('複数の空行があるツイートを正しく処理', () => {
            const twitterText = 'Line 1\n\n\nLine 4';

            const result = normalizeClipboardText(twitterText);

            expect(result.lines).toEqual([
                'Line 1',
                '',
                '',
                'Line 4'
            ]);
            expect(result.lines.length).toBe(4);
        });

        it('末尾に改行があるツイートを正しく処理', () => {
            const twitterText = 'Tweet content\n\nHashtags\n';

            const result = normalizeClipboardText(twitterText);

            // 末尾の改行は削除される
            expect(result.lines).toEqual([
                'Tweet content',
                '',
                'Hashtags'
            ]);
            expect(result.lines.length).toBe(3);
        });

        it('絵文字を含むツイートを正しく処理', () => {
            const twitterText = '素晴らしい投稿です！ 🎉\n\n#素晴らしい #投稿';

            const result = normalizeClipboardText(twitterText);

            expect(result.lines).toEqual([
                '素晴らしい投稿です！ 🎉',
                '',
                '#素晴らしい #投稿'
            ]);
        });

        it('引用ツイートのようなフォーマットを正しく処理', () => {
            const twitterText = '私のコメント\n\n> 元のツイート\n> 2行目';

            const result = normalizeClipboardText(twitterText);

            expect(result.lines).toEqual([
                '私のコメント',
                '',
                '> 元のツイート',
                '> 2行目'
            ]);
        });
    });

    describe('問題のあるパターン', () => {
        it('余分な改行が含まれるケース', () => {
            // 問題: Twitterから「Line 1\n\nLine 3」をコピーした際、
            // 実際には「Line 1\n\n\nLine 3」のようになっている可能性
            const problematicText = 'Line 1\n\n\nLine 3';

            const result = normalizeClipboardText(problematicText);

            // 空行が2つになってしまう
            expect(result.lines.length).toBe(4);
            expect(result.lines).toEqual([
                'Line 1',
                '',
                '',
                'Line 3'
            ]);
        });

        it('HTMLから抽出されたテキストの余分な空白', () => {
            // HTMLから抽出されたテキストには余分な空白や改行が含まれることがある
            const htmlExtractedText = 'Line 1  \n\n  Line 3';

            const result = normalizeClipboardText(htmlExtractedText);

            // 行末の空白はそのまま保持される（normalizeClipboardTextはtrimしない）
            expect(result.lines).toEqual([
                'Line 1  ',
                '',
                '  Line 3'
            ]);
        });
    });

    describe('修正案: 連続した空行の削減', () => {
        it('連続した空行を1つに集約', () => {
            const text = 'Line 1\n\n\nLine 3';

            // 連続した空行を1つに削減する処理
            const normalized = normalizeLineBreaks(text);
            const collapsedEmptyLines = normalized.replace(/\n\n+/g, '\n\n'); // 連続する\nを最大2つに
            let lines = collapsedEmptyLines.split('\n');

            if (lines.length > 0 && lines[lines.length - 1] === '') {
                lines = lines.slice(0, -1);
            }

            expect(lines).toEqual([
                'Line 1',
                '',
                'Line 3'
            ]);
        });
    });

    describe('実際のTwitterコンテンツ例', () => {
        it('標準的なツイート', () => {
            const tweet = 'これは素晴らしい投稿です！\n\n#素晴らしい #投稿 #Twitter';

            const result = normalizeClipboardText(tweet);

            expect(result.lines.length).toBe(3);
        });

        it('スレッド形式のツイート', () => {
            const thread = '1/3\nスレッドの始まり\n\nこれは重要な情報です';

            const result = normalizeClipboardText(thread);

            expect(result.lines).toEqual([
                '1/3',
                'スレッドの始まり',
                '',
                'これは重要な情報です'
            ]);
        });

        it('URLを含むツイート', () => {
            const tweetWithUrl = 'チェックしてください！\n\nhttps://example.com\n\n#リンク';

            const result = normalizeClipboardText(tweetWithUrl);

            expect(result.lines).toEqual([
                'チェックしてください！',
                '',
                'https://example.com',
                '',
                '#リンク'
            ]);
        });
    });
});
