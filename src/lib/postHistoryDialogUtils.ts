import { RelayConfigUtils } from "./relayConfigUtils";
import {
    normalizeEmojiShortcodeForLookup,
    parseEmojiTags,
} from "./customEmoji";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import type {
    ChannelMetadataCache,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

const CUSTOM_EMOJI_SHORTCODE_PATTERN = /:([^\s:]+):/g;

export type PostHistoryPreviewSegment =
    | {
        type: "text";
        text: string;
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
            ...(cachedRecord?.relayHints ?? []),
            ...(cachedRecord?.relays ?? []),
            ...(sourcePost?.relayHints ?? []),
            ...(sourcePost?.fetchedRelays ?? []),
            ...(sourcePost?.acceptedRelays ?? []),
        ],
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
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
    const diffMs = Math.abs(now - postedAt);
    const minuteTimeFormat: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
    };

    if (diffMs < 24 * 60 * 60 * 1000) {
        return new Intl.DateTimeFormat(undefined, minuteTimeFormat).format(
            postedDate,
        );
    }

    const monthDayTimeFormat: Intl.DateTimeFormatOptions = {
        month: "numeric",
        day: "numeric",
        ...minuteTimeFormat,
    };

    if (diffMs < 365 * 24 * 60 * 60 * 1000) {
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

export function buildPreview(content: string): string {
    const normalized = content.trim();
    return normalized || " ";
}

export function buildPreviewContent(
    post: Pick<PostHistoryRecord, "content" | "tags">,
): PostHistoryPreviewContent {
    const normalizedContent = buildPreview(post.content);
    const emojiMap = buildPostEmojiMap(post.tags);
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
            pushTextSegment(segments, rawShortcodeText);
        }

        lastIndex = matchIndex + rawShortcodeText.length;
    }

    if (lastIndex < normalizedContent.length) {
        pushTextSegment(segments, normalizedContent.slice(lastIndex));
    }

    if (segments.length === 0) {
        segments.push({ type: "text", text: normalizedContent });
    }

    return {
        segments,
        emojiUrls: [...emojiUrls],
    };
}

function buildPostEmojiMap(
    tags: string[][],
): Map<string, { shortcode: string; url: string }> {
    const emojiMap = new Map<string, { shortcode: string; url: string }>();

    for (const emoji of parseEmojiTags(tags)) {
        if (emojiMap.has(emoji.shortcodeLower)) {
            continue;
        }

        emojiMap.set(emoji.shortcodeLower, {
            shortcode: emoji.shortcode,
            url: emoji.src,
        });
    }

    return emojiMap;
}

function pushTextSegment(
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