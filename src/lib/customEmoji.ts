import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import type { EmojisRepository } from "./storage/emojisRepository";
import {
    prepareCachedEmojiItems,
    restoreCachedEmojiItems,
} from "./customEmojiCachePersistenceUtils";
import { buildCustomEmojiListFromFetchedEvents } from "./customEmojiFetchUtils";
import {
    clampCustomEmojiPickerPersistenceHeight,
    readPersistedPickerHeight,
    writePersistedPickerHeight,
} from "./customEmojiPickerPersistenceUtils";

export type CustomEmojiSourceType = "kind10030" | "kind30030";

export interface CustomEmojiItem {
    identityKey: string;
    shortcode: string;
    shortcodeLower: string;
    src: string;
    setAddress: string | null;
    sortIndex: number;
    sourceType: CustomEmojiSourceType;
    sourceAddress: string | null;
}

export interface NostrEventLike {
    kind: number;
    pubkey?: string;
    created_at?: number;
    tags: string[][];
}

export const CUSTOM_EMOJI_PICKER_HEIGHT_KEY = "customEmojiPickerHeight";
export const CUSTOM_EMOJI_GRID_CELL_SIZE = 40;
export const CUSTOM_EMOJI_GRID_VERTICAL_PADDING = 8;
export const CUSTOM_EMOJI_PICKER_MIN_HEIGHT =
    CUSTOM_EMOJI_GRID_CELL_SIZE + CUSTOM_EMOJI_GRID_VERTICAL_PADDING;
export const CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT = 240;
export const CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT = 30;
export const CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP = 16;
export const CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT = 40;
export const CUSTOM_EMOJI_PICKER_SEARCH_ROW_BORDER_HEIGHT = 1;
export const CUSTOM_EMOJI_PICKER_CHROME_HEIGHT =
    CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT -
    CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP +
    CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT +
    CUSTOM_EMOJI_PICKER_SEARCH_ROW_BORDER_HEIGHT;
export const CUSTOM_EMOJI_CACHE_URL_LIMIT = 300;
export const CUSTOM_EMOJI_CACHE_BATCH_SIZE = 24;
export const EMOJIS_CACHE_SCHEMA_VERSION = 2;
export const CUSTOM_EMOJI_SUGGESTION_LIMIT = 30;
export const CUSTOM_EMOJI_CACHE_REQUEST_TIMEOUT = 8000;
const CUSTOM_EMOJI_SHORTCODE_TEXT_REGEX = /^:[\p{L}\p{N}_+-]{1,64}:$/u;

export interface CacheCustomEmojiImagesResult {
    success: boolean;
    cached: number;
    failed: number;
}

interface CustomEmojiCacheMessagePortLike {
    onmessage: ((event: MessageEvent<unknown>) => void) | null;
    addEventListener?: (type: string, listener: (event: Event) => void) => void;
    close: () => void;
}

interface CustomEmojiCacheMessageChannelLike {
    port1: CustomEmojiCacheMessagePortLike;
    port2: MessagePort;
}

interface RequestCustomEmojiImagesCacheRuntime {
    navigatorObj?: Pick<Navigator, "serviceWorker">;
    createMessageChannel?: () => CustomEmojiCacheMessageChannelLike | null;
    setTimeoutFn?: typeof setTimeout;
    clearTimeoutFn?: typeof clearTimeout;
    timeoutMs?: number;
}

interface PreloadCustomEmojiImageRuntime {
    requestCache?: (
        urls: string[],
    ) => Promise<CacheCustomEmojiImagesResult | null>;
    createImage?: () => HTMLImageElement;
}

export interface PreloadedCustomEmojiImageResult {
    ready: boolean;
    width?: number;
    height?: number;
    aspectRatio?: number;
}

export interface CustomEmojiTagReference {
    shortcode: string;
    shortcodeLower: string;
    url: string;
}

export function normalizeEmojiShortcode(value: unknown): string {
    return String(value ?? "").replace(/^:+|:+$/g, "").trim();
}

export function normalizeEmojiShortcodeForLookup(value: unknown): string {
    return normalizeEmojiShortcode(value).toLowerCase();
}

export function isCustomEmojiShortcodeText(value: unknown): boolean {
    return typeof value === "string"
        && CUSTOM_EMOJI_SHORTCODE_TEXT_REGEX.test(value.trim());
}

