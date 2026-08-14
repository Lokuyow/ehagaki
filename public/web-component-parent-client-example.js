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

let currentComposer = null;
let secondaryComposer = null;
let loadedModuleUrl = "";
let moduleLoadPromise = null;

const CUSTOM_STYLE_FIELDS = [
    ["--ehagaki-background", "style-background"],
    ["--ehagaki-text", "style-text"],
    ["--ehagaki-border", "style-border"],
    ["--ehagaki-link", "style-link"],
    ["--ehagaki-input-background", "style-input"],
    ["--ehagaki-footer-background", "style-footer"],
    ["--ehagaki-dialog-background", "style-dialog"],
    ["--ehagaki-font-family", "style-font"],
];

const STYLE_PRESETS = {
    mint: {
        background: "#f4f8f5",
        text: "#183028",
        border: "#b8c7be",
        link: "#28764f",
        input: "#ffffff",
        footer: "#e2ebe5",
        dialog: "#ffffff",
        font: "system-ui, sans-serif",
        partOutline: "#28764f",
    },
    blue: {
        background: "#f3f7fb",
        text: "#1d2a36",
        border: "#b7c6d3",
        link: "#1769aa",
        input: "#ffffff",
        footer: "#dfeaf3",
        dialog: "#ffffff",
        font: "system-ui, sans-serif",
        partOutline: "#1769aa",
    },
    dark: {
        background: "#181a1b",
        text: "#e8e8e8",
        border: "#4a4f52",
        link: "#8ab4f8",
        input: "#242728",
        footer: "#202324",
        dialog: "#242728",
        font: "system-ui, sans-serif",
        partOutline: "#8ab4f8",
    },
};

const STYLE_PRESET_FIELDS = [
    ["style-background", "background"],
    ["style-text", "text"],
    ["style-border", "border"],
    ["style-link", "link"],
    ["style-input", "input"],
    ["style-footer", "footer"],
    ["style-dialog", "dialog"],
    ["style-font", "font"],
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
                setStatus(readyStatus, "whenReady(): resolved", "ok");
            }
            if (type === "ehagaki-initialization-error") {
                const code = detail.code ?? "initialization_failed";
                setStatus(readyStatus, `whenReady(): rejected (${code})`, "error");
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
        setStatus(componentStatus, "componentを先にCreateしてください", "warn");
        appendLog(`${label}: component_not_mounted`);
        return;
    }
    void currentComposer.setSettings(settings).then((applied) => {
        appendLog(`${label}: settings applied`, { keys: [...applied] });
        setStatus(componentStatus, `${label}: ${[...applied].join(", ") || "no keys"}`, "ok");
    }).catch((error) => {
        const code = safeErrorCode(error);
        appendLog(`${label}: settings rejected`, { code });
        setStatus(componentStatus, `${label}: rejected (${code})`, "error");
    });
}

function applyContextToComposer(context, label) {
    if (!currentComposer) {
        setStatus(componentStatus, "componentを先にCreateしてください", "warn");
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
        setStatus(componentStatus, `${label}: applied`, "ok");
    }).catch((error) => {
        const code = safeErrorCode(error);
        appendLog(`${label}: context rejected`, { code });
        setStatus(componentStatus, `${label}: rejected (${code})`, "error");
    });
}

