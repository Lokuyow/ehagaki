import type { Draft } from './types';
import type { MediaGalleryItem } from './types';
import { STORAGE_KEYS, MAX_DRAFTS, DRAFT_PREVIEW_LENGTH } from './constants';
import { get as getStore } from 'svelte/store';
import { locale, _ } from 'svelte-i18n';

/**
 * 下書きをlocalStorageから読み込む
 */
export function loadDrafts(): Draft[] {
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

/**
 * HTMLコンテンツからプレビューテキストを生成
 * テキスト、画像、動画の有無を検出し、適切なプレビュー文字列を生成
 */
export function generatePreview(htmlContent: string, galleryItems?: MediaGalleryItem[]): string {
    // HTMLタグを除去してテキストのみを抽出
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // 画像と動画の有無をチェック（エディタ内 + ギャラリーアイテム）
    const hasEditorImage = tempDiv.querySelector('img') !== null;
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

    // メディアラベルを構築
    const mediaLabels: string[] = [];
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
export function saveDraft(htmlContent: string, galleryItems?: MediaGalleryItem[]): { success: boolean; needsConfirmation: boolean; drafts: Draft[] } {
    const drafts = loadDrafts();

    // 上限チェック
    if (drafts.length >= MAX_DRAFTS) {
        return { success: false, needsConfirmation: true, drafts };
    }

    const newDraft: Draft = {
        id: generateId(),
        content: htmlContent,
        preview: generatePreview(htmlContent, galleryItems),
        timestamp: Date.now(),
        galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
    };

    const updatedDrafts = [newDraft, ...drafts];
    saveDraftsToStorage(updatedDrafts);

    return { success: true, needsConfirmation: false, drafts: updatedDrafts };
}

/**
 * 最も古い下書きを削除して新しい下書きを保存する
 */
export function saveDraftWithReplaceOldest(htmlContent: string, galleryItems?: MediaGalleryItem[]): Draft[] {
    const drafts = loadDrafts();

    // 最も古い下書きを削除（配列の末尾）
    const remainingDrafts = drafts.slice(0, MAX_DRAFTS - 1);

    const newDraft: Draft = {
        id: generateId(),
        content: htmlContent,
        preview: generatePreview(htmlContent, galleryItems),
        timestamp: Date.now(),
        galleryItems: galleryItems && galleryItems.length > 0 ? galleryItems : undefined,
    };

    const updatedDrafts = [newDraft, ...remainingDrafts];
    saveDraftsToStorage(updatedDrafts);

    return updatedDrafts;
}

/**
 * 指定IDの下書きを削除する
 */
export function deleteDraft(id: string): Draft[] {
    const drafts = loadDrafts();
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    saveDraftsToStorage(updatedDrafts);
    return updatedDrafts;
}

/**
 * 全ての下書きを削除する
 */
export function deleteAllDrafts(): Draft[] {
    saveDraftsToStorage([]);
    return [];
}

/**
 * 指定IDの下書きを取得する
 */
export function getDraft(id: string): Draft | undefined {
    const drafts = loadDrafts();
    return drafts.find(draft => draft.id === id);
}

/**
 * 下書きが存在するかチェック
 */
export function hasDrafts(): boolean {
    return loadDrafts().length > 0;
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
