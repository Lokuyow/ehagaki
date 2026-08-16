const EVENT_TYPES = [
    "ehagaki-ready",
    "ehagaki-post-success",
    "ehagaki-post-error",
    "ehagaki-composer-context-updated",
    "ehagaki-initialization-error",
];

const moduleUrlInput = document.querySelector("#module-url");
const assetBaseInput = document.querySelector("#asset-base");
const moduleStatus = document.querySelector("#module-status");
const componentStatus = document.querySelector("#component-status");
const readyStatus = document.querySelector("#ready-status");
const nip07Status = document.querySelector("#nip07-status");
const componentMount = document.querySelector("#component-mount");
const eventLog = document.querySelector("#event-log");
const isManualMode = new URLSearchParams(window.location.search).get("manual") === "1";

let currentComposer = null;
let secondaryComposer = null;
let loadedModuleUrl = "";
let moduleLoadPromise = null;

const THEME_STYLE_FIELDS = [
    ["--ehagaki-accent-color", "style-accent"],
    ["--ehagaki-base-color", "style-base"],
];

const DETAIL_STYLE_FIELDS = [
    ["--ehagaki-background", "style-background"],
    ["--ehagaki-text", "style-text"],
    ["--ehagaki-border", "style-border"],
    ["--ehagaki-link", "style-link"],
    ["--ehagaki-input-background", "style-input"],
    ["--ehagaki-footer-background", "style-footer"],
    ["--ehagaki-dialog-background", "style-dialog"],
    ["--ehagaki-font-family", "style-font"],
];

const CUSTOM_STYLE_FIELDS = [...THEME_STYLE_FIELDS, ...DETAIL_STYLE_FIELDS];

const STYLE_PRESETS = {
    azure: {
        accent: "#005FCC",
        base: "#0077FF",
    },
    rose: {
        accent: "#B4233C",
        base: "#FF3B5C",
    },
    forest: {
        accent: "#1F7A4D",
        base: "#00A86B",
    },
    amber: {
        accent: "#8A5700",
        base: "#F2B000",
    },
};

const STYLE_PRESET_FIELDS = [
    ["style-accent", "accent"],
    ["style-base", "base"],
];

function getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing sample element: ${id}`);
    return element;
}

function setStatus(element, message, tone = "") {
    element.textContent = message;
    element.className = `status${tone ? ` ${tone}` : ""}`;
}

function formatTime() {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date());
}

function appendLog(message, detail) {
    const line = `[${formatTime()}] ${message}${detail ? ` ${JSON.stringify(detail)}` : ""}`;
    eventLog.value = `${eventLog.value}${eventLog.value ? "\n" : ""}${line}`;
    eventLog.scrollTop = eventLog.scrollHeight;
}

function safeErrorCode(error) {
    if (error && typeof error.name === "string" && /^[A-Za-z0-9_-]+$/.test(error.name)) {
        return error.name;
    }
    return "operation_failed";
}

function safeEventDetail(type, detail) {
    if (!detail || typeof detail !== "object") return {};
    switch (type) {
        case "ehagaki-ready":
            return { apiVersion: detail.apiVersion };
        case "ehagaki-post-success":
            return {
                hasEventId: typeof detail.eventId === "string",
                hasReplyToEventId: typeof detail.replyToEventId === "string",
                quotedEventCount: Array.isArray(detail.quotedEventIds) ? detail.quotedEventIds.length : 0,
            };
        case "ehagaki-post-error":
            return { code: typeof detail.code === "string" ? detail.code : "post_failed" };
        case "ehagaki-composer-context-updated":
            return {
                hasReply: typeof detail.reply === "string",
                quoteCount: Array.isArray(detail.quotes) ? detail.quotes.length : 0,
                hasChannel: !!detail.channel,
            };
        case "ehagaki-initialization-error":
            return {
                code: typeof detail.code === "string" ? detail.code : "initialization_failed",
                message: typeof detail.message === "string" ? detail.message : "safe initialization error",
            };
        default:
            return {};
    }
}

function installEventListeners(element, label) {
    for (const type of EVENT_TYPES) {
        // Listen on the host mount point, not inside ShadowRoot. This makes the
        // sample exercise the component's bubbles+composed event boundary.
        componentMount.addEventListener(type, (event) => {
            if (event.target !== element) return;
            const detail = safeEventDetail(type, event.detail);
            appendLog(`${label}: ${type}`, detail);
            if (type === "ehagaki-ready" && element === currentComposer) {
                setStatus(readyStatus, "準備完了（whenReady(): resolved）", "ok");
            }
            if (type === "ehagaki-initialization-error") {
                const code = detail.code ?? "initialization_failed";
                setStatus(readyStatus, `準備に失敗しました（whenReady(): rejected: ${code}）`, "error");
            }
        });
    }
}

function normalizeDirectoryUrl(value) {
    const resolved = new URL(value || "./web-component/", document.baseURI);
    if (!resolved.pathname.endsWith("/")) resolved.pathname += "/";
    return resolved.href;
}

function getDefaultModuleUrl() {
    return new URL("./web-component/ehagaki-composer.js", document.baseURI).href;
}

function getDefaultAssetBase() {
    return new URL("./web-component/", document.baseURI).href;
}

function getSettings() {
    return {
        locale: getElement("locale").value,
        themeMode: getElement("theme-mode").value,
        imageQualityLevel: getElement("image-quality").value,
        videoQualityLevel: getElement("video-quality").value,
        clientTagEnabled: getElement("client-tag").checked,
        quoteNotificationEnabled: getElement("quote-notification").checked,
        replyNotificationEnabled: getElement("reply-notification").checked,
        mediaFreePlacement: getElement("media-free-placement").checked,
        showMascot: getElement("show-mascot").checked,
        showFlavorText: getElement("show-flavor-text").checked,
    };
}

function getOptionalValue(id) {
    const value = getElement(id).value.trim();
    return value || undefined;
}

function getContext() {
    const context = {};
    const content = getOptionalValue("context-content");
    const reply = getOptionalValue("context-reply");
    const quoteOne = getOptionalValue("context-quote-one");
    const quoteTwo = getOptionalValue("context-quote-two");
    const channelReference = getOptionalValue("context-channel-reference");
    if (content !== undefined) context.content = content;
    if (reply !== undefined) context.reply = reply;
    if (quoteOne !== undefined || quoteTwo !== undefined) {
        context.quotes = [quoteOne, quoteTwo].filter((value) => value !== undefined);
    }
    if (channelReference !== undefined) {
        const relays = getOptionalValue("context-channel-relays");
        const channel = { reference: channelReference };
        if (relays !== undefined) channel.relays = relays.split(",").map((relay) => relay.trim()).filter(Boolean);
        for (const [key, id] of [["name", "context-channel-name"]]) {
            const value = getOptionalValue(id);
            if (value !== undefined) channel[key] = value;
        }
        context.channel = channel;
    }
    return context;
}

function applySettingsToComposer(settings, label) {
    if (!currentComposer) {
        setStatus(componentStatus, "先にComponentを作成してください", "warn");
        appendLog(`${label}: component_not_mounted`);
        return;
    }
    void currentComposer.setSettings(settings).then((applied) => {
        appendLog(`${label}: settings applied`, { keys: [...applied] });
        setStatus(componentStatus, `設定を反映しました（${[...applied].join(", ") || "変更なし"}）`, "ok");
    }).catch((error) => {
        const code = safeErrorCode(error);
        appendLog(`${label}: settings rejected`, { code });
        setStatus(componentStatus, `設定を反映できませんでした（${code}）`, "error");
    });
}

function applyContextToComposer(context, label, statusLabel) {
    if (!currentComposer) {
        setStatus(componentStatus, "先にComponentを作成してください", "warn");
        appendLog(`${label}: component_not_mounted`);
        return;
    }
    void currentComposer.setContext(context).then(() => {
        appendLog(`${label}: context applied`, {
            hasContent: typeof context.content === "string",
            hasReply: typeof context.reply === "string",
            quoteCount: Array.isArray(context.quotes) ? context.quotes.length : 0,
            hasChannel: !!context.channel,
        });
        setStatus(componentStatus, `${statusLabel}しました`, "ok");
    }).catch((error) => {
        const code = safeErrorCode(error);
        appendLog(`${label}: context rejected`, { code });
        setStatus(componentStatus, `${statusLabel}できませんでした（${code}）`, "error");
    });
}

async function ensureModuleLoaded() {
    const moduleUrl = moduleUrlInput.value.trim() || getDefaultModuleUrl();
    if (loadedModuleUrl === moduleUrl && moduleLoadPromise) return moduleLoadPromise;
    loadedModuleUrl = moduleUrl;
    moduleLoadPromise = import(moduleUrl).then(() => {
        moduleUrlInput.disabled = true;
        moduleUrlInput.setAttribute("aria-disabled", "true");
        setStatus(moduleStatus, "モジュールを読み込みました（別の実装を選ぶには再読み込み）", "ok");
    }).catch((error) => {
        moduleLoadPromise = null;
        loadedModuleUrl = "";
        setStatus(moduleStatus, `モジュールを読み込めませんでした（${safeErrorCode(error)}）`, "error");
        appendLog("module load failed", { code: safeErrorCode(error) });
        throw error;
    });
    return moduleLoadPromise;
}

function applyCustomStyles(element) {
    for (const [property, id] of CUSTOM_STYLE_FIELDS) {
        const value = getElement(id).value.trim();
        if (value) {
            element.style.setProperty(property, value);
        } else {
            element.style.removeProperty(property);
        }
    }
}

function clearStyleInputs() {
    for (const [, id] of CUSTOM_STYLE_FIELDS) {
        getElement(id).value = "";
    }
}

function selectStylePreset(name) {
    const preset = STYLE_PRESETS[name];
    for (const [id, key] of STYLE_PRESET_FIELDS) {
        getElement(id).value = preset[key];
    }
    for (const [, id] of DETAIL_STYLE_FIELDS) {
        getElement(id).value = "";
    }
    for (const presetName of Object.keys(STYLE_PRESETS)) {
        const button = document.querySelector(`#preset-${presetName}`);
        if (button) button.setAttribute("aria-pressed", String(presetName === name));
    }
    const isMounted = !!currentComposer?.isConnected;
    if (isMounted) applyCustomStyles(currentComposer);
    appendLog(`styles preset selected: ${name}`, { applied: isMounted });
}

