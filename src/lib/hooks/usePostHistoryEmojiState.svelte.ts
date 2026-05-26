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
    getEmojiUrls: () => string[];
    onStateChanged?: () => void | Promise<void>;
}

export function usePostHistoryEmojiState({
    getShow,
    getEmojiUrls,
    onStateChanged = () => undefined,
}: UsePostHistoryEmojiStateParams) {
    let emojiLoadStateByUrl = $state<
        Record<string, "loading" | "ready" | "failed" | undefined>
    >({});
    let emojiImageMetaByUrl = $state<
        Record<string, EmojiImageMetaSnapshot | undefined>
    >({});
    const loadingEmojiUrls = new Set<string>();

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

        try {
            const records = await customEmojiImageMetaRepository.getMany(urls);
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
        const result = await preloadCustomEmojiImageWithMeta(url);
        loadingEmojiUrls.delete(url);

        if (!getEmojiUrls().includes(url)) {
            return;
        }

        if (result.ready && hasResolvedEmojiImageMeta(result)) {
            upsertEmojiImageMetaSnapshots({
                [url]: toEmojiImageMetaSnapshot({
                    url,
                    width: result.width,
                    height: result.height,
                    aspectRatio: result.aspectRatio,
                }),
            });
            void persistPostHistoryEmojiImageMeta({
                url,
                width: result.width,
                height: result.height,
            });
        }

        const nextState = result.ready ? "ready" : "failed";
        if (emojiLoadStateByUrl[url] === nextState) {
            return;
        }

        emojiLoadStateByUrl = {
            ...emojiLoadStateByUrl,
            [url]: nextState,
        };
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

    function resetState(): void {
        emojiLoadStateByUrl = {};
        loadingEmojiUrls.clear();
    }

    $effect(() => {
        if (!getShow()) {
            return;
        }

        void hydratePostHistoryEmojiImageMeta(getEmojiUrls());
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const pendingUrls = syncEmojiLoadState(getEmojiUrls());
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

    return {
        get emojiLoadStateByUrl() {
            return emojiLoadStateByUrl;
        },
        get emojiImageMetaByUrl() {
            return emojiImageMetaByUrl;
        },
        resetState,
    };
}