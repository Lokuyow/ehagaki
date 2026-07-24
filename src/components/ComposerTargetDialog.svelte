<script lang="ts">
    import { _ } from "svelte-i18n";
    import { nip19 } from "nostr-tools";
    import type { RxNostr } from "rx-nostr";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
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
        COMPOSER_TARGET_CONTENT_PREVIEW_LENGTH,
        getComposerTargetActions,
        parseComposerTargetInput,
        truncateComposerTargetPreview,
        type ComposerTargetAction,
        type ComposerTargetPointer,
    } from "../lib/composerTargetUtils";
    import type { RelayProfileService } from "../lib/relayProfileService";
    import type { RelayConfig } from "../lib/types";
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
    }

    let {
        show,
        onClose,
        onApply,
        rxNostr = undefined,
        relayConfig = null,
        profileService = undefined,
        resolver = createComposerTargetResolver(),
    }: Props = $props();

    let inputValue = $state("");
    let inputElement: HTMLInputElement | null = $state(null);
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

    let actions = $derived(
        target
            ? getComposerTargetActions(
                  target.event.kind,
                  target.event.kind === 1 || !!target.channelQuery,
              )
            : [],
    );
    let previewEvent = $derived(target?.event ?? partialEvent);
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
    let sanitizedContent = $derived.by(() => {
        const content = previewEvent?.content;
        if (!content || previewEvent?.kind === 40) return "";
        return truncateComposerTargetPreview(
            sanitizePlainText(content),
            COMPOSER_TARGET_CONTENT_PREVIEW_LENGTH,
        );
    });
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

    function clearAsyncWork(): void {
        if (debounceId !== undefined) {
            clearTimeout(debounceId);
            debounceId = undefined;
        }
        activeTask?.cancel();
        activeTask = null;
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

    function handleClose(): void {
        resetState();
        onClose();
    }

    function handleOpenAutoFocus(event: Event): void {
        event.preventDefault();
        inputElement?.focus({ preventScroll: true });
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
</script>

<DialogWrapper
    open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("composerTarget.title")}
    description={$_("composerTarget.description")}
    contentClass="composer-target-dialog"
    footerVariant="close-button"
    onOpenAutoFocus={handleOpenAutoFocus}
>
    <div class="composer-target-content">
        <h2>{$_("composerTarget.title")}</h2>
        <label class="target-input-label" for="composer-target-input">
            {$_("composerTarget.inputLabel")}
        </label>
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
                class="target-preview"
                aria-label={$_("composerTarget.preview")}
            >
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
                {#if sanitizedContent}
                    <p class="event-content">{sanitizedContent}</p>
                {/if}

                {#if target?.channelContext}
                    <div class="channel-preview">
                        {#if target.channelContext.picture}
                            <img
                                src={target.channelContext.picture}
                                alt=""
                                class="channel-picture"
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
            </section>
        {/if}

        {#if target && target.event.kind !== 1 && target.event.kind !== 40 && target.event.kind !== 42}
            <p class="unsupported-kind">
                {$_("composerTarget.unsupportedKind")}
            </p>
        {/if}

        {#if actions.length > 0}
            <div class="target-actions">
                {#each actions as action}
                    <Button
                        variant="primary"
                        contentLayout="iconText"
                        onClick={() => handleApply(action)}
                    >
                        {#if action === "reply"}
                            <div class="action-icon reply-icon svg-icon"></div>
                        {:else if action === "quote"}
                            <div class="action-icon quote-icon svg-icon"></div>
                        {:else}
                            <div class="action-icon post-icon svg-icon"></div>
                        {/if}
                        <span class="btn-text">
                            {action === "reply"
                                ? $_("composerTarget.reply")
                                : action === "quote"
                                  ? $_("composerTarget.quote")
                                  : $_("composerTarget.post")}
                        </span>
                    </Button>
                {/each}
            </div>
        {/if}
    </div>

    {#snippet footer()}
        <Button
            className="modal-close"
            variant="default"
            onClick={handleClose}
            ariaLabel={$_("global.close")}
        >
            {$_("global.close")}
        </Button>
    {/snippet}
</DialogWrapper>

<style>
    :global(.composer-target-dialog) {
        max-width: 560px;
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

    input {
        width: 100%;
        min-height: 44px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        background: var(--bg-input);
        color: var(--text);
        font: inherit;
    }

    .target-status p,
    .event-content,
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
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--border-hr);
        background: var(--bg-input);
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

    .event-content,
    .channel-preview p {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.45;
    }

    .channel-preview {
        display: flex;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border-hr);
    }

    .channel-picture {
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

    .target-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    }

    :global(.target-actions .reply-icon) {
        mask-image: url("/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 26px;
        height: 26px;
    }

    :global(.target-actions .quote-icon) {
        mask-image: url("/icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 30px;
        height: 30px;
    }

    :global(.target-actions .post-icon) {
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }
</style>
