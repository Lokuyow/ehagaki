import { createRxBackwardReq, type RxNostr } from "rx-nostr";

export interface CustomEmojiItem {
    shortcode: string;
    src: string;
    setAddress?: string | null;
}

export interface NostrEventLike {
    kind: number;
    pubkey?: string;
    created_at?: number;
    tags: string[][];
}

export const CUSTOM_EMOJI_PICKER_HEIGHT_KEY = "customEmojiPickerHeight";
export const CUSTOM_EMOJI_GRID_ROW_HEIGHT = 38;
export const CUSTOM_EMOJI_GRID_VERTICAL_PADDING = 4;
export const CUSTOM_EMOJI_PICKER_MIN_HEIGHT =
    CUSTOM_EMOJI_GRID_ROW_HEIGHT + CUSTOM_EMOJI_GRID_VERTICAL_PADDING;
export const CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT = 240;
export const CUSTOM_EMOJI_CACHE_URL_LIMIT = 300;
export const CUSTOM_EMOJI_CACHE_BATCH_SIZE = 24;
export const CUSTOM_EMOJI_LIST_CACHE_KEY_PREFIX = "customEmojiList:";
export const CUSTOM_EMOJI_LIST_CACHE_VERSION = 1;

export function normalizeEmojiShortcode(value: unknown): string {
    return String(value ?? "").replace(/^:+|:+$/g, "").trim();
}

