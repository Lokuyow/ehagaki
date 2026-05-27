<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { onDestroy, tick, untrack } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { Dialog, DropdownMenu } from "bits-ui";
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import ImageFullscreen from "./ImageFullscreen.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryMediaList from "./PostHistoryMediaList.svelte";
    import PostHistoryQuotePreview from "./PostHistoryQuotePreview.svelte";
    import PostHistoryPreviewContent from "./PostHistoryPreviewContent.svelte";
    import PostHistoryThreadGraphPanel from "./PostHistoryThreadGraphPanel.svelte";
    import { usePostHistoryChannelDisplay } from "../lib/hooks/usePostHistoryChannelDisplay.svelte";
    import { usePostHistoryCopyNevent } from "../lib/hooks/usePostHistoryCopyNevent.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { usePostHistoryEmojiState } from "../lib/hooks/usePostHistoryEmojiState.svelte";
    import { usePostHistoryPostActionUiController } from "../lib/hooks/usePostHistoryPostActionUiController.svelte";
    import { usePostHistoryQuotePreviews } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";
    import { usePostHistoryListing } from "../lib/hooks/usePostHistoryListing.svelte";
    import { usePostHistoryDialogViewport } from "../lib/hooks/usePostHistoryDialogViewport.svelte";
    import { usePostHistoryPreviewCollapse } from "../lib/hooks/usePostHistoryPreviewCollapse.svelte";
    import { usePostHistoryThreadGraph } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import { usePostHistoryInboundInteractionsSync } from "../lib/hooks/usePostHistoryInboundInteractionsSync.svelte";
    import type { PostHistoryThreadGraphNodeState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import type {
        PostHistoryInboundDirectReplyCandidate,
        PostHistoryInboundReplyReconciliationResult,
    } from "../lib/postHistoryInboundReplyReconciliationService";
    import {
        canRequestPostDeletion,
        postDeletionService,
    } from "../lib/postDeletionService";
    import {
        buildPreviewContent,
        formatPostedAt,
        type PostHistoryPreviewContent as PostHistoryPreviewContentData,
    } from "../lib/postHistoryDialogUtils";
    import {
        hasRenderablePostHistoryPreviewContent,
        isPostHistoryFavoriteReactionContent,
        type PostHistoryDisplayedReactionGroup,
        resolvePostHistoryCountSummaryState,
        resolvePostHistoryDisplayedReactionGroups,
        resolvePostHistoryNavigationLabelKey,
        resolvePostHistoryReactionsActionLabelState,
        resolvePostHistoryRepliesActionLabelState,
        type PostHistoryDialogMessageState,
    } from "../lib/postHistoryDialogPresentation";
    import { stripPostHistoryInlineQuoteUrisForDisplay } from "../lib/postHistoryQuoteUtils";
    import { createPostHistoryRelatedTargetResolver } from "../lib/postHistoryRelatedTargetResolver.svelte";
    import { POST_HISTORY_PAGE_SIZE } from "../lib/postHistoryRelayFetchService";
    import { reconcilePendingDeletionRequestsForParentEventIds } from "../lib/postHistoryPendingDeletionRequestsReconcile";
    import { triggerPostHistoryReactionLifecycle } from "../lib/postHistoryReactionLifecycleTrigger";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import { resetPendingDeletionRequests } from "../stores/postHistoryDeletionLifecycleStore.svelte";
    import type {
        FullscreenMediaItem,
        NostrEvent,
        RelayConfig,
    } from "../lib/types";

    type PostHistoryUtilityPanel = "none" | "search" | "jump-date";

    const POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE = 18;

    interface Props {
        show: boolean;
        onClose: () => void;
        onReplyPost?: (post: PostHistoryRecord) => void;
        onQuotePost?: (post: PostHistoryRecord) => void;
        pubkeyHex?: string | null;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
        latestPostedEvent?: NostrEvent | null;
        inboundDirectReplySave?: {
            revision: number;
            parentEventIds: string[];
        } | null;
        authoredSelfPostSave?: {
            revision: number;
            eventIds: string[];
        } | null;
        reconcileInboundDirectReplyCandidates?: (
            candidates: PostHistoryInboundDirectReplyCandidate[],
        ) => Promise<PostHistoryInboundReplyReconciliationResult>;
        notifySavedAuthoredPosts?: (
            eventIds: string[],
        ) => Promise<PostHistoryInboundReplyReconciliationResult>;
    }

    let {
        show = $bindable(false),
        onClose,
        onReplyPost = undefined,
        onQuotePost = undefined,
        pubkeyHex = null,
        rxNostr = undefined,
        relayConfig = null,
        latestPostedEvent = null,
        inboundDirectReplySave = null,
        authoredSelfPostSave = null,
        reconcileInboundDirectReplyCandidates = undefined,
        notifySavedAuthoredPosts = undefined,
    }: Props = $props();

    const history = usePostHistoryListing({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getSessionScrollState: () =>
            historyViewport.readCurrentSessionScrollState(),
        onSessionScrollStateInvalidated: () =>
            historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey(),
        onSavedAuthoredPosts: async (eventIds) => {
            await notifySavedAuthoredPosts?.(eventIds);
        },
        onReplyBadgeRefreshRequested: (posts, parentEventIds) =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                posts,
                parentEventIds,
            ),
        pageSize: POST_HISTORY_PAGE_SIZE,
    });
    const channelDisplay = usePostHistoryChannelDisplay({
        getShow: () => show,
        getPosts: () => history.posts,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getIsSearchMode: () => history.isSearchMode,
    });
    const relatedTargetResolver = createPostHistoryRelatedTargetResolver({
        getShow: () => show,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
    });
    const quotePreviews = usePostHistoryQuotePreviews({
        getShow: () => show,
        getPosts: () => history.posts,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        relatedTargetResolver,
    });
    const postHistoryThreadGraph = usePostHistoryThreadGraph({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        relatedTargetResolver,
    });
    usePostHistoryInboundInteractionsSync({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => relayConfig,
        getPosts: () => history.posts,
        onSavedDirectReplies: (parentEventIds) =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                history.posts,
                parentEventIds,
            ),
        reconcileDirectReplyCandidates: (candidates) =>
            reconcileInboundDirectReplyCandidates?.(candidates) ??
            Promise.resolve({
                savedParentEventIds: [],
                savedDirectReplyCount: 0,
                unresolvedParentEventIds: candidates
                    .map((candidate) => candidate.classification.parentEventId)
                    .filter((eventId): eventId is string => !!eventId),
            }),
    });
    const postActionUi =
        usePostHistoryPostActionUiController<PostHistoryRecord>();
    const copyNeventUi = usePostHistoryCopyNevent();

    let localHistoryDeleteConfirmOpen = $state(false);
    let isDeletingLocalHistory = $state(false);
    let activeUtilityPanel = $state<PostHistoryUtilityPanel>("none");
    let jumpDateInput = $state("");
    let appliedLatestPostedReplyEventId: string | null = null;
    let headingMenuOpen = $state(false);
    let deleteRequestState = $state<
        Record<string, "sending" | "failed" | undefined>
    >({});
    let reactionsExpandedByEventId = $state<Record<string, boolean>>({});
    let fullscreenMediaItems = $state<FullscreenMediaItem[]>([]);
    let fullscreenIndex = $state(-1);
    let showImageFullscreen = $state(false);
    let historyContainer = $state<HTMLDivElement | null>(null);
    let searchInputElement = $state<HTMLInputElement | null>(null);
    const previewCollapse = usePostHistoryPreviewCollapse({
        getShow: () => show,
        getPosts: () => history.posts,
        getContainer: () => historyContainer,
    });
    const historyViewport = usePostHistoryDialogViewport({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        getPosts: () => history.posts,
        getLocale: () => $locale,
        getContainer: () => historyContainer,
        getIsSearchMode: () => history.isSearchMode,
        getSearchQuery: () => history.state.searchQuery,
    });
    const emojiState = usePostHistoryEmojiState({
        getShow: () => show,
        getEmojiUrls: () => dialogEmojiUrls,
        onStateChanged: () => previewCollapse.remeasure(),
    });

    function buildDisplayPreviewContent(
        post: PostHistoryRecord,
    ): PostHistoryPreviewContentData {
        return buildPreviewContent({
            content: stripPostHistoryInlineQuoteUrisForDisplay(post),
            tags: post.tags,
            media: post.media,
        });
    }

    function isReactionEmojiReady(url: string): boolean {
        return emojiState.emojiLoadStateByUrl[url] === "ready";
    }

    function hasReactionEmojiFailed(url: string): boolean {
        return emojiState.emojiLoadStateByUrl[url] === "failed";
    }

    function formatReactionEmojiPixelValue(value: number): string {
        return Number.isInteger(value)
            ? `${value}`
            : value
                  .toFixed(6)
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d*?)0+$/, "$1");
    }

    function getReactionEmojiSlotStyle(url: string): string {
        const aspectRatio = emojiState.emojiImageMetaByUrl[url]?.aspectRatio;
        const hasAspectRatio =
            typeof aspectRatio === "number" &&
            Number.isFinite(aspectRatio) &&
            aspectRatio > 0;
        const slotWidth = hasAspectRatio
            ? POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE * aspectRatio
            : POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE;

        return [
            `width: ${formatReactionEmojiPixelValue(slotWidth)}px;`,
            `height: ${POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE}px;`,
            "vertical-align: bottom;",
        ].join(" ");
    }

    let previewContentByEventId = $derived.by(() => {
        const nextContent: Record<string, PostHistoryPreviewContentData> = {};

        for (const post of history.posts) {
            nextContent[post.eventId] = buildDisplayPreviewContent(post);
        }

        return nextContent;
    });
    let displayedReactionGroupsByEventId = $derived.by(() => {
        const nextGroups: Record<string, PostHistoryDisplayedReactionGroup[]> =
            {};

        for (const post of history.posts) {
            nextGroups[post.eventId] =
                resolvePostHistoryDisplayedReactionGroups(
                    postHistoryThreadGraph.getAnchorState(post).reactionSummary
                        .groups,
                );
        }

        return nextGroups;
    });
    let headingStatusMessageKey = $derived(
        history.currentViewRefetchStatusMessageKey ??
            history.syncStatusMessageKey,
    );
    let headingStatusMessageValues = $derived(
        history.currentViewRefetchStatusMessageKey
            ? history.currentViewRefetchStatusMessageValues
            : null,
    );
    let headingStatusError = $derived(
        history.syncStatus === "failed" ||
            history.currentViewRefetchStatusMessageKey ===
                "postHistory.repairPartialFailure" ||
            history.currentViewRefetchStatusMessageKey ===
                "postHistory.repairFetchFailed",
    );
    let canUseReturnToLatest = $derived(
        history.canReturnToLatest || !historyViewport.isHistoryScrolledToTop,
    );
    let canUseJumpToOldest = $derived(
        history.canJumpToOldest || !historyViewport.isHistoryScrolledToBottom,
    );
    let dialogEmojiUrls = $derived.by(() => {
        const urls = new Set<string>();

        for (const previewContent of Object.values(previewContentByEventId)) {
            for (const url of previewContent.emojiUrls) {
                urls.add(url);
            }
        }

        for (const post of history.posts) {
            if (!reactionsExpandedByEventId[post.eventId]) {
                continue;
            }

            for (const reactionGroup of displayedReactionGroupsByEventId[
                post.eventId
            ] ?? []) {
                if (reactionGroup.emojiUrl) {
                    urls.add(reactionGroup.emojiUrl);
                }
            }
        }

        return [...urls];
    });

    function resetDialogState(): void {
        copyNeventUi.resetState();
        postActionUi.resetDeleteConfirmation();
        localHistoryDeleteConfirmOpen = false;
        isDeletingLocalHistory = false;
        activeUtilityPanel = "none";
        jumpDateInput = "";
        headingMenuOpen = false;
        deleteRequestState = {};
        resetPendingDeletionRequests();
        reactionsExpandedByEventId = {};
        emojiState.resetState();
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        showImageFullscreen = false;
    }

    function handleClose() {
        historyViewport.saveCurrentSessionScrollAnchor();
        history.cancelCurrentSync();
        history.cancelCurrentViewRefetch();
        channelDisplay.cancelCurrentChannelResolution();
        postHistoryThreadGraph.cancelCurrentGraphFetches();
        postActionUi.resetDeleteConfirmation();
        localHistoryDeleteConfirmOpen = false;
        headingMenuOpen = false;
        copyNeventUi.hideCopyFloatingMessage();
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        show = false;
        onClose?.();
    }

    function isFullscreenViewerTarget(target: EventTarget | null): boolean {
        return (
            target instanceof Element &&
            target.closest(".ehagaki-pswp") !== null
        );
    }

    function handleDialogInteractOutside(event: PointerEvent): void {
        if (isFullscreenViewerTarget(event.target)) {
            event.preventDefault();
        }
    }

    useDialogHistory(() => show, handleClose, true);

    $effect(() => {
        if (show) {
            return;
        }

        resetDialogState();
    });

    onDestroy(() => {
        resetPendingDeletionRequests();
    });

    $effect(() => {
        if (!show || !latestPostedEvent?.id) {
            return;
        }

        const eventId = latestPostedEvent.id;
        if (appliedLatestPostedReplyEventId === eventId) {
            return;
        }

        history.posts;
        void postHistoryThreadGraph
            .recordPostedReply(latestPostedEvent, history.posts)
            .then((applied) => {
                if (applied) {
                    appliedLatestPostedReplyEventId = eventId;
                }
            })
            .catch(() => undefined);
    });

    $effect(() => {
        const posts = history.posts;
        if (!show || posts.length === 0) {
            return;
        }

        void reconcilePendingDeletionRequestsForParentEventIds(
            posts.map((post) => post.eventId),
        ).catch(() => undefined);

        void untrack(() =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                posts,
            ),
        );
    });

    $effect(() => {
        const revision = inboundDirectReplySave?.revision ?? 0;
        const parentEventIds = inboundDirectReplySave?.parentEventIds ?? [];
        const posts = history.posts;
        if (!show || revision <= 0 || parentEventIds.length === 0) {
            return;
        }

        void untrack(() =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                posts,
                parentEventIds,
            ),
        );

        void triggerPostHistoryReactionLifecycle({
            source: "dialog-inbound-save",
            parentEventIds,
            rxNostr,
            relayConfig,
            isActive: () => show,
        })
            .then((result) => {
                if (!show || result.deletedReactionEventIds.length === 0) {
                    return;
                }

                return postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                    history.posts,
                    result.checkedParentEventIds,
                );
            })
            .catch(() => undefined);
    });

    $effect(() => {
        const revision = authoredSelfPostSave?.revision ?? 0;
        if (
            !show ||
            revision <= 0 ||
            history.isSearchMode ||
            history.canReturnToLatest
        ) {
            return;
        }

        void untrack(() => history.returnToLatest());
    });

    $effect(() => {
        if (!show) {
            return;
        }

        return () => {
            channelDisplay.cancelCurrentChannelResolution();
        };
    });

    function translateDialogMessage(
        state: PostHistoryDialogMessageState | null,
    ): string | null {
        if (!state) {
            return null;
        }

        return state.values
            ? $_(state.key, { values: state.values })
            : $_(state.key);
    }

    function buildVisibleCountLabel(): string | null {
        return translateDialogMessage(
            resolvePostHistoryCountSummaryState({
                totalCount: history.displayTotalCount,
                isSearchMode: history.isSearchMode,
            }),
        );
    }

    function parseDateInputToCreatedAt(value: string): number | null {
        const [yearText, monthText, dayText] = value.split("-");
        const year = Number(yearText);
        const month = Number(monthText);
        const day = Number(dayText);

        if (
            !Number.isFinite(year) ||
            !Number.isFinite(month) ||
            !Number.isFinite(day)
        ) {
            return null;
        }

        const date = new Date(year, month - 1, day, 23, 59, 59, 999);
        const time = date.getTime();
        return Number.isFinite(time) ? Math.floor(time / 1000) : null;
    }

    function getLoadOlderLabel(): string {
        return $_(
            resolvePostHistoryNavigationLabelKey({
                direction: "older",
                isSearchMode: history.isSearchMode,
            }),
        );
    }

    function getLoadNewerLabel(): string {
        return $_(
            resolvePostHistoryNavigationLabelKey({
                direction: "newer",
                isSearchMode: history.isSearchMode,
            }),
        );
    }

    async function handleLoadOlder(): Promise<void> {
        await history.loadOlder();
    }

    async function handleFetchOlderFromRelays(): Promise<void> {
        const scrollAnchor = historyViewport.captureHistoryScrollAnchor();
        const previousScrollTop = historyContainer?.scrollTop ?? null;
        const loadedPostsBeforeLength = history.state.loadedPosts.length;
        const scrollHeightBefore = historyContainer?.scrollHeight ?? null;
        const clientHeight = historyContainer?.clientHeight ?? null;
        const changed = await history.fetchOlderFromRelays({
            anchorEventId: scrollAnchor?.eventId,
        });

        let didRestoreAnchor = false;
        let didPreserveScrollTop = false;
        const didFollowBottom = false;
        if (changed && previousScrollTop !== null && show && historyContainer) {
            didRestoreAnchor =
                historyViewport.restoreHistoryScrollAnchor(scrollAnchor);
            if (!didRestoreAnchor) {
                historyContainer.scrollTop = previousScrollTop;
                didPreserveScrollTop = true;
            }
        }

        const olderBackfillUiResult = history.latestOlderBackfillUiResult;
        const scrollTopAfter = historyContainer?.scrollTop ?? null;
        const scrollHeightAfter = historyContainer?.scrollHeight ?? null;
        if (import.meta.env.DEV) {
            globalThis.console?.debug?.("post_history_older_backfill_scroll", {
                changed,
                previousScrollTop,
                scrollTopAfter,
                scrollHeightBefore,
                scrollHeightAfter,
                didRestoreAnchor,
                didPreserveScrollTop,
                didFollowBottom,
                didTrimForOlderAppend:
                    olderBackfillUiResult?.didTrimForOlderAppend ?? false,
                didDeferOlderPosts:
                    olderBackfillUiResult?.didDeferOlderPosts ?? false,
                clientHeight,
                hadScrollAnchor: !!scrollAnchor,
                anchorEventId: scrollAnchor?.eventId,
                loadedPostsBeforeLength,
                loadedPostsAfterLength:
                    olderBackfillUiResult?.loadedPostsAfterLength ??
                    history.state.loadedPosts.length,
                maxVisiblePosts: olderBackfillUiResult?.maxVisiblePosts ?? null,
            });
        }
    }

    async function handleLoadNewer(): Promise<void> {
        const scrollAnchor = history.isSearchMode
            ? null
            : historyViewport.captureHistoryScrollAnchor();
        const changed = await history.loadNewer();
        if (changed) {
            if (history.isSearchMode) {
                historyViewport.resetHistoryScrollSoon();
            } else {
                historyViewport.restoreHistoryScrollAnchor(scrollAnchor);
            }
        }
    }

    async function handleReturnToLatest(): Promise<void> {
        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        const changed = history.canReturnToLatest
            ? await history.returnToLatest()
            : false;
        if (changed || !historyViewport.isHistoryScrolledToTop) {
            historyViewport.resetHistoryScrollSoon();
        }
    }

    async function handleJumpToDateSubmit(): Promise<void> {
        const createdAt = parseDateInputToCreatedAt(jumpDateInput);
        if (createdAt === null) {
            return;
        }

        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        const changed = await history.jumpToCreatedAt(createdAt);
        if (changed) {
            activeUtilityPanel = "none";
            historyViewport.resetHistoryScrollSoon();
        }
    }

    function getPreviewContent(
        post: PostHistoryRecord,
    ): PostHistoryPreviewContentData {
        return (
            previewContentByEventId[post.eventId] ??
            buildDisplayPreviewContent(post)
        );
    }

    function hasRenderablePostPreviewContent(post: PostHistoryRecord): boolean {
        return hasRenderablePostHistoryPreviewContent(getPreviewContent(post));
    }

    function getQuotePreviewStates(post: PostHistoryRecord) {
        return quotePreviews.getQuotePreviews(post);
    }

    function isDeletionSending(post: PostHistoryRecord): boolean {
        return deleteRequestState[post.eventId] === "sending";
    }

    function hasDeletionFailed(post: PostHistoryRecord): boolean {
        return deleteRequestState[post.eventId] === "failed";
    }

    function getRepliesActionLabel(post: PostHistoryRecord): string {
        const state =
            postHistoryThreadGraph.getAnchorState(post).repliesActionState;
        return (
            translateDialogMessage(
                resolvePostHistoryRepliesActionLabelState(state),
            ) ?? ""
        );
    }

    function isReactionsExpanded(post: PostHistoryRecord): boolean {
        return !!reactionsExpandedByEventId[post.eventId];
    }

    function getReactionsActionLabel(post: PostHistoryRecord): string {
        const reactionCount =
            postHistoryThreadGraph.getAnchorState(post).reactionSummary
                .totalCount;
        return (
            translateDialogMessage(
                resolvePostHistoryReactionsActionLabelState({
                    visible: isReactionsExpanded(post),
                    reactionCount,
                }),
            ) ?? ""
        );
    }

    function getDisplayedReactionGroups(
        post: PostHistoryRecord,
    ): PostHistoryDisplayedReactionGroup[] {
        return displayedReactionGroupsByEventId[post.eventId] ?? [];
    }

    function toggleReactions(post: PostHistoryRecord): void {
        reactionsExpandedByEventId = {
            ...reactionsExpandedByEventId,
            [post.eventId]: !reactionsExpandedByEventId[post.eventId],
        };
    }

    function handleRepliesAction(post: PostHistoryRecord): void {
        const state =
            postHistoryThreadGraph.getAnchorState(post).repliesActionState;
        if (
            state.status === "failed" ||
            (state.status === "loaded" && state.replyCount === 0)
        ) {
            postHistoryThreadGraph.retryChildren(post);
            return;
        }

        postHistoryThreadGraph.toggleChildren(post);
    }

    function canDeletePost(post: PostHistoryRecord): boolean {
        return canRequestPostDeletion(post, pubkeyHex);
    }

    function openDeleteConfirm(post: PostHistoryRecord): void {
        if (!canDeletePost(post)) {
            return;
        }

        postActionUi.openDeleteConfirm(post);
    }

    function buildPostRecordFromNodeState(
        nodeState: PostHistoryThreadGraphNodeState,
    ): PostHistoryRecord {
        const now = Date.now();
        const postedAt = nodeState.node.event.created_at * 1000;

        return {
            id: nodeState.node.eventId,
            eventId: nodeState.node.eventId,
            pubkeyHex: nodeState.node.authorPubkey,
            kind: nodeState.node.event.kind,
            content: nodeState.node.event.content,
            tags: nodeState.node.event.tags.map((tag) => [...tag]),
            createdAt: postedAt,
            postedAt,
            relayHints: [...nodeState.node.relayUrls],
            acceptedRelays: [...nodeState.node.relayUrls],
            fetchedRelays: [...nodeState.node.relayUrls],
            media: [],
            rawEvent: nodeState.node.event,
            updatedAt: now,
            schemaVersion: 1,
        };
    }

    function isNodeCopyFailed(nodeEventId: string): boolean {
        return copyNeventUi.copyState[nodeEventId] === "failed";
    }

    function handleNodeCopyPointerPosition(
        nodeState: PostHistoryThreadGraphNodeState,
        event: PointerEvent,
    ): void {
        copyNeventUi.captureCopyPointerPosition(
            buildPostRecordFromNodeState(nodeState),
            event,
        );
    }

    function handleNodeCopyNevent(
        nodeState: PostHistoryThreadGraphNodeState,
        event: Event,
    ): void {
        void copyNeventUi.handleCopyNevent(
            buildPostRecordFromNodeState(nodeState),
            event,
        );
    }

    function canDeleteNodePost(
        nodeState: PostHistoryThreadGraphNodeState,
    ): boolean {
        return canRequestPostDeletion(
            buildPostRecordFromNodeState(nodeState),
            pubkeyHex,
        );
    }

    function isNodeDeletionSending(nodeEventId: string): boolean {
        return deleteRequestState[nodeEventId] === "sending";
    }

    function openNodeDeleteConfirm(
        nodeState: PostHistoryThreadGraphNodeState,
    ): void {
        const post = buildPostRecordFromNodeState(nodeState);
        if (!canDeletePost(post)) {
            return;
        }

        postActionUi.openDeleteConfirm(post);
    }

    function handleReplyPost(post: PostHistoryRecord): void {
        if (!onReplyPost) {
            return;
        }

        onReplyPost(post);
        handleClose();
    }

    function handleQuotePost(post: PostHistoryRecord): void {
        if (!onQuotePost) {
            return;
        }

        onQuotePost(post);
        handleClose();
    }

    function handleDeleteCancel(): void {
        postActionUi.cancelDeleteConfirm();
    }

    async function focusSearchInputSoon(): Promise<void> {
        await tick();
        if (activeUtilityPanel !== "search") {
            return;
        }

        searchInputElement?.focus({ preventScroll: true });
    }

    function toggleSearch(): void {
        if (activeUtilityPanel === "search") {
            hideSearch();
            headingMenuOpen = false;
            return;
        }

        activeUtilityPanel = "search";
        headingMenuOpen = false;
        void focusSearchInputSoon();
    }

    function hideSearch(): void {
        historyViewport.clearCurrentSessionScrollAnchor();
        activeUtilityPanel = "none";
        history.resetSearchState();
    }

    function toggleJumpDate(): void {
        activeUtilityPanel =
            activeUtilityPanel === "jump-date" ? "none" : "jump-date";
        headingMenuOpen = false;
    }

    function openLocalHistoryDeleteConfirm(): void {
        localHistoryDeleteConfirmOpen = true;
        headingMenuOpen = false;
    }

    function handleRefetchAroundCurrentViewFromMenu(): void {
        headingMenuOpen = false;
        void history.refetchAroundCurrentView();
    }

    function handleJumpToOldestFromMenu(): void {
        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        headingMenuOpen = false;
        void history.jumpToOldest().then((changed) => {
            if (changed || !historyViewport.isHistoryScrolledToBottom) {
                historyViewport.resetHistoryScrollToBottomSoon();
            }
        });
    }

    function handleReturnToLatestFromMenu(): void {
        headingMenuOpen = false;
        void handleReturnToLatest();
    }

    function handleLocalHistoryDeleteCancel(): void {
        localHistoryDeleteConfirmOpen = false;
    }

    function handleImageOpen(params: {
        index: number;
        mediaList: FullscreenMediaItem[];
    }): void {
        fullscreenMediaItems = params.mediaList;
        fullscreenIndex = params.index;
        showImageFullscreen = params.mediaList.length > 0 && params.index >= 0;
    }

    function handleFullscreenNavigate(index: number): void {
        fullscreenIndex = index;
    }

    function handleFullscreenClose(): void {
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
    }

    async function handleDeleteConfirm(): Promise<void> {
        const targetPost = postActionUi.deleteTargetPost;
        if (!targetPost) {
            return;
        }

        deleteRequestState = {
            ...deleteRequestState,
            [targetPost.eventId]: "sending",
        };

        const result = await postDeletionService.requestDeletion({
            post: targetPost,
            rxNostr,
        });

        if (
            result.success &&
            typeof result.deletedAt === "number" &&
            result.deletionEventId
        ) {
            history.patchDeletedPost(
                targetPost.eventId,
                result.deletedAt,
                result.deletionEventId,
            );
            void postHistoryThreadGraph
                .recordDeletedEvent({
                    eventId: targetPost.eventId,
                    authorPubkey: targetPost.pubkeyHex,
                    deletionEvent: result.deletionEvent ?? null,
                })
                .catch(() => undefined);
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: undefined,
            };
        } else {
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: "failed",
            };
        }

        postActionUi.clearDeleteTarget();
    }

    async function handleLocalHistoryDeleteConfirm(): Promise<void> {
        if (isDeletingLocalHistory) {
            return;
        }

        isDeletingLocalHistory = true;
        try {
            const deleted = await history.deleteLocalHistory();
            if (deleted) {
                historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
                localHistoryDeleteConfirmOpen = false;
                activeUtilityPanel = "none";
                historyViewport.resetHistoryScrollSoon();
            }
        } finally {
            isDeletingLocalHistory = false;
        }
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    onInteractOutside={handleDialogInteractOutside}
    trapFocus={false}
    title={$_("postHistory.title")}
    description={$_("postHistory.description")}
    contentClass="post-history-dialog"
    footerVariant="close-button"
    showPagination={false}
    initialFocus="content"
>
    <div class="post-history-heading">
        <div class="post-history-heading-main">
            {#if historyViewport.currentMonthLabel}
                <h3 class="post-history-current-month-heading">
                    <button
                        type="button"
                        class="post-history-current-month"
                        onclick={toggleJumpDate}
                    >
                        {historyViewport.currentMonthLabel}
                    </button>
                </h3>
            {/if}
        </div>
        <div class="post-history-heading-actions">
            {#if headingStatusMessageKey}
                <LoadingPlaceholder
                    text={headingStatusMessageValues
                        ? $_(headingStatusMessageKey, {
                              values: headingStatusMessageValues,
                          })
                        : $_(headingStatusMessageKey)}
                    showLoader={history.showStatusLoader}
                    loaderSize={30}
                    state={history.showStatusLoader ? "loading" : "complete"}
                    customClass={`status-loading-placeholder${
                        headingStatusError ? " status-error" : ""
                    }`}
                />
            {/if}
            {#if history.posts.length > 0 && buildVisibleCountLabel()}
                <div class="post-history-heading-summary">
                    <div class="post-history-summary-row">
                        <span
                            class="post-history-summary-line post-history-summary-count"
                        >
                            {buildVisibleCountLabel()}
                        </span>
                    </div>
                </div>
            {/if}
            <DropdownMenu.Root bind:open={headingMenuOpen}>
                <DropdownMenu.Trigger
                    class={`menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${headingMenuOpen ? "is-open" : ""}`.trim()}
                    aria-label={$_("postHistory.openMenu")}
                >
                    <div class="more-icon svg-icon"></div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        side="bottom"
                        align="end"
                        sideOffset={8}
                        class="post-history-menu-content"
                        trapFocus={false}
                        preventScroll={false}
                        onCloseAutoFocus={(event: Event) =>
                            event.preventDefault()}
                    >
                        <div class="post-history-menu-body">
                            <DropdownMenu.Item
                                class="menu-action-button"
                                onSelect={toggleSearch}
                            >
                                <div
                                    class="search-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.showSearch")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!canUseReturnToLatest}
                                onSelect={handleReturnToLatestFromMenu}
                            >
                                <div
                                    class="return-to-latest-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.returnToLatest")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button"
                                onSelect={toggleJumpDate}
                            >
                                <div
                                    class="calendar-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.jumpToDate")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!canUseJumpToOldest}
                                onSelect={handleJumpToOldestFromMenu}
                            >
                                <div
                                    class="jump-to-oldest-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.jumpToOldest")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!history.canRefetchAroundCurrentView}
                                onSelect={handleRefetchAroundCurrentViewFromMenu}
                            >
                                <div
                                    class="repair-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.repair")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button menu-action-button-danger"
                                onSelect={openLocalHistoryDeleteConfirm}
                            >
                                <div
                                    class="trash-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>
                                    {$_("postHistory.deleteLocalHistory")}
                                </span>
                            </DropdownMenu.Item>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    </div>

    {#if activeUtilityPanel === "search"}
        <div
            class="post-history-search-row"
            class:post-history-search-active={history.isSearchMode}
        >
            <input
                bind:value={history.state.searchInput}
                bind:this={searchInputElement}
                class="post-history-search-input"
                type="search"
                placeholder={$_("postHistory.searchPlaceholder")}
                aria-label={$_("postHistory.search")}
            />
            <Button
                type="button"
                class="post-history-search-close"
                contentLayout="icon"
                shape="square"
                ariaLabel={$_("postHistory.hideSearch")}
                onClick={hideSearch}
            >
                <div class="xmark-icon svg-icon" aria-hidden="true"></div>
            </Button>
        </div>
    {/if}

    {#if activeUtilityPanel === "jump-date"}
        <div class="post-history-utility-panel">
            <label
                class="post-history-utility-label"
                for="post-history-jump-date"
            >
                {$_("postHistory.jumpToDateLabel")}
            </label>
            <div class="post-history-utility-controls">
                <input
                    id="post-history-jump-date"
                    bind:value={jumpDateInput}
                    class="post-history-date-input"
                    type="date"
                    aria-label={$_("postHistory.jumpToDateLabel")}
                />
                <Button
                    type="button"
                    variant="primary"
                    contentLayout="icon"
                    shape="square"
                    ariaLabel={$_("postHistory.jumpToDateSubmit")}
                    className="post-history-utility-button post-history-utility-submit-button"
                    onClick={() => void handleJumpToDateSubmit()}
                >
                    <div class="jump-icon svg-icon" aria-hidden="true"></div>
                </Button>
                <Button
                    type="button"
                    variant="default"
                    contentLayout="icon"
                    shape="square"
                    ariaLabel={$_("postHistory.hideJumpToDate")}
                    className="post-history-utility-button post-history-utility-close-button"
                    onClick={() => (activeUtilityPanel = "none")}
                >
                    <div class="xmark-icon svg-icon" aria-hidden="true"></div>
                </Button>
            </div>
        </div>
    {/if}

    <div
        class="post-history-container"
        bind:this={historyContainer}
        onscroll={historyViewport.handleHistoryScroll}
    >
        {#if history.posts.length === 0}
            <div class="empty-state">
                <div class="empty-message">
                    {history.isSearchMode
                        ? $_("postHistory.searchNoResults")
                        : $_("postHistory.empty")}
                </div>
            </div>
        {:else}
            {#if history.isSearchMode ? history.canLoadNewer : history.state.hasNewerLocal}
                <div class="post-history-nav-row post-history-nav-row-top">
                    <Button
                        type="button"
                        variant="default"
                        className="post-history-nav-button"
                        contentLayout="iconText"
                        disabled={!history.canLoadNewer}
                        onClick={() => void handleLoadNewer()}
                    >
                        <div
                            class="keyboard-arrow-up-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        {getLoadNewerLabel()}
                    </Button>
                </div>
            {/if}
            <ul class="post-history-list">
                {#each history.posts as post (post.eventId)}
                    {@const graphState =
                        postHistoryThreadGraph.getAnchorState(post)}
                    <li
                        class="post-history-item"
                        data-post-history-event-id={post.eventId}
                        data-post-history-posted-at={post.postedAt}
                        class:post-history-item-deleted={!!post.deletedAt}
                    >
                        <div class="post-history-main">
                            <div class="post-preview">
                                {#if post.kind === 42 || post.deletedAt || hasDeletionFailed(post) || !(onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post))}
                                    <div class="post-preview-header">
                                        {#if post.kind === 42}
                                            <div
                                                class="post-history-channel-row"
                                            >
                                                <span
                                                    class="channel-icon svg-icon"
                                                    aria-hidden="true"
                                                ></span>
                                                <span class="channel-label"
                                                    >{$_(
                                                        "postHistory.channel",
                                                    )}</span
                                                >
                                                <span class="channel-name"
                                                    >{channelDisplay.getChannelText(
                                                        post,
                                                        $_,
                                                    )}</span
                                                >
                                            </div>
                                        {/if}
                                        <div class="post-preview-header-right">
                                            {#if post.deletedAt || hasDeletionFailed(post)}
                                                <div class="post-meta-inline">
                                                    {#if post.deletedAt}
                                                        <span
                                                            class="deleted-badge"
                                                            >{$_(
                                                                "postHistory.deletedBadge",
                                                            )}</span
                                                        >
                                                    {/if}
                                                    {#if hasDeletionFailed(post)}
                                                        <span
                                                            class="delete-failed"
                                                            >{$_(
                                                                "postHistory.deleteFailed",
                                                            )}</span
                                                        >
                                                    {/if}
                                                </div>
                                            {/if}
                                            {#if !(onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post))}
                                                <span
                                                    >{formatPostedAt(
                                                        post.postedAt,
                                                    )}</span
                                                >
                                                <DropdownMenu.Root
                                                    open={postActionUi.isPostMenuOpen(
                                                        post.eventId,
                                                    )}
                                                    onOpenChange={(
                                                        open: boolean,
                                                    ) =>
                                                        postActionUi.setPostMenuOpen(
                                                            post.eventId,
                                                            open,
                                                        )}
                                                >
                                                    <DropdownMenu.Trigger
                                                        class="menu-trigger"
                                                        aria-label="アクションを表示"
                                                    >
                                                        <div
                                                            class="more-icon svg-icon"
                                                        ></div>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            side="bottom"
                                                            align="start"
                                                            sideOffset={8}
                                                            class="post-history-menu-content"
                                                            trapFocus={false}
                                                            preventScroll={false}
                                                            onCloseAutoFocus={(
                                                                event: Event,
                                                            ) =>
                                                                event.preventDefault()}
                                                        >
                                                            <div
                                                                class="post-history-menu-body"
                                                            >
                                                                <DropdownMenu.Item
                                                                    class="menu-action-button"
                                                                    onpointerdown={(
                                                                        event,
                                                                    ) =>
                                                                        copyNeventUi.captureCopyPointerPosition(
                                                                            post,
                                                                            event,
                                                                        )}
                                                                    onSelect={(
                                                                        event,
                                                                    ) =>
                                                                        void copyNeventUi.handleCopyNevent(
                                                                            post,
                                                                            event,
                                                                        )}
                                                                >
                                                                    <div
                                                                        class="copy-icon svg-icon"
                                                                        aria-hidden="true"
                                                                    ></div>
                                                                    <span>
                                                                        {copyNeventUi
                                                                            .copyState[
                                                                            post
                                                                                .eventId
                                                                        ] ===
                                                                        "failed"
                                                                            ? $_(
                                                                                  "postHistory.copyFailed",
                                                                              )
                                                                            : $_(
                                                                                  "postHistory.copyNevent",
                                                                              )}
                                                                    </span>
                                                                </DropdownMenu.Item>
                                                                {#if canDeletePost(post)}
                                                                    <DropdownMenu.Item
                                                                        class="menu-action-button menu-action-button-danger"
                                                                        disabled={isDeletionSending(
                                                                            post,
                                                                        )}
                                                                        onSelect={() =>
                                                                            openDeleteConfirm(
                                                                                post,
                                                                            )}
                                                                    >
                                                                        <div
                                                                            class="trash-icon svg-icon"
                                                                            aria-hidden="true"
                                                                        ></div>
                                                                        <span>
                                                                            {isDeletionSending(
                                                                                post,
                                                                            )
                                                                                ? $_(
                                                                                      "postHistory.deleteSending",
                                                                                  )
                                                                                : $_(
                                                                                      "postHistory.delete",
                                                                                  )}
                                                                        </span>
                                                                    </DropdownMenu.Item>
                                                                {/if}
                                                            </div>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}
                                <PostHistoryThreadGraphPanel
                                    state={graphState}
                                    section="parent"
                                    scrollRoot={historyContainer}
                                    onImageOpen={handleImageOpen}
                                    onToggleParent={() =>
                                        historyViewport.preserveThreadParentToggleScroll(
                                            post.eventId,
                                            post.eventId,
                                            () =>
                                                postHistoryThreadGraph.toggleParent(
                                                    post,
                                                ),
                                        )}
                                    onRetryParent={() =>
                                        postHistoryThreadGraph.retryParent(
                                            post,
                                        )}
                                    onToggleNodeParent={(nodeEventId) =>
                                        historyViewport.preserveThreadParentToggleScroll(
                                            post.eventId,
                                            nodeEventId,
                                            () =>
                                                postHistoryThreadGraph.toggleNodeParent(
                                                    post,
                                                    nodeEventId,
                                                ),
                                        )}
                                    onRetryNodeParent={(nodeEventId) =>
                                        postHistoryThreadGraph.retryNodeParent(
                                            post,
                                            nodeEventId,
                                        )}
                                    onToggleNodeChildren={(nodeEventId) =>
                                        postHistoryThreadGraph.toggleNodeChildren(
                                            post,
                                            nodeEventId,
                                        )}
                                    onRetryNodeChildren={(nodeEventId) =>
                                        postHistoryThreadGraph.retryNodeChildren(
                                            post,
                                            nodeEventId,
                                        )}
                                    onCopyPointerDown={handleNodeCopyPointerPosition}
                                    onCopyNevent={handleNodeCopyNevent}
                                    isCopyFailed={isNodeCopyFailed}
                                    {canDeleteNodePost}
                                    isDeletionSending={isNodeDeletionSending}
                                    onOpenDeleteConfirm={openNodeDeleteConfirm}
                                />
                                <div
                                    class="post-history-thread-anchor-post"
                                    data-post-history-thread-anchor-scope-id={post.eventId}
                                    data-post-history-thread-anchor-event-id={post.eventId}
                                >
                                    <div class="post-preview-body">
                                        {#if hasRenderablePostPreviewContent(post)}
                                            <div class="post-preview-content">
                                                <PostHistoryPreviewContent
                                                    previewContent={getPreviewContent(
                                                        post,
                                                    )}
                                                    emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                                    emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                                    previewCollapseAction={previewCollapse.previewRef}
                                                    previewCollapseEventId={post.eventId}
                                                    previewContentId={"post-preview-content-" +
                                                        post.eventId}
                                                    isCollapsed={!previewCollapse.isPostExpanded(
                                                        post,
                                                    ) &&
                                                        previewCollapse.shouldCollapsePost(
                                                            post,
                                                        )}
                                                />
                                            </div>
                                        {/if}
                                        {#if hasRenderablePostPreviewContent(post) && previewCollapse.shouldCollapsePost(post)}
                                            <div
                                                class="post-preview-toggle-row"
                                            >
                                                <Button
                                                    type="button"
                                                    class="post-preview-action-button post-preview-toggle-button"
                                                    aria-expanded={previewCollapse.isPostExpanded(
                                                        post,
                                                    )}
                                                    aria-controls={"post-preview-content-" +
                                                        post.eventId}
                                                    onClick={() =>
                                                        previewCollapse.togglePostExpanded(
                                                            post.eventId,
                                                        )}
                                                >
                                                    {previewCollapse.isPostExpanded(
                                                        post,
                                                    )
                                                        ? $_(
                                                              "postHistory.collapse",
                                                          )
                                                        : $_(
                                                              "postHistory.expand",
                                                          )}
                                                </Button>
                                            </div>
                                        {/if}
                                        {#if post.media.length > 0}
                                            <div class="post-preview-media">
                                                <PostHistoryMediaList
                                                    media={post.media}
                                                    scrollRoot={historyContainer}
                                                    onImageOpen={handleImageOpen}
                                                />
                                            </div>
                                        {/if}
                                        {#if getQuotePreviewStates(post).length > 0}
                                            <div class="post-preview-quotes">
                                                {#each getQuotePreviewStates(post) as quotePreview (quotePreview.eventId)}
                                                    <PostHistoryQuotePreview
                                                        preview={quotePreview}
                                                        scrollRoot={historyContainer}
                                                        onImageOpen={handleImageOpen}
                                                        onRetry={() =>
                                                            quotePreviews.retryQuotePreview(
                                                                quotePreview.eventId,
                                                            )}
                                                    />
                                                {/each}
                                            </div>
                                        {/if}
                                    </div>
                                    {#if onReplyPost || onQuotePost || previewCollapse.shouldCollapsePost(post) || graphState.reactionSummary.totalCount > 0 || (graphState.repliesActionState.status === "loaded" && graphState.repliesActionState.replyCount > 0)}
                                        {@const repliesActionLabel =
                                            getRepliesActionLabel(post)}
                                        {@const showRepliesBadge =
                                            graphState.repliesActionState
                                                .status === "loaded" &&
                                            graphState.repliesActionState
                                                .replyCount > 0}
                                        <div class="post-preview-footer">
                                            <div
                                                class="post-preview-footer-left"
                                            >
                                                <span class="post-preview-date">
                                                    {formatPostedAt(
                                                        post.postedAt,
                                                    )}
                                                </span>
                                            </div>
                                            <div
                                                class="post-preview-footer-actions"
                                            >
                                                <div
                                                    class="post-preview-action-buttons-group"
                                                >
                                                    {#if onReplyPost}
                                                        <Button
                                                            type="button"
                                                            class="post-preview-action-button post-history-action-button"
                                                            ariaLabel={$_(
                                                                "replyQuote.reply_label",
                                                            )}
                                                            contentLayout="icon"
                                                            shape="circle"
                                                            onClick={() =>
                                                                handleReplyPost(
                                                                    post,
                                                                )}
                                                        >
                                                            <div
                                                                class="reply-icon svg-icon"
                                                                aria-hidden="true"
                                                            ></div>
                                                        </Button>
                                                    {/if}
                                                    <div
                                                        class="post-preview-footer-replies-slot"
                                                    >
                                                        {#if showRepliesBadge}
                                                            <Button
                                                                type="button"
                                                                class="post-preview-replies-badge-button"
                                                                ariaLabel={repliesActionLabel}
                                                                title={repliesActionLabel}
                                                                contentLayout="icon"
                                                                shape="circle"
                                                                selected={graphState
                                                                    .repliesActionState
                                                                    .visible}
                                                                onClick={() =>
                                                                    handleRepliesAction(
                                                                        post,
                                                                    )}
                                                            >
                                                                <span
                                                                    class="post-preview-replies-count post-preview-replies-badge post-preview-replies-icon-wrapper"
                                                                    aria-hidden="true"
                                                                >
                                                                    {graphState
                                                                        .repliesActionState
                                                                        .replyCount}
                                                                </span>
                                                            </Button>
                                                        {/if}
                                                    </div>
                                                </div>
                                                {#if onQuotePost}
                                                    <Button
                                                        type="button"
                                                        class="post-preview-action-button post-history-action-button"
                                                        ariaLabel={$_(
                                                            "replyQuote.quote_label",
                                                        )}
                                                        contentLayout="icon"
                                                        shape="circle"
                                                        onClick={() =>
                                                            handleQuotePost(
                                                                post,
                                                            )}
                                                    >
                                                        <div
                                                            class="quote-icon svg-icon"
                                                            aria-hidden="true"
                                                        ></div>
                                                    </Button>
                                                {/if}
                                                <div
                                                    class="post-preview-footer-reaction-slot"
                                                >
                                                    {#if graphState.reactionSummary.totalCount > 0}
                                                        <Button
                                                            type="button"
                                                            class="post-preview-reactions-button"
                                                            ariaLabel={getReactionsActionLabel(
                                                                post,
                                                            )}
                                                            contentLayout="iconText"
                                                            shape="pill"
                                                            onClick={() =>
                                                                toggleReactions(
                                                                    post,
                                                                )}
                                                        >
                                                            <div
                                                                class="favorite-icon svg-icon"
                                                                aria-hidden="true"
                                                            ></div>
                                                            <span>
                                                                {graphState
                                                                    .reactionSummary
                                                                    .totalCount}
                                                            </span>
                                                        </Button>
                                                    {/if}
                                                </div>
                                            </div>
                                            <div
                                                class="post-preview-footer-right"
                                            >
                                                <DropdownMenu.Root
                                                    open={postActionUi.isPostMenuOpen(
                                                        post.eventId,
                                                    )}
                                                    onOpenChange={(
                                                        open: boolean,
                                                    ) =>
                                                        postActionUi.setPostMenuOpen(
                                                            post.eventId,
                                                            open,
                                                        )}
                                                >
                                                    <DropdownMenu.Trigger
                                                        class={`menu-trigger post-history-menu-trigger ${
                                                            postActionUi.isPostMenuOpen(
                                                                post.eventId,
                                                            )
                                                                ? "is-open"
                                                                : ""
                                                        }`.trim()}
                                                        aria-label="アクションを表示"
                                                    >
                                                        <div
                                                            class="more-icon svg-icon"
                                                        ></div>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            side="bottom"
                                                            align="start"
                                                            sideOffset={8}
                                                            class="post-history-menu-content"
                                                            trapFocus={false}
                                                            preventScroll={false}
                                                            onCloseAutoFocus={(
                                                                event: Event,
                                                            ) =>
                                                                event.preventDefault()}
                                                        >
                                                            <div
                                                                class="post-history-menu-body"
                                                            >
                                                                <DropdownMenu.Item
                                                                    class="menu-action-button"
                                                                    disabled={graphState
                                                                        .repliesActionState
                                                                        .status ===
                                                                        "loading"}
                                                                    onSelect={() =>
                                                                        handleRepliesAction(
                                                                            post,
                                                                        )}
                                                                >
                                                                    <div
                                                                        class={`${
                                                                            graphState
                                                                                .repliesActionState
                                                                                .visible
                                                                                ? "collapse-content-icon"
                                                                                : "find_in_page-icon"
                                                                        } svg-icon`}
                                                                        aria-hidden="true"
                                                                    ></div>
                                                                    <span>
                                                                        {repliesActionLabel}
                                                                    </span>
                                                                </DropdownMenu.Item>
                                                                <DropdownMenu.Separator
                                                                    class="post-history-menu-separator"
                                                                />
                                                                <DropdownMenu.Item
                                                                    class="menu-action-button"
                                                                    onpointerdown={(
                                                                        event,
                                                                    ) =>
                                                                        copyNeventUi.captureCopyPointerPosition(
                                                                            post,
                                                                            event,
                                                                        )}
                                                                    onSelect={(
                                                                        event,
                                                                    ) =>
                                                                        void copyNeventUi.handleCopyNevent(
                                                                            post,
                                                                            event,
                                                                        )}
                                                                >
                                                                    <div
                                                                        class="copy-icon svg-icon"
                                                                        aria-hidden="true"
                                                                    ></div>
                                                                    <span>
                                                                        {copyNeventUi
                                                                            .copyState[
                                                                            post
                                                                                .eventId
                                                                        ] ===
                                                                        "failed"
                                                                            ? $_(
                                                                                  "postHistory.copyFailed",
                                                                              )
                                                                            : $_(
                                                                                  "postHistory.copyNevent",
                                                                              )}
                                                                    </span>
                                                                </DropdownMenu.Item>
                                                                {#if canDeletePost(post)}
                                                                    <DropdownMenu.Item
                                                                        class="menu-action-button menu-action-button-danger"
                                                                        disabled={isDeletionSending(
                                                                            post,
                                                                        )}
                                                                        onSelect={() =>
                                                                            openDeleteConfirm(
                                                                                post,
                                                                            )}
                                                                    >
                                                                        <div
                                                                            class="trash-icon svg-icon"
                                                                            aria-hidden="true"
                                                                        ></div>
                                                                        <span>
                                                                            {isDeletionSending(
                                                                                post,
                                                                            )
                                                                                ? $_(
                                                                                      "postHistory.deleteSending",
                                                                                  )
                                                                                : $_(
                                                                                      "postHistory.delete",
                                                                                  )}
                                                                        </span>
                                                                    </DropdownMenu.Item>
                                                                {/if}
                                                            </div>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            </div>
                                        </div>
                                        {#if graphState.reactionSummary.totalCount > 0 && isReactionsExpanded(post)}
                                            <div
                                                class="post-preview-reactions-panel"
                                            >
                                                {#each getDisplayedReactionGroups(post) as reactionGroup (reactionGroup.content)}
                                                    <div
                                                        class="post-preview-reaction-chip"
                                                    >
                                                        {#if isPostHistoryFavoriteReactionContent(reactionGroup.content)}
                                                            <div
                                                                class="favorite-icon svg-icon post-preview-reaction-symbol"
                                                                aria-hidden="true"
                                                            ></div>
                                                        {:else if reactionGroup.emojiUrl}
                                                            {#if hasReactionEmojiFailed(reactionGroup.emojiUrl)}
                                                                <span
                                                                    class="post-preview-reaction-content"
                                                                >
                                                                    {reactionGroup.content}
                                                                </span>
                                                            {:else}
                                                                <span
                                                                    class="post-preview-reaction-emoji-slot"
                                                                    style={getReactionEmojiSlotStyle(
                                                                        reactionGroup.emojiUrl,
                                                                    )}
                                                                >
                                                                    {#if isReactionEmojiReady(reactionGroup.emojiUrl)}
                                                                        <img
                                                                            src={reactionGroup.emojiUrl}
                                                                            alt={reactionGroup.content}
                                                                            title={reactionGroup.content}
                                                                            class="post-preview-reaction-emoji"
                                                                            draggable="false"
                                                                            loading="lazy"
                                                                            decoding="async"
                                                                        />
                                                                    {:else}
                                                                        <span
                                                                            class="post-preview-reaction-emoji-placeholder"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                    {/if}
                                                                </span>
                                                            {/if}
                                                        {:else}
                                                            <span
                                                                class="post-preview-reaction-content"
                                                            >
                                                                {reactionGroup.content}
                                                            </span>
                                                        {/if}
                                                        <span
                                                            class="post-preview-reaction-count"
                                                        >
                                                            {reactionGroup.count}
                                                        </span>
                                                    </div>
                                                {/each}
                                            </div>
                                        {/if}
                                    {/if}
                                    <PostHistoryThreadGraphPanel
                                        state={graphState}
                                        section="children"
                                        scrollRoot={historyContainer}
                                        onImageOpen={handleImageOpen}
                                        onToggleNodeParent={(nodeEventId) =>
                                            historyViewport.preserveThreadParentToggleScroll(
                                                post.eventId,
                                                nodeEventId,
                                                () =>
                                                    postHistoryThreadGraph.toggleNodeParent(
                                                        post,
                                                        nodeEventId,
                                                    ),
                                            )}
                                        onRetryNodeParent={(nodeEventId) =>
                                            postHistoryThreadGraph.retryNodeParent(
                                                post,
                                                nodeEventId,
                                            )}
                                        onToggleNodeChildren={(nodeEventId) =>
                                            postHistoryThreadGraph.toggleNodeChildren(
                                                post,
                                                nodeEventId,
                                            )}
                                        onRetryNodeChildren={(nodeEventId) =>
                                            postHistoryThreadGraph.retryNodeChildren(
                                                post,
                                                nodeEventId,
                                            )}
                                        onCopyPointerDown={handleNodeCopyPointerPosition}
                                        onCopyNevent={handleNodeCopyNevent}
                                        isCopyFailed={isNodeCopyFailed}
                                        {canDeleteNodePost}
                                        isDeletionSending={isNodeDeletionSending}
                                        onOpenDeleteConfirm={openNodeDeleteConfirm}
                                    />
                                </div>
                            </div>
                            {#if !(onReplyPost || previewCollapse.shouldCollapsePost(post)) && (post.deletedAt || hasDeletionFailed(post))}
                                <div class="post-meta">
                                    {#if post.deletedAt}
                                        <span class="deleted-badge"
                                            >{$_(
                                                "postHistory.deletedBadge",
                                            )}</span
                                        >
                                    {/if}
                                    {#if hasDeletionFailed(post)}
                                        <span class="delete-failed"
                                            >{$_(
                                                "postHistory.deleteFailed",
                                            )}</span
                                        >
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </li>
                {/each}
            </ul>

            {#if history.isSearchMode ? history.canLoadOlder : history.state.hasOlderLocal}
                <div class="post-history-nav-row post-history-nav-row-bottom">
                    <Button
                        type="button"
                        variant="default"
                        className="post-history-nav-button"
                        contentLayout="iconText"
                        disabled={!history.canLoadOlder}
                        onClick={() => void handleLoadOlder()}
                    >
                        <div
                            class="keyboard-arrow-down-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        {getLoadOlderLabel()}
                    </Button>
                </div>
            {:else if history.showLocalExhaustedState}
                <div class="post-history-exhausted-state">
                    {#if history.canFetchOlderFromRelays || history.isFetchingFromRelays || history.isRefetchingAroundCurrentView}
                        <Button
                            type="button"
                            variant="primary"
                            className="post-history-nav-button"
                            contentLayout="iconText"
                            disabled={history.isFetchingFromRelays ||
                                history.isRefetchingAroundCurrentView}
                            onClick={() => void handleFetchOlderFromRelays()}
                        >
                            {#if history.isFetchingOlderFromRelays}
                                <LoadingPlaceholder
                                    text={$_(
                                        "postHistory.fetchOlderFromRelaysLoading",
                                    )}
                                    showLoader={true}
                                    loaderSize={28}
                                    customClass="post-history-nav-loading-placeholder"
                                />
                            {:else}
                                <div
                                    class="cloud-download-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                {$_("postHistory.fetchOlderFromRelays")}
                            {/if}
                        </Button>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>

    {#if canUseReturnToLatest}
        <div class="post-history-latest-row">
            <Button
                type="button"
                variant="default"
                shape="circle"
                className="post-history-latest-button"
                contentLayout="icon"
                ariaLabel={$_("postHistory.returnToLatest")}
                onClick={() => void handleReturnToLatest()}
            >
                <div
                    class="vertical-align-top-icon svg-icon"
                    aria-hidden="true"
                ></div>
            </Button>
        </div>
    {/if}

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    shape="square"
                    ariaLabel={$_("global.close")}
                >
                    <div
                        class="xmark-icon svg-icon"
                        aria-label={$_("global.close")}
                    ></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<ConfirmDialog
    open={postActionUi.deleteConfirmOpen}
    onOpenChange={postActionUi.setDeleteConfirmOpen}
    title={$_("postHistory.deleteRequestTitle")}
    description={$_("postHistory.deleteRequestDescription")}
    confirmLabel={postActionUi.deleteTargetPost &&
    isDeletionSending(postActionUi.deleteTargetPost)
        ? $_("postHistory.deleteSending")
        : $_("postHistory.deleteConfirm")}
    cancelLabel={$_("postHistory.deleteCancel")}
    confirmVariant="danger"
    confirmDisabled={postActionUi.deleteTargetPost
        ? isDeletionSending(postActionUi.deleteTargetPost)
        : false}
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
    contentClass="post-history-delete-confirm"
>
    {#snippet children()}
        <div class="delete-confirm-body">
            <p class="delete-confirm-description">
                {$_("postHistory.deleteRequestDescription")}
            </p>
            <p class="delete-confirm-warning">
                {$_("postHistory.deleteRequestWarning")}
            </p>
        </div>
    {/snippet}
</ConfirmDialog>

<ConfirmDialog
    bind:open={localHistoryDeleteConfirmOpen}
    title={$_("postHistory.deleteLocalHistoryTitle")}
    description={$_("postHistory.deleteLocalHistoryDescription")}
    confirmLabel={$_("postHistory.deleteLocalHistoryConfirm")}
    cancelLabel={$_("postHistory.deleteLocalHistoryCancel")}
    confirmVariant="danger"
    confirmDisabled={isDeletingLocalHistory}
    onConfirm={handleLocalHistoryDeleteConfirm}
    onCancel={handleLocalHistoryDeleteCancel}
    closeOnConfirm={false}
    contentClass="post-history-local-delete-confirm"
>
    {#snippet children()}
        <div class="delete-confirm-body">
            <p class="delete-confirm-description">
                {$_("postHistory.deleteLocalHistoryDescription")}
            </p>
        </div>
    {/snippet}
</ConfirmDialog>

<ImageFullscreen
    bind:show={showImageFullscreen}
    src={fullscreenMediaItems[fullscreenIndex]?.src ?? ""}
    alt={fullscreenMediaItems[fullscreenIndex]?.alt ?? ""}
    onClose={handleFullscreenClose}
    mediaList={fullscreenMediaItems}
    currentIndex={fullscreenIndex}
    onNavigate={handleFullscreenNavigate}
/>

<FloatingMessage
    show={copyNeventUi.showCopyFloatingMessage}
    x={copyNeventUi.copyFloatingMessageX}
    y={copyNeventUi.copyFloatingMessageY}
>
    <div>{$_("postHistory.copied")}</div>
</FloatingMessage>

<style>
    :global(.post-history-dialog.dialog) {
        top: 0;
        transform: translateX(-50%);
        height: 100svh;
        max-height: 100svh;

        --btn-post-preview-action-hover: var(--svg);
    }

    :global(.post-history-dialog .dialog-content) {
        position: relative;
        flex: 1 1 auto;
        min-height: 0;
        max-height: none;
        overflow: hidden;
        padding: 0;
    }

    .post-history-heading {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        width: 100%;
        padding: 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading-main {
        flex: 1 1 auto;
        min-width: 0;
        align-self: stretch;
    }

    .post-history-current-month-heading {
        display: flex;
        align-items: center;
        height: 100%;
        margin: 0;
    }

    .post-history-current-month {
        color: var(--text-light);
        font-size: 1.75rem;
        line-height: 1.05;
        font-weight: 600;
        letter-spacing: -0.04em;
        overflow-wrap: anywhere;
        padding: 0 12px;
        --btn-bg: var(--dialog-bg);
        --text: var(--text-light);
    }

    .post-history-heading-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 0;
        gap: 4px;
    }

    :global(
            .post-history-action-button,
            .post-preview-replies-badge-button,
            .post-preview-reactions-button,
            .post-history-replies-toggle-button,
            .post-history-thread-toggle-button,
            .post-history-menu-trigger
        ) {
        color: var(--btn-post-preview-action);
    }

    :global(
            .post-history-action-button .svg-icon,
            .post-preview-reactions-button .svg-icon,
            .post-history-replies-toggle-button .svg-icon,
            .post-history-thread-toggle-button .svg-icon,
            .post-history-menu-trigger .more-icon
        ) {
        --svg: currentColor;
    }

    :global(.menu-trigger) {
        aspect-ratio: 1;
        border-radius: 50%;
        --btn-bg: var(--dialog-bg);
        background-color: var(--dialog-bg);
    }

    :global(.post-history-menu-trigger) {
        color: var(--btn-post-preview-action);
    }

    :global(.post-history-menu-trigger .more-icon) {
        mask-image: url("/icons/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 22px;
        height: 22px;
    }

    :global(.menu-trigger.post-history-heading-menu-trigger) {
        min-height: 50px;
        padding: 0;
        background-color: var(--dialog-bg);
        color: var(--text-muted);
        border-radius: 0;
    }

    :global(.menu-trigger.post-history-heading-menu-trigger .more-icon) {
        width: 28px;
        height: 28px;
    }

    .post-history-heading-summary {
        display: flex;
        align-items: center;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .post-history-summary-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: 0;
    }

    .post-history-summary-line {
        overflow-wrap: anywhere;
    }

    .post-history-summary-count {
        flex: 0 0 auto;
        white-space: nowrap;
        text-align: right;
    }

    :global(.post-history-repair-button) {
        white-space: nowrap;
        padding: 6px 10px;
        font-size: 0.82rem;
    }

    .post-history-search-row {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .post-history-search-active {
        border-bottom-color: color-mix(
            in srgb,
            var(--theme),
            var(--border-hr) 55%
        );
    }

    .post-history-search-input {
        width: 100%;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid var(--border-soft);
        background: var(--background);
        color: var(--text);
        font: inherit;
        border-bottom: 1px solid var(--border-hr);
    }

    :global(.post-history-search-close.square) {
        flex: 0 0 auto;
        min-height: 40px;
        aspect-ratio: 1;
        padding: 0;
        background: var(--btn-bg);

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
        }
    }

    .post-history-search-input::placeholder {
        color: var(--text-muted);
    }

    .post-history-utility-panel {
        display: flex;
        flex-direction: column;
        padding: 6px 16px 6px;
        border-bottom: 1px solid var(--border-hr);
        gap: 2px;
    }

    .post-history-utility-label {
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-utility-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
    }

    .post-history-date-input {
        min-width: 0;
        padding: 0 12px;
        height: 40px;
        border: 1px solid var(--border-hr);
        background: var(--background);
        color: var(--text);
        font: inherit;
    }

    :global(.post-history-utility-button) {
        height: auto;
        min-height: 40px;
        white-space: nowrap;
    }

    :global(.post-history-utility-button.post-history-utility-submit-button),
    :global(.post-history-utility-button.post-history-utility-close-button) {
        min-width: 70px;
        min-height: 40px;
    }

    .post-history-nav-row {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 8px 16px;
    }

    .post-history-nav-row-top {
        padding-bottom: 0;
    }

    .post-history-nav-row-bottom {
        padding-top: 0;
    }

    :global(.post-history-nav-button:not(.primary)) {
        min-height: 50px;
        white-space: nowrap;
        gap: 4px;
    }

    .post-history-exhausted-state {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        padding: 0 16px 8px 16px;
    }

    .post-history-latest-row {
        position: absolute;
        bottom: 12px;
        right: 16px;
        display: flex;
        justify-content: flex-end;
        width: auto;
        margin: 0;
        padding: 0;
        z-index: 3;

        :global(.post-history-latest-button) {
            min-width: 50px;
            min-height: 50px;
            background-color: color-mix(in srgb, var(--theme) 15%, transparent);
            backdrop-filter: blur(1px);

            :global(.vertical-align-top-icon) {
                mask-image: url("/icons/vertical_align_top_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
                width: 26px;
                height: 26px;
                opacity: 0.6;
            }
        }
    }

    .post-history-container {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        overflow-y: auto;
    }

    .empty-state {
        display: grid;
        gap: 8px;
        min-height: 100px;
        align-content: center;
    }

    .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        color: var(--text-muted);
        font-size: 1rem;
    }

    :global(.status-loading-placeholder) {
        justify-content: flex-end;
        width: auto;
        column-gap: 0;
        color: var(--text-muted);
        font-size: 0.8rem;
        line-height: 1.3;
        height: auto;
    }

    :global(.status-loading-placeholder .loader-container) {
        :global(.square) {
            background: currentColor;
        }
    }

    :global(.status-loading-placeholder .placeholder-text) {
        color: inherit;
        font-size: inherit;
    }

    :global(.status-error) {
        color: var(--danger);
    }

    :global(.status-loading-placeholder.status-error .square) {
        background-color: var(--danger);
    }

    .post-history-list {
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .post-history-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--border-hr-light);
        padding: 6px;
    }

    .post-history-item:last-child {
        border-bottom: none;
    }

    .post-history-item-deleted .post-meta-inline > :not(.deleted-badge),
    .post-history-item-deleted .post-preview-body,
    .post-history-item-deleted .post-preview-footer {
        opacity: 0.65;
    }

    .post-history-main {
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        min-width: 0;
        gap: 2px;
    }

    .post-preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.3;
    }

    .post-preview-header-right {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
        margin-left: auto;
    }

    .post-preview-header-right > span {
        white-space: nowrap;
    }

    :global(.post-history-menu-content) {
        background: var(--dialog-bg, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
        padding: 8px;
        min-width: 180px;
        z-index: 102;
        outline: none;

        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--border) 12%
        );
        --post-history-menu-action-hover-color: var(--text);
        --post-history-menu-action-danger-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            var(--danger) 12%
        );
    }

    :global(:root.light .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            black 6%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            black 6%
        );
    }

    :global(:root.dark .post-history-menu-content) {
        --post-history-menu-action-hover-bg: color-mix(
            in srgb,
            var(--dialog-bg),
            white 10%
        );
        --post-history-menu-action-hover-color: color-mix(
            in srgb,
            var(--text),
            white 10%
        );
    }

    .post-history-menu-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-items: stretch;
    }

    :global(.post-history-menu-content[data-state="open"]) {
        animation: popover-in 150ms ease-out;
    }

    :global(.post-history-menu-content[data-state="closed"]) {
        animation: popover-out 100ms ease-in;
    }

    :global(.post-history-menu-content .post-history-menu-separator) {
        height: 1px;
        margin: 4px 0;
        background: var(--border-hr);
    }

    :global(.post-history-menu-content .menu-action-button) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        border: none;
        border-radius: 6px;
        background-color: transparent;
        color: inherit;
        text-align: left;
        padding: 10px 12px;
        font: inherit;
        cursor: pointer;
    }

    :global(.post-history-menu-content .menu-action-button-danger) {
        color: var(--danger);
        --svg: currentColor;
    }

    @media (min-width: 601px) {
        :global(
                .post-history-menu-content
                    .menu-action-button:hover:not([data-disabled])
            ),
        :global(
                .post-history-menu-content
                    .menu-action-button[data-highlighted]:not([data-disabled])
            ) {
            background-color: var(--post-history-menu-action-hover-bg);
            color: var(--post-history-menu-action-hover-color);
            --svg: currentColor;
        }

        :global(
                .post-history-menu-content
                    .menu-action-button-danger:hover:not([data-disabled])
            ),
        :global(
                .post-history-menu-content
                    .menu-action-button-danger[data-highlighted]:not(
                        [data-disabled]
                    )
            ) {
            background-color: var(--post-history-menu-action-danger-hover-bg);
            color: var(--danger);
            --svg: currentColor;
        }
    }

    :global(.post-history-menu-content .menu-action-button[data-disabled]) {
        opacity: 0.55;
        cursor: not-allowed;
    }

    :global(.post-history-menu-content .menu-action-button .svg-icon) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    :global(.post-history-menu-content .menu-action-button .calendar-icon) {
        mask-image: url("/icons/calendar_month_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .find_in_page-icon) {
        mask-image: url("/icons/find_in_page_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(
            .post-history-menu-content
                .menu-action-button
                .collapse-content-icon
        ) {
        mask-image: url("/icons/collapse_content_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
        width: 24px;
        height: 24px;
    }

    :global(
            .post-history-menu-content
                .menu-action-button
                .return-to-latest-icon
        ) {
        mask-image: url("/icons/vertical_align_top_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(
            .post-history-menu-content .menu-action-button .jump-to-oldest-icon
        ) {
        mask-image: url("/icons/vertical_align_bottom_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-nav-button .keyboard-arrow-up-icon) {
        mask-image: url("/icons/keyboard_arrow_up_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-nav-button .keyboard-arrow-down-icon) {
        mask-image: url("/icons/keyboard_arrow_down_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-nav-button .cloud-download-icon) {
        mask-image: url("/icons/cloud_download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
    }

    :global(.post-history-nav-loading-placeholder .loader-container .square) {
        background-color: currentColor;
    }

    @keyframes popover-in {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes popover-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-4px);
        }
    }

    .post-preview {
        display: flex;
        flex-direction: column;
        min-width: 0;
        color: var(--text);
        font-size: 1rem;
    }

    .post-history-thread-anchor-post {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .post-history-channel-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.3;
    }

    .channel-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    .channel-label {
        flex-shrink: 0;
    }

    .channel-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .post-preview-body {
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
        gap: 4px;

        .post-preview-content {
            overflow-wrap: anywhere;
            white-space: pre-wrap;
            font-size: 1rem;
            line-height: 1.5;
            word-break: break-word;
        }

        .post-preview-media {
            display: block;
        }

        .post-preview-quotes {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .post-preview-toggle-row {
            display: flex;

            :global(
                    .post-preview-toggle-button,
                    .post-preview-toggle-button:hover
                ) {
                color: var(--text-muted);
                font-size: 0.875rem;
                font-weight: normal;
                min-height: 24px;
                padding: 0;
                background: transparent;
            }

            :global(.post-preview-toggle-button:hover) {
                text-decoration: underline;
            }
        }
    }

    :global(.post-preview-date),
    :global(.post-history-related-date) {
        color: var(--text-muted);
    }

    .post-preview-footer {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        height: 36px;
        padding-left: 1rem;
        color: var(--btn-post-preview-action);

        .post-preview-footer-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            min-width: 80px;

            .post-preview-date {
                font-size: 0.9375rem;
                white-space: nowrap;
            }
        }

        .post-preview-footer-actions {
            display: flex;
            align-items: stretch;
            justify-content: space-around;
            flex: 1 0 auto;
        }

        .post-preview-footer-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .post-preview-action-buttons-group {
            display: flex;
            align-items: stretch;
        }

        .post-preview-footer-replies-slot {
            display: flex;
            align-items: stretch;
            justify-content: center;
            flex: 0 0 36px;
            min-width: 36px;
        }

        .post-preview-footer-reaction-slot {
            display: flex;
            align-items: stretch;
            justify-content: center;
            flex: 0 0 70px;
            min-width: 70px;
        }

        :global(:where(.post-preview-action-button)) {
            min-height: auto;
            --btn-bg: var(--dialog-bg);
            background-color: var(--dialog-bg);
            position: relative;
        }

        :global(.post-preview-replies-badge-button) {
            width: 36px;
            min-width: 36px;
            min-height: auto;
            --btn-bg: var(--dialog-bg);
            color: var(--btn-post-preview-action);
        }

        .post-preview-replies-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 999px;
            background: var(--btn-post-preview-action);
            color: var(--dialog-bg);
            font-size: 0.6875rem;
            font-weight: 700;
            text-align: center;
        }

        :global(:where(.post-preview-reactions-button)) {
            min-height: auto;
            gap: 2px;
            padding-inline: 10px;
            --btn-bg: var(--dialog-bg);
            background-color: var(--dialog-bg);
            color: var(--btn-post-preview-action);
        }
    }

    :global(.post-preview-reactions-button .svg-icon) {
        width: 22px;
        height: 22px;
    }

    :global(
            .post-history-thread-toggle-button.selected,
            .post-history-replies-toggle-button.selected,
            .post-preview-replies-badge-button.selected
        ) {
        --btn-bg: var(--dialog-bg);
        color: var(--text-light);
    }

    :global(
            .post-history-replies-toggle-button.selected
                .post-history-replies-toggle-badge,
            .post-preview-replies-badge-button.selected
                .post-preview-replies-badge
        ) {
        background-color: var(--text-light);
    }

    @media (min-width: 601px) {
        :global(.post-history-replies-toggle-button:hover:not(:disabled)) {
            color: color-mix(in srgb, var(--text), white 50%);
        }

        :global(
                .post-history-replies-toggle-button:hover:not(:disabled)
                    .post-history-replies-toggle-badge,
                .post-preview-replies-badge-button:hover:not(:disabled)
                    .post-preview-replies-badge
            ) {
            background-color: var(--text);
        }

        :global(
                :root.light
                    .post-history-thread-toggle-button.selected:hover:not(
                        :disabled
                    )
            ) {
            background-color: color-mix(in srgb, var(--dialog-bg), black 20%);
            color: color-mix(in srgb, var(--text), black 20%);
        }

        :global(
                :root.dark
                    .post-history-thread-toggle-button.selected:hover:not(
                        :disabled
                    )
            ) {
            background-color: color-mix(in srgb, var(--dialog-bg), white 30%);
            color: color-mix(in srgb, var(--text), white 30%);
        }
    }

    :global(.post-preview-reactions-panel) {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 16px 14px;
    }

    :global(.post-preview-reaction-chip) {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 32px;
        padding: 4px 10px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--theme), var(--dialog-bg) 92%);
        color: var(--text);
    }

    :global(.post-preview-reaction-content),
    :global(.post-preview-reaction-count) {
        font-size: 0.92rem;
        line-height: 1;
    }

    :global(.post-preview-reaction-emoji-slot) {
        display: inline-grid;
        margin: 0;
        padding: 0;
    }

    :global(.post-preview-reaction-emoji),
    :global(.post-preview-reaction-emoji-placeholder) {
        width: 100%;
        height: 100%;
    }

    :global(.post-preview-reaction-emoji) {
        display: block;
        margin: 0;
        padding: 0;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    :global(.post-preview-reaction-emoji-placeholder) {
        display: block;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
    }

    :global(.post-preview-reaction-count) {
        color: var(--text-muted);
    }

    :global(.post-preview-reaction-symbol) {
        width: 18px;
        height: 18px;
    }

    .post-meta-inline {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .post-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px 10px;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.3;
    }

    .deleted-badge {
        padding: 2px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--danger), transparent 82%);
        color: var(--danger);
        font-weight: 600;
    }

    .delete-failed {
        color: var(--danger);
    }

    .delete-confirm-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        margin: 10px 0 30px 0;
        margin-inline: auto;
        text-align: left;
    }

    .delete-confirm-description,
    .delete-confirm-warning {
        line-height: 1.5;
        margin: 0;
    }

    .delete-confirm-warning {
        color: var(--text-light);
        font-size: 0.875rem;
    }

    :global(.copy-icon) {
        mask-image: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .favorite-icon {
        mask-image: url("/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-preview-reaction-symbol {
        mask-image: url("/icons/favorite_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        background-color: rgb(249, 24, 128);
        width: 18px;
        height: 18px;
    }

    .search-icon {
        mask-image: url("/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .repair-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .reply-icon.svg-icon {
        width: 20px;
        height: 20px;
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        margin-top: 2px;
    }

    .quote-icon.svg-icon {
        width: 24px;
        height: 24px;
        mask-image: url("/icons/format_quote_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    :global(.trash-icon) {
        mask-image: url("/icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .jump-icon {
        mask-image: url("/icons/keyboard_tab_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
</style>
