/**
 * 汎用的なユーティリティ関数
 */

// ハッシュタグを検出する正規表現（半角スペース、改行、タブ以外の文字を全て含む）
const HASHTAG_REGEX = /(?:^|[\s\n])#([^\s\n\t]+)/g;

/**
 * テキストからハッシュタグを抽出する
 * @param content テキストコンテンツ
 * @returns ハッシュタグの配列（#なし）
 */
export function extractHashtags(content: string): string[] {
    const hashtags: string[] = [];
    let match;
    const regex = new RegExp(HASHTAG_REGEX);

    while ((match = regex.exec(content)) !== null) {
        const hashtag = match[1];
        if (hashtag && hashtag.trim()) {
            hashtags.push(hashtag);
        }
    }

    return hashtags;
}

/**
 * ハッシュタグからNostrのtタグを生成する
 * @param content テキストコンテンツ
 * @returns tタグの配列
 */
export function generateHashtagTags(content: string): string[][] {
    const hashtags = extractHashtags(content);
    return hashtags.map(hashtag => ["t", hashtag]);
}

/**
 * テキスト内のハッシュタグをHTMLスパンタグでラップする
 * @param text テキスト
 * @returns ハッシュタグがスタイル付きHTMLに変換されたテキスト
 */
export function formatTextWithHashtags(text: string): string {
    return text.replace(
        /(?:^|[\s\n])#([^\s\n\t]+)/g,
        (match, hashtag) => {
            const prefix = match.charAt(0) === '#' ? '' : match.charAt(0);
            return `${prefix}<span class="hashtag">#${hashtag}</span>`;
        }
    );
}

/**
 * テキストにハッシュタグが含まれているかチェックする
 * @param content テキストコンテンツ
 * @returns ハッシュタグが含まれている場合true
 */
export function containsHashtags(content: string): boolean {
    return /(?:^|[\s\n])#([^\s\n\t]+)/.test(content);
}

/**
 * テキスト内のURLを検出し、HTMLリンクに変換する
 * @param text テキスト
 * @returns URLがリンクに変換されたテキスト
 */
export function formatTextWithLinks(text: string): string {
    if (!text) return "";

    // URLパターンを定義（前後に文字がない場合のみマッチ）
    const urlRegex = /(?<![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])(https?:\/\/[^\s<>"{}|\\^`[\]]+)(?![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])/gi;

    return text.replace(urlRegex, (url) => {
        // ここでのエスケープ処理は不要。サニタイズはSvelte側で行う。
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="preview-link">${url}</a>`;
    });
}

/**
 * テキスト内のハッシュタグとURLを同時に処理する
 * @param text テキスト
 * @returns ハッシュタグとURLが適切に処理されたテキスト
 */
export function formatTextWithHashtagsAndLinks(text: string): string {
    if (!text) return "";

    // 最初にURLをリンクに変換
    let formattedText = formatTextWithLinks(text);

    // 次にハッシュタグを処理（リンク内のハッシュタグは除外）
    formattedText = formattedText.replace(
        /(?<!<a[^>]*>.*?)(?:^|[\s\n])#([^\s\n\t]+)(?![^<]*<\/a>)/g,
        (match, hashtag) => {
            const prefix = match.charAt(0) === '#' ? '' : match.charAt(0);
            return `${prefix}<span class="hashtag">#${hashtag}</span>`;
        }
    );

    return formattedText;
}
