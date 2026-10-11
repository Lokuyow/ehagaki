<script lang="ts">
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import Button from "../Button.svelte";
    import { tryCopyToClipboard } from "../../lib/utils/clipboardUtils";
    import { clearLocalRelayDiagnostics, formatLocalRelayDiagnostics, getLocalRelayDiagnosticRevision,
        getLocalRelayDiagnostics, type LocalRelayDiagnosticOperation } from "../../lib/localRelayDiagnostics";

    let operations = $state<LocalRelayDiagnosticOperation[]>([]);
    let copied = $state<boolean | null>(null);
    let observedRevision = -1;
    function refresh() {
        const revision = getLocalRelayDiagnosticRevision();
        if (revision === observedRevision) return;
        observedRevision = revision;
        operations = getLocalRelayDiagnostics();
    }
    onMount(() => {
        refresh();
        // UI polling is separate from recording; no Svelte flush is scheduled
        // by a hook, a guard or a WebSocket callback.
        const timer = setInterval(refresh, 250);
        return () => clearInterval(timer);
    });
    function clear() { clearLocalRelayDiagnostics(); copied = null; refresh(); }
    async function copy() { copied = await tryCopyToClipboard(formatLocalRelayDiagnostics(), "diagnostics"); }
</script>

<section class="diagnostics" aria-labelledby="local-relay-diagnostic-heading" data-testid="local-relay-diagnostics">
    <h4 id="local-relay-diagnostic-heading">{$_("settingsDialog.local_relay_diagnostic_title")}</h4>
    <p>{$_("settingsDialog.local_relay_diagnostic_description")}</p>
    <div class="actions">
        <Button variant="default" shape="rounded" onClick={clear}>{$_("settingsDialog.local_relay_diagnostic_clear")}</Button>
        <Button variant="default" shape="rounded" onClick={copy}>{$_("settingsDialog.local_relay_diagnostic_copy")}</Button>
    </div>
    {#if copied !== null}<p role="status">{$_(copied ? "settingsDialog.local_relay_diagnostic_copied" : "settingsDialog.local_relay_diagnostic_copy_failed")}</p>{/if}
    {#if !operations.length}<p>{$_("settingsDialog.local_relay_diagnostic_empty")}</p>{/if}
    {#each operations as operation (operation.id)}
        <article data-source={operation.source} data-terminal={operation.terminal ?? "observing"}>
            <strong>[{operation.source} #{operation.id}] {operation.terminal ?? "observing"}</strong>
            <div class="timestamp">{new Date(operation.startedAt).toISOString()}</div>
            {#if operation.truncated}<p>{$_("settingsDialog.local_relay_diagnostic_truncated")}</p>{/if}
            <pre>{operation.entries.map(entry => `+${entry.elapsedMs}ms ${entry.stage} ${JSON.stringify(entry.details)}`).join("\n")}</pre>
        </article>
    {/each}
</section>

<style>
    .diagnostics { min-width: 0; border: 1px solid var(--border); border-radius: 6px; padding: 10px; }
    h4, p { margin: 0 0 8px; }
    p, .timestamp { font-size: 0.8rem; overflow-wrap: anywhere; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    article { border-top: 1px solid var(--border); padding: 10px 0; min-width: 0; }
    strong { display: block; font-size: 0.85rem; overflow-wrap: anywhere; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 0.75rem; line-height: 1.5; margin: 6px 0 0; }
</style>
