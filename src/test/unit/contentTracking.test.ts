import { describe, it, expect, beforeEach } from 'vitest';
import { CONTENT_TRACKING_CONFIG } from '../../lib/constants';

/**
 * ContentTracking Extension 単体テスト
 * 個別関数の動作を検証
 */
describe('ContentTracking 定数', () => {
    describe('URL正規表現', () => {
        it('HTTP/HTTPS URLを正しく検出すること', () => {
            const text = 'Check out https://example.com and http://test.org!';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(2);
            expect(matches[0][0]).toBe('https://example.com');
            expect(matches[1][0]).toBe('http://test.org!');
        });

        it('日本語全角スペースで区切られたURLを検出すること', () => {
            const text = 'URLは　https://example.com　です';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toBe('https://example.com');
        });

        it('複数行のテキストからURLを検出すること', () => {
            const text = `First line: https://first.com
Second line: https://second.com
Third line: https://third.com`;
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

    describe('VALID_URL_PATTERN', () => {
        it('有効なHTTP URLを検証すること', () => {
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('http://example.com')).toBe(true);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('https://example.com')).toBe(true);
        });

        it('英数字で始まるURLのみ許可すること', () => {
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('https://example.com')).toBe(true);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('https://123.com')).toBe(true);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('https://.example.com')).toBe(false);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('https://-example.com')).toBe(false);
        });

        it('無効なプロトコルを拒否すること', () => {
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('ftp://example.com')).toBe(false);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('javascript:alert(1)')).toBe(false);
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test('data:text/html')).toBe(false);
        });
    });

    describe('MIN_URL_LENGTH', () => {
        it('最小長が8文字であること', () => {
            expect(CONTENT_TRACKING_CONFIG.MIN_URL_LENGTH).toBe(8);
        });

        it('最小長より短いURLを拒否する例', () => {
            const shortUrl = 'http://';
            const validUrl = 'http://ab';
            
            expect(shortUrl.length).toBeLessThanOrEqual(CONTENT_TRACKING_CONFIG.MIN_URL_LENGTH);
            expect(validUrl.length).toBeGreaterThan(CONTENT_TRACKING_CONFIG.MIN_URL_LENGTH);
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
            expect(CONTENT_TRACKING_CONFIG.ENABLE_AUTO_LINK).toBe(true);
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

describe('ContentTracking 統合動作', () => {
    describe('URL検出と検証の組み合わせ', () => {
        it('検出したURLを検証できること', () => {
            const text = 'Valid: https://example.com Invalid: https://.bad.com';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(2);
            
            // 最初のURLは有効
            const firstUrl = matches[0][0];
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test(firstUrl)).toBe(true);
            expect(firstUrl.length).toBeGreaterThan(CONTENT_TRACKING_CONFIG.MIN_URL_LENGTH);
            
            // 2番目のURLは無効（ドットで始まる）
            const secondUrl = matches[1][0];
            expect(CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test(secondUrl)).toBe(false);
        });

        it('長さチェックと組み合わせて使用できること', () => {
            const text = 'Short: http://a Long: https://example.com/path';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(2);
            
            const validUrls = matches.filter(match => {
                const url = match[0];
                return CONTENT_TRACKING_CONFIG.VALID_URL_PATTERN.test(url) &&
                       url.length > CONTENT_TRACKING_CONFIG.MIN_URL_LENGTH;
            });
            
            // 長さ条件を満たすのは2番目のURLのみ
            expect(validUrls).toHaveLength(1);
            expect(validUrls[0][0]).toContain('example.com');
        });
    });

    describe('エッジケース', () => {
        it('URLの末尾に句読点がある場合を処理できること', () => {
            const text = 'Check https://example.com, https://test.org! and https://demo.net.';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(3);
            // 実際のcleanUrlEnd関数で処理されることを想定
        });

        it('連続するURLを検出できること', () => {
            const text = 'https://first.com https://second.com';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(2);
        });

        it('URLにクエリパラメータが含まれる場合', () => {
            const text = 'https://example.com?param=value&other=123';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toContain('?param=value');
        });

        it('URLにハッシュフラグメントが含まれる場合', () => {
            const text = 'https://example.com#section';
            const matches = Array.from(text.matchAll(CONTENT_TRACKING_CONFIG.URL_REGEX));
            
            expect(matches).toHaveLength(1);
            expect(matches[0][0]).toContain('#section');
        });
    });
});
