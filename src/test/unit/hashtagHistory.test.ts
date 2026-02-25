import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    loadHashtagHistory,
    saveHashtagsToHistory,
    getSuggestions,
} from '../../lib/utils/hashtagHistory';
import { STORAGE_KEYS } from '../../lib/constants';
import { MockStorage } from '../helpers';

describe('hashtagHistory', () => {
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
        Object.defineProperty(globalThis, 'localStorage', {
            value: storage,
            writable: true,
        });
    });

    afterEach(() => {
        storage.clear();
    });

    // --- loadHashtagHistory ---
    describe('loadHashtagHistory', () => {
        it('localStorageが空の場合は空配列を返す', () => {
            expect(loadHashtagHistory()).toEqual([]);
        });

        it('保存済みの履歴を返す', () => {
            const data = [{ tag: 'nostr', lastUsed: 1000 }];
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(data));
            expect(loadHashtagHistory()).toEqual(data);
        });

        it('不正なJSONの場合は空配列を返す', () => {
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, 'invalid-json');
            expect(loadHashtagHistory()).toEqual([]);
        });

        it('配列でないデータの場合は空配列を返す', () => {
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify({ tag: 'nostr' }));
            expect(loadHashtagHistory()).toEqual([]);
        });

        it('不正なエントリを除外する', () => {
            const data = [
                { tag: 'nostr', lastUsed: 1000 },
                { tag: 123, lastUsed: 2000 },   // tag が数値 → 除外
                { tag: 'svelte' },               // lastUsed なし → 除外
            ];
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(data));
            const result = loadHashtagHistory();
            expect(result).toHaveLength(1);
            expect(result[0].tag).toBe('nostr');
        });
    });

    // --- saveHashtagsToHistory ---
    describe('saveHashtagsToHistory', () => {
        it('新しいハッシュタグを保存する', () => {
            saveHashtagsToHistory(['nostr', 'svelte']);
            const history = loadHashtagHistory();
            const tags = history.map(e => e.tag);
            expect(tags).toContain('nostr');
            expect(tags).toContain('svelte');
        });

        it('既存エントリは lastUsed を更新する（大文字小文字を無視して比較）', () => {
            storage.setItem(
                STORAGE_KEYS.HASHTAG_HISTORY,
                JSON.stringify([{ tag: 'Nostr', lastUsed: 1000 }])
            );

            saveHashtagsToHistory(['nostr']);
            const history = loadHashtagHistory();
            expect(history).toHaveLength(1);
            expect(history[0].tag).toBe('Nostr'); // 元の大文字小文字を保持
            expect(history[0].lastUsed).toBeGreaterThan(1000);
        });

        it('50件を超えた場合は古いエントリを削除する', () => {
            const entries = Array.from({ length: 50 }, (_, i) => ({
                tag: `tag${i + 1}`,
                lastUsed: (i + 1) * 1000,
            }));
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(entries));

            saveHashtagsToHistory(['newtag']);
            const history = loadHashtagHistory();
            expect(history).toHaveLength(50);

            // 最も古い tag1 が削除され、newtag が追加されていること
            const tags = history.map(e => e.tag);
            expect(tags).not.toContain('tag1');
            expect(tags).toContain('newtag');
        });

        it('空配列を渡しても何も変化しない', () => {
            saveHashtagsToHistory([]);
            expect(loadHashtagHistory()).toEqual([]);
        });

        it('100文字を超えるハッシュタグは保存しない', () => {
            const longTag = 'a'.repeat(101);
            saveHashtagsToHistory([longTag]);
            expect(loadHashtagHistory()).toEqual([]);
        });

        it('100文字以下のハッシュタグは保存する', () => {
            const maxTag = 'a'.repeat(100);
            saveHashtagsToHistory([maxTag]);
            expect(loadHashtagHistory()).toHaveLength(1);
        });

        it('50件以内の場合は全て保持する', () => {
            saveHashtagsToHistory(['a', 'b', 'c']);
            expect(loadHashtagHistory()).toHaveLength(3);
        });

        it('保存後は lastUsed 降順で保持される', () => {
            vi.useFakeTimers();
            vi.setSystemTime(1000);
            saveHashtagsToHistory(['old']);
            vi.setSystemTime(2000);
            saveHashtagsToHistory(['new']);
            vi.useRealTimers();

            const history = loadHashtagHistory();
            expect(history[0].tag).toBe('new');
            expect(history[1].tag).toBe('old');
        });
    });

    // --- getSuggestions ---
    describe('getSuggestions', () => {
        beforeEach(() => {
            const entries = [
                { tag: 'svelte', lastUsed: 5000 },
                { tag: 'nostr', lastUsed: 4000 },
                { tag: 'sveltekit', lastUsed: 3000 },
                { tag: 'TypeScript', lastUsed: 2000 },
            ];
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(entries));
        });

        it('履歴が空の場合は空配列を返す', () => {
            storage.clear();
            expect(getSuggestions('')).toEqual([]);
        });

        it('クエリが空の場合は lastUsed 降順で全件返す', () => {
            const result = getSuggestions('');
            expect(result).toEqual(['svelte', 'nostr', 'sveltekit', 'TypeScript']);
        });

        it('前方一致を優先して返す', () => {
            // 's' で始まるものは svelte と sveltekit
            const result = getSuggestions('sv');
            expect(result[0]).toBe('svelte');
            expect(result[1]).toBe('sveltekit');
        });

        it('大文字小文字を無視して比較する', () => {
            // 'typescript' は 'TypeScript' に前方一致すべき
            const result = getSuggestions('type');
            expect(result).toContain('TypeScript');
        });

        it('一致しない場合は空配列を返す', () => {
            expect(getSuggestions('zzz')).toEqual([]);
        });

        it('前方一致グループが lastUsed 降順で先に並ぶ', () => {
            // 'svelte' (5000) と 'sveltekit' (3000) が前方一致
            const result = getSuggestions('svelte');
            // svelteとsveltekit（svelteはsveltekit含む前方一致）
            expect(result[0]).toBe('svelte');
            expect(result[1]).toBe('sveltekit');
        });

        it('サジェストは最夥5件まで返す', () => {
            // 6件保存してもサジェストは5件に絞り込まれる
            const entries = Array.from({ length: 6 }, (_, i) => ({
                tag: `tag${i + 1}`,
                lastUsed: (i + 1) * 1000,
            }));
            storage.setItem(STORAGE_KEYS.HASHTAG_HISTORY, JSON.stringify(entries));
            const result = getSuggestions('');
            expect(result.length).toBeLessThanOrEqual(5);
        });
    });
});