function removeCustomStyles(element) {
    for (const [property] of CUSTOM_STYLE_FIELDS) {
        element.style.removeProperty(property);
    }
}

function configureElement(element) {
    element.setAttribute("asset-base", normalizeDirectoryUrl(assetBaseInput.value));
}

async function createComposer() {
    if (currentComposer?.isConnected) {
        setStatus(componentStatus, "Componentはすでに表示されています", "warn");
        return;
    }
    await ensureModuleLoaded();
    if (currentComposer?.isConnected) {
        setStatus(componentStatus, "Componentはすでに表示されています", "warn");
        return;
    }
    const element = document.createElement("ehagaki-composer");
    configureElement(element);
    installEventListeners(element, "primary");
    currentComposer = element;
    setStatus(componentStatus, "Componentを作成中です", "warn");
    setStatus(readyStatus, "準備中（whenReady(): pending、設定と投稿内容を予約済み）", "warn");

    // These calls intentionally happen before connection. The element queues them until ready.
    const initialSettings = element.setSettings(getSettings());
    const initialContext = element.setContext(getContext());
    componentMount.append(element);

    void element.whenReady().then(() => {
        setStatus(readyStatus, "準備完了（whenReady(): resolved）", "ok");
        setStatus(componentStatus, "Componentを表示しました", "ok");
    }).catch((error) => {
        setStatus(readyStatus, `whenReady(): rejected (${safeErrorCode(error)})`, "error");
    });
    void initialSettings.then((applied) => appendLog("initial setSettings applied", { keys: [...applied] }))
        .catch((error) => appendLog("initial setSettings rejected", { code: safeErrorCode(error) }));
    void initialContext.then(() => appendLog("initial setContext applied", { queuedBeforeConnection: true }))
        .catch((error) => appendLog("initial setContext rejected", { code: safeErrorCode(error) }));
}

function destroyComposer() {
    if (!currentComposer?.isConnected) {
        setStatus(componentStatus, "表示中のComponentはありません", "warn");
        return;
    }
    currentComposer.remove();
    currentComposer = null;
    setStatus(componentStatus, "Componentを削除しました（設定は保持されています）", "ok");
    setStatus(readyStatus, "未接続（whenReady(): not connected）", "warn");
    appendLog("primary: disconnected", { persistentSettingsRemain: true });
}

async function recreateComposer() {
    destroyComposer();
    if (secondaryComposer?.isConnected) secondaryComposer.remove();
    secondaryComposer = null;
    await createComposer();
}

async function createSecondComposer() {
    if (secondaryComposer?.isConnected) {
        appendLog("secondary: already connected");
        return;
    }
    await ensureModuleLoaded();
    const element = document.createElement("ehagaki-composer");
    configureElement(element);
    installEventListeners(element, "secondary");
    secondaryComposer = element;
    componentMount.append(element);
    void element.whenReady().then(() => {
        appendLog("secondary: unexpected ready");
    }).catch((error) => {
        appendLog("secondary: whenReady rejected", { code: safeErrorCode(error) });
        setStatus(componentStatus, "2個目は動作しません（inert: multiple_instances_unsupported）", "error");
    });
}