async function ensureModuleLoaded() {
    const moduleUrl = moduleUrlInput.value.trim() || getDefaultModuleUrl();
    if (loadedModuleUrl === moduleUrl && moduleLoadPromise) return moduleLoadPromise;
    loadedModuleUrl = moduleUrl;
    moduleLoadPromise = import(moduleUrl).then(() => {
        moduleUrlInput.disabled = true;
        moduleUrlInput.setAttribute("aria-disabled", "true");
        setStatus(moduleStatus, "module loaded; reload to choose another implementation", "ok");
    }).catch((error) => {
        moduleLoadPromise = null;
        loadedModuleUrl = "";
        setStatus(moduleStatus, `module failed (${safeErrorCode(error)})`, "error");
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
    getElement("style-part-outline").value = "";
}

function selectStylePreset(name) {
    const preset = STYLE_PRESETS[name];
    for (const [id, key] of STYLE_PRESET_FIELDS) {
        getElement(id).value = preset[key];
    }
    getElement("style-part-outline").value = preset.partOutline;
    appendLog(`styles preset selected: ${name}`);
}

function removeCustomStyles(element) {
    for (const [property] of CUSTOM_STYLE_FIELDS) {
        element.style.removeProperty(property);
    }
    element.style.removeProperty("--sample-part-outline");
    document.documentElement.style.removeProperty("--sample-part-outline");
}

function configureElement(element) {
    element.setAttribute("asset-base", normalizeDirectoryUrl(assetBaseInput.value));
}

async function createComposer() {
    if (currentComposer?.isConnected) {
        setStatus(componentStatus, "componentは既にmount済みです", "warn");
        return;
    }
    await ensureModuleLoaded();
    const element = document.createElement("ehagaki-composer");
    configureElement(element);
    installEventListeners(element, "primary");
    currentComposer = element;
    setStatus(componentStatus, "component created / connecting", "warn");
    setStatus(readyStatus, "whenReady(): pending (queued settings/context)", "warn");

    // These calls intentionally happen before connection. The element queues them until ready.
    const initialSettings = element.setSettings(getSettings());
    const initialContext = element.setContext(getContext());
    componentMount.append(element);

    void element.whenReady().then(() => {
        setStatus(readyStatus, "whenReady(): resolved", "ok");
        setStatus(componentStatus, "component mounted", "ok");
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
        setStatus(componentStatus, "primary componentはmountされていません", "warn");
        return;
    }
    currentComposer.remove();
    currentComposer = null;
    setStatus(componentStatus, "primary component destroyed; persistent settings remain", "ok");
    setStatus(readyStatus, "whenReady(): not connected", "warn");
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
        setStatus(componentStatus, "2個目は inert: multiple_instances_unsupported", "error");
    });
}

function applyStyles() {
    if (!currentComposer?.isConnected) {
        setStatus(componentStatus, "componentを先にCreateしてください", "warn");
        appendLog("styles: component_not_mounted");
        return;
    }
    applyCustomStyles(currentComposer);
    const partOutline = getElement("style-part-outline").value.trim();
    if (partOutline) {
        currentComposer.style.setProperty("--sample-part-outline", partOutline);
    } else {
        currentComposer.style.removeProperty("--sample-part-outline");
    }
    appendLog("styles applied", { customProperties: 8, parts: ["header", "composer"] });
}

function resetStyles() {
    if (!currentComposer?.isConnected) {
        clearStyleInputs();
        setStatus(componentStatus, "componentを先にCreateしてください", "warn");
        appendLog("styles reset: component_not_mounted");
        return;
    }
    removeCustomStyles(currentComposer);
    clearStyleInputs();
    appendLog("styles reset", { customProperties: 8, parts: ["header", "composer"] });
}

function refreshNip07Status() {
    const signer = window.nostr;
    if (!signer) {
        setStatus(nip07Status, "NIP-07: window.nostr not available", "warn");
        return;
    }
    const capabilities = ["getPublicKey", "signEvent", "nip04", "nip44"].filter((key) => {
        if (key === "nip04" || key === "nip44") return signer[key] && typeof signer[key] === "object";
        return typeof signer[key] === "function";
    });
    setStatus(nip07Status, `NIP-07: available (${capabilities.join(", ") || "no known capability"})`, "ok");
}

function bindActions() {
    getElement("create-component").addEventListener("click", () => void createComposer().catch((error) => appendLog("create failed", { code: safeErrorCode(error) })));
    getElement("destroy-component").addEventListener("click", destroyComposer);
    getElement("recreate-component").addEventListener("click", () => void recreateComposer().catch((error) => appendLog("recreate failed", { code: safeErrorCode(error) })));
    getElement("create-second").addEventListener("click", () => void createSecondComposer().catch((error) => appendLog("secondary create failed", { code: safeErrorCode(error) })));
    getElement("apply-runtime-settings").addEventListener("click", () => applySettingsToComposer(getSettings(), "runtime setSettings"));
    getElement("apply-invalid-settings").addEventListener("click", () => applySettingsToComposer({ unsupportedKey: true }, "invalid setSettings"));
    getElement("apply-content").addEventListener("click", () => applyContextToComposer({ content: getElement("context-content").value }, "content context"));
    getElement("apply-reply").addEventListener("click", () => applyContextToComposer({ reply: getElement("context-reply").value.trim() }, "reply context"));
    getElement("apply-quote").addEventListener("click", () => applyContextToComposer({ quotes: [getElement("context-quote-one").value.trim()] }, "quote context"));
    getElement("apply-multiple-quotes").addEventListener("click", () => applyContextToComposer({ quotes: [getElement("context-quote-one").value.trim(), getElement("context-quote-two").value.trim()] }, "multiple quote context"));
    getElement("apply-channel").addEventListener("click", () => {
        const context = getContext();
        applyContextToComposer({ channel: context.channel }, "channel context");
    });
    getElement("clear-context").addEventListener("click", () => applyContextToComposer({ content: null, reply: null, quotes: null, channel: null }, "clear context"));
    getElement("apply-invalid-context").addEventListener("click", () => applyContextToComposer({ content: "must not apply", reply: "invalid reference" }, "invalid context"));
    getElement("apply-styles").addEventListener("click", applyStyles);
    getElement("reset-styles").addEventListener("click", resetStyles);
    getElement("preset-mint").addEventListener("click", () => selectStylePreset("mint"));
    getElement("preset-blue").addEventListener("click", () => selectStylePreset("blue"));
    getElement("preset-dark").addEventListener("click", () => selectStylePreset("dark"));
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
});