export function isValidCustomEmojiUrl(value: unknown): value is string {
    if (typeof value !== "string" || !value) return false;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function parseEmojiTags(tags: string[][], setAddress?: string | null): CustomEmojiItem[] {
    return tags
        .filter((tag) => tag[0] === "emoji")
        .map((tag): CustomEmojiItem => ({
            shortcode: normalizeEmojiShortcode(tag[1]),
            src: tag[2],
            setAddress: setAddress ?? tag[3] ?? null,
        }))
        .filter((item) => !!item.shortcode && isValidCustomEmojiUrl(item.src));
}

export function parseEmojiSetAddress(value: unknown): { kind: number; pubkey: string; identifier: string; address: string } | null {
    if (typeof value !== "string") return null;
    const [kindValue, pubkey, ...identifierParts] = value.split(":");
    const kind = Number(kindValue);
    const identifier = identifierParts.join(":");
    if (kind !== 30030 || !pubkey || !identifier) return null;
    return { kind, pubkey, identifier, address: value };
}

export function getKind10030EmojiSetAddresses(event: NostrEventLike | null): string[] {
    if (!event?.tags) return [];
    const seen = new Set<string>();
    const addresses: string[] = [];

    for (const tag of event.tags) {
        if (tag[0] !== "a") continue;
        const parsed = parseEmojiSetAddress(tag[1]);
        if (!parsed || seen.has(parsed.address)) continue;
        seen.add(parsed.address);
        addresses.push(parsed.address);
    }

    return addresses;
}

export function mergeCustomEmojiItems(groups: CustomEmojiItem[][]): CustomEmojiItem[] {
    const seen = new Set<string>();
    const merged: CustomEmojiItem[] = [];

    for (const group of groups) {
        for (const item of group) {
            if (seen.has(item.shortcode)) continue;
            seen.add(item.shortcode);
            merged.push(item);
        }
    }

    return merged;
}

function normalizeCustomEmojiItem(value: unknown): CustomEmojiItem | null {
    if (!value || typeof value !== "object") return null;
    const item = value as Partial<CustomEmojiItem>;
    const shortcode = normalizeEmojiShortcode(item.shortcode);
    if (!shortcode || !isValidCustomEmojiUrl(item.src)) return null;

    return {
        shortcode,
        src: item.src,
        setAddress: typeof item.setAddress === "string" && item.setAddress ? item.setAddress : null,
    };
}

export function getCustomEmojiListCacheKey(pubkey: string): string {
    return `${CUSTOM_EMOJI_LIST_CACHE_KEY_PREFIX}${pubkey}`;
}

export function readCachedCustomEmojiItems(storage: Pick<Storage, "getItem">, pubkey: string): CustomEmojiItem[] {
    if (!pubkey) return [];

    try {
        const raw = storage.getItem(getCustomEmojiListCacheKey(pubkey));
        if (!raw) return [];
        const payload = JSON.parse(raw) as {
            version?: number;
            items?: unknown[];
        };
        if (payload.version !== CUSTOM_EMOJI_LIST_CACHE_VERSION || !Array.isArray(payload.items)) {
            return [];
        }

        return mergeCustomEmojiItems([
            payload.items
                .map((item) => normalizeCustomEmojiItem(item))
                .filter((item): item is CustomEmojiItem => !!item),
        ]);
    } catch {
        return [];
    }
}

export function writeCachedCustomEmojiItems(
    storage: Pick<Storage, "setItem">,
    pubkey: string,
    nextItems: CustomEmojiItem[],
): void {
    if (!pubkey) return;

    const items = mergeCustomEmojiItems([
        nextItems
            .map((item) => normalizeCustomEmojiItem(item))
            .filter((item): item is CustomEmojiItem => !!item),
    ]);

    try {
        storage.setItem(
            getCustomEmojiListCacheKey(pubkey),
            JSON.stringify({
                version: CUSTOM_EMOJI_LIST_CACHE_VERSION,
                cachedAt: Date.now(),
                items,
            }),
        );
    } catch {
        // Metadata caching is an optimization.
    }
}

function fetchEvents(params: {
    rxNostr: RxNostr;
    filter: any;
    timeoutMs?: number;
}): Promise<NostrEventLike[]> {
    const { rxNostr, filter, timeoutMs = 4000 } = params;

    return new Promise((resolve) => {
        const rxReq = createRxBackwardReq();
        const events: NostrEventLike[] = [];
        let resolved = false;
        let subscription: { unsubscribe?: () => void } | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            subscription?.unsubscribe?.();
            subscription = undefined;
        };

        const safeResolve = () => {
            if (resolved) return;
            resolved = true;
            cleanup();
            resolve(events);
        };

        try {
            subscription = rxNostr.use(rxReq).subscribe({
                next: (packet: any) => {
                    if (packet?.event?.tags) {
                        events.push(packet.event as NostrEventLike);
                    }
                },
                complete: safeResolve,
                error: safeResolve,
            });

            rxReq.emit(filter);
            rxReq.over();
            timeoutId = setTimeout(safeResolve, timeoutMs);
        } catch {
            safeResolve();
        }
    });
}

function getNewestEvent(events: NostrEventLike[]): NostrEventLike | null {
    return [...events].sort((left, right) => (right.created_at ?? 0) - (left.created_at ?? 0))[0] ?? null;
}

export async function fetchCustomEmojiList(params: {
    rxNostr: RxNostr;
    pubkey: string;
}): Promise<CustomEmojiItem[]> {
    const until = Math.floor(Date.now() / 1000);
    const listEvent = getNewestEvent(
        await fetchEvents({
            rxNostr: params.rxNostr,
            filter: {
                authors: [params.pubkey],
                kinds: [10030],
                limit: 1,
                until,
            },
        }),
    );

    if (!listEvent) return [];

    const directItems = parseEmojiTags(listEvent.tags);
    const addresses = getKind10030EmojiSetAddresses(listEvent);
    if (addresses.length === 0) {
        return mergeCustomEmojiItems([directItems]);
    }

    const parsedAddresses = addresses
        .map((address) => parseEmojiSetAddress(address))
        .filter((address): address is NonNullable<ReturnType<typeof parseEmojiSetAddress>> => !!address);
    const setEvents = await fetchEvents({
        rxNostr: params.rxNostr,
        filter: {
            kinds: [30030],
            authors: [...new Set(parsedAddresses.map((address) => address.pubkey))],
            "#d": [...new Set(parsedAddresses.map((address) => address.identifier))],
            until,
        },
    });
    const eventsByAddress = new Map<string, NostrEventLike>();

    for (const event of setEvents) {
        const identifier = event.tags.find((tag) => tag[0] === "d")?.[1];
        if (!event.pubkey || !identifier) continue;
        const address = `30030:${event.pubkey}:${identifier}`;
        const existing = eventsByAddress.get(address);
        if (!existing || (event.created_at ?? 0) > (existing.created_at ?? 0)) {
            eventsByAddress.set(address, event);
        }
    }

    return mergeCustomEmojiItems([
        directItems,
        ...addresses.map((address) => parseEmojiTags(eventsByAddress.get(address)?.tags ?? [], address)),
    ]);
}

