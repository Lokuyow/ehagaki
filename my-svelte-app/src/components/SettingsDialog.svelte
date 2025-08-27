<script lang="ts">
    import { onMount } from "svelte";
    import { locale, _ } from "svelte-i18n";
    import Dialog from "./Dialog.svelte";
    import Button from "./Button.svelte";
    import { createEventDispatcher } from "svelte";
    import { authState, relayListUpdatedStore } from "../lib/stores";
    import { get } from "svelte/store";

    export let show = false;
    export let onClose: () => void;

    const dispatch = createEventDispatcher();

    // アップロード先候補
    const uploadEndpoints = [
        { label: "yabu.me", url: "https://yabu.me/api/v2/media" },
        { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
        { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
        {
            label: "nostr.build",
            url: "https://nostr.build/api/v2/nip96/upload",
        },
    ];

    // 圧縮設定候補（$locale変更時にラベルも更新）
    $: compressionLevels = [
        { label: $_("compression_none") || "無圧縮", value: "none" },
        { label: $_("compression_low") || "低圧縮", value: "low" },
        { label: $_("compression_medium") || "中圧縮", value: "medium" },
        { label: $_("compression_high") || "高圧縮", value: "high" },
    ];

    function getDefaultEndpoint(loc: string | null | undefined) {
        if (loc === "ja") return "https://yabu.me/api/v2/media";
        return "https://nostrcheck.me/api/v2/media";
    }

    let selectedEndpoint: string;
    let clientTagEnabled: boolean = true;
    let selectedCompression: string;

    // 投稿先リレー表示用
    let writeRelays: string[] = [];
    let showRelays = false; // 折りたたみ状態管理

    function loadWriteRelays() {
        // authStateからpubkeyを取得
        const pubkeyHex = get(authState).pubkey;
        if (!pubkeyHex) {
            writeRelays = [];
            return;
        }
        const relayKey = `nostr-relays-${pubkeyHex}`;
        try {
            const relays = JSON.parse(localStorage.getItem(relayKey) ?? "null");
            if (Array.isArray(relays)) {
                // 配列の場合（FALLBACK_RELAYS等）
                writeRelays = relays;
            } else if (relays && typeof relays === "object") {
                // オブジェクト形式
                writeRelays = Object.entries(relays)
                    .filter(
                        ([url, conf]) =>
                            conf &&
                            typeof conf === "object" &&
                            "write" in conf &&
                            (conf as { write?: boolean }).write,
                    )
                    .map(([url]) => url);
            } else {
                writeRelays = [];
            }
        } catch {
            writeRelays = [];
        }
    }

    onMount(() => {
        // アップロード先
        const storedLocale = localStorage.getItem("locale");
        const browserLocale = navigator.language;
        const effectiveLocale =
            storedLocale ||
            (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");
        const saved = localStorage.getItem("uploadEndpoint");
        if (saved && uploadEndpoints.some((ep) => ep.url === saved)) {
            selectedEndpoint = saved;
        } else {
            selectedEndpoint = getDefaultEndpoint(effectiveLocale);
        }
        // client tag設定の初期化
        const clientTagSetting = localStorage.getItem("clientTagEnabled");
        if (clientTagSetting === null) {
            clientTagEnabled = true;
            localStorage.setItem("clientTagEnabled", "true");
        } else {
            clientTagEnabled = clientTagSetting === "true";
        }
        // 圧縮設定の初期化
        const savedCompression = localStorage.getItem("imageCompressionLevel");
        if (savedCompression) {
            selectedCompression = savedCompression;
        } else {
            selectedCompression = "medium";
        }
        loadWriteRelays();
    });

    // 設定ダイアログが開かれるたびにリレーリストを再取得
    $: if (show) {
        loadWriteRelays();
    }

    // showがfalseになったらリレーリストの折り畳みも閉じる
    $: if (!show) {
        showRelays = false;
    }

    $: if ($locale) {
        const saved = localStorage.getItem("uploadEndpoint");
        if (!saved) {
            selectedEndpoint = getDefaultEndpoint($locale);
        }
    }

    $: if (selectedEndpoint) {
        localStorage.setItem("uploadEndpoint", selectedEndpoint);
    }

    $: localStorage.setItem(
        "clientTagEnabled",
        clientTagEnabled ? "true" : "false",
    );

    $: if (selectedCompression) {
        localStorage.setItem("imageCompressionLevel", selectedCompression);
    }

    // 言語切替用関数をシンプル化
    function toggleLanguage() {
        const newLocale = $locale === "ja" ? "en" : "ja";
        locale.set(newLocale);
        // プレースホルダー更新はApp.svelteで行う
    }

    // 新しい relays-updated イベントを受けてリストを更新
    function onRelaysUpdated() {
        loadWriteRelays();
    }

    // リレーリスト更新検知
    relayListUpdatedStore.subscribe(() => {
        setTimeout(loadWriteRelays, 0); // ← 次のtickでリストを更新
    });
</script>

<Dialog
    {show}
    {onClose}
    ariaLabel={$_("settings") || "設定"}
    className="settings-dialog"
    on:relays-updated={onRelaysUpdated}
>
    <div class="modal-header">
        <span>{$_("settings") || "設定"}</span>
        <Button
            className="modal-close btn-circle"
            on:click={onClose}
            ariaLabel="閉じる"
        >
            <div class="xmark-icon svg-icon" aria-label="閉じる"></div>
        </Button>
    </div>
    <div class="modal-body">
        <!-- 言語設定セクション -->
        <div class="setting-section">
            <span class="setting-label"> Language/言語 </span>
            <div class="setting-control">
                <Button className="lang-btn btn" on:click={toggleLanguage}>
                    <div
                        class="lang-icon-btn svg-icon"
                        aria-label="Language"
                    ></div>
                    <span class="btn-text">{$_("change") || "変更"}</span>
                </Button>
            </div>
        </div>

        <!-- 画像圧縮設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("compression_setting") || "画像圧縮設定"}</span
            >
            <div class="setting-control">
                <select
                    id="compression-select"
                    bind:value={selectedCompression}
                >
                    {#each compressionLevels as level}
                        <option value={level.value}>{level.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- アップロード先設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("upload_destination") || "アップロード先"}</span
            >
            <div class="setting-control">
                <select id="endpoint-select" bind:value={selectedEndpoint}>
                    {#each uploadEndpoints as ep}
                        <option value={ep.url}>{ep.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- client tag オプトアウト設定セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("client_tag_label") ||
                    "投稿詳細にクライアント名をつける（Client tag）"}</span
            >
            <div class="setting-control">
                <label class="toggle-switch" for="client-tag-toggle">
                    <input
                        id="client-tag-toggle"
                        type="checkbox"
                        bind:checked={clientTagEnabled}
                    />
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <!-- リレー・プロフィール再取得セクション -->
        <div class="setting-section">
            <span class="setting-label"
                >{$_("refresh_relays_and_profile") ||
                    "リレーリスト・プロフィール再取得"}</span
            >
            <div class="setting-control">
                <Button
                    className="btn refresh-relays-profile-btn"
                    on:click={() => {
                        dispatch("refreshRelaysAndProfile");
                        // loadWriteRelays() はここで呼ばない
                    }}
                    ariaLabel={$_("refresh_relays_and_profile") || "再取得"}
                >
                    <div
                        class="rotate-right-icon svg-icon"
                        aria-label="再取得"
                    ></div>
                    <span class="btn-text">{$_("refresh") || "更新"}</span>
                </Button>
            </div>

            <!-- 投稿先リレー表示セクション（折りたたみ対応） -->
            <div class="setting-info">
                <button
                    type="button"
                    class="relay-toggle-label"
                    on:click={() => (showRelays = !showRelays)}
                    aria-pressed={showRelays}
                    aria-label="投稿先リレーの表示切替"
                    style="cursor:pointer; background:none; border:none; padding:0; font: inherit;"
                >
                    <span class="relay-toggle-icon" aria-label="toggle">
                        {#if showRelays}
                            ▼
                        {:else}
                            ▶
                        {/if}
                    </span>
                    {$_("write_relays_list") || "書き込み先リレーリスト"}
                </button>
                {#if showRelays}
                    <div class="setting-control relay-list">
                        {#if writeRelays.length > 0}
                            <ul>
                                {#each writeRelays as relay}
                                    <li>{relay}</li>
                                {/each}
                            </ul>
                        {:else}
                            <span style="color: #888;">リレー情報なし</span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="settings-footer">
        <a
            href="https://github.com/Lokuyow/ehagaki"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            class="github-link"
        >
            <div class="github-icon svg-icon" aria-label="GitHub"></div>
        </a>
    </div>
</Dialog>

<style>
    :global(.dialog.settings-dialog) {
        padding: 0;
    }
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--text-light);
        font-weight: bold;
        font-size: 1.3rem;
        width: 100%;
        padding: 8px 16px;
        border-bottom: 1px solid var(--border-hr);
    }
    :global(.modal-close) {
        background: none;
        border: none;
        padding: 0 4px;
        line-height: 1;
    }
    .xmark-icon {
        mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
    }
    .modal-body {
        padding: 16px;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
        overflow-y: auto;
    }
    .setting-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .setting-label {
        font-size: 1.1rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .setting-control {
        display: flex;
        align-items: center;
        height: fit-content;
        padding-left: 10px;
    }

    .lang-icon-btn {
        mask-image: url("/ehagaki/icons/language-solid-full.svg");
    }
    select {
        padding: 6px;
        min-width: 200px;
        height: 50px;
    }
    #endpoint-select {
        font-size: 1rem;
    }
    #compression-select {
        font-size: 1rem;
        min-width: 200px;
        height: 50px;
    }
    .settings-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 8px 16px 12px 16px;
        border-top: 1px solid var(--border-hr);
        width: 100%;
    }
    .github-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }
    .github-icon {
        mask-image: url("/ehagaki/icons/github-mark.svg");
    }

    .rotate-right-icon {
        mask-image: url("/ehagaki/icons/rotate-right-solid-full.svg");
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 90px;
        height: 44px;
        transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
    }
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--toggle-bg);
        opacity: 0.2;
        transition: 0.2s;
        border-radius: 50px;
    }
    .toggle-switch input:checked + .slider {
        background-color: var(--toggle-bg);
        opacity: 1;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 38px;
        width: 38px;
        left: 3px;
        bottom: 3px;
        background-color: var(--toggle-circle);
        transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
        border-radius: 50%;
    }
    .toggle-switch input:checked + .slider:before {
        transform: translateX(46px);
    }
    .setting-info {
        padding-left: 20px;
    }
    .relay-list ul {
        margin: 0;
        padding-left: 20px;
        font-size: 0.95rem;
    }
    .relay-list li {
        word-break: break-all;
        color: var(--text-light);
    }
    .relay-toggle-label {
        user-select: none;
        display: flex;
        align-items: center;
        height: 35px;
        gap: 6px;
        margin-right: auto;
        margin-left: 0;
    }
    .relay-toggle-icon {
        font-size: 1.2rem;
        color: var(--gray);
    }
</style>
