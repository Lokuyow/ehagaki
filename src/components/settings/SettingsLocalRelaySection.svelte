<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "../Button.svelte";
    import { settingsStore } from "../../stores/settingsStore.svelte";
    import { normalizeLocalRelayUrl } from "../../lib/localRelayUrl";
    import { preventKeyboardFocusChange } from "../../lib/utils/keyboardFocusUtils";

    let input = $state(settingsStore.localRelayUrl ?? "");
    let error = $state<"invalid" | "storage" | null>(null);
    let urlInputElement = $state<HTMLInputElement | null>(null);

    function save(value: string): void {
        if (value.trim() && !normalizeLocalRelayUrl(value)) {
            error = "invalid";
            return;
        }
        try {
            settingsStore.setLocalRelayUrl(value);
            input = settingsStore.localRelayUrl ?? "";
            error = null;
        } catch {
            error = "storage";
        }
    }

    function handleClearInput(): void {
        input = "";
        error = null;
        setTimeout(() => {
            urlInputElement?.focus({ preventScroll: true });
        }, 0);
    }
</script>

<div class="setting-section">
    <div class="setting-row local-relay-row">
        <label id="local-relay-url-label" class="setting-label local-relay-label" for="local-relay-url">
            {$_("settingsDialog.local_relay_url")}
        </label>
        <div class="setting-control local-relay-control">
            <div class="local-relay-url-input-shell">
                <input
                    id="local-relay-url"
                    class="local-relay-url-input"
                    type="url"
                    bind:this={urlInputElement}
                    bind:value={input}
                    placeholder="ws://127.0.0.1:4869/"
                    spellcheck={false}
                    aria-describedby="local-relay-error"
                    aria-invalid={error === "invalid" ? "true" : undefined}
                    oninput={() => {
                        error = null;
                    }}
                />
                {#if input.length > 0}
                    <Button
                        type="button"
                        className="local-relay-url-clear-button"
                        variant="default"
                        shape="square"
                        contentLayout="icon"
                        ariaLabel={$_("clearInput") || "入力内容を消去"}
                        onClick={handleClearInput}
                        onmousedown={preventKeyboardFocusChange}
                        ontouchstart={preventKeyboardFocusChange}
                    >
                        <div class="local-relay-url-clear-icon svg-icon" aria-hidden="true"></div>
                    </Button>
                {/if}
            </div>
            <span id="local-relay-error" role={error ? "alert" : undefined}>
                {#if error}{$_(`settingsDialog.local_relay_${error}_error`)}{/if}
            </span>
            <div class="actions">
                <Button variant="default" shape="rounded" onClick={() => save(input)}>
                    {$_("settingsDialog.local_relay_save")}
                </Button>
                <Button variant="default" shape="rounded" onClick={() => save("")}>
                    {$_("settingsDialog.local_relay_clear")}
                </Button>
            </div>
        </div>
    </div>
</div>

<style>
    .local-relay-row {
        align-items: flex-start;
        gap: 12px;
    }

    .local-relay-label {
        flex: 1 1 auto;
        min-width: 0;
        margin-block: 0;
        align-items: flex-start;
        padding-block-start: 10px;
    }

    .local-relay-control {
        flex: 0 1 260px;
        min-width: 0;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 4px;
        margin-block: 0;
    }

    .local-relay-url-input-shell {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
        width: 100%;
    }

    .local-relay-url-input {
        box-sizing: border-box;
        flex: 1 1 auto;
        width: 100%;
        min-width: 0;
        min-height: 44px;
        padding: 8px 47px 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
    }

    .local-relay-url-input[aria-invalid="true"] {
        border-color: var(--danger);
    }

    :global(.ehagaki-app-root button.local-relay-url-clear-button) {
        position: absolute;
        inset-block: 50%;
        inset-inline-end: 2px;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
        border: none;
        color: var(--text-muted);
        z-index: 1;
    }

    :global(.ehagaki-app-root button.local-relay-url-clear-button:hover:not(:disabled)),
    :global(.ehagaki-app-root button.local-relay-url-clear-button:active:not(:disabled)),
    :global(.ehagaki-app-root button.local-relay-url-clear-button:focus-visible),
    :global(.ehagaki-app-root button.local-relay-url-clear-button:disabled) {
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
        border: none;
        color: var(--text-muted);
    }

    :global(.local-relay-url-clear-button .svg-icon) {
        --svg: currentColor;
        width: 24px;
        height: 24px;
    }

    .local-relay-url-clear-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    #local-relay-error {
        color: var(--danger);
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: flex-end;
    }
</style>
