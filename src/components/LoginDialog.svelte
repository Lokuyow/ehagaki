<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog, Tabs } from "bits-ui";
    import { PublicKeyState } from "../lib/keyManager.svelte";
    import { BUNKER_REGEX } from "../lib/nip46Service";
    import {
        createNip46ConnectionRelayDrafts,
        ensureNip46ConnectionRelayDraftRows,
        getDefaultNip46ConnectionRelayCandidates,
        openNip46ConnectionUri,
        validateNip46ConnectionRelayDrafts,
    } from "../lib/nip46ConnectUiUtils";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import QrCodeDisplay from "./QrCodeDisplay.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";

    type RemoteSignerTab = "qr" | "bunker";

    interface Props {
        show: boolean;
        secretKey: string;
        onClose: () => void;
        onSave: () => void;
        onParentClientLogin?: () => Promise<string | undefined>;
        onNip07Login: () => Promise<string | undefined>;
        onNip46Login: (bunkerUrl: string) => Promise<string | undefined>;
        onNostrConnectStart?: (relays: string[]) => Promise<string | undefined>;
        onNostrConnectCancel?: () => void;
        isParentClientAvailable?: boolean;
        isLoadingParentClient?: boolean;
        isNip07ExtensionAvailable?: boolean;
        isLoadingNip07?: boolean;
        isLoadingNip46?: boolean;
        isPreparingNip46NostrConnect?: boolean;
        isWaitingNip46NostrConnect?: boolean;
        nip46NostrConnectUri?: string | null;
        nip46NostrConnectErrorMessage?: string;
        initialNostrConnectRelayCandidates?: string[];
        isAddAccountMode?: boolean;
    }

    let {
        show = $bindable(false),
        secretKey = $bindable(),
        onClose,
        onSave,
        onParentClientLogin,
        onNip07Login,
        onNip46Login,
        onNostrConnectStart,
        onNostrConnectCancel,
        isParentClientAvailable = false,
        isLoadingParentClient = false,
        isNip07ExtensionAvailable = false,
        isLoadingNip07 = false,
        isLoadingNip46 = false,
        isPreparingNip46NostrConnect = false,
        isWaitingNip46NostrConnect = false,
        nip46NostrConnectUri = null,
        nip46NostrConnectErrorMessage = "",
        initialNostrConnectRelayCandidates = [],
        isAddAccountMode = false,
    }: Props = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // --- NIP-07拡張機能の利用可能状態（App.svelteからpropとして受取）
    let isNip07Available = $derived(isNip07ExtensionAvailable);
    let isParentClientEnabled = $derived(isParentClientAvailable);

    // --- 公開鍵状態管理 ---
    const publicKeyState = new PublicKeyState();

    // --- エラーメッセージ管理 ---
    let inputEl: HTMLInputElement | null = $state(null);

    // --- NIP-46 bunker URL ---
    let bunkerUrl = $state("");
    let activeRemoteSignerTab = $state<RemoteSignerTab>("qr");
    let wasOpen = $state(false);
    let lastRequestedNostrConnectSignature = $state<string | null>(null);
    let isNostrConnectRelaySettingsExpanded = $state(false);
    let nostrConnectRelayDrafts = $state<string[]>([""]);
    let bunkerInputEl: HTMLInputElement | null = $state(null);
    let parentClientErrorMessage = $state("");
    let nip07ErrorMessage = $state("");
    let nip46ErrorMessage = $state("");
    let hasCopiedNostrConnectUri = $state(false);

    function getResolvedInitialNostrConnectRelayCandidates(): string[] {
        return initialNostrConnectRelayCandidates.length > 0
            ? [...initialNostrConnectRelayCandidates]
            : getDefaultNip46ConnectionRelayCandidates();
    }

    function resetNostrConnectDraftState(): void {
        nostrConnectRelayDrafts = createNip46ConnectionRelayDrafts(
            getResolvedInitialNostrConnectRelayCandidates(),
        );
        activeRemoteSignerTab = "qr";
        isNostrConnectRelaySettingsExpanded = false;
        lastRequestedNostrConnectSignature = null;
    }

    // --- ダイアログを開くたびに入力をクリア ---
    $effect(() => {
        if (show && !wasOpen) {
            wasOpen = true;
            secretKey = "";
            bunkerUrl = "";
            parentClientErrorMessage = "";
            nip07ErrorMessage = "";
            nip46ErrorMessage = "";
            hasCopiedNostrConnectUri = false;
            resetNostrConnectDraftState();
            return;
        }

        if (!show) {
            wasOpen = false;
        }
    });

    $effect(() => {
        nip46NostrConnectUri;
        hasCopiedNostrConnectUri = false;
    });

    let nostrConnectRelayValidation = $derived(
        validateNip46ConnectionRelayDrafts(nostrConnectRelayDrafts),
    );
    let nostrConnectRelaySignature = $derived(
        nostrConnectRelayValidation.errorKey === null
            ? nostrConnectRelayValidation.relays.join("\n")
            : null,
    );
    let localNostrConnectErrorMessage = $derived(
        activeRemoteSignerTab === "qr" && nostrConnectRelayValidation.errorKey
            ? $_(nostrConnectRelayValidation.errorKey)
            : "",
    );
    let isNostrConnectPreparing = $derived(isPreparingNip46NostrConnect);
    let isNostrConnectPending = $derived(
        isNostrConnectPreparing || isWaitingNip46NostrConnect,
    );

    $effect(() => {
        show;
        activeRemoteSignerTab;
        const relaySignature = nostrConnectRelaySignature;
        const relayValidationError = nostrConnectRelayValidation.errorKey;

        if (!show || activeRemoteSignerTab !== "qr") {
            return;
        }

        if (relayValidationError !== null) {
            if (lastRequestedNostrConnectSignature !== null) {
                lastRequestedNostrConnectSignature = null;
                onNostrConnectCancel?.();
            }
            return;
        }

        if (
            !relaySignature ||
            relaySignature === lastRequestedNostrConnectSignature
        ) {
            return;
        }

        lastRequestedNostrConnectSignature = relaySignature;
        void onNostrConnectStart?.(nostrConnectRelayValidation.relays);
    });

    // --- 秘密鍵入力の監視と公開鍵状態の更新 ---
    $effect(() => {
        if (secretKey !== undefined) {
            publicKeyState.setNsec(secretKey);
            // 入力値が空の場合のみエラーをクリア
            if (inputEl) {
                if (!secretKey) {
                    inputEl.setCustomValidity("");
                }
            }
        }
    });

    // --- 公開鍵状態を $derived で直接参照（svelte/store subscribe パターンを廃止）---
    let isValid = $derived(publicKeyState.isValid);
    let npubValue = $derived(publicKeyState.npub);
    let nprofileValue = $derived(publicKeyState.nprofile);

    // --- UIイベントハンドラ ---
    function handleSave() {
        if (inputEl) {
            const validity = inputEl.validity;
            const value = inputEl.value ?? "";

            // バリデーションはsave時のみ
            if (validity.valueMissing) {
                inputEl.setCustomValidity(
                    $_("loginDialog.secret_key_required"),
                );
                inputEl.reportValidity();
                return;
            }

            // nsec1で始まるかチェック
            if (!value.startsWith("nsec1")) {
                inputEl.setCustomValidity(
                    $_("loginDialog.secret_must_start_nsec1"),
                );
                inputEl.reportValidity();
                return;
            }

            // 長さのチェック
            if (value.length !== 63) {
                if (value.length < 63) {
                    inputEl.setCustomValidity(
                        $_("loginDialog.secret_too_short"),
                    );
                } else {
                    inputEl.setCustomValidity(
                        $_("loginDialog.secret_too_long"),
                    );
                }
                inputEl.reportValidity();
                return;
            }

            // PublicKeyStateの検証結果をチェック
            if (!isValid) {
                inputEl.setCustomValidity($_("loginDialog.invalid_secret"));
                inputEl.reportValidity();
                return;
            }

            inputEl.setCustomValidity("");
        }
        onSave?.();
    }
    function resolveNip07ErrorMessage(errorMessage: string): string {
        switch (errorMessage) {
            case "nip07_not_available":
                return $_("loginDialog.extension_not_found");
            case "nip07_auth_error":
                return $_("loginDialog.extension_login_failed");
            default:
                return errorMessage.startsWith("nip07_")
                    ? $_("loginDialog.extension_login_failed")
                    : errorMessage;
        }
    }

    function resolveNip46ErrorMessage(errorMessage: string): string {
        switch (errorMessage) {
            case "Invalid bunker URL":
                return $_("loginDialog.bunker_invalid");
            case "nip46_connection_failed":
                return $_("loginDialog.bunker_connection_failed");
            default:
                return errorMessage;
        }
    }

    function resolveNostrConnectErrorMessage(errorMessage: string): string {
        switch (errorMessage) {
            case "At least one public wss relay is required for nostrconnect":
                return $_("loginDialog.nostrconnect_relay_required");
            case "Nostr Connect timed out before the remote signer connected":
                return $_("loginDialog.nostrconnect_timeout");
            case "Timed out waiting for switch_relays response":
            case "Relay connection failed":
            case "Nostr Connect handshake pool is unavailable":
                return $_("loginDialog.nostrconnect_connection_failed");
            case "Timed out waiting for final relay list":
            case "Remote signer did not return final relay list":
            case "Remote signer returned an invalid final relay list":
            case "Remote signer returned an unsupported final relay":
                return $_(
                    "loginDialog.nostrconnect_relay_reconciliation_failed",
                );
            case "Remote signer did not return any usable connection relay":
                return $_("loginDialog.nostrconnect_no_usable_final_relay");
            case "Could not connect to the local relay specified by the remote signer":
                return $_(
                    "loginDialog.nostrconnect_local_final_relay_unreachable",
                );
            case "Communication could not be verified on the relay selected by the remote signer":
                return $_(
                    "loginDialog.nostrconnect_final_relay_verification_failed",
                );
            case "Nostr Connect connection was cancelled":
                return "";
            default:
                if (errorMessage.startsWith("Relay connection failed:")) {
                    return $_("loginDialog.nostrconnect_connection_failed");
                }
                return errorMessage;
        }
    }

    async function handleNip07Login() {
        nip07ErrorMessage = "";
        const errorMessage = await onNip07Login?.();
        if (errorMessage) {
            nip07ErrorMessage = resolveNip07ErrorMessage(errorMessage);
        }
    }

    function resolveParentClientErrorMessage(errorMessage: string): string {
        switch (errorMessage) {
            case "parent_client_not_available":
                return $_("loginDialog.parent_client_not_available");
            case "parent_client_timeout":
                return $_("loginDialog.parent_client_timeout");
            case "parent_client_auth_rejected":
                return $_("loginDialog.parent_client_auth_rejected");
            case "parent_client_not_logged_in":
                return $_("loginDialog.parent_client_not_logged_in");
            case "parent_client_disconnected":
                return $_("loginDialog.parent_client_disconnected");
            case "parent_client_invalid_response":
                return $_("loginDialog.parent_client_invalid_response");
            case "parent_client_auth_error":
                return $_("loginDialog.parent_client_auth_error");
            default:
                return errorMessage.startsWith("parent_client_")
                    ? $_("loginDialog.parent_client_auth_error")
                    : errorMessage;
        }
    }

    async function handleParentClientLogin() {
        parentClientErrorMessage = "";
        const errorMessage = await onParentClientLogin?.();
        if (errorMessage) {
            parentClientErrorMessage =
                resolveParentClientErrorMessage(errorMessage);
        }
    }

    async function handleNip46Login() {
        nip46ErrorMessage = "";
        if (bunkerInputEl) {
            const trimmed = bunkerInputEl.value.trim();
            bunkerUrl = trimmed;

            if (bunkerInputEl.validity.valueMissing) {
                nip46ErrorMessage = $_("loginDialog.bunker_url_required");
                bunkerInputEl.setCustomValidity(nip46ErrorMessage);
                bunkerInputEl.reportValidity();
                return;
            }

            if (!BUNKER_REGEX.test(trimmed)) {
                nip46ErrorMessage = $_("loginDialog.bunker_invalid");
                bunkerInputEl.setCustomValidity(nip46ErrorMessage);
                bunkerInputEl.reportValidity();
                return;
            }

            bunkerInputEl.setCustomValidity("");
        }

        const trimmed = bunkerUrl.trim();
        const errorMsg = await onNip46Login?.(trimmed);
        if (errorMsg && bunkerInputEl) {
            const localizedMessage = resolveNip46ErrorMessage(errorMsg);
            nip46ErrorMessage = localizedMessage;
            bunkerInputEl.setCustomValidity(localizedMessage);
            bunkerInputEl.reportValidity();
            return;
        }

        nip46ErrorMessage = "";
    }

    function selectRemoteSignerTab(tab: RemoteSignerTab) {
        if (activeRemoteSignerTab === tab) {
            return;
        }

        activeRemoteSignerTab = tab;

        if (tab === "bunker") {
            lastRequestedNostrConnectSignature = null;
            onNostrConnectCancel?.();
            return;
        }

        lastRequestedNostrConnectSignature = null;
    }

    function updateNostrConnectRelayDraft(index: number, value: string) {
        const nextDrafts = [...nostrConnectRelayDrafts];
        nextDrafts[index] = value;
        nostrConnectRelayDrafts =
            ensureNip46ConnectionRelayDraftRows(nextDrafts);
    }

    function addNostrConnectRelayDraft() {
        nostrConnectRelayDrafts = [...nostrConnectRelayDrafts, ""];
        isNostrConnectRelaySettingsExpanded = true;
    }

    function removeNostrConnectRelayDraft(index: number) {
        nostrConnectRelayDrafts = ensureNip46ConnectionRelayDraftRows(
            nostrConnectRelayDrafts.filter(
                (_, relayIndex) => relayIndex !== index,
            ),
        );
    }

    function resetNostrConnectRelaysToDefault() {
        nostrConnectRelayDrafts = createNip46ConnectionRelayDrafts(
            getDefaultNip46ConnectionRelayCandidates(),
        );
        lastRequestedNostrConnectSignature = null;
    }

    function handleOpenNostrConnectUri() {
        if (!nip46NostrConnectUri) {
            return;
        }

        openNip46ConnectionUri(nip46NostrConnectUri);
    }

    async function handleCopyNostrConnectUri() {
        if (!nip46NostrConnectUri) {
            return;
        }

        const copied = await tryCopyToClipboard(
            nip46NostrConnectUri,
            "nostrconnect",
        );
        hasCopiedNostrConnectUri = copied;
    }

    function handleNostrConnectCancel() {
        onNostrConnectCancel?.();
    }

    let resolvedRemoteNostrConnectErrorMessage = $derived(
        nip46NostrConnectErrorMessage
            ? resolveNostrConnectErrorMessage(nip46NostrConnectErrorMessage)
            : "",
    );
    let displayedNostrConnectErrorMessage = $derived(
        activeRemoteSignerTab === "qr"
            ? resolvedRemoteNostrConnectErrorMessage ||
                  localNostrConnectErrorMessage
            : "",
    );

    // 新しいフォームsubmit用ハンドラ
    function handleFormSubmit(event: Event) {
        event.preventDefault();
        handleSave();
    }
