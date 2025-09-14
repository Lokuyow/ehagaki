import { HASHTAG_REGEX } from '../constants';

// ストアは tags.svelte.ts (Svelte rune ファイル) に移動
import { hashtagDataStore } from './tagsStore.svelte';
import type { Node as PMNode } from '@tiptap/pm/model';

// 追加: ドキュメント走査でハッシュタグの位置情報を返す型とユーティリティ
export type HashtagRange = { from: number; to: number; hashtag: string };

// 新規: doc を走査して各ハッシュタグ出現の位置を返す（デコレーション用・重複含む）
export function getHashtagRangesFromDoc(doc: PMNode): HashtagRange[] {
    const ranges: HashtagRange[] = [];
    const hashtagRegexSource = HASHTAG_REGEX.source;

    doc.descendants((node: PMNode, pos: number) => {
        if (!node.isText || !node.text) return;
        const text: string = node.text;
        const hashtagRegex: RegExp = new RegExp(hashtagRegexSource, 'g');
        let match: RegExpExecArray | null;
        while ((match = hashtagRegex.exec(text)) !== null) {
            const hashIndex = match[0].indexOf('#');
            if (hashIndex === -1) continue;
            const start = pos + match.index + hashIndex;
            const end = start + 1 + match[1].length;
            ranges.push({ from: start, to: end, hashtag: match[1] });
        }
    });

    return ranges;
}

// ハッシュタグ抽出関数（内部利用）
export function extractHashtagsFromContent(content: string): string[] {
    const hashtags: string[] = [];
    const seen = new Set<string>();
    HASHTAG_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    // エディター側の認識に合わせて、# を除いた原文のままの部分（大文字小文字を保持）を取得し、初出順で重複除去する
    while ((match = HASHTAG_REGEX.exec(content)) !== null) {
        const hashtag = match[1];
        if (hashtag && hashtag.trim()) {
            if (!seen.has(hashtag)) {
                seen.add(hashtag);
                hashtags.push(hashtag);
            }
        }
    }

    return hashtags;
}

// 変更: extractHashtagsFromDoc は getHashtagRangesFromDoc を使って初出順で重複除去して返す
export function extractHashtagsFromDoc(doc: PMNode): string[] {
    const ranges = getHashtagRangesFromDoc(doc);
    const hashtags: string[] = [];
    const seen = new Set<string>();
    for (const r of ranges) {
        if (!seen.has(r.hashtag)) {
            seen.add(r.hashtag);
            hashtags.push(r.hashtag);
        }
    }
    return hashtags;
}

// ハッシュタグデータ更新関数（外部呼び出し用）
// 引数は文字列（プレーンテキスト）または ProseMirror の doc を受け取れるようにする
export function updateHashtagData(contentOrDoc: string | PMNode): void {
    const prevHashtags: string[] = Array.isArray(hashtagDataStore.hashtags) ? [...hashtagDataStore.hashtags] : [];
    let hashtags: string[];
    let content: string;

    if (typeof contentOrDoc === 'string') {
        content = contentOrDoc;
        hashtags = extractHashtagsFromContent(content);
    } else {
        // doc が渡された場合はエディターの走査ロジックで抽出（ハイライトと一致させる）
        hashtags = extractHashtagsFromDoc(contentOrDoc);
        content = contentOrDoc.textContent;
    }

    // 投稿用の 't' タグは英字をすべて小文字にする（エディター表示は元のまま）
    const tags: [string, string][] = hashtags.map(hashtag => ['t', hashtag.toLowerCase()]);

    hashtagDataStore.content = content;
    hashtagDataStore.hashtags = hashtags;
    hashtagDataStore.tags = tags;

    // 開発モードのみログ出力
    // const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    // if (isDev) {
    //     const added = hashtags.filter(h => !prevHashtags.includes(h));
    //     const removed = prevHashtags.filter(h => !hashtags.includes(h));
    //     console.log('[dev] updateHashtagData: contentLength=', content.length);
    //     // 実際に投稿時に使われる 't' タグ（小文字化済み）をログ出力する
    //     console.log('[dev] updateHashtagData: tags=', tags);
    //     console.log('[dev] updateHashtagData: added=', added, 'removed=', removed);
    // }
}