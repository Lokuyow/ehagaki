<script lang="ts">
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import type { RxNostr } from "rx-nostr";
    import Button from "../Button.svelte";
    import InfoPopoverButton from "../InfoPopoverButton.svelte";
    import { uploadDestinationStore } from "../../stores/uploadDestinationStore.svelte";
    import { authState } from "../../stores/authStore.svelte";
    import type {
        UploadDestination,
        UploadProtocol,
        UploadPresetId,
    } from "../../lib/types";
    import {
        DEFAULT_UPLOAD_CAPABILITIES,
        UPLOAD_DESTINATION_PRESETS,
        createUploadDestinationFromPreset,
        normalizeServerUrl,
    } from "../../lib/upload/uploadDestinationPresets";

    interface Props {
        rxNostr?: RxNostr | null;
    }

    let { rxNostr = null }: Props = $props();

    const emptyForm = {
        id: "",
        name: "",
        protocol: "blossom" as UploadProtocol,
        serverUrl: "",
        presetId: "custom" as UploadPresetId,
        enabled: true,
        isDefault: true,
    };

    let expanded = $state(false);
    let editing = $state(false);
    let editingTargetId: string | null = $state(null);
    let form = $state({ ...emptyForm });
    let testingId: string | null = $state(null);
    let expandedMimeDestinations = $state<Record<string, boolean>>({});
    let destinationState = $derived(uploadDestinationStore.value);
    let currentScope = $state<string | null>(null);
    let pubkeyHex = $derived(
        authState.value.isAuthenticated ? authState.value.pubkey || null : null,
    );
    let canUseBud03 = $derived(Boolean(rxNostr && pubkeyHex));
    const presetOptions = UPLOAD_DESTINATION_PRESETS.filter(
        (preset) => preset.id !== "custom",
    );

    onMount(() => {
        currentScope = pubkeyHex;
        void uploadDestinationStore.load(currentScope);
    });

    $effect(() => {
        if (currentScope === pubkeyHex) return;
        currentScope = pubkeyHex;
        void uploadDestinationStore.load(currentScope);
    });

    function formatMaxSize(bytes: number | null): string {
        if (!bytes)
            return $_("settingsDialog.uploadDestinationUnknown") || "未確認";
        const units = ["B", "KB", "MB", "GB"];
        let value = bytes;
        let unitIndex = 0;
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex += 1;
        }
        return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    }

    function getMimeSummary(destination: UploadDestination): string {
        const mimeTypes = destination.capabilities.supportedMimeTypes;
        if (!mimeTypes.length)
            return $_("settingsDialog.uploadDestinationUnknown") || "未確認";
        if (expandedMimeDestinations[destination.id])
            return mimeTypes.join(", ");
        if (mimeTypes.length <= 3) return mimeTypes.join(", ");
        return `${mimeTypes.slice(0, 3).join(", ")} +${mimeTypes.length - 3}`;
    }

    function canExpandMimeTypes(destination: UploadDestination): boolean {
        return destination.capabilities.supportedMimeTypes.length > 3;
    }

    function toggleMimeTypes(destinationId: string): void {
        expandedMimeDestinations = {
            ...expandedMimeDestinations,
            [destinationId]: !expandedMimeDestinations[destinationId],
        };
    }

    function startAdd(): void {
        form = { ...emptyForm };
        editing = true;
        editingTargetId = null;
        expanded = true;
    }

    function cancelEdit(): void {
        editing = false;
        editingTargetId = null;
    }

    function startEdit(destination: UploadDestination): void {
        if (editingTargetId === destination.id) {
            cancelEdit();
            return;
        }
        form = {
            id: destination.id,
            name: destination.name,
            protocol: destination.protocol,
            serverUrl: destination.serverUrl,
            presetId: destination.presetId ?? "custom",
            enabled: destination.enabled,
            isDefault: destination.isDefault,
        };
        editing = true;
        editingTargetId = destination.id;
        expanded = true;
    }

    function applyPreset(presetId: UploadPresetId): void {
        form.presetId = presetId;
        if (presetId === "custom") {
            form.name = "";
            form.serverUrl = "";
            return;
        }
        const preset = UPLOAD_DESTINATION_PRESETS.find(
            (item) => item.id === presetId,
        );
        if (!preset) return;
        form.name = preset.name;
        form.protocol = preset.protocol;
        form.serverUrl = preset.serverUrl;
    }

    async function saveForm(): Promise<void> {
        const timestamp = Date.now();
        const preset = UPLOAD_DESTINATION_PRESETS.find(
            (item) => item.id === form.presetId,
        );
        const existing = destinationState.destinations.find(
            (destination) => destination.id === form.id,
        );
        const destination: UploadDestination =
            preset && !existing
                ? {
                      ...createUploadDestinationFromPreset({
                          preset,
                          pubkeyHex,
                          isDefault:
                              form.isDefault ||
                              destinationState.destinations.length === 0,
                          now: timestamp,
                      }),
                      name: form.name.trim() || preset.name,
                      serverUrl: normalizeServerUrl(
                          form.serverUrl || preset.serverUrl,
                      ),
                      enabled: form.enabled,
                  }
                : {
                      ...(existing ??
                          createUploadDestinationFromPreset({
                              preset: preset ?? {
                                  id: "custom",
                                  name: form.name || "Custom",
                                  protocol: form.protocol,
                                  serverUrl: form.serverUrl,
                                  capabilities: DEFAULT_UPLOAD_CAPABILITIES,
                              },
                              pubkeyHex,
                              isDefault:
                                  form.isDefault ||
                                  destinationState.destinations.length === 0,
                              now: timestamp,
                          })),
                      name: form.name.trim(),
                      protocol: form.protocol,
                      serverUrl: normalizeServerUrl(form.serverUrl),
                      presetId: form.presetId,
                      enabled: form.enabled,
                      isDefault: form.isDefault,
                      updatedAt: timestamp,
                  };

        await uploadDestinationStore.save(destination);
        editing = false;
        editingTargetId = null;
    }

    async function testDestination(
        destination: UploadDestination,
    ): Promise<void> {
        testingId = destination.id;
        try {
            await uploadDestinationStore.test(destination);
        } finally {
            testingId = null;
        }
    }

    async function deleteDestination(
        destination: UploadDestination,
    ): Promise<void> {
        if (editingTargetId === destination.id) {
            editing = false;
            editingTargetId = null;
        }
        await uploadDestinationStore.delete(destination.id, pubkeyHex);
    }

    async function fetchBud03(): Promise<void> {
        if (!rxNostr || !pubkeyHex) return;
        await uploadDestinationStore.fetchBud03(rxNostr, pubkeyHex);
    }

    async function publishBud03(): Promise<void> {
        if (!rxNostr || !pubkeyHex) return;
        await uploadDestinationStore.publishBud03(rxNostr, pubkeyHex);
    }
