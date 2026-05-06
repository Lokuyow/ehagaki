import {
    RECENT_CUSTOM_EMOJI_DISPLAY_LIMIT,
    type CustomEmojiSelection,
    type RecentCustomEmojiItem,
} from "../lib/recentCustomEmoji";
import type { RecentCustomEmojisRepository } from "../lib/storage/recentCustomEmojisRepository";

let items = $state<RecentCustomEmojiItem[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);
let activePubkey: string | null = null;

async function getDefaultRepository(): Promise<RecentCustomEmojisRepository> {
    const { recentCustomEmojisRepository } = await import("../lib/storage/recentCustomEmojisRepository");
    return recentCustomEmojisRepository;
}

export const recentCustomEmojiStore = {
    get items() {
        return items;
    },
    get loading() {
        return loading;
    },
    get error() {
        return error;
    },

    async load(params: {
        pubkey?: string | null;
        limit?: number;
        repository?: Pick<RecentCustomEmojisRepository, "getRecent">;
    }): Promise<void> {
        if (!params.pubkey) {
            items = [];
            loading = false;
            error = null;
            activePubkey = null;
            return;
        }

        const pubkey = params.pubkey;
        activePubkey = pubkey;
        loading = true;
        error = null;

        try {
            const repository = params.repository ?? await getDefaultRepository();
            const nextItems = await repository.getRecent(
                pubkey,
                params.limit ?? RECENT_CUSTOM_EMOJI_DISPLAY_LIMIT,
            );
            if (activePubkey === pubkey) {
                items = nextItems;
            }
        } catch {
            if (activePubkey === pubkey) {
                error = "customEmoji.recent_load_failed";
                items = [];
            }
        } finally {
            if (activePubkey === pubkey) {
                loading = false;
            }
        }
    },

    async recordUse(params: {
        pubkey?: string | null;
        emoji: CustomEmojiSelection;
        repository?: Pick<RecentCustomEmojisRepository, "recordUse">;
    }): Promise<void> {
        if (!params.pubkey) return;

        const pubkey = params.pubkey;
        activePubkey = pubkey;
        error = null;

        try {
            const repository = params.repository ?? await getDefaultRepository();
            const nextItems = await repository.recordUse(pubkey, params.emoji);
            if (activePubkey === pubkey) {
                items = nextItems;
            }
        } catch {
            if (activePubkey === pubkey) {
                error = "customEmoji.recent_save_failed";
            }
        }
    },

    reset(): void {
        items = [];
        loading = false;
        error = null;
        activePubkey = null;
    },
};
