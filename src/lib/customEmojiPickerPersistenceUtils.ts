export function clampCustomEmojiPickerPersistenceHeight({
    value,
    minHeight,
    viewportHeight = typeof window !== "undefined"
        ? (window.visualViewport?.height ?? window.innerHeight)
        : 800,
    maxHeight,
}: {
    value: number;
    minHeight: number;
    viewportHeight?: number;
    maxHeight?: number;
}): number {
    const viewportMax = Math.floor(viewportHeight * 0.6);
    const max = Math.max(
        minHeight,
        Number.isFinite(maxHeight) ? Math.floor(maxHeight as number) : viewportMax,
    );
    return Math.min(max, Math.max(minHeight, Math.round(value)));
}

export function readPersistedPickerHeight({
    storage,
    storageKey,
    defaultHeight,
    clampHeight,
}: {
    storage: Pick<Storage, "getItem">;
    storageKey: string;
    defaultHeight: number;
    clampHeight: (value: number) => number;
}): number {
    const storedValue = storage.getItem(storageKey);
    const raw = storedValue === null ? NaN : Number(storedValue);
    return clampHeight(Number.isFinite(raw) ? raw : defaultHeight);
}

export function writePersistedPickerHeight({
    storage,
    storageKey,
    value,
    clampHeight,
}: {
    storage: Pick<Storage, "setItem">;
    storageKey: string;
    value: number;
    clampHeight: (value: number) => number;
}): number {
    const height = clampHeight(value);
    storage.setItem(storageKey, String(height));
    return height;
}