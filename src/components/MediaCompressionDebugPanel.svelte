<script lang="ts">
  import { onMount } from "svelte";
  import type {
    VideoDecodeBenchmarkOptions,
    VideoDecodeBenchmarkResult,
  } from "../lib/videoCompression/videoDecodeBenchmark";
  import {
    addRawVideoEncoderBenchmarkRecord,
    addVideoDecodeBenchmarkRecord,
    clearMediaCompressionDiagnosticRecords,
    formatMediaCompressionDiagnostics,
    getAacCustomEncoderState,
    getMediaCompressionDiagnosticRecords,
    isMediaCompressionDebugEnabled,
    isMediaCompressionDebugRawVideoEncoderEnabled,
    isMediaCompressionDebugVideoDecodeBenchmarkEnabled,
    subscribeToMediaCompressionDiagnostics,
  } from "../lib/videoCompression/mediaCompressionDiagnostics";
  import { runRawVideoEncoderBenchmark } from "../lib/videoCompression/rawVideoEncoderBenchmark";

  type VideoDecodeBenchmarkRunner = (
    file: File,
    options?: VideoDecodeBenchmarkOptions,
  ) => Promise<VideoDecodeBenchmarkResult>;
  type VideoDecodeBenchmarkLoader = () => Promise<VideoDecodeBenchmarkRunner>;

  interface Props {
    /** Harness injection only; production uses the native WebCodecs benchmark. */
    rawVideoEncoderBenchmarkRunner?: typeof runRawVideoEncoderBenchmark;
    /** Harness injection only; production loads the decoder benchmark on demand. */
    videoDecodeBenchmarkRunner?: VideoDecodeBenchmarkRunner;
    /** Test-only injection for the dynamic-import failure path. */
    videoDecodeBenchmarkLoader?: VideoDecodeBenchmarkLoader;
  }

  let {
    rawVideoEncoderBenchmarkRunner = runRawVideoEncoderBenchmark,
    videoDecodeBenchmarkRunner,
    videoDecodeBenchmarkLoader,
  }: Props = $props();

  let expanded = $state(false);
  let records = $state(getMediaCompressionDiagnosticRecords());
  let aacState = $state(getAacCustomEncoderState());
  let copyStatus = $state("");
  let rawBenchmarkStatus = $state<"idle" | "running" | "completed" | "failed">("idle");
  let videoDecodeBenchmarkStatus = $state<"idle" | "running" | "completed" | "failed">("idle");
  let rawRunController: AbortController | null = null;
  let videoDecodeRunController: AbortController | null = null;
  let videoDecodeInput: HTMLInputElement | undefined = $state();

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
    return () => {
      rawRunController?.abort();
      videoDecodeRunController?.abort();
      if (videoDecodeInput) videoDecodeInput.value = "";
      unsubscribe();
    };
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

  async function runRawBenchmark(): Promise<void> {
    if (rawBenchmarkStatus === "running") return;

    rawBenchmarkStatus = "running";
    rawRunController = new AbortController();
    try {
      const result = await rawVideoEncoderBenchmarkRunner({ signal: rawRunController.signal });
      addRawVideoEncoderBenchmarkRecord(result);
      rawBenchmarkStatus = result.status;
    } catch {
      rawBenchmarkStatus = "failed";
    } finally {
      rawRunController = null;
    }
  }

  function selectVideoDecodeBenchmarkFile(): void {
    if (videoDecodeBenchmarkStatus !== "running") videoDecodeInput?.click();
  }

  async function runVideoDecodeBenchmarkForSelectedFile(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file || videoDecodeBenchmarkStatus === "running") return;

    videoDecodeBenchmarkStatus = "running";
    videoDecodeRunController = new AbortController();
    try {
      const runner = videoDecodeBenchmarkRunner
        ?? (videoDecodeBenchmarkLoader
          ? await videoDecodeBenchmarkLoader()
          : (await import("../lib/videoCompression/videoDecodeBenchmark")).runVideoDecodeBenchmark);
      const result = await runner(file, { signal: videoDecodeRunController.signal });
      addVideoDecodeBenchmarkRecord(result);
      videoDecodeBenchmarkStatus = result.status;
    } catch {
      videoDecodeBenchmarkStatus = "failed";
    } finally {
      videoDecodeRunController = null;
    }
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
          {#if isMediaCompressionDebugRawVideoEncoderEnabled()}
            <button
              type="button"
              disabled={rawBenchmarkStatus === "running"}
              onclick={runRawBenchmark}
            >
              {rawBenchmarkStatus === "running" ? "Running raw VideoEncoder benchmark…" : "Run raw VideoEncoder benchmark"}
            </button>
          {/if}
          {#if isMediaCompressionDebugVideoDecodeBenchmarkEnabled()}
            <input
              bind:this={videoDecodeInput}
              class="media-debug-file-input"
              type="file"
              accept="video/*"
              aria-label="Select video for decode benchmark"
              onchange={runVideoDecodeBenchmarkForSelectedFile}
            />
            <button
              type="button"
              disabled={videoDecodeBenchmarkStatus === "running"}
              onclick={selectVideoDecodeBenchmarkFile}
            >
              {videoDecodeBenchmarkStatus === "running" ? "Running video decode benchmark…" : "Run video decode benchmark"}
            </button>
          {/if}
          <button type="button" onclick={copyDiagnostics}>Copy</button>
          <button type="button" onclick={clearDiagnostics}>Clear</button>
          {#if copyStatus}<span role="status">{copyStatus}</span>{/if}
          {#if rawBenchmarkStatus !== "idle"}<span role="status">Raw benchmark: {rawBenchmarkStatus}</span>{/if}
          {#if videoDecodeBenchmarkStatus !== "idle"}<span role="status">Video decode benchmark: {videoDecodeBenchmarkStatus}</span>{/if}
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
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
    font-family: system-ui, sans-serif;
  }

  .media-debug-actions span {
    color: var(--text-light);
  }

  .media-debug-file-input {
    display: none;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
