import { RelayConfigUtils } from "./relayConfigUtils";
import {
    inferPostMediaKind,
    normalizePostMediaUrl,
    normalizeSafeExternalMediaUrl,
} from "./postMediaCacheUtils";
import {
    buildCustomEmojiTagMap,
    normalizeEmojiShortcodeForLookup,
} from "./customEmoji";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import type { FullscreenMediaItem } from "./types";
import type {
    ChannelMetadataCache,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import { CHANNEL_TEMPORARY_READ_RELAY_LIMIT } from "./channelContextConstants";

const CUSTOM_EMOJI_SHORTCODE_PATTERN = /:([^\s:]+):/g;

export type PostHistoryPreviewSegment =
    | {
        type: "text";
        text: string;
    }
    | {
        type: "media";
        url: string;
        normalizedUrl: string;
        media: PostHistoryRecord["media"][number];
    }
    | {
        type: "emoji";
        shortcode: string;
        shortcodeLower: string;
        rawShortcodeText: string;
        url: string;
    };

export type PostHistoryPreviewContent = {
    segments: PostHistoryPreviewSegment[];
    emojiUrls: string[];
};

export type PostHistoryDisplayMediaKind = "image" | "video" | "other";

export type PostHistoryResolvedMedia = PostHistoryRecord["media"][number] & {
    id: string;
    normalizedUrl: string;
    kind: PostHistoryDisplayMediaKind;
};

export type PostHistoryImageGridRow = {
    items: PostHistoryResolvedMedia[];
    slotCount: 1 | 2 | 3;
};

export type PostHistoryMediaLayout = {
    items: PostHistoryResolvedMedia[];
    images: PostHistoryResolvedMedia[];
    videos: PostHistoryResolvedMedia[];
    others: PostHistoryResolvedMedia[];
    imageRows: PostHistoryImageGridRow[];
    fullscreenMediaItems: FullscreenMediaItem[];
};

export interface PostHistoryMediaDimensionHints {
    width?: number;
    height?: number;
    aspectRatio: string;
    hasExactDimensions: boolean;
}

export type PostHistoryMediaRenderState =
    | "ready"
    | "cache-materializing"
    | "placeholder"
    | "loading"
    | "error"
    | "unknown";

const URL_PATTERN = /https?:\/\/[^\s]+/g;

const IMAGE_ROW_PATTERNS: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [2, 2],
    5: [3, 2],
    6: [3, 3],
    7: [3, 3, 1],
    8: [3, 3, 2],
    9: [3, 3, 3],
};

export type ChannelDisplayState = {
    status: "loading" | "resolved" | "failed";
    name: string | null;
};

export function canContinueRelayHistory(
    result: PostHistoryRelayFetchResult,
): boolean {
    if (result.nextUntil === null) {
        return false;
    }

    return result.status === "success"
        ? result.hasMore
        : result.events.length > 0;
}

export function resolveSyncStatusAfterFetch(
    result: PostHistoryRelayFetchResult,
    didMateriallyChange: boolean,
): "idle" | "synced" | "failed" {
    if (result.status === "error") {
        return "failed";
    }

    if (result.status === "timeout") {
        return "idle";
    }

    return didMateriallyChange ? "synced" : "idle";
}

export function toChannelDisplayState(
    cachedRecord: ChannelMetadataCache | null,
    canLoad: boolean,
): ChannelDisplayState {
    if (!cachedRecord) {
        return {
            status: canLoad ? "loading" : "failed",
            name: null,
        };
    }

    return {
        status: cachedRecord.name ? "resolved" : "failed",
        name: cachedRecord.name,
    };
}

export function buildChannelRelayHints(
    sourcePost: PostHistoryRecord | undefined,
    cachedRecord: ChannelMetadataCache | null,
): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        [
            ...(sourcePost?.channelRelayHints ?? []),
            ...(sourcePost?.fetchedRelays ?? []),
            ...(sourcePost?.relayHints ?? []),
            ...(sourcePost?.acceptedRelays ?? []),
            ...(cachedRecord?.relayHints ?? []),
            ...(cachedRecord?.relays ?? []),
        ],
        { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
    );
}

export function resolveSafePage(
    page: number,
    totalCount: number,
    pageSize: number,
): number {
    const nextTotalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    return totalCount === 0 ? 1 : Math.min(page, nextTotalPages);
}

