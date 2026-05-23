<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import { profileDataStore } from "../stores/profileStore.svelte";
    import { authState } from "../stores/authStore.svelte";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import type { StoredAccount } from "../lib/types";
    import { toNpub } from "../lib/utils/nostrUtils";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";

    function formatNpubShort(pubkeyHex: string): string {
        try {
            const npub = toNpub(pubkeyHex);
            return shortenMiddle(npub, 9, 4);
        } catch {
            return "";
        }
    }

    interface Props {
        show: boolean;
        onClose: () => void;
        onLogout: (pubkeyHex: string) => void;
        onSwitchAccount?: (pubkeyHex: string) => void;
        onAddAccount?: () => void;
        onCheckNip46Connection?: (pubkeyHex: string) => void | Promise<void>;
        accounts?: StoredAccount[];
        accountProfiles?: Map<
            string,
            { name: string; displayName: string; picture: string }
        >;
        isLoggingOut?: boolean;
        isSwitchingAccount?: boolean;
        nip46ConnectionOperationState?: "idle" | "manual-check" | "auto-recovery";
        nip46ConnectionStatus?: "idle" | "success" | "failure";
    }

    let {
        show = $bindable(false),
        onClose,
        onLogout,
        onSwitchAccount,
        onAddAccount,
        onCheckNip46Connection,
        accounts = [],
        accountProfiles = new Map(),
        isLoggingOut = false,
        isSwitchingAccount = false,
        nip46ConnectionOperationState = "idle",
        nip46ConnectionStatus = "idle",
    }: Props = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onClose?.();
    }

    // ブラウザ履歴統合
    useDialogHistory(() => show, handleClose, true);

    // ストアから直接プロフィールデータを取得
    let profile = $derived(profileDataStore.value);
    let auth = $derived(authState.value);

    // ログアウト中の場合、プロフィールデータを保持して表示を維持
    let displayedProfile = $state(profileDataStore.value);

    // コピー成功メッセージの状態
    let showCopyMessage = $state(false);
    let copyMessageX = $state(0);
    let copyMessageY = $state(0);
    let copyMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function clearCopyMessageTimeout() {
        if (copyMessageTimeoutId !== undefined) {
            clearTimeout(copyMessageTimeoutId);
            copyMessageTimeoutId = undefined;
        }
    }

    onDestroy(clearCopyMessageTimeout);

    $effect(() => {
        // ログアウト中でない場合のみ、プロフィールデータを更新
        if (!isLoggingOut && profile) {
            displayedProfile = profile;
        }
    });

    function handleLogout(pubkeyHex?: string) {
        const key = pubkeyHex ?? auth?.pubkey;
        if (key) onLogout?.(key);
    }

    function handleSwitchAccount(pubkeyHex: string) {
        onSwitchAccount?.(pubkeyHex);
        handleClose();
    }

    function handleCheckNip46Connection(pubkeyHex: string) {
        void onCheckNip46Connection?.(pubkeyHex);
    }

    async function handleCopy(text: string, type: string, event: MouseEvent) {
        try {
            await copyToClipboard(text, type, navigator, window);
            clearCopyMessageTimeout();
            // コピー成功時にメッセージを表示
            const pos = calculateContextMenuPosition(
                event.clientX,
                event.clientY,
            );
            copyMessageX = pos.x;
            copyMessageY = pos.y;
            showCopyMessage = true;
            // 1.8秒後に自動で消す
            copyMessageTimeoutId = setTimeout(() => {
                showCopyMessage = false;
                copyMessageTimeoutId = undefined;
            }, 1800);
        } catch (error) {
            console.warn("Copy failed:", error);
        }
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("profileDialog.title")}
    description={$_("profileDialog.npub")}
    contentClass="profile-dialog"
    footerVariant="close-button"