function normalizeSetAddress(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function encodeIdentityPart(value: string): string {
    return encodeURIComponent(value);
}

export function createCustomEmojiIdentityKey(params: {
    shortcodeLower: string;
    src: string;
    setAddress?: string | null;
}): string {
    return [
        params.shortcodeLower,
        params.src,
        params.setAddress ?? "",
    ].map(encodeIdentityPart).join("|");
}

export function createCustomEmojiRecordId(pubkeyHex: string, identityKey: string): string {
    return `${encodeIdentityPart(pubkeyHex)}|${identityKey}`;
}

export function createCustomEmojiItem(params: {
    shortcode: unknown;
    src: unknown;
    setAddress?: unknown;
    sortIndex: number;
    sourceType?: CustomEmojiSourceType;
    sourceAddress?: unknown;
}): CustomEmojiItem | null {
    const shortcode = normalizeEmojiShortcode(params.shortcode);
    const shortcodeLower = normalizeEmojiShortcodeForLookup(shortcode);
    if (!shortcode || !shortcodeLower || !isValidCustomEmojiUrl(params.src)) return null;

    const setAddress = normalizeSetAddress(params.setAddress);
    const sourceAddress = normalizeSetAddress(params.sourceAddress);
    const sourceType = params.sourceType ?? "kind10030";

    return {
        identityKey: createCustomEmojiIdentityKey({
            shortcodeLower,
            src: params.src,
            setAddress,
        }),
        shortcode,
        shortcodeLower,
        src: params.src,
        setAddress,
        sortIndex: Number.isFinite(params.sortIndex) ? Math.max(0, Math.floor(params.sortIndex)) : 0,
        sourceType,
        sourceAddress,
    };
}

export function findCustomEmojiByShortcode(
    items: CustomEmojiItem[],
    shortcode: unknown,
): CustomEmojiItem | null {
    return findCustomEmojiCandidatesByShortcode(items, shortcode)[0] ?? null;
}

export function findCustomEmojiCandidatesByShortcode(
    items: CustomEmojiItem[],
    shortcode: unknown,
): CustomEmojiItem[] {
    const normalizedShortcode = normalizeEmojiShortcodeForLookup(shortcode);
    if (!normalizedShortcode) return [];

    return items.filter((item) => item.shortcodeLower === normalizedShortcode);
}

export function findUniqueCustomEmojiByShortcode(
    items: CustomEmojiItem[],
    shortcode: unknown,
): CustomEmojiItem | null {
    const candidates = findCustomEmojiCandidatesByShortcode(items, shortcode);
    return candidates.length === 1 ? candidates[0] : null;
}

export function getCustomEmojiSuggestionItems(
    items: CustomEmojiItem[],
    query: unknown,
    limit = CUSTOM_EMOJI_SUGGESTION_LIMIT,
): CustomEmojiItem[] {
    const normalizedQuery = normalizeEmojiShortcodeForLookup(query);
    if (!normalizedQuery || limit <= 0) return [];

    const prefixMatches: CustomEmojiItem[] = [];
    const includesMatches: CustomEmojiItem[] = [];

    for (const item of items) {
        if (!item.shortcodeLower) continue;
        if (item.shortcodeLower.startsWith(normalizedQuery)) {
            prefixMatches.push(item);
        } else if (item.shortcodeLower.includes(normalizedQuery)) {
            includesMatches.push(item);
        }
        if (prefixMatches.length >= limit) {
            return prefixMatches.slice(0, limit);
        }
    }

    return [...prefixMatches, ...includesMatches].slice(0, limit);
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

export interface ParseEmojiTagsOptions {
    setAddress?: string | null;
    sourceType?: CustomEmojiSourceType;
    sourceAddress?: string | null;
    startSortIndex?: number;
}

function normalizeParseEmojiTagsOptions(
    options?: string | null | ParseEmojiTagsOptions,
): Required<ParseEmojiTagsOptions> {
    if (typeof options === "string" || options === null) {
        return {
            setAddress: options ?? null,
            sourceType: "kind10030",
            sourceAddress: null,
            startSortIndex: 0,
        };
    }

    return {
        setAddress: options?.setAddress ?? null,
        sourceType: options?.sourceType ?? "kind10030",
        sourceAddress: options?.sourceAddress ?? null,
        startSortIndex: options?.startSortIndex ?? 0,
    };
}

export function parseEmojiTags(
    tags: string[][],
    options?: string | null | ParseEmojiTagsOptions,
): CustomEmojiItem[] {
    const normalizedOptions = normalizeParseEmojiTagsOptions(options);
    const items: CustomEmojiItem[] = [];

    for (const tag of tags) {
        if (tag[0] !== "emoji") continue;
        const item = createCustomEmojiItem({
            shortcode: tag[1],
            src: tag[2],
            setAddress: normalizedOptions.setAddress ?? tag[3] ?? null,
            sortIndex: normalizedOptions.startSortIndex + items.length,
            sourceType: normalizedOptions.sourceType,
            sourceAddress: normalizedOptions.sourceAddress,
        });
        if (item) {
            items.push(item);
        }
    }

    return items;
}

export function buildCustomEmojiTagMap(
    tags: string[][],
): Map<string, CustomEmojiTagReference> {
    const emojiMap = new Map<string, CustomEmojiTagReference>();

    for (const emoji of parseEmojiTags(tags)) {
        if (emojiMap.has(emoji.shortcodeLower)) {
            continue;
        }

        emojiMap.set(emoji.shortcodeLower, {
            shortcode: emoji.shortcode,
            shortcodeLower: emoji.shortcodeLower,
            url: emoji.src,
        });
    }

    return emojiMap;
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
            const normalizedItem = normalizeCustomEmojiItem(item, merged.length);
            if (!normalizedItem || seen.has(normalizedItem.identityKey)) continue;
            seen.add(normalizedItem.identityKey);
            merged.push({
                ...normalizedItem,
                sortIndex: merged.length,
            });
        }
    }

    return merged;
}

