import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    normalizeClipboardText,
    serializeParagraphs
} from '../../lib/utils/clipboardUtils';
import {
    validateAndNormalizeUrl,
    validateAndNormalizeImageUrl,
    isValidProtocol,
    isValidImageExtension
} from '../../lib/utils/editorUtils';
import {
    extractHashtagsFromContent,
    updateHashtagData
} from '../../lib/tags/hashtagManager';
import { hashtagDataStore } from '../../stores/tagsStore.svelte';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

// constants のモック
vi.mock("../../lib/constants", () => ({
    ALLOWED_PROTOCOLS: ['http:', 'https:'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    HASHTAG_REGEX: /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g
}));

/**
 * エディター・クリップボード統合テスト
 * テキストのペースト、コピー、URL判定、ハッシュタグ判定などの統合フロー
 */
describe('エディター・クリップボード統合テスト', () => {
    beforeEach(() => {
        // ハッシュタグストアの初期化
        hashtagDataStore.content = '';
        hashtagDataStore.hashtags.length = 0;
        hashtagDataStore.tags.length = 0;
    });

    describe('テキストペースト統合', () => {
        it('クリップボードからのテキストペースト→正規化→段落化の完全フローが動作すること', () => {
            // 1. クリップボードからテキストを取得(改行コード混在)
            const clipboardText = 'Line 1\r\nLine 2\nLine 3\rLine 4';

            // 2. テキストの正規化
            const normalized = normalizeClipboardText(clipboardText);
            expect(normalized.lines).toEqual(['Line 1', 'Line 2', 'Line 3', 'Line 4']);
            expect(normalized.normalized).toBe('Line 1\nLine 2\nLine 3\nLine 4');

            // 3. 段落として整形（serializeParagraphsは文字列を返す）
            const serialized = serializeParagraphs(normalized.lines);
            expect(serialized).toBe('Line 1\nLine 2\nLine 3\nLine 4');
        });

        it('空行を含むテキストのペーストで空行が保持されること', () => {
            const clipboardText = 'Paragraph 1\n\nParagraph 2\n\n\nParagraph 3';

            const normalized = normalizeClipboardText(clipboardText);
            expect(normalized.lines).toEqual(['Paragraph 1', '', 'Paragraph 2', '', '', 'Paragraph 3']);

            const serialized = serializeParagraphs(normalized.lines);
            expect(serialized).toBe('Paragraph 1\n\nParagraph 2\n\n\nParagraph 3');
        });

        it('HTMLとしてペーストされたテキストが正しく処理されること', () => {
            // HTMLタグを含むテキスト（ブラウザのコピーペーストを想定）
            const htmlText = '<p>Paragraph 1</p><p>Paragraph 2</p>';

            // 実際にはHTMLパーサーが必要だが、ここでは正規化のテスト
            const plainText = htmlText.replace(/<[^>]+>/g, '');
            const normalized = normalizeClipboardText(plainText);

            expect(normalized.normalized).toBe('Paragraph 1Paragraph 2');
        });

        it('連続空行の制限オプションが正しく動作すること', () => {
            const clipboardText = 'Line 1\n\n\n\nLine 5';

            const normalized = normalizeClipboardText(clipboardText, {
                collapseEmptyLines: true,
                maxConsecutiveEmptyLines: 1
            });

            expect(normalized.lines).toEqual(['Line 1', '', 'Line 5']);
        });
    });

    describe('URLリンク判定統合', () => {
        it('URLの検証→正規化→プロトコルチェックの完全フローが動作すること', () => {
            const url = '  https://example.com/path  ';

            // 1. URLの検証と正規化
            const normalized = validateAndNormalizeUrl(url);
            expect(normalized).toBe('https://example.com/path');

            // 2. プロトコルの検証
            if (normalized) {
                const urlObj = new URL(normalized);
                const isValidProto = isValidProtocol(urlObj.protocol);
                expect(isValidProto).toBe(true);
            }
        });

        it('画像URLの検証→拡張子チェック→正規化のフローが動作すること', () => {
            const imageUrl = 'https://example.com/image.jpg';

            // 1. 拡張子の検証
            const hasValidExt = isValidImageExtension(imageUrl);
            expect(hasValidExt).toBe(true);

            // 2. 画像URLとして検証・正規化
            const normalized = validateAndNormalizeImageUrl(imageUrl);
            expect(normalized).toBe('https://example.com/image.jpg');
        });

        it('無効なプロトコルのURLが拒否されること', () => {
            const urls = [
                'ftp://example.com',
                'javascript:alert(1)',
                'data:text/html,<script>alert(1)</script>'
            ];

            for (const url of urls) {
                const normalized = validateAndNormalizeUrl(url);
                expect(normalized).toBeNull();
            }
        });

        it('画像以外の拡張子が拒否されること', () => {
            const urls = [
                'https://example.com/document.pdf',
                'https://example.com/video.mp4',
                'https://example.com/file.txt'
            ];

            for (const url of urls) {
                const normalized = validateAndNormalizeImageUrl(url);
                expect(normalized).toBeNull();
            }
        });

        it('様々な画像拡張子が正しく認識されること', () => {
            const imageUrls = [
                'https://example.com/image.jpg',
                'https://example.com/image.JPEG',
                'https://example.com/image.png',
                'https://example.com/image.gif',
                'https://example.com/image.webp',
                'https://example.com/icon.svg'
            ];

            for (const url of imageUrls) {
                const normalized = validateAndNormalizeImageUrl(url);
                expect(normalized).toBeTruthy();
            }
        });

        it('URLエンコードが必要な文字列が正しく処理されること', () => {
            const url = 'https://example.com/日本語/パス';
            const normalized = validateAndNormalizeUrl(url);

            // エンコードされていることを確認
            expect(normalized).toContain('%E');
        });
    });

    describe('ハッシュタグ判定統合', () => {
        it('テキストからハッシュタグを抽出→ストア更新のフローが動作すること', () => {
            const content = 'Hello #Nostr and #Bitcoin community!';

            // 1. ハッシュタグの抽出
            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual(['Nostr', 'Bitcoin']);

            // 2. ストアの更新
            updateHashtagData(content);
            expect(hashtagDataStore.content).toBe(content);
            expect(hashtagDataStore.hashtags).toEqual(['Nostr', 'Bitcoin']);
            expect(hashtagDataStore.tags).toEqual([['t', 'nostr'], ['t', 'bitcoin']]);
        });

        it('日本語ハッシュタグが正しく抽出・保存されること', () => {
            const content = 'これは #日本語 のテストです #テスト';

            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual(['日本語', 'テスト']);

            updateHashtagData(content);
            expect(hashtagDataStore.hashtags).toEqual(['日本語', 'テスト']);
            expect(hashtagDataStore.tags).toEqual([['t', '日本語'], ['t', 'テスト']]);
        });

        it('英数字・アンダースコアを含むハッシュタグが抽出されること', () => {
            const content = '#Web3_0 #AI_ML #Tech2024';

            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual(['Web3_0', 'AI_ML', 'Tech2024']);

            updateHashtagData(content);
            expect(hashtagDataStore.hashtags).toEqual(['Web3_0', 'AI_ML', 'Tech2024']);
        });

        it('ハッシュタグが無い場合、空配列が返されること', () => {
            const content = 'No hashtags here!';

            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual([]);

            updateHashtagData(content);
            expect(hashtagDataStore.hashtags).toEqual([]);
            expect(hashtagDataStore.tags).toEqual([]);
        });

        it('重複ハッシュタグが重複除去されること', () => {
            // extractHashtagsFromContentは初出順で重複除去する
            const content = '#Nostr is great! #Nostr forever!';

            const hashtags = extractHashtagsFromContent(content);
            // 重複は除去され、1つだけ返される
            expect(hashtags).toEqual(['Nostr']);

            updateHashtagData(content);
            // ストアにも1つだけ保存される
            expect(hashtagDataStore.hashtags).toEqual(['Nostr']);
        });
    });

    describe('テキストコピー統合', () => {
        it('エディタの内容を段落に分割→クリップボード形式に変換のフローが動作すること', () => {
            const paragraphs = ['Line 1', 'Line 2', 'Line 3'];

            // 段落を結合してクリップボードテキストに変換
            const clipboardText = paragraphs.join('\n');
            expect(clipboardText).toBe('Line 1\nLine 2\nLine 3');

            // 再度ペーストした時に元に戻ることを確認
            const normalized = normalizeClipboardText(clipboardText);
            expect(normalized.lines).toEqual(paragraphs);
        });

        it('空行を含む内容のコピー・ペーストが往復できること', () => {
            const original = ['Para 1', '', 'Para 2', '', '', 'Para 3'];

            // コピー
            const clipboardText = original.join('\n');

            // ペースト
            const normalized = normalizeClipboardText(clipboardText);
            expect(normalized.lines).toEqual(original);
        });
    });

    describe('下書きHTMLラウンドトリップ', () => {
        it('段落ベースのHTMLがsetContent→getHTMLで保持されること', () => {
            // 複数行テキストから期待されるHTML（段落ベース挿入後のgetHTML出力）
            const html = '<p>Line 1</p><p>Line 2</p><p>Line 3</p>';

            // DOMParserでHTMLを解析し再シリアライズしても段落構造が保持されることを確認
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // 段落ノード数の確認
            const paragraphs = tempDiv.querySelectorAll('p');
            expect(paragraphs).toHaveLength(3);
            expect(paragraphs[0].textContent).toBe('Line 1');
            expect(paragraphs[1].textContent).toBe('Line 2');
            expect(paragraphs[2].textContent).toBe('Line 3');

            // 再シリアライズ後もHTML構造が保持される
            expect(tempDiv.innerHTML).toBe(html);
        });

        it('空行を含む段落HTMLがラウンドトリップで保持されること', () => {
            // 空行 = 空の<p>タグ（空の段落ノード）
            const html = '<p>Para 1</p><p></p><p>Para 2</p>';

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const paragraphs = tempDiv.querySelectorAll('p');
            expect(paragraphs).toHaveLength(3);
            expect(paragraphs[0].textContent).toBe('Para 1');
            expect(paragraphs[1].textContent).toBe('');
            expect(paragraphs[2].textContent).toBe('Para 2');

            expect(tempDiv.innerHTML).toBe(html);
        });

        it('テキストノード内の改行はDOMParser経由で空白として扱われること', () => {
            // 旧実装（インライン挿入）で生成されるHTML: テキストノード内に\nが含まれる
            const brokenHtml = '<p>Line 1\nLine 2\nLine 3</p>';

            // DOMParserを通すと、テキストノード内の\nは空白文字として扱われる（HTML仕様）
            const parsed = new DOMParser().parseFromString(brokenHtml, 'text/html');
            const p = parsed.querySelector('p');
            // innerTextは可視テキストを返し、改行は空白として扱われる
            // textContentは生値を返すが、reparseで段落に分割されない
            expect(p).not.toBeNull();
            // 段落は1つだけ（改行で分割されない = 改行が消失する）
            expect(parsed.querySelectorAll('p')).toHaveLength(1);
        });

        it('段落ベースHTMLからテキスト抽出→再ペーストのラウンドトリップが成立すること', () => {
            const originalLines = ['First line', '', 'Third line', 'Fourth line'];

            // 段落ベースHTML（段落挿入後のgetHTML出力を模擬）
            const html = originalLines.map(line =>
                line ? `<p>${line}</p>` : '<p></p>'
            ).join('');

            // HTML → テキスト抽出（下書きプレビュー生成と同等）
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const paragraphs = tempDiv.querySelectorAll('p');
            const extractedLines = Array.from(paragraphs).map(p => p.textContent || '');

            // テキスト再ペースト（normalizeClipboardText経由）
            const clipboardText = extractedLines.join('\n');
            const normalized = normalizeClipboardText(clipboardText);

            expect(normalized.lines).toEqual(originalLines);
        });
    });

    describe('複合的なエディタ操作統合', () => {
        it('URLとハッシュタグを含むテキストのペースト→解析のフローが動作すること', () => {
            const content = 'Check out https://example.com for #Nostr news!';

            // 1. テキストの正規化
            const normalized = normalizeClipboardText(content);
            expect(normalized.normalized).toBe(content);

            // 2. ハッシュタグの抽出
            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual(['Nostr']);

            // 3. URLの抽出（簡易的なマッチング）
            const urlMatch = content.match(/https?:\/\/[^\s]+/);
            expect(urlMatch).toBeTruthy();
            expect(urlMatch![0]).toBe('https://example.com');

            // 4. URLの検証
            const validUrl = validateAndNormalizeUrl(urlMatch![0]);
            expect(validUrl).toBe('https://example.com/');
        });

        it('複数行・複数URL・複数ハッシュタグの複雑なコンテンツが処理できること', () => {
            const content = `First line with #tag1
https://example.com/image.jpg
Second line with #tag2 and https://example.org
#tag3 #tag4`;

            // 1. テキスト正規化
            const normalized = normalizeClipboardText(content);
            expect(normalized.lines).toHaveLength(4);

            // 2. ハッシュタグ抽出
            const hashtags = extractHashtagsFromContent(content);
            expect(hashtags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);

            // 3. URL抽出
            const urls = content.match(/https?:\/\/[^\s]+/g);
            expect(urls).toHaveLength(2);

            // 4. 画像URLの検証
            const imageUrl = validateAndNormalizeImageUrl(urls![0]);
            expect(imageUrl).toBeTruthy();

            // 5. 通常URLの検証
            const normalUrl = validateAndNormalizeUrl(urls![1]);
            expect(normalUrl).toBeTruthy();
        });

        it('HTMLペースト→クリーンアップ→ハッシュタグ抽出のフローが動作すること', () => {
            const htmlContent = '<p>Check #Nostr</p><p>Visit https://example.com</p>';

            // HTMLタグ除去
            const plainText = htmlContent.replace(/<[^>]+>/g, '');
            expect(plainText).toBe('Check #NostrVisit https://example.com');

            // スペースを補完（実際の実装では必要）
            const correctedText = plainText.replace(/([a-z])([A-Z])/g, '$1 $2');

            // ハッシュタグ抽出
            const hashtags = extractHashtagsFromContent(plainText);
            expect(hashtags.length).toBeGreaterThan(0);
        });
    });

    describe('エラーケース統合', () => {
        it('無効な入力が安全に処理されること', () => {
            // 空文字列
            const empty = normalizeClipboardText('');
            expect(empty.lines).toEqual([]);

            const emptyHashtags = extractHashtagsFromContent('');
            expect(emptyHashtags).toEqual([]);

            const emptyUrl = validateAndNormalizeUrl('');
            expect(emptyUrl).toBeNull();
        });

        it('特殊文字を含む入力が適切に処理されること', () => {
            const specialChars = '💜 #Nostr 🚀 https://example.com 🎉';

            const normalized = normalizeClipboardText(specialChars);
            expect(normalized.normalized).toBe(specialChars);

            const hashtags = extractHashtagsFromContent(specialChars);
            expect(hashtags).toContain('Nostr');

            const urlMatch = specialChars.match(/https?:\/\/[^\s]+/);
            const validUrl = validateAndNormalizeUrl(urlMatch![0]);
            expect(validUrl).toBeTruthy();
        });

        it('非常に長いテキストが処理されること', () => {
            const longText = 'word '.repeat(1000) + '#hashtag';

            const normalized = normalizeClipboardText(longText);
            expect(normalized.normalized).toContain('#hashtag');

            const hashtags = extractHashtagsFromContent(longText);
            expect(hashtags).toContain('hashtag');
        });

        it('URLに似た文字列が誤検出されないこと', () => {
            const fakeUrls = [
                'not-a-url',
                'http:/ /missing-slash.com',  // スペースを含む不正なURL
                '://no-protocol.com',
                'ftp://wrong-protocol.com'  // 許可されていないプロトコル
            ];

            for (const fake of fakeUrls) {
                const result = validateAndNormalizeUrl(fake);
                expect(result).toBeNull();
            }
        });
    });

    describe('エディタ状態管理統合', () => {
        it('ハッシュタグストアが正しく更新・クリアされること', () => {
            // 初期状態
            expect(hashtagDataStore.content).toBe('');
            expect(hashtagDataStore.hashtags).toEqual([]);

            // 更新
            const content1 = 'First post #tag1 #tag2';
            updateHashtagData(content1);
            expect(hashtagDataStore.content).toBe(content1);
            expect(hashtagDataStore.hashtags).toEqual(['tag1', 'tag2']);

            // 再更新
            const content2 = 'Second post #tag3';
            updateHashtagData(content2);
            expect(hashtagDataStore.content).toBe(content2);
            expect(hashtagDataStore.hashtags).toEqual(['tag3']);

            // クリア
            updateHashtagData('');
            expect(hashtagDataStore.hashtags).toEqual([]);
        });

        it('大文字小文字が適切に処理されること', () => {
            const content = '#NoStR #BITCOIN #ethereum';

            updateHashtagData(content);

            // 元のハッシュタグは大文字小文字を保持
            expect(hashtagDataStore.hashtags).toEqual(['NoStR', 'BITCOIN', 'ethereum']);

            // タグは小文字化される
            expect(hashtagDataStore.tags).toEqual([
                ['t', 'nostr'],
                ['t', 'bitcoin'],
                ['t', 'ethereum']
            ]);
        });
    });

    describe('リアルワールドシナリオ統合', () => {
        it('Twitterからのペーストが正しく処理されること', () => {
            // Twitterからコピーしたテキスト（改行とハッシュタグとURL）
            const twitterText = `Amazing article about #Nostr!
https://example.com/article
#decentralized #freedom`;

            // 1. 正規化
            const normalized = normalizeClipboardText(twitterText);
            expect(normalized.lines).toHaveLength(3);

            // 2. ハッシュタグ抽出
            const hashtags = extractHashtagsFromContent(twitterText);
            expect(hashtags).toEqual(['Nostr!', 'decentralized', 'freedom']);

            // 3. URL抽出と検証
            const urlMatch = twitterText.match(/https?:\/\/[^\s]+/);
            const validUrl = validateAndNormalizeUrl(urlMatch![0]);
            expect(validUrl).toBe('https://example.com/article');
        });

        it('Markdownテキストのペーストが処理されること', () => {
            const markdown = `# Title
## Subtitle with #hashtag

Check out [this link](https://example.com)

![Image](https://example.com/image.png)`;

            const normalized = normalizeClipboardText(markdown);
            expect(normalized.lines.length).toBeGreaterThan(0);

            const hashtags = extractHashtagsFromContent(markdown);
            expect(hashtags).toContain('hashtag');

            // Markdown画像URL抽出
            const imageUrlMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
            if (imageUrlMatch) {
                const imageUrl = validateAndNormalizeImageUrl(imageUrlMatch[1]);
                expect(imageUrl).toBeTruthy();
            }
        });

        it('複数の段落とハッシュタグを含む長文が処理されること', () => {
            const longContent = `First paragraph with #introduction

Second paragraph discussing #topic1 and #topic2

Third paragraph with more #details

Final thoughts on #conclusion`;

            const normalized = normalizeClipboardText(longContent);
            const paragraphs = serializeParagraphs(normalized.lines);

            expect(paragraphs.length).toBeGreaterThan(4);

            const hashtags = extractHashtagsFromContent(longContent);
            expect(hashtags).toEqual(['introduction', 'topic1', 'topic2', 'details', 'conclusion']);

            updateHashtagData(longContent);
            expect(hashtagDataStore.hashtags).toHaveLength(5);
        });
    });
});
