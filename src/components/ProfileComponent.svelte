<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PopupModal from "./PopupModal.svelte";
    import { profileDataStore, authState } from "../stores/appStore.svelte";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils";

    interface Props {
        show: boolean;
        onClose: () => void;
        onLogout: () => void;
        isLoggingOut?: boolean;
    }

    let { show, onClose, onLogout, isLoggingOut = false }: Props = $props();

    // ストアから直接プロフィールデータを取得
    let profile = $derived(profileDataStore.value);
    let auth = $derived(authState.value);

    // ログアウト中の場合、プロフィールデータを保持して表示を維持
    let displayedProfile = $state(profileDataStore.value);

    // コピー成功ポップアップの状態
    let showPopup = $state(false);
    let popupX = $state(0);
    let popupY = $state(0);

    $effect(() => {
        // ログアウト中でない場合のみ、プロフィールデータを更新
        if (!isLoggingOut && profile) {
            displayedProfile = profile;
        }
    });

    function handleLogout() {
        onLogout?.();
    }

    async function handleCopy(text: string, type: string, event: MouseEvent) {
        try {
            await copyToClipboard(text, type, navigator, window);
            // コピー成功時にポップアップを表示
            const pos = calculateContextMenuPosition(
                event.clientX,
                event.clientY,
            );
            popupX = pos.x;
            popupY = pos.y;
            showPopup = true;
            // 1.8秒後に自動で消す
            setTimeout(() => {
                showPopup = false;
            }, 1800);
        } catch (error) {
            console.warn("Copy failed:", error);
        }
    }
</script>

<Dialog
    {show}
    showFooter={true}
    useHistory={true}
    {onClose}
    ariaLabel={$_("profileDialog.title")}
    className="profile-dialog"
>
    {#snippet children({ close })}
        <div class="profile-container">
            <div class="profile-summary">
                <!-- プロフィール画像 -->
                <div class="profile-image-container">
                    {#if displayedProfile.picture}
                        <img
                            src={displayedProfile.picture}
                            alt={displayedProfile.name || "Profile"}
                            class="profile-image"
                        />
                    {:else}
                        <div
                            class="profile-image-placeholder svg-icon"
                            aria-label="Profile image placeholder"
                        ></div>
                    {/if}
                </div>

                <!-- 名前 -->
                <div class="profile-name">
                    {displayedProfile.name || $_("profileDialog.anonymous")}
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
                                <button
                                    class="copy-button"
                                    onclick={(event) =>
                                        handleCopy(
                                            displayedProfile.npub!,
                                            "npub",
                                            event,
                                        )}
                                    aria-label={$_("profileDialog.copy_npub")}
                                >
                                    <div
                                        class="copy-icon svg-icon"
                                        aria-label="Copy npub"
                                    ></div>
                                </button>
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
                                <button
                                    class="copy-button"
                                    onclick={(event) =>
                                        handleCopy(
                                            displayedProfile.nprofile!,
                                            "nprofile",
                                            event,
                                        )}
                                    aria-label={$_(
                                        "profileDialog.copy_nprofile",
                                    )}
                                >
                                    <div
                                        class="copy-icon svg-icon"
                                        aria-label="Copy nprofile"
                                    ></div>
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="auth-controls">
                <!-- ログイン方法 -->
                <div class="auth-container">
                    {#if auth?.isExtensionLogin || auth?.type === "nsec"}
                        <div class="profile-info-label">
                            {$_("profileDialog.login_method")}
                        </div>
                        <span class="profile-info-text">
                            {#if auth?.isExtensionLogin}
                                {$_("profileDialog.login_method_extension")}
                            {:else if auth?.type === "nsec"}
                                {$_("profileDialog.login_method_nsec")}
                            {/if}
                        </span>
                    {/if}
                </div>

                <!-- ログアウトボタン -->
                <Button
                    onClick={handleLogout}
                    className="logout-btn {isLoggingOut ? 'loading' : ''}"
                    variant="danger"
                    shape="square"
                    disabled={isLoggingOut}
                >
                    {#if isLoggingOut}
                        <LoadingPlaceholder text={true} showLoader={true} />
                    {:else}
                        {$_("logoutDialog.logout")}
                    {/if}
                </Button>
            </div>
        </div>
    {/snippet}
</Dialog>

<PopupModal
    show={showPopup}
    x={popupX}
    y={popupY}
    onClose={() => (showPopup = false)}
>
    <div class="copy-success-message">{$_("imageContextMenu.copySuccess")}</div>
</PopupModal>

<style>
    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        width: 100%;
        height: 100%;
    }

    .profile-summary {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 10px;

        .profile-image-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
        }

        .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-image-placeholder {
            mask-image: url("/icons/circle-user-solid-full.svg");
            width: 100%;
            height: 100%;
        }

        .profile-name {
            font-size: 1.5rem;
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
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                .profile-info-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background-color: var(--btn-bg);
                    border-radius: 0.375rem;

                    .profile-info-text {
                        flex: 1;
                        font-family: monospace;
                        font-size: 1rem;
                        line-height: 1.3;
                        color: var(--text);
                    }
                }
            }
        }
    }

    .profile-info-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-light);
    }

    .auth-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;

        .auth-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            gap: 10px;
        }

        :global(button.logout-btn) {
            width: 100%;

            :global(.square) {
                background-color: whitesmoke;
            }
        }
    }

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }
</style>
