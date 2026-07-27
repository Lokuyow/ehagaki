<script lang="ts">
    import { onDestroy } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";
    import { nip19 } from "nostr-tools";
    import type { RxNostr } from "rx-nostr";
    import { Dialog, DropdownMenu } from "bits-ui";
    import Button from "./Button.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import ImageFullscreen from "./ImageFullscreen.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostContentPreview from "./PostContentPreview.svelte";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryPreviewFooter from "./PostHistoryPreviewFooter.svelte";
    import PostHistoryRawJsonDialog from "./PostHistoryRawJsonDialog.svelte";
    import PostPreviewToggleButton from "./PostPreviewToggleButton.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import ChannelPicture from "./ChannelPicture.svelte";
    import {
        createComposerTargetResolver,
        type ComposerResolvedTarget,
        type ComposerTargetResolvePhase,
        type ComposerTargetResolveTask,
        type ComposerTargetResolver,
    } from "../lib/composerTargetResolver";
    import type { ComposerEventTarget } from "../lib/composerTargetApplyController";
    import {
        COMPOSER_TARGET_CHANNEL_ABOUT_PREVIEW_LENGTH,
        getComposerTargetActions,
        limitComposerTargetCollapsedContent,
        parseComposerTargetInput,
        truncateComposerTargetPreview,
        type ComposerTargetAction,
        type ComposerTargetPointer,
    } from "../lib/composerTargetUtils";
    import type { RelayProfileService } from "../lib/relayProfileService";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import type {
        FullscreenMediaItem,
        PostResult,
        RelayConfig,
    } from "../lib/types";
    import { usePostHistoryPreviewCollapse } from "../lib/hooks/usePostHistoryPreviewCollapse.svelte";
    import { usePostContentEmojiState } from "../lib/hooks/usePostContentEmojiState.svelte";
    import { usePostHistoryPostActionUiController } from "../lib/hooks/usePostHistoryPostActionUiController.svelte";
    import { buildPostContentRenderModel } from "../lib/postContentPreview";
    import {
        canRequestPostDeletion,
        postDeletionService,
    } from "../lib/postDeletionService";
    import {
        postBroadcastService,
        resolveBroadcastEvent,
    } from "../lib/postBroadcastService";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils";
    import { sanitizePlainText } from "../lib/utils/domSanitizer";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";

    type DialogPhase =
        | "empty"
        | "parsing"
        | "debouncing"
        | ComposerTargetResolvePhase
        | "ready"
        | "error";

    type ErrorReason =
        | "invalid"
        | "unsupported"
        | "secret-key"
        | "not-found"
        | "timeout"
        | "network"
        | "mismatch"
        | "invalid-event"
        | "channel-unavailable"
        | "nostr-not-ready";

    interface Props {
        show: boolean;
        onClose: () => void;
        onApply: (
            action: ComposerTargetAction,
            target: ComposerEventTarget,
        ) => boolean;
        rxNostr?: RxNostr;
        relayConfig?: RelayConfig | null;
        profileService?: Pick<RelayProfileService, "fetchProfileRealtime">;
        resolver?: ComposerTargetResolver;
        pubkeyHex?: string | null;
    }

    let {
        show,
        onClose,
        onApply,
        rxNostr = undefined,
        relayConfig = null,
        profileService = undefined,
        resolver = createComposerTargetResolver(),
        pubkeyHex = null,
    }: Props = $props();

    let inputValue = $state("");
    let inputElement: HTMLInputElement | null = $state(null);
    let targetPreviewElement: HTMLElement | null = $state(null);
    let phase = $state<DialogPhase>("empty");
    let errorReason = $state<ErrorReason | null>(null);
    let target = $state<ComposerResolvedTarget | null>(null);
    let partialEvent = $state<ComposerResolvedTarget["event"] | null>(null);
    let partialAuthorProfile =
        $state<ComposerResolvedTarget["authorProfile"]>(null);
    let retryRevision = $state(0);
    let generation = 0;
    let debounceId: ReturnType<typeof setTimeout> | undefined;
    let activeTask: ComposerTargetResolveTask | null = null;
    let fullscreenMediaItems = $state<FullscreenMediaItem[]>([]);
    let fullscreenIndex = $state(-1);
    let showImageFullscreen = $state(false);
    const postActionUi =
        usePostHistoryPostActionUiController<PostHistoryRecord>();
    let rawJsonDialogOpen = $state(false);
    let selectedRawEvent = $state<unknown>(null);
    let broadcastRequestState = $state<"sending" | undefined>(undefined);
    let deleteRequestState = $state<"sending" | "failed" | undefined>(
        undefined,
    );
    let showBroadcastFloatingMessage = $state(false);
    let broadcastFloatingMessageX = $state(0);
    let broadcastFloatingMessageY = $state(0);
    let broadcastFloatingMessageKey = $state<
        | "postHistory.broadcastSent"
        | "postHistory.broadcastPartial"
        | "postHistory.broadcastFailed"
    >("postHistory.broadcastSent");
    let broadcastFloatingMessageTimeout:
        | ReturnType<typeof setTimeout>
        | undefined;
    let lastBroadcastPointerPosition = $state<
        { eventId: string; x: number; y: number } | undefined
    >(undefined);

    let targetActions = $derived(
        target
            ? getComposerTargetActions(
                  target.event.kind,
                  target.event.kind === 1 || !!target.channelQuery,
              )
            : [],
    );
    let previewEvent = $derived(target?.event ?? partialEvent);
    let previewPostedAt = $derived(
        previewEvent ? previewEvent.created_at * 1000 : 0,
    );
    let targetPost = $derived.by(() =>
        target ? buildTargetPostHistoryRecord(target) : null,
    );
    let canBroadcastTargetPost = $derived(
        targetPost ? resolveBroadcastEvent(targetPost) !== null : false,
    );
    let canDeleteTargetPost = $derived(
        targetPost ? canRequestPostDeletion(targetPost, pubkeyHex) : false,
    );
    let authorProfile = $derived(target?.authorProfile ?? partialAuthorProfile);
    let authorDisplay = $derived.by(() => {
        const pubkey = previewEvent?.pubkey;
        if (!pubkey) return "";
        return (
            authorProfile?.displayName?.trim() ||
            authorProfile?.name?.trim() ||
            shortenMiddle(nip19.npubEncode(pubkey), 12, 4)
        );
    });
    let rawPreviewContent = $derived.by(() => {
        const content = previewEvent?.content;
        if (!content || previewEvent?.kind === 40) return "";
        return content;
    });
    let collapsedContent = $derived(
        limitComposerTargetCollapsedContent(rawPreviewContent),
    );
    let previewCollapsePosts = $derived.by(() =>
        previewEvent && rawPreviewContent
            ? [
                  {
                      eventId: previewEvent.id,
                      content: collapsedContent.content,
                      forceCollapsible:
                          collapsedContent.exceedsRenderLimit,
                  },
              ]
            : [],
    );
    const previewCollapse = usePostHistoryPreviewCollapse({
        getShow: () => show,
        getPosts: () => previewCollapsePosts,
        getContainer: () => targetPreviewElement,
    });
    const previewCollapseAction = previewCollapse.previewRef;
    let previewCollapsePost = $derived(previewCollapsePosts[0]);
    let isPreviewExpanded = $derived(
        previewCollapsePost
            ? previewCollapse.isPostExpanded(previewCollapsePost)
            : false,
    );
    let displayedContent = $derived.by(() =>
        sanitizePlainText(
            isPreviewExpanded
                ? rawPreviewContent
                : collapsedContent.content,
        ),
    );
    let sourcePreviewRenderModel = $derived.by(() =>
        previewEvent?.kind === 40
            ? buildPostContentRenderModel({
                  sourceContent: "",
                  displayContent: "",
                  tags: [],
                  media: [],
              })
            : buildPostContentRenderModel({
                  sourceContent: rawPreviewContent,
                  tags: previewEvent?.tags ?? [],
              }),
    );
    let previewRenderModel = $derived.by(() => {
        if (displayedContent === rawPreviewContent) {
            return sourcePreviewRenderModel;
        }

        return buildPostContentRenderModel({
            sourceContent: rawPreviewContent,
            displayContent: sourcePreviewRenderModel.hasRenderableText
                ? displayedContent
                : "",
            tags: previewEvent?.tags ?? [],
            media: sourcePreviewRenderModel.media,
        });
    });
    let hasCollapsiblePreviewText = $derived(
        sourcePreviewRenderModel.hasRenderableText,
    );
    let shouldCollapsePreviewText = $derived(
        !!previewCollapsePost &&
            hasCollapsiblePreviewText &&
            previewCollapse.shouldCollapsePost(previewCollapsePost),
    );
    let previewContentId = $derived(
        previewEvent ? `composer-target-preview-content-${previewEvent.id}` : "",
    );
    let channelAbout = $derived.by(() => {
        const about = target?.channelContext?.about;
        if (!about) return "";
        return truncateComposerTargetPreview(
            sanitizePlainText(about),
            COMPOSER_TARGET_CHANNEL_ABOUT_PREVIEW_LENGTH,
        );
    });
    let channelDisplayName = $derived.by(() => {
        const context = target?.channelContext;
        if (!context) return "";
        return (
            context.name?.trim() ||
            `ID: ${shortenMiddle(context.eventId, 12, 8)}`
        );
    });
    let channelCreatorDisplay = $derived.by(() => {
        const pubkey = target?.channelCreatorPubkey;
        if (!pubkey) return "";
        return (
            target?.channelCreatorProfile?.displayName?.trim() ||
            target?.channelCreatorProfile?.name?.trim() ||
            shortenMiddle(nip19.npubEncode(pubkey), 12, 4)
        );
    });
    let statusText = $derived(resolveStatusText());
    let canRetry = $derived(
        errorReason === "not-found" ||
            errorReason === "timeout" ||
            errorReason === "network" ||
            errorReason === "channel-unavailable" ||
            errorReason === "nostr-not-ready",
    );
    let isLoading = $derived(
        phase === "debouncing" ||
            phase === "event-loading" ||
            phase === "channel-loading" ||
            phase === "profile-loading",
    );
    const emojiState = usePostContentEmojiState({
        getShow: () => show && previewRenderModel.previewContent.emojiUrls.length > 0,
        getEmojiUrls: () => previewRenderModel.previewContent.emojiUrls,
        onStateChanged: () => previewCollapse.remeasure(),
    });

    function clearAsyncWork(): void {
        if (debounceId !== undefined) {
            clearTimeout(debounceId);
            debounceId = undefined;
        }
        activeTask?.cancel();
        activeTask = null;
    }

    function hideBroadcastFloatingMessage(): void {
        if (broadcastFloatingMessageTimeout !== undefined) {
            clearTimeout(broadcastFloatingMessageTimeout);
            broadcastFloatingMessageTimeout = undefined;
        }
        showBroadcastFloatingMessage = false;
        lastBroadcastPointerPosition = undefined;
    }

    function resetTargetActionUiState(): void {
        postActionUi.reset();
        rawJsonDialogOpen = false;
        selectedRawEvent = null;
        broadcastRequestState = undefined;
        deleteRequestState = undefined;
        hideBroadcastFloatingMessage();
    }

    function resetState(): void {
        generation += 1;
        clearAsyncWork();
        inputValue = "";
        phase = "empty";
        errorReason = null;
        target = null;
        partialEvent = null;
        partialAuthorProfile = null;
        retryRevision = 0;
        resetTargetActionUiState();
        emojiState.resetState();
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        showImageFullscreen = false;
    }

    function resolveStatusText(): string {
        if (phase === "parsing") return $_("composerTarget.parsing");
        if (phase === "debouncing" || phase === "event-loading") {
            return $_("composerTarget.checking");
        }
        if (phase === "channel-loading") {
            return $_("composerTarget.channelLoading");
        }
        if (phase === "profile-loading") {
            return $_("composerTarget.profileLoading");
        }
        if (!errorReason) return "";
        if (errorReason === "unsupported")
            return $_("composerTarget.unsupportedFormat");
        if (errorReason === "secret-key") return $_("composerTarget.secretKey");
        if (errorReason === "invalid")
            return $_("composerTarget.invalidFormat");
        if (errorReason === "not-found") return $_("composerTarget.notFound");
        if (errorReason === "timeout") return $_("composerTarget.timeout");
        if (errorReason === "mismatch") return $_("composerTarget.mismatch");
        if (errorReason === "channel-unavailable") {
            return $_("composerTarget.channelUnavailable");
        }
        return $_("composerTarget.fetchFailed");
    }

    async function runResolve(
        pointer: ComposerTargetPointer,
        runGeneration: number,
    ): Promise<void> {
        if (!rxNostr) {
            if (generation === runGeneration) {
                phase = "error";
                errorReason = "nostr-not-ready";
            }
            return;
        }

        activeTask = resolver.resolve({
            pointer,
            rxNostr,
            relayConfig,
            profileService,
            onPhase: (nextPhase) => {
                if (generation === runGeneration) phase = nextPhase;
            },
        });
        const result = await activeTask.promise;
        if (generation !== runGeneration || result.status === "cancelled")
            return;
        activeTask = null;

        if (result.status === "resolved") {
            target = result.target;
            partialEvent = null;
            partialAuthorProfile = null;
            phase = "ready";
            errorReason = null;
            return;
        }

        partialEvent = result.event ?? null;
        partialAuthorProfile = result.authorProfile ?? null;
        phase = "error";
        errorReason = result.reason;
    }

    function handleRetry(): void {
        retryRevision += 1;
    }

    function handleApply(action: ComposerTargetAction): void {
        if (!target) return;
        const applied = onApply(action, {
            source: "manual",
            kind: target.event.kind,
            eventId: target.event.id,
            relayHints: [...target.relayHints],
            authorPubkey: target.event.pubkey,
            event: target.event,
            channelQuery: target.channelQuery,
        });
        if (applied) handleClose();
    }

    function buildTargetPostHistoryRecord(
        resolvedTarget: ComposerResolvedTarget,
    ): PostHistoryRecord {
        const event = resolvedTarget.event;
        const now = Date.now();
        const channelRelayHints =
            event.kind === 42 &&
            resolvedTarget.channelContext?.channelRelays?.length
                ? [...resolvedTarget.channelContext.channelRelays]
                : undefined;

        return {
            id: event.id,
            eventId: event.id,
            pubkeyHex: event.pubkey,
            kind: event.kind,
            content: event.content,
            tags: event.tags.map((tag) => [...tag]),
            createdAt: event.created_at,
            postedAt: event.created_at * 1000,
            relayHints: [...resolvedTarget.relayHints],
            acceptedRelays: [],
            media: [],
            rawEvent: event,
            ...(channelRelayHints ? { channelRelayHints } : {}),
            updatedAt: now,
            schemaVersion: 1,
        };
    }

    function setTargetMenuOpen(eventId: string, open: boolean): void {
        if (open) postActionUi.closeAllPostItemMenus();
        postActionUi.setPostMenuOpen(eventId, open);
    }

    function openRawJson(rawEvent: unknown): void {
        postActionUi.closeAllPostItemMenus();
        selectedRawEvent = rawEvent;
        rawJsonDialogOpen = true;
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

        const targetElement = event.currentTarget;
        const rect =
            targetElement instanceof HTMLElement
                ? targetElement.getBoundingClientRect()
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
        hideBroadcastFloatingMessage();
        broadcastFloatingMessageX = position.x;
        broadcastFloatingMessageY = position.y;
        broadcastFloatingMessageKey = !result.success
            ? "postHistory.broadcastFailed"
            : (result.rejectedRelays?.length ?? 0) > 0 ||
                (result.timedOutRelays?.length ?? 0) > 0
              ? "postHistory.broadcastPartial"
              : "postHistory.broadcastSent";
        showBroadcastFloatingMessage = true;
        broadcastFloatingMessageTimeout = setTimeout(() => {
            showBroadcastFloatingMessage = false;
            broadcastFloatingMessageTimeout = undefined;
        }, 1800);
    }

    async function handleBroadcastPost(
        post: PostHistoryRecord,
        event: Event,
    ): Promise<void> {
        if (broadcastRequestState === "sending") return;

        const startedGeneration = generation;
        const startedEventId = post.eventId;
        const messagePosition = getBroadcastFloatingMessagePosition(post, event);
        broadcastRequestState = "sending";
        const result = await postBroadcastService.broadcast({ post, rxNostr });
        if (
            generation !== startedGeneration ||
            target?.event.id !== startedEventId
        ) {
            return;
        }

        broadcastRequestState = undefined;
        showBroadcastResultMessage(messagePosition, result);
    }

    function openDeleteConfirm(post: PostHistoryRecord): void {
        if (!canRequestPostDeletion(post, pubkeyHex)) return;
        postActionUi.openDeleteConfirm(post);
    }

    function handleDeleteCancel(): void {
        postActionUi.cancelDeleteConfirm();
    }

    async function handleDeleteConfirm(): Promise<void> {
        const post = postActionUi.deleteTargetPost;
        if (!post || deleteRequestState === "sending") return;

        const startedGeneration = generation;
        const startedEventId = post.eventId;
        deleteRequestState = "sending";
        const result = await postDeletionService.requestDeletion({
            post,
            rxNostr,
        });
        if (
            generation !== startedGeneration ||
            target?.event.id !== startedEventId
        ) {
            return;
        }

        postActionUi.setDeleteConfirmOpen(false);
        if (result.success) {
            deleteRequestState = undefined;
            handleClose();
            return;
        }

        deleteRequestState = "failed";
    }

    function handleClose(): void {
        resetState();
        onClose();
    }

    function handleClearInput(): void {
        if (inputValue.trim().length === 0) {
            return;
        }
        inputValue = "";
        inputElement?.focus({ preventScroll: true });
    }

    function handleOpenAutoFocus(event: Event): void {
        event.preventDefault();
        inputElement?.focus({ preventScroll: true });
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

    function handleDialogEscapeKeydown(event: KeyboardEvent): void {
        if (showImageFullscreen) {
            event.preventDefault();
        }
    }

    function handleImageOpen(params: {
        index: number;
        mediaList: FullscreenMediaItem[];
    }): void {
        fullscreenMediaItems = params.mediaList;
        fullscreenIndex = params.index;
        showImageFullscreen = true;
    }

    function handleFullscreenClose(): void {
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
    }

    function handleFullscreenNavigate(index: number): void {
        fullscreenIndex = index;
    }

    $effect(() => {
        if (!show) {
            resetState();
        }
    });

    $effect(() => {
        if (!show) return;
        const rawInput = inputValue;
        retryRevision;
        const runGeneration = ++generation;
        clearAsyncWork();
        resetTargetActionUiState();
        target = null;
        partialEvent = null;
        partialAuthorProfile = null;
        errorReason = null;
        phase = "parsing";
        const parsed = parseComposerTargetInput(rawInput);

        if (parsed.status === "empty") {
            phase = "empty";
            return;
        }
        if (parsed.status === "unsupported") {
            phase = "error";
            errorReason = "unsupported";
            return;
        }
        if (parsed.status === "secret-key") {
            phase = "error";
            errorReason = "secret-key";
            return;
        }
        if (parsed.status === "invalid") {
            phase = "error";
            errorReason = "invalid";
            return;
        }

        const pointer = parsed.pointer;
        phase = "debouncing";
        debounceId = setTimeout(() => {
            debounceId = undefined;
            void runResolve(pointer, runGeneration);
        }, 250);

        return () => {
            if (debounceId !== undefined) {
                clearTimeout(debounceId);
                debounceId = undefined;
            }
        };
    });

    onDestroy(() => {
        generation += 1;
        clearAsyncWork();
        hideBroadcastFloatingMessage();
    });
</script>

<DialogWrapper
    open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("composerTarget.title")}
    description={$_("composerTarget.description")}
    contentClass="composer-target-dialog"
    footerVariant="close-button"
    onOpenAutoFocus={handleOpenAutoFocus}
    onInteractOutside={handleDialogInteractOutside}
    onEscapeKeydown={handleDialogEscapeKeydown}
