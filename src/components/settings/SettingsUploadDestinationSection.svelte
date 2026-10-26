<script lang="ts">
    import { onMount, tick } from "svelte";
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";
    import type { RxNostr } from "rx-nostr";
    import { preventKeyboardFocusChange } from "../../lib/utils/keyboardFocusUtils";
    import Button from "../Button.svelte";
    import InfoPopoverButton from "../InfoPopoverButton.svelte";
    import { getAppRuntimeEnvironment } from "../../lib/appRuntimeEnvironment";
    import { uploadDestinationStore } from "../../stores/uploadDestinationStore.svelte";
    import { authState } from "../../stores/authStore.svelte";
    import type {
        UploadDestination,
        UploadPresetId,
    } from "../../lib/types";
    import {
        DEFAULT_UPLOAD_CAPABILITIES,
        UPLOAD_DESTINATION_PRESETS,
        createUploadDestinationFromPreset,
        findUploadDestinationPresetIdentity,
        getUploadDestinationDisplayName,
        normalizeServerUrl,
    } from "../../lib/upload/uploadDestinationPresets";
    import { resolveUploadDestinationForUse } from "../../lib/upload/uploadDestinationResolver";
    import { summarizeRelaySync } from "../../lib/upload/relayUploadDestinationSync";
    import { canonicalizeNip96UploadUrl } from "../../lib/upload/nip96UrlPolicy";

    interface Props {
        rxNostr?: RxNostr | null;
    }

    let { rxNostr = null }: Props = $props();
    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
    const panelId = $props.id();
    let panelElement: HTMLDivElement | undefined = $state();
    let presetSelect: HTMLSelectElement | undefined = $state();
    let menuCloseFocus: "form" | "handled" | null = null;
    let openMenuId: string | null = $state(null);

    const initialPreset = UPLOAD_DESTINATION_PRESETS.find(
        (preset) => preset.id === "blossom-band",
    )!;

    const emptyForm = {
        id: "",
        protocol: initialPreset.protocol,
        serverUrl: initialPreset.serverUrl,
        presetId: initialPreset.id,
        enabled: true,
        isDefault: true,
    };

    let expanded = $state(false);
    let editing = $state(false);
    let editingTargetId: string | null = $state(null);
    let serverUrlInputElement: HTMLInputElement | null = $state(null);
    let form = $state({ ...emptyForm });
    let testingId: string | null = $state(null);
    let formError: string | null = $state(null);
    let expandedMimeDestinations = $state<Record<string, boolean>>({});
    let destinationState = $derived(uploadDestinationStore.value);
    let currentScope = $state<string | null>(null);
    let pubkeyHex = $derived(
        authState.value.isAuthenticated ? authState.value.pubkey || null : null,
    );
    let canUseRelaySync = $derived(Boolean(rxNostr && pubkeyHex));

    const presetMap = new Map(
        UPLOAD_DESTINATION_PRESETS.map((preset) => [preset.id, preset]),
    );

    const blossomPresetIds: UploadPresetId[] = [
        "blossom-band",
        "cdn-nostrcheck-me",
        "nostr-download",
        "blossom-primal-net",
        "files-sovbit-host",
    ];

    const nip96PresetIds: UploadPresetId[] = [
        "nostr-build",
        "nostrcheck-me",
        "share-yabu-me",
        "nostpic-com",
    ];

    const blossomPresetOptions = blossomPresetIds.map(
        (presetId) => presetMap.get(presetId)!,
    );

    const nip96PresetOptions = nip96PresetIds.map(
        (presetId) => presetMap.get(presetId)!,
    );

    onMount(() => {
        currentScope = pubkeyHex;
        void uploadDestinationStore.load(currentScope);
    });

    $effect(() => {
        if (currentScope === pubkeyHex) return;
        currentScope = pubkeyHex;
        testingId = null;
        openMenuId = null;
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
            return $_("settingsDialog.uploadDestinationMimeUnknown");
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
        formError = null;
        editing = true;
        editingTargetId = null;
        expanded = true;
        void tick().then(() => presetSelect?.focus());
    }

    function cancelEdit(): void {
        const targetId = editingTargetId;
        editing = false;
        editingTargetId = null;
        formError = null;
        void tick().then(() => focusDestination(targetId));
    }

    function focusDestination(id: string | null): void {
        const row = Array.from(panelElement?.querySelectorAll<HTMLElement>("[data-destination-id]") ?? [])
            .find((element) => element.dataset.destinationId === id);
        const target = row?.querySelector<HTMLButtonElement>("[data-destination-menu]")
            ?? panelElement?.querySelector<HTMLButtonElement>(".destination-add-button");
        target?.focus({ preventScroll: true });
    }

    function handleMenuClose(event: Event): void {
        const target = menuCloseFocus;
        menuCloseFocus = null;
        if (!target) return;
        event.preventDefault();
        if (target === "form") void tick().then(() => presetSelect?.focus());
    }

    async function moveDestination(destination: UploadDestination, direction: "up" | "down"): Promise<void> {
        menuCloseFocus = "handled";
        await uploadDestinationStore.move(destination.id, direction, pubkeyHex);
        await tick();
        focusDestination(destination.id);
    }

    function startEdit(destination: UploadDestination): void {
        if (editingTargetId === destination.id) {
            cancelEdit();
            return;
        }
        form = {
            id: destination.id,
            protocol: destination.protocol,
            serverUrl: destination.serverUrl,
            presetId: destination.presetId ?? "custom",
            enabled: destination.enabled,
            isDefault: destination.isDefault,
        };
        formError = null;
        editing = true;
        editingTargetId = destination.id;
        expanded = true;
    }

    function applyPreset(presetId: UploadPresetId): void {
        form.presetId = presetId;
        formError = null;
        if (presetId === "custom") {
            form.serverUrl = "";
            return;
        }
        const preset = UPLOAD_DESTINATION_PRESETS.find(
            (item) => item.id === presetId,
        );
        if (!preset) return;
        form.protocol = preset.protocol;
        form.serverUrl = preset.serverUrl;
    }

    function handleClearServerUrl(): void {
        form.serverUrl = "";
        form.presetId = "custom";
        formError = null;
        setTimeout(() => {
            serverUrlInputElement?.focus({ preventScroll: true });
        }, 0);
    }

    async function saveForm(): Promise<void> {
        const timestamp = Date.now();
        const preset = UPLOAD_DESTINATION_PRESETS.find(
            (item) => item.id === form.presetId,
        );
        const existing = destinationState.destinations.find(
            (destination) => destination.id === form.id,
        );
        const rawServerUrl = form.serverUrl || preset?.serverUrl || "";
        const protocol = form.protocol;
        let serverUrl = normalizeServerUrl(rawServerUrl);
        if (protocol === "nip96") {
            try {
                serverUrl = canonicalizeNip96UploadUrl(rawServerUrl).url;
            } catch {
                formError = $_("settingsDialog.uploadDestinationInvalidNip96Url")
                    || "有効な絶対 HTTP(S) URL を入力してください";
                return;
            }
        }
        formError = null;
        const presetIdentity = findUploadDestinationPresetIdentity({
            protocol,
            presetId: form.presetId,
            serverUrl,
        });
        const resolvedUploadUrl = protocol === "nip96"
            ? presetIdentity?.resolvedUploadUrl ?? null
            : null;
        const destinationName = getUploadDestinationDisplayName({
            serverUrl,
            resolvedUploadUrl,
            fallbackName: preset?.name ?? existing?.name ?? "Custom NIP-96",
            protocol,
            presetId: form.presetId,
        });
        const baseDestination =
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
                      name: destinationName,
                      serverUrl,
                      enabled: form.enabled,
                  }
                : existing ??
                    createUploadDestinationFromPreset({
                        preset: preset ?? {
                            id: "custom",
                            name: destinationName,
                            protocol: form.protocol,
                            serverUrl: form.serverUrl,
                            capabilities: DEFAULT_UPLOAD_CAPABILITIES,
                        },
                        pubkeyHex,
                        isDefault:
                            form.isDefault ||
                            destinationState.destinations.length === 0,
                        now: timestamp,
                    });
        let unchangedNip96 = false;
        if (existing?.protocol === "nip96" && protocol === "nip96") {
            try {
                unchangedNip96 = canonicalizeNip96UploadUrl(existing.serverUrl).url === serverUrl;
            } catch {
                // An invalid legacy URL can be repaired, but its resolution must be discarded.
            }
        }
        const existingResolvedUrl = unchangedNip96 && existing ? resolveUploadDestinationForUse(existing, { pubkeyHex }).resolvedUploadUrl : undefined;
        const { resolvedUploadUrl: _previousResolvedUploadUrl, nip96ServerUrl: _previousServer, nip96UrlMode: _previousMode, ...destinationWithoutResolvedUploadUrl } = baseDestination;
        const destination: UploadDestination = {
            ...destinationWithoutResolvedUploadUrl,
            name: destinationName,
            protocol,
            serverUrl,
            presetId: form.presetId,
            enabled: form.enabled,
            isDefault: form.isDefault,
            updatedAt: timestamp,
            ...(unchangedNip96 && existing ? {
                ...(existingResolvedUrl ? { resolvedUploadUrl: existingResolvedUrl } : {}),
                ...(existing.nip96ServerUrl ? { nip96ServerUrl: existing.nip96ServerUrl } : {}),
                ...(existing.nip96UrlMode ? { nip96UrlMode: existing.nip96UrlMode } : {}),
            } : resolvedUploadUrl ? { resolvedUploadUrl, nip96ServerUrl: presetIdentity?.nip96ServerUrl, nip96UrlMode: 'direct' as const } : {}),
        };

        const returnTargetId = editingTargetId;
        await uploadDestinationStore.save(destination);
        editing = false;
        editingTargetId = null;
        await tick();
        focusDestination(returnTargetId);
    }

    async function testDestination(
        destination: UploadDestination,
    ): Promise<void> {
        testingId = destination.id;
        const scope = currentScope;
        try {
            await uploadDestinationStore.test(destination);
        } finally {
            if (currentScope === scope && testingId === destination.id) testingId = null;
        }
    }

    async function deleteDestination(
        destination: UploadDestination,
    ): Promise<void> {
        menuCloseFocus = "handled";
        const index = destinationState.destinations.findIndex((item) => item.id === destination.id);
        const nextId = destinationState.destinations[index + 1]?.id
            ?? destinationState.destinations[index - 1]?.id ?? null;
        if (editingTargetId === destination.id) {
            editing = false;
            editingTargetId = null;
        }
        await uploadDestinationStore.delete(destination.id, pubkeyHex);
        await tick();
        focusDestination(nextId);
    }

    async function fetchFromRelays(): Promise<void> {
        if (!rxNostr || !pubkeyHex) return;
        await uploadDestinationStore.fetchFromRelays(rxNostr, pubkeyHex);
    }

    async function publishToRelays(): Promise<void> {
        if (!rxNostr || !pubkeyHex) return;
        await uploadDestinationStore.publishToRelays(rxNostr, pubkeyHex);
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
                bind:this={presetSelect}
                value={form.presetId}
                onchange={(event) =>
                    applyPreset(
                        (event.currentTarget as HTMLSelectElement)
                            .value as UploadPresetId,
                    )}
            >
                <optgroup label="Blossom">
                    {#each blossomPresetOptions as preset}
                        <option value={preset.id}>{preset.name}</option>
                    {/each}
                </optgroup>
                <optgroup label="NIP-96">
                    {#each nip96PresetOptions as preset}
                        <option value={preset.id}>{preset.name}</option>
                    {/each}
                </optgroup>
                <option value="custom">custom</option>
            </select>
        </label>
        {#if form.presetId === "custom"}
            <label>
                <span
                    >{$_("settingsDialog.uploadDestinationProtocol") ||
                        "Protocol"}</span
                >
                <select
                    bind:value={form.protocol}
                    onchange={() => (formError = null)}
                >
                    <option value="blossom">Blossom</option>
                    <option value="nip96">NIP-96 legacy</option>
                    <option value="custom-http">Custom HTTP</option>
                </select>
            </label>
            <div class="url-field">
                <label for="upload-destination-url-input">
                    <span>URL</span>
                </label>
                <div class="url-input-shell">
                    <input
                        id="upload-destination-url-input"
                        class="upload-destination-url-input"
                        bind:this={serverUrlInputElement}
                        bind:value={form.serverUrl}
                        oninput={() => (formError = null)}
                        inputmode="url"
                    />
                    {#if form.serverUrl.trim().length > 0}
                        <Button
                            type="button"
                            className="upload-destination-url-clear-button"
                            variant="default"
                            shape="square"
                            contentLayout="icon"
                            ariaLabel={$_("clearInput") || "入力内容を消去"}
                            onClick={handleClearServerUrl}
                            onmousedown={preventKeyboardFocusChange}
                            ontouchstart={preventKeyboardFocusChange}
                        >
                            <div
                                class="url-clear-input-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                        </Button>
                    {/if}
                </div>
                {#if formError}
                    <span class="form-error" role="alert">{formError}</span>
                {/if}
            </div>
        {/if}
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
                disabled={!form.serverUrl.trim()}
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
            <div class="setting-label-with-icon">
                <span
                    class="setting-menu-icon setting-menu-mask-icon upload-destination-setting-icon"
                    aria-hidden="true"
                ></span>
                <span class="upload-destination-label-copy">
                    <span class="setting-label">
                        {$_("settingsDialog.upload_destination") || "アップロード先"}
                    </span>
                    <span class="upload-summary">
                        {destinationState.defaultDestination?.name ||
                            $_("settingsDialog.uploadDestinationNone") ||
                            "未設定"}
                    </span>
                </span>
            </div>
        </div>
        <div class="setting-control">
            <Button
                variant="default"
                shape="rounded"
                contentLayout="text"
                className="upload-destination-manage-btn"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => (expanded = !expanded)}
            >
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
        <div class="upload-panel" id={panelId} bind:this={panelElement}>
            <div class="list-heading">
                <div class="section-heading">
                    <h3>{$_("settingsDialog.uploadDestinationServers")}</h3>
                    {#if destinationState.destinations.some((destination) => destination.protocol === "blossom")}
                        <InfoPopoverButton
                            side="top"
                            sideOffset={4}
                            ariaLabel={$_(
                                "settingsDialog.uploadDestinationBlossomTestInfoLabel",
                            ) || "Blossom 接続テストの説明"}
                        >
                            <div class="blossom-test-popover">
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationBlossomTestInfoNoUpload",
                                    ) ||
                                        "Blossomの接続テストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。"}
                                </p>
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationBlossomTestInfoAuthorization",
                                    ) ||
                                        "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。"}
                                </p>
                            </div>
                        </InfoPopoverButton>
                    {/if}
                </div>
                {#if !editing}
                    <Button variant="default" shape="rounded" className="destination-add-button" onClick={startAdd}>
                        {$_("settingsDialog.uploadDestinationAdd")}
                    </Button>
                {/if}
            </div>
            {#if editing && !editingTargetId}
                {@render destinationForm()}
            {/if}
            <div class="destination-list" role="list" aria-label={$_("settingsDialog.uploadDestinationServers")}>
                {#each destinationState.destinations as destination, index (destination.id)}
                    <div class="destination-row" role="listitem" data-destination-id={destination.id}>
                        <div class="destination-main">
                            <div class="destination-content">
                                <div class="destination-title">
                                    <span class="destination-name">{destination.name}</span>
                                    {#if destination.isDefault}
                                        <span class="badge default-badge">{$_("settingsDialog.uploadDestinationDefault")}</span>
                                    {/if}
                                    {#if !destination.enabled}
                                        <span class="badge muted">{$_("settingsDialog.uploadDestinationDisabled")}</span>
                                    {/if}
                                </div>
                                <div class="destination-meta">
                                    {destination.protocol === "blossom" ? "Blossom" : destination.protocol === "nip96" ? "NIP-96" : "Custom HTTP"}
                                    · {destination.capabilities.maxUploadSize ? $_("settingsDialog.uploadDestinationMaxSize", { values: { size: formatMaxSize(destination.capabilities.maxUploadSize) } }) : formatMaxSize(null)}
                                </div>
                                <div class="destination-meta mime-meta">
                                    <span id={panelId + "-mime-" + destination.id}>{getMimeSummary(destination)}</span>
                                    {#if canExpandMimeTypes(destination)}
                                        <button type="button" class="mime-toggle"
                                            aria-expanded={Boolean(expandedMimeDestinations[destination.id])}
                                            aria-controls={panelId + "-mime-" + destination.id}
                                            onclick={() => toggleMimeTypes(destination.id)}>
                                            {$_(expandedMimeDestinations[destination.id] ? "settingsDialog.uploadDestinationMimeCollapse" : "settingsDialog.uploadDestinationMimeExpand")}
                                        </button>
                                    {/if}
                                </div>
                            </div>
                            <div class="destination-actions">
                                <Button variant="default" shape="rounded" onClick={() => testDestination(destination)} disabled={testingId === destination.id}>
                                    {$_(testingId === destination.id ? "settingsDialog.uploadDestinationTesting" : "settingsDialog.uploadDestinationTest")}
                                </Button>
                                <DropdownMenu.Root open={openMenuId === destination.id}
                                    onOpenChange={(open) => (openMenuId = open ? destination.id : null)}>
                                    <DropdownMenu.Trigger class="destination-menu-trigger" data-destination-menu
                                        aria-label={$_("settingsDialog.uploadDestinationActions", { values: { name: destination.name } })}>
                                        <span class="more-icon svg-icon" aria-hidden="true"></span>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Portal to={overlayTarget}>
                                        <DropdownMenu.Content class="destination-menu-content" align="end" sideOffset={4}
                                            preventScroll={false} onCloseAutoFocus={handleMenuClose}>
                                            <DropdownMenu.Item class="destination-menu-item" disabled={destination.isDefault}
                                                onSelect={() => void uploadDestinationStore.setDefault(destination.id, pubkeyHex)}>
                                                {$_("settingsDialog.uploadDestinationSetDefault")}
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item class="destination-menu-item" onSelect={() => {
                                                startEdit(destination);
                                                if (editing) menuCloseFocus = "form";
                                            }}>
                                                {$_("settingsDialog.uploadDestinationEdit")}
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item class="destination-menu-item" disabled={index === 0}
                                                onSelect={() => void moveDestination(destination, "up")}>
                                                {$_("settingsDialog.uploadDestinationMoveUp")}
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item class="destination-menu-item" disabled={index === destinationState.destinations.length - 1}
                                                onSelect={() => void moveDestination(destination, "down")}>
                                                {$_("settingsDialog.uploadDestinationMoveDown")}
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Separator class="destination-menu-separator" />
                                            <DropdownMenu.Item class="destination-menu-item destination-menu-danger" disabled={destinationState.destinations.length <= 1}
                                                onSelect={() => void deleteDestination(destination)}>
                                                {$_("settingsDialog.uploadDestinationDelete")}
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                        </div>
                        {#if testingId === destination.id || destinationState.testResults[destination.id]}
                            {@const result = destinationState.testResults[destination.id]}
                            <div class="test-result" class:error={testingId !== destination.id && !result?.success} role="status" aria-live="polite">
                                {#if testingId === destination.id}
                                    {$_("settingsDialog.uploadDestinationTesting")}
                                {:else if result}
                                    <span>{$_(result.success ? "settingsDialog.uploadDestinationTestSuccess" : "settingsDialog.uploadDestinationTestFailure")}</span>
                                    {#if result.message}<span class="test-result-detail">{result.message}</span>{/if}
                                {/if}
                            </div>
                        {/if}
                        {#if editing && editingTargetId === destination.id}
                            {@render destinationForm()}
                        {/if}
                    </div>
                {/each}
            </div>
            {#if !editing}
                <section class="relay-sync-section" aria-labelledby={panelId + "-relay-heading"}>
                    <div class="relay-sync-toolbar">
                        <div class="section-heading">
                            <h3 id={panelId + "-relay-heading"}>{$_("settingsDialog.uploadDestinationRelayTitle")}</h3>
                        </div>
                        <div class="panel-actions">
                            <Button
                                variant="default"
                                shape="rounded"
                                onClick={fetchFromRelays}
                                disabled={!canUseRelaySync ||
                                    destinationState.relayFetching || destinationState.relayPublishing}
                            >
                                {destinationState.relayFetching
                                    ? $_(
                                          "settingsDialog.uploadDestinationRelayFetching",
                                      ) || "取得中"
                                    : $_(
                                          "settingsDialog.uploadDestinationRelayFetch",
                                      ) || "取得"}
                            </Button>
                            <Button
                                variant="default"
                                shape="rounded"
                                onClick={publishToRelays}
                                disabled={!canUseRelaySync ||
                                    destinationState.relayFetching || destinationState.relayPublishing ||
                                    !destinationState.destinations.some(
                                        (destination) =>
                                            (destination.protocol === "blossom" || destination.protocol === "nip96") &&
                                            destination.enabled,
                                    )}
                            >
                                {destinationState.relayPublishing
                                    ? $_(
                                          "settingsDialog.uploadDestinationRelayPublishing",
                                      ) || "送信中"
                                    : $_(
                                          "settingsDialog.uploadDestinationRelayPublish",
                                      ) || "送信"}
                            </Button>
                        </div>
                        <InfoPopoverButton
                            side="top"
                            ariaLabel={$_(
                                "settingsDialog.uploadDestinationRelayInfoLabel",
                            ) || "リレー同期の説明"}
                        >
                            <div class="bud03-popover">
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationRelayDescription",
                                    )}
                                </p>
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationRelayInfoScope",
                                    ) ||
                                        "Blossom は kind 10063、NIP-96 は kind 10096 として同期します。Custom HTTP は対象外です。"}
                                </p>
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationRelayInfoOrder",
                                    ) ||
                                        "送信時は各プロトコルの有効なアップロード先を一覧の順番で保存します。"}
                                </p>
                                <p>
                                    {$_(
                                        "settingsDialog.uploadDestinationRelayInfoFetch",
                                    ) ||
                                        "取得に成功したプロトコルだけを取得結果で置き換えます。"}
                                </p>
                            </div>
                        </InfoPopoverButton>
                    </div>
                    {#if destinationState.relaySyncResults}
                        <div class="test-result" role="status" aria-live="polite">
                            <p>{$_('settingsDialog.uploadDestinationRelaySummary.' + summarizeRelaySync(destinationState.relaySyncResults))}</p>
                            {#each (['blossom', 'nip96'] as const) as protocol}
                                {@const result = destinationState.relaySyncResults[protocol]}
                                <p>{protocol === 'blossom' ? 'Blossom' : 'NIP-96'}: {$_('settingsDialog.uploadDestinationRelayOutcome.' + result.status)}{#if result.reason} — {$_('settingsDialog.uploadDestinationRelayReason.' + result.reason)}{/if}</p>
                            {/each}
                        </div>
                    {/if}
                </section>
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

    .upload-destination-setting-icon {
        mask-image: url("/icons/cloud_upload_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .upload-destination-label-copy {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .setting-label-group {
        min-width: 0;
    }

    .setting-control {
        flex-shrink: 0;
    }

    .upload-summary {
        overflow-wrap: anywhere;
    }

    :global(.upload-destination-manage-btn) {
        white-space: nowrap;
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
        min-inline-size: 0;
        min-block-size: 0;
        height: auto;
        border: none;
        background: transparent;
        color: var(--link);
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

    .list-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
    }

    .section-heading {
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
    }

    h3 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        min-width: 0;
    }

    .destination-list {
        min-width: 0;
    }

    .destination-row {
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .destination-row:first-child {
        padding-top: 0;
    }
    .destination-row:last-child {
        border-bottom: 0;
        padding-bottom: 0;
    }

    .destination-form {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
    }

    .destination-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        font-weight: 600;
    }

    .destination-name {
        overflow-wrap: anywhere;
        min-width: 0;
    }

    .destination-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px 12px;
        flex-wrap: wrap;
    }

    .destination-content {
        min-width: 0;
        display: flex;
        flex: 1 1 200px;
        flex-direction: column;
        gap: 2px;
        overflow-wrap: anywhere;
    }

    :global(.destination-menu-trigger) {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 44px;
        min-height: 44px;
        padding: 0;
        border-radius: 6px;
        color: var(--text);
        background: transparent;
    }

    .more-icon {
        mask-image: url("/icons/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 24px;
        height: 24px;
    }

    :global(.destination-menu-content) {
        box-sizing: border-box;
        max-width: min(240px, var(--bits-dropdown-menu-content-available-width));
        max-height: var(--bits-dropdown-menu-content-available-height);
        overflow: auto;
        padding: 4px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--dialog-bg);
        color: var(--text);
        box-shadow: 0 6px 20px rgb(0 0 0 / 18%);
        z-index: 100002;
    }

    :global(.destination-menu-item) {
        display: flex;
        align-items: center;
        min-height: 44px;
        padding: 8px 12px;
        box-sizing: border-box;
        border-radius: 4px;
        overflow-wrap: anywhere;
        cursor: pointer;
    }

    :global(.destination-menu-item[data-highlighted]:not([data-disabled])) {
        background: var(--btn-hover-bg);
    }

    :global(.destination-menu-item[data-disabled]) {
        opacity: 0.5;
        cursor: default;
    }
    :global(.destination-menu-danger) {
        color: var(--danger);
    }
    :global(.destination-menu-separator) {
        height: 1px;
        background: var(--border);
        margin: 4px;
    }

    .relay-sync-section {
        border-top: 1px solid var(--border);
        padding-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
    }

    .relay-sync-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        white-space: nowrap;
    }

    .relay-sync-toolbar .panel-actions {
        flex-wrap: nowrap;
        gap: 4px;
    }

    .badge {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 2px 7px;
        font-size: 0.75rem;
        font-weight: 400;
    }

    .badge.default-badge {
        background-color: var(--theme);
        border-color: var(--theme);
        color: white;
        font-weight: 500;
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

    .destination-actions {
        justify-content: flex-end;
        margin-inline-start: auto;
    }

    .test-result {
        overflow-wrap: anywhere;
        font-size: 0.875rem;
        color: var(--text-light);
    }

    .test-result-detail {
        display: block;
    }

    .test-result.error {
        color: var(--danger);
    }

    .form-error {
        color: var(--danger);
        font-size: 0.875rem;
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

    .blossom-test-popover {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .blossom-test-popover p {
        margin: 0;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.875rem;
    }

    .url-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.875rem;
    }

    .url-input-shell {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
    }

    .upload-destination-url-input {
        flex: 1 1 auto;
        min-width: 0;
        min-height: 46px;
        padding: 8px 47px 8px 10px;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text);
        font: inherit;
        outline: none;
    }

    .upload-destination-url-input:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -1px;
    }

    :global(.ehagaki-app-root button.upload-destination-url-clear-button) {
        position: absolute;
        inset-block: 50%;
        inset-inline-end: 2px;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        padding: 0;
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
        border: none;
        color: var(--text-muted);
        z-index: 1;
    }

    :global(.ehagaki-app-root button.upload-destination-url-clear-button:hover:not(:disabled)),
    :global(.ehagaki-app-root button.upload-destination-url-clear-button:active:not(:disabled)),
    :global(.ehagaki-app-root button.upload-destination-url-clear-button:focus-visible),
    :global(.ehagaki-app-root button.upload-destination-url-clear-button:disabled) {
        --btn-bg: transparent;
        background-color: transparent;
        background-image: none;
        border: none;
        color: var(--text-muted);
    }

    :global(.ehagaki-app-root button.upload-destination-url-clear-button:focus-visible) {
        outline: 2px solid var(--theme);
        outline-offset: 2px;
    }

    :global(.upload-destination-url-clear-button .svg-icon) {
        --svg: currentColor;
        width: 24px;
        height: 24px;
    }

    .url-clear-input-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
        accent-color: var(--theme);
    }

    input,
    select {
        width: 100%;
        min-height: 42px;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text);
        font: inherit;
        font-size: 1rem;
    }

    input:focus-visible,
    select:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -1px;
    }
</style>
