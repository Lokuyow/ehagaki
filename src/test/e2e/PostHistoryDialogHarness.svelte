<script lang="ts">
    import { onMount } from "svelte";
    import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
    import { clearPersistedPostHistoryListingSnapshots } from "../../lib/hooks/usePostHistoryListing.svelte";
    import { clearPersistedPostHistoryViewStateForPubkey } from "../../lib/postHistoryDialogViewState";
    import {
        ehagakiDb,
        type PostHistoryRecord,
        type PostHistoryChildInteractionRecord,
    } from "../../lib/storage/ehagakiDb";
    import { postHistoryVisibleRangeRepository } from "../../lib/storage/postHistoryVisibleRangeRepository";
    import { formatPostHistoryMonthLabel } from "../../lib/postHistoryDialogUtils";

    const HARNESS_PUBKEY = "f".repeat(64);
    const TOTAL_POSTS = 70;
    const SEARCH_MATCHING_POSTS = 55;
    const HARNESS_YEAR = new Date().getFullYear();
    const STARTED_AT_MS = Date.UTC(HARNESS_YEAR, 0, 20, 12, 0, 0);

    let ready = $state(false);

    type HarnessState = {
        ready: boolean;
        pubkeyHex: string;
        totalPosts: number;
        matchingPosts: number;
        jumpDate: string;
        initialMonthLabel: string;
        scrollTargetContent: string;
        scrollTargetMonthLabel: string;
        reactionPostEventId: string;
        plainPostEventId: string;
        scrolledReactionPostEventId: string;
        scrolledPlainPostEventId: string;
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

    function buildReactionRecord(index: number): PostHistoryChildInteractionRecord {
        const parentPost = posts[index];
        const createdAt = parentPost.createdAt + 60;

        return {
            id: `playwright-reaction-${index}`,
            eventId: buildHexId(index, "bb"),
            parentEventId: parentPost.eventId,
            authorPubkey: buildHexId(index, "cc"),
            kind: 7,
            content: "+",
            tags: [
                ["p", HARNESS_PUBKEY],
                ["e", parentPost.eventId],
            ],
            createdAt,
            relayUrls: ["wss://relay.example.com/"],
            discoveredAs: ["reaction"],
            rawEvent: {
                id: buildHexId(index, "bb"),
                pubkey: buildHexId(index, "cc"),
                kind: 7,
                content: "+",
                tags: [
                    ["p", HARNESS_PUBKEY],
                    ["e", parentPost.eventId],
                ],
                created_at: createdAt,
                sig: "d".repeat(128),
            },
            fetchedAt: parentPost.updatedAt,
            updatedAt: parentPost.updatedAt,
            schemaVersion: 1,
        };
    }

    const posts = Array.from({ length: TOTAL_POSTS }, (_, index) =>
        buildPost(index),
    );
    const reactionRecords = [buildReactionRecord(0), buildReactionRecord(20)];
    const jumpDate = new Date(posts[56].postedAt).toISOString().slice(0, 10);
    const scrollTargetPost = posts[60];
    const initialMonthLabel = formatPostHistoryMonthLabel(
        posts[0].postedAt,
        "ja",
    );
    const scrollTargetMonthLabel = formatPostHistoryMonthLabel(
        scrollTargetPost.postedAt,
        "ja",
    );

    (window as HarnessWindow).__POST_HISTORY_HARNESS__ = {
        ready: false,
        pubkeyHex: HARNESS_PUBKEY,
        totalPosts: TOTAL_POSTS,
        matchingPosts: SEARCH_MATCHING_POSTS,
        jumpDate,
        initialMonthLabel,
        scrollTargetContent: scrollTargetPost.content,
        scrollTargetMonthLabel,
        reactionPostEventId: posts[0].eventId,
        plainPostEventId: posts[1].eventId,
        scrolledReactionPostEventId: posts[20].eventId,
        scrolledPlainPostEventId: posts[21].eventId,
    };

    onMount(async () => {
        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewStateForPubkey(HARNESS_PUBKEY);
        await postHistoryVisibleRangeRepository.clearForPubkey(HARNESS_PUBKEY);
        await ehagakiDb.postHistory
            .where("pubkeyHex")
            .equals(HARNESS_PUBKEY)
            .delete();
        await ehagakiDb.postHistoryChildInteractions.clear();
        await ehagakiDb.postHistory.bulkPut(posts);
        await ehagakiDb.postHistoryChildInteractions.bulkPut(reactionRecords);

        ready = true;
        (window as HarnessWindow).__POST_HISTORY_HARNESS__ = {
            ready: true,
            pubkeyHex: HARNESS_PUBKEY,
            totalPosts: TOTAL_POSTS,
            matchingPosts: SEARCH_MATCHING_POSTS,
            jumpDate,
            initialMonthLabel,
            scrollTargetContent: scrollTargetPost.content,
            scrollTargetMonthLabel,
            reactionPostEventId: posts[0].eventId,
            plainPostEventId: posts[1].eventId,
            scrolledReactionPostEventId: posts[20].eventId,
            scrolledPlainPostEventId: posts[21].eventId,
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
            onQuotePost={() => undefined}
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
