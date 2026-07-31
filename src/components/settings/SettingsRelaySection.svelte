<script lang="ts">
    import { _ } from "svelte-i18n";
    import { RelayConfigUtils } from "../../lib/relayConfigUtils";
    import type { RelayConfig } from "../../lib/types";
    import { tryCopyToClipboard } from "../../lib/utils/clipboardUtils";
    import Button from "../Button.svelte";

    interface RelayListItem {
        url: string;
        read: boolean;
        write: boolean;
    }

    interface Props {
        relayConfig: RelayConfig | null;
        showRelays: boolean;
        onToggleShowRelays: () => void;
        onRefreshRelaysAndProfile?: () => void;
    }

    let {
        relayConfig,
        showRelays,
        onToggleShowRelays,
        onRefreshRelaysAndProfile,
    }: Props = $props();

    function toRelayListItems(config: RelayConfig | null): RelayListItem[] {
        if (!config) {
            return [];
        }

        if (Array.isArray(config)) {
            return config.map((url) => ({
                url: RelayConfigUtils.normalizeRelayUrl(url),
                read: true,
                write: true,
            }));
        }

        return Object.entries(config).map(([url, relay]) => ({
            url: RelayConfigUtils.normalizeRelayUrl(url),
            read: relay.read,
            write: relay.write,
        }));
    }

    let relayListItems = $derived(toRelayListItems(relayConfig));

    async function handleCopyRelayUrl(url: string, event: MouseEvent): Promise<boolean> {
        event.stopPropagation();
        return tryCopyToClipboard(url, "URL", navigator, window);
    }
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
                contentLayout="iconText"
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
        <Button
            variant="default"
            shape="rounded"
            className="relay-toggle-label"
            onClick={onToggleShowRelays}
            aria-pressed={showRelays}
            ariaLabel={$_("settingsDialog.toggle_relay_list") ||
                "リレーリストの表示切替"}
        >
            <span class="relay-toggle-icon" aria-label="toggle">
                {#if showRelays}
                    ▼
                {:else}
                    ▶
                {/if}
            </span>
            {$_("settingsDialog.relay_list") || "リレーリスト"}
        </Button>
        {#if showRelays}
            <div class="relay-list">
                {#if relayListItems.length > 0}
                    <div class="relay-list-header" aria-hidden="true">
                        <span>{$_("settingsDialog.relay") || "リレー"}</span>
                        <span>{$_("settingsDialog.relay_read") || "Read"}</span>
                        <span
                            >{$_("settingsDialog.relay_write") || "Write"}</span
                        >
                       <span class="relay-copy-column" aria-hidden="true"></span>
                    </div>
                    <ul>
                        {#each relayListItems as relay}
                            <li>
                                <span class="relay-url">{relay.url}</span>
                                <span
                                    class:enabled={relay.read}
                                    class="relay-capability"
                                    aria-label={relay.read
                                        ? $_(
                                              "settingsDialog.relay_read_enabled",
                                          ) || "Read enabled"
                                        : $_(
                                              "settingsDialog.relay_read_disabled",
                                          ) || "Read disabled"}
                                >
                                    {relay.read ? "✓" : "–"}
                                </span>
                                <span
                                    class:enabled={relay.write}
                                    class="relay-capability"
                                    aria-label={relay.write
                                        ? $_(
                                              "settingsDialog.relay_write_enabled",
                                          ) || "Write enabled"
                                        : $_(
                                              "settingsDialog.relay_write_disabled",
                                          ) || "Write disabled"}
                                >
                                    {relay.write ? "✓" : "–"}
                                </span>
                                <div class="relay-copy-cell">
                                    <Button
                                        variant="copy"
                                        shape="circle"
                                        className="relay-copy-btn"
                                        ariaLabel={`${$_("settingsDialog.copy_relay_url") || "リレーURLをコピー"}: ${relay.url}`}
                                        onClick={(event) =>
                                            handleCopyRelayUrl(relay.url, event)
                                        }
                                        floatingMessage={$_("common.copySuccess")}
                                    >
                                        <div
                                            class="relay-copy-icon svg-icon"
                                            aria-hidden="true"
                                        ></div>
                                    </Button>
                                </div>
                            </li>
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
    .setting-info {
        margin-inline-start: 10px;

        :global(.relay-toggle-label) {
            min-height: 44px;
            padding: 10px;
            --btn-bg: transparent;
        }
    }
    .rotate-right-icon {
        mask-image: url("/icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .relay-list {
        margin-inline-start: 10px;

        .relay-list-header,
        li {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 48px 52px 44px;
            align-items: center;
            column-gap: 8px;
        }

        .relay-list-header {
            margin-top: 6px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--border-hr);
            color: var(--text-light);
            font-size: 0.8125rem;
            font-weight: 600;
        }

        ul {
            margin: 0;
            padding-inline-start: 0;
            font-size: 0.9375rem;
            list-style: none;
        }

        li {
            color: var(--text-light);
            padding: 6px 0;
            border-bottom: 1px solid var(--border-hr);
        }

        li:last-child {
            border-bottom: none;
        }

        .relay-url {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .relay-copy-cell {
            display: flex;
            justify-content: flex-end;
            min-width: 0;
        }

        :global(button.relay-copy-btn.copy) {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
            padding: 0;
        }

        .relay-copy-icon {
            width: 20px;
            height: 20px;
        }

        .relay-capability {
            color: var(--text-light);
            font-weight: 700;
            text-align: center;
        }

        .relay-capability.enabled {
            color: var(--theme);
        }
    }
    .relay-toggle-icon {
        font-size: 1.2rem;
        color: gray;
    }
</style>
