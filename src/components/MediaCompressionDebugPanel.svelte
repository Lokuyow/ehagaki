<script lang="ts">
  import { onMount } from "svelte";
  import {
    clearMediaCompressionDiagnosticRecords,
    formatMediaCompressionDiagnostics,
    getAacCustomEncoderState,
    getMediaCompressionDiagnosticRecords,
    isMediaCompressionDebugEnabled,
    subscribeToMediaCompressionDiagnostics,
  } from "../lib/videoCompression/mediaCompressionDiagnostics";

  let expanded = $state(false);
  let records = $state(getMediaCompressionDiagnosticRecords());
  let aacState = $state(getAacCustomEncoderState());
  let copyStatus = $state("");

  const diagnosticText = $derived.by(() => {
    void records;
    void aacState;
    return formatMediaCompressionDiagnostics();
  });

  onMount(() => {
    const unsubscribe = subscribeToMediaCompressionDiagnostics(() => {
      records = [...getMediaCompressionDiagnosticRecords()];
      aacState = getAacCustomEncoderState();
    });
    return unsubscribe;
  });

  async function copyDiagnostics(): Promise<void> {
    copyStatus = "";
    if (!navigator.clipboard?.writeText) {
      copyStatus = "Clipboard unavailable";
      return;
    }

    try {
      await navigator.clipboard.writeText(diagnosticText);
      copyStatus = "Copied";
    } catch {
      copyStatus = "Copy failed";
    }
  }

  function clearDiagnostics(): void {
    clearMediaCompressionDiagnosticRecords();
    copyStatus = "";
  }
</script>

{#if isMediaCompressionDebugEnabled()}
  <section class="media-debug-panel" aria-label="Media Compression Debug">
    <button
      class="media-debug-toggle"
      type="button"
      aria-expanded={expanded}
      onclick={() => (expanded = !expanded)}
    >
      <span>Media Compression Debug</span>
      <span aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>

    {#if expanded}
      <div class="media-debug-content">
        <p class="media-debug-note">
          Clear removes displayed records only. Reload the page to reset AAC custom registration and the session.
        </p>
        <div class="media-debug-actions">
          <button type="button" onclick={copyDiagnostics}>Copy</button>
          <button type="button" onclick={clearDiagnostics}>Clear</button>
          {#if copyStatus}<span role="status">{copyStatus}</span>{/if}
        </div>
        <pre>{diagnosticText}</pre>
      </div>
    {/if}
  </section>
{/if}

<style>
  .media-debug-panel {
    position: fixed;
    z-index: 1000;
    top: 8px;
    right: 8px;
    width: min(320px, calc(100vw - 16px));
    max-width: calc(100vw - 16px);
    color: var(--text);
    background: var(--dialog-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 4px 18px rgb(0 0 0 / 25%);
    font: 12px/1.35 ui-monospace, SFMono-Regular, Consolas, monospace;
    overflow: hidden;
  }

  .media-debug-toggle,
  .media-debug-actions button {
    min-height: 36px;
    padding: 6px 10px;
    color: inherit;
    background: var(--btn-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    font: inherit;
  }

  .media-debug-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 0;
    border-radius: 0;
    text-align: left;
  }

  .media-debug-content {
    max-height: min(70dvh, 680px);
    padding: 8px;
    overflow: auto;
    overscroll-behavior: contain;
  }

  .media-debug-note {
    margin: 0 0 8px;
    color: var(--text-light);
    font-family: system-ui, sans-serif;
  }

  .media-debug-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-family: system-ui, sans-serif;
  }

  .media-debug-actions span {
    color: var(--text-light);
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
