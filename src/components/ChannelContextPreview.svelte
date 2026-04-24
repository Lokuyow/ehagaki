<script lang="ts">
    import { _ } from "svelte-i18n";
    import DOMPurify from "dompurify";
    import Button from "./Button.svelte";
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
        channel.name?.trim() || $_("channelComposer.unnamed"),
    );

    let sanitizedAbout = $derived(
        channel.about
            ? DOMPurify.sanitize(channel.about, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
              })
            : "",
    );

    let relaySummary = $derived(channel.relayHints.join("\n"));
    let canToggleExpand = $derived(
        isMetadataLoading ||
            !!sanitizedAbout ||
            !!channel.picture ||
            channel.relayHints.length > 0,
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

<div class="channel-context-preview">
    <div class="preview-header">
        <div class="preview-meta">
            <Button
                className="preview-label"
                variant="default"
                shape="square"
                onClick={canToggleExpand ? handleToggle : undefined}
                aria-expanded={canToggleExpand ? expanded : undefined}
                ariaLabel={toggleAriaLabel}
            >
                <div class="preview-mode-icon channel-icon svg-icon"></div>
                <span class="mode-text"
                    >{$_("channelComposer.selected_label")}</span
                >
            </Button>
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
        </div>
        <Button
            className="cancel-button"
            variant="default"
            shape="square"
            onClick={handleClear}
            title={$_("channelComposer.clear")}
            ariaLabel={$_("channelComposer.clear")}
        >
            <div class="close-icon svg-icon"></div>
        </Button>
    </div>

    {#if expanded}
        <div class="preview-content">
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
        </div>
    {/if}
</div>

<style>
    .channel-context-preview {
        display: flex;
        flex-direction: column;
        border-left: 3px solid var(--theme);
        background-color: var(--bg-input);
        max-width: 800px;
        width: 100%;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .preview-header {
        display: flex;
        align-items: center;
        gap: 12px;

        .preview-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            flex: 1;

            :global(.preview-label) {
                gap: 6px;
                height: 50px;
                min-width: fit-content;
                padding: 0 10px 0 10px;
                border-radius: 0 6px 6px 0;
            }

            :global(.channel-loading-inline) {
                width: auto;
                flex: 0 1 auto;
                justify-content: flex-start;
                flex-wrap: nowrap;
            }

            :global(.channel-loading-inline .placeholder-text) {
                padding: 0;
                white-space: nowrap;
            }
        }

        :global(.cancel-button) {
            height: 50px;
            width: 50px;
            padding: 2px;
            flex-shrink: 0;
        }
    }

    .preview-mode-icon {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
    }

    .channel-icon {
        mask-image: url("/icons/comments-solid-full.svg");
    }

    .mode-text {
        font-size: 1rem;
        font-weight: 600;
        color: var(--theme);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .channel-name {
        min-width: 0;
        color: var(--text-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(.cancel-button .close-icon) {
        width: 30px;
        height: 30px;
        mask-image: url("/icons/xmark-solid-full.svg");
    }

    .preview-content {
        display: grid;
        gap: 10px;
        width: 100%;
        padding: 12px 20px 14px 20px;
        color: var(--text);

        :global(.channel-loading-block) {
            width: 100%;
            padding: 0;
        }
    }

    .channel-picture {
        width: 42px;
        height: 42px;
        object-fit: cover;
        background: var(--dialog);
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