function normalizeCustomEmojiItem(value: unknown, fallbackSortIndex = 0): CustomEmojiItem | null {
    if (!value || typeof value !== "object") return null;
    const item = value as Partial<CustomEmojiItem>;
    return createCustomEmojiItem({
        shortcode: item.shortcode,
        src: item.src,
        setAddress: item.setAddress,
        sortIndex: typeof item.sortIndex === "number" ? item.sortIndex : fallbackSortIndex,
        sourceType: item.sourceType,
        sourceAddress: item.sourceAddress,
    });
}

export function getEmojisCacheKey(pubkey: string): string {
    return pubkey;
}

async function getDefaultEmojisRepository(): Promise<EmojisRepository> {
    const { emojisRepository } = await import("./storage/emojisRepository");
    return emojisRepository;
}

export async function readCachedCustomEmojiItems(
    pubkey: string,
    repository?: Pick<EmojisRepository, "get">,
): Promise<CustomEmojiItem[]> {
    if (!pubkey) return [];

    try {
        const cacheRepository = repository ?? await getDefaultEmojisRepository();
        const record = await cacheRepository.get(pubkey);
        return restoreCachedEmojiItems({
            record,
            schemaVersion: EMOJIS_CACHE_SCHEMA_VERSION,
            normalizeItem: normalizeCustomEmojiItem,
            mergeItems: mergeCustomEmojiItems,
        });
    } catch {
        return [];
    }
}

