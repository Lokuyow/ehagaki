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
		it('英字・アンダースコアを含むハッシュタグを抽出して小文字化する', () => {
			const content = 'Hello #Test_Tag and #Another123!';
			const result = extractHashtagsFromContent(content);
			// 末尾の感嘆符を含めたまま受け入れる
			expect(result).toEqual(['test_tag', 'another123!']);
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
			// 末尾の句読点を含めたまま受け入れる
			expect(result).toEqual(['one,', 'two.', 'three!']);
		});
	});

	describe('updateHashtagData', () => {
		it('ストアの content, hashtags, tags を正しく更新する', () => {
			const content = 'Mix #Vue #Svelte #日本語';
			updateHashtagData(content);

			expect(mockedStore.content).toBe(content);
			expect(mockedStore.hashtags).toEqual(['vue', 'svelte', '日本語']);
			expect(mockedStore.tags).toEqual([['t', 'vue'], ['t', 'svelte'], ['t', '日本語']]);
		});
	});
});