>
    <div class="composer-target-content">
        <h2>{$_("composerTarget.title")}</h2>
        <label class="target-input-label" for="composer-target-input">
            {$_("composerTarget.inputLabel")}
        </label>
        <div class="composer-target-input-shell">
            <input
                id="composer-target-input"
                bind:this={inputElement}
                bind:value={inputValue}
                type="text"
                inputmode="text"
                autocomplete="off"
                spellcheck="false"
                placeholder={$_("composerTarget.placeholder")}
            />
            {#if inputValue.trim().length > 0}
                <Button
                    type="button"
                    className="composer-target-clear-button"
                    variant="default"
                    shape="square"
                    contentLayout="icon"
                    ariaLabel={$_("composerTarget.clearInput")}
                    onClick={handleClearInput}
                    onmousedown={preventKeyboardFocusChange}
                    ontouchstart={preventKeyboardFocusChange}
                >
                    <div
                        class="clear-input-icon svg-icon"
                        aria-hidden="true"
                    ></div>
                </Button>
            {/if}
        </div>

        {#if statusText}
            <div
                class="target-status"
                class:error={phase === "error"}
                aria-live="polite"
            >
                {#if isLoading}
                    <LoadingPlaceholder
                        showLoader={true}
                        text={statusText}
                        customClass="composer-target-loading"
                    />
                {:else}
                    <p>{statusText}</p>
                {/if}
                {#if canRetry}
                    <Button onClick={handleRetry}>
                        {$_("postHistory.contextRetry")}
                    </Button>
                {/if}
            </div>
        {/if}

        {#if previewEvent}
            <section
                bind:this={targetPreviewElement}
                class="target-preview"
                aria-label={$_("composerTarget.preview")}
            >
                <div class="target-preview-body">
                    <div class="event-author">
                    <ProfileAvatar
                        src={authorProfile?.picture ?? ""}
                        alt=""
                        rootClassName="composer-target-avatar"
                        imageClassName="composer-target-avatar-image"
                        fallbackClassName="composer-target-avatar-fallback"
                        fallbackAriaLabel=""
                    />
                    <span>{authorDisplay}</span>
                    <span class="event-kind">kind {previewEvent.kind}</span>
                    </div>
                    <PostContentPreview
                    model={previewRenderModel}
                    density="dialog"
                    emojiLoadStateByUrl={emojiState.emojiLoadStateByUrl}
                    emojiImageMetaByUrl={emojiState.emojiImageMetaByUrl}
                    {previewContentId}
                    contentClass="event-content"
                    collapsedContentClass="event-content-collapsed"
                    renderWhenEmpty={shouldCollapsePreviewText}
                    isTextCollapsed={previewRenderModel.hasRenderableText &&
                        !isPreviewExpanded &&
                        shouldCollapsePreviewText}
                    {previewCollapseAction}
                    previewCollapseEventId={previewEvent.id}
                    onImageOpen={handleImageOpen}
                >
                    {#snippet betweenContentAndMedia()}
                        {#if previewCollapsePost && shouldCollapsePreviewText}
                            {#if !previewRenderModel.hasRenderableText}
                                <span
                                    id={previewContentId}
                                    hidden
                                    aria-hidden="true"
                                ></span>
                            {/if}
                            <PostPreviewToggleButton
                                expanded={isPreviewExpanded}
                                controls={previewContentId}
                                onToggle={() =>
                                    previewCollapse.togglePostExpanded(
                                        previewCollapsePost.eventId,
                                    )}
                            />
                        {/if}
                    {/snippet}
                    </PostContentPreview>

                    {#if target?.channelContext}
                        <div class="channel-preview">
                        {#if target.channelContext.picture}
                            <ChannelPicture
                                eventId={target.channelContext.eventId}
                                pictureUrl={target.channelContext.picture}
                                cacheEligible={target.channelPictureCacheEligible}
                                alt=""
                                className="channel-picture"
                            />
                        {/if}
                        <div class="channel-text">
                            <strong class="channel-name">
                                {channelDisplayName}
                            </strong>
                            {#if channelAbout}<p>{channelAbout}</p>{/if}
                            {#if channelCreatorDisplay}
                                <span class="channel-creator">
                                    {$_("composerTarget.creator")}:
                                    {channelCreatorDisplay}
                                </span>
                            {/if}
                            {#if target.channelContext.channelRelays?.length}
                                <span class="channel-relays">
                                    {target.channelContext.channelRelays.join(
                                        "\n",
                                    )}
                                </span>
                            {/if}
                        </div>
                        </div>
                    {/if}

                    {#if deleteRequestState === "failed" && target}
                        <p class="delete-failed">
                            {$_("postHistory.deleteFailed")}
                        </p>
                    {/if}
                </div>

                <PostHistoryPreviewFooter
                    formattedDate={formatPostedAt(previewPostedAt)}
                >
                    {#snippet actions()}
                        {#if target}
                            {#if targetActions.includes("reply")}
                                <div class="post-preview-action-buttons-group">
                                    <Button
                                        type="button"
                                        class="post-preview-action-button post-history-action-button"
                                        ariaLabel={$_("replyQuote.reply_label")}
                                        contentLayout="icon"
                                        shape="circle"
                                        onClick={() => handleApply("reply")}
                                    >
                                        <div
                                            class="reply-icon svg-icon"
                                            aria-hidden="true"
                                        ></div>
                                    </Button>
                                    <div class="post-preview-footer-replies-slot"></div>
                                </div>
                            {/if}
                            {#if targetActions.includes("quote")}
                                <Button
                                    type="button"
                                    class="post-preview-action-button post-history-action-button"
                                    ariaLabel={$_("replyQuote.quote_label")}
                                    contentLayout="icon"
                                    shape="circle"
                                    onClick={() => handleApply("quote")}
                                >
                                    <div
                                        class="quote-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                </Button>
                                <div class="post-preview-footer-reaction-slot"></div>
                            {/if}
                            {#if targetActions.includes("channel")}
                                <Button
                                    type="button"
                                    class="post-preview-action-button post-history-action-button"
                                    ariaLabel={$_("composerTarget.post")}
                                    contentLayout="icon"
                                    shape="circle"
                                    onClick={() => handleApply("channel")}
                                >
                                    <div
                                        class="post-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                </Button>
                            {/if}
                        {/if}
                    {/snippet}
                    {#snippet trailing()}
                        {#if targetPost}
                            {@const post = targetPost}
                            <PostHistoryActionMenu
                                open={postActionUi.isPostMenuOpen(
                                    post.eventId,
                                )}
                                onOpenChange={(open) =>
                                    setTargetMenuOpen(post.eventId, open)}
                                triggerAriaLabel="アクションを表示"
                                timestamp={formatPostedAtExact(
                                    post.postedAt,
                                    $locale,
                                )}
                            >
                                {#snippet items()}
                                    <DropdownMenu.Item
                                        class="menu-action-button"
                                        onSelect={() =>
                                            openRawJson(post.rawEvent)}
                                    >
                                        <div
                                            class="raw-json-icon svg-icon"
                                            aria-hidden="true"
                                        ></div>
                                        <span>{$_("postHistory.rawJson")}</span>
                                    </DropdownMenu.Item>
                                    {#if canBroadcastTargetPost}
                                        <DropdownMenu.Item
                                            class="menu-action-button"
                                            disabled={broadcastRequestState ===
                                                "sending"}
                                            onpointerdown={(event) =>
                                                captureBroadcastPointerPosition(
                                                    post,
                                                    event,
                                                )}
                                            onSelect={(event) =>
                                                void handleBroadcastPost(
                                                    post,
                                                    event,
                                                )}
                                        >
                                            <div
                                                class="broadcast-icon svg-icon"
                                                aria-hidden="true"
                                            ></div>
                                            <span>{$_("postHistory.broadcast")}</span>
                                        </DropdownMenu.Item>
                                    {/if}
                                    {#if canDeleteTargetPost}
                                        <DropdownMenu.Separator
                                            class="post-history-menu-separator"
                                        />
                                        <DropdownMenu.Item
                                            class="menu-action-button menu-action-button-danger"
                                            disabled={deleteRequestState ===
                                                "sending"}
                                            onSelect={() =>
                                                openDeleteConfirm(post)}
                                        >
                                            <div
                                                class="trash-icon svg-icon"
                                                aria-hidden="true"
                                            ></div>
                                            <span>
                                                {deleteRequestState === "sending"
                                                    ? $_("postHistory.deleteSending")
                                                    : $_("postHistory.delete")}
                                            </span>
                                        </DropdownMenu.Item>
                                    {/if}
                                {/snippet}
                            </PostHistoryActionMenu>
                        {/if}
                    {/snippet}
                </PostHistoryPreviewFooter>
            </section>
        {/if}

        {#if target && target.event.kind !== 1 && target.event.kind !== 40 && target.event.kind !== 42}
            <p class="unsupported-kind">
                {$_("composerTarget.unsupportedKind")}
            </p>
        {/if}

    </div>

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

<PostHistoryRawJsonDialog
    open={rawJsonDialogOpen}
    rawEvent={selectedRawEvent}
    onOpenChange={(open) => (rawJsonDialogOpen = open)}
/>

<ConfirmDialog
    open={postActionUi.deleteConfirmOpen}
    onOpenChange={postActionUi.setDeleteConfirmOpen}
    title={$_("postHistory.deleteRequestTitle")}
    description={$_("postHistory.deleteRequestDescription")}
    confirmLabel={deleteRequestState === "sending"
        ? $_("postHistory.deleteSending")
        : $_("postHistory.deleteConfirm")}
    cancelLabel={$_("postHistory.deleteCancel")}
    confirmVariant="danger"
    confirmDisabled={deleteRequestState === "sending"}
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
    show={showBroadcastFloatingMessage}
    x={broadcastFloatingMessageX}
    y={broadcastFloatingMessageY}
>
    <div>{$_(broadcastFloatingMessageKey)}</div>
</FloatingMessage>

<style>
    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    :global(.composer-target-dialog) {
        max-width: 560px;
    }

    @media (max-width: 600px) {
        :global(.composer-target-dialog) {
            top: 0;
            translate:
                -50%
                max(
                    calc(
                        var(--mobile-dialog-viewport-top) +
                            env(safe-area-inset-top, 0px) + 12px
                    ),
                    calc(var(--mobile-dialog-center-y) - 50%)
                );
            width: calc(100% - 24px);
            max-height: calc(
                var(--mobile-dialog-viewport-height) -
                    env(safe-area-inset-top, 0px) -
                    env(safe-area-inset-bottom, 0px) -
                    24px
            );
        }

        :global(.composer-target-dialog .dialog-content) {
            min-height: 0;
            max-height: none;
            flex: 1 1 auto;
            overflow-y: auto;
        }

        :global(.composer-target-dialog .dialog-footer) {
            flex: 0 0 auto;
        }
    }

    .composer-target-content {
        display: grid;
        gap: 10px;
        width: 100%;
    }

    h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .target-input-label {
        font-weight: 600;
    }

    .composer-target-input-shell {
        position: relative;
    }

    input {
        width: 100%;
        min-height: 50px;
        padding: 8px 49px 8px 10px;
        border: 1px solid var(--border);
        background: var(--bg-input);
        color: var(--text);
        font: inherit;
    }

    :global(.composer-target-clear-button) {
        position: absolute;
        inset-block: 50%;
        inset-inline-end: 2px;
        transform: translateY(-50%);
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--text-muted);
        z-index: 1;
    }

    :global(.composer-target-clear-button:hover:not(:disabled)),
    :global(.composer-target-clear-button:focus-visible) {
        background-color: var(--button-hover-bg);
        color: var(--button-hover-color);
    }

    :global(.composer-target-clear-button:focus-visible) {
        outline: 2px solid var(--theme);
        outline-offset: 2px;
    }

    :global(.composer-target-clear-button .svg-icon) {
        --svg: currentColor;
        width: 24px;
        height: 24px;
    }

    .clear-input-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .target-status p,
    .channel-preview p,
    .unsupported-kind {
        margin: 0;
    }

    .event-kind,
    .channel-creator,
    .channel-relays {
        color: var(--text-muted);
        font-size: 0.85rem;
    }

    .target-status {
        display: grid;
        gap: 8px;
        color: var(--text-muted);
    }

    .target-status.error {
        color: var(--danger);
    }

    :global(.composer-target-loading) {
        justify-content: flex-start;
        padding: 0;
    }

    .target-preview {
        display: grid;
        border: 1px solid var(--border-hr);
        background: var(--bg-input);
    }

    :global(.target-preview .post-preview-footer) {
        --post-history-preview-footer-surface: var(--bg-input);
    }

    .target-preview-body {
        display: grid;
        gap: 10px;
        padding: 12px;
    }

    .event-author {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .event-author > span:first-of-type {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .event-kind {
        margin-inline-start: auto;
        white-space: nowrap;
    }

    :global(.composer-target-avatar) {
        width: 36px;
        height: 36px;
        flex: 0 0 auto;
    }

    :global(.composer-target-avatar-image),
    :global(.composer-target-avatar-fallback) {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    :global(.target-preview .event-content),
    .channel-preview p {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.45;
    }

    :global(.target-preview .event-content-collapsed) {
        max-height: calc(5 * 1.45em);
        overflow: hidden;
    }

    .channel-preview {
        display: flex;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border-hr);
    }

    :global(.channel-preview .channel-picture) {
        width: 48px;
        height: 48px;
        flex: 0 0 auto;
        object-fit: cover;
    }

    .channel-text {
        display: grid;
        gap: 4px;
        min-width: 0;
    }

    .channel-name {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .channel-relays {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
    }

    .delete-failed {
        margin: 0;
        color: var(--danger);
    }

    .delete-confirm-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        margin: 10px 0 30px;
        margin-inline: auto;
        text-align: start;
    }

    .delete-confirm-description,
    .delete-confirm-warning {
        margin: 0;
        line-height: 1.5;
    }

    .delete-confirm-warning {
        color: var(--text-light);
        font-size: 0.875rem;
    }

    :global(.target-preview .post-icon) {
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    :global(.post-history-menu-content .menu-action-button .raw-json-icon) {
        mask-image: url("/icons/data_object_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .broadcast-icon) {
        mask-image: url("/icons/cell_tower_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }

    :global(.post-history-menu-content .menu-action-button .trash-icon) {
        mask-image: url("/icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: currentColor;
    }
</style>