export function formatPostedAt(
    postedAt: number,
    now: number = Date.now(),
): string {
    const postedDate = new Date(postedAt);
    const nowDate = new Date(now);
    const minuteTimeFormat: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
    };

    if (isSameLocalDate(postedDate, nowDate)) {
        return new Intl.DateTimeFormat(undefined, minuteTimeFormat).format(
            postedDate,
        );
    }

    const monthDayTimeFormat: Intl.DateTimeFormatOptions = {
        month: "numeric",
        day: "numeric",
        ...minuteTimeFormat,
    };

    if (postedDate.getFullYear() === nowDate.getFullYear()) {
        return new Intl.DateTimeFormat(
            undefined,
            monthDayTimeFormat,
        ).format(postedDate);
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }).format(postedDate);
}

export function formatPostedAtExact(
    postedAt: number,
    localeValue?: string | null,
): string {
    return new Intl.DateTimeFormat(localeValue ?? undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(postedAt));
}

export function formatPostHistoryMonthLabel(
    postedAt: number,
    localeValue: string | null | undefined,
    now: number = Date.now(),
): string {
    const postedDate = new Date(postedAt);
    const nowDate = new Date(now);

    if (isSameLocalDate(postedDate, nowDate)) {
        return formatRelativeDayLabel(0, localeValue);
    }

    if (isYesterdayLocal(postedDate, nowDate)) {
        return formatRelativeDayLabel(-1, localeValue);
    }

    if (postedDate.getFullYear() === nowDate.getFullYear()) {
        return new Intl.DateTimeFormat(localeValue ?? undefined, {
            month: "numeric",
            day: "numeric",
            weekday: "short",
        }).format(postedDate);
    }

    return new Intl.DateTimeFormat(localeValue ?? undefined, {
        year: "numeric",
        month: "numeric",
    }).format(postedDate);
}

function isSameLocalDate(date: Date, otherDate: Date): boolean {
    return date.getFullYear() === otherDate.getFullYear() &&
        date.getMonth() === otherDate.getMonth() &&
        date.getDate() === otherDate.getDate();
}

function isYesterdayLocal(date: Date, nowDate: Date): boolean {
    const yesterday = new Date(nowDate);
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameLocalDate(date, yesterday);
}

function formatRelativeDayLabel(
    value: 0 | -1,
    localeValue: string | null | undefined,
): string {
    return new Intl.RelativeTimeFormat(localeValue ?? undefined, {
        numeric: "auto",
    }).format(value, "day");
}

export function buildPreview(content: string): string {
    const normalized = content.trim();
    return normalized || " ";
}

export function resolvePostHistoryMedia(
    media: PostHistoryRecord["media"],
): PostHistoryResolvedMedia[] {
    const items: PostHistoryResolvedMedia[] = [];
    const seenUrls = new Set<string>();

    for (const item of media) {
        const normalizedUrl = normalizeSafeExternalMediaUrl(item.url);
        if (!normalizedUrl || seenUrls.has(normalizedUrl)) {
            continue;
        }

        seenUrls.add(normalizedUrl);

        const inferredKind = inferPostMediaKind({
            url: item.url,
            mimeType: item.mimeType,
        });

        items.push({
            ...item,
            url: normalizedUrl,
            id: normalizedUrl,
            normalizedUrl,
            kind: inferredKind === "image" || inferredKind === "video"
                ? inferredKind
                : "other",
        });
    }

    return items;
}

export function buildPostHistoryImageGridRows(
    images: PostHistoryResolvedMedia[],
): PostHistoryImageGridRow[] {
    const pattern = resolvePostHistoryImageRowPattern(images.length);
    const rows: PostHistoryImageGridRow[] = [];
    let startIndex = 0;

    for (let rowIndex = 0; rowIndex < pattern.length; rowIndex += 1) {
        const rowLength = pattern[rowIndex];
        const items = images.slice(startIndex, startIndex + rowLength);
        startIndex += rowLength;

        rows.push({
            items,
            slotCount: resolvePostHistoryImageRowSlotCount({
                totalCount: images.length,
                rowLength: items.length,
                isFinalRow: rowIndex === pattern.length - 1,
            }),
        });
    }

    return rows;
}

export function buildPostHistoryFullscreenMediaItems(
    images: PostHistoryResolvedMedia[],
): FullscreenMediaItem[] {
    return images.map((item) => ({
        id: item.id,
        src: item.url,
        alt: item.alt,
        type: "image",
        dim: item.dim,
    }));
}

