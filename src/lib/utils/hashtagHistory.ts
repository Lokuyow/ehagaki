import { STORAGE_KEYS } from '../constants';
import type { HashtagHistoryEntry } from '../types';

const MAX_HISTORY = 50;    // localStorageへの最大保存件数
const MAX_SUGGESTIONS = 5; // サジェスト候補の最大表示件数
const MAX_HASHTAG_LENGTH = 100; // 保存するハッシュタグの最大文字数

/**
 * localStorageからハッシュタグ履歴を読み込む
 */
export function loadHashtagHistory(): HashtagHistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.HASHTAG_HISTORY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((e): e is HashtagHistoryEntry =>
            typeof e?.tag === 'string' && typeof e?.lastUsed === 'number'
        );
    } catch {
        return [];
    }
}

function persistHistory(entries: HashtagHistoryEntry[]): void {
    try {
        localStorage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(entries));
    } catch {
        // localStorageが使えない環境では無視
    }
}

/**
 * 投稿したハッシュタグを履歴に保存する（最大50件）
 * 既存エントリは lastUsed を更新し、新規エントリは追加する
 */
export function saveHashtagsToHistory(hashtags: string[]): void {
    if (!hashtags.length) return;

    const now = Date.now();
    const history = loadHashtagHistory();

    for (const tag of hashtags) {
        if (!tag) continue;
        if (tag.length > MAX_HASHTAG_LENGTH) continue;
        const normalized = tag.toLowerCase();
        const existingIdx = history.findIndex(e => e.tag.toLowerCase() === normalized);
        if (existingIdx >= 0) {
            history[existingIdx].lastUsed = now;
        } else {
            history.push({ tag, lastUsed: now });
        }
    }

    // lastUsed 降順でソートし、最大件数に切り詰める
    history.sort((a, b) => b.lastUsed - a.lastUsed);
    persistHistory(history.slice(0, MAX_HISTORY));
}

/**
 * クエリ文字列に一致するハッシュタグ候補を返す
 * 前方一致 > 部分一致 の順で、同一グループ内は最近使用順
 */
export function getSuggestions(query: string): string[] {
    const history = loadHashtagHistory();
    if (!history.length) return [];

    if (!query) {
        return history
            .sort((a, b) => b.lastUsed - a.lastUsed)
            .slice(0, MAX_SUGGESTIONS)
            .map(e => e.tag);
    }

    const lowerQuery = query.toLowerCase();
    const startsWith: HashtagHistoryEntry[] = [];
    const contains: HashtagHistoryEntry[] = [];

    for (const entry of history) {
        const lower = entry.tag.toLowerCase();
        if (lower.startsWith(lowerQuery)) {
            startsWith.push(entry);
        } else if (lower.includes(lowerQuery)) {
            contains.push(entry);
        }
    }

    startsWith.sort((a, b) => b.lastUsed - a.lastUsed);
    contains.sort((a, b) => b.lastUsed - a.lastUsed);

    return [...startsWith, ...contains].slice(0, MAX_SUGGESTIONS).map(e => e.tag);
}