</script>

{#snippet destinationForm()}
    <div class="destination-form">
        <label>
            <span
                >{$_("settingsDialog.uploadDestinationPreset") ||
                    "プリセット"}</span
            >
            <select
                value={form.presetId}
                onchange={(event) =>
                    applyPreset(
                        (event.currentTarget as HTMLSelectElement)
                            .value as UploadPresetId,
                    )}
            >
                <option value="custom">custom</option>
                {#each presetOptions as preset}
                    <option value={preset.id}>{preset.name}</option>
                {/each}
            </select>
        </label>
        <label>
            <span
                >{$_("settingsDialog.uploadDestinationProtocol") ||
                    "Protocol"}</span
            >
            <select bind:value={form.protocol}>
                <option value="blossom">Blossom</option>
                <option value="nip96">NIP-96 legacy</option>
                <option value="custom-http">Custom HTTP</option>
            </select>
        </label>
        <label>
            <span>{$_("settingsDialog.uploadDestinationName") || "名前"}</span>
            <input bind:value={form.name} />
        </label>
        <label>
            <span>URL</span>
            <input bind:value={form.serverUrl} inputmode="url" />
        </label>
        <div class="checkbox-group">
            <label class="checkbox-row">
                <input type="checkbox" bind:checked={form.enabled} />
                <span
                    >{$_("settingsDialog.uploadDestinationEnabled") ||
                        "有効"}</span
                >
            </label>
            <label class="checkbox-row">
                <input type="checkbox" bind:checked={form.isDefault} />
                <span
                    >{$_("settingsDialog.uploadDestinationDefault") ||
                        "既定"}</span
                >
            </label>
        </div>
        <div class="form-actions">
            <Button
                variant="primary"
                shape="rounded"
                onClick={saveForm}
                disabled={!form.name.trim() || !form.serverUrl.trim()}
            >
                {$_("settingsDialog.uploadDestinationSave") || "保存"}
            </Button>
            <Button variant="default" shape="rounded" onClick={cancelEdit}>
                {$_("postComponent.cancel") || "キャンセル"}
            </Button>
        </div>
    </div>
{/snippet}

<div class="setting-section upload-destination-section">
    <div class="setting-row">
        <div class="setting-label-group">
            <span class="setting-label">
                {$_("settingsDialog.upload_destination") || "アップロード先"}
            </span>
            <span class="upload-summary">
                {destinationState.defaultDestination?.name ||
                    $_("settingsDialog.uploadDestinationNone") ||
                    "未設定"}
            </span>
        </div>
        <div class="setting-control">
            <Button
                variant="default"
                shape="rounded"
                className="upload-destination-manage-btn"
                onClick={() => (expanded = !expanded)}
            >
                <div class="server-cog-icon svg-icon" aria-hidden="true"></div>
                <span class="btn-text">
                    {expanded
                        ? $_("settingsDialog.uploadDestinationClose") ||
                          "閉じる"
                        : $_("settingsDialog.uploadDestinationManage") ||
                          "管理"}
                </span>
            </Button>
        </div>
    </div>

    {#if expanded}
        <div class="upload-panel">
            {#each destinationState.destinations as destination}
                <div class="destination-row">
                    <div class="destination-main">
                        <div class="destination-content">
                            <div class="destination-title">
                                <span>{destination.name}</span>
                                {#if destination.isDefault}
                                    <span class="badge"
                                        >{$_(
                                            "settingsDialog.uploadDestinationDefault",
                                        ) || "既定"}</span
                                    >
                                {/if}
                                {#if !destination.enabled}
                                    <span class="badge muted"
                                        >{$_(
                                            "settingsDialog.uploadDestinationDisabled",
                                        ) || "無効"}</span
                                    >
                                {/if}
                            </div>
                            <div class="destination-meta">
                                {destination.protocol} / {destination.presetId ||
                                    "custom"} / {formatMaxSize(
                                    destination.capabilities.maxUploadSize,
                                )}
                            </div>
                            <div class="destination-meta mime-meta">
                                <span>{getMimeSummary(destination)}</span>
                                {#if canExpandMimeTypes(destination)}
                                    <button
                                        type="button"
                                        class="mime-toggle"
                                        onclick={() =>
                                            toggleMimeTypes(destination.id)}
                                    >
                                        {expandedMimeDestinations[
                                            destination.id
                                        ]
                                            ? $_(
                                                  "settingsDialog.uploadDestinationMimeCollapse",
                                              ) || "折りたたむ"
                                            : $_(
                                                  "settingsDialog.uploadDestinationMimeExpand",
                                              ) || "すべて表示"}
                                    </button>
                                {/if}
                            </div>
                        </div>
                        <div class="destination-order-actions">
                            <Button
                                variant="default"
                                shape="rounded"
                                className="destination-order-button"
                                ariaLabel={$_(
                                    "settingsDialog.uploadDestinationMoveUp",
                                ) || "Up"}
                                onClick={() =>
                                    uploadDestinationStore.move(
                                        destination.id,
                                        "up",
                                        pubkeyHex,
                                    )}
                                disabled={destinationState.destinations[0]
                                    ?.id === destination.id}
                            >
                                <span class="arrow-up-icon svg-icon"></span>
                            </Button>
                            <Button
                                variant="default"
                                shape="rounded"
                                className="destination-order-button"
                                ariaLabel={$_(
                                    "settingsDialog.uploadDestinationMoveDown",
                                ) || "Down"}
                                onClick={() =>
                                    uploadDestinationStore.move(
                                        destination.id,
                                        "down",
                                        pubkeyHex,
                                    )}
                                disabled={destinationState.destinations[
                                    destinationState.destinations.length - 1
                                ]?.id === destination.id}
                            >
                                <span class="arrow-down-icon svg-icon"></span>
                            </Button>
                        </div>
                    </div>
                    <div class="destination-actions">
                        <Button
                            variant="default"
                            shape="rounded"
                            onClick={() => testDestination(destination)}
                            disabled={testingId === destination.id}
                        >
                            {testingId === destination.id
                                ? $_(
                                      "settingsDialog.uploadDestinationTesting",
                                  ) || "確認中"
                                : $_("settingsDialog.uploadDestinationTest") ||
                                  "接続テスト"}
                        </Button>
                        <Button
                            variant="default"
                            shape="rounded"
                            onClick={() =>
                                uploadDestinationStore.setDefault(
                                    destination.id,
                                    pubkeyHex,
                                )}
                            disabled={destination.isDefault}
                        >
                            {$_("settingsDialog.uploadDestinationSetDefault") ||
                                "既定"}
                        </Button>
                        <Button
                            variant="default"
                            shape="rounded"
                            onClick={() => startEdit(destination)}
                        >
                            {$_("settingsDialog.uploadDestinationEdit") ||
                                "編集"}
                        </Button>
                        <Button
                            variant="default"
                            shape="rounded"
                            onClick={() => deleteDestination(destination)}
                            disabled={destinationState.destinations.length <= 1}
                        >
                            {$_("settingsDialog.uploadDestinationDelete") ||
                                "削除"}
                        </Button>
                    </div>
                    {#if destinationState.testResults[destination.id]?.message}
                        <div
                            class:error={!destinationState.testResults[
                                destination.id
                            ].success}
                            class="test-result"
                        >
                            {destinationState.testResults[destination.id]
                                .message}
                        </div>
                    {/if}
                </div>

                {#if editing && editingTargetId === destination.id}
                    {@render destinationForm()}
                {/if}
            {/each}

            {#if editing && !editingTargetId}
                {@render destinationForm()}
            {:else if !editing}
                <div class="panel-actions">
                    <Button
                        variant="default"
                        shape="rounded"
                        onClick={startAdd}
                    >
                        {$_("settingsDialog.uploadDestinationAdd") || "追加"}
                    </Button>
                    <Button
                        variant="default"
                        shape="rounded"
                        onClick={fetchBud03}
                        disabled={!canUseBud03 ||
                            destinationState.bud03Fetching}
                    >
                        {destinationState.bud03Fetching
                            ? $_(
                                  "settingsDialog.uploadDestinationBud03Fetching",
                              ) || "BUD-03 取得中"
                            : $_(
                                  "settingsDialog.uploadDestinationBud03Fetch",
                              ) || "BUD-03 から取得"}
                    </Button>
                    <Button
                        variant="primary"
                        shape="rounded"
                        onClick={publishBud03}
                        disabled={!canUseBud03 ||
                            destinationState.bud03Publishing ||
                            !destinationState.destinations.some(
                                (destination) =>
                                    destination.protocol === "blossom" &&
                                    destination.enabled,
                            )}
                    >
                        {destinationState.bud03Publishing
                            ? $_(
                                  "settingsDialog.uploadDestinationBud03Publishing",
                              ) || "BUD-03 publish 中"
                            : $_(
                                  "settingsDialog.uploadDestinationBud03Publish",
                              ) || "BUD-03 へ publish"}
                    </Button>
                    <InfoPopoverButton
                        side="top"
                        ariaLabel={$_(
                            "settingsDialog.uploadDestinationBud03InfoLabel",
                        ) || "BUD-03 の説明"}
                    >
                        <div class="bud03-popover">
                            <p>
                                {$_(
                                    "settingsDialog.uploadDestinationBud03InfoScope",
                                ) ||
                                    "BUD-03 は Blossom のアップロード先だけを kind 10063 の server tag として保存します。NIP-96 と Custom HTTP は publish 対象外です。"}
                            </p>
                            <p>
                                {$_(
                                    "settingsDialog.uploadDestinationBud03InfoOrder",
                                ) ||
                                    "publish 時は有効な Blossom アップロード先をこの一覧の順番で保存し、先頭のアップロード先が優先されます。"}
                            </p>
                            <p>
                                {$_(
                                    "settingsDialog.uploadDestinationBud03InfoFetch",
                                ) ||
                                    "BUD-03 から取得すると、Blossom のアップロード先だけを取得結果で置き換えます。"}
                            </p>
                        </div>
                    </InfoPopoverButton>
                </div>
                {#if destinationState.bud03Status}
                    <div class="test-result">
                        {destinationState.bud03Status}
                    </div>
                {/if}
            {/if}
        </div>
    {/if}
</div>

<style>
    .upload-destination-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    :global(.upload-destination-manage-btn) {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .server-cog-icon {
        mask-image: url("/icons/server-solid-full.svg");
    }

    .upload-summary,
    .destination-meta {
        color: var(--text-light);
        font-size: 0.875rem;
    }

    .mime-meta {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px;
        overflow-wrap: anywhere;
    }

    .mime-toggle {
        border: none;
        background: transparent;
        color: var(--link-color, var(--primary-color));
        cursor: pointer;
        font: inherit;
        padding: 0;
        text-decoration: underline;
    }

    .upload-panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .destination-row,
    .destination-form {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .destination-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        font-weight: 600;
    }

    .destination-main {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
    }

    .destination-content {
        min-width: 0;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 4px;
    }

    .destination-order-actions {
        display: flex;
        flex-shrink: 0;
        gap: 4px;

        :global(.destination-order-button) {
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            padding: 0;
        }
    }

    :global(.destination-order-button .svg-icon) {
        width: 16px;
        height: 16px;
    }

    .arrow-up-icon {
        mask-image: url("/icons/arrow-up-solid-full.svg");
    }

    .arrow-down-icon {
        mask-image: url("/icons/arrow-down-solid-full.svg");
    }

    .badge {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 2px 7px;
        font-size: 0.75rem;
        font-weight: 400;
    }

    .badge.muted {
        opacity: 0.6;
    }

    .destination-actions,
    .form-actions,
    .panel-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }

    .test-result {
        font-size: 0.875rem;
        color: var(--text-light);
    }

    .test-result.error {
        color: #c62828;
    }

    .bud03-popover {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .bud03-popover p {
        margin: 0;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.875rem;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .checkbox-row {
        flex-direction: row;
        align-items: center;
        gap: 8px;
        min-height: 32px;
    }

    .checkbox-row input[type="checkbox"] {
        width: 24px;
        height: 24px;
        min-height: 24px;
        margin: 0;
        padding: 0;
        accent-color: var(--primary-color);
    }

    input,
    select {
        min-height: 42px;
        padding: 6px;
        font-size: 1rem;
    }
</style>
