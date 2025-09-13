import { describe, it, expect, beforeEach, vi } from 'vitest';

// vi.mock の工場関数内でストアを生成（トップレベル変数を参照しない）
vi.mock('./tags.svelte', () => {
	const store = {
		content: '',
		hashtags: [] as string[],
		tags: [] as [string, string][],
	};
	return { hashtagDataStore: store };
});

// モックモジュールをインポートしてストア参照を取得（トップレベル await を使用）
const tagsModule = await import('./tags.svelte');
const mockedStore = (tagsModule as any).hashtagDataStore as {
	content: string;
	hashtags: string[];
	tags: [string, string][];
};

// テスト対象をインポート（モック確定後に行う）
import { extractHashtagsFromContent, updateHashtagData } from './hashtagManager';

describe('hashtagManager', () => {
	beforeEach(() => {
		// モックの初期化
		mockedStore.content = '';
		mockedStore.hashtags.length = 0;
		mockedStore.tags.length = 0;
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
		it('ストアの content, hashtags, tags を実装どおりに更新する', () => {
			const content = 'Mix #Vue #Svelte #日本語';
			updateHashtagData(content);

			expect(mockedStore.content).toBe(content);
			// hashtags は原文のまま保持される
			expect(mockedStore.hashtags).toEqual(['Vue', 'Svelte', '日本語']);
			// 投稿用 tags は英字部分を小文字化して格納される
			expect(mockedStore.tags).toEqual([['t', 'vue'], ['t', 'svelte'], ['t', '日本語']]);
		});
	});
});
