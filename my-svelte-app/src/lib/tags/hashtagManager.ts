import { HASHTAG_REGEX } from '../constants';

// ストアは tags.svelte.ts (Svelte rune ファイル) に移動
import { hashtagDataStore } from './tags.svelte';

// ハッシュタグ抽出関数（内部利用）
export function extractHashtagsFromContent(content: string): string[] {
    const hashtags: string[] = [];
    HASHTAG_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = HASHTAG_REGEX.exec(content)) !== null) {
        const hashtag = match[1];
        if (hashtag && hashtag.trim()) {
            hashtags.push(hashtag.toLowerCase());
        }
    }

    return hashtags;
}

// ハッシュタグデータ更新関数（外部呼び出し用）
export function updateHashtagData(content: string): void {
    const hashtags = extractHashtagsFromContent(content);
    const tags: [string, string][] = hashtags.map(hashtag => ["t", hashtag]);

    hashtagDataStore.content = content;
    hashtagDataStore.hashtags = hashtags;
    hashtagDataStore.tags = tags;
}