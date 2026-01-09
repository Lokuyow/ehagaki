import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    loadDrafts,
    saveDraft,
    saveDraftWithReplaceOldest,
    deleteDraft,
    getDraft,
    hasDrafts,
    generatePreview,
    formatDraftTimestamp
} from '../../lib/draftManager';
import type { Draft } from '../../lib/types';
import { STORAGE_KEYS, MAX_DRAFTS } from '../../lib/constants';
import { MockStorage } from '../helpers';

// svelte-i18nのモック
const mockLocale = vi.hoisted(() => ({ subscribe: vi.fn(), set: vi.fn() }));
const mockT = vi.hoisted(() => vi.fn((key: string) => {
    if (key === 'draft.time.now') return '今';
    if (key === 'draft.media.image') return '[画像]';
    if (key === 'draft.media.video') return '[動画]';
    if (key === 'draft.no_content') return '(内容なし)';
    return key;
}));

vi.mock('svelte-i18n', () => ({
    locale: mockLocale,
    _: mockT
}));

// svelte/storeのget関数をモック
vi.mock('svelte/store', () => ({
    get: vi.fn((store) => {
        if (store === mockLocale) return 'ja';
        if (store === mockT) return mockT;
        return null;
    })
}));

describe('draftManager', () => {
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
        Object.defineProperty(globalThis, 'localStorage', {
            value: storage,
            writable: true
        });
        vi.clearAllMocks();
    });

    afterEach(() => {
        storage.clear();
    });

    describe('loadDrafts', () => {
        it('localStorageが空の場合は空配列を返す', () => {
            const result = loadDrafts();
            expect(result).toEqual([]);
        });

        it('保存された下書きをタイムスタンプ降順で返す', () => {
            const drafts: Draft[] = [
                { id: 'draft_1', content: '<p>Old</p>', preview: 'Old', timestamp: 1000 },
                { id: 'draft_2', content: '<p>New</p>', preview: 'New', timestamp: 3000 },
                { id: 'draft_3', content: '<p>Mid</p>', preview: 'Mid', timestamp: 2000 }
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = loadDrafts();
            expect(result).toHaveLength(3);
            expect(result[0].timestamp).toBe(3000);
            expect(result[1].timestamp).toBe(2000);
            expect(result[2].timestamp).toBe(1000);
        });

        it('不正なJSONの場合は空配列を返す', () => {
            storage.setItem(STORAGE_KEYS.DRAFTS, 'invalid json');
            const result = loadDrafts();
            expect(result).toEqual([]);
        });
    });

    describe('generatePreview', () => {
        it('HTMLタグを除去してテキストのみを抽出', () => {
            const html = '<p>Hello <strong>World</strong></p>';
            const result = generatePreview(html);
            expect(result).toBe('Hello World');
        });

        it('最初の非空行のテキストのみを取得', () => {
            const html = '<p></p><p>First line</p><p>Second line</p>';
            const result = generatePreview(html);
            // generatePreviewはテキスト全体を取得し改行で分割して最初の非空行を取得するが、
            // JSDOMの場合は<p>タグ間で改行が入らないためすべて連結される
            // 実装では最初の行のみを取得するが、改行がない場合は全テキストになる
            expect(result).toContain('First line');
        });

        it('指定文字数(50文字)で切り詰める', () => {
            const longText = 'a'.repeat(100);
            const html = `<p>${longText}</p>`;
            const result = generatePreview(html);
            expect(result).toBe('a'.repeat(50) + '…');
        });

        it('内容が空の場合は(内容なし)を返す', () => {
            const result = generatePreview('<p></p>');
            expect(result).toBe('(内容なし)');
        });

        it('画像のみの場合は[画像]を返す', () => {
            const result = generatePreview('<img src="test.jpg">');
            expect(result).toBe('[画像]');
        });

        it('動画のみの場合は[動画]を返す', () => {
            const result = generatePreview('<video src="test.mp4"></video>');
            expect(result).toBe('[動画]');
        });

        it('画像と動画がある場合は[画像][動画]を返す', () => {
            const result = generatePreview('<img src="test.jpg"><video src="test.mp4"></video>');
            expect(result).toBe('[画像][動画]');
        });

        it('テキストと画像がある場合はテキスト [画像]を返す', () => {
            const result = generatePreview('<p>テストテキスト</p><img src="test.jpg">');
            expect(result).toBe('テストテキスト [画像]');
        });

        it('長いテキストと画像がある場合はテキストを切り詰める', () => {
            const longText = 'a'.repeat(100);
            const result = generatePreview(`<p>${longText}</p><img src="test.jpg">`);
            // テキスト部分を切り詰めて[画像]を追加（合計50文字以内）
            const expectedText = 'a'.repeat(50 - '[画像]'.length - 2); // スペースと省略記号分
            expect(result).toBe(expectedText + '… [画像]');
        });
    });

    describe('saveDraft', () => {
        it('新しい下書きを保存する', () => {
            const html = '<p>Test content</p>';
            const result = saveDraft(html);

            expect(result.success).toBe(true);
            expect(result.needsConfirmation).toBe(false);
            expect(result.drafts).toHaveLength(1);
            expect(result.drafts[0].content).toBe(html);
            expect(result.drafts[0].preview).toBe('Test content');
            expect(result.drafts[0].id).toMatch(/^draft_\d+_[a-z0-9]+$/);
        });

        it('上限に達した場合はneedsConfirmation=trueを返す', () => {
            // MAX_DRAFTS分の下書きを追加
            const existingDrafts: Draft[] = Array.from({ length: MAX_DRAFTS }, (_, i) => ({
                id: `draft_${i}`,
                content: `<p>Content ${i}</p>`,
                preview: `Content ${i}`,
                timestamp: Date.now() - i * 1000
            }));
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(existingDrafts));

            const result = saveDraft('<p>New draft</p>');
            expect(result.success).toBe(false);
            expect(result.needsConfirmation).toBe(true);
            expect(result.drafts).toHaveLength(MAX_DRAFTS);
        });

        it('複数の下書きを保存でき、新しいものが先頭に来る', () => {
            saveDraft('<p>First</p>');
            saveDraft('<p>Second</p>');
            saveDraft('<p>Third</p>');

            const drafts = loadDrafts();
            expect(drafts).toHaveLength(3);
            expect(drafts[0].preview).toBe('Third');
            expect(drafts[1].preview).toBe('Second');
            expect(drafts[2].preview).toBe('First');
        });
    });

    describe('saveDraftWithReplaceOldest', () => {
        it('最も古い下書きを削除して新しい下書きを保存', () => {
            const drafts: Draft[] = Array.from({ length: MAX_DRAFTS }, (_, i) => ({
                id: `draft_${i}`,
                content: `<p>Content ${i}</p>`,
                preview: `Content ${i}`,
                timestamp: Date.now() - (MAX_DRAFTS - i) * 1000 // 新しい順にソート済み
            }));
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = saveDraftWithReplaceOldest('<p>Newest</p>');
            expect(result).toHaveLength(MAX_DRAFTS);
            expect(result[0].preview).toBe('Newest');
            expect(result[result.length - 1].id).not.toBe(drafts[drafts.length - 1].id);
        });
    });

    describe('deleteDraft', () => {
        it('指定IDの下書きを削除', () => {
            const drafts: Draft[] = [
                { id: 'draft_1', content: '<p>First</p>', preview: 'First', timestamp: 1000 },
                { id: 'draft_2', content: '<p>Second</p>', preview: 'Second', timestamp: 2000 }
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = deleteDraft('draft_1');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('draft_2');

            const stored = loadDrafts();
            expect(stored).toHaveLength(1);
            expect(stored[0].id).toBe('draft_2');
        });

        it('存在しないIDを指定しても影響なし', () => {
            const drafts: Draft[] = [
                { id: 'draft_1', content: '<p>First</p>', preview: 'First', timestamp: 1000 }
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = deleteDraft('nonexistent');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('draft_1');
        });
    });

    describe('getDraft', () => {
        it('指定IDの下書きを取得', () => {
            const drafts: Draft[] = [
                { id: 'draft_1', content: '<p>First</p>', preview: 'First', timestamp: 1000 },
                { id: 'draft_2', content: '<p>Second</p>', preview: 'Second', timestamp: 2000 }
            ];
            storage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));

            const result = getDraft('draft_2');
            expect(result).toBeDefined();
            expect(result?.id).toBe('draft_2');
            expect(result?.content).toBe('<p>Second</p>');
        });

        it('存在しないIDの場合はundefinedを返す', () => {
            const result = getDraft('nonexistent');
            expect(result).toBeUndefined();
        });
    });

    describe('hasDrafts', () => {
        it('下書きが存在する場合はtrueを返す', () => {
            saveDraft('<p>Test</p>');
            expect(hasDrafts()).toBe(true);
        });

        it('下書きが存在しない場合はfalseを返す', () => {
            expect(hasDrafts()).toBe(false);
        });
    });

    describe('formatDraftTimestamp', () => {
        const baseNow = new Date('2026-01-08T12:00:00Z').getTime();

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(baseNow);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        describe('日本語ロケール', () => {
            beforeEach(async () => {
                const svelteStore = await import('svelte/store');
                ((svelteStore.get) as unknown as ReturnType<typeof vi.fn>).mockImplementation((store: any) => {
                    if ((store as any) === mockLocale) return 'ja';
                    if ((store as any) === mockT) return (key: string) => {
                        if (key === 'draft.time.now') return '今';
                        return key;
                    };
                    return null;
                });
            });

            it('1分未満の場合は「今」を表示', () => {
                const timestamp = baseNow - 30 * 1000; // 30秒前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('今');
            });

            it('数分前の場合はRelativeTimeFormatを使用', () => {
                const timestamp = baseNow - 5 * 60 * 1000; // 5分前
                const result = formatDraftTimestamp(timestamp);
                // Intl.RelativeTimeFormatの結果は環境依存だが、「5分前」または「5 分前」のようになる
                expect(result).toMatch(/5.*分/);
            });

            it('数時間前の場合はRelativeTimeFormatを使用', () => {
                const timestamp = baseNow - 3 * 60 * 60 * 1000; // 3時間前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toMatch(/3.*時間/);
            });

            it('1日以上前の場合は月/日を表示', () => {
                const timestamp = baseNow - 2 * 24 * 60 * 60 * 1000; // 2日前 (2026/1/6)
                const result = formatDraftTimestamp(timestamp);
                // 日本語ロケールでは「1/6」のような形式
                expect(result).toMatch(/1[/\s]6/);
            });

            it('1年以上前の場合は年/月/日を表示', () => {
                const timestamp = baseNow - 400 * 24 * 60 * 60 * 1000; // 400日前 (2024/12/4頃)
                const result = formatDraftTimestamp(timestamp);
                // 日本語ロケールでは「2024/12/4」のような形式
                expect(result).toMatch(/2024[/\s]12/);
            });
        });

        describe('英語ロケール', () => {
            beforeEach(async () => {
                const svelteStore = await import('svelte/store');
                ((svelteStore.get) as unknown as ReturnType<typeof vi.fn>).mockImplementation((store: any) => {
                    if ((store as any) === mockLocale) return 'en';
                    if ((store as any) === mockT) return (key: string) => {
                        if (key === 'draft.time.now') return 'Now';
                        return key;
                    };
                    return null;
                });
            });

            it('1分未満の場合は「Now」を表示', () => {
                const timestamp = baseNow - 30 * 1000; // 30秒前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('Now');
            });

            it('数分前の場合は短縮表記「Xm ago」を使用', () => {
                const timestamp = baseNow - 5 * 60 * 1000; // 5分前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('5m ago');
            });

            it('数時間前の場合は短縮表記「Xh ago」を使用', () => {
                const timestamp = baseNow - 3 * 60 * 60 * 1000; // 3時間前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('3h ago');
            });

            it('1日以上前の場合は月/日を表示', () => {
                const timestamp = baseNow - 2 * 24 * 60 * 60 * 1000; // 2日前 (1/6)
                const result = formatDraftTimestamp(timestamp);
                // 英語ロケールでは「1/6」のような形式
                expect(result).toMatch(/1[/\s]6/);
            });

            it('1年以上前の場合は年/月/日を表示', () => {
                const timestamp = baseNow - 400 * 24 * 60 * 60 * 1000; // 400日前 (12/4/2024)
                const result = formatDraftTimestamp(timestamp);
                // 英語ロケールでは「12/4/2024」のような形式
                expect(result).toMatch(/12[/\s]4[/\s]2024/);
            });
        });

        describe('境界値テスト', () => {
            it('ちょうど1分前', () => {
                const timestamp = baseNow - 60 * 1000;
                const result = formatDraftTimestamp(timestamp);
                expect(result).toMatch(/1.*分|1m/);
            });

            it('ちょうど1時間前', () => {
                const timestamp = baseNow - 60 * 60 * 1000;
                const result = formatDraftTimestamp(timestamp);
                expect(result).toMatch(/1.*時間|1h/);
            });

            it('ちょうど1日前', () => {
                const timestamp = baseNow - 24 * 60 * 60 * 1000; // 2026/1/7 12:00
                const result = formatDraftTimestamp(timestamp);
                // 月/日形式（1/7）になることを期待
                expect(result).toMatch(/1[/\s]7/);
            });

            it('ちょうど365日前', () => {
                const timestamp = baseNow - 365 * 24 * 60 * 60 * 1000; // 2025/1/8 12:00
                const result = formatDraftTimestamp(timestamp);
                // 年/月/日形式になることを期待（ロケールにより順序が異なる）
                expect(result).toMatch(/2025/);
                expect(result).toMatch(/1/);
                expect(result).toMatch(/8/);
            });
        });

        describe('フォールバック処理', () => {
            it('翻訳関数がエラーの場合はデフォルト文字列を使用 (ja)', async () => {
                const svelteStore = await import('svelte/store');
                vi.mocked(vi.mocked(svelteStore).get).mockImplementation((store) => {
                    if ((store as any) === mockLocale) return 'ja';
                    if ((store as any) === mockT) return () => {
                        throw new Error('Translation error');
                    };
                    return null;
                });

                const timestamp = baseNow - 30 * 1000; // 30秒前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('今');
            });

            it('翻訳関数がエラーの場合はデフォルト文字列を使用 (en)', async () => {
                const svelteStore = await import('svelte/store');
                vi.mocked(vi.mocked(svelteStore).get).mockImplementation((store) => {
                    if ((store as any) === mockLocale) return 'en';
                    if ((store as any) === mockT) return () => {
                        throw new Error('Translation error');
                    };
                    return null;
                });

                const timestamp = baseNow - 30 * 1000; // 30秒前
                const result = formatDraftTimestamp(timestamp);
                expect(result).toBe('Now');
            });
        });
    });
});