export async function writeCachedCustomEmojiItems(
    pubkey: string,
    nextItems: CustomEmojiItem[],
    repository?: Pick<EmojisRepository, "put">,
): Promise<void> {
    if (!pubkey) return;

    const items = prepareCachedEmojiItems({
        items: nextItems,
        normalizeItem: normalizeCustomEmojiItem,
        mergeItems: mergeCustomEmojiItems,
    });

    try {
        const cacheRepository = repository ?? await getDefaultEmojisRepository();
        await cacheRepository.put(pubkey, items);
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
    const addresses = getKind10030EmojiSetAddresses(listEvent);
    if (addresses.length === 0) {
        return buildCustomEmojiListFromFetchedEvents({
            listEvent,
            setEvents: [],
            parseEmojiTags,
            getKind10030EmojiSetAddresses,
            parseEmojiSetAddress,
            mergeCustomEmojiItems: mergeCustomEmojiItems,
        });
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

    return buildCustomEmojiListFromFetchedEvents({
        listEvent,
        setEvents,
        parseEmojiTags,
        getKind10030EmojiSetAddresses,
        parseEmojiSetAddress,
        mergeCustomEmojiItems: mergeCustomEmojiItems,
    });
}

export function readCustomEmojiPickerHeight(storage: Pick<Storage, "getItem">, viewportHeight?: number, maxHeight?: number): number {
    return readPersistedPickerHeight({
        storage,
        storageKey: CUSTOM_EMOJI_PICKER_HEIGHT_KEY,
        defaultHeight: CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT,
        clampHeight: (value) =>
            clampCustomEmojiPickerHeight(value, viewportHeight, maxHeight),
    });
}

export function clampCustomEmojiPickerHeight(value: number, viewportHeight = typeof window !== "undefined" ? (window.visualViewport?.height ?? window.innerHeight) : 800, maxHeight?: number): number {
    return clampCustomEmojiPickerPersistenceHeight({
        value,
        minHeight: CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
        viewportHeight,
        maxHeight,
    });
}

export function writeCustomEmojiPickerHeight(storage: Pick<Storage, "setItem">, value: number, viewportHeight?: number, maxHeight?: number): number {
    return writePersistedPickerHeight({
        storage,
        storageKey: CUSTOM_EMOJI_PICKER_HEIGHT_KEY,
        value,
        clampHeight: (nextValue) =>
            clampCustomEmojiPickerHeight(nextValue, viewportHeight, maxHeight),
    });
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

export async function requestCustomEmojiImagesCache(
    urls: string[],
    runtime: RequestCustomEmojiImagesCacheRuntime = {},
): Promise<CacheCustomEmojiImagesResult | null> {
    const navigatorObj = runtime.navigatorObj ??
        (typeof navigator !== "undefined" ? navigator : undefined);
    const controller = navigatorObj?.serviceWorker?.controller;
    const createMessageChannel = runtime.createMessageChannel ??
        createDefaultMessageChannel;

    if (!controller || !createMessageChannel) {
        return null;
    }

    const batches = getCustomEmojiCacheBatches(urls);
    if (!batches.length) {
        return { success: true, cached: 0, failed: 0 };
    }

    let cached = 0;
    let failed = 0;

    for (const batch of batches) {
        const result = await requestCustomEmojiImagesCacheBatch(batch, {
            controller,
            createMessageChannel,
            setTimeoutFn: runtime.setTimeoutFn ?? setTimeout,
            clearTimeoutFn: runtime.clearTimeoutFn ?? clearTimeout,
            timeoutMs: runtime.timeoutMs ?? CUSTOM_EMOJI_CACHE_REQUEST_TIMEOUT,
        });
        cached += result.cached;
        failed += result.failed;
    }

    return {
        success: failed === 0,
        cached,
        failed,
    };
}

export async function preloadCustomEmojiImage(
    url: string,
    runtime: PreloadCustomEmojiImageRuntime = {},
): Promise<boolean> {
    if (!isValidCustomEmojiUrl(url)) {
        return false;
    }

    const requestCache = runtime.requestCache ?? requestCustomEmojiImagesCache;
    try {
        const cacheResult = await requestCache([url]);
        if (cacheResult) {
            return cacheResult.cached > 0 && cacheResult.failed === 0;
        }
    } catch {
        // Fall through to a direct image load when SW communication is unavailable.
    }

    return await loadCustomEmojiImage(url, runtime.createImage);
}

export async function preloadCustomEmojiImageWithMeta(
    url: string,
    runtime: PreloadCustomEmojiImageRuntime = {},
): Promise<PreloadedCustomEmojiImageResult> {
    if (!isValidCustomEmojiUrl(url)) {
        return { ready: false };
    }

    const requestCache = runtime.requestCache ?? requestCustomEmojiImagesCache;
    try {
        const cacheResult = await requestCache([url]);
        if (cacheResult) {
            if (cacheResult.cached === 0 || cacheResult.failed > 0) {
                return { ready: false };
            }

            return await loadCustomEmojiImageWithMeta(url, runtime.createImage);
        }
    } catch {
        // Fall through to a direct image load when SW communication is unavailable.
    }

    return await loadCustomEmojiImageWithMeta(url, runtime.createImage);
}

async function requestCustomEmojiImagesCacheBatch(
    urls: string[],
    params: {
        controller: ServiceWorker;
        createMessageChannel: () => CustomEmojiCacheMessageChannelLike | null;
        setTimeoutFn: typeof setTimeout;
        clearTimeoutFn: typeof clearTimeout;
        timeoutMs: number;
    },
): Promise<CacheCustomEmojiImagesResult> {
    return await new Promise((resolve, reject) => {
        const messageChannel = params.createMessageChannel();
        if (!messageChannel) {
            reject(new Error("MessageChannel is not available"));
            return;
        }

        const timeout = params.setTimeoutFn(() => {
            messageChannel.port1.close();
            reject(new Error("ServiceWorker custom emoji cache request timed out"));
        }, params.timeoutMs);

        messageChannel.port1.onmessage = (event) => {
            params.clearTimeoutFn(timeout);
            messageChannel.port1.close();
            resolve(normalizeCacheCustomEmojiImagesResult(event.data, urls.length));
        };

        messageChannel.port1.addEventListener?.("error", (event) => {
            params.clearTimeoutFn(timeout);
            messageChannel.port1.close();
            reject(event);
        });

        try {
            params.controller.postMessage(
                {
                    action: "cacheCustomEmojiImages",
                    urls,
                },
                [messageChannel.port2],
            );
        } catch (error) {
            params.clearTimeoutFn(timeout);
            messageChannel.port1.close();
            reject(error);
        }
    });
}

function normalizeCacheCustomEmojiImagesResult(
    value: unknown,
    requestedCount: number,
): CacheCustomEmojiImagesResult {
    if (!value || typeof value !== "object") {
        return {
            success: false,
            cached: 0,
            failed: requestedCount,
        };
    }

    const result = value as Partial<CacheCustomEmojiImagesResult>;
    const cached = Number.isFinite(result.cached)
        ? Math.max(0, Number(result.cached))
        : 0;
    const failed = Number.isFinite(result.failed)
        ? Math.max(0, Number(result.failed))
        : Math.max(0, requestedCount - cached);

    return {
        success: result.success === true && failed === 0,
        cached,
        failed,
    };
}

function createDefaultMessageChannel(): CustomEmojiCacheMessageChannelLike | null {
    if (typeof MessageChannel === "undefined") {
        return null;
    }

    return new MessageChannel();
}

async function loadCustomEmojiImage(
    url: string,
    createImage: (() => HTMLImageElement) | undefined,
): Promise<boolean> {
    const imageFactory = createImage ??
        (typeof Image !== "undefined" ? () => new Image() : undefined);
    if (!imageFactory) {
        return false;
    }

    return await new Promise((resolve) => {
        const image = imageFactory();
        let settled = false;

        const finish = (ready: boolean) => {
            if (settled) {
                return;
            }

            settled = true;
            image.onload = null;
            image.onerror = null;
            resolve(ready);
        };

        image.decoding = "async";
        image.onload = () => finish(true);
        image.onerror = () => finish(false);
        image.src = url;
    });
}

async function loadCustomEmojiImageWithMeta(
    url: string,
    createImage: (() => HTMLImageElement) | undefined,
): Promise<PreloadedCustomEmojiImageResult> {
    const imageFactory = createImage ??
        (typeof Image !== "undefined" ? () => new Image() : undefined);
    if (!imageFactory) {
        return { ready: false };
    }

    return await new Promise((resolve) => {
        const image = imageFactory();
        let settled = false;

        const finish = (result: PreloadedCustomEmojiImageResult) => {
            if (settled) {
                return;
            }

            settled = true;
            image.onload = null;
            image.onerror = null;
            resolve(result);
        };

        image.decoding = "async";
        image.onload = () => {
            const dimensions = normalizeLoadedCustomEmojiImageDimensions(image);
            finish(dimensions ? { ready: true, ...dimensions } : { ready: true });
        };
        image.onerror = () => finish({ ready: false });
        image.src = url;
    });
}

function normalizeLoadedCustomEmojiImageDimensions(
    image: Pick<HTMLImageElement, "naturalWidth" | "naturalHeight">,
): Omit<PreloadedCustomEmojiImageResult, "ready"> | null {
    const width = Math.trunc(Number(image.naturalWidth));
    const height = Math.trunc(Number(image.naturalHeight));

    if (
        !Number.isSafeInteger(width) ||
        !Number.isSafeInteger(height) ||
        width <= 0 ||
        height <= 0
    ) {
        return null;
    }

    return {
        width,
        height,
        aspectRatio: width / height,
    };
}
