import { describe, it, expect, beforeEach } from 'vitest';

import {
	applyHashtagData,
	buildHashtagData,
	extractHashtagsFromContent,
	updateHashtagData,
} from '../../lib/tags/hashtagManager';
import { hashtagDataStore } from '../../stores/tagsStore.svelte';

describe('hashtagManager', () => {
	beforeEach(() => {
		// ストアの初期化
		hashtagDataStore.content = '';
		hashtagDataStore.hashtags.length = 0;
		hashtagDataStore.tags.length = 0;
	});

	describe('extractHashtagsFromContent', () => {
		it('英字・アンダースコアを含むハッシュタグを抽出して原文のまま返す', () => {
			const content = 'Hello #Test_Tag and #Another123!';
			const result = extractHashtagsFromContent(content);
			// 実装は大文字小文字を保持して返す
			expect(result).toEqual(['Test_Tag', 'Another123!']);
		});

		it('日本語ハッシュタグを抽出する', () => {
			const content = 'これは #日本語 のテストです #テスト';
			const result = extractHashtagsFromContent(content);
			expect(result).toEqual(['日本語', 'テスト']);
		});

		it('ハッシュタグがない場合は空配列を返す', () => {
			const content = 'no tags here!';
			const result = extractHashtagsFromContent(content);
			expect(result).toEqual([]);
		});

		it('句読点付きでも正しく抽出する', () => {
			const content = 'Check: #one, #two. #Three!';
			const result = extractHashtagsFromContent(content);
			// 実装は末尾の句読点や大文字小文字を保持する
			expect(result).toEqual(['one,', 'two.', 'Three!']);
		});
	});

	describe('updateHashtagData', () => {
		it('buildHashtagData は store を変更せず投稿用データを生成する', () => {
			const content = 'Mix #Vue #Svelte #Vue';
			const result = buildHashtagData(content);

			expect(result).toEqual({
				content,
				hashtags: ['Vue', 'Svelte'],
				tags: [['t', 'vue'], ['t', 'svelte']],
			});
			expect(hashtagDataStore.content).toBe('');
			expect(hashtagDataStore.hashtags).toEqual([]);
			expect(hashtagDataStore.tags).toEqual([]);
		});

		it('applyHashtagData は渡された store だけを更新する', () => {
			const store = {
				content: '',
				hashtags: [] as string[],
				tags: [] as string[][],
			};
			const data = buildHashtagData('Hello #Nostr');

			applyHashtagData(store, data);

			expect(store).toEqual({
				content: 'Hello #Nostr',
				hashtags: ['Nostr'],
				tags: [['t', 'nostr']],
			});
			expect(hashtagDataStore.content).toBe('');
		});

		it('ストアの content, hashtags, tags を実装どおりに更新する', () => {
			const content = 'Mix #Vue #Svelte #日本語';
			updateHashtagData(content);

			expect(hashtagDataStore.content).toBe(content);
			// hashtags は原文のまま保持される
			expect(hashtagDataStore.hashtags).toEqual(['Vue', 'Svelte', '日本語']);
			// 投稿用 tags は英字部分を小文字化して格納される
			expect(hashtagDataStore.tags).toEqual([['t', 'vue'], ['t', 'svelte'], ['t', '日本語']]);
		});
	});
});
