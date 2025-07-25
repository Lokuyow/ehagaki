<script lang="ts">
  // createEventDispatcherは削除
  import { _, locale } from "svelte-i18n";
  import { FileUploadManager } from "../lib/fileUploadManager";
  import { onMount } from "svelte";

  // コールバックpropsを受け取る
  export let onImageUrl: (payload: { url: string }) => void;
  export let onError: (payload: { message: string }) => void;

  // アップロード状態
  let isUploading = false;
  let errorMessage = "";
  let file: File | null = null;
  let inputElement: HTMLInputElement;
  let dragOver = false;
  let debugInfo = ""; // デバッグ情報を保持

  // アップロード先候補
  const uploadEndpoints = [
    { label: "yabu.me", url: "https://yabu.me/api/v2/media" },
    { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
    { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
    { label: "nostr.build", url: "https://nostr.build/api/v2/nip96/upload" },
  ];

  function getDefaultEndpoint(loc: string | null | undefined) {
    if (loc === "ja") return "https://yabu.me/api/v2/media";
    return "https://nostrcheck.me/api/v2/media";
  }

  // 初期値をローカルストレージから即時取得
  // 初期化処理を関数として抽出
  function initializeEndpoint() {
    // ローカルストレージから直接取得
    const saved = localStorage.getItem("uploadEndpoint");
    console.log("ローカルストレージから読込:", saved);

    if (saved && uploadEndpoints.some((ep) => ep.url === saved)) {
      return saved;
    }
    // デフォルト値を返す
    const defaultEp = getDefaultEndpoint($locale);
    console.log("デフォルト値を使用:", defaultEp);
    return defaultEp;
  }

  // 初期化関数を呼び出して値をセット
  let selectedEndpoint: string = initializeEndpoint();

  onMount(() => {
    // 初期化時にローカルストレージに保存（デフォルト値の場合）
    if (!localStorage.getItem("uploadEndpoint")) {
      localStorage.setItem("uploadEndpoint", selectedEndpoint);
      console.log("初期値を保存:", selectedEndpoint);
    }

    // アップロード先が変更されたときのイベントリスナー
    window.addEventListener("storage", (event) => {
      if (event.key === "uploadEndpoint" && event.newValue) {
        selectedEndpoint = event.newValue;
      }
    });
  });

  // ファイル選択ダイアログを開く
  function openFileDialog() {
    if (inputElement) {
      inputElement.click();
    }
  }

  // ファイルが選択された時
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      file = target.files[0];
      await uploadFile(file);
    }
  }

  // ドラッグ&ドロップイベント
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      file = event.dataTransfer.files[0];
      await uploadFile(file);
    }
  }

  // ファイルアップロード処理
  async function uploadFile(selectedFile: File) {
    if (!selectedFile) return;

    // 画像ファイルかどうかをチェック
    if (!selectedFile.type.startsWith("image/")) {
      errorMessage = $_("only_images_allowed");
      onError?.({ message: errorMessage });
      return;
    }

    try {
      // ローカルストレージから最新の値を取得
      const endpoint =
        localStorage.getItem("uploadEndpoint") || selectedEndpoint;
      console.log("アップロード先:", endpoint);

      debugInfo = `ファイル名: ${selectedFile.name}, サイズ: ${selectedFile.size} bytes\nアップロード先: ${endpoint}`;
      isUploading = true;
      errorMessage = "";

      // 明示的にエンドポイントを渡す
      const result = await FileUploadManager.uploadFile(selectedFile, endpoint);

      if (result.success && result.url) {
        debugInfo += `\n成功: ${result.url}`;
        // 成功したらURLを親コンポーネントに通知
        onImageUrl?.({ url: result.url });
        // 入力をリセット
        if (inputElement) {
          inputElement.value = "";
        }
        file = null;
      } else {
        errorMessage = result.error || $_("upload_failed");
        debugInfo += `\nエラー: ${errorMessage}`;
        onError?.({ message: errorMessage });
      }
    } catch (error) {
      console.error("Upload error:", error);
      errorMessage = error instanceof Error ? error.message : String(error);
      debugInfo += `\n例外: ${errorMessage}`;
      onError?.({ message: errorMessage });
    } finally {
      isUploading = false;
    }
  }

  // 選択変更時の処理を明示的に追加
  function handleEndpointChange(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    selectedEndpoint = selected;
    localStorage.setItem("uploadEndpoint", selected);
    console.log("アップロード先を変更:", selected);
  }

  // 選択が変更されたら保存して更新
  $: if (selectedEndpoint) {
    localStorage.setItem("uploadEndpoint", selectedEndpoint);
    // デバッグ情報更新
    if (file) {
      debugInfo = `ファイル名: ${file.name}, サイズ: ${file.size} bytes\nアップロード先: ${selectedEndpoint}`;
    }
  }
</script>

<div
  class="image-upload-container"
  class:drag-over={dragOver}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  role="region"
>
  <!-- アップロード先選択 -->
  <div class="endpoint-select">
    <label for="endpoint">{$_("upload_destination") || "アップロード先"}:</label
    >
    <select
      id="endpoint"
      bind:value={selectedEndpoint}
      on:change={handleEndpointChange}
      disabled={isUploading}
      aria-label="アップロード先"
    >
      {#each uploadEndpoints as ep}
        <option value={ep.url}>{ep.label}</option>
      {/each}
    </select>
  </div>

  <input
    type="file"
    accept="image/*"
    on:change={handleFileSelect}
    bind:this={inputElement}
    style="display: none;"
  />

  <button
    type="button"
    class="upload-button"
    on:click={openFileDialog}
    disabled={isUploading}
  >
    {#if isUploading}
      <span class="loading-indicator"></span>
      {$_("uploading")}...
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      {$_("upload_image")}
    {/if}
  </button>

  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}

  {#if import.meta.env.DEV && debugInfo}
    <div class="debug-info">
      <h4>デバッグ情報:</h4>
      <pre>{debugInfo}</pre>
    </div>
  {/if}
</div>

<style>
  .image-upload-container {
    margin-bottom: 10px;
    padding: 10px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 100%;
  }

  .drag-over {
    background-color: #e3f2fd;
    border-color: #1da1f2;
  }

  .upload-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .upload-button:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  .upload-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #c62828;
    margin-top: 8px;
    font-size: 0.9rem;
  }

  .loading-indicator {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #1da1f2;
    animation: spin 1s ease-in-out infinite;
  }

  .debug-info {
    margin-top: 16px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f5f5f5;
    font-size: 0.8rem;
    width: 100%;
    overflow-x: auto;
  }

  .debug-info h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
  }

  .debug-info pre {
    margin: 0;
    white-space: pre-wrap;
  }

  .endpoint-select {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
  }
  .endpoint-select label {
    font-size: 0.95rem;
    color: #333;
  }
  .endpoint-select select {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