>
    <div class="profile-container">
        <div class="current-account-section">
            <div class="profile-summary">
                <!-- プロフィール画像 -->
                <ProfileAvatar
                    src={displayedProfile.picture}
                    alt={displayedProfile.displayName ||
                        displayedProfile.name ||
                        "Profile"}
                    rootClassName="profile-image-container"
                    imageClassName="profile-image"
                    fallbackClassName="profile-image-placeholder"
                    fallbackAriaLabel="Profile image placeholder"
                />

                <!-- 名前 -->
                <div class="profile-name">
                    {displayedProfile.displayName ||
                        displayedProfile.name ||
                        $_("profileDialog.anonymous")}
                </div>
            </div>

            <div class="nostr-ids">
                <div class="profile-info-label">
                    {$_("profileDialog.npub")}
                </div>
                <div class="profile-info-container">
                    <!-- npub -->
                    {#if displayedProfile.npub}
                        <div class="profile-info-row">
                            <div class="profile-info-content">
                                <span class="profile-info-text"
                                    >{displayedProfile.npub}</span
                                >
                                <Button
                                    shape="square"
                                    className="copy-button"
                                    onClick={(event) =>
                                        handleCopy(
                                            displayedProfile.npub!,
                                            "npub",
                                            event,
                                        )}
                                    ariaLabel={$_("profileDialog.copy_npub")}
                                >
                                    <div
                                        class="copy-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                </Button>
                            </div>
                        </div>
                    {/if}

                    <!-- nprofile -->
                    {#if displayedProfile.nprofile}
                        <div class="profile-info-row">
                            <div class="profile-info-content">
                                <span class="profile-info-text"
                                    >{displayedProfile.nprofile}</span
                                >
                                <Button
                                    className="copy-button"
                                    onClick={(event) =>
                                        handleCopy(
                                            displayedProfile.nprofile!,
                                            "nprofile",
                                            event,
                                        )}
                                    ariaLabel={$_(
                                        "profileDialog.copy_nprofile",
                                    )}
                                >
                                    <div
                                        class="copy-icon svg-icon"
                                        aria-hidden="true"
                                    ></div>
                                </Button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- アカウント一覧 -->
        {#if accounts.length > 0}
            <div class="accounts-section">
                <div class="profile-info-label">
                    {$_("profileDialog.accounts")}
                </div>
                <div class="account-list">
                    {#each accounts as account (account.pubkeyHex)}
                        {@const isActive = account.pubkeyHex === auth?.pubkey}
                        {@const showNip46ConnectionPanel =
                            isActive && account.type === "nip46"}
                        {@const cachedProfile = accountProfiles.get(
                            account.pubkeyHex,
                        )}
                        <div class="account-item" class:active={isActive}>
                            <div class="account-row">
                                <button
                                    class="account-info-button"
                                    onclick={() => {
                                        if (!isActive && !isSwitchingAccount) {
                                            handleSwitchAccount(account.pubkeyHex);
                                        }
                                    }}
                                    disabled={isActive || isSwitchingAccount}
                                >
                                    <ProfileAvatar
                                        src={cachedProfile?.picture}
                                        alt={cachedProfile?.displayName ||
                                            cachedProfile?.name ||
                                            ""}
                                        rootClassName="account-avatar"
                                        imageClassName="account-avatar-img"
                                        fallbackClassName="account-avatar-placeholder"
                                        fallbackAriaLabel="Profile image placeholder"
                                    />
                                    <div class="account-details">
                                        <div class="account-name-row">
                                            <span class="account-name">
                                                {cachedProfile?.displayName ||
                                                    cachedProfile?.name ||
                                                    $_("profileDialog.anonymous")}
                                            </span>
                                            <span class="account-npub-short">
                                                {formatNpubShort(account.pubkeyHex)}
                                            </span>
                                        </div>
                                        <span class="account-type-badge">
                                            {#if account.type === "nsec"}
                                                {$_(
                                                    "profileDialog.login_method_nsec",
                                                )}
                                            {:else if account.type === "nip07"}
                                                {$_(
                                                    "profileDialog.login_method_nip07",
                                                )}
                                            {:else if account.type === "nip46"}
                                                {$_(
                                                    "profileDialog.login_method_nip46",
                                                )}
                                            {:else if account.type === "parentClient"}
                                                {$_(
                                                    "profileDialog.login_method_parent_client",
                                                )}
                                            {/if}
                                        </span>
                                    </div>
                                    {#if isActive}
                                        <span class="active-badge"
                                            >{$_("profileDialog.active")}</span
                                        >
                                    {/if}
                                </button>
                                <button
                                    class="account-logout-button"
                                    onclick={() => handleLogout(account.pubkeyHex)}
                                    disabled={isLoggingOut || isSwitchingAccount}
                                    aria-label={$_("profileDialog.logout_account")}
                                >
                                    <div class="xmark-small-icon svg-icon"></div>
                                </button>
                            </div>
                            {#if showNip46ConnectionPanel}
                                <div class="nip46-connection-panel">
                                    <div class="nip46-connection-title">
                                        {$_("profileDialog.amber_connection_title")}
                                    </div>
                                    <p class="nip46-connection-description">
                                        {$_(
                                            "profileDialog.amber_connection_description",
                                        )}
                                    </p>
                                    {#if nip46ConnectionOperationState === "auto-recovery"}
                                        <div class="nip46-connection-status info">
                                            {$_(
                                                "profileDialog.amber_connection_auto_recovering",
                                            )}
                                        </div>
                                    {:else if nip46ConnectionStatus === "success"}
                                        <div class="nip46-connection-status success">
                                            {$_(
                                                "profileDialog.amber_connection_success",
                                            )}
                                        </div>
                                    {:else if nip46ConnectionStatus === "failure"}
                                        <div class="nip46-connection-status error">
                                            {$_(
                                                "profileDialog.amber_connection_failed",
                                            )}
                                        </div>
                                    {/if}
                                    <Button
                                        className="nip46-connection-button"
                                        variant="secondary"
                                        shape="rounded"
                                        disabled={isLoggingOut ||
                                            isSwitchingAccount ||
                                            nip46ConnectionOperationState !==
                                                "idle"}
                                        onClick={() =>
                                            handleCheckNip46Connection(
                                                account.pubkeyHex,
                                            )}
                                        ariaLabel={$_(
                                            "profileDialog.amber_connection_check",
                                        )}
                                    >
                                        <span>
                                            {nip46ConnectionOperationState ===
                                            "manual-check"
                                                ? $_(
                                                      "profileDialog.amber_connection_checking",
                                                  )
                                                : $_(
                                                      "profileDialog.amber_connection_check",
                                                  )}
                                        </span>
                                    </Button>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
                <Button
                    onClick={() => onAddAccount?.()}
                    className="add-account-btn"
                    variant="default"
                    shape="square"
                >
                    <div class="plus-icon svg-icon" aria-hidden="true"></div>
                    <span class="add-account-label"
                        >{$_("profileDialog.add_account")}</span
                    >
                </Button>
            </div>
        {/if}
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

<FloatingMessage show={showCopyMessage} x={copyMessageX} y={copyMessageY}>
    <div>{$_("profileDialog.copy_success")}</div>
</FloatingMessage>

<style>
    .xmark-icon {
        mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        width: 100%;
        height: 100%;
    }

    .current-account-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 16px;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-hr);
    }

    .profile-summary {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 10px;

        :global(.profile-image-container) {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
        }

        :global(.profile-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        :global(.profile-image-placeholder) {
            width: 100%;
            height: 100%;
        }

        .profile-name {
            font-size: 1.375rem;
            font-weight: 600;
            color: var(--text);
            text-align: center;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .nostr-ids {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;

        .profile-info-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;

            .profile-info-row {
                min-height: 50px;
                width: 100%;
                display: flex;
                flex-direction: column;

                .profile-info-content {
                    display: flex;
                    align-items: stretch;
                    background-color: var(--btn-bg);
                    border-radius: 8px;
                    overflow: hidden;

                    .profile-info-text {
                        flex: 1;
                        font-family: monospace;
                        font-size: 1rem;
                        line-height: 1.2;
                        color: var(--text);
                        margin: 6px 0 6px 8px;
                    }
                }
            }
        }
    }

    :global(.copy-button) {
        height: auto;
        width: 40px;
        background-color: var(--btn-bg);

        .copy-icon {
            width: 20px;
            height: 20px;
            mask-image: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        }
    }

    .profile-info-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-light);
    }

    .accounts-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;

        .account-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .account-item {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 0;
            border-radius: 8px;
            transition: background-color 0.15s;

            .account-row {
                display: flex;
                align-items: center;
            }

            &.active {
                :global(:disabled) {
                    opacity: 1;
                }

                .account-info-button {
                    background-color: transparent;
                    border: solid 1px var(--border);
                    border-right: none;
                }

                .account-logout-button {
                    background-color: transparent;
                    border: solid 1px var(--border);
                    border-left: none;
                }
            }
        }

        :global(.account-avatar) {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
        }

        :global(.account-avatar-img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        :global(.account-avatar-placeholder) {
            width: 100%;
            height: 100%;
        }

        .account-details {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-width: 0;
            width: 100%;
            gap: 4px;
        }

        .account-name-row {
            display: flex;
            align-items: baseline;
            gap: 6px;
            min-width: 0;
            width: 100%;
        }

        .account-name {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
            flex-shrink: 1;
        }

        .account-npub-short {
            font-size: 0.7rem;
            color: var(--text-light);
            font-family: monospace;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .account-type-badge {
            font-size: 0.75rem;
            color: var(--text-light);
        }

        .active-badge {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--theme);
            margin-left: auto;
            flex-shrink: 0;
        }

        .account-logout-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background-color: var(--btn-bg);
            border: solid 1px var(--btn-bg);
            border-left: none;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            flex-shrink: 0;
            color: var(--text-light);
            transition:
                background-color 0.15s,
                color 0.15s;

            &:hover:not(:disabled) {
                background-color: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            &:disabled {
                opacity: 0.4;
                cursor: default;
            }
        }

        .xmark-small-icon {
            mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
            width: 26px;
            height: 26px;
        }

        :global(button.add-account-btn) {
            display: flex;
            align-items: center;
            gap: 4px;
            width: 100%;
            height: 50px;
            margin-top: 4px;
        }

        .add-account-label {
            font-size: 1rem;
        }

        .nip46-connection-panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: color-mix(in srgb, var(--btn-bg), transparent 18%);
        }

        .nip46-connection-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text);
        }

        .nip46-connection-description {
            margin: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            color: var(--text-light);
        }

        .nip46-connection-status {
            font-size: 0.8125rem;
            line-height: 1.4;
        }

        .nip46-connection-status.info {
            color: var(--text-light);
        }

        .nip46-connection-status.success {
            color: var(--theme);
        }

        .nip46-connection-status.error {
            color: var(--danger);
        }

        :global(button.nip46-connection-button) {
            width: fit-content;
            min-height: 40px;
        }
    }

    .account-info-button {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        height: 50px;
        padding-left: 8px;
        background-color: var(--btn-bg);
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        color: inherit;
        font: inherit;

        &:disabled {
            cursor: default;
        }
    }

    .plus-icon.svg-icon {
        mask-image: url("/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 26px;
        height: 26px;
        flex-shrink: 0;
    }
</style>