export function resolvePostHistoryMediaAspectRatio(params: {
    dim?: string;
    kind: PostHistoryDisplayMediaKind;
    fallback?: string;
}): string {
    return resolvePostHistoryMediaDimensionHints(params).aspectRatio;
}

export function resolvePostHistoryMediaDimensionHints(params: {
    dim?: string;
    kind: PostHistoryDisplayMediaKind;
    fallback?: string;
}): PostHistoryMediaDimensionHints {
    const fallback = params.fallback ?? (
        params.kind === 'video' ? '16 / 9' : '1 / 1'
    );
    const parsed = parsePostHistoryMediaDimensions(params.dim);

    if (!parsed) {
        return {
            aspectRatio: fallback,
            hasExactDimensions: false,
        };
    }

    return {
        width: parsed.width,
        height: parsed.height,
        aspectRatio: `${parsed.width} / ${parsed.height}`,
        hasExactDimensions: true,
    };
}

export function resolvePostHistoryMediaRenderState(params: {
    hasResolvedCache: boolean;
    cached: boolean;
    previewObjectUrl?: string;
    isLoadingPreview: boolean;
    isCaching: boolean;
    hasFetchFailed: boolean;
    hasMetadataHint: boolean;
}): PostHistoryMediaRenderState {
    if (params.hasFetchFailed) {
        return "error";
    }

    if (params.previewObjectUrl) {
        return "ready";
    }

    if (params.cached || params.isLoadingPreview) {
        return "cache-materializing";
    }

    if (params.isCaching) {
        return "loading";
    }

    if (!params.hasResolvedCache) {
        return params.hasMetadataHint ? "placeholder" : "unknown";
    }

    return params.hasMetadataHint ? "placeholder" : "unknown";
}

export function buildPostHistoryMediaLayout(
    media: PostHistoryRecord["media"],
): PostHistoryMediaLayout {
    const items = resolvePostHistoryMedia(media);
    const images = items.filter((item) => item.kind === "image");
    const videos = items.filter((item) => item.kind === "video");
    const others = items.filter((item) => item.kind === "other");

    return {
        items,
        images,
        videos,
        others,
        imageRows: buildPostHistoryImageGridRows(images),
        fullscreenMediaItems: buildPostHistoryFullscreenMediaItems(images),
    };
}

export function collectPostHistoryMediaUrls(
    posts: ReadonlyArray<Pick<PostHistoryRecord, 'media'>>,
): string[] {
    const urls: string[] = [];
    const seenUrls = new Set<string>();

    for (const post of posts) {
        for (const media of post.media) {
            const normalizedUrl = normalizePostMediaUrl(media.url);
            if (!normalizedUrl || seenUrls.has(normalizedUrl)) {
                continue;
            }

            seenUrls.add(normalizedUrl);
            urls.push(media.url);
        }
    }

    return urls;
}

function parsePostHistoryMediaDimensions(
    dim?: string,
): { width: number; height: number } | null {
    const normalized = dim?.trim();
    if (!normalized) {
        return null;
    }

    const match = normalized.match(/^(\d+)\s*x\s*(\d+)$/i);
    if (!match) {
        return null;
    }

    const width = Number(match[1]);
    const height = Number(match[2]);
    if (
        !Number.isSafeInteger(width) ||
        !Number.isSafeInteger(height) ||
        width <= 0 ||
        height <= 0
    ) {
        return null;
    }

    return { width, height };
}

export function buildPreviewContent(
    post: Pick<PostHistoryRecord, "content" | "tags"> &
        Partial<Pick<PostHistoryRecord, "media">>,
): PostHistoryPreviewContent {
    const normalizedContent = buildPreview(post.content);
    const emojiMap = buildCustomEmojiTagMap(post.tags);
    const mediaMap = buildPostMediaMap(post.media ?? []);
    const segments: PostHistoryPreviewSegment[] = [];
    const emojiUrls = new Set<string>();
    let lastIndex = 0;

    for (const match of normalizedContent.matchAll(CUSTOM_EMOJI_SHORTCODE_PATTERN)) {
        const matchIndex = match.index ?? -1;
        const rawShortcode = match[1] ?? "";
        const rawShortcodeText = match[0] ?? "";

        if (matchIndex < 0 || !rawShortcodeText) {
            continue;
        }

        if (matchIndex > lastIndex) {
            pushTextSegment(
                segments,
                normalizedContent.slice(lastIndex, matchIndex),
                mediaMap,
            );
        }

        const shortcodeLower = normalizeEmojiShortcodeForLookup(rawShortcode);
        const emoji = shortcodeLower ? emojiMap.get(shortcodeLower) : undefined;
        if (emoji) {
            segments.push({
                type: "emoji",
                shortcode: emoji.shortcode,
                shortcodeLower,
                rawShortcodeText,
                url: emoji.url,
            });
            emojiUrls.add(emoji.url);
        } else {
            pushTextSegment(segments, rawShortcodeText, mediaMap);
        }

        lastIndex = matchIndex + rawShortcodeText.length;
    }

    if (lastIndex < normalizedContent.length) {
        pushTextSegment(segments, normalizedContent.slice(lastIndex), mediaMap);
    }

    if (segments.length === 0) {
        segments.push({ type: "text", text: normalizedContent });
    }

    return {
        segments,
        emojiUrls: [...emojiUrls],
    };
}