</script>

<!-- npubまたはnprofileのいずれかが存在する場合、1つのトースト要素でまとめて表示 -->
{#if npubValue || nprofileValue}
    <div class="toast npub-toast">
        {#if npubValue}
            <div>
                <span style="word-break:break-all">{npubValue}</span>
            </div>
        {/if}
        {#if nprofileValue}
            <div>
                <span style="word-break:break-all">{nprofileValue}</span>
            </div>
        {/if}
    </div>
{/if}

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={isAddAccountMode
        ? $_("loginDialog.add_account_title")
        : $_("loginDialog.input_secret")}
    description={isAddAccountMode
        ? $_("loginDialog.add_account_hint")
        : $_("loginDialog.hint_input_secret")}
    contentClass="login-dialog"
    footerVariant="close-button"
>
    {#if isParentClientEnabled}
        <div class="parent-client-section">
            <Button
                variant="primary"
                shape="square"
                className="parent-client-login-button u-control {isLoadingParentClient
                    ? 'loading'
                    : ''}"
                onClick={handleParentClientLogin}
                disabled={isLoadingParentClient || isWaitingNip46NostrConnect}
            >
                {#if isLoadingParentClient}
                    <LoadingPlaceholder
                        text={true}
                        showLoader={true}
                        customClass="parent-client-login-placeholder"
                    />
                {:else}
                    <div class="parent-client-icon svg-icon"></div>
                    <span class="btn-text"
                        >{$_("loginDialog.login_with_parent_client")}</span
                    >
                {/if}
            </Button>

            <div
                class="parent-client-feedback {parentClientErrorMessage
                    ? 'error'
                    : 'info'}"
                aria-live="polite"
                role={parentClientErrorMessage ? "alert" : "status"}
            >
                {parentClientErrorMessage ||
                    $_("loginDialog.parent_client_hint")}
            </div>
        </div>

        <div class="divider">
            <span>or</span>
        </div>
    {/if}

    <div class="nip07-login-section">
        <Button
            variant="primary"
            shape="square"
            className="nip07-login-button u-control {isLoadingNip07
                ? 'loading'
                : ''}"
            onClick={handleNip07Login}
            disabled={isLoadingNip07 ||
                !isNip07Available ||
                isWaitingNip46NostrConnect}
        >
            {#if isLoadingNip07}
                <LoadingPlaceholder
                    text={true}
                    showLoader={true}
                    customClass="nip07-login-placeholder"
                />
            {:else}
                <div class="extension-icon svg-icon"></div>
                <span class="btn-text"
                    >{$_("loginDialog.login_with_extension")}</span
                >
            {/if}
        </Button>

        {#if nip07ErrorMessage || !isNip07Available}
            <div
                class="section-feedback {nip07ErrorMessage ? 'error' : 'info'}"
                aria-live="polite"
                role={nip07ErrorMessage ? "alert" : "status"}
            >
                {nip07ErrorMessage || $_("loginDialog.extension_not_found")}
            </div>
        {/if}
    </div>

    <div class="divider">
        <span>or</span>
    </div>

    <div class="remote-signer-section">
        <Button
            type="button"
            variant="primary"
            shape="square"
            ariaLabel={$_("loginDialog.nostrconnect_open")}
            onClick={handleOpenNostrConnectUri}
            disabled={isNostrConnectPreparing || !nip46NostrConnectUri}
            className="nostrconnect-open-btn u-control"
            data-testid="nostrconnect-open-button"
        >
            <div class="vault-icon svg-icon" aria-hidden="true"></div>
            <span class="btn-text">{$_("loginDialog.remote_signer_title")}</span
            >
        </Button>

        <Tabs.Root
            value={activeRemoteSignerTab}
            onValueChange={(value) =>
                selectRemoteSignerTab(value as RemoteSignerTab)}
            class="remote-signer-tabs"
        >
            <Tabs.List class="remote-signer-tab-list">
                <Tabs.Trigger
                    value="qr"
                    class="remote-signer-tab"
                    data-testid="nostrconnect-qr-tab"
                >
                    {$_("loginDialog.nostrconnect_qr_tab")}
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="bunker"
                    class="remote-signer-tab"
                    data-testid="nostrconnect-bunker-tab"
                >
                    {$_("loginDialog.nostrconnect_bunker_tab")}
                </Tabs.Trigger>
            </Tabs.List>

            {#if activeRemoteSignerTab === "qr"}
                <Tabs.Content
                    value="qr"
                    class="remote-signer-panel nostrconnect-panel"
                >
                    <div class="section-feedback info">
                        {$_("loginDialog.nostrconnect_scan_hint")}
                    </div>

                    {#if nip46NostrConnectUri}
                        <div
                            class="nostrconnect-qr-shell"
                            data-testid="nostrconnect-qr-code"
                        >
                            <QrCodeDisplay
                                value={nip46NostrConnectUri}
                                label={$_("loginDialog.nostrconnect_qr_alt")}
                            />
                        </div>
                    {:else if isNostrConnectPreparing}
                        <div class="nostrconnect-qr-loading">
                            <LoadingPlaceholder text={true} showLoader={true} />
                        </div>
                    {/if}

                    <div class="nostrconnect-uri-card">
                        <div class="nostrconnect-uri-label">
                            {$_("loginDialog.nostrconnect_uri_label")}
                        </div>
                        <div
                            class="nostrconnect-uri"
                            data-testid="nostrconnect-uri"
                        >
                            {nip46NostrConnectUri || ""}
                        </div>
                    </div>

                    <div
                        class="section-feedback info nostrconnect-status"
                        role="status"
                    >
                        {isNostrConnectPreparing
                            ? $_("loginDialog.nostrconnect_preparing")
                            : isWaitingNip46NostrConnect
                              ? $_("loginDialog.nostrconnect_waiting")
                              : $_("loginDialog.nostrconnect_idle")}
                    </div>

                    <div class="nostrconnect-code-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCopyNostrConnectUri}
                            disabled={isNostrConnectPreparing ||
                                !nip46NostrConnectUri}
                            className="nostrconnect-copy-btn"
                            data-testid="nostrconnect-copy-button"
                        >
                            {hasCopiedNostrConnectUri
                                ? $_("loginDialog.nostrconnect_copied")
                                : $_("loginDialog.nostrconnect_copy")}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleNostrConnectCancel}
                            disabled={!isNostrConnectPreparing &&
                                !isWaitingNip46NostrConnect &&
                                !nip46NostrConnectUri}
                            className="nostrconnect-cancel-btn"
                        >
                            {$_("loginDialog.nostrconnect_cancel_waiting")}
                        </Button>
                    </div>

                    <details
                        bind:open={isNostrConnectRelaySettingsExpanded}
                        class="nostrconnect-relay-settings"
                    >
                        <summary>
                            {$_("loginDialog.nostrconnect_edit_relays")}
                        </summary>

                        <div class="section-feedback info">
                            {$_("loginDialog.nostrconnect_relay_hint")}
                        </div>
                        <div class="section-feedback info">
                            {$_("loginDialog.nostrconnect_relay_update_hint")}
                        </div>
                        <div class="section-feedback info">
                            {$_("loginDialog.nostrconnect_relay_switch_hint")}
                        </div>

                        <div class="nostrconnect-relay-editor-list">
                            {#each nostrConnectRelayDrafts as relay, index}
                                <div class="nostrconnect-relay-row">
                                    <input
                                        type="url"
                                        value={relay}
                                        class="nostrconnect-relay-field"
                                        placeholder={$_(
                                            "loginDialog.nostrconnect_relay_placeholder",
                                        )}
                                        oninput={(event) =>
                                            updateNostrConnectRelayDraft(
                                                index,
                                                (
                                                    event.currentTarget as HTMLInputElement
                                                ).value,
                                            )}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="nostrconnect-remove-relay-btn"
                                        onClick={() =>
                                            removeNostrConnectRelayDraft(index)}
                                        disabled={nostrConnectRelayDrafts.length ===
                                            1 && !relay.trim()}
                                    >
                                        {$_(
                                            "loginDialog.nostrconnect_remove_relay",
                                        )}
                                    </Button>
                                </div>
                            {/each}
                        </div>

                        <div class="nostrconnect-relay-editor-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addNostrConnectRelayDraft}
                            >
                                {$_("loginDialog.nostrconnect_add_relay")}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={resetNostrConnectRelaysToDefault}
                                data-testid="nostrconnect-reset-relays"
                            >
                                {$_("loginDialog.nostrconnect_reset_relays")}
                            </Button>
                        </div>
                    </details>

                    {#if displayedNostrConnectErrorMessage}
                        <div
                            class="section-feedback error"
                            aria-live="polite"
                            role="alert"
                        >
                            {displayedNostrConnectErrorMessage}
                        </div>
                    {/if}
                </Tabs.Content>
            {:else}
                <Tabs.Content
                    value="bunker"
                    class="remote-signer-panel bunker-panel"
                >
                    <form
                        novalidate
                        onsubmit={(e) => {
                            e.preventDefault();
                            handleNip46Login();
                        }}
                    >
                        <div class="bunker-input-row">
                            <input
                                type="password"
                                bind:value={bunkerUrl}
                                placeholder="bunker://..."
                                class="bunker-input u-control"
                                required
                                autocomplete="off"
                                bind:this={bunkerInputEl}
                                disabled={isLoadingNip46}
                                oninput={() => {
                                    nip46ErrorMessage = "";
                                    if (bunkerInputEl)
                                        bunkerInputEl.setCustomValidity("");
                                }}
                            />
                            <Button
                                variant="primary"
                                shape="square"
                                type="submit"
                                disabled={isLoadingNip46}
                                className="bunker-connect-btn u-control {isLoadingNip46
                                    ? 'loading'
                                    : ''}"
                            >
                                {#if isLoadingNip46}
                                    <LoadingPlaceholder
                                        text={true}
                                        showLoader={true}
                                        customClass="bunker-connect-placeholder"
                                    />
                                {:else}
                                    {$_("loginDialog.bunker_connect")}
                                {/if}
                            </Button>
                        </div>

                        {#if nip46ErrorMessage}
                            <div
                                class="section-feedback error"
                                aria-live="polite"
                                role="alert"
                            >
                                {nip46ErrorMessage}
                            </div>
                        {/if}
                    </form>
                </Tabs.Content>
            {/if}
        </Tabs.Root>
    </div>

    <div class="divider">
        <span>or</span>
    </div>

    <div class="secret-key-section">
        <div class="secret-heading-row">
            <div class="secret-icon svg-icon"></div>
            <h3>{$_("loginDialog.input_secret")}</h3>
        </div>

        <form novalidate onsubmit={handleFormSubmit}>
            <div class="secret-input-row">
                <input
                    type="password"
                    bind:value={secretKey}
                    placeholder="nsec1..."
                    class="secret-input u-control"
                    id="secretKey"
                    name="secretKey"
                    autocomplete="current-password"
                    required
                    minlength="63"
                    maxlength="63"
                    bind:this={inputEl}
                    title={$_("loginDialog.hint_input_secret")}
                    disabled={isWaitingNip46NostrConnect}
                    onkeydown={(e) => {
                        if (e.key === "Enter") handleSave();
                    }}
                    oninput={() => {
                        // 入力時はエラーをクリアするだけ
                        if (inputEl) inputEl.setCustomValidity("");
                    }}
                />

                <Button
                    variant="primary"
                    shape="square"
                    type="submit"
                    disabled={isWaitingNip46NostrConnect}
                    className="save-btn u-control"
                >
                    {$_("loginDialog.save")}
                </Button>
            </div>
        </form>
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    shape="square"
                    ariaLabel="閉じる"
                >
                    <div class="xmark-icon svg-icon" aria-label="閉じる"></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    /* トースト用スタイル */
    .toast {
        position: fixed;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        width: 100%;
        max-width: 500px;
        background: var(--dialog-bg);
        color: var(--text);
        border-radius: 0 0 10px 10px;
        z-index: 101;
        font-family: monospace;
        font-size: 1rem;
        line-height: 1.2;
        word-break: break-all;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 8px 14px 14px 14px;
        margin-bottom: 8px;
    }
    @keyframes toast-fadein {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        to {
            opacity: 0.98;
            transform: translateX(-50%) translateY(0);
        }
    }

    .parent-client-section,
    .nip07-login-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        width: 100%;
        gap: 6px;
    }

    .parent-client-feedback,
    .section-feedback {
        padding: 8px 10px;
        font-size: 0.95rem;
        line-height: 1.4;
        text-align: center;
    }

    .parent-client-feedback.info,
    .section-feedback.info {
        background: var(--btn-bg);
        border: 1px solid var(--border-hr);
        color: var(--text-light);
    }

    .parent-client-feedback.error,
    .section-feedback.error {
        background: var(--balloon-error-bg, hsl(351, 99%, 96%));
        border: 1px solid var(--balloon-error-border, hsl(351, 99%, 70%));
        color: var(--balloon-error-color, hsl(351, 99%, 32%));
    }

    :global(.parent-client-login-button.primary),
    :global(.nip07-login-button.primary),
    :global(.nostrconnect-open-btn.primary) {
        flex-shrink: 0;
        position: relative;
        overflow: hidden;

        .btn-text {
            font-size: 1.125rem;
        }
    }

    :global(.parent-client-login-button.loading),
    :global(.nip07-login-button.loading) {
        cursor: not-allowed;
    }

    .svg-icon.parent-client-icon {
        mask-image: url("/icons/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 32px;
        height: 32px;
    }

    .svg-icon.extension-icon {
        mask-image: url("/icons/extension_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        width: 32px;
        height: 32px;
    }

    .remote-signer-section,
    .secret-key-section {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 12px;
    }

    :global(.remote-signer-panel) {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .secret-heading-row {
        display: flex;
        gap: 6px;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .secret-input-row,
    .bunker-input-row {
        display: flex;
        gap: 6px;
        width: 100%;
        flex: none;
    }

    .secret-input,
    .bunker-input {
        font-family: monospace;
        font-size: 1rem;
        padding: 0.6rem;
        background-color: var(--btn-bg);
        border: none;
        flex: 1;
    }

    .secret-heading-row h3 {
        margin: 0;
    }

    :global(.remote-signer-tabs) {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    :global(.remote-signer-tab-list) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }

    :global(.remote-signer-tab) {
        border: 1px solid var(--border-hr);
        background: var(--btn-bg);
        color: var(--text);
        border-radius: 999px;
        padding: 12px 16px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
    }

    :global(.remote-signer-tab[data-state="active"]) {
        border-color: color-mix(
            in srgb,
            var(--accent-color, var(--text)) 45%,
            var(--border-hr)
        );
        background: color-mix(
            in srgb,
            var(--btn-bg) 50%,
            var(--bg-color, #ffffff)
        );
    }

    .nostrconnect-qr-shell,
    .nostrconnect-qr-loading {
        width: 100%;
    }

    .nostrconnect-qr-loading {
        min-height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        border-radius: 16px;
        background: var(--btn-bg);
        border: 1px solid var(--border-hr);
    }

    .nostrconnect-uri-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .nostrconnect-uri-label {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-light);
    }

    .nostrconnect-uri {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px;
        background: var(--btn-bg);
        border: 1px solid var(--border-hr);
        border-radius: 12px;
        font-family: monospace;
        font-size: 0.9rem;
        line-height: 1.4;
        word-break: break-all;
        box-sizing: border-box;
    }

    .nostrconnect-status {
        margin: 0;
    }

    .nostrconnect-code-actions,
    .nostrconnect-relay-editor-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .nostrconnect-relay-settings {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        background: color-mix(in srgb, var(--btn-bg) 70%, transparent);
        border: 1px solid var(--border-hr);
        border-radius: 16px;
    }

    .nostrconnect-relay-settings summary {
        cursor: pointer;
        font-weight: 600;
    }

    .nostrconnect-relay-editor-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .nostrconnect-relay-row {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .nostrconnect-relay-field {
        flex: 1;
        min-height: 48px;
        padding: 0.75rem;
        background: var(--btn-bg);
        border: 1px solid var(--border-hr);
        border-radius: 12px;
        font-family: monospace;
        font-size: 0.95rem;
    }

    .secret-icon {
        mask-image: url("/icons/key_vertical_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
        flex: 0 0 28px;
        display: inline-block;
        vertical-align: middle;
    }

    .vault-icon {
        mask-image: url("/icons/shield_locked_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
    }

    @media (max-width: 600px) {
        .nostrconnect-relay-row,
        .bunker-input-row,
        .secret-input-row {
            flex-direction: column;
        }
    }

    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 16px 0;
        width: 100%;
        height: 64px;
    }

    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--border-hr);
    }

    .divider span {
        color: var(--text-light);
        padding: 0 16px;
        font-size: 1rem;
    }

    :global(input.u-control, button.u-control) {
        height: 50px;
        min-width: 60px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
    }

    @media (min-width: 601px) {
        :global(.save-btn.u-control) {
            width: 120px;
        }
    }
</style>
