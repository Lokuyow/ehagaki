import { onDestroy, untrack } from "svelte";
import {
    preloadCustomEmojiImageWithMeta,
    type PreloadedCustomEmojiImageResult,
} from "../customEmoji";
import { customEmojiImageMetaRepository } from "../storage/customEmojiImageMetaRepository";
import type { CustomEmojiImageMetaRecord } from "../storage/ehagakiDb";

type EmojiImageMetaSnapshot = Pick<
    CustomEmojiImageMetaRecord,
    "url" | "width" | "height" | "aspectRatio"
>;

interface UsePostHistoryEmojiStateParams {
    getShow: () => boolean;
    getSessionOpen?: () => boolean;
    getEmojiUrls: () => string[];
    onStateChanged?: () => void | Promise<void>;
}

export function usePostHistoryEmojiState({
    getShow,
    getSessionOpen = getShow,
    getEmojiUrls,
    onStateChanged = () => undefined,
}: UsePostHistoryEmojiStateParams) {
    let emojiLoadStateByUrl = $state<
        Record<string, "loading" | "ready" | "failed" | undefined>
    >({});
    let emojiImageMetaByUrl = $state<
        Record<string, EmojiImageMetaSnapshot | undefined>
    >({});
    let generation = 0;
    let abort = new AbortController();
    const loadingEmojiUrls = new Set<string>();
    // Stored metadata is read (and touched) once per URL per session.
    const hydrationRequestedUrls = new Set<string>();
    // Load results land at different times; apply them together once per
    // task so every row and the collapse measurement update once per batch.
    const pendingLoadStates = new Map<string, "ready" | "failed">();
    let pendingImageMeta: Record<string, EmojiImageMetaSnapshot> = {};
    let loadResultTimer: ReturnType<typeof setTimeout> | null = null;
    // Callers rebuild the URL array whenever related state changes. A string
    // key keeps an unchanged URL set from rerunning the reads and load sync.
    const emojiUrlKey = $derived(getEmojiUrls().join("\n"));
    const emojiUrls = $derived(emojiUrlKey ? emojiUrlKey.split("\n") : []);

    function syncEmojiLoadState(urls: string[]): string[] {
        const nextState: Record<
            string,
            "loading" | "ready" | "failed" | undefined
        > = {};

        for (const url of urls) {
            if (loadingEmojiUrls.has(url)) {
                nextState[url] = "loading";
                continue;
            }

            const currentState = emojiLoadStateByUrl[url];
            if (currentState === "ready" || currentState === "failed") {
                nextState[url] = currentState;
            }
        }

        const pendingUrls = urls.filter((url) => !nextState[url]);
        for (const url of pendingUrls) {
            loadingEmojiUrls.add(url);
            nextState[url] = "loading";
        }

        if (!hasSameEmojiLoadState(emojiLoadStateByUrl, nextState)) {
            emojiLoadStateByUrl = nextState;
        }

        return pendingUrls;
    }

    function toEmojiImageMetaSnapshot(
        record: Pick<
            CustomEmojiImageMetaRecord,
            "url" | "width" | "height" | "aspectRatio"
        >,
    ): EmojiImageMetaSnapshot {
        return {
            url: record.url,
            width: record.width,
            height: record.height,
            aspectRatio: record.aspectRatio,
        };
    }

    function hasResolvedEmojiImageMeta(
        result: PreloadedCustomEmojiImageResult,
    ): result is PreloadedCustomEmojiImageResult & {
        width: number;
        height: number;
        aspectRatio: number;
    } {
        return (
            Number.isSafeInteger(result.width)
            && Number.isSafeInteger(result.height)
            && (result.width ?? 0) > 0
            && (result.height ?? 0) > 0
            && Number.isFinite(result.aspectRatio)
            && (result.aspectRatio ?? 0) > 0
        );
    }

    function upsertEmojiImageMetaSnapshots(
        snapshots: Record<string, EmojiImageMetaSnapshot>,
    ): void {
        let changed = false;
        const nextState = { ...emojiImageMetaByUrl };

        for (const [url, snapshot] of Object.entries(snapshots)) {
            const current = nextState[url];
            if (
                current?.width === snapshot.width
                && current?.height === snapshot.height
                && current?.aspectRatio === snapshot.aspectRatio
            ) {
                continue;
            }

            nextState[url] = snapshot;
            changed = true;
        }

        if (changed) {
            emojiImageMetaByUrl = nextState;
        }
    }

    async function hydratePostHistoryEmojiImageMeta(
        urls: string[],
    ): Promise<void> {
        if (urls.length === 0) {
            return;
        }

        const epoch = generation;
        // Results that were not applied leave the URLs for a later sync.
        const release = () => {
            if (epoch !== generation) return;
            for (const url of urls) hydrationRequestedUrls.delete(url);
        };
        try {
            const records = await customEmojiImageMetaRepository.getMany(urls);
            if (epoch !== generation) return;
            if (!getShow()) {
                release();
                return;
            }
            const foundUrls = Object.keys(records);
            if (foundUrls.length === 0) {
                return;
            }

            upsertEmojiImageMetaSnapshots(
                Object.fromEntries(
                    foundUrls.map((url) => [
                        url,
                        toEmojiImageMetaSnapshot(records[url]),
                    ]),
                ) as Record<string, EmojiImageMetaSnapshot>,
            );
            void customEmojiImageMetaRepository.touchMany(foundUrls);
        } catch {
            // Metadata hydration is an optimization for layout stability.
            release();
        }
    }

    async function persistPostHistoryEmojiImageMeta(input: {
        url: string;
        width: number;
        height: number;
    }): Promise<void> {
        try {
            await customEmojiImageMetaRepository.upsert(input);
        } catch {
            // Metadata persistence should never break rendering.
        }
    }

    async function loadPostHistoryEmoji(url: string): Promise<void> {
        const epoch = generation;
        const result = await preloadCustomEmojiImageWithMeta(url, { signal: abort.signal });
        if (!getShow() || epoch !== generation) return;

        if (!emojiUrls.includes(url)) {
            loadingEmojiUrls.delete(url);
            return;
        }

        if (result.ready && hasResolvedEmojiImageMeta(result)) {
            pendingImageMeta[url] = toEmojiImageMetaSnapshot({
                url,
                width: result.width,
                height: result.height,
                aspectRatio: result.aspectRatio,
            });
            void persistPostHistoryEmojiImageMeta({
                url,
                width: result.width,
                height: result.height,
            });
        }

        // The URL stays in loadingEmojiUrls until the flush, so a URL sync in
        // between does not start a second load.
        pendingLoadStates.set(url, result.ready ? "ready" : "failed");
        scheduleLoadResultFlush();
    }

    function flushLoadResults(): void {
        loadResultTimer = null;
        const imageMeta = pendingImageMeta;
        pendingImageMeta = {};
        if (Object.keys(imageMeta).length > 0) {
            upsertEmojiImageMetaSnapshots(imageMeta);
        }

        let nextState: Record<string, "loading" | "ready" | "failed" | undefined> | null = null;
        for (const [url, state] of pendingLoadStates) {
            loadingEmojiUrls.delete(url);
            if (emojiLoadStateByUrl[url] !== state) {
                nextState ??= { ...emojiLoadStateByUrl };
                nextState[url] = state;
            }
        }
        pendingLoadStates.clear();
        if (nextState) {
            emojiLoadStateByUrl = nextState;
        }
    }

    function scheduleLoadResultFlush(): void {
        if (loadResultTimer !== null) return;
        // A task rather than an animation frame: frames stop in hidden tabs
        // and offscreen embed iframes, which would leave emoji loading.
        loadResultTimer = setTimeout(flushLoadResults, 0);
    }

    function discardPendingLoadResults(): void {
        if (loadResultTimer !== null) {
            clearTimeout(loadResultTimer);
        }
        loadResultTimer = null;
        pendingLoadStates.clear();
        pendingImageMeta = {};
    }

    function hasSameEmojiLoadState(
        left: Record<string, "loading" | "ready" | "failed" | undefined>,
        right: Record<string, "loading" | "ready" | "failed" | undefined>,
    ): boolean {
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) {
            return false;
        }

        return leftKeys.every((key) => left[key] === right[key]);
    }

    function suspend(): void {
        generation++; abort.abort(); abort = new AbortController();
        discardPendingLoadResults();
        loadingEmojiUrls.clear();
        hydrationRequestedUrls.clear();
        emojiLoadStateByUrl = Object.fromEntries(Object.entries(emojiLoadStateByUrl).filter(([, state]) => state !== "loading"));
    }
    function resetState(): void {
        generation++; abort.abort(); abort = new AbortController();
        discardPendingLoadResults();
        emojiLoadStateByUrl = {};
        loadingEmojiUrls.clear();
        hydrationRequestedUrls.clear();
    }

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const urls = emojiUrls.filter((url) => !hydrationRequestedUrls.has(url));
        for (const url of urls) hydrationRequestedUrls.add(url);
        void hydratePostHistoryEmojiImageMeta(urls);
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const pendingUrls = syncEmojiLoadState(emojiUrls);
        for (const url of pendingUrls) {
            void loadPostHistoryEmoji(url);
        }
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        emojiLoadStateByUrl;
        emojiImageMetaByUrl;
        void onStateChanged();
    });

    $effect(() => { if (!getSessionOpen()) untrack(resetState); });
    onDestroy(() => {
        // Loads that settle after the abort must not schedule another flush.
        generation++;
        abort.abort();
        discardPendingLoadResults();
    });
    return {
        suspend,
        get emojiLoadStateByUrl() {
            return emojiLoadStateByUrl;
        },
        get emojiImageMetaByUrl() {
            return emojiImageMetaByUrl;
        },
        resetState,
    };
}