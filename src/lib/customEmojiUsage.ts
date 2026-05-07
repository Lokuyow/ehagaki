import {
    createCustomEmojiIdentityKey,
    isValidCustomEmojiUrl,
    normalizeEmojiShortcode,
    normalizeEmojiShortcodeForLookup,
} from "./customEmoji";
import type { CustomEmojiUsageRecord } from "./storage/ehagakiDb";

export const CUSTOM_EMOJI_USAGE_DISPLAY_ROWS = 2;
export const MAX_CUSTOM_EMOJI_USAGE_HISTORY = 100;
export const CUSTOM_EMOJI_USAGE_SCHEMA_VERSION = 1;

export interface CustomEmojiSelection {
    identityKey?: string;
    shortcode: string;
    src: string;
    setAddress?: string | null;
}

export interface CustomEmojiUsageItem extends CustomEmojiSelection {
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

export function createCustomEmojiUsageRecordId(params: {
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

export function normalizeCustomEmojiSelection(value: CustomEmojiSelection): CustomEmojiUsageItem | null {
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

export function createCustomEmojiUsageRecord(params: {
    pubkeyHex: string;
    emoji: CustomEmojiSelection;
    existing?: CustomEmojiUsageRecord | null;
    now: number;
}): CustomEmojiUsageRecord | null {
    const normalized = normalizeCustomEmojiSelection(params.emoji);
    if (!params.pubkeyHex || !normalized) return null;

    const id = createCustomEmojiUsageRecordId({
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
        schemaVersion: CUSTOM_EMOJI_USAGE_SCHEMA_VERSION,
    };
}

export function toCustomEmojiUsageItem(record: CustomEmojiUsageRecord): CustomEmojiUsageItem {
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

export function sortCustomEmojiUsageByRecency(
    left: CustomEmojiUsageRecord,
    right: CustomEmojiUsageRecord,
): number {
    if (right.lastUsedAt !== left.lastUsedAt) return right.lastUsedAt - left.lastUsedAt;
    return left.shortcodeLower.localeCompare(right.shortcodeLower);
}

export function sortCustomEmojiUsageByFrequency(
    left: CustomEmojiUsageItem,
    right: CustomEmojiUsageItem,
): number {
    if (right.count !== left.count) return right.count - left.count;
    if (right.lastUsedAt !== left.lastUsedAt) return right.lastUsedAt - left.lastUsedAt;
    return left.shortcodeLower.localeCompare(right.shortcodeLower);
}

export function getCustomEmojiUsageDisplayLimit(
    columnCount: number,
    rowCount = CUSTOM_EMOJI_USAGE_DISPLAY_ROWS,
): number {
    return Math.max(0, Math.floor(columnCount) * Math.max(0, Math.floor(rowCount)));
}