export function readCustomEmojiPickerHeight(storage: Pick<Storage, "getItem">, viewportHeight?: number, maxHeight?: number): number {
    const raw = Number(storage.getItem(CUSTOM_EMOJI_PICKER_HEIGHT_KEY));
    return clampCustomEmojiPickerHeight(Number.isFinite(raw) ? raw : CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT, viewportHeight, maxHeight);
}

export function clampCustomEmojiPickerHeight(value: number, viewportHeight = typeof window !== "undefined" ? (window.visualViewport?.height ?? window.innerHeight) : 800, maxHeight?: number): number {
    const viewportMax = Math.floor(viewportHeight * 0.6);
    const max = Math.max(
        CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
        Number.isFinite(maxHeight) ? Math.floor(maxHeight as number) : viewportMax,
    );
    return Math.min(max, Math.max(CUSTOM_EMOJI_PICKER_MIN_HEIGHT, Math.round(value)));
}

export function writeCustomEmojiPickerHeight(storage: Pick<Storage, "setItem">, value: number, viewportHeight?: number, maxHeight?: number): number {
    const height = clampCustomEmojiPickerHeight(value, viewportHeight, maxHeight);
    storage.setItem(CUSTOM_EMOJI_PICKER_HEIGHT_KEY, String(height));
    return height;
}

export function getCustomEmojiCacheBatches(
    urls: string[],
    limit = CUSTOM_EMOJI_CACHE_URL_LIMIT,
    batchSize = CUSTOM_EMOJI_CACHE_BATCH_SIZE,
): string[][] {
    const seen = new Set<string>();
    const uniqueUrls: string[] = [];

    for (const url of urls) {
        if (uniqueUrls.length >= limit) break;
        if (!isValidCustomEmojiUrl(url) || seen.has(url)) continue;
        seen.add(url);
        uniqueUrls.push(url);
    }

    const batches: string[][] = [];
    for (let index = 0; index < uniqueUrls.length; index += batchSize) {
        batches.push(uniqueUrls.slice(index, index + batchSize));
    }
    return batches;
}

function scheduleBackgroundTask(task: () => void): void {
    if (typeof window === "undefined") {
        setTimeout(task, 0);
        return;
    }

    const requestIdleCallback = (
        window as Window & {
            requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
        }
    ).requestIdleCallback;
    if (typeof requestIdleCallback === "function") {
        requestIdleCallback(task, { timeout: 2000 });
        return;
    }

    setTimeout(task, 0);
}

export function cacheCustomEmojiImages(urls: string[]): void {
    if (typeof navigator === "undefined" || !navigator.serviceWorker?.controller) {
        return;
    }

    const batches = getCustomEmojiCacheBatches(urls);
    if (!batches.length) return;

    let batchIndex = 0;
    const sendNextBatch = () => {
        const batch = batches[batchIndex];
        if (!batch) return;

        try {
            navigator.serviceWorker?.controller?.postMessage({
                action: "cacheCustomEmojiImages",
                urls: batch,
            });
        } catch {
            // Service worker caching is an optimization.
        }

        batchIndex++;
        if (batchIndex < batches.length) {
            scheduleBackgroundTask(sendNextBatch);
        }
    };

    scheduleBackgroundTask(sendNextBatch);
}
