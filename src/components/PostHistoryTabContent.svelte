<script lang="ts">
    import { parseDate, type DateValue } from "@internationalized/date";
    import type { RxNostr } from "rx-nostr";
    import { flushSync, onDestroy, tick, untrack, type ComponentProps } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { Dialog, DropdownMenu } from "bits-ui";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import { usePostEventOperations } from '../lib/hooks/usePostEventOperations.svelte';
    import PostEventMenu from './PostEventMenu.svelte';
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import ImageFullscreen from "./ImageFullscreen.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRepostPreview from "./PostHistoryRepostPreview.svelte";
    import PostRepostFeedback from "./PostRepostFeedback.svelte";
    import { usePostHistoryRepostPreviews, loadStoredRepostTarget } from "../lib/hooks/usePostHistoryRepostPreviews.svelte";
    import type { PostRepostResult } from "../lib/postRepostService";
    import { isRepostOuterKind, isRepostTargetKind, repostTargetToPost } from "../lib/postRepostUtils";
    import {
        createTransientPostHistoryRecord,
        isPostHistoryRawEventConsistent,
    } from "../lib/postHistoryEventUtils";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryRecordActionItems from "./PostHistoryRecordActionItems.svelte";
    import PostHistoryRecordHeader from "./PostHistoryRecordHeader.svelte";
    import PostHistoryRecordQuotePreviews from "./PostHistoryRecordQuotePreviews.svelte";
    import PostContentPreview from "./PostContentPreview.svelte";
    import PostHistoryRecordFooter from "./PostHistoryRecordFooter.svelte";
    import PostHistoryQuotePreview from "./PostHistoryQuotePreview.svelte";
    import PostHistoryImportDialog from "./PostHistoryImportDialog.svelte";
    import PostHistoryRelayFullScanDialog from "./PostHistoryRelayFullScanDialog.svelte";
    import { usePostHistoryRelayFullScan } from "../lib/hooks/usePostHistoryRelayFullScan.svelte";
    import type { PostHistoryFullScanResult } from "../lib/postHistoryRelayFullScanService";
    import type { PostHistoryJsonlImportResult } from "../lib/postHistoryJsonlImportService";
    import PostHistoryRawJsonDialog from "./PostHistoryRawJsonDialog.svelte";
    import PostHistoryPostActions from "./PostHistoryPostActions.svelte";
    import { verifyRelatedEvent } from '../lib/relatedEventVerification';
    import PostHistoryReactionDetails from "./PostHistoryReactionDetails.svelte";
    import PostHistoryReactionActionButton from "./PostHistoryReactionActionButton.svelte";
    import PostPreviewFooterActionButton from "./PostPreviewFooterActionButton.svelte";
    import PostPreviewToggleButton from "./PostPreviewToggleButton.svelte";
    import PostHistoryJumpDatePanel from "./PostHistoryJumpDatePanel.svelte";
    import PostHistoryThreadGraphPanel from "./PostHistoryThreadGraphPanel.svelte";
    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import { usePostHistoryChannelDisplay } from "../lib/hooks/usePostHistoryChannelDisplay.svelte";
    import { usePostHistoryCopyNevent } from "../lib/hooks/usePostHistoryCopyNevent.svelte";
    import { usePostHistoryEmojiState } from "../lib/hooks/usePostHistoryEmojiState.svelte";
    import { usePostHistoryPostActionUiController } from "../lib/hooks/usePostHistoryPostActionUiController.svelte";
    import { usePostHistoryQuotePreviews } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";
    import { usePostHistoryListing } from "../lib/hooks/usePostHistoryListing.svelte";
    import { usePostHistoryDialogViewport } from "../lib/hooks/usePostHistoryDialogViewport.svelte";
    import { usePostHistoryPreviewCollapse } from "../lib/hooks/usePostHistoryPreviewCollapse.svelte";
    import { usePostHistoryThreadGraph } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import { usePostHistoryRelatedReactions, type PostHistoryRelatedReactionCardTarget } from "../lib/hooks/usePostHistoryRelatedReactions.svelte";
    import { usePostHistoryInboundInteractionsSync } from "../lib/hooks/usePostHistoryInboundInteractionsSync.svelte";
    import type { PostHistoryThreadGraphNodeState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import {
        canRequestPostDeletion,
    } from "../lib/postDeletionService";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import {
        buildPostContentRenderModel,
        resolveEventContentBody,
        type SensitiveBodyCacheStatus,
        type PostContentRenderModel,
    } from "../lib/postContentPreview";
    import {
        resolvePostHistoryCountSummaryState,
        resolvePostHistoryNavigationLabelKey,
        resolvePostHistoryReactionsActionLabelState,
        resolvePostHistoryRepliesActionLabelState,
        type PostHistoryDialogMessageState,
    } from "../lib/postHistoryDialogPresentation";
    import { stripPostHistoryInlineQuoteUrisForDisplay } from "../lib/postHistoryQuoteUtils";
    import { createPostHistoryRelatedTargetResolver } from "../lib/postHistoryRelatedTargetResolver.svelte";
    import { createPostHistoryProfileSyncCoordinator } from "../lib/postHistoryProfileSync";
    import { postHistoryQuoteTargetDiscoveryAdapter } from "../lib/postHistoryRelatedTargetDiscoveryAdapter";
    import { POST_HISTORY_PAGE_SIZE } from "../lib/postHistoryRelayFetchService";
    import {
        createSensitivePayloadBodyLoader,
        loadVerifiedSensitivePayloadEvent,
    } from "../lib/sensitiveContentPayloadReader";
    import { reconcilePendingDeletionRequestsForParentEventIds } from "../lib/postHistoryPendingDeletionRequestsReconcile";
    import { triggerPostHistoryChildInteractionDeletionLifecycle } from "../lib/postHistoryChildInteractionDeletionLifecycleTrigger";
    import { formatPostHistoryReactionActorLabel } from "../lib/postHistoryReactionReadModel";
    import {
        resolveBroadcastEvent,
    } from "../lib/postBroadcastService";
    import { usePostHistoryJsonlExport } from "../lib/hooks/usePostHistoryJsonlExport.svelte";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils";
    import {
        buildPostHistoryExternalClientUrl,
        getExternalNostrClientDisplayName,
    } from "../lib/postHistoryExternalClient";
    import { resetPendingDeletionRequests } from "../stores/postHistoryDeletionLifecycleStore.svelte";
    import { settingsStore } from "../stores/settingsStore.svelte";
    import { writeRelaysStore } from "../stores/relayStore.svelte";
    import type {
        FullscreenMediaItem,
        NostrEvent,
        PostResult,
        RelayConfig,
        ProfileData,
    } from "../lib/types";

    type PostHistoryUtilityPanel = "none" | "search" | "jump-date";
    type BroadcastPointerPosition = {
        eventId: string;
        x: number;
        y: number;
    };

    const POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE = 18;
    const POST_HISTORY_LIST_LOADING_DELAY_MS = 200;

    import type { PostHistoryDialogProps } from "../lib/postHistoryDialogTypes";
    interface Props extends PostHistoryDialogProps { sessionOpen?: boolean; onInitialReady?: () => void }

    let {
        show: active = false,
        sessionOpen = undefined,
        onInitialReady = undefined,
        onClose,
        onReplyPost = undefined,
        onQuotePost = undefined,
        onReactionPost = undefined,
        onRepostPost = undefined,
        repostPending = false,
        onRetryRepostSave = undefined,
        repostSaveFailure = null,
        pubkeyHex = null,
        rxNostr = undefined,
        relayConfig = null,
        latestPostedEvent = null,
        inboundInteractionSave = null,
        authoredSelfPostSave = null,
        reconcileInboundDirectReplyCandidates = undefined,
        notifySavedAuthoredPosts = undefined,
    }: Props = $props();

    let suspended = $state(false);
    let show = $derived(active && !suspended);
    let activationEpoch = 0;
    let destroyed = false;
    let closing = false;
    export function activate() { closing = false; suspended = false; }
    export function suspend() {
        if (suspended) return;
        if (!closing) historyViewport.saveCurrentSessionScrollAnchor();
        suspended = true;
        activationEpoch++;
        surroundingPostsNavigationRequestId++;
        repostUiGeneration++;
        history.suspend();
        historyViewport.suspend();
        previewCollapse.suspend();
        channelDisplay.cancelCurrentChannelResolution();
        postHistoryThreadGraph.cancelCurrentGraphFetches();
        relatedReactions.suspend();
        inboundSync.cancelCurrentSync();
        profileSyncCoordinator.reset();
        relatedTargetResolver.invalidateScope("post-history-listing-quote-visible-range-repair");
        quotePreviews.suspend();
        repostPreviews.suspend();
        relatedTargetResolver.invalidateScope("post-history-repost-operation");
        emojiState.suspend();
        postActionUi.resetDeleteConfirmation();
        postActionUi.closeAllPostItemMenus();
        importDialogOpen = false;
        fullScan.suspend();
        rawJsonDialogOpen = false;
        selectedRawEvent = null;
        localHistoryDeleteConfirmOpen = false;
        headingMenuOpen = false;
        jumpDatePickerOpen = false;
        copyNeventUi.resetState();
        hideBroadcastFloatingMessage();
        jsonlExport.hideMessage();
        hideRelatedEventsResultMessage();
        jsonlExport.cancel();
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        broadcastRequestState = {};
        deleteRequestState = {};
        isAutoLoadingOlder = false; isAutoLoadingNewer = false;
        autoLoadOlderAwaitingExit = false; autoLoadNewerAwaitingExit = false;
    }
    export function invalidateSession() { suspend(); activationEpoch++; }
    export function isFullscreen() { return showImageFullscreen; }
    $effect(() => { const enabled = active; untrack(() => enabled ? activate() : suspend()); });
    function captureOperation() {
        const epoch = activationEpoch, owner = pubkeyHex, runtime = rxNostr;
        return () => epoch === activationEpoch && show && owner === pubkeyHex && runtime === rxNostr;
    }
    const profileSyncCoordinator = createPostHistoryProfileSyncCoordinator({
        getShow: () => !destroyed && show,
        getRxNostr: () => destroyed ? undefined : rxNostr,
    });
    const relatedTargetResolver = createPostHistoryRelatedTargetResolver({
        loadRepostTarget: loadStoredRepostTarget,
        getShow: () => !destroyed && show,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        profileSyncCoordinator,
    });
    const history = usePostHistoryListing({
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getPubkeyHex: () => destroyed ? null : pubkeyHex,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        getSessionScrollState: () =>
            historyViewport.readCurrentSessionScrollState(),
        onSessionScrollStateInvalidated: () =>
            historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey(),
        onSavedAuthoredPosts: async (eventIds) => {
            await notifySavedAuthoredPosts?.(eventIds);
        },
        onLocalHistoryChanged: applyLocalHistoryChange,
        onChildInteractionBadgeRefreshRequested: (posts, parentEventIds) =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                posts,
                parentEventIds,
            ),
        onQuoteVisibleRangeRefreshRequested: (posts) =>
            quotePreviews.refreshQuotePreviews(posts),
        quoteVisibleRangeRepairExecutor: async (_repairRxNostr, params) => {
            const quoteDescriptors = collectQuoteRelatedTargetDescriptors(
                params.visiblePosts,
            );
            if (quoteDescriptors.length === 0) {
                return;
            }

            await relatedTargetResolver.ensureTargets(quoteDescriptors);
        },
        pageSize: POST_HISTORY_PAGE_SIZE,
    });
    const repostPreviews = usePostHistoryRepostPreviews({
        getShow: () => !destroyed && show, getPubkey: () => destroyed ? null : pubkeyHex, getPosts: () => history.posts,
        resolver: relatedTargetResolver,
    });
    let repostResult = $state<PostRepostResult | null>(null);
    let repostUiGeneration = 0;
    $effect(() => {
        show; pubkeyHex; repostUiGeneration++; repostResult = null;
        return () => relatedTargetResolver.invalidateScope("post-history-repost-operation");
    });
    type RecordActionItemProps = Omit<
        ComponentProps<typeof PostHistoryRecordActionItems>,
        "order" | "showDeleteSeparator"
    >;

    function buildRecordActionItemProps(
        post: PostHistoryRecord,
        options: { externalClient: boolean; repost?: boolean },
    ): RecordActionItemProps {
        return {
            ...(options.repost === false
                ? {}
                : {
                    onRepost: canRepost(post) ? () => void handleRepost(post) : undefined,
                    repostPending,
                }),
            copyFailed: copyNeventUi.copyState[post.eventId] === "failed",
            showBroadcast: canBroadcastPost(post),
            broadcastSending: isBroadcastSending(post),
            showDelete: canDeletePost(post),
            deletionSending: isDeletionSending(post),
            onCopyPointerDown: (event) =>
                copyNeventUi.captureCopyPointerPosition(post, event),
            onCopyNevent: (event) =>
                void copyNeventUi.handleCopyNevent(post, event),
            ...(options.externalClient
                ? {
                    externalClientLabel: getExternalClientOpenLabel(),
                    onOpenExternalClient: () => handleOpenExternalClient(post),
                }
                : {}),
            onShowRawJson: () =>
                openRawJson(post.rawEvent, [
                    ...post.relayHints,
                    ...post.acceptedRelays,
                    ...(post.fetchedRelays ?? []),
                ]),
            onBroadcastPointerDown: (event) =>
                captureBroadcastPointerPosition(post, event),
            onBroadcastPost: (event) => void handleBroadcastPost(post, event),
            onOpenDeleteConfirm: () => openDeleteConfirm(post),
        };
    }

    const quotePreviewView: ComponentProps<typeof PostHistoryRecordQuotePreviews>["view"] = {
        getSensitiveBodyLoader: (event) => getSensitiveBodyLoader(event),
        getModel: (eventId) => relatedPreviewModelByEventId[eventId],
        onImageOpen: (params) => handleImageOpen(params),
        retry: (eventId) => quotePreviews.retryQuotePreview(eventId),
        get onReactionPost() {
            return onReactionPost ? handleReactionPost : undefined;
        },
        get onReplyPost() {
            return onReplyPost ? handleReplyPost : undefined;
        },
        get onQuotePost() {
            return onQuotePost ? handleQuotePost : undefined;
        },
        getReactionReadModel: (eventId) => getRelatedReactionReadModel(eventId),
        isReactionExpanded: (eventId) => isReactionExpandedByEventId(eventId),
        getReactionLabel: (eventId) => getRelatedReactionLabel(eventId),
        toggleReactions: (eventId) => toggleReactionsByEventId(eventId),
        buildRecord: (event) => buildPostRecordFromQuoteEvent(event),
        buildMenuKey: (parentEventId, quoteEventId) =>
            buildQuotePreviewMenuKey(parentEventId, quoteEventId),
        isMenuOpen: (menuKey) => postActionUi.isPostMenuOpen(menuKey),
        setMenuOpen: (menuKey, open) => setExclusivePostMenuOpen(menuKey, open),
        getActionItems: (record) =>
            buildRecordActionItemProps(record, { externalClient: true, repost: false }),
    };

    function canRepost(post: PostHistoryRecord): boolean {
        return !!onRepostPost && isRepostTargetKind(post.kind) && post.deletedAt === undefined
            && isPostHistoryRawEventConsistent(post.rawEvent, post);
    }
    async function handleRepost(post: PostHistoryRecord) {
        if (!onRepostPost || repostPending || !canRepost(post)) return;
        repostResult = null;
        const generation = repostUiGeneration;
        const owned = captureOperation();
        const result = await onRepostPost(post, (target, relayHints) => {
            if (!owned()) throw new DOMException("History tab suspended", "AbortError");
            return relatedTargetResolver.prepareRepostTarget({
            relationKind: "repost", scopeKey: "post-history-repost-operation",
            targetEventId: target.id, authorHint: target.pubkey, relayHints }, target); });
        if (generation === repostUiGeneration && show) repostResult = result;
    }
    const channelDisplay = usePostHistoryChannelDisplay({
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getPosts: () => [...history.posts, ...history.posts.flatMap((post) => {
            if (!isRepostOuterKind(post.kind)) return [];
            const preview = repostPreviews.getPreview(post);
            return preview.status === "resolved" && preview.event?.kind === 42
                ? [repostTargetToPost(preview.event, preview.relayHints)] : [];
        })],
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        getIsSearchMode: () => history.isSearchMode,
    });
    const quotePreviews = usePostHistoryQuotePreviews({
        getShow: () => !destroyed && show,
        getPosts: () => history.posts,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        relatedTargetResolver,
        profileSyncCoordinator,
    });

    function getRepostChannelText(post: PostHistoryRecord): string | null {
        const preview = repostPreviews.getPreview(post);
        return preview.status === "resolved" && preview.event?.kind === 42
            ? channelDisplay.getChannelText(repostTargetToPost(preview.event, preview.relayHints), $_) : null;
    }

    function collectQuoteRelatedTargetDescriptors(posts: PostHistoryRecord[]) {
        const quoteIndex =
            postHistoryQuoteTargetDiscoveryAdapter.buildIndex(posts);
        return Object.values(quoteIndex.contextsByEventId).map((context) =>
            postHistoryQuoteTargetDiscoveryAdapter.toDescriptor(
                context,
                "post-history-listing-quote-visible-range-repair",
            ),
        );
    }
    const postHistoryThreadGraph = usePostHistoryThreadGraph({
        onRelatedEventsRefreshed: (status) => {
            if (status === "success" || status === "partial") showRelatedEventsResultMessage();
        },
        onDeletedPost: (eventId, deletedAt, deletionEventId) => history.patchDeletedPost(eventId, deletedAt, deletionEventId),
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getPubkeyHex: () => destroyed ? null : pubkeyHex,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        relatedTargetResolver,
        profileSyncCoordinator,
    });
    function getRelatedReactionTargets() {
        const targets = new Map<string, PostHistoryRelatedReactionCardTarget>();
        const addTarget = (event: NostrEvent, relayHints: string[]) => {
            const eventId = event.id;
            if (!eventId || history.posts.some((post) => post.eventId === eventId && ![6, 16].includes(post.kind))) return;
            targets.set(eventId, { eventId, targetAuthorPubkey: event.pubkey, targetKind: event.kind,
                relayHints: Array.from(new Set([...(targets.get(eventId)?.relayHints ?? []), ...relayHints])) });
        };
        const visitNode = (nodeState: PostHistoryThreadGraphNodeState | null) => {
            if (!nodeState) return;
            addTarget(nodeState.node.event, nodeState.node.relayUrls);
            visitNode(nodeState.parentNodeState);
            nodeState.replyNodeStates.forEach(visitNode);
        };
        for (const post of history.posts) {
            const outer = [6, 16].includes(post.kind) ? verifyRelatedEvent(post.rawEvent) : null;
            if (outer) addTarget(outer.event, [...(post.fetchedRelays ?? []), ...post.acceptedRelays, ...post.relayHints]);
            const repost = repostPreviews.getPreview(post);
            if (repost.status === 'resolved' && repost.event) addTarget(repost.event, repost.relayHints);
            const anchorState = postHistoryThreadGraph.getAnchorState(post);
            visitNode(anchorState.parentNodeState);
            anchorState.replyNodeStates.forEach(visitNode);
            for (const quote of quotePreviews.getQuotePreviews(post)) {
                if (quote.status === "resolved") addTarget(quote.event, quote.relayHints);
            }
        }
        return Array.from(targets.values());
    }
    let relatedReactionTargets = $derived.by(getRelatedReactionTargets);
    const relatedReactions = usePostHistoryRelatedReactions({
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getPubkeyHex: () => destroyed ? null : pubkeyHex,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        getTargets: () => relatedReactionTargets,
        profileSync: profileSyncCoordinator,
    });
    const inboundSync = usePostHistoryInboundInteractionsSync({
        getShow: () => !destroyed && show,
        getPubkeyHex: () => destroyed ? null : pubkeyHex,
        getRxNostr: () => destroyed ? undefined : rxNostr,
        getRelayConfig: () => destroyed ? null : relayConfig,
        getPosts: () => history.posts,
        onSavedInboundInteractions: (parentEventIds) =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                history.posts,
                parentEventIds,
            ),
        reconcileDirectReplyCandidates: (candidates) =>
            reconcileInboundDirectReplyCandidates?.(candidates) ??
            Promise.resolve({
                changedParentEventIds: [],
                savedDirectReplyCount: 0,
                unresolvedParentEventIds: candidates
                    .map((candidate) => candidate.classification.parentEventId)
                    .filter((eventId): eventId is string => !!eventId),
            }),
    });
    const postActionUi =
        usePostHistoryPostActionUiController<PostHistoryRecord>();
    const copyNeventUi = usePostHistoryCopyNevent();

    function createTodayDateValue(): DateValue {
        const now = new Date();
        const year = `${now.getFullYear()}`;
        const month = `${now.getMonth() + 1}`.padStart(2, "0");
        const day = `${now.getDate()}`.padStart(2, "0");
        return parseDate(`${year}-${month}-${day}`);
    }

    let localHistoryDeleteConfirmOpen = $state(false);
    let activeUtilityPanel = $state<PostHistoryUtilityPanel>("none");
    let isExplicitNavigation = $state(false);
    let surroundingPostsNavigationRequestId = 0;
    let jumpDateValue = $state<DateValue | undefined>(createTodayDateValue());
    let jumpDatePlaceholder = $state<DateValue | undefined>(
        createTodayDateValue(),
    );
    let jumpDatePickerOpen = $state(false);
    let appliedLatestPostedReplyEventId: string | null = null;
    let headingMenuOpen = $state(false);
    let importDialogOpen = $state(false);
    const fullScan = usePostHistoryRelayFullScan({
        getShow: () => !destroyed && show,
        getScope: () => ({ ownerPubkeyHex: pubkeyHex, rxNostr, relayConfig }),
        onSettled: handleFullScanSettled,
    });
    const jsonlExport = usePostHistoryJsonlExport({
        getShow: () => show,
        getPubkeyHex: () => pubkeyHex,
        downloadContainer: overlayTarget,
        onStart: () => { headingMenuOpen = false; },
    });
    let showRelatedEventsResult = $state(false);
    let relatedEventsMessageKey = $state<"postHistory.relatedEventsChecking" | "postHistory.relatedEventsApplied">("postHistory.relatedEventsApplied");
    let relatedEventsResultTimeout: ReturnType<typeof setTimeout> | undefined;

    function hideRelatedEventsResultMessage(): void {
        if (relatedEventsResultTimeout !== undefined) {
            clearTimeout(relatedEventsResultTimeout);
            relatedEventsResultTimeout = undefined;
        }
        showRelatedEventsResult = false;
    }

    function showRelatedEventsResultMessage(key: typeof relatedEventsMessageKey = "postHistory.relatedEventsApplied"): void {
        hideRelatedEventsResultMessage();
        relatedEventsMessageKey = key;
        showRelatedEventsResult = true;
        if (key === "postHistory.relatedEventsApplied") {
            relatedEventsResultTimeout = setTimeout(hideRelatedEventsResultMessage, 1800);
        }
    }

    async function handleRefreshRelatedEvents(post: PostHistoryRecord, nodeEventId = post.eventId): Promise<void> {
        const owned = captureOperation();
        showRelatedEventsResultMessage("postHistory.relatedEventsChecking");
        try {
            await postHistoryThreadGraph.refreshRelatedEvents(post, nodeEventId);
        } finally {
            if (owned() && relatedEventsMessageKey === "postHistory.relatedEventsChecking") {
                hideRelatedEventsResultMessage();
            }
        }
    }

    let rawJsonDialogOpen = $state(false);
    let selectedRawEvent = $state<unknown>(null);
    let selectedRawRelayHints = $state<string[]>([]);
    let rawJsonSelectionVersion = $state(0);
    let deleteRequestState = $state<
        Record<string, "sending" | "failed" | undefined>
    >({});
    let broadcastRequestState = $state<Record<string, "sending" | undefined>>(
        {},
    );
    let showBroadcastFloatingMessage = $state(false);
    let broadcastFloatingMessageX = $state(0);
    let broadcastFloatingMessageY = $state(0);
    let broadcastFloatingMessageKey = $state<
        | "postHistory.broadcastSent"
        | "postHistory.broadcastFailed"
    >("postHistory.broadcastSent");
    let broadcastFloatingMessageTimeout:
        | ReturnType<typeof setTimeout>
        | undefined;
    let lastBroadcastPointerPosition = $state<
        BroadcastPointerPosition | undefined
    >(undefined);
    let reactionsExpandedByEventId = $state<Record<string, boolean>>({});
    let fullscreenMediaItems = $state<FullscreenMediaItem[]>([]);
    let fullscreenIndex = $state(-1);
    let showImageFullscreen = $state(false);
    let postHistoryHeadingElement = $state<HTMLDivElement | null>(null);
    let historyContainer = $state<HTMLDivElement | null>(null);
    let autoLoadOlderSentinel = $state<HTMLDivElement | null>(null);
    let isAutoLoadingOlder = $state(false);
    let isAutoLoadingNewer = $state(false);
    let autoLoadRootHeight = $state<number | null>(null);
    let autoLoadRootResizeGeneration = $state(0);
    let autoLoadOlderAwaitingExit = false;
    let autoLoadNewerAwaitingExit = false;
    let autoLoadOlderSentinelIsIntersecting = false;
    let autoLoadNewerSentinelIsIntersecting = false;
    let autoLoadRootForHeight: HTMLDivElement | null = null;
    let observedAutoLoadRootHeight: number | null = null;
    let nextAutoLoadRootResizeGeneration = 0;
    let autoLoadOlderObserverContext:
        | {
              root: HTMLDivElement;
              sentinel: HTMLDivElement;
              resizeGeneration: number;
              scrollTop: number;
              reconcileAfterCommit: () => void;
              resumeAfterLoad: () => void;
          }
        | null = null;
    let autoLoadNewerObserverContext:
        | {
              root: HTMLDivElement;
              sentinel: HTMLDivElement;
              resizeGeneration: number;
              scrollTop: number;
              reconcileAfterCommit: () => void;
              resumeAfterLoad: () => void;
          }
        | null = null;
    const supportsAutoLoadOlder = typeof IntersectionObserver !== "undefined";
    let hasNewerAutoLoadTopReservation = $state(false);
    let pendingNewerAutoLoadTopReservationRestore: {
        anchor: ReturnType<typeof historyViewport.captureHistoryScrollAnchor>;
    } | null = null;
    let searchInputElement = $state<HTMLInputElement | null>(null);
    let showDelayedListLoading = $state(false);
    let initialReadyReported = $state(false);
    const previewCollapse = usePostHistoryPreviewCollapse({
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getPosts: () => history.posts.map((post) => ({
            ...post,
            content: resolveEventContentBody(post.content, post.tags),
        })),
        getContainer: () => historyContainer,
    });
    const reactionEmojiSlotWidthByUrl = new Map<string, number>();
    const historyViewport = usePostHistoryDialogViewport({
        getShow: () => !destroyed && show,
        getPubkeyHex: () => destroyed ? null : pubkeyHex,
        getPosts: () => history.posts,
        getLocale: () => $locale,
        getContainer: () => historyContainer,
        getIsSearchMode: () => history.isSearchMode,
        getSearchQuery: () => history.state.searchQuery,
    });
    const emojiState = usePostHistoryEmojiState({
        getShow: () => !destroyed && show,
        getSessionOpen: () => sessionOpen ?? active,
        getEmojiUrls: () => dialogEmojiUrls,
        onStateChanged: () => previewCollapse.remeasure(),
    });

    function buildDisplayPreviewModel(
        post: PostHistoryRecord,
    ): PostContentRenderModel {
        const content = isRepostOuterKind(post.kind) ? "" : resolveEventContentBody(post.content, post.tags);
        const displayContent = stripPostHistoryInlineQuoteUrisForDisplay({
            ...post,
            content,
        });
        return buildPostContentRenderModel({
            kind: post.kind,
            sourceContent: content,
            displayContent,
            tags: post.tags,
            media: post.media,
        });
    }

    function getSensitiveBodyLoader(event: NostrEvent | null | undefined) {
        return createSensitivePayloadBodyLoader({
            ownerPubkey: pubkeyHex,
            structure: event,
            rxNostr,
            relayConfig,
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
        let slotWidth = reactionEmojiSlotWidthByUrl.get(url);
        if (slotWidth === undefined) {
            const aspectRatio = emojiState.emojiImageMetaByUrl[url]?.aspectRatio;
            const hasAspectRatio =
                typeof aspectRatio === "number" &&
                Number.isFinite(aspectRatio) &&
                aspectRatio > 0;
            slotWidth = hasAspectRatio
                ? POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE * aspectRatio
                : POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE;
            reactionEmojiSlotWidthByUrl.set(url, slotWidth);
        }

        return [
            `width: ${formatReactionEmojiPixelValue(slotWidth)}px;`,
            `height: ${POST_HISTORY_REACTION_CUSTOM_EMOJI_SIZE}px;`,
            "vertical-align: bottom;",
        ].join(" ");
    }

    let previewModelByEventId = $derived.by(() => {
        const nextContent: Record<string, PostContentRenderModel> = {};

        for (const post of history.posts) {
            nextContent[post.eventId] = buildDisplayPreviewModel(post);
        }

        return nextContent;
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
                "postHistory.repairFetchFailed",
    );
    let syncToastExpired = $state(false);
    const canAutoHideSyncToast = $derived(
        show && !fullScan.state.open && !jsonlExport.running &&
            history.isDialogOpenSyncing &&
            headingStatusMessageKey === "postHistory.syncing" &&
            history.posts.length > 0,
    );
    $effect(() => {
        syncToastExpired = false;
        if (!canAutoHideSyncToast) return;

        const timeout = setTimeout(() => { syncToastExpired = true; }, 1000);
        return () => clearTimeout(timeout);
    });
    let canUseReturnToLatest = $derived(
        history.canReturnToLatest || !historyViewport.isHistoryScrolledToTop,
    );
    let canUseJumpToOldest = $derived(
        history.canJumpToOldest || !historyViewport.isHistoryScrolledToBottom,
    );
    let isHistoryListLoading = $derived(
        history.isSearchMode
            ? history.searchResultStatus === "loading"
            : history.initialLocalLoadStatus === "loading",
    );
    let canShowEmptyHistoryState = $derived(
        history.posts.length === 0
        && (history.isSearchMode
            ? history.searchResultStatus === "ready"
            : history.initialLocalLoadStatus === "ready"),
    );
    $effect(() => {
        if (!show || initialReadyReported || !onInitialReady) return;
        const loadStatus = history.isSearchMode
            ? history.searchResultStatus
            : history.initialLocalLoadStatus;
        if (!pubkeyHex || history.posts.length > 0 || loadStatus === "ready" || loadStatus === "failed") {
            initialReadyReported = true;
            onInitialReady();
        }
    });

    function addRelatedPreviewModel(
        event: NostrEvent,
        models: Record<string, PostContentRenderModel>,
    ): void {
        if (models[event.id]) {
            return;
        }

        models[event.id] = buildPostContentRenderModel({
            kind: event.kind,
            sourceContent: event.content,
            tags: event.tags,
        });
    }

    function addThreadNodePreviewModels(
        nodeState: PostHistoryThreadGraphNodeState | null,
        models: Record<string, PostContentRenderModel>,
        visitedEventIds: Set<string>,
    ): void {
        if (!nodeState || visitedEventIds.has(nodeState.node.eventId)) {
            return;
        }

        visitedEventIds.add(nodeState.node.eventId);
        addRelatedPreviewModel(nodeState.node.event, models);
        addThreadNodePreviewModels(
            nodeState.parentNodeState,
            models,
            visitedEventIds,
        );
        for (const replyState of nodeState.replyNodeStates) {
            addThreadNodePreviewModels(replyState, models, visitedEventIds);
        }
    }

    let relatedPreviewModelByEventId = $derived.by(() => {
        const models: Record<string, PostContentRenderModel> = {};

        for (const post of history.posts) {
            const visitedEventIds = new Set<string>();
            for (const quotePreview of getQuotePreviewStates(post)) {
                if (quotePreview.status === "resolved") {
                    addRelatedPreviewModel(quotePreview.event, models);
                }
            }

            const graphState = postHistoryThreadGraph.getAnchorState(post);
            if (graphState.parentNode) {
                addRelatedPreviewModel(graphState.parentNode.event, models);
            }
            addThreadNodePreviewModels(
                graphState.parentNodeState,
                models,
                visitedEventIds,
            );
            for (const replyState of graphState.replyNodeStates) {
                addThreadNodePreviewModels(
                    replyState,
                    models,
                    visitedEventIds,
                );
            }
        }

        return models;
    });

    let dialogEmojiUrls = $derived.by(() => {
        const urls = new Set<string>();

        for (const previewModel of [
            ...Object.values(previewModelByEventId),
            ...Object.values(relatedPreviewModelByEventId),
        ]) {
            for (const url of previewModel.previewContent.emojiUrls) {
                urls.add(url);
            }
        }

        for (const post of history.posts) {
            const graphState = postHistoryThreadGraph.getAnchorState(post);
            if (!reactionsExpandedByEventId[post.eventId]) {
                continue;
            }

            for (const reactionGroup of graphState.reactionReadModel.groups) {
                if (reactionGroup.emojiUrl) {
                    urls.add(reactionGroup.emojiUrl);
                }
            }
        }

        for (const target of relatedReactionTargets) {
            if (!reactionsExpandedByEventId[target.eventId]) continue;
            const reactionModel = getRelatedReactionReadModel(target.eventId);
            for (const reactionGroup of reactionModel?.groups ?? []) {
                if (reactionGroup.emojiUrl) urls.add(reactionGroup.emojiUrl);
            }
        }

        return [...urls];
    });

    function resetDialogState(): void {
        surroundingPostsNavigationRequestId += 1;
        profileSyncCoordinator.reset();
        copyNeventUi.resetState();
        hideBroadcastFloatingMessage();
        jsonlExport.hideMessage();
        hideRelatedEventsResultMessage();
        postActionUi.resetDeleteConfirmation();
        importDialogOpen = false;
        fullScan.setOpen(false);
        rawJsonDialogOpen = false;
        selectedRawEvent = null;
        localHistoryDeleteConfirmOpen = false;
        activeUtilityPanel = "none";
        isExplicitNavigation = false;
        jumpDateValue = createTodayDateValue();
        jumpDatePlaceholder = createTodayDateValue();
        jumpDatePickerOpen = false;
        headingMenuOpen = false;
        deleteRequestState = {};
        broadcastRequestState = {};
        resetPendingDeletionRequests();
        reactionsExpandedByEventId = {};
        emojiState.resetState();
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        showImageFullscreen = false;
    }

    export function prepareClose() {
        if (closing) return;
        closing = true;
        surroundingPostsNavigationRequestId += 1;
        const wasSearchMode = history.isSearchMode;
        if (wasSearchMode) {
            historyViewport.clearCurrentSessionScrollAnchor();
        }
        history.resetSearchState();
        const shouldClearAllSessionScrollState = history.prepareForClose();
        if (shouldClearAllSessionScrollState) {
            historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        } else if (!wasSearchMode) {
            historyViewport.saveCurrentSessionScrollAnchor();
        }
        channelDisplay.cancelCurrentChannelResolution();
        postHistoryThreadGraph.cancelCurrentGraphFetches();
        postActionUi.resetDeleteConfirmation();
        importDialogOpen = false;
        fullScan.setOpen(false);
        rawJsonDialogOpen = false;
        selectedRawEvent = null;
        localHistoryDeleteConfirmOpen = false;
        headingMenuOpen = false;
        copyNeventUi.hideCopyFloatingMessage();
        hideBroadcastFloatingMessage();
        jsonlExport.hideMessage();
        hideRelatedEventsResultMessage();
        jsonlExport.cancel();
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        activationEpoch++;
    }
    function handleClose() {
        prepareClose();
        onClose?.();
    }



    $effect.pre(() => {
        const shouldReserveTopSlot =
            supportsAutoLoadOlder
            && !history.isSearchMode
            && history.state.listingMode === "contiguous"
            && !isExplicitNavigation
            && history.state.hasNewerLocal;

        if (untrack(() => hasNewerAutoLoadTopReservation) === shouldReserveTopSlot) {
            return;
        }

        pendingNewerAutoLoadTopReservationRestore = {
            anchor: historyViewport.captureHistoryScrollAnchor(),
        };
        hasNewerAutoLoadTopReservation = shouldReserveTopSlot;
    });

    $effect(() => {
        hasNewerAutoLoadTopReservation;
        const pendingRestore = untrack(
            () => pendingNewerAutoLoadTopReservationRestore,
        );
        if (!pendingRestore) {
            return;
        }

        historyViewport.restoreHistoryScrollAnchor(pendingRestore.anchor);
        pendingNewerAutoLoadTopReservationRestore = null;
    });

    $effect(() => {
        if (sessionOpen ?? active) return;
        untrack(() => { jsonlExport.cancel(); resetDialogState(); });
    });

    $effect(() => {
        if (jsonlExport.running && jsonlExport.ownerPubkeyHex && pubkeyHex !== jsonlExport.ownerPubkeyHex) {
            jsonlExport.cancel();
        }
    });

    $effect(() => {
        if (!show || !isHistoryListLoading || (onInitialReady && !initialReadyReported)) {
            showDelayedListLoading = false;
            return;
        }

        showDelayedListLoading = false;
        const timeoutId = setTimeout(() => {
            if (show && isHistoryListLoading) {
                showDelayedListLoading = true;
            }
        }, POST_HISTORY_LIST_LOADING_DELAY_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    });

    $effect(() => {
        const root = historyContainer;
        if (!root) {
            autoLoadRootForHeight = null;
            observedAutoLoadRootHeight = null;
            autoLoadRootHeight = null;
            return;
        }

        const syncAutoLoadRootHeight = () => {
            const nextHeight = Math.max(0, root.clientHeight);
            if (autoLoadRootForHeight !== root) {
                autoLoadRootForHeight = root;
                observedAutoLoadRootHeight = nextHeight;
                autoLoadRootHeight = nextHeight;
                return;
            }

            if (observedAutoLoadRootHeight === nextHeight) {
                return;
            }

            observedAutoLoadRootHeight = nextHeight;
            autoLoadRootHeight = nextHeight;
            nextAutoLoadRootResizeGeneration += 1;
            autoLoadRootResizeGeneration = nextAutoLoadRootResizeGeneration;
        };

        syncAutoLoadRootHeight();
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const resizeObserver = new ResizeObserver(syncAutoLoadRootHeight);
        resizeObserver.observe(root);

        return () => {
            resizeObserver.disconnect();
            if (autoLoadRootForHeight === root) {
                autoLoadRootForHeight = null;
                observedAutoLoadRootHeight = null;
                autoLoadRootHeight = null;
            }
        };
    });

    $effect(() => {
        const sentinel = autoLoadOlderSentinel;
        const root = historyContainer;
        const rootHeight = autoLoadRootHeight;
        const resizeGeneration = autoLoadRootResizeGeneration;
        const enabled =
            show
            && !!sentinel
            && !!root
            && rootHeight !== null
            && rootHeight > 0
            && !history.isSearchMode
            && history.state.listingMode === "contiguous"
            && history.state.hasOlderLocal
            && !history.isFetchingOlderFromRelays
            && !history.isRefetchingAroundCurrentView;
        if (!enabled || !supportsAutoLoadOlder) {
            autoLoadOlderAwaitingExit = false;
            autoLoadOlderSentinelIsIntersecting = false;
            autoLoadOlderObserverContext = null;
            return;
        }

        const previousObserverContext = autoLoadOlderObserverContext;
        const previousScrollTop = previousObserverContext?.scrollTop;
        const suppressInitialIntersectionForResize =
            previousObserverContext?.root === root
            && previousObserverContext.sentinel === sentinel
            && previousObserverContext.resizeGeneration !== resizeGeneration;
        let receivedInitialEntry = false;
        let isObserverActive = true;
        let awaitingResizeApproach = false;
        let hasPendingApproach = false;
        let lastScrollTop = root.scrollTop;

        const isOlderSentinelInPrefetchRegion = () => {
            const rootRect = root.getBoundingClientRect();
            const sentinelRect = sentinel.getBoundingClientRect();
            return sentinelRect.left < rootRect.right
                && sentinelRect.right > rootRect.left
                && sentinelRect.top <= rootRect.bottom + rootHeight * 2
                && sentinelRect.bottom >= rootRect.top;
        };

        const recordExit = () => {
            autoLoadOlderSentinelIsIntersecting = false;
            autoLoadOlderAwaitingExit = false;
            awaitingResizeApproach = false;
            hasPendingApproach = false;
        };

        const requestApproach = () => {
            if (
                !isObserverActive
                || awaitingResizeApproach
                || !canAutoLoadOlderPosts()
            ) {
                return;
            }
            if (isAutoLoadingOlder) {
                hasPendingApproach = true;
                return;
            }
            if (autoLoadOlderAwaitingExit) return;
            hasPendingApproach = false;
            void handleAutoLoadOlder();
        };

        autoLoadOlderObserverContext = {
            root,
            sentinel,
            resizeGeneration,
            scrollTop: root.scrollTop,
            reconcileAfterCommit: () => {
                if (!isObserverActive) {
                    return;
                }
                // Observe the exit before a fast scroll can return to the new
                // tail between IntersectionObserver notifications.
                lastScrollTop = root.scrollTop;
                if (!isOlderSentinelInPrefetchRegion()) {
                    recordExit();
                }
            },
            resumeAfterLoad: () => {
                if (!isObserverActive || !hasPendingApproach) {
                    return;
                }
                hasPendingApproach = false;
                if (!isOlderSentinelInPrefetchRegion()) {
                    recordExit();
                    return;
                }
                requestApproach();
            },
        };

        const handleScrollApproach = () => {
            if (!isObserverActive) {
                return;
            }

            const scrollTop = root.scrollTop;
            const movedTowardOlder = scrollTop > lastScrollTop;
            lastScrollTop = scrollTop;

            if (!isOlderSentinelInPrefetchRegion()) {
                recordExit();
                return;
            }
            if (!movedTowardOlder) {
                return;
            }

            awaitingResizeApproach = false;
            autoLoadOlderSentinelIsIntersecting = true;
            requestApproach();
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (!isObserverActive) {
                    return;
                }

                const currentEntries = entries.filter((entry) => entry.target === sentinel);
                for (const [index, entry] of currentEntries.entries()) {
                    const isInitialEntry = !receivedInitialEntry;
                    receivedInitialEntry = true;
                    const rootRect = root.getBoundingClientRect();
                    const isCurrentlyInPrefetchRegion = rootRect.width > 0 && rootRect.height > 0
                        ? isOlderSentinelInPrefetchRegion()
                        : entry.isIntersecting;
                    const hasLaterIntersection = currentEntries.slice(index + 1)
                        .some((laterEntry) => laterEntry.isIntersecting);

                    // Ignore a queued exit if the sentinel has already
                    // returned, while preserving a real exit/re-entry pair
                    // delivered together in one callback.
                    if (!entry.isIntersecting && isCurrentlyInPrefetchRegion && !hasLaterIntersection) {
                        continue;
                    }
                    if (entry.isIntersecting && !isCurrentlyInPrefetchRegion) {
                        continue;
                    }
                    autoLoadOlderSentinelIsIntersecting = entry.isIntersecting;

                    if (!entry.isIntersecting) {
                        recordExit();
                        continue;
                    }

                    if (
                        isInitialEntry
                        && suppressInitialIntersectionForResize
                        && typeof previousScrollTop === "number"
                        && root.scrollTop <= previousScrollTop
                    ) {
                        awaitingResizeApproach = true;
                        continue;
                    }

                    awaitingResizeApproach = false;
                    requestApproach();
                }
            },
            {
                root,
                rootMargin: `0px 0px ${rootHeight * 2}px 0px`,
                threshold: 0,
            },
        );
        if (!isOlderSentinelInPrefetchRegion()) {
            recordExit();
        }
        observer.observe(sentinel);
        root.addEventListener("scroll", handleScrollApproach, { passive: true });

        return () => {
            isObserverActive = false;
            awaitingResizeApproach = false;
            hasPendingApproach = false;
            root.removeEventListener("scroll", handleScrollApproach);
            observer.disconnect();
        };
    });

    $effect(() => {
        const root = historyContainer;
        const rootHeight = autoLoadRootHeight;
        const resizeGeneration = autoLoadRootResizeGeneration;
        const enabled =
            show
            && !!root
            && rootHeight !== null
            && rootHeight > 0
            && !history.isSearchMode
            && history.state.listingMode === "contiguous"
            && history.state.hasNewerLocal
            && hasNewerAutoLoadTopReservation
            && !isExplicitNavigation
            && !history.isRefetchingAroundCurrentView;
        if (!enabled || !supportsAutoLoadOlder) {
            autoLoadNewerAwaitingExit = false;
            autoLoadNewerSentinelIsIntersecting = false;
            autoLoadNewerObserverContext = null;
            return;
        }

        const previousObserverContext = autoLoadNewerObserverContext;
        const previousScrollTop = previousObserverContext?.scrollTop;
        let isObserverActive = true;
        let cleanupObserver = () => {};
        let setupFrame: number | null = null;
        void tick().then(() => {
            if (!isObserverActive) {
                return;
            }

            setupFrame = requestAnimationFrame(() => {
                setupFrame = null;
                if (!isObserverActive) {
                    return;
                }

                const sentinel = root.querySelector<HTMLDivElement>(
                    ".post-history-auto-load-newer-sentinel",
                );
                if (!sentinel || historyContainer !== root) {
                    return;
                }

                const suppressInitialIntersectionForResize =
                    previousObserverContext?.root === root
                    && previousObserverContext.sentinel === sentinel
                    && previousObserverContext.resizeGeneration !== resizeGeneration;

                let receivedInitialEntry = false;
                let awaitingResizeApproach = false;
                let hasPendingApproach = false;
                let lastScrollTop = root.scrollTop;

                const isNewerSentinelInPrefetchRegion = () => {
                    const rootRect = root.getBoundingClientRect();
                    const sentinelRect = sentinel.getBoundingClientRect();
                    return sentinelRect.left < rootRect.right
                        && sentinelRect.right > rootRect.left
                        && sentinelRect.bottom >= rootRect.top - rootHeight * 2
                        && sentinelRect.top <= rootRect.bottom;
                };

                const recordExit = () => {
                    autoLoadNewerSentinelIsIntersecting = false;
                    autoLoadNewerAwaitingExit = false;
                    awaitingResizeApproach = false;
                    hasPendingApproach = false;
                };

                const requestApproach = () => {
                    if (
                        !isObserverActive
                        || awaitingResizeApproach
                        || autoLoadNewerAwaitingExit
                        || !canAutoLoadNewerPosts()
                    ) {
                        return;
                    }
                    if (isAutoLoadingNewer) {
                        hasPendingApproach = true;
                        return;
                    }
                    hasPendingApproach = false;
                    void handleAutoLoadNewer();
                };

                autoLoadNewerObserverContext = {
                    root,
                    sentinel,
                    resizeGeneration,
                    scrollTop: root.scrollTop,
                    reconcileAfterCommit: () => {
                        if (!isObserverActive) {
                            return;
                        }
                        lastScrollTop = root.scrollTop;
                        if (!isNewerSentinelInPrefetchRegion()) {
                            recordExit();
                        }
                    },
                    resumeAfterLoad: () => {
                        if (!isObserverActive || !hasPendingApproach) {
                            return;
                        }
                        hasPendingApproach = false;
                        if (!isNewerSentinelInPrefetchRegion()) {
                            recordExit();
                            return;
                        }
                        requestApproach();
                    },
                };

                const handleScrollApproach = () => {
                    if (!isObserverActive) {
                        return;
                    }

                    const scrollTop = root.scrollTop;
                    const movedTowardNewer = scrollTop < lastScrollTop;
                    lastScrollTop = scrollTop;

                    if (!isNewerSentinelInPrefetchRegion()) {
                        recordExit();
                        return;
                    }
                    if (!movedTowardNewer) {
                        return;
                    }

                    awaitingResizeApproach = false;
                    autoLoadNewerSentinelIsIntersecting = true;
                    requestApproach();
                };

                const observer = new IntersectionObserver(
                    (entries) => {
                        if (!isObserverActive) {
                            return;
                        }

                        const currentEntries = entries.filter((entry) => entry.target === sentinel);
                        for (const [index, entry] of currentEntries.entries()) {
                            const isInitialEntry = !receivedInitialEntry;
                            receivedInitialEntry = true;
                            const rootRect = root.getBoundingClientRect();
                            const isCurrentlyInPrefetchRegion = rootRect.width > 0 && rootRect.height > 0
                                ? isNewerSentinelInPrefetchRegion()
                                : entry.isIntersecting;
                            const hasLaterIntersection = currentEntries.slice(index + 1)
                                .some((laterEntry) => laterEntry.isIntersecting);

                            // Ignore a queued exit if the sentinel has already
                            // returned, while preserving a real exit/re-entry
                            // pair delivered together in one callback.
                            if (!entry.isIntersecting && isCurrentlyInPrefetchRegion && !hasLaterIntersection) {
                                continue;
                            }
                            if (entry.isIntersecting && !isCurrentlyInPrefetchRegion) {
                                continue;
                            }
                            autoLoadNewerSentinelIsIntersecting = entry.isIntersecting;

                            if (!entry.isIntersecting) {
                                recordExit();
                                continue;
                            }

                            if (
                                isInitialEntry
                                && suppressInitialIntersectionForResize
                                && typeof previousScrollTop === "number"
                                && root.scrollTop >= previousScrollTop
                            ) {
                                awaitingResizeApproach = true;
                                continue;
                            }

                            awaitingResizeApproach = false;
                            requestApproach();
                        }
                    },
                    {
                        root,
                        rootMargin: `${rootHeight * 2}px 0px 0px 0px`,
                        threshold: 0,
                    },
                );
                if (!isNewerSentinelInPrefetchRegion()) {
                    recordExit();
                }
                observer.observe(sentinel);
                root.addEventListener("scroll", handleScrollApproach, { passive: true });
                cleanupObserver = () => {
                    hasPendingApproach = false;
                    awaitingResizeApproach = false;
                    root.removeEventListener("scroll", handleScrollApproach);
                    observer.disconnect();
                };
            });
        });

        return () => {
            isObserverActive = false;
            if (setupFrame !== null) {
                cancelAnimationFrame(setupFrame);
            }
            cleanupObserver();
        };
    });

    onDestroy(() => {
        destroyed = true;
        activationEpoch++;
        surroundingPostsNavigationRequestId += 1;
        jsonlExport.cancel();
        resetPendingDeletionRequests();
        profileSyncCoordinator.dispose();
        jsonlExport.hideMessage();
        hideRelatedEventsResultMessage();
    });

    $effect(() => {
        if (!show || !latestPostedEvent?.id) {
            return;
        }

        const eventId = latestPostedEvent.id;
        const owned = captureOperation();
        if (appliedLatestPostedReplyEventId === eventId) {
            return;
        }

        history.posts;
        void postHistoryThreadGraph
            .recordPostedReply(latestPostedEvent, history.posts)
            .then((applied) => {
                if (applied && owned()) {
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
        const revision = inboundInteractionSave?.revision ?? 0;
        const parentEventIds = inboundInteractionSave?.parentEventIds ?? [];
        const posts = history.posts;
        if (!show || revision <= 0 || parentEventIds.length === 0) {
            return;
        }

        void untrack(() => relatedReactions.refreshCachedReactions(parentEventIds)).catch(() => undefined);

        void untrack(() =>
            postHistoryThreadGraph.loadCachedChildInteractionStateForPosts(
                posts,
                parentEventIds,
            ),
        );

        const owned = captureOperation();
        void triggerPostHistoryChildInteractionDeletionLifecycle({
            source: "dialog-inbound-save",
            parentEventIds,
            rxNostr,
            relayConfig,
            isActive: owned,
        })
            .then((result) => {
                if (
                    !owned() ||
                    (result.deletedReactionEventIds.length === 0 &&
                        result.deletedReplyEventIds.length === 0)
                ) {
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
                totalCountKnown: history.displayTotalCountKnown,
                totalCountStatus: history.displayTotalCountStatus,
                isSearchMode: history.isSearchMode,
            }),
        );
    }

    function parseDateValueToCreatedAt(
        value: DateValue | undefined,
    ): number | null {
        if (!value) {
            return null;
        }

        const year = Number(value.year);
        const month = Number(value.month);
        const day = Number(value.day);
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
        const owned = captureOperation();
        if (!owned()) return;
        const isSearchMode = history.isSearchMode;
        const scrollAnchor = isSearchMode
            ? historyViewport.captureHistoryScrollAnchor()
            : null;
        const changed = await history.loadOlder();
        if (!owned()) return;

        if (changed && isSearchMode) {
            historyViewport.restoreHistoryScrollAnchor(scrollAnchor);
        }
    }

    function canAutoLoadOlderPosts(): boolean {
        return show
            && !history.isSearchMode
            && history.state.listingMode === "contiguous"
            && history.state.hasOlderLocal
            && !history.isRefetchingAroundCurrentView;
    }

    function createAutoLoadViewportCommit() {
        let scrollAnchor: ReturnType<
            typeof historyViewport.captureHistoryScrollAnchor
        > = null;

        return {
            captureAnchorEventId: () => {
                scrollAnchor = historyViewport.captureHistoryScrollAnchor();
                return scrollAnchor?.eventId ?? null;
            },
            canCommitWindowChange: (
                direction: "older" | "newer",
                currentPosts: PostHistoryRecord[],
                nextPosts: PostHistoryRecord[],
            ) =>
                historyViewport.canCommitAutoLoadWindowChange(
                    direction,
                    currentPosts,
                    nextPosts,
                ),
            onCommitted: () => {
                flushSync();
                historyViewport.restoreHistoryScrollAnchor(scrollAnchor, {
                    flushUpdates: false,
                });
                autoLoadOlderObserverContext?.reconcileAfterCommit();
                autoLoadNewerObserverContext?.reconcileAfterCommit();
            },
        };
    }

    async function handleAutoLoadOlder(): Promise<void> {
        const owned = captureOperation();
        if (
            isAutoLoadingOlder
            || autoLoadOlderAwaitingExit
            || !canAutoLoadOlderPosts()
        ) {
            return;
        }

        isAutoLoadingOlder = true;
        autoLoadOlderAwaitingExit = true;

        try {
            const changed = await history.loadOlder(createAutoLoadViewportCommit());
            if (owned() && !changed) autoLoadOlderAwaitingExit = false;
        } finally {
            if (!owned()) return;
            isAutoLoadingOlder = false;
            if (!autoLoadOlderSentinelIsIntersecting) {
                autoLoadOlderAwaitingExit = false;
            }
            autoLoadOlderObserverContext?.resumeAfterLoad();
        }
    }

    function canAutoLoadNewerPosts(): boolean {
        return show
            && !history.isSearchMode
            && history.state.listingMode === "contiguous"
            && history.state.hasNewerLocal
            && !isExplicitNavigation
            && !history.isRefetchingAroundCurrentView;
    }

    async function handleAutoLoadNewer(): Promise<void> {
        const owned = captureOperation();
        if (
            isAutoLoadingNewer
            || autoLoadNewerAwaitingExit
            || !canAutoLoadNewerPosts()
        ) {
            return;
        }

        isAutoLoadingNewer = true;
        autoLoadNewerAwaitingExit = true;

        try {
            await history.loadNewer(createAutoLoadViewportCommit());
        } finally {
            if (!owned()) return;
            isAutoLoadingNewer = false;
            if (!autoLoadNewerSentinelIsIntersecting) {
                autoLoadNewerAwaitingExit = false;
            }
            autoLoadNewerObserverContext?.resumeAfterLoad();
        }
    }

    async function handleShowSavedOlderPosts(): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        const changed = await history.showSavedOlderPosts();
        if (!owned()) return;
        if (changed) {
            historyViewport.resetHistoryScrollSoon();
        }
    }

    async function handleFetchOlderFromRelays(): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        let scrollAnchor = historyViewport.captureHistoryScrollAnchor();
        const previousScrollTop = historyContainer?.scrollTop ?? null;
        let scrollTopToRestore = previousScrollTop;
        const loadedPostsBeforeLength = history.state.loadedPosts.length;
        const scrollHeightBefore = historyContainer?.scrollHeight ?? null;
        const clientHeight = historyContainer?.clientHeight ?? null;
        let didRestoreAnchor = false;
        let didPreserveScrollTop = false;
        const restoreScrollPosition = () => {
            if (!owned() || scrollTopToRestore === null || !show || !historyContainer) {
                return;
            }
            didRestoreAnchor = historyViewport.restoreHistoryScrollAnchor(
                scrollAnchor,
                { flushUpdates: false },
            );
            if (!didRestoreAnchor) {
                historyContainer.scrollTop = scrollTopToRestore;
                didPreserveScrollTop = true;
            }
        };
        const changed = await history.fetchOlderFromRelays({
            anchorEventId: scrollAnchor?.eventId,
            viewportCommit: {
                captureAnchorEventId: () => {
                    scrollAnchor = historyViewport.captureHistoryScrollAnchor();
                    if (!owned()) return null;
                    if (scrollAnchor) {
                        scrollTopToRestore = historyContainer?.scrollTop ?? null;
                    }
                    return scrollAnchor?.eventId ?? null;
                },
                onCommitted: () => {
                    flushSync();
                    restoreScrollPosition();
                },
            },
        });
        if (!owned()) return;
        // Restore against the committed rows and completion status geometry.
        await tick();
        if (!owned()) return;

        const didFollowBottom = false;
        if (changed) {
            restoreScrollPosition();
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
        const owned = captureOperation();
        if (!owned()) return;
        const scrollAnchor = history.isSearchMode
            ? null
            : historyViewport.captureHistoryScrollAnchor();
        const changed = await history.loadNewer();
        if (!owned()) return;
        if (changed) {
            if (history.isSearchMode) {
                historyViewport.resetHistoryScrollSoon();
            } else {
                historyViewport.restoreHistoryScrollAnchor(scrollAnchor);
            }
        }
    }

    async function handleReturnToLatest(): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        const changed = history.canReturnToLatest
            ? await history.returnToLatest()
            : false;
        if (!owned()) return;
        isExplicitNavigation = false;
        if (changed || !historyViewport.isHistoryScrolledToTop) {
            historyViewport.resetHistoryScrollSoon();
        }
    }

    async function handleJumpToDateSubmit(): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        const createdAt = parseDateValueToCreatedAt(jumpDateValue);
        if (createdAt === null) {
            return;
        }

        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        isExplicitNavigation = true;
        const changed = await history.jumpToCreatedAt(createdAt);
        if (!owned()) return;
        if (!changed) {
            isExplicitNavigation = false;
        }
        if (changed) {
            activeUtilityPanel = "none";
            jumpDatePickerOpen = false;
            historyViewport.resetHistoryScrollSoon();
        }
    }

    function getPreviewModel(
        post: PostHistoryRecord,
    ): PostContentRenderModel {
        return (
            previewModelByEventId[post.eventId] ??
            buildDisplayPreviewModel(post)
        );
    }
    function hasRenderablePostPreviewContent(post: PostHistoryRecord): boolean {
        return getPreviewModel(post).hasRenderableText;
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

    function isBroadcastSending(post: PostHistoryRecord): boolean {
        return broadcastRequestState[post.eventId] === "sending";
    }

    const eventOperations = usePostEventOperations(() => rxNostr, () => show && !destroyed, () => `${pubkeyHex}:${JSON.stringify(relayConfig)}`);
    function canBroadcastPost(post: PostHistoryRecord): boolean {
        return resolveBroadcastEvent(post) !== null;
    }

    const recordFooterView: ComponentProps<typeof PostHistoryRecordFooter>["view"] = {
        get onReactionPost() {
            return onReactionPost ? handleReactionPost : undefined;
        },
        get onReplyPost() {
            return onReplyPost ? handleReplyPost : undefined;
        },
        get onQuotePost() {
            return onQuotePost ? handleQuotePost : undefined;
        },
        getRepliesActionLabel: (post) => getRepliesActionLabel(post),
        onRepliesAction: (post) => handleRepliesAction(post),
        isReactionsExpanded: (post) => isReactionsExpanded(post),
        getReactionsActionLabel: (post) => getReactionsActionLabel(post),
        toggleReactions: (post) => toggleReactions(post),
        isMenuOpen: (menuKey) => postActionUi.isPostMenuOpen(menuKey),
        setMenuOpen: (menuKey, open) => setExclusivePostMenuOpen(menuKey, open),
        getExternalClientOpenLabel: () => getExternalClientOpenLabel(),
        onOpenExternalClient: (post) => handleOpenExternalClient(post),
        onRefreshRelatedEvents: (post) => void handleRefreshRelatedEvents(post),
        get isSearchMode() {
            return history.isSearchMode;
        },
        onShowSurroundingPosts: (post) => void handleShowSurroundingPosts(post),
        getActionItems: (post) =>
            buildRecordActionItemProps(post, { externalClient: false }),
    };

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

    function isReactionExpandedByEventId(eventId: string): boolean {
        return !!reactionsExpandedByEventId[eventId];
    }

    function toggleReactionsByEventId(eventId: string): void {
        reactionsExpandedByEventId = {
            ...reactionsExpandedByEventId,
            [eventId]: !reactionsExpandedByEventId[eventId],
        };
    }

    function getRelatedReactionReadModel(eventId: string) {
        const ownerPost = history.posts.find((post) => post.eventId === eventId);
        if (ownerPost && ![6, 16].includes(ownerPost.kind)) {
            return postHistoryThreadGraph.getAnchorState(ownerPost).reactionReadModel;
        }

        return relatedReactions.getReadModel(eventId);
    }

    function getRelatedReactionLabel(eventId: string): string {
        const model = getRelatedReactionReadModel(eventId);
        return translateDialogMessage(resolvePostHistoryReactionsActionLabelState({
            visible: isReactionExpandedByEventId(eventId),
            reactionCount: model?.totalCount ?? 0,
        })) ?? "";
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

    function getDisplayedReactionGroups(post: PostHistoryRecord) {
        return postHistoryThreadGraph.getAnchorState(post).reactionReadModel
            .groups;
    }

    function getReactionActorLabel(actor: {
        pubkey: string;
        profile: ProfileData | null;
    }): string {
        return formatPostHistoryReactionActorLabel(actor);
    }

    function toggleReactions(post: PostHistoryRecord): void {
        toggleReactionsByEventId(post.eventId);
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

    async function handleBroadcastPost(
        post: PostHistoryRecord,
        event: Event,
    ): Promise<void> {
        const owned = captureOperation();
        if (!show || isBroadcastSending(post)) {
            return;
        }

        const messagePosition = getBroadcastFloatingMessagePosition(
            post,
            event,
        );
        broadcastRequestState = {
            ...broadcastRequestState,
            [post.eventId]: "sending",
        };

        const result = await eventOperations.broadcast(post) ?? { success: false };

        if (!owned()) return;
        broadcastRequestState = {
            ...broadcastRequestState,
            [post.eventId]: undefined,
        };
        showBroadcastResultMessage(messagePosition, result);
    }

    function hideBroadcastFloatingMessage(): void {
        if (broadcastFloatingMessageTimeout) {
            clearTimeout(broadcastFloatingMessageTimeout);
            broadcastFloatingMessageTimeout = undefined;
        }

        showBroadcastFloatingMessage = false;
        lastBroadcastPointerPosition = undefined;
    }

    function captureBroadcastPointerPosition(
        post: PostHistoryRecord,
        event: PointerEvent,
    ): void {
        lastBroadcastPointerPosition = {
            eventId: post.eventId,
            ...calculateContextMenuPosition(event.clientX, event.clientY),
        };
    }

    function getBroadcastFloatingMessagePosition(
        post: PostHistoryRecord,
        event: Event,
    ): { x: number; y: number } {
        if (lastBroadcastPointerPosition?.eventId === post.eventId) {
            return {
                x: lastBroadcastPointerPosition.x,
                y: lastBroadcastPointerPosition.y,
            };
        }

        const target = event.currentTarget;
        const rect =
            target instanceof HTMLElement
                ? target.getBoundingClientRect()
                : null;

        return calculateContextMenuPosition(
            rect ? rect.left + rect.width / 2 : 0,
            rect ? rect.bottom + 8 : 0,
        );
    }

    function showBroadcastResultMessage(
        position: { x: number; y: number },
        result: PostResult,
    ): void {
        if (broadcastFloatingMessageTimeout) {
            clearTimeout(broadcastFloatingMessageTimeout);
        }

        broadcastFloatingMessageX = position.x;
        broadcastFloatingMessageY = position.y;
        broadcastFloatingMessageKey = !result.success
            ? "postHistory.broadcastFailed"
            : "postHistory.broadcastSent";
        showBroadcastFloatingMessage = true;
        broadcastFloatingMessageTimeout = setTimeout(() => {
            showBroadcastFloatingMessage = false;
            broadcastFloatingMessageTimeout = undefined;
        }, 1800);
    }

    function buildPostRecordFromNodeState(
        nodeState: PostHistoryThreadGraphNodeState,
    ): PostHistoryRecord {
        return createTransientPostHistoryRecord(
            nodeState.node.event,
            nodeState.node.relayUrls,
        );
    }

    function buildPostRecordFromQuoteEvent(
        event: NostrEvent,
    ): PostHistoryRecord {
        return createTransientPostHistoryRecord(event);
    }

    function buildQuotePreviewMenuKey(
        parentEventId: string,
        quoteEventId: string,
    ): string {
        return `quote-preview:${parentEventId}:${quoteEventId}`;
    }

    function setExclusivePostMenuOpen(menuKey: string, open: boolean): void {
        if (open) {
            postActionUi.closeAllPostItemMenus();
        }

        postActionUi.setPostMenuOpen(menuKey, open);
    }

    function openRawJson(rawEvent: unknown, relayHints: string[] = []): void {
        selectedRawEvent = rawEvent;
        selectedRawRelayHints = [...relayHints];
        rawJsonSelectionVersion += 1;
        rawJsonDialogOpen = true;
    }

    function loadRawJsonPayload(
        structure: NostrEvent,
        signal: AbortSignal,
    ): Promise<NostrEvent | null> {
        const runtimeAtStart = rxNostr;
        const pubkeyAtStart = pubkeyHex;
        return loadVerifiedSensitivePayloadEvent({
            structure,
            relayHints: selectedRawRelayHints,
            rxNostr: runtimeAtStart,
            relayConfig,
            signal,
        }).then((payload) =>
            signal.aborted
                || runtimeAtStart !== rxNostr
                || pubkeyAtStart !== pubkeyHex
                ? null
                : payload,
        );
    }

    function observeRawJsonPayload(
        structure: NostrEvent,
        onChange: (status: SensitiveBodyCacheStatus) => void,
    ): () => void {
        return getSensitiveBodyLoader(structure)?.observe?.(onChange) ?? (() => {});
    }

    function handleNodeShowRawJson(
        nodeState: PostHistoryThreadGraphNodeState,
    ): void {
        openRawJson(nodeState.node.event, nodeState.node.relayUrls);
    }

    function isNodeCopyFailed(nodeEventId: string): boolean {
        return copyNeventUi.copyState[nodeEventId] === "failed";
    }

    function isNodeBroadcastSending(nodeEventId: string): boolean {
        return broadcastRequestState[nodeEventId] === "sending";
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

    function handleNodeOpenExternalClient(
        nodeState: PostHistoryThreadGraphNodeState,
    ): void {
        handleOpenExternalClient(buildPostRecordFromNodeState(nodeState));
    }

    function getExternalClientPreference() {
        return {
            client: settingsStore.externalNostrClient,
            customUrlTemplate: settingsStore.externalNostrClientCustomUrl,
        };
    }

    function getExternalClientOpenLabel(): string {
        const clientName = getExternalNostrClientDisplayName(
            getExternalClientPreference(),
        );
        return clientName
            ? $_("postHistory.openInExternalClient", {
                  values: { client: clientName },
              })
            : $_("postHistory.openInExternalClientFallback");
    }

    function handleOpenExternalClient(post: PostHistoryRecord): void {
        const url = buildPostHistoryExternalClientUrl(
            post,
            getExternalClientPreference(),
            writeRelaysStore.value,
        );
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }

    function handleNodeBroadcastPointerPosition(
        nodeState: PostHistoryThreadGraphNodeState,
        event: PointerEvent,
    ): void {
        captureBroadcastPointerPosition(
            buildPostRecordFromNodeState(nodeState),
            event,
        );
    }

    function handleNodeBroadcastPost(
        nodeState: PostHistoryThreadGraphNodeState,
        event: Event,
    ): void {
        void handleBroadcastPost(
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

    async function handleReactionPost(post: PostHistoryRecord): Promise<boolean> {
        const owned = captureOperation();
        if (!show) return false;
        const applied = await onReactionPost?.(post) ?? false;
        if (applied && owned()) handleClose();
        return applied;
    }

    async function handleReplyPost(post: PostHistoryRecord): Promise<void> {
        if (!onReplyPost) {
            return;
        }

        const owned = captureOperation();
        if ((await onReplyPost(post)) !== false && owned()) {
            handleClose();
        }
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
        const owned = captureOperation();
        if (!owned()) return;
        await tick();
        if (!owned()) return;
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

    async function handleShowSurroundingPosts(
        post: PostHistoryRecord,
    ): Promise<void> {
        const requestId = ++surroundingPostsNavigationRequestId;
        isExplicitNavigation = true;
        const changed = await history.jumpToEventId(post.eventId);
        if (requestId !== surroundingPostsNavigationRequestId || !show) {
            return;
        }
        if (!changed) {
            isExplicitNavigation = false;
            return;
        }

        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        activeUtilityPanel = "none";
        history.resetSearchState();
        historyViewport.scrollHistoryEventToTopSoon(post.eventId);
    }

    function toggleJumpDate(): void {
        const willOpen = activeUtilityPanel !== "jump-date";
        activeUtilityPanel = willOpen ? "jump-date" : "none";
        if (!willOpen) {
            jumpDatePickerOpen = false;
        }
        headingMenuOpen = false;
    }

    function hideJumpDate(): void {
        activeUtilityPanel = "none";
        jumpDatePickerOpen = false;
    }

    function openLocalHistoryDeleteConfirm(): void {
        localHistoryDeleteConfirmOpen = true;
        headingMenuOpen = false;
    }

    function openImportDialog(): void {
        importDialogOpen = true;
        headingMenuOpen = false;
    }

    async function handleFullScanSettled(result: PostHistoryFullScanResult): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        const owner = pubkeyHex;
        const requestId = surroundingPostsNavigationRequestId;
        const anchor = historyViewport.captureHistoryScrollAnchor();
        const previousScrollTop = historyContainer?.scrollTop ?? null;
        await history.refreshAfterRelayScan(result);
        await tick();
        if (!owned()) return;
        if (!show || pubkeyHex !== owner || requestId !== surroundingPostsNavigationRequestId) return;
        if (historyContainer && !historyViewport.restoreHistoryScrollAnchor(anchor) && previousScrollTop !== null) {
            historyContainer.scrollTop = previousScrollTop;
        }
    }

    async function handleImportedPostHistory(result: PostHistoryJsonlImportResult): Promise<void> {
        await applyLocalHistoryChange(() => history.refreshAfterLocalImport(result));
    }

    const postHistoryCoverageImportEvent = "ehagaki-post-history-coverage-import";
    $effect(() => {
        if (!(globalThis as typeof globalThis & { __POST_HISTORY_COVERAGE__?: unknown }).__POST_HISTORY_COVERAGE__) {
            return;
        }
        const onCoverageImport = (event: Event) => {
            if (!(event instanceof CustomEvent)) return;
            const detail = event.detail as {
                result?: PostHistoryJsonlImportResult;
                resolve?: () => void;
            } | undefined;
            if (!detail?.result || typeof detail.resolve !== "function") return;
            const resolve = detail.resolve;
            void handleImportedPostHistory(detail.result).finally(resolve);
        };
        window.addEventListener(postHistoryCoverageImportEvent, onCoverageImport);
        return () => {
            window.removeEventListener(postHistoryCoverageImportEvent, onCoverageImport);
        };
    });

    async function applyLocalHistoryChange(apply: () => Promise<void>): Promise<void> {
        const owned = captureOperation();
        if (!owned()) return;
        const owner = pubkeyHex;
        const requestId = surroundingPostsNavigationRequestId;
        const scrollAnchor = historyViewport.captureHistoryScrollAnchor();
        const previousScrollTop = historyContainer?.scrollTop ?? null;
        await apply();
        if (!owned()) return;
        if (!show || pubkeyHex !== owner || requestId !== surroundingPostsNavigationRequestId) return;
        if (!history.isSearchMode && historyContainer) {
            const restored = historyViewport.restoreHistoryScrollAnchor(scrollAnchor);
            if (!restored && previousScrollTop !== null) {
                historyContainer.scrollTop = previousScrollTop;
            }
        }
    }

    function handleRefetchAroundCurrentView(): void {
        headingMenuOpen = false;
        void history.refetchAroundCurrentView();
    }

    function handleJumpToOldestFromMenu(): void {
        const owned = captureOperation();
        historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
        headingMenuOpen = false;
        void history.jumpToOldest().then((changed) => {
            if (!owned()) return;
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

    let sensitivePayloadDeletionOmitted = $state(false);
    $effect(() => {
        if (!show) sensitivePayloadDeletionOmitted = false;
    });
    async function handleDeleteConfirm(): Promise<void> {
        const owned = captureOperation();
        const targetPost = postActionUi.deleteTargetPost;
        if (!targetPost) {
            return;
        }

        deleteRequestState = {
            ...deleteRequestState,
            [targetPost.eventId]: "sending",
        };

        const result = await eventOperations.deletePost(targetPost) ?? { success: false };
        if (!owned()) return;
        sensitivePayloadDeletionOmitted = result.success && result.sensitivePayloadOmitted === true;

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
                    deletionEventAttestation: result.deletionEventAttestation,
                })
                .catch(() => undefined);
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: undefined,
            };
            if (isRepostTargetKind(targetPost.kind)) {
                for (const outer of history.posts) if (isRepostOuterKind(outer.kind)) repostPreviews.retry(outer);
            }
        } else {
            deleteRequestState = {
                ...deleteRequestState,
                [targetPost.eventId]: "failed",
            };
        }

        postActionUi.clearDeleteTarget();
    }

    async function handleLocalHistoryDeleteConfirm(): Promise<void> {
        const owner = pubkeyHex;
        const requestId = ++surroundingPostsNavigationRequestId;
        const deleted = await history.deleteLocalHistory();
        if (!show || pubkeyHex !== owner || requestId !== surroundingPostsNavigationRequestId) return;
        if (deleted) {
            historyViewport.clearAllSessionScrollAnchorsForCurrentPubkey();
            localHistoryDeleteConfirmOpen = false;
            activeUtilityPanel = "none";
            historyViewport.resetHistoryScrollSoon();
        }
    }
</script>

{#snippet repostReactionCount(post: PostHistoryRecord)}
    {@const model = getRelatedReactionReadModel(post.eventId)}
    {#if model && model.totalCount > 0}
        <PostHistoryReactionActionButton count={model.totalCount} expanded={isReactionExpandedByEventId(post.eventId)}
            ariaLabel={getRelatedReactionLabel(post.eventId)} onToggle={() => toggleReactionsByEventId(post.eventId)} />
    {/if}
{/snippet}
{#snippet repostReactionDetails(post: PostHistoryRecord)}
    {@const model = getRelatedReactionReadModel(post.eventId)}
    {#if model && model.totalCount > 0 && isReactionExpandedByEventId(post.eventId)}
        <PostHistoryReactionDetails readModel={model} emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
            emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl} />
    {/if}
{/snippet}

{#if show}
<div class="post-history-tab-content">
    <FloatingMessage show={showRelatedEventsResult} variant="parent-top">
        <div>{$_(relatedEventsMessageKey)}</div>
    </FloatingMessage>
    {#if sensitivePayloadDeletionOmitted}
        <p role="status">{$_("postHistory.sensitivePayloadDeletionOmitted")}</p>
    {/if}
    <div
        class="post-history-heading"
        bind:this={postHistoryHeadingElement}
    >
        <div class="post-history-heading-main">
            {#if historyViewport.currentMonthLabel}
                <h3 class="post-history-current-month-heading">
                    <span class="post-history-current-month">
                        {historyViewport.currentMonthLabel}
                    </span>
                </h3>
            {/if}
            <Button
                className="post-history-heading-action-button post-history-heading-calendar-button"
                variant="default"
                shape="square"
                contentLayout="icon"
                ariaLabel={$_("postHistory.jumpToDate")}
                onClick={toggleJumpDate}
            >
                <div
                    class="calendar-icon svg-icon"
                    aria-hidden="true"
                ></div>
            </Button>
        </div>
        <div class="post-history-heading-actions">
            {#if jsonlExport.running}
                <LoadingPlaceholder
                    text={jsonlExport.progress.phase === "loading"
                        ? $_("postHistory.exportLoading")
                        : jsonlExport.progress.phase === "verifying"
                          ? $_("postHistory.exportVerifying", {
                              values: {
                                  processed: jsonlExport.progress.processed ?? 0,
                                  total: jsonlExport.progress.total ?? 0,
                              },
                          })
                          : $_("postHistory.exportCreating")}
                    showLoader={true}
                    loaderSize={30}
                    state="loading"
                    customClass="status-loading-placeholder"
                />
            {/if}
            <Button
                className="post-history-heading-action-button post-history-heading-refetch-button"
                variant="default"
                shape="square"
                contentLayout="icon"
                ariaLabel={$_("postHistory.repair")}
                disabled={!history.canRefetchAroundCurrentView}
                onClick={handleRefetchAroundCurrentView}
            >
                <div class="repair-icon svg-icon" aria-hidden="true"></div>
            </Button>
            <Button
                className="post-history-heading-action-button post-history-heading-search-button"
                variant="default"
                shape="square"
                contentLayout="icon"
                ariaLabel={$_(
                    activeUtilityPanel === "search"
                        ? "postHistory.hideSearch"
                        : "postHistory.showSearch",
                )}
                onClick={toggleSearch}
            >
                <div class="search-icon svg-icon" aria-hidden="true"></div>
            </Button>
            <DropdownMenu.Root bind:open={headingMenuOpen}>
                <DropdownMenu.Trigger
                    class={`menu-trigger post-history-menu-trigger post-history-heading-menu-trigger ${headingMenuOpen ? "is-open" : ""}`.trim()}
                    aria-label={$_("postHistory.openMenu")}
                >
                    <div class="more-icon svg-icon"></div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal to={overlayTarget}>
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
                            {#if buildVisibleCountLabel()}
                                <div
                                    class="post-history-menu-summary"
                                    role="presentation"
                                >
                                    <span
                                        class="post-history-summary-line post-history-summary-count"
                                    >
                                        {buildVisibleCountLabel()}
                                    </span>
                                </div>
                                <DropdownMenu.Separator
                                    class="post-history-menu-separator"
                                />
                            {/if}
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
                                disabled={!pubkeyHex || jsonlExport.running}
                                onSelect={jsonlExport.start}
                            >
                                <div
                                    class="export-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.export")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                class="menu-action-button"
                                disabled={!pubkeyHex}
                                onSelect={openImportDialog}
                            >
                                <div
                                    class="import-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>{$_("postHistory.import")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item class="menu-action-button" disabled={!pubkeyHex || !rxNostr}
                                onSelect={() => { headingMenuOpen = false; fullScan.setOpen(true); }}>
                                <div class="import-icon svg-icon" aria-hidden="true"></div>
                                <span>{$_("postHistory.fullScanTitle")}</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
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
        >
            <div
                class="post-history-search-input-wrapper"
                class:post-history-search-active={history.isSearchMode}
            >
                <div class="post-history-search-leading" aria-hidden="true">
                    {#if history.isSearchPageLoading}
                        <LoadingPlaceholder
                            variant="spinner"
                            showLoader={true}
                            loaderSize={24}
                            ariaHidden={true}
                            customClass="post-history-search-spinner"
                        />
                    {:else}
                        <div class="search-icon svg-icon"></div>
                    {/if}
                </div>
                <input
                    bind:value={history.state.searchInput}
                    bind:this={searchInputElement}
                    class="post-history-search-input"
                    type="search"
                    placeholder={$_("postHistory.searchPlaceholder")}
                    aria-label={$_("postHistory.search")}
                    aria-busy={history.isSearchPageLoading ? "true" : "false"}
                />
            </div>
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
        <PostHistoryJumpDatePanel
            bind:value={jumpDateValue}
            bind:placeholder={jumpDatePlaceholder}
            bind:open={jumpDatePickerOpen}
            onSubmit={() => void handleJumpToDateSubmit()}
            onClose={hideJumpDate}
        />
    {/if}

    <div
        class={`post-history-container${supportsAutoLoadOlder && !history.isSearchMode && history.state.listingMode === "contiguous" ? " post-history-auto-load-enabled" : ""}`}
        bind:this={historyContainer}
        onscroll={historyViewport.handleHistoryScroll}
        aria-busy={isHistoryListLoading || isAutoLoadingOlder ? "true" : "false"}
    >
        {#if history.posts.length === 0 && showDelayedListLoading}
            <div class="post-history-list-loading" aria-hidden="true">
                <LoadingPlaceholder
                    variant="spinner"
                    showLoader={true}
                    loaderSize={24}
                />
            </div>
        {:else if canShowEmptyHistoryState}
            <div class="empty-state">
                <div class="empty-message">
                    {history.isSearchMode
                        ? $_("postHistory.searchNoResults")
                        : $_("postHistory.empty")}
                </div>
            </div>
        {:else}
            {#if history.isSearchMode
                ? history.canLoadNewer
                : history.state.hasNewerLocal &&
                    (isExplicitNavigation ||
                        !supportsAutoLoadOlder ||
                        history.state.listingMode !== "contiguous")}
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
            {#if supportsAutoLoadOlder && !history.isSearchMode && history.state.listingMode === "contiguous" && !isExplicitNavigation}
                <div class="post-history-auto-load-slot post-history-auto-load-newer-slot" class:post-history-auto-load-newer-slot-reserved={hasNewerAutoLoadTopReservation} aria-hidden="true">
                    {#if hasNewerAutoLoadTopReservation && history.state.hasNewerLocal}
                        <div
                            class="post-history-auto-load-sentinel post-history-auto-load-newer-sentinel"
                        >
                            {#if isAutoLoadingNewer}
                                <LoadingPlaceholder
                                    variant="spinner"
                                    showLoader={true}
                                    loaderSize={24}
                                    ariaHidden={true}
                                />
                            {/if}
                        </div>
                    {/if}
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
                                {#if isRepostOuterKind(post.kind)}
                                    <PostHistoryRepostPreview onReactionPost={onReactionPost ? handleReactionPost : undefined} reactionExtras={repostReactionCount} reactionDetails={repostReactionDetails} {post} preview={repostPreviews.getPreview(post)}
                                        channelText={getRepostChannelText(post)} menu={repostRecordMenu} onRetry={() => repostPreviews.retry(post)}
                                        onReplyPost={onReplyPost ? handleReplyPost : undefined}
                                        onQuotePost={onQuotePost ? handleQuotePost : undefined}
                                        loadSensitiveBody={getSensitiveBodyLoader(repostPreviews.getPreview(post).event)}
                                        scrollRoot={historyContainer} onImageOpen={handleImageOpen}
                                        emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                        emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl} />
                                {:else}
                                {#if post.kind === 42 || post.deletedAt || hasDeletionFailed(post) || !(onReplyPost || onQuotePost)}
                                    <PostHistoryRecordHeader
                                        {post}
                                        channelText={post.kind === 42 ? channelDisplay.getChannelText(post, $_) : null}
                                        deletionFailed={hasDeletionFailed(post)}
                                        showTimestampMenu={!(onReplyPost || onQuotePost)}
                                        menuOpen={postActionUi.isPostMenuOpen(post.eventId)}
                                        onMenuOpenChange={(open) => setExclusivePostMenuOpen(post.eventId, open)}
                                        showSurroundingPostsAction={history.isSearchMode}
                                        onShowSurroundingPosts={() => void handleShowSurroundingPosts(post)}
                                        getActionItems={() => buildRecordActionItemProps(post, { externalClient: true })}
                                    />
                                {/if}
                                <PostHistoryThreadGraphPanel onRefreshRelatedEvents={(nodeEventId) => void handleRefreshRelatedEvents(post, nodeEventId)} onReactionPost={onReactionPost ? handleReactionPost : undefined}
                                    state={graphState}
                                    section="parent"
                                    previewModelByEventId={relatedPreviewModelByEventId}
                                    getSensitiveBodyLoader={getSensitiveBodyLoader}
                                    emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                    emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                    scrollRoot={historyContainer}
                                    onImageOpen={handleImageOpen}
                                    buildPostRecordForNode={buildPostRecordFromNodeState}
                                    onReplyPost={onReplyPost
                                        ? handleReplyPost
                                        : undefined}
                                    onQuotePost={onQuotePost
                                        ? handleQuotePost
                                        : undefined}
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
                                    externalClientLabel={getExternalClientOpenLabel()}
                                    onOpenExternalClient={handleNodeOpenExternalClient}
                                    isCopyFailed={isNodeCopyFailed}
                                    onShowRawJson={handleNodeShowRawJson}
                                    onBroadcastPointerDown={handleNodeBroadcastPointerPosition}
                                    onBroadcastPost={handleNodeBroadcastPost}
                                    isBroadcastSending={isNodeBroadcastSending}
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
                                        <PostContentPreview
                                            model={getPreviewModel(post)}
                                            loadSensitiveBody={getSensitiveBodyLoader(post.rawEvent as NostrEvent)}
                                            resolveSensitiveDisplayContent={(rawBody) =>
                                                stripPostHistoryInlineQuoteUrisForDisplay({
                                                    content: rawBody,
                                                    tags: post.tags,
                                                })}
                                            contentWarningEventId={post.eventId}
                                            density="standard"
                                            emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                            emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                            scrollRoot={historyContainer}
                                            previewCollapseAction={previewCollapse.previewRef}
                                            previewCollapseEventId={post.eventId}
                                            previewContentId={"post-preview-content-" +
                                                post.eventId}
                                            isTextCollapsed={!previewCollapse.isPostExpanded(
                                                post,
                                            )}
                                            onImageOpen={handleImageOpen}
                                        >
                                            {#snippet textOverlay()}
                                                <PostPreviewToggleButton
                                                    placement="overlay"
                                                    visible={previewCollapse.shouldCollapsePost(
                                                        post,
                                                    )}
                                                    expanded={previewCollapse.isPostExpanded(
                                                        post,
                                                    )}
                                                    controls={"post-preview-content-" +
                                                        post.eventId}
                                                    onToggle={() =>
                                                        previewCollapse.togglePostExpanded(
                                                            post.eventId,
                                                        )}
                                                />
                                            {/snippet}
                                        {#snippet afterContentAndMedia()}
                                            <PostHistoryRecordQuotePreviews
                                                parentEventId={post.eventId}
                                                previews={getQuotePreviewStates(post)}
                                                emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                                emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                                scrollRoot={historyContainer}
                                                view={quotePreviewView}
                                            />
                                        {/snippet}
                                        </PostContentPreview>

                                    </div>
                                    <PostHistoryRecordFooter
                                        {post}
                                        {graphState}
                                        emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                        emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                        view={recordFooterView}
                                    />
                                    <PostHistoryThreadGraphPanel onRefreshRelatedEvents={(nodeEventId) => void handleRefreshRelatedEvents(post, nodeEventId)} onReactionPost={onReactionPost ? handleReactionPost : undefined}
                                        state={graphState}
                                        section="children"
                                        previewModelByEventId={relatedPreviewModelByEventId}
                                        getSensitiveBodyLoader={getSensitiveBodyLoader}
                                        emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                                        emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                                        scrollRoot={historyContainer}
                                        onImageOpen={handleImageOpen}
                                        buildPostRecordForNode={buildPostRecordFromNodeState}
                                        onReplyPost={onReplyPost
                                            ? handleReplyPost
                                            : undefined}
                                        onQuotePost={onQuotePost
                                            ? handleQuotePost
                                            : undefined}
                                        getReactionReadModel={getRelatedReactionReadModel}
                                        isReactionExpanded={isReactionExpandedByEventId}
                                        getReactionLabel={getRelatedReactionLabel}
                                        onToggleReaction={toggleReactionsByEventId}
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
                                        externalClientLabel={getExternalClientOpenLabel()}
                                        onOpenExternalClient={handleNodeOpenExternalClient}
                                        isCopyFailed={isNodeCopyFailed}
                                        onShowRawJson={handleNodeShowRawJson}
                                        onBroadcastPointerDown={handleNodeBroadcastPointerPosition}
                                        onBroadcastPost={handleNodeBroadcastPost}
                                        isBroadcastSending={isNodeBroadcastSending}
                                        {canDeleteNodePost}
                                        isDeletionSending={isNodeDeletionSending}
                                        onOpenDeleteConfirm={openNodeDeleteConfirm}
                                    />
                                </div>
                                {/if}
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>

            {#if supportsAutoLoadOlder && !history.isSearchMode && history.state.listingMode === "contiguous" && !history.showSavedPostsBoundary}
                <div class="post-history-auto-load-slot" aria-hidden="true">
                    {#if history.state.hasOlderLocal}
                        <div
                            bind:this={autoLoadOlderSentinel}
                            class="post-history-auto-load-sentinel"
                        >
                            {#if isAutoLoadingOlder && history.syncStatus !== "syncing"}
                                <LoadingPlaceholder
                                    variant="spinner"
                                    showLoader={true}
                                    loaderSize={24}
                                    ariaHidden={true}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}

            {#if history.isShowingSavedOlderPosts}
                <div class="post-history-sparse-state" role="status">
                    <p>{$_("postHistory.savedOlderPostsShowing")}</p>
                    <p>{$_("postHistory.savedOlderPostsGapNotice")}</p>
                </div>
            {/if}

            {#if history.showSavedPostsBoundary}
                <div class="post-history-saved-boundary" role="status">
                    <div class="post-history-saved-boundary-actions">
                        {#if history.canFetchOlderFromRelays || history.isFetchingFromRelays}
                            <Button
                                type="button"
                                variant="primary"
                                className="post-history-nav-button"
                                contentLayout="iconText"
                                disabled={!history.canFetchOlderFromRelays ||
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
                        <Button
                            type="button"
                            variant="default"
                            className="post-history-nav-button"
                            contentLayout="iconText"
                            onClick={() => void handleShowSavedOlderPosts()}
                        >
                            <div
                                class="keyboard-arrow-down-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                            {$_("postHistory.showSavedOlderPosts")}
                        </Button>
                    </div>
                </div>
            {:else if history.isSearchMode && history.canLoadOlder}
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
            {:else if !history.isSearchMode && history.state.hasOlderLocal && (history.state.listingMode === "sparse" || !supportsAutoLoadOlder)}
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
                            disabled={!history.canFetchOlderFromRelays ||
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
            {:else if history.isSearchMode && history.posts.length > 0}
                <div class="post-history-search-bottom-spacer" aria-hidden="true"></div>
            {/if}
        {/if}
        {#if
            !history.isSearchMode &&
            history.syncStatus === "syncing" &&
            (history.posts.length > 0 || jsonlExport.running)}
            <div class="post-history-nav-row post-history-sync-footer" role="status">
                <LoadingPlaceholder
                    text={$_("postHistory.syncing")}
                    variant="spinner"
                    showLoader={true}
                    loaderSize={24}
                />
            </div>
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

    <PostHistoryRelayFullScanDialog open={fullScan.state.open} running={fullScan.state.running}
        canStart={!!pubkeyHex && !!rxNostr} progress={fullScan.state.progress} result={fullScan.state.result}
        elapsedMs={fullScan.state.elapsedMs} onOpenChange={fullScan.setOpen}
        onStart={() => void fullScan.start()} onCancel={fullScan.cancel} />

    <PostHistoryImportDialog
        open={importDialogOpen}
        ownerPubkeyHex={pubkeyHex}
        getCurrentPubkeyHex={() => pubkeyHex}
        onOpenChange={(open) => (importDialogOpen = open)}
        onImported={handleImportedPostHistory}
    />

    <PostHistoryRawJsonDialog
        open={rawJsonDialogOpen}
        rawEvent={selectedRawEvent}
        resetKey={rawJsonSelectionVersion}
        loadPayloadEvent={loadRawJsonPayload}
        observePayloadStatus={observeRawJsonPayload}
        onOpenChange={(open) => (rawJsonDialogOpen = open)}
    />

    <PostRepostFeedback result={repostResult} saveFailure={repostSaveFailure} pending={repostPending}
        anchor={postHistoryHeadingElement} anchorRightOffset={16} onRetrySave={onRetryRepostSave} />
</div>


<FloatingMessage
    show={show && !fullScan.state.open && !jsonlExport.running && !!headingStatusMessageKey && !syncToastExpired}
    fadeOutDuration={canAutoHideSyncToast ? 200 : 0}
    variant="anchor-center"
    anchor={postHistoryHeadingElement}
    showInfoIcon={!history.showStatusLoader}
>
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
            customClass={`status-loading-placeholder post-history-heading-status-placeholder${
                headingStatusError ? " status-error" : ""
            }`}
        />
    {/if}
</FloatingMessage>

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
    onConfirm={handleLocalHistoryDeleteConfirm}
    onCancel={handleLocalHistoryDeleteCancel}
    closeOnConfirm={false}
    preventCloseWhileConfirming={true}
    showConfirmSpinner={true}
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

<FloatingMessage
    show={showBroadcastFloatingMessage}
    x={broadcastFloatingMessageX}
    y={broadcastFloatingMessageY}
>
    <div>{$_(broadcastFloatingMessageKey)}</div>
</FloatingMessage>

<FloatingMessage show={jsonlExport.showMessage} variant="top-right">
    <div>
        {$_(jsonlExport.messageKey, {
            values: jsonlExport.messageValues,
        })}
    </div>
</FloatingMessage>

{/if}


{#snippet repostRecordMenu(record: PostHistoryRecord, menuKey: string)}
    <PostEventMenu open={postActionUi.isPostMenuOpen(menuKey)} onOpenChange={(open) => setExclusivePostMenuOpen(menuKey, open)} post={record} owner={pubkeyHex} {rxNostr} {relayConfig} operations={eventOperations} active={() => show && !destroyed}
        triggerLabel={$_(isRepostOuterKind(record.kind) ? "repost.outerActions" : "repost.targetActions")} onDelete={() => openDeleteConfirm(record)} onRequestRepost={() => void handleRepost(record)} onRefresh={() => postHistoryThreadGraph.refreshRelatedEvents(record)}
        onRepost={onRepostPost} {repostPending} />
{/snippet}

<style>
    .post-history-tab-content { position: relative; display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden; width: 100%; }
    .post-history-heading {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        width: 100%;
        height: 48px;
        min-height: 48px;
        flex: 0 0 48px;
        overflow: hidden;
        padding: 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading-main {
        display: flex;
        align-items: center;
        flex: 1 1 auto;
        min-width: 0;
        align-self: stretch;
        gap: 4px;
    }

    .post-history-current-month-heading {
        display: flex;
        align-items: center;
        flex: 0 1 auto;
        min-width: 0;
        height: 100%;
        margin: 0;
    }

    .post-history-current-month {
        display: block;
        color: var(--text-light);
        font-size: 1.75rem;
        line-height: 1.05;
        font-weight: 600;
        letter-spacing: -0.04em;
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left:12px;
    }

    :global(.post-history-heading-action-button) {
        width: 50px;
        height: 50px;
        min-width: 50px;
        min-height: 50px;
        flex: 0 0 50px;
        padding: 0;
        border: 0;
        color: var(--text-muted);
        background-color: var(--dialog-bg);
        --btn-bg: var(--dialog-bg);
    }

    :global(.post-history-heading-action-button .svg-icon) {
        width: 22px;
        height: 22px;
        background-color: currentColor;
        --svg: currentColor;
    }

    :global(
            .post-history-heading-refetch-button .svg-icon,
            .post-history-heading-search-button .svg-icon
        ) {
        width: 24px;
        height: 24px;
    }

    :global(.post-history-heading-calendar-button .calendar-icon) {
        mask-image: url("/icons/calendar_today_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-heading-refetch-button:disabled) {
        opacity: 0.45;
    }

    .post-history-heading-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 0;
        gap: 0;
        white-space: nowrap;
    }

    :global(
            .post-history-action-button,
            .post-history-thread-toggle-button
        ) {
        color: var(--btn-post-preview-action);
    }

    :global(
            .post-history-action-button .svg-icon,
            .post-history-thread-toggle-button .svg-icon
        ) {
        --svg: currentColor;
    }

    :global(.post-history-menu-summary) {
        padding: 8px 12px 4px;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.35;
        user-select: text;
    }

    .post-history-summary-line {
        overflow-wrap: anywhere;
    }

    .post-history-summary-count {
        flex: 0 0 auto;
        white-space: nowrap;
        text-align: end;
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

    .post-history-search-input-wrapper {
        position: relative;
        flex: 1 1 auto;
        min-width: 0;
        border: 1px solid var(--border-soft);
        background: var(--background);
        color: var(--text);
        font: inherit;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-search-leading {
        display: flex;
        position: absolute;
        inset: 0 auto 0 0;
        width: 40px;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        pointer-events: none;
    }

    :global(.post-history-search-leading .search-icon),
    :global(.post-history-search-leading .inline-spinner) {
        width: 24px;
        height: 24px;
    }

    :global(.post-history-search-leading .loading-placeholder) {
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
    }

    .post-history-search-active {
        border-bottom-color: color-mix(
            in srgb,
            var(--theme),
            var(--border-hr) 55%
        );
    }

    .post-history-search-input {
        display: block;
        width: 100%;
        min-width: 0;
        padding: 10px 12px 10px 40px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
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

    .post-history-search-bottom-spacer {
        /* Clear the 50px return-to-latest button and its 12px bottom inset. */
        height: 62px;
    }

    .post-history-auto-load-sentinel {
        display: grid;
        width: 100%;
        min-height: 24px;
        place-items: center;
    }

    .post-history-auto-load-slot {
        display: grid;
        height: 24px;
        min-height: 24px;
        place-items: center;
    }

    .post-history-auto-load-newer-slot:not(.post-history-auto-load-newer-slot-reserved) {
        height: 0;
        min-height: 0;
    }

    :global(.post-history-nav-button.primary) {
        opacity: 1;
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
        inset: auto 16px 12px auto;
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

    .post-history-container.post-history-auto-load-enabled {
        overflow-anchor: none;
    }

    .empty-state {
        display: grid;
        gap: 8px;
        min-height: 100px;
        align-content: center;
    }

    .post-history-list-loading {
        display: grid;
        min-height: 100px;
        place-items: center;
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
        max-width: min(38vw, 240px);
        min-width: 0;
        overflow: hidden;
        flex: 0 1 auto;
        white-space: nowrap;
        column-gap: 0;
        color: var(--text-muted);
        font-size: 0.8rem;
        line-height: 1.3;
        height: auto;
    }

    :global(.post-history-heading-status-placeholder) {
        color: var(--svg);
    }

    :global(.status-loading-placeholder .loader-container) {
        :global(.square) {
            background: currentColor;
        }
    }

    :global(.status-loading-placeholder .placeholder-text) {
        color: inherit;
        font-size: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :global(.status-error) {
        color: var(--danger);
    }

    :global(.post-history-heading-status-placeholder.status-error) {
        color: var(--svg);
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

    .post-history-item-deleted .post-preview-body {
        opacity: 0.65;
    }

    .post-history-main {
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        min-width: 0;
        gap: 2px;
    }

    :global(.post-history-menu-content .menu-action-button .calendar-icon) {
        mask-image: url("/icons/calendar_today_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .find_in_page-icon) {
        mask-image: url("/icons/find_in_page_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .broadcast-icon) {
        mask-image: url("/icons/cell_tower_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .raw-json-icon) {
        mask-image: url("/icons/data_object_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .export-icon) {
        mask-image: url("/icons/upload_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .import-icon) {
        mask-image: url("/icons/download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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

    .post-preview-body {
        display: flex;
        flex-direction: column;
        padding-inline-start: 1rem;
        gap: 4px;
    }

    :global(.post-history-thread-toggle-button.selected) {
        --btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));
        color: var(--text-light);
    }

    @media (hover: hover) and (pointer: fine) {
        :global(
                .post-history-thread-toggle-button.selected:hover:not(:disabled)
            ) {
            background-color: light-dark(
                color-mix(in srgb, var(--dialog-bg), black 20%),
                color-mix(in srgb, var(--dialog-bg), white 30%)
            );
            color: light-dark(
                color-mix(in srgb, var(--text), black 20%),
                color-mix(in srgb, var(--text), white 30%)
            );
        }
    }

    .delete-confirm-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        margin: 10px 0 30px 0;
        margin-inline: auto;
        text-align: start;
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

    .search-icon {
        mask-image: url("/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-search-close) .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .repair-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-saved-boundary,
    .post-history-sparse-state {
        display: grid;
        gap: 8px;
        margin: 16px 0;
        padding: 12px;
        border: 1px solid var(--border-hr);
        border-radius: 10px;
        color: var(--text-muted);
        background: color-mix(in srgb, var(--bg-input) 72%, transparent);
    }

    .post-history-saved-boundary {
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
    }

    .post-history-saved-boundary p,
    .post-history-sparse-state p {
        margin: 0;
    }

    .post-history-saved-boundary-actions {
        display: flex;
        width: fit-content;
        max-width: 100%;
        box-sizing: border-box;
        justify-self: center;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
    }

    :global(.post-history-saved-boundary-actions .post-history-nav-button) {
        height: 52px;
    }

    @media (max-width: 600px) {
        .post-history-saved-boundary-actions {
            width: min(100%, 320px);
            flex-direction: column;
            align-items: center;
        }

        :global(.post-history-saved-boundary-actions .post-history-nav-button) {
            width: 100%;
            flex: 0 0 52px;
        }
    }

    .import-icon {
        mask-image: url("/icons/cloud_download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.trash-icon) {
        mask-image: url("/icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

</style>
