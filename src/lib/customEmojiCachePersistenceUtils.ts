export interface CustomEmojiCacheRecordLike {
    meta?: {
        schemaVersion?: number;
    } | null;
    items?: unknown;
}

export function restoreCachedEmojiItems<TItem>({
    record,
    schemaVersion,
    normalizeItem,
    mergeItems,
}: {
    record: CustomEmojiCacheRecordLike | null | undefined;
    schemaVersion: number;
    normalizeItem: (value: unknown, fallbackSortIndex: number) => TItem | null;
    mergeItems: (groups: TItem[][]) => TItem[];
}): TItem[] {
    if (
        !record?.meta ||
        record.meta.schemaVersion !== schemaVersion ||
        !Array.isArray(record.items)
    ) {
        return [];
    }

    return mergeItems([
        record.items
            .map((item, index) => normalizeItem(item, index))
            .filter((item): item is TItem => item !== null),
    ]);
}

export function prepareCachedEmojiItems<TItem>({
    items,
    normalizeItem,
    mergeItems,
}: {
    items: unknown[];
    normalizeItem: (value: unknown, fallbackSortIndex: number) => TItem | null;
    mergeItems: (groups: TItem[][]) => TItem[];
}): TItem[] {
    return mergeItems([
        items
            .map((item, index) => normalizeItem(item, index))
            .filter((item): item is TItem => item !== null),
    ]);
}