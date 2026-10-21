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
        onRefreshRelaysAndProfile?: () => void;
        hostRelayConfigActive?: boolean;
    }

    let {
        relayConfig,
        onRefreshRelaysAndProfile,
        hostRelayConfigActive = false,
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
        <div class="setting-label-with-icon">
            <span
                class="setting-menu-icon setting-menu-mask-icon relay-refresh-setting-icon"
                aria-hidden="true"
            ></span>
            <span class="setting-label">
                {hostRelayConfigActive
                    ? ($_('settingsDialog.refresh_profile') || 'プロフィール再取得')
                    : ($_('settingsDialog.refresh_relays_and_profile') ||
                        'リレーリスト・プロフィール再取得')}
            </span>
        </div>
        <div class="setting-control">
            <Button
                variant="default"
                shape="rounded"
                contentLayout="iconText"
                className="refresh-relays-profile-btn"
                onClick={() => onRefreshRelaysAndProfile?.()}
                ariaLabel={hostRelayConfigActive
                    ? ($_('settingsDialog.refresh_profile') || 'プロフィール再取得')
                    : ($_('settingsDialog.refresh_relays_and_profile') || '再取得')}
            >
                <div
                    class="rotate-right-icon svg-icon"
                    aria-label={hostRelayConfigActive
                        ? ($_('settingsDialog.refresh_profile') || 'プロフィール再取得')
                        : ($_('settingsDialog.refresh') || '更新')}
                ></div>
                <span class="btn-text">
                    {hostRelayConfigActive
                        ? ($_('settingsDialog.refresh_profile') || 'プロフィール再取得')
                        : ($_('settingsDialog.refresh') || '更新')}
                </span>
            </Button>
        </div>
    </div>

    <!-- 投稿先リレー表示セクション（折りたたみ対応） -->
    <div class="setting-info">
        {#if hostRelayConfigActive}
            <span class="host-relay-note">
                {$_('settingsDialog.host_relay_config') || 'ホストから一時的に指定されています'}
            </span>
        {/if}
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
                        {#each relayListItems as relay (relay.url)}
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
                                    {#if relay.read}
                                        <span
                                            class="relay-check-icon svg-icon"
                                            aria-hidden="true"
                                        ></span>
                                    {:else}
                                        –
                                    {/if}
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
                                    {#if relay.write}
                                        <span
                                            class="relay-check-icon svg-icon"
                                            aria-hidden="true"
                                        ></span>
                                    {:else}
                                        –
                                    {/if}
                                </span>
                                <div class="relay-copy-cell">
                                    <Button
                                        shape="square"
                                        variant="default"
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
    </div>
</div>

<style>
    .setting-section {
        gap: 20px;
    }

    .setting-label-with-icon {
        flex: 1 1 auto;
    }
    .relay-refresh-setting-icon {
        mask-image: url("/icons/sync_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .setting-info {
        margin-inline-start: 10px;
    }

    .host-relay-note {
        display: block;
        margin: 0 10px 4px;
        color: var(--text-light);
        font-size: 0.8125rem;
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
            align-items: stretch;
            column-gap: 8px;
        }

        .relay-list-header {
            align-items: center;
            margin-top: 0;
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
            padding: 0;
            border-bottom: 1px solid var(--border-hr);
        }

        li > :not(.relay-copy-cell) {
            padding-block: 6px;
        }

        li:last-child {
            border-bottom: none;
        }

        .relay-url,
        .relay-capability {
            align-self: center;
        }

        .relay-url {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .relay-copy-cell {
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            min-width: 0;
            min-height: 44px;
        }

        :global(button.relay-copy-btn) {
            width: 44px;
            min-width: 44px;
            height: 100%;
            min-height: 44px;
            padding: 0;
            border: none;
            border-radius: 0;
            opacity: 1;
            backdrop-filter: none;
            --btn-bg: var(--dialog-bg);
            background-color: transparent;
            background-image: none;
        }

        @media (hover: hover) and (pointer: fine) {
            :global(button.relay-copy-btn:hover:not(:disabled)) {
                background-color: var(--button-hover-bg);
                color: var(--button-hover-color);
            }

            :global(button.relay-copy-btn:hover:not(:disabled) .relay-copy-icon) {
                background-color: var(--icon-hover-color);
            }
        }

        .relay-copy-icon {
            width: 20px;
            height: 20px;
            mask-image: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        }

        .relay-capability {
            color: var(--text-light);
            font-weight: 700;
            text-align: center;
        }

        .relay-capability.enabled {
            color: var(--theme);
        }

        .relay-check-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            mask-image: url("/icons/check_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        }
    }
</style>
