/**
 * 汎用的なユーティリティ関数
 */

// ハッシュタグを検出する正規表現
const HASHTAG_REGEX = /(?:^|[\s\n])#([^\s#]+)/g;

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
        HASHTAG_REGEX,
        (match, hashtag, offset) => {
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
    return /(?:^|[\s\n])#([^\s#]+)/.test(content);
}
