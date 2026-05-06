import {
    createCustomEmojiIdentityKey,
    isValidCustomEmojiUrl,
    normalizeEmojiShortcode,
    normalizeEmojiShortcodeForLookup,
} from "./customEmoji";
import type { RecentCustomEmojiRecord } from "./storage/ehagakiDb";

export const RECENT_CUSTOM_EMOJI_DISPLAY_ROWS = 2;
export const MAX_RECENT_CUSTOM_EMOJI_HISTORY = 100;
export const RECENT_CUSTOM_EMOJI_SCHEMA_VERSION = 1;

export interface CustomEmojiSelection {
    identityKey?: string;
    shortcode: string;
    src: string;
    setAddress?: string | null;
}

export interface RecentCustomEmojiItem extends CustomEmojiSelection {
    identityKey: string;
    shortcodeLower: string;
    setAddress: string | null;
    lastUsedAt: number;
    count: number;
}

function encodeIdentityPart(value: string): string {
    return encodeURIComponent(value);
}

function normalizeSetAddress(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function createRecentCustomEmojiRecordId(params: {
    pubkeyHex: string;
    shortcodeLower: string;
    src: string;
}): string {
    return [
        params.pubkeyHex,
        params.shortcodeLower,
        params.src,
    ].map(encodeIdentityPart).join("|");
}

export function normalizeCustomEmojiSelection(value: CustomEmojiSelection): RecentCustomEmojiItem | null {
    const shortcode = normalizeEmojiShortcode(value.shortcode);
    const shortcodeLower = normalizeEmojiShortcodeForLookup(shortcode);
    if (!shortcode || !shortcodeLower || !isValidCustomEmojiUrl(value.src)) {
        return null;
    }

    const setAddress = normalizeSetAddress(value.setAddress);
    const identityKey = value.identityKey || createCustomEmojiIdentityKey({
        shortcodeLower,
        src: value.src,
        setAddress,
    });

    return {
        identityKey,
        shortcode,
        shortcodeLower,
        src: value.src,
        setAddress,
        lastUsedAt: 0,
        count: 0,
    };
}

export function createRecentCustomEmojiRecord(params: {
    pubkeyHex: string;
    emoji: CustomEmojiSelection;
    existing?: RecentCustomEmojiRecord | null;
    now: number;
}): RecentCustomEmojiRecord | null {
    const normalized = normalizeCustomEmojiSelection(params.emoji);
    if (!params.pubkeyHex || !normalized) return null;

    const id = createRecentCustomEmojiRecordId({
        pubkeyHex: params.pubkeyHex,
        shortcodeLower: normalized.shortcodeLower,
        src: normalized.src,
    });

    return {
        id,
        pubkeyHex: params.pubkeyHex,
        shortcode: normalized.shortcode,
        shortcodeLower: normalized.shortcodeLower,
        src: normalized.src,
        setAddress: normalized.setAddress,
        lastUsedAt: params.now,
        count: (params.existing?.count ?? 0) + 1,
        createdAt: params.existing?.createdAt ?? params.now,
        updatedAt: params.now,
        schemaVersion: RECENT_CUSTOM_EMOJI_SCHEMA_VERSION,
    };
}

export function toRecentCustomEmojiItem(record: RecentCustomEmojiRecord): RecentCustomEmojiItem {
    return {
        identityKey: createCustomEmojiIdentityKey({
            shortcodeLower: record.shortcodeLower,
            src: record.src,
            setAddress: record.setAddress,
        }),
        shortcode: record.shortcode,
        shortcodeLower: record.shortcodeLower,
        src: record.src,
        setAddress: record.setAddress,
        lastUsedAt: record.lastUsedAt,
        count: record.count,
    };
}

export function sortRecentCustomEmojiRecords(
    left: RecentCustomEmojiRecord,
    right: RecentCustomEmojiRecord,
): number {
    if (right.lastUsedAt !== left.lastUsedAt) return right.lastUsedAt - left.lastUsedAt;
    return left.shortcodeLower.localeCompare(right.shortcodeLower);
}

export function getRecentCustomEmojiDisplayLimit(
    columnCount: number,
    rowCount = RECENT_CUSTOM_EMOJI_DISPLAY_ROWS,
): number {
    return Math.max(0, Math.floor(columnCount) * Math.max(0, Math.floor(rowCount)));
}
