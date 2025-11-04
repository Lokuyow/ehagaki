<script lang="ts">
    import { _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { profileDataStore } from "../stores/appStore.svelte";

    interface Props {
        show: boolean;
        onClose: () => void;
        onLogout: () => void;
        isLoggingOut?: boolean;
    }

    let {
        show,
        onClose,
        onLogout,
        isLoggingOut = false,
    }: Props = $props();

    // ストアから直接プロフィールデータを取得
    let profile = $derived(profileDataStore.value);

    // ログアウト中の場合、プロフィールデータを保持して表示を維持
    let displayedProfile = $state(profileDataStore.value);

    $effect(() => {
        // ログアウト中でない場合のみ、プロフィールデータを更新
        if (!isLoggingOut && profile) {
            displayedProfile = profile;
        }
    });

    function handleLogout() {
        onLogout?.();
    }

    function copyToClipboard(text: string, type: "npub" | "nprofile") {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log(`${type} copied to clipboard`);
            })
            .catch((err) => {
                console.error(`Failed to copy ${type}:`, err);
            });
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

            <div class="profile-info-label">
                {$_("profileDialog.npub")}
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
                                    onclick={() =>
                                        copyToClipboard(
                                            displayedProfile.npub!,
                                            "npub",
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
                                    onclick={() =>
                                        copyToClipboard(
                                            displayedProfile.nprofile!,
                                            "nprofile",
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
    {/snippet}
</Dialog>

<style>
    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        width: 100%;
        height: 100%;
        padding: 1rem 0;
    }

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

    .profile-info-label {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-light);

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

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }

    :global(button.logout-btn) {
        width: 100%;

        :global(.square) {
            background-color: whitesmoke;
        }
    }
</style>
