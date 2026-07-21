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
    import FloatingMessage from "./FloatingMessage.svelte";
    import InfoPopoverButton from "./InfoPopoverButton.svelte";
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
        isHandshakeStartedNip46NostrConnect?: boolean;
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
        isHandshakeStartedNip46NostrConnect = false,
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
    let nostrConnectRelayDrafts = $state<string[]>([""]);
    let bunkerInputEl: HTMLInputElement | null = $state(null);
    let parentClientErrorMessage = $state("");
    let nip07ErrorMessage = $state("");
    let nip46ErrorMessage = $state("");
    let hasCopiedNostrConnectUri = $state(false);
    let showNostrConnectDirectOpenHint = $state(false);
    let isNostrConnectOpeningSigner = $state(false);
    let nostrConnectDirectOpenHintTimer:
        | ReturnType<typeof setTimeout>
        | undefined = undefined;
    let pendingDirectOpenHintUri = $state<string | null>(null);

    const NOSTRCONNECT_DIRECT_OPEN_HINT_DELAY_MS = 1200;
    const NOSTRCONNECT_DIRECT_OPEN_HINT_DURATION_MS = 6000;

    function cleanupNostrConnectDirectOpenHint(): void {
        if (nostrConnectDirectOpenHintTimer) {
            clearTimeout(nostrConnectDirectOpenHintTimer);
            nostrConnectDirectOpenHintTimer = undefined;
        }
        pendingDirectOpenHintUri = null;
        showNostrConnectDirectOpenHint = false;
    }

    function cleanupNostrConnectDirectOpenState(): void {
        cleanupNostrConnectDirectOpenHint();
        isNostrConnectOpeningSigner = false;
    }

    function getResolvedInitialNostrConnectRelayCandidates(): string[] {
        return initialNostrConnectRelayCandidates.length > 0
            ? [...initialNostrConnectRelayCandidates]
            : getDefaultNip46ConnectionRelayCandidates();
    }

    function resetNostrConnectDraftState(): void {
        cleanupNostrConnectDirectOpenState();
        nostrConnectRelayDrafts = createNip46ConnectionRelayDrafts(
            getResolvedInitialNostrConnectRelayCandidates(),
        );
        activeRemoteSignerTab = "qr";
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
            queueMicrotask(() => {
                if (!show || activeRemoteSignerTab !== "qr") {
                    return;
                }
                void handleNostrConnectRegenerate();
            });
            return;
        }

        if (!show) {
            wasOpen = false;
            cleanupNostrConnectDirectOpenState();
        }
    });

    $effect(() => {
        nip46NostrConnectUri;
        hasCopiedNostrConnectUri = false;
        cleanupNostrConnectDirectOpenState();
    });

    $effect(() => {
        if (typeof document === "undefined") {
            return;
        }

        function handleVisibilityChange(): void {
            if (document.visibilityState !== "visible") {
                cleanupNostrConnectDirectOpenHint();
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            cleanupNostrConnectDirectOpenState();
        };
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
    let isNostrConnectHandshakeStarted = $derived(
        isHandshakeStartedNip46NostrConnect,
    );
    let isNostrConnectPending = $derived(
        isNostrConnectPreparing || isWaitingNip46NostrConnect,
    );
    let isNostrConnectRegenerateDisabled = $derived(
        isNostrConnectPreparing ||
            nostrConnectRelayValidation.errorKey !== null ||
            !nostrConnectRelaySignature ||
            (Boolean(nip46NostrConnectUri) &&
                nostrConnectRelaySignature ===
                    lastRequestedNostrConnectSignature),
    );

    $effect(() => {
        if (!isNostrConnectHandshakeStarted) {
            return;
        }

        isNostrConnectOpeningSigner = false;
        cleanupNostrConnectDirectOpenHint();
    });

    $effect(() => {
        show;
        activeRemoteSignerTab;
        nip46NostrConnectUri;
        isNostrConnectPending;

        if (
            !show ||
            activeRemoteSignerTab !== "qr" ||
            !nip46NostrConnectUri ||
            !isNostrConnectPending
        ) {
            cleanupNostrConnectDirectOpenState();
        }
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
        cleanupNostrConnectDirectOpenState();
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
        cleanupNostrConnectDirectOpenState();
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
        cleanupNostrConnectDirectOpenState();
        parentClientErrorMessage = "";
        const errorMessage = await onParentClientLogin?.();
        if (errorMessage) {
            parentClientErrorMessage =
                resolveParentClientErrorMessage(errorMessage);
        }
    }

    async function handleNip46Login() {
        cleanupNostrConnectDirectOpenState();
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
        cleanupNostrConnectDirectOpenState();

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
    }

    async function handleNostrConnectRegenerate(): Promise<void> {
        if (
            activeRemoteSignerTab !== "qr" ||
            nostrConnectRelayValidation.errorKey !== null ||
            !nostrConnectRelaySignature
        ) {
            return;
        }

        if (isNostrConnectPending) {
            onNostrConnectCancel?.();
        }

        lastRequestedNostrConnectSignature = nostrConnectRelaySignature;
        await onNostrConnectStart?.(nostrConnectRelayValidation.relays);
    }

    function handleOpenNostrConnectUri() {
        if (!nip46NostrConnectUri) {
            return;
        }

        const openedUri = nip46NostrConnectUri;
        cleanupNostrConnectDirectOpenHint();
        pendingDirectOpenHintUri = openedUri;
        isNostrConnectOpeningSigner = true;
        openNip46ConnectionUri(openedUri);

        nostrConnectDirectOpenHintTimer = setTimeout(() => {
            nostrConnectDirectOpenHintTimer = undefined;

            if (
                typeof document !== "undefined" &&
                document.visibilityState !== "visible"
            ) {
                cleanupNostrConnectDirectOpenHint();
                return;
            }

            if (
                show &&
                activeRemoteSignerTab === "qr" &&
                (isPreparingNip46NostrConnect || isWaitingNip46NostrConnect) &&
                !isNostrConnectHandshakeStarted &&
                nip46NostrConnectUri === openedUri &&
                pendingDirectOpenHintUri === openedUri
            ) {
                showNostrConnectDirectOpenHint = true;
                nostrConnectDirectOpenHintTimer = setTimeout(() => {
                    showNostrConnectDirectOpenHint = false;
                    nostrConnectDirectOpenHintTimer = undefined;
                }, NOSTRCONNECT_DIRECT_OPEN_HINT_DURATION_MS);
                return;
            }

            cleanupNostrConnectDirectOpenHint();
        }, NOSTRCONNECT_DIRECT_OPEN_HINT_DELAY_MS);
    }

    async function handleCopyNostrConnectUri(): Promise<boolean> {
        if (!nip46NostrConnectUri) {
            return false;
        }

        const copied = await tryCopyToClipboard(
            nip46NostrConnectUri,
            "nostrconnect",
        );
        hasCopiedNostrConnectUri = copied;
        return copied;
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
        cleanupNostrConnectDirectOpenState();
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
                disabled={isLoadingParentClient}
            >
                {#if isLoadingParentClient}
                    <LoadingPlaceholder text={true} showLoader={true} />
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
            disabled={isLoadingNip07 || !isNip07Available}
        >
            {#if isLoadingNip07}
                <LoadingPlaceholder text={true} showLoader={true} />
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
            ariaLabel={isNostrConnectHandshakeStarted
                ? $_("loginDialog.nostrconnect_handshake_started")
                : isNostrConnectOpeningSigner
                  ? $_("loginDialog.nostrconnect_opening_signer")
                  : $_("loginDialog.nostrconnect_open")}
            onClick={handleOpenNostrConnectUri}
            disabled={isNostrConnectPreparing ||
                !nip46NostrConnectUri ||
                isNostrConnectOpeningSigner ||
                isNostrConnectHandshakeStarted}
            className="nostrconnect-open-btn u-control {(isNostrConnectPreparing &&
                !nip46NostrConnectUri) ||
            isNostrConnectOpeningSigner ||
            isNostrConnectHandshakeStarted
                ? 'loading'
                : ''}"
            data-testid="nostrconnect-open-button"
        >
            {#if isNostrConnectPreparing && !nip46NostrConnectUri}
                <LoadingPlaceholder
                    text={$_("loginDialog.nostrconnect_preparing")}
                    showLoader={true}
                />
            {:else if isNostrConnectHandshakeStarted}
                <LoadingPlaceholder
                    text={$_("loginDialog.nostrconnect_handshake_started")}
                    showLoader={true}
                />
            {:else if isNostrConnectOpeningSigner}
                <LoadingPlaceholder
                    text={$_("loginDialog.nostrconnect_opening_signer")}
                    showLoader={true}
                />
            {:else}
                <div class="vault-icon svg-icon" aria-hidden="true"></div>
                <span class="btn-text"
                    >{$_("loginDialog.remote_signer_title")}</span
                >
            {/if}
        </Button>

        <details class="remote-signer-details">
            <summary>{$_("loginDialog.nostrconnect_input_title")}</summary>

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
                        {#if nip46NostrConnectUri}
                            <div
                                class="nostrconnect-qr-shell"
                                data-testid="nostrconnect-qr-code"
                            >
                                <QrCodeDisplay
                                    value={nip46NostrConnectUri}
                                    label={$_(
                                        "loginDialog.nostrconnect_qr_alt",
                                    )}
                                />
                            </div>
                        {:else if isNostrConnectPreparing}
                            <div class="nostrconnect-qr-loading">
                                <LoadingPlaceholder
                                    text={true}
                                    showLoader={true}
                                />
                            </div>
                        {/if}

                        <div class="nostrconnect-uri-card">
                            <div
                                class="nostrconnect-uri"
                                data-testid="nostrconnect-uri"
                            >
                                <input
                                    type="text"
                                    readonly
                                    value={nip46NostrConnectUri || ""}
                                    spellcheck="false"
                                    autocomplete="off"
                                    title={nip46NostrConnectUri || ""}
                                />
                                <Button
                                    type="button"
                                    variant="copy"
                                    shape="circle"
                                    contentLayout="icon"
                                    onClick={handleCopyNostrConnectUri}
                                    floatingMessage={$_("common.copySuccess")}
                                    disabled={isNostrConnectPreparing ||
                                        !nip46NostrConnectUri}
                                    className="nostrconnect-copy-btn"
                                    ariaLabel={hasCopiedNostrConnectUri
                                        ? $_("loginDialog.nostrconnect_copied")
                                        : $_("loginDialog.nostrconnect_copy")}
                                    data-testid="nostrconnect-copy-button"
                                >
                                    <div
                                        class="copy-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                </Button>
                            </div>
                        </div>

                        <div
                            class="section-feedback info nostrconnect-status"
                            role="status"
                        >
                            {#if isNostrConnectPreparing}
                                {$_("loginDialog.nostrconnect_preparing")}
                            {:else if isNostrConnectOpeningSigner}
                                <LoadingPlaceholder
                                    text={$_(
                                        "loginDialog.nostrconnect_opening_signer",
                                    )}
                                    showLoader={true}
                                />
                            {:else if isNostrConnectHandshakeStarted}
                                <LoadingPlaceholder
                                    text={$_(
                                        "loginDialog.nostrconnect_handshake_started",
                                    )}
                                    showLoader={true}
                                />
                            {:else if isWaitingNip46NostrConnect}
                                {$_("loginDialog.nostrconnect_waiting")}
                            {:else}
                                {$_("loginDialog.nostrconnect_idle")}
                            {/if}
                        </div>

                        <div class="nostrconnect-relay-settings">
                            <div class="nostrconnect-relay-settings-header">
                                <div
                                    class="nostrconnect-relay-settings-title-row"
                                >
                                    <span
                                        class="nostrconnect-relay-settings-title"
                                        >{$_(
                                            "loginDialog.nostrconnect_edit_relays",
                                        )}</span
                                    >
                                    <InfoPopoverButton
                                        side="top"
                                        sideOffset={8}
                                        ariaLabel={$_(
                                            "loginDialog.nostrconnect_edit_relays",
                                        ) + "の説明"}
                                    >
                                        <div class="nostrconnect-relay-popover">
                                            <div>
                                                {$_(
                                                    "loginDialog.nostrconnect_relay_hint",
                                                )}
                                            </div>
                                            <div>
                                                {$_(
                                                    "loginDialog.nostrconnect_relay_update_hint",
                                                )}
                                            </div>
                                            <div>
                                                {$_(
                                                    "loginDialog.nostrconnect_relay_switch_hint",
                                                )}
                                            </div>
                                        </div>
                                    </InfoPopoverButton>
                                </div>
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
                                            variant="close"
                                            shape="rounded"
                                            className="nostrconnect-remove-relay-btn"
                                            ariaLabel={$_(
                                                "loginDialog.nostrconnect_remove_relay",
                                            )}
                                            onClick={() =>
                                                removeNostrConnectRelayDraft(
                                                    index,
                                                )}
                                            disabled={nostrConnectRelayDrafts.length ===
                                                1 && !relay.trim()}
                                        >
                                            <div
                                                class="close-icon svg-icon"
                                                aria-hidden="true"
                                            ></div>
                                        </Button>
                                    </div>
                                {/each}
                            </div>

                            <div class="nostrconnect-relay-editor-actions">
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleNostrConnectRegenerate}
                                    disabled={isNostrConnectRegenerateDisabled}
                                    data-testid="nostrconnect-regenerate"
                                >
                                    {$_("loginDialog.nostrconnect_generate")}
                                </Button>
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
                                    {$_(
                                        "loginDialog.nostrconnect_reset_relays",
                                    )}
                                </Button>
                            </div>
                        </div>

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
                                        <LoadingPlaceholder showLoader={true} />
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
        </details>
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

<FloatingMessage show={showNostrConnectDirectOpenHint} variant="top-right">
    <div>{$_("loginDialog.nostrconnect_direct_open_hint")}</div>
</FloatingMessage>

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
        translate: -50% 0;
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
        padding: 8px 14px 14px;
        margin-bottom: 8px;
    }
    @keyframes toast-fadein {
        from {
            opacity: 0;
            translate: -50% -10px;
        }
        to {
            opacity: 0.98;
            translate: -50% 0;
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
        font-size: 0.95rem;
        text-align: center;
    }

    .parent-client-feedback.info,
    .section-feedback.info {
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
    :global(.nip07-login-button.loading),
    :global(.nostrconnect-open-btn.loading) {
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

    .remote-signer-section {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 6px;
    }

    .secret-key-section {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
    }

    :global(.remote-signer-panel) {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .remote-signer-details {
        width: 100%;
        background: var(--dialog-bg2);
        border-radius: 8px;
    }

    .remote-signer-details summary {
        padding: 12px;
        cursor: pointer;
        font-weight: 600;
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
        padding: 8px;
        gap: 8px;
    }

    :global(.remote-signer-tab-list) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :global(.remote-signer-tab) {
        background: var(--btn-bg);
        --btn-bg: var(--btn-bg2);
        color: var(--text);
        padding: 12px 16px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;

        &[data-value="qr"] {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }

        &[data-value="bunker"] {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }
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

    .nostrconnect-uri {
        display: flex;
        align-items: center;
        position: relative;
        height: 40px;
        padding: 0 40px 0 12px;
        background: var(--btn-bg2);
        border-radius: 12px;
        font-family: monospace;
        font-size: 0.9rem;
    }

    .nostrconnect-uri input {
        width: 100%;
        border: none;
        background: transparent;
        font-family: inherit;
        font-size: inherit;
        outline: none;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :global(button.nostrconnect-copy-btn.circle.copy) {
        position: absolute;
        right: 2px;
        bottom: 2px;
        width: 34px;
        min-width: 34px;
        height: 34px;
        flex: 0 0 34px;
        z-index: 1;
    }

    :global(button.nostrconnect-copy-btn .copy-icon) {
        width: 18px;
        height: 18px;
        mask-image: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .nostrconnect-relay-editor-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .nostrconnect-relay-settings {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 2px 12px 12px;
        background: var(--dialog-bg3);
        border-radius: 16px;
    }

    .nostrconnect-relay-settings-title-row {
        display: flex;
        align-items: center;
    }

    .nostrconnect-relay-settings-title {
        font-weight: 600;
    }

    .nostrconnect-relay-popover {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .nostrconnect-relay-editor-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .nostrconnect-relay-row {
        display: flex;
        align-items: stretch;
        height: 40px;

        :global(.nostrconnect-remove-relay-btn) {
            width: auto;
            height: auto;
            border-radius: 0 12px 12px 0;
            --btn-bg: var(--btn-bg3);
            opacity: 1;
            aspect-ratio: 1;

            :global(.close-icon) {
                --svg: currentColor;
                width: 24px;
                height: 24px;
            }
        }
    }

    .nostrconnect-relay-field {
        flex: 1;
        width: auto;
        height: auto;
        padding: 0 0.75rem;
        background: var(--btn-bg3);
        border: none;
        border-radius: 12px 0 0 12px;
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
        min-height: 50px;
        min-width: 60px;
        width: 100%;
        display: inline-flex;
        align-items: center;
    }

    @media (min-width: 601px) {
        :global(.save-btn.u-control, .bunker-connect-btn.u-control) {
            width: 120px;
        }
    }
</style>