function applyStyles() {
    if (!currentComposer?.isConnected) {
        setStatus(componentStatus, "先にComponentを作成してください", "warn");
        appendLog("styles: component_not_mounted");
        return;
    }
    applyCustomStyles(currentComposer);
    appendLog("styles applied", { customProperties: CUSTOM_STYLE_FIELDS.length });
}

function resetStyles() {
    for (const presetName of Object.keys(STYLE_PRESETS)) {
        const button = document.querySelector(`#preset-${presetName}`);
        if (button) button.setAttribute("aria-pressed", "false");
    }
    if (!currentComposer?.isConnected) {
        clearStyleInputs();
        setStatus(componentStatus, "先にComponentを作成してください", "warn");
        appendLog("styles reset: component_not_mounted");
        return;
    }
    removeCustomStyles(currentComposer);
    clearStyleInputs();
    appendLog("styles reset", { customProperties: CUSTOM_STYLE_FIELDS.length });
}

function refreshNip07Status() {
    const signer = window.nostr;
    if (!signer) {
        setStatus(nip07Status, "NIP-07：利用できるwindow.nostrがありません", "warn");
        return;
    }
    const capabilities = ["getPublicKey", "signEvent", "nip04", "nip44"].filter((key) => {
        if (key === "nip04" || key === "nip44") return signer[key] && typeof signer[key] === "object";
        return typeof signer[key] === "function";
    });
    setStatus(nip07Status, `NIP-07：利用できます（${capabilities.join(", ") || "利用可能な機能を確認できません"}）`, "ok");
}

function bindActions() {
    getElement("create-component").addEventListener("click", () => void createComposer().catch((error) => appendLog("create failed", { code: safeErrorCode(error) })));
    getElement("destroy-component").addEventListener("click", destroyComposer);
    getElement("recreate-component").addEventListener("click", () => void recreateComposer().catch((error) => appendLog("recreate failed", { code: safeErrorCode(error) })));
    getElement("create-second").addEventListener("click", () => void createSecondComposer().catch((error) => appendLog("secondary create failed", { code: safeErrorCode(error) })));
    getElement("apply-runtime-settings").addEventListener("click", () => applySettingsToComposer(getSettings(), "runtime setSettings"));
    getElement("apply-invalid-settings").addEventListener("click", () => applySettingsToComposer({ unsupportedKey: true }, "invalid setSettings"));
    getElement("apply-content").addEventListener("click", () => applyContextToComposer({ content: getElement("context-content").value }, "content context", "投稿内容を反映"));
    getElement("apply-reply").addEventListener("click", () => applyContextToComposer({ reply: getElement("context-reply").value.trim() }, "reply context", "返信先を反映"));
    getElement("apply-quote").addEventListener("click", () => applyContextToComposer({ quotes: [getElement("context-quote-one").value.trim()] }, "quote context", "引用を反映"));
    getElement("apply-multiple-quotes").addEventListener("click", () => applyContextToComposer({ quotes: [getElement("context-quote-one").value.trim(), getElement("context-quote-two").value.trim()] }, "multiple quote context", "複数の引用を反映"));
    getElement("apply-channel").addEventListener("click", () => {
        const context = getContext();
        applyContextToComposer({ channel: context.channel }, "channel context", "チャンネル情報を反映");
    });
    getElement("clear-context").addEventListener("click", () => applyContextToComposer({ content: null, reply: null, quotes: null, channel: null }, "clear context", "指定内容をクリア"));
    getElement("apply-invalid-context").addEventListener("click", () => applyContextToComposer({ content: "must not apply", reply: "invalid reference" }, "invalid context", "投稿内容を反映"));
    getElement("apply-styles").addEventListener("click", applyStyles);
    getElement("reset-styles").addEventListener("click", resetStyles);
    getElement("preset-azure").addEventListener("click", () => selectStylePreset("azure"));
    getElement("preset-rose").addEventListener("click", () => selectStylePreset("rose"));
    getElement("preset-forest").addEventListener("click", () => selectStylePreset("forest"));
    getElement("preset-amber").addEventListener("click", () => selectStylePreset("amber"));
    getElement("clear-log").addEventListener("click", () => { eventLog.value = ""; });
}

moduleUrlInput.value = getDefaultModuleUrl();
assetBaseInput.value = getDefaultAssetBase();
bindActions();
refreshNip07Status();
appendLog("sample ready", {
    sameWindowRealm: true,
    eventTransport: "CustomEvent bubbles+composed",
    secretLogging: false,
    mode: isManualMode ? "manual" : "auto",
});

if (!isManualMode) {
    void createComposer().catch((error) => appendLog("initial create failed", { code: safeErrorCode(error) }));
} else {
    appendLog("manual mode: waiting for explicit Create / Mount");
}
