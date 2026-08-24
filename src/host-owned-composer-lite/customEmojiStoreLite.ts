import type { CustomEmojiItem } from "./customEmojiLite";

/** Host-owned editor receives its catalog through getCustomEmojiItems instead. */
export const customEmojiStore = {
    get items(): CustomEmojiItem[] { return []; },
    get loading(): boolean { return false; },
    get error(): string | null { return null; },
    async load(): Promise<void> {},
    async prefetchCache(): Promise<void> {},
    invalidatePendingLoads(): void {},
};
