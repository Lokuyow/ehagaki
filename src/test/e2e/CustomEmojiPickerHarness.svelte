<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { RxNostr } from 'rx-nostr';
    import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';
    import {
        type CustomEmojiItem,
        writeCachedCustomEmojiItems,
    } from '../../lib/customEmoji';
    import { customEmojiStore } from '../../stores/customEmojiStore.svelte';

    const PUBKEY = 'f'.repeat(64);
    function createEmoji(shortcode: string, sortIndex: number): CustomEmojiItem {
        const src = `https://example.com/${shortcode}.webp`;
        return {
            shortcode,
            shortcodeLower: shortcode,
            src,
            identityKey: `${shortcode}\u0000${src}`,
            setAddress: null,
            sortIndex,
            sourceType: 'kind10030',
            sourceAddress: null,
        };
    }

    const cachedItems = Array.from(
        { length: 200 },
        (_, index) => createEmoji(`cached-${index}`, index),
    );
    const freshItems: CustomEmojiItem[] = [
        createEmoji('fresh', 0),
        ...cachedItems,
    ];

    type SubscriptionObserver = {
        next(packet: { event: { tags: string[][]; created_at: number } }): void;
        complete(): void;
    };

    type HarnessState = {
        ready: boolean;
        prefetchApplied: boolean;
        loadStarts: number;
        loadCompletions: number;
        fetchStarts: number;
        fetchCompletions: number;
        releaseLatestList(): void;
    };

    type HarnessWindow = Window & typeof globalThis & {
        __CUSTOM_EMOJI_PICKER_HARNESS__?: HarnessState;
    };

    let ready = $state(false);
    let pendingObserver: SubscriptionObserver | null = null;
    let originalLoad: typeof customEmojiStore.load | null = null;
    const harness: HarnessState = {
        ready: false,
        prefetchApplied: false,
        loadStarts: 0,
        loadCompletions: 0,
        fetchStarts: 0,
        fetchCompletions: 0,
        releaseLatestList: () => {
            const observer = pendingObserver;
            if (!observer) {
                throw new Error('Latest custom emoji fetch is not pending.');
            }

            pendingObserver = null;
            observer.next({
                event: {
                    created_at: 1,
                    tags: freshItems.map((item) => [
                        'emoji',
                        item.shortcode,
                        item.src,
                    ]),
                },
            });
            observer.complete();
            harness.fetchCompletions += 1;
        },
    };

    const rxNostr = {
        use: () => ({
            subscribe: (observer: SubscriptionObserver) => {
                harness.fetchStarts += 1;
                pendingObserver = observer;
                return { unsubscribe: () => undefined };
            },
        }),
    } as unknown as RxNostr;

    onMount(() => {
        void initializeHarness();
    });

    async function initializeHarness(): Promise<void> {
        customEmojiStore.reset();
        const load = customEmojiStore.load;
        originalLoad = load;
        customEmojiStore.load = async (params) => {
            harness.loadStarts += 1;
            try {
                await load(params);
            } finally {
                harness.loadCompletions += 1;
            }
        };

        try {
            await writeCachedCustomEmojiItems(PUBKEY, cachedItems);
            await customEmojiStore.prefetchCache({ pubkey: PUBKEY });
            harness.prefetchApplied =
                customEmojiStore.items.length === cachedItems.length;
            ready = harness.prefetchApplied;
            harness.ready = ready;
            (window as HarnessWindow).__CUSTOM_EMOJI_PICKER_HARNESS__ = harness;
        } catch (error) {
            if (originalLoad) {
                customEmojiStore.load = originalLoad;
            }
            throw error;
        }
    }

    onDestroy(() => {
        if (originalLoad) {
            customEmojiStore.load = originalLoad;
        }
        customEmojiStore.reset();
        delete (window as HarnessWindow).__CUSTOM_EMOJI_PICKER_HARNESS__;
    });
</script>

{#if ready}
    <CustomEmojiPicker {rxNostr} pubkey={PUBKEY} open={true} />
{/if}
