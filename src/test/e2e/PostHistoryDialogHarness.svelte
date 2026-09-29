<script lang="ts">
    import { onMount } from "svelte";
    import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
    import type { RxNostr } from "rx-nostr";
    import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
    import type { NostrEvent } from "../../lib/types";
    import { clearPersistedPostHistoryListingSnapshots } from "../../lib/hooks/usePostHistoryListing.svelte";
    import { clearPersistedPostHistoryViewStateForPubkey } from "../../lib/postHistoryDialogViewState";
    import {
        ehagakiDb,
        type PostHistoryRecord,
        type PostHistoryChildInteractionRecord,
    } from "../../lib/storage/ehagakiDb";
    import { postHistoryVisibleRangeRepository } from "../../lib/storage/postHistoryVisibleRangeRepository";
    import { postHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";
    import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";
    import { formatPostHistoryMonthLabel } from "../../lib/postHistoryDialogUtils";
    import { toPostHistoryDeletionRequestReferenceRecord } from "../../lib/postHistoryDeletionUtils";

    const HARNESS_SECRET_KEY = generateSecretKey();
    const HARNESS_PUBKEY = getPublicKey(HARNESS_SECRET_KEY);
    const isInfiniteScrollScenario = new URLSearchParams(window.location.search).has("infinite-scroll");
    const isLongPreviewScenario = new URLSearchParams(window.location.search).has("long-preview");
    const isLayoutStabilityScenario = new URLSearchParams(window.location.search).has("layout-stability");
    const isSparseOldestScenario = new URLSearchParams(window.location.search).has("sparse-oldest");
    const TOTAL_POSTS = isInfiniteScrollScenario
        ? 251
        : isSparseOldestScenario
          ? 120
          : 70;
    const SEARCH_MATCHING_POSTS = 55;
    const isSparseScenario = new URLSearchParams(window.location.search).has("sparse")
        || isSparseOldestScenario;
    const isExportScenario = new URLSearchParams(window.location.search).has("export");
    const HARNESS_YEAR = new Date().getFullYear();
    const STARTED_AT_MS = Date.UTC(HARNESS_YEAR, 0, 20, 12, 0, 0);
    const IMPORT_POST_CONTENT = "playwright imported JSONL post";
    const IMPORT_EVENT_JSONL = JSON.stringify(finalizeEvent({
        kind: 1,
        content: IMPORT_POST_CONTENT,
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
    }, HARNESS_SECRET_KEY));

    let ready = $state(false);
    let showDialog = $state(true);

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
        quotePostEventId: string;
        quoteContent: string;
        linkTargetUrl: string;
        linkPostEventId: string;
        replyParentEventId: string;
        replyContent: string;
        threadParentPostEventId: string;
        importPostContent: string;
        importEventJsonl: string;
        sparseVisiblePostContent: string;
        sparseStoredPostContent: string;
        sparseStoredPostEventId: string;
        absoluteOldestPostContent: string;
        infiniteScrollEventIds: string[];
        infiniteScrollOldestPostContent: string;
        layoutStabilityPostEventId: string;
        layoutImageUrl: string;
        layoutVideoUrl: string;
        layoutEmojiSuccessUrl: string;
        layoutEmojiFailureUrl: string;
    };

    type HarnessWindow = Window &
        typeof globalThis & {
            __POST_HISTORY_HARNESS__?: HarnessState;
            __POST_HISTORY_SCROLL_LOAD_GATE__?: {
                direction: "older" | "newer" | null;
                entered: boolean;
                release: (() => void) | null;
            };
            __POST_HISTORY_INTERACTION_LOAD_GATE__?: {
                entered: boolean;
                release: (() => void) | null;
            };
        };

    function buildHexId(index: number, suffix: string): string {
        const prefix = index
            .toString(16)
            .padStart(64 - suffix.length, "0");
        return `${prefix}${suffix}`.slice(0, 64);
    }

    function buildPost(index: number): PostHistoryRecord {
        const timestampMs = STARTED_AT_MS - index * 24 * 60 * 60 * 1000;
        const timestampSeconds = Math.floor(timestampMs / 1000);
        const label = index < SEARCH_MATCHING_POSTS ? "alpha" : "beta";
        const eventId = buildHexId(index, "aa");

        return {
            id: eventId,
            eventId,
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

    const longPreviewContent = Array.from(
        { length: 14 },
        (_, index) => `long preview line ${index + 1}`,
    ).join("\n");
    const layoutImageUrl = new URL("layout-stable-image.png", window.location.href).href;
    const layoutVideoUrl = new URL("layout-stable-video.mp4", window.location.href).href;
    const layoutEmojiSuccessUrl = new URL("layout-stable-emoji.png", window.location.href).href;
    const layoutEmojiFailureUrl = new URL("layout-failed-emoji.png", window.location.href).href;
    const posts = Array.from({ length: TOTAL_POSTS }, (_, index) => {
        const post = buildPost(index);
        if (isLayoutStabilityScenario && index === 0) {
            return {
                ...post,
                content: "Content before :stable_ratio: and :stable_failure: content after.",
                deletedAt: post.createdAt,
                tags: [
                    ["emoji", "stable_ratio", layoutEmojiSuccessUrl],
                    ["emoji", "stable_failure", layoutEmojiFailureUrl],
                ],
                media: [
                    { url: layoutImageUrl, mimeType: "image/png" },
                    { url: layoutVideoUrl, mimeType: "video/mp4" },
                ],
            };
        }
        return isInfiniteScrollScenario
            && isLongPreviewScenario
            && (index === 70 || index === 150)
            ? { ...post, content: longPreviewContent }
            : post;
    });
    const exportPostEvent = finalizeEvent({
        kind: 1,
        content: "playwright export post",
        tags: [],
        created_at: Math.floor(Date.now() / 1000) - 30,
    }, HARNESS_SECRET_KEY);
    const exportChannelEvent = finalizeEvent({
        kind: 42,
        content: "playwright export channel post",
        tags: [],
        created_at: Math.floor(Date.now() / 1000) - 20,
    }, HARNESS_SECRET_KEY);
    const exportDeletionEvent = finalizeEvent({
        kind: 5,
        content: "",
        tags: [["e", exportPostEvent.id]],
        created_at: Math.floor(Date.now() / 1000) - 10,
    }, HARNESS_SECRET_KEY);
    function buildExportPostRecord(event: NostrEvent): PostHistoryRecord {
        return {
            id: event.id,
            eventId: event.id,
            pubkeyHex: event.pubkey,
            kind: event.kind,
            content: event.content,
            tags: event.tags,
            createdAt: event.created_at,
            postedAt: event.created_at * 1000,
            relayHints: [],
            acceptedRelays: [],
            media: [],
            rawEvent: event,
            updatedAt: event.created_at * 1000,
            schemaVersion: 2,
        };
    }
    const exportPostRecords = [
        buildExportPostRecord(exportPostEvent),
        buildExportPostRecord(exportChannelEvent),
    ];
    const exportDeletionRecord = toPostHistoryDeletionRequestReferenceRecord({
        deletionEvent: exportDeletionEvent,
        targetEventId: exportPostEvent.id,
        targetVerified: true,
        fetchedAt: exportDeletionEvent.created_at * 1000,
    });
    const linkTargetUrl = new URL(
        "reference-link-target",
        window.location.href,
    ).href;
    const linkPost = posts[1];
    linkPost.content = [
        `alpha reference ${linkTargetUrl}`,
        "line 2",
        "line 3",
        "line 4",
        "line 5",
        `line 6 ${"long-path-segment-".repeat(12)}`,
    ].join("\n");
    const quoteEventId = "9".repeat(64);
    const loadingQuoteEventId = "8".repeat(64);
    const quoteContent = `playwright quote source ${linkTargetUrl}`;
    const quoteParentPost = posts[2];
    const quoteRecord: PostHistoryRecord = {
        id: quoteEventId,
        eventId: quoteEventId,
        pubkeyHex: "e".repeat(64),
        kind: 1,
        content: quoteContent,
        tags: [],
        createdAt: quoteParentPost.createdAt - 60,
        postedAt: quoteParentPost.postedAt - 60_000,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: {
            id: quoteEventId,
            pubkey: "e".repeat(64),
            kind: 1,
            content: quoteContent,
            tags: [],
            created_at: quoteParentPost.createdAt - 60,
            sig: "a".repeat(128),
        },
        fetchedAt: quoteParentPost.postedAt,
        lastSeenAt: quoteParentPost.postedAt,
        updatedAt: quoteParentPost.postedAt,
        schemaVersion: 2,
    };
    // Keep this probe focused on fixed-size content; unresolved quote height is
    // the documented exception and has its own existing UI coverage.
    quoteParentPost.tags = isLayoutStabilityScenario
        ? []
        : [
              ["q", quoteEventId, "wss://relay.example.com/", quoteRecord.pubkeyHex],
              ["q", loadingQuoteEventId, "wss://relay.example.com/", "d".repeat(64)],
          ];
    quoteParentPost.rawEvent = {
        id: quoteParentPost.eventId,
        pubkey: HARNESS_PUBKEY,
        kind: 1,
        content: quoteParentPost.content,
        tags: quoteParentPost.tags,
        created_at: quoteParentPost.createdAt,
        sig: "b".repeat(128),
    };
    const threadParentPost = posts[3];
    threadParentPost.tags = isLayoutStabilityScenario
        ? []
        : [
              ["e", quoteEventId, "", "reply"],
              ["p", quoteRecord.pubkeyHex],
          ];
    threadParentPost.rawEvent = {
        id: threadParentPost.eventId,
        pubkey: HARNESS_PUBKEY,
        kind: 1,
        content: threadParentPost.content,
        tags: threadParentPost.tags,
        created_at: threadParentPost.createdAt,
        sig: "e".repeat(128),
    };
    const replyEventId = "7".repeat(64);
    const replyContent = `playwright direct reply ${linkTargetUrl}`;
    const replyCreatedAt = linkPost.createdAt + 60;
    const replyRecord: PostHistoryChildInteractionRecord = {
        id: replyEventId,
        eventId: replyEventId,
        parentEventId: linkPost.eventId,
        authorPubkey: "6".repeat(64),
        kind: 1,
        content: replyContent,
        tags: [
            ["p", HARNESS_PUBKEY],
            ["e", linkPost.eventId, "", "reply"],
        ],
        createdAt: replyCreatedAt,
        relayUrls: ["wss://relay.example.com/"],
        discoveredAs: ["direct-reply"],
        rawEvent: {
            id: replyEventId,
            pubkey: "6".repeat(64),
            kind: 1,
            content: replyContent,
            tags: [
                ["p", HARNESS_PUBKEY],
                ["e", linkPost.eventId, "", "reply"],
            ],
            created_at: replyCreatedAt,
            sig: "c".repeat(128),
        },
        fetchedAt: linkPost.updatedAt,
        updatedAt: linkPost.updatedAt,
        schemaVersion: 1,
    };
    const interactionRecords = [
        buildReactionRecord(0),
        buildReactionRecord(20),
    ];
    const jumpDate = new Date(posts[56].postedAt).toISOString().slice(0, 10);
    const scrollTargetPost = posts[60];
    const sparseVisiblePost = posts[29];
    const sparseStoredPost = posts[31];
    const absoluteOldestPost = posts[posts.length - 1];
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
        quotePostEventId: quoteParentPost.eventId,
        quoteContent,
        linkTargetUrl,
        linkPostEventId: linkPost.eventId,
        replyParentEventId: linkPost.eventId,
        replyContent,
        threadParentPostEventId: threadParentPost.eventId,
        importPostContent: IMPORT_POST_CONTENT,
        importEventJsonl: IMPORT_EVENT_JSONL,
        sparseVisiblePostContent: sparseVisiblePost.content,
        sparseStoredPostContent: sparseStoredPost.content,
        sparseStoredPostEventId: sparseStoredPost.eventId,
        absoluteOldestPostContent: absoluteOldestPost.content,
        infiniteScrollEventIds: posts.map((post) => post.eventId),
        infiniteScrollOldestPostContent: absoluteOldestPost.content,
        layoutStabilityPostEventId: posts[0].eventId,
        layoutImageUrl,
        layoutVideoUrl,
        layoutEmojiSuccessUrl,
        layoutEmojiFailureUrl,
    };

    onMount(async () => {
        const harnessWindow = window as HarnessWindow;
        harnessWindow.__POST_HISTORY_SCROLL_LOAD_GATE__ = {
            direction: null,
            entered: false,
            release: null,
        };
        const originalGetOlderVisibleChunk =
            postHistoryRepository.getOlderVisibleChunk.bind(postHistoryRepository);
        postHistoryRepository.getOlderVisibleChunk = async (options) => {
            const gate = harnessWindow.__POST_HISTORY_SCROLL_LOAD_GATE__;
            if (gate?.direction === "older" && !gate.entered) {
                gate.entered = true;
                await new Promise<void>((resolve) => {
                    gate.release = resolve;
                });
                gate.direction = null;
                gate.release = null;
            }
            return originalGetOlderVisibleChunk(options);
        };
        const originalGetNewerVisibleChunk =
            postHistoryRepository.getNewerVisibleChunk.bind(postHistoryRepository);
        postHistoryRepository.getNewerVisibleChunk = async (options) => {
            const gate = harnessWindow.__POST_HISTORY_SCROLL_LOAD_GATE__;
            if (gate?.direction === "newer" && !gate.entered) {
                gate.entered = true;
                await new Promise<void>((resolve) => {
                    gate.release = resolve;
                });
                gate.direction = null;
                gate.release = null;
            }
            return originalGetNewerVisibleChunk(options);
        };

        clearPersistedPostHistoryListingSnapshots();
        clearPersistedPostHistoryViewStateForPubkey(HARNESS_PUBKEY);
        await postHistoryVisibleRangeRepository.clearForPubkey(HARNESS_PUBKEY);
        await ehagakiDb.postHistory
            .where("pubkeyHex")
            .equals(HARNESS_PUBKEY)
            .delete();
        await ehagakiDb.postHistoryDeletionRequests
            .where("targetAuthorPubkey")
            .equals(HARNESS_PUBKEY)
            .delete();
        await ehagakiDb.postHistoryChildInteractions.clear();
        await ehagakiDb.postHistory.bulkPut(
            isExportScenario ? exportPostRecords : [...posts, quoteRecord],
        );
        if (isExportScenario) {
            await ehagakiDb.postHistoryDeletionRequests.put(exportDeletionRecord);
        }
        await ehagakiDb.postHistoryChildInteractions.bulkPut(
            interactionRecords,
        );
        if (isSparseScenario) {
            await postHistoryVisibleRangeRepository.save({
                pubkeyHex: HARNESS_PUBKEY,
                kindsKey: "1,42",
                visibleUntil: sparseVisiblePost.createdAt,
            });
        }
        await postHistoryChildInteractionsRepository.upsertChildInteractions({
            parentEventId: linkPost.eventId,
            events: [
                {
                    event: replyRecord.rawEvent as NostrEvent,
                    relayUrls: replyRecord.relayUrls,
                },
            ],
            fetchedAt: replyRecord.fetchedAt,
        });

        const interactionLoadGate = {
            entered: false,
            release: null as (() => void) | null,
        };
        harnessWindow.__POST_HISTORY_INTERACTION_LOAD_GATE__ = interactionLoadGate;
        const originalGetChildInteractionsForParents =
            postHistoryChildInteractionsRepository.getChildInteractionsForParents.bind(
                postHistoryChildInteractionsRepository,
            );
        postHistoryChildInteractionsRepository.getChildInteractionsForParents = async (
            parentEventIds,
        ) => {
            if (isLayoutStabilityScenario && !interactionLoadGate.entered) {
                interactionLoadGate.entered = true;
                await new Promise<void>((resolve) => {
                    interactionLoadGate.release = resolve;
                });
                interactionLoadGate.release = null;
            }
            return originalGetChildInteractionsForParents(parentEventIds);
        };

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
            quotePostEventId: quoteParentPost.eventId,
            quoteContent,
            linkTargetUrl,
            linkPostEventId: linkPost.eventId,
            replyParentEventId: linkPost.eventId,
            replyContent,
            threadParentPostEventId: threadParentPost.eventId,
            importPostContent: IMPORT_POST_CONTENT,
            importEventJsonl: IMPORT_EVENT_JSONL,
            sparseVisiblePostContent: sparseVisiblePost.content,
            sparseStoredPostContent: sparseStoredPost.content,
            sparseStoredPostEventId: sparseStoredPost.eventId,
            absoluteOldestPostContent: absoluteOldestPost.content,
            infiniteScrollEventIds: posts.map((post) => post.eventId),
            infiniteScrollOldestPostContent: absoluteOldestPost.content,
            layoutStabilityPostEventId: posts[0].eventId,
            layoutImageUrl,
            layoutVideoUrl,
            layoutEmojiSuccessUrl,
            layoutEmojiFailureUrl,
        };
    });
</script>

<svelte:head>
    <title>Post History Dialog Playwright Harness</title>
</svelte:head>

<div class="post-history-playwright-harness">
    {#if ready && showDialog}
        <div data-testid="post-history-mounted">
            <PostHistoryDialog
                show={showDialog}
                onClose={() => (showDialog = false)}
                pubkeyHex={HARNESS_PUBKEY}
                rxNostr={{
                    use: () => ({
                        subscribe: () => ({ unsubscribe: () => undefined }),
                    }),
                } as unknown as RxNostr}
                onQuotePost={() => undefined}
            />
        </div>
    {/if}
    {#if ready && !showDialog}
        <button
            type="button"
            data-testid="post-history-reopen"
            onclick={() => (showDialog = true)}
        >
            reopen post history
        </button>
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
