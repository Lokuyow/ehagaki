import type { Draft, DraftChannelData, DraftReplyQuoteData } from './types';
import type { MediaGalleryItem } from './types';
import { STORAGE_KEYS, MAX_DRAFTS } from './constants';
import { draftsRepository, type DraftsRepositoryOptions } from './storage/draftsRepository';
import { createPersistedDraft } from './draftPersistenceUtils';
import { generateDraftPreview } from './draftPreviewUtils';
import { compareDraftsByDisplayOrder } from './draftSortUtils';
import { get as getStore } from 'svelte/store';
import { locale, _ } from 'svelte-i18n';

export type SaveDraftResult =
    | {
        status: "saved";
        draft: Draft;
        drafts: Draft[];
    }
    | {
        status: "confirmation-required";
        drafts: Draft[];
    };

/**
 * 下書きをlocalStorageから読み込む
 */
function loadDraftsFromStorage(): Draft[] {
    const draftsJson = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (!draftsJson) return [];

    try {
        const drafts = JSON.parse(draftsJson) as Draft[];
        // タイムスタンプの降順でソート（新しいものが先頭）
        return drafts.sort(compareDraftsByDisplayOrder);
    } catch {
        return [];
    }
}

/**
 * 下書きをlocalStorageに保存する
 */
function saveDraftsToStorage(drafts: Draft[]): void {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
}

async function runWithLocalStorageFallback<T>(
    runIndexedDb: () => Promise<T>,
    runFallback: () => T,
): Promise<T> {
    try {
        return await runIndexedDb();
    } catch {
        return runFallback();
    }
}

/**
 * 下書きをIndexedDBから読み込む
 */
export async function loadDrafts(options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
    return runWithLocalStorageFallback(
        () => draftsRepository.getAll(options),
        loadDraftsFromStorage,
    );
}

/**
 * HTMLコンテンツからプレビューテキストを生成
 * テキスト、画像、動画の有無を検出し、適切なプレビュー文字列を生成
 */
export const generatePreview = generateDraftPreview;

/**
 * ユニークIDを生成
 */
function generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 新しい下書きを保存する
 * @returns 保存完了、または上限確認が必要であることを表す結果
 */
export async function saveDraft(
    htmlContent: string,
    galleryItems?: MediaGalleryItem[],
    replyQuoteData?: DraftReplyQuoteData,
    channelData?: DraftChannelData,
    options: DraftsRepositoryOptions = {},
): Promise<SaveDraftResult> {
    return runWithLocalStorageFallback(
        async () => {
            const drafts = await draftsRepository.getAll(options);

            // 上限チェック
            if (drafts.length >= MAX_DRAFTS) {
                return { status: "confirmation-required" as const, drafts };
            }

            const timestamp = Date.now();
            const newDraft = createPersistedDraft({
                id: generateId(),
                htmlContent,
                timestamp,
                galleryItems,
                replyQuoteData,
                channelData,
                buildPreview: generatePreview,
            });

            await draftsRepository.put({
                ...newDraft,
                pubkeyHex: options.pubkeyHex ?? null,
            });

            return {
                status: "saved" as const,
                draft: newDraft,
                drafts: [newDraft, ...drafts].sort(compareDraftsByDisplayOrder),
            };
        },
        () => {
            const drafts = loadDraftsFromStorage();

            if (drafts.length >= MAX_DRAFTS) {
                return { status: "confirmation-required" as const, drafts };
            }

            const newDraft = createPersistedDraft({
                id: generateId(),
                htmlContent,
                timestamp: Date.now(),
                galleryItems,
                replyQuoteData,
                channelData,
                buildPreview: generatePreview,
            });

            const updatedDrafts = [newDraft, ...drafts];
            saveDraftsToStorage(updatedDrafts);

            return {
                status: "saved" as const,
                draft: newDraft,
                drafts: updatedDrafts.sort(compareDraftsByDisplayOrder),
            };
        },
    );
}

/**
 * 最も古い下書きを削除して新しい下書きを保存する
 */
