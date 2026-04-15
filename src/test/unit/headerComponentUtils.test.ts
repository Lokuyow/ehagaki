import { describe, expect, it } from 'vitest';
import { resolveCompactMessageText } from '../../lib/utils/headerComponentUtils';

describe('resolveCompactMessageText', () => {
    it('compact success では専用ラベルを返す', () => {
        const result = resolveCompactMessageText(
            {
                type: 'success',
                message: '投稿した',
            },
            '投稿完了',
        );

        expect(result).toBe('投稿完了');
    });

    it('success 以外は元のメッセージを返す', () => {
        const result = resolveCompactMessageText(
            {
                type: 'error',
                message: 'ネットワークエラー',
            },
            '投稿完了',
        );

        expect(result).toBe('ネットワークエラー');
    });

    it('compact message がないときは空文字を返す', () => {
        expect(resolveCompactMessageText(null, '投稿完了')).toBe('');
    });
});