import {
    MAX_CUSTOM_EMOJI_USAGE_HISTORY,
    type CustomEmojiSelection,
    type CustomEmojiUsageItem,
} from "../lib/customEmojiUsage";
import type { CustomEmojiUsageRepository } from "../lib/storage/customEmojiUsageRepository";

let items = $state<CustomEmojiUsageItem[]>([]);
let loading = $state(false);
let error = $state<string | null>(null);
let activePubkey: string | null = null;

async function getDefaultRepository(): Promise<CustomEmojiUsageRepository> {
    const { customEmojiUsageRepository } = await import("../lib/storage/customEmojiUsageRepository");
    return customEmojiUsageRepository;
}

export const customEmojiUsageStore = {
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
        repository?: Pick<CustomEmojiUsageRepository, "getUsageHistory">;
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
            const nextItems = await repository.getUsageHistory(
                pubkey,
                params.limit ?? MAX_CUSTOM_EMOJI_USAGE_HISTORY,
            );
            if (activePubkey === pubkey) {
                items = nextItems;
            }
        } catch {
            if (activePubkey === pubkey) {
                error = "customEmoji.usage_load_failed";
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
        repository?: Pick<CustomEmojiUsageRepository, "recordUse">;
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
                error = "customEmoji.usage_save_failed";
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
