<script lang="ts">
    import { _ } from "svelte-i18n";
    import { useFooterMiddleDisplay } from "../lib/hooks/useFooterMiddleDisplay.svelte";
    import {
        devLog,
        copyDevLogWithFallback,
        shouldShowDevLog,
    } from "../lib/debug";
    import FooterProgressStatus from "./FooterProgressStatus.svelte";

    async function handleDevLogCopy(e?: Event) {
        try {
            e?.preventDefault();
        } catch {}

        try {
            const logs = [...$devLog].reverse();
            await copyDevLogWithFallback(logs);
        } catch (err) {
            console.warn("dev log copy failed:", err);
        }
    }

    const footerDisplay = useFooterMiddleDisplay(() => $_);
    let sharedMediaError = $derived(footerDisplay.sharedMediaError);
    let progressDisplay = $derived(footerDisplay.progressDisplay);
    let imageSizeDisplay = $derived(footerDisplay.imageSizeDisplay);
    let showingInfo = $derived(footerDisplay.showingInfo);
</script>

{#if shouldShowDevLog() && $devLog.length}
    <button
        type="button"
        class="floating-dev-console-log"
        onclick={handleDevLogCopy}
        ontouchend={handleDevLogCopy}
        title="タップで全コピー"
        aria-label="開発者ログをコピー"
    >
        <ul>
            {#each [...$devLog].reverse() as log}
                <li>{log}</li>
            {/each}
        </ul>
    </button>
{/if}

<div class="footer-center">
    {#if showingInfo}
        {#if sharedMediaError}
            <div class="shared-media-error">
                <div class="error-text">{sharedMediaError}</div>
            </div>
        {:else if progressDisplay}
            <FooterProgressStatus
                text={progressDisplay.text}
                value={progressDisplay.value}
                ariaLabel={progressDisplay.ariaLabel}
                ariaValueText={progressDisplay.ariaValueText}
                showAbort={progressDisplay.showAbort}
                abortAriaLabel={progressDisplay.abortAriaLabel}
                onAbort={footerDisplay.handleAbortAll}
            />
        {:else if imageSizeDisplay}
            <div class="image-size-info">
                <div class="size-label">
                    {$_("footerInfoDisplay.data_size")}:
                </div>
                <div class="size-details">
                    {imageSizeDisplay.originalLine}<br />
                    {imageSizeDisplay.resultLine}
                </div>
            </div>
        {/if}
    {/if}
</div>

<style>
    .footer-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .image-size-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-size: 0.9375rem;
        line-height: 1.1;
        white-space: normal;
        text-align: left;
        max-width: 100%;
        gap: 2px;
    }

    .size-label {
        color: var(--text-light);
        font-size: 0.8125rem;
        opacity: 0.8;
    }

    .size-details {
        font-size: 0.9375rem;
        font-weight: 500;
    }

    .floating-dev-console-log {
        position: fixed;
        right: 0;
        bottom: 116px;
        z-index: 1000;
        min-width: 240px;
        width: 100%;
        max-height: 10vh;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        border: 1px solid #fbb;
        border-radius: 8px;
        background: #fff0f0;
        overflow-y: auto;
        opacity: 0.6;
        pointer-events: auto;
        touch-action: manipulation;
        font-size: 0.6rem;
        color: #c00;
        white-space: pre-wrap;
        height: 100%;
        cursor: pointer;
        user-select: text;
        border: none;
        text-align: left;
        outline: none;
        box-shadow: none;
        appearance: none;
        border-radius: 0;

        &:hover {
            --btn-bg: #ffe0e0;
        }
    }

    .floating-dev-console-log:active,
    .floating-dev-console-log:focus {
        background: #ffe0e0;
    }

    .floating-dev-console-log ul {
        margin: 0;
        padding: 0 0 0 0.4rem;
        list-style: disc inside;
        overflow-y: auto;
    }

    .floating-dev-console-log li {
        margin: 0;
        padding: 0;
        word-break: break-all;
    }

    .floating-dev-console-log:active {
        transform: scale(0.97);
    }

    .shared-media-error {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        background: var(--balloon-error-bg, #fef2f2);
        border: 1px solid var(--balloon-error-border, #fecaca);
        border-radius: 6px;
        max-width: 100%;
    }

    .error-text {
        font-size: 0.9rem;
        color: var(--balloon-error-color, #dc2626);
        text-align: center;
    }
</style>
