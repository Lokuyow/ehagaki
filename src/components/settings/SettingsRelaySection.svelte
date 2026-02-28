<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "../Button.svelte";

    interface Props {
        writeRelays: string[];
        showRelays: boolean;
        onToggleShowRelays: () => void;
        onRefreshRelaysAndProfile?: () => void;
    }

    let {
        writeRelays,
        showRelays,
        onToggleShowRelays,
        onRefreshRelaysAndProfile,
    }: Props = $props();
</script>

<!-- リレー・プロフィール再取得セクション -->
<div class="setting-section">
    <div class="setting-row">
        <span class="setting-label">
            {$_("settingsDialog.refresh_relays_and_profile") ||
                "リレーリスト・プロフィール再取得"}
        </span>
        <div class="setting-control">
            <Button
                variant="default"
                shape="rounded"
                className="refresh-relays-profile-btn"
                onClick={() => onRefreshRelaysAndProfile?.()}
                ariaLabel={$_("settingsDialog.refresh_relays_and_profile") ||
                    "再取得"}
            >
                <div
                    class="rotate-right-icon svg-icon"
                    aria-label={$_("settingsDialog.refresh") || "更新"}
                ></div>
                <span class="btn-text">
                    {$_("settingsDialog.refresh") || "更新"}
                </span>
            </Button>
        </div>
    </div>

    <!-- 投稿先リレー表示セクション（折りたたみ対応） -->
    <div class="setting-info">
        <button
            type="button"
            class="relay-toggle-label"
            onclick={onToggleShowRelays}
            aria-pressed={showRelays}
            aria-label={$_("settingsDialog.toggle_write_relays_list") ||
                "投稿先リレーの表示切替"}
            style="cursor:pointer; background:none; border:none; padding:0; font: inherit;"
        >
            <span class="relay-toggle-icon" aria-label="toggle">
                {#if showRelays}
                    ▼
                {:else}
                    ▶
                {/if}
            </span>
            {$_("settingsDialog.write_relays_list") || "書き込み先リレーリスト"}
        </button>
        {#if showRelays}
            <div class="relay-list">
                {#if writeRelays.length > 0}
                    <ul>
                        {#each writeRelays as relay}
                            <li>{relay}</li>
                        {/each}
                    </ul>
                {:else}
                    <span style="color: #888;">
                        {$_("settingsDialog.no_relay_info") || "リレー情報なし"}
                    </span>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .setting-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .setting-label {
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        white-space: pre-line;
    }
    .setting-control {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: fit-content;
    }
    .setting-info {
        margin-left: 10px;
    }
    .rotate-right-icon {
        mask-image: url("/icons/rotate-right-solid-full.svg");
    }
    .relay-list {
        margin-left: 10px;

        ul {
            margin: 0;
            padding-left: 20px;
            font-size: 0.9375rem;
        }

        li {
            word-break: break-all;
            color: var(--text-light);
            margin: 6px 0;
        }
    }
    .relay-toggle-label {
        user-select: none;
        display: flex;
        align-items: center;
        height: fit-content;
        gap: 6px;
        margin-right: auto;
        margin-left: 0;
    }
    .relay-toggle-icon {
        font-size: 1.2rem;
        color: gray;
    }
</style>