export async function saveDraftWithReplaceOldest(
    htmlContent: string,
    galleryItems?: MediaGalleryItem[],
    replyQuoteData?: DraftReplyQuoteData,
    channelData?: DraftChannelData,
    options: DraftsRepositoryOptions = {},
): Promise<{ status: "saved"; draft: Draft; drafts: Draft[] }> {
    return runWithLocalStorageFallback(
        async () => {
            const newDraft = createPersistedDraft({
                id: generateId(),
                htmlContent,
                timestamp: Date.now(),
                galleryItems,
                replyQuoteData,
                channelData,
                buildPreview: generatePreview,
            });

            const drafts = await draftsRepository.replaceOldest({
                ...newDraft,
                pubkeyHex: options.pubkeyHex ?? null,
            }, options);

            return { status: "saved" as const, draft: newDraft, drafts };
        },
        () => {
            const drafts = loadDraftsFromStorage();
            const remainingDrafts = drafts.slice(0, MAX_DRAFTS - 1);

            const newDraft = createPersistedDraft({
                id: generateId(),
                htmlContent,
                timestamp: Date.now(),
                galleryItems,
                replyQuoteData,
                channelData,
                buildPreview: generatePreview,
            });

            const updatedDrafts = [newDraft, ...remainingDrafts];
            saveDraftsToStorage(updatedDrafts);

            return {
                status: "saved" as const,
                draft: newDraft,
                drafts: updatedDrafts.sort(compareDraftsByDisplayOrder),
            };
        },
    );
}

/**
 * 下書きのピン留め状態を切り替える
 */
export async function toggleDraftPinned(
    id: string,
    pinned: boolean,
    options: DraftsRepositoryOptions = {},
): Promise<Draft[]> {
    return runWithLocalStorageFallback(
        async () => {
            await draftsRepository.setPinned(id, pinned);
            return draftsRepository.getAll(options);
        },
        () => {
            const drafts = loadDraftsFromStorage();
            const updatedDrafts = drafts
                .map((draft) => draft.id === id ? { ...draft, pinned: pinned || undefined } : draft)
                .sort(compareDraftsByDisplayOrder);
            saveDraftsToStorage(updatedDrafts);
            return updatedDrafts;
        },
    );
}

/**
 * 指定IDの下書きを削除する
 */
export async function deleteDraft(id: string, options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
    return runWithLocalStorageFallback(
        async () => {
            await draftsRepository.delete(id);
            return draftsRepository.getAll(options);
        },
        () => {
            const drafts = loadDraftsFromStorage();
            const updatedDrafts = drafts.filter(draft => draft.id !== id);
            saveDraftsToStorage(updatedDrafts);
            return updatedDrafts;
        },
    );
}

/**
 * 全ての下書きを削除する
 */
export async function deleteAllDrafts(options: DraftsRepositoryOptions = {}): Promise<Draft[]> {
    return runWithLocalStorageFallback(
        async () => {
            await draftsRepository.deleteAll(options);
            return [];
        },
        () => {
            saveDraftsToStorage([]);
            return [];
        },
    );
}

/**
 * 指定IDの下書きを取得する
 */
export async function getDraft(id: string, options: DraftsRepositoryOptions = {}): Promise<Draft | undefined> {
    const drafts = await loadDrafts(options);
    return drafts.find(draft => draft.id === id);
}

/**
 * 下書きが存在するかチェック
 */
export async function hasDrafts(options: DraftsRepositoryOptions = {}): Promise<boolean> {
    return (await loadDrafts(options)).length > 0;
}

/**
 * 日時をフォーマット（相対時間または日付） — 国際化対応
 */
export function formatDraftTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    // ロケールと翻訳関数を取得
    const loc = (getStore(locale) as string) || 'en';
    const t = getStore(_) as (id: string | { id: string }, values?: Record<string, any>) => string;
    const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });

    if (diff < minute) {
        // 'Now' は翻訳キーを使用
        try {
            return t('draft.time.now');
        } catch {
            return loc.startsWith('ja') ? '今' : 'Now';
        }
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        // 英語の場合は短縮表記（'ago' を付与）: 1m ago, 5m ago
        if (loc.startsWith('en')) {
            return `${minutes}m ago`;
        }
        return rtf.format(-minutes, 'minute');
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        // 英語の場合は短縮表記（'ago' を付与）: 1h ago, 2h ago
        if (loc.startsWith('en')) {
            return `${hours}h ago`;
        }
        return rtf.format(-hours, 'hour');
    } else {
        const date = new Date(timestamp);
        const oneYear = 365 * day;
        // 1年未満は月/日、1年以上は年/月/日をロケールに従って表示
        if (now - timestamp < oneYear) {
            return new Intl.DateTimeFormat(loc, { month: 'numeric', day: 'numeric' }).format(date);
        }
        return new Intl.DateTimeFormat(loc, { year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
    }
}
