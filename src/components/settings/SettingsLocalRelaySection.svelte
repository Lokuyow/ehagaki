<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "../Button.svelte";
    import { settingsStore } from "../../stores/settingsStore.svelte";
    import { normalizeLocalRelayUrl } from "../../lib/localRelayUrl";

    let input = $state(settingsStore.localRelayUrl ?? "");
    let error = $state<"invalid" | "storage" | null>(null);

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
</script>

<section class="local-relay-section" aria-labelledby="local-relay-heading">
    <h3 id="local-relay-heading">{$_("settingsDialog.local_relay_title")}</h3>
    <p id="local-relay-description">{$_("settingsDialog.local_relay_description")}</p>
    <label for="local-relay-url">{$_("settingsDialog.local_relay_url")}</label>
    <input id="local-relay-url" type="url" bind:value={input}
        placeholder="ws://127.0.0.1:4869/" spellcheck={false}
        aria-describedby="local-relay-description local-relay-error"
        aria-invalid={error === "invalid" ? "true" : undefined}
        oninput={() => { error = null; }} />
    <span id="local-relay-error" role={error ? "alert" : undefined}>
        {#if error}{$_(`settingsDialog.local_relay_${error}_error`)}{/if}
    </span>
    <div class="actions">
        <Button variant="default" shape="rounded" onClick={() => save(input)}>{$_("settingsDialog.local_relay_save")}</Button>
        <Button variant="default" shape="rounded" onClick={() => save("")}>{$_("settingsDialog.local_relay_clear")}</Button>
    </div>
</section>

<style>
    .local-relay-section { display: grid; gap: 0.5rem; min-width: 0; padding: 10px 0; }
    h3, p { margin: 0; }
    h3 { font-size: 1rem; }
    p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.4; }
    input { box-sizing: border-box; width: 100%; min-width: 0; min-height: 44px;
        padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px;
        background: var(--dialog-bg); color: var(--text); font: inherit; }
    input[aria-invalid="true"] { border-color: var(--danger); }
    #local-relay-error { color: var(--danger); font-size: 0.875rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
</style>
