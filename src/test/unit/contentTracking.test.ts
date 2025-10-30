import { describe, it, expect } from 'vitest';
import { CONTENT_TRACKING_CONFIG } from '../../lib/constants';

/**
 * ContentTracking Extension 単体テスト
 * 
 * 注意: 通常のURL検証機能はTiptap v3のLink拡張に移譲されました。
 * このテストは画像URL検出とその他のContentTracking固有の機能のみをテストします。
 */
describe('ContentTracking 定数', () => {
    describe('URL正規表現（画像URL検出用）', () => {
        it('HTTP/HTTPS URLを正しく検出すること', () => {
            const text = 'Check out https://example.com/image.png and http://test.org/photo.jpg!';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(2);
            expect(matches[0][0]).toBe('https://example.com/image.png');
            expect(matches[1][0]).toBe('http://test.org/photo.jpg!');
        });

        it('日本語全角スペースで区切られたURLを検出すること', () => {
            const text = 'URLは　https://example.com/image.png　です';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toBe('https://example.com/image.png');
        });

        it('複数行のテキストからURLを検出すること', () => {
            const text = `First line: https://first.com/a.png
Second line: https://second.com/b.jpg
Third line: https://third.com/c.webp`;
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(3);
        });

        it('URLでないテキストは検出しないこと', () => {
            const text = 'This is just text without URLs';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(0);
        });

        it('不完全なURLパターンを検出すること', () => {
            const text = 'Visit https://example';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toBe('https://example');
        });
    });

    describe('DEBOUNCE_DELAY', () => {
        it('デフォルト値が300msであること', () => {
            expect(CONTENT_TRACKING_CONFIG.DEBOUNCE_DELAY).toBe(300);
        });
    });

    describe('機能フラグ', () => {
        it('すべての機能がデフォルトで有効であること', () => {
            expect(CONTENT_TRACKING_CONFIG.ENABLE_HASHTAGS).toBe(true);
            expect(CONTENT_TRACKING_CONFIG.ENABLE_AUTO_LINK).toBe(true); // 互換性のため保持
            expect(CONTENT_TRACKING_CONFIG.ENABLE_IMAGE_CONVERSION).toBe(true);
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

    describe('CSSクラス名', () => {
        it('ハッシュタグクラスが定義されていること', () => {
            expect(CONTENT_TRACKING_CONFIG.HASHTAG_CLASS).toBe('hashtag');
        });
    });
});

describe('ContentTracking 画像URL検出', () => {
    describe('エッジケース', () => {
        it('URLの末尾に句読点がある場合を処理できること', () => {
            const text = 'Check https://example.com/a.png, https://test.org/b.jpg! and https://demo.net/c.webp.';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(3);
            // 実際のcleanUrlEnd関数で処理されることを想定
        });

        it('連続するURLを検出できること', () => {
            const text = 'https://first.com/a.png https://second.com/b.jpg';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(2);
        });

        it('URLにクエリパラメータが含まれる場合', () => {
            const text = 'https://example.com/image.png?param=value&other=123';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toContain('?param=value');
        });

        it('URLにハッシュフラグメントが含まれる場合', () => {
            const text = 'https://example.com/photo.jpg#section';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));

            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toContain('#section');
        });
    });
});
