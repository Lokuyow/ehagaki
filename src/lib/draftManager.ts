import type { Draft, DraftChannelData, DraftReplyQuoteData } from './types';
import type { MediaGalleryItem } from './types';
import { STORAGE_KEYS, MAX_DRAFTS, DRAFT_PREVIEW_LENGTH } from './constants';
import { createSanitizedDraftContainer } from './draftHtmlSanitizer';
import { draftsRepository, type DraftsRepositoryOptions } from './storage/draftsRepository';
import { get as getStore } from 'svelte/store';
import { locale, _ } from 'svelte-i18n';

export type SaveDraftResult = {
    success: boolean;
    needsConfirmation: boolean;
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
        return drafts.sort((a, b) => b.timestamp - a.timestamp);
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
export function generatePreview(htmlContent: string, galleryItems?: MediaGalleryItem[], replyQuoteData?: DraftReplyQuoteData, channelData?: DraftChannelData): string {
    // HTMLタグを除去してテキストのみを抽出
    const tempDiv = createSanitizedDraftContainer(htmlContent, document);

    // 画像と動画の有無をチェック（エディタ内 + ギャラリーアイテム）
    const hasEditorImage = tempDiv.querySelector('img:not([data-custom-emoji]):not(.custom-emoji-inline[alt])') !== null;
    const hasEditorVideo = tempDiv.querySelector('video') !== null;
    const hasGalleryImage = galleryItems?.some(item => !item.isPlaceholder && item.type === 'image') ?? false;
    const hasGalleryVideo = galleryItems?.some(item => !item.isPlaceholder && item.type === 'video') ?? false;
    const hasImage = hasEditorImage || hasGalleryImage;
    const hasVideo = hasEditorVideo || hasGalleryVideo;

    // テキストコンテンツを取得し、改行で分割して最初の非空行を取得
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const lines = text.split('\n').filter(line => line.trim());
    const firstLine = lines[0] || '';

    // ロケールと翻訳関数を取得
    const loc = (getStore(locale) as string) || 'en';
    const t = getStore(_) as (id: string | { id: string }, values?: Record<string, any>) => string;

    // メディアラベルを取得
    let imageLabel = '[画像]';
    let videoLabel = '[動画]';
    try {
        imageLabel = t('draft.media.image') || (loc.startsWith('ja') ? '[画像]' : '[Image]');
        videoLabel = t('draft.media.video') || (loc.startsWith('ja') ? '[動画]' : '[Video]');
    } catch {
        // 翻訳が取得できない場合はデフォルト値を使用
        imageLabel = loc.startsWith('ja') ? '[画像]' : '[Image]';
        videoLabel = loc.startsWith('ja') ? '[動画]' : '[Video]';
    }

    // リプライ・引用ラベルを取得
    let replyLabel = '[リプライ]';
    let quoteLabel = '[引用]';
    try {
        replyLabel = t('draft.media.reply') || (loc.startsWith('ja') ? '[リプライ]' : '[Reply]');
        quoteLabel = t('draft.media.quote') || (loc.startsWith('ja') ? '[引用]' : '[Quote]');
    } catch {
        replyLabel = loc.startsWith('ja') ? '[リプライ]' : '[Reply]';
        quoteLabel = loc.startsWith('ja') ? '[引用]' : '[Quote]';
    }

    // メディアラベルを構築
    const mediaLabels: string[] = [];
    const hasReply = !!replyQuoteData
        && ('reply' in replyQuoteData ? !!replyQuoteData.reply : replyQuoteData.mode === 'reply');
    const quoteCount = !replyQuoteData
        ? 0
        : 'quotes' in replyQuoteData
            ? replyQuoteData.quotes.length
            : replyQuoteData.mode === 'quote'
                ? 1
                : 0;
    if (hasReply) mediaLabels.push(replyLabel);
    if (quoteCount > 0) mediaLabels.push(quoteLabel);
    if (channelData?.name) mediaLabels.push(`#${channelData.name}`);
    if (hasImage) mediaLabels.push(imageLabel);
    if (hasVideo) mediaLabels.push(videoLabel);
    const mediaText = mediaLabels.join('');

    // テキストがある場合
    if (firstLine) {
        // テキスト + メディアラベルの組み合わせ
        if (mediaText) {
            const combined = `${firstLine} ${mediaText}`;
            if (combined.length > DRAFT_PREVIEW_LENGTH) {
                // テキストを切り詰めてメディアラベルを追加
                const maxTextLength = DRAFT_PREVIEW_LENGTH - mediaText.length - 2; // スペースと省略記号分
                if (maxTextLength > 0) {
                    return `${firstLine.substring(0, maxTextLength)}… ${mediaText}`;
                }
                // メディアラベルのみ表示
                return mediaText;
            }
            return combined;
        }
        // テキストのみの場合
        if (firstLine.length > DRAFT_PREVIEW_LENGTH) {
            return firstLine.substring(0, DRAFT_PREVIEW_LENGTH) + '…';
        }
        return firstLine;
    }

    // テキストがない場合はメディアラベルのみ
    if (mediaText) {
        return mediaText;
    }

    // テキストもメディアもない場合
    try {
        return t('draft.no_content') || (loc.startsWith('ja') ? '(内容なし)' : '(No content)');
    } catch {
        return loc.startsWith('ja') ? '(内容なし)' : '(No content)';
    }
}

/**
 * ユニークIDを生成
 */
function generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 新しい下書きを保存する
 * @returns 保存が成功した場合はtrue、上限に達してユーザーの確認が必要な場合はfalse
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
                return { success: false, needsConfirmation: true, drafts };
            }

            const timestamp = Date.now();
            const newDraft: Draft = {
                id: generateId(),
                content: htmlContent,
                preview: generatePreview(htmlContent, galleryItems, replyQuoteData, channelData),
                timestamp,
                galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
                channelData: channelData || undefined,
                replyQuoteData: replyQuoteData || undefined,
            };

            await draftsRepository.put({
                ...newDraft,
                pubkeyHex: options.pubkeyHex ?? null,
            });

            return {
                success: true,
                needsConfirmation: false,
                drafts: [newDraft, ...drafts].sort((a, b) => b.timestamp - a.timestamp),
            };
        },
        () => {
            const drafts = loadDraftsFromStorage();

            if (drafts.length >= MAX_DRAFTS) {
                return { success: false, needsConfirmation: true, drafts };
            }

            const newDraft: Draft = {
                id: generateId(),
                content: htmlContent,
                preview: generatePreview(htmlContent, galleryItems, replyQuoteData, channelData),
                timestamp: Date.now(),
                galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
                channelData: channelData || undefined,
                replyQuoteData: replyQuoteData || undefined,
            };

            const updatedDrafts = [newDraft, ...drafts];
            saveDraftsToStorage(updatedDrafts);

            return { success: true, needsConfirmation: false, drafts: updatedDrafts };
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
): Promise<Draft[]> {
    return runWithLocalStorageFallback(
        async () => {
            const drafts = await draftsRepository.getAll(options);

            // 最も古い下書きを削除（配列の末尾）
            const remainingDrafts = drafts.slice(0, MAX_DRAFTS - 1);
            const oldestDraft = drafts[MAX_DRAFTS - 1];

            const newDraft: Draft = {
                id: generateId(),
                content: htmlContent,
                preview: generatePreview(htmlContent, galleryItems, replyQuoteData, channelData),
                timestamp: Date.now(),
                galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
                channelData: channelData || undefined,
                replyQuoteData: replyQuoteData || undefined,
            };

            if (oldestDraft) {
                await draftsRepository.delete(oldestDraft.id);
            }
            await draftsRepository.put({
                ...newDraft,
                pubkeyHex: options.pubkeyHex ?? null,
            });

            return [newDraft, ...remainingDrafts].sort((a, b) => b.timestamp - a.timestamp);
        },
        () => {
            const drafts = loadDraftsFromStorage();
            const remainingDrafts = drafts.slice(0, MAX_DRAFTS - 1);

            const newDraft: Draft = {
                id: generateId(),
                content: htmlContent,
                preview: generatePreview(htmlContent, galleryItems, replyQuoteData, channelData),
                timestamp: Date.now(),
                galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
                channelData: channelData || undefined,
                replyQuoteData: replyQuoteData || undefined,
            };

            const updatedDrafts = [newDraft, ...remainingDrafts];
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