function resolvePostHistoryImageRowPattern(count: number): number[] {
    const normalizedCount = Number.isFinite(count)
        ? Math.max(0, Math.trunc(count))
        : 0;

    if (normalizedCount === 0) {
        return [];
    }

    const predefinedPattern = IMAGE_ROW_PATTERNS[normalizedCount];
    if (predefinedPattern) {
        return [...predefinedPattern];
    }

    const rows = Array.from(
        { length: Math.floor(normalizedCount / 3) },
        () => 3,
    );
    const remainder = normalizedCount % 3;
    if (remainder > 0) {
        rows.push(remainder);
    }

    return rows;
}

function resolvePostHistoryImageRowSlotCount(params: {
    totalCount: number;
    rowLength: number;
    isFinalRow: boolean;
}): 1 | 2 | 3 {
    const { totalCount, rowLength, isFinalRow } = params;

    if (isFinalRow && totalCount >= 7 && rowLength < 3) {
        return 3;
    }

    if (rowLength >= 3) {
        return 3;
    }

    if (rowLength === 2) {
        return 2;
    }

    return 1;
}

function buildPostMediaMap(
    media: PostHistoryRecord["media"],
): Map<string, PostHistoryRecord["media"][number]> {
    const mediaMap = new Map<string, PostHistoryRecord["media"][number]>();

    for (const item of media) {
        const normalizedUrl = normalizePostMediaUrl(item.url);
        if (!normalizedUrl || mediaMap.has(normalizedUrl)) {
            continue;
        }

        mediaMap.set(normalizedUrl, item);
    }

    return mediaMap;
}

function splitUrlTrailingText(rawUrl: string): {
    url: string;
    trailingText: string;
} {
    const match = rawUrl.match(/[),.!?:;\]\u3001\u3002]+$/u);
    if (!match) {
        return {
            url: rawUrl,
            trailingText: "",
        };
    }

    const trailingText = match[0];
    return {
        url: rawUrl.slice(0, -trailingText.length),
        trailingText,
    };
}

function pushTextSegment(
    segments: PostHistoryPreviewSegment[],
    text: string,
    mediaMap: Map<string, PostHistoryRecord["media"][number]>,
): void {
    if (!text) {
        return;
    }

    let lastIndex = 0;
    for (const match of text.matchAll(URL_PATTERN)) {
        const matchIndex = match.index ?? -1;
        const rawUrl = match[0] ?? "";
        if (matchIndex < 0 || !rawUrl) {
            continue;
        }

        const { url, trailingText } = splitUrlTrailingText(rawUrl);
        const media = mediaMap.get(normalizePostMediaUrl(url));
        if (!media) {
            continue;
        }

        pushPlainTextSegment(segments, text.slice(lastIndex, matchIndex));
        segments.push({
            type: "media",
            url,
            normalizedUrl: normalizePostMediaUrl(url),
            media,
        });
        pushPlainTextSegment(segments, trailingText);
        lastIndex = matchIndex + rawUrl.length;
    }

    if (lastIndex < text.length) {
        pushPlainTextSegment(segments, text.slice(lastIndex));
    }
}

function pushPlainTextSegment(
    segments: PostHistoryPreviewSegment[],
    text: string,
): void {
    if (!text) {
        return;
    }

    const lastSegment = segments[segments.length - 1];
    if (lastSegment?.type === "text") {
        lastSegment.text += text;
        return;
    }

    segments.push({ type: "text", text });
}
