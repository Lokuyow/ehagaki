import { describe, it, expect } from 'vitest';
import { CONTENT_TRACKING_CONFIG } from '../../lib/constants';
import { scanHttpUrlCandidates } from '../../lib/utils/httpUrlCandidates';

/**
 * ContentTracking Extension 単体テスト
 * 
 * URL正規表現の動作検証とプラグインキーの一意性を検証します。
 * 定数値の完全一致テストは定数変更時に壊れるだけなので省略。
 */
describe('ContentTracking 定数', () => {
    describe('URL正規表現（画像URL検出用）', () => {
        it('HTTP/HTTPS URLを正しく検出すること', () => {
            const text = 'Check out https://example.com/image.png and http://test.org/photo.jpg!';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(2);
            expect(matches[0].displayText).toBe('https://example.com/image.png');
            expect(matches[1].displayText).toBe('http://test.org/photo.jpg');
        });

        it('日本語全角スペースで区切られたURLを検出すること', () => {
            const text = 'URLは　https://example.com/image.png　です';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(1);
            expect(matches[0].displayText).toBe('https://example.com/image.png');
        });

        it('複数行のテキストからURLを検出すること', () => {
            const text = `First line: https://first.com/a.png
Second line: https://second.com/b.jpg
Third line: https://third.com/c.webp`;
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(3);
        });

        it('URLでないテキストは検出しないこと', () => {
            const text = 'This is just text without URLs';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(0);
        });

        it('不完全なURLパターンを検出すること', () => {
            const text = 'Visit https://example';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(1);
            expect(matches[0].displayText).toBe('https://example');
            expect(matches[0].isValidHttpUrl).toBe(true);
        });
    });

    describe('プラグインキー', () => {
        it('一意なプラグインキーが定義されていること', () => {
            const keys = Object.values(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS);
            const uniqueKeys = new Set(keys);

            expect(keys.length).toBe(uniqueKeys.size);
        });

        it('必要なプラグインキーがすべて定義されていること', () => {
            expect(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.HASHTAG_DECORATION).toBeDefined();
            expect(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.LINK_AND_IMAGE_CONVERSION).toBeDefined();
            expect(CONTENT_TRACKING_CONFIG.PLUGIN_KEYS.CONTENT_UPDATE_TRACKER).toBeDefined();
        });
    });
});

describe('ContentTracking 画像URL検出', () => {
    describe('エッジケース', () => {
        it('URLの末尾に句読点がある場合を処理できること', () => {
            const text = 'Check https://example.com/a.png, https://test.org/b.jpg! and https://demo.net/c.webp.';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(3);
            // 実際のcleanUrlEnd関数で処理されることを想定
        });

        it('連続するURLを検出できること', () => {
            const text = 'https://first.com/a.png https://second.com/b.jpg';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(2);
        });

        it('URLにクエリパラメータが含まれる場合', () => {
            const text = 'https://example.com/image.png?param=value&other=123';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(1);
            expect(matches[0].displayText).toContain('?param=value');
        });

        it('URLにハッシュフラグメントが含まれる場合', () => {
            const text = 'https://example.com/photo.jpg#section';
            const matches = scanHttpUrlCandidates(text);

            expect(matches).toHaveLength(1);
            expect(matches[0].displayText).toContain('#section');
        });

        it.each([
            "https://example.com/foo'bar",
            'https://example.com/記事。続き',
            'https://example.com/path?q=値。続き',
            'https://example.com/path#場所。詳細',
        ])('URL内部の文字で候補を途中切断しないこと: %s', (url) => {
            const [candidate] = scanHttpUrlCandidates(`before ${url} after`);

            expect(candidate.displayText).toBe(url);
            expect(candidate.end - candidate.start).toBe(url.length);
        });
    });
});
