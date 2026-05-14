<script lang="ts">
    import { _ } from "svelte-i18n";
    import DOMPurify from "dompurify";
    import ComposerContextPreviewShell from "./ComposerContextPreviewShell.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import type { ChannelContextState } from "../lib/types";

    interface Props {
        channel: ChannelContextState;
        onClear: () => void;
    }

    let { channel, onClear }: Props = $props();

    let expanded = $state(false);
    let isMetadataLoading = $derived(!!channel.isMetadataLoading);

    let channelName = $derived(
        channel.name?.trim() || `ID: ${channel.eventId}`,
    );

    let sanitizedAbout = $derived(
        channel.about
            ? DOMPurify.sanitize(channel.about, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
              })
            : "",
    );

    let relaySummary = $derived((channel.channelRelays ?? []).join("\n"));
    let canToggleExpand = $derived(
        isMetadataLoading ||
            !!sanitizedAbout ||
            !!channel.picture ||
            (channel.channelRelays?.length ?? 0) > 0,
    );
    let toggleAriaLabel = $derived(
        canToggleExpand
            ? expanded
                ? $_("channelComposer.collapse")
                : $_("channelComposer.expand")
            : $_("channelComposer.selected_label"),
    );

    function handleToggle(): void {
        if (!canToggleExpand) {
            return;
        }

        expanded = !expanded;
    }

    function handleClear(): void {
        onClear();
        expanded = false;
    }
</script>

<ComposerContextPreviewShell
    previewClass="channel-context-preview"
    modeIconClass="channel-icon"
    modeLabel={$_("channelComposer.selected_label")}
    {expanded}
    {canToggleExpand}
    {toggleAriaLabel}
    clearAriaLabel={$_("channelComposer.clear")}
    onToggle={handleToggle}
    onClear={handleClear}
>
    {#snippet meta()}
        {#if isMetadataLoading}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("channelComposer.loading")}
                customClass="channel-loading-inline"
            />
        {:else}
            {#if channel.picture}
                <img
                    class="channel-picture"
                    src={channel.picture}
                    alt={channelName}
                />
            {/if}
            <span class="channel-name">{channelName}</span>
        {/if}
    {/snippet}

    {#snippet content()}
        {#if isMetadataLoading}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("channelComposer.loading")}
                customClass="channel-loading-block"
            />
        {:else}
            {#if sanitizedAbout}
                <p class="about-text">{sanitizedAbout}</p>
            {/if}
            {#if relaySummary}
                <dl class="meta-list">
                    <div class="meta-row">
                        <dt>{$_("channelComposer.relays_label")}</dt>
                        <dd>{relaySummary}</dd>
                    </div>
                </dl>
            {/if}
        {/if}
    {/snippet}
</ComposerContextPreviewShell>

<style>
    :global(.channel-context-preview) {
        --preview-meta-gap: 8px;
        --preview-content-display: grid;
        --preview-content-gap: 10px;
        --preview-content-padding: 12px 20px 14px 20px;
    }

    :global(.channel-context-preview .channel-loading-inline) {
        width: auto;
        flex: 0 1 auto;
        justify-content: flex-start;
        flex-wrap: nowrap;
    }

    :global(
            .channel-context-preview .channel-loading-inline .placeholder-text
        ) {
        padding: 0;
        white-space: nowrap;
    }

    :global(.channel-context-preview .channel-icon) {
        mask-image: url("/icons/forum_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .channel-name {
        min-width: 0;
        color: var(--text-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.channel-context-preview .channel-loading-block) {
        width: 100%;
        padding: 0;
    }

    .channel-picture {
        width: 42px;
        height: 42px;
        object-fit: cover;
        background: var(--dialog-bg);
        flex-shrink: 0;
    }

    .about-text {
        margin: 0;
        white-space: pre-wrap;
        line-height: 1.45;
    }

    .meta-list {
        display: grid;
        gap: 8px;
        margin: 0;
    }

    .meta-row {
        display: grid;
        gap: 4px;
    }

    .meta-row dt {
        font-size: 0.82rem;
        color: var(--text-muted);
    }

    .meta-row dd {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
    }
</style>
