<script lang="ts">
    import { onMount } from "svelte";
    import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
    import { clearPersistedPostHistoryListingSnapshots } from "../../lib/hooks/usePostHistoryListing.svelte";
    import { clearPersistedPostHistoryViewStateForPubkey } from "../../lib/postHistoryDialogViewState";
    import {
        ehagakiDb,
        type PostHistoryRecord,
    } from "../../lib/storage/ehagakiDb";
    import { postHistoryVisibleRangeRepository } from "../../lib/storage/postHistoryVisibleRangeRepository";

    const HARNESS_PUBKEY = "f".repeat(64);
    const TOTAL_POSTS = 70;
    const SEARCH_MATCHING_POSTS = 55;
    const STARTED_AT_MS = Date.UTC(2024, 2, 10, 12, 0, 0);

    let ready = $state(false);

    type HarnessState = {
        ready: boolean;
        pubkeyHex: string;
        totalPosts: number;
        matchingPosts: number;
        jumpDate: string;
    };

    type HarnessWindow = Window &
        typeof globalThis & {
            __POST_HISTORY_HARNESS__?: HarnessState;
        };

    function buildHexId(index: number, suffix: string): string {
        const prefix = index.toString(16).padStart(60, "0");
        return `${prefix}${suffix}`.slice(0, 64);
    }

    function buildPost(index: number): PostHistoryRecord {
        const timestampMs = STARTED_AT_MS - index * 24 * 60 * 60 * 1000;
        const timestampSeconds = Math.floor(timestampMs / 1000);
        const label = index < SEARCH_MATCHING_POSTS ? "alpha" : "beta";

        return {
            id: `playwright-post-${index}`,
            eventId: buildHexId(index, "aa"),
            pubkeyHex: HARNESS_PUBKEY,
            kind: 1,
            content: `${label} post ${index + 1}`,
            tags: [],
            createdAt: timestampSeconds,
            postedAt: timestampMs,
            relayHints: [],
            acceptedRelays: [],
            media:
                index % 17 === 0
                    ? [
                          {
                              url: `https://example.com/post-history-${index}.jpg`,
                              mimeType: "image/jpeg",
                          },
                      ]
                    : [],
            rawEvent: null,
            fetchedAt: timestampMs,
            lastSeenAt: timestampMs,
            updatedAt: timestampMs,
            schemaVersion: 2,
        };
    }

    const posts = Array.from({ length: TOTAL_POSTS }, (_, index) =>
        buildPost(index),
    );
    const jumpDate = new Date(posts[56].postedAt).toISOString().slice(0, 10);

    (window as HarnessWindow).__POST_HISTORY_HARNESS__ = {
        ready: false,
        pubkeyHex: HARNESS_PUBKEY,
        totalPosts: TOTAL_POSTS,
        matchingPosts: SEARCH_MATCHING_POSTS,
        jumpDate,
    };

    onMount(async () => {
        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewStateForPubkey(HARNESS_PUBKEY);
        await postHistoryVisibleRangeRepository.clearForPubkey(HARNESS_PUBKEY);
        await ehagakiDb.postHistory
            .where("pubkeyHex")
            .equals(HARNESS_PUBKEY)
            .delete();
        await ehagakiDb.postHistory.bulkPut(posts);

        ready = true;
        (window as HarnessWindow).__POST_HISTORY_HARNESS__ = {
            ready: true,
            pubkeyHex: HARNESS_PUBKEY,
            totalPosts: TOTAL_POSTS,
            matchingPosts: SEARCH_MATCHING_POSTS,
            jumpDate,
        };
    });
</script>

<svelte:head>
    <title>Post History Dialog Playwright Harness</title>
</svelte:head>

<div class="post-history-playwright-harness">
    {#if ready}
        <PostHistoryDialog
            show={true}
            onClose={() => undefined}
            pubkeyHex={HARNESS_PUBKEY}
        />
    {/if}
</div>

<style>
    :global(body) {
        min-height: 100vh;
        margin: 0;
        background: radial-gradient(
                circle at top left,
                rgba(27, 85, 138, 0.14),
                transparent 32%
            ),
            linear-gradient(180deg, #f5f1e8 0%, #efe8dd 100%);
    }

    .post-history-playwright-harness {
        min-height: 100vh;
    }
</style>
