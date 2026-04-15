const EMBED_NAMESPACE = "ehagaki.embed";
const EMBED_VERSION = 1;

const INBOUND_TYPES = new Set([
    "ready",
    "auth.request",
    "rpc.request",
    "post.success",
    "post.error",
]);

const KNOWN_CAPABILITIES = new Set([
    "signEvent",
    "nip04.encrypt",
    "nip04.decrypt",
    "nip44.encrypt",
    "nip44.decrypt",
]);

const appUrlInput = document.getElementById("app-url");
const parentOriginInput = document.getElementById("parent-origin");
const iframeSrcDisplay = document.getElementById("iframe-src");
const eventLog = document.getElementById("event-log");
const signerStatus = document.getElementById("signer-status");
const handshakeStatus = document.getElementById("handshake-status");
const reloadIframeButton = document.getElementById("reload-iframe");
const announceLoginButton = document.getElementById("announce-login");
const announceLogoutButton = document.getElementById("announce-logout");
const clearLogButton = document.getElementById("clear-log");
const iframe = document.getElementById("ehagaki-iframe");

let lastPubkeyHex = null;

function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isHex64(value) {
    return typeof value === "string" && /^[0-9a-f]{64}$/i.test(value);
}

function isStringArray(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStringMatrix(value) {
    return Array.isArray(value)
        && value.every(
            (row) => Array.isArray(row) && row.every((item) => typeof item === "string"),
        );
}

function updateStatus(element, text, className) {
    element.textContent = text;
    element.className = `status-pill ${className}`.trim();
}

function appendLog(level, message, detail) {
    const timestamp = new Date().toLocaleTimeString();
    const detailText = detail === undefined
        ? ""
        : `\n${typeof detail === "string" ? detail : JSON.stringify(detail, null, 2)}`;
    const next = `[${timestamp}] [${level}] ${message}${detailText}`;
    eventLog.value = eventLog.value ? `${next}\n\n${eventLog.value}` : next;
}

function getDefaultAppUrl() {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/").filter(Boolean);
    const servedFromPublicDirectory = pathSegments.at(-2) === "public";

    return new URL(servedFromPublicDirectory ? "../" : "./", currentUrl).toString();
}

function getTargetOrigin() {
    return new URL(appUrlInput.value).origin;
}

function buildEmbedUrl() {
    const url = new URL(appUrlInput.value, window.location.href);
    url.searchParams.set("parentOrigin", window.location.origin);
    return url.toString();
}

function loadIframe() {
    const embedUrl = buildEmbedUrl();
    iframe.src = embedUrl;
    iframeSrcDisplay.textContent = embedUrl;
    updateStatus(handshakeStatus, "iframe 読み込み中", "warn");
    appendLog("info", "iframe を再読み込みしました", { embedUrl });
}

function getParentSigner() {
    const signer = window.nostr;
    if (!signer || typeof signer.getPublicKey !== "function" || typeof signer.signEvent !== "function") {
        throw new Error("親ページで利用できる NIP-07 signer が見つかりません");
    }
    return signer;
}

function getAvailableCapabilities() {
    const signer = window.nostr;
    if (!signer) {
        return [];
    }

    const capabilities = [];
    if (typeof signer.signEvent === "function" && typeof signer.getPublicKey === "function") {
        capabilities.push("signEvent");
    }
    if (typeof signer.nip04?.encrypt === "function") {
        capabilities.push("nip04.encrypt");
    }
    if (typeof signer.nip04?.decrypt === "function") {
        capabilities.push("nip04.decrypt");
    }
    if (typeof signer.nip44?.encrypt === "function") {
        capabilities.push("nip44.encrypt");
    }
    if (typeof signer.nip44?.decrypt === "function") {
        capabilities.push("nip44.decrypt");
    }
    return capabilities;
}

function refreshSignerStatus() {
    const capabilities = getAvailableCapabilities();
    if (capabilities.length === 0) {
        updateStatus(signerStatus, "NIP-07 signer 未検出", "warn");
        return;
    }

    updateStatus(
        signerStatus,
        `NIP-07 signer 利用可能: ${capabilities.join(", ")}`,
        "ok",
    );
}

async function resolveCurrentPubkey() {
    const pubkeyHex = await getParentSigner().getPublicKey();
    if (!isHex64(pubkeyHex)) {
        throw new Error("signer が不正な pubkey を返しました");
    }
    lastPubkeyHex = pubkeyHex;
    return pubkeyHex;
}

function buildEnvelope(type, payload, requestId) {
    return {
        namespace: EMBED_NAMESPACE,
        version: EMBED_VERSION,
        type,
        ...(requestId ? { requestId } : {}),
        ...(payload !== undefined ? { payload } : {}),
    };
}

function postToIframe(type, payload, requestId) {
    if (!iframe.contentWindow) {
        throw new Error("iframe がまだ利用できません");
    }

    const message = buildEnvelope(type, payload, requestId);
    iframe.contentWindow.postMessage(message, getTargetOrigin());
    appendLog("send", `${type} を送信`, message);
}

function validateRequestId(requestId) {
    return requestId === undefined || isNonEmptyString(requestId);
}

function validateReadyPayload(payload) {
    if (payload === undefined) {
        return null;
    }
    if (!isRecord(payload)) {
        return "ready payload must be an object";
    }
    if (payload.capabilities !== undefined) {
        if (!isStringArray(payload.capabilities)) {
            return "ready payload.capabilities must be a string array";
        }
        if (payload.capabilities.some((capability) => !KNOWN_CAPABILITIES.has(capability))) {
            return "ready payload.capabilities contains unsupported values";
        }
    }
    return null;
}

function validateAuthRequestPayload(payload) {
    if (!isRecord(payload)) {
        return "auth.request payload must be an object";
    }
    if (!isStringArray(payload.capabilities)) {
        return "auth.request payload.capabilities must be a string array";
    }
    if (payload.capabilities.some((capability) => !KNOWN_CAPABILITIES.has(capability))) {
        return "auth.request payload.capabilities contains unsupported values";
    }
    if (payload.silent !== undefined && typeof payload.silent !== "boolean") {
        return "auth.request payload.silent must be boolean when provided";
    }
    return null;
}

function validateEventForSigning(event) {
    if (!isRecord(event)) {
        return "signEvent params.event must be an object";
    }
    if (!Number.isInteger(event.kind)) {
        return "signEvent event.kind must be an integer";
    }
    if (!Number.isInteger(event.created_at)) {
        return "signEvent event.created_at must be an integer";
    }
    if (!isHex64(event.pubkey)) {
        return "signEvent event.pubkey must be a 64-char hex string";
    }
    if (typeof event.content !== "string") {
        return "signEvent event.content must be a string";
    }
    if (!isStringMatrix(event.tags)) {
        return "signEvent event.tags must be an array of string arrays";
    }
    return null;
}

function validateCipherParams(params, textKey) {
    if (!isRecord(params)) {
        return "cipher params must be an object";
    }
    if (!isHex64(params.pubkey)) {
        return "cipher params.pubkey must be a 64-char hex string";
    }
    if (!isNonEmptyString(params[textKey])) {
        return `cipher params.${textKey} must be a non-empty string`;
    }
    return null;
}

function validateRpcRequestPayload(payload) {
    if (!isRecord(payload)) {
        return "rpc.request payload must be an object";
    }
    if (!isNonEmptyString(payload.method) || !KNOWN_CAPABILITIES.has(payload.method)) {
        return "rpc.request payload.method is unsupported";
    }

    const params = payload.params;
    switch (payload.method) {
        case "signEvent":
            if (!isRecord(params)) {
                return "signEvent params must be an object";
            }
            return validateEventForSigning(params.event);
        case "nip04.encrypt":
        case "nip44.encrypt":
            return validateCipherParams(params, "plaintext");
        case "nip04.decrypt":
        case "nip44.decrypt":
            return validateCipherParams(params, "ciphertext");
        default:
            return "rpc.request payload.method is unsupported";
    }
}

function validatePostSuccessPayload(payload) {
    if (!isRecord(payload)) {
        return "post.success payload must be an object";
    }
    if (typeof payload.timestamp !== "number") {
        return "post.success payload.timestamp must be a number";
    }
    if (payload.eventId !== undefined && !isHex64(payload.eventId)) {
        return "post.success payload.eventId must be a 64-char hex string";
    }
    if (payload.replyToEventId !== undefined && !isHex64(payload.replyToEventId)) {
        return "post.success payload.replyToEventId must be a 64-char hex string";
    }
    if (payload.quotedEventIds !== undefined) {
        if (!Array.isArray(payload.quotedEventIds) || !payload.quotedEventIds.every(isHex64)) {
            return "post.success payload.quotedEventIds must be an array of 64-char hex strings";
        }
    }
    return null;
}

function validatePostErrorPayload(payload) {
    if (!isRecord(payload)) {
        return "post.error payload must be an object";
    }
    if (typeof payload.timestamp !== "number") {
        return "post.error payload.timestamp must be a number";
    }
    if (!isNonEmptyString(payload.code)) {
        return "post.error payload.code must be a non-empty string";
    }
    if (payload.message !== undefined && typeof payload.message !== "string") {
        return "post.error payload.message must be a string when provided";
    }
    return null;
}

function validateEnvelope(data) {
    if (!isRecord(data)) {
        return "message is not an object";
    }
    if (data.namespace !== EMBED_NAMESPACE) {
        return `unexpected namespace: ${String(data.namespace)}`;
    }
    if (data.version !== EMBED_VERSION) {
        return `unexpected version: ${String(data.version)}`;
    }
    if (!isNonEmptyString(data.type) || !INBOUND_TYPES.has(data.type)) {
        return `unsupported inbound type: ${String(data.type)}`;
    }
    if (!validateRequestId(data.requestId)) {
        return "requestId must be a non-empty string when provided";
    }

    switch (data.type) {
        case "ready":
            return validateReadyPayload(data.payload);
        case "auth.request":
            return validateAuthRequestPayload(data.payload);
        case "rpc.request":
            return validateRpcRequestPayload(data.payload);
        case "post.success":
            return validatePostSuccessPayload(data.payload);
        case "post.error":
            return validatePostErrorPayload(data.payload);
        default:
            return "unsupported inbound type";
    }
}

async function handleReady() {
    updateStatus(handshakeStatus, "ready を受信", "ok");
    try {
        const pubkeyHex = await resolveCurrentPubkey();
        postToIframe("auth.login", { pubkeyHex });
    } catch (error) {
        appendLog("warn", "ready を受け取ったが親 signer が利用できません", error instanceof Error ? error.message : String(error));
    }
}

async function handleAuthRequest(message) {
    const requestedCapabilities = message.payload.capabilities;
    const availableCapabilities = getAvailableCapabilities();
    const grantedCapabilities = requestedCapabilities.filter((capability) =>
        availableCapabilities.includes(capability),
    );

    if (!grantedCapabilities.includes("signEvent")) {
        postToIframe(
            "auth.error",
            {
                code: "sign_event_unavailable",
                message: "この親ページでは signEvent を提供できません",
            },
            message.requestId,
        );
        return;
    }

    if (grantedCapabilities.length < requestedCapabilities.length) {
        appendLog("warn", "要求された capability の一部を省略して auth.result を返します", {
            requestedCapabilities,
            grantedCapabilities,
        });
    }

    try {
        const pubkeyHex = await resolveCurrentPubkey();
        postToIframe(
            "auth.result",
            {
                pubkeyHex,
                capabilities: grantedCapabilities,
            },
            message.requestId,
        );
    } catch (error) {
        postToIframe(
            "auth.error",
            {
                code: "parent_client_not_logged_in",
                message: error instanceof Error ? error.message : "parent_client_not_logged_in",
            },
            message.requestId,
        );
    }
}

async function handleRpcRequest(message) {
    const { method, params } = message.payload;
    const signer = getParentSigner();

    try {
        let result;
        switch (method) {
            case "signEvent":
                result = await signer.signEvent(params.event);
                break;
            case "nip04.encrypt":
                if (typeof signer.nip04?.encrypt !== "function") {
                    throw new Error("nip04.encrypt unsupported");
                }
                result = await signer.nip04.encrypt(params.pubkey, params.plaintext);
                break;
            case "nip04.decrypt":
                if (typeof signer.nip04?.decrypt !== "function") {
                    throw new Error("nip04.decrypt unsupported");
                }
                result = await signer.nip04.decrypt(params.pubkey, params.ciphertext);
                break;
            case "nip44.encrypt":
                if (typeof signer.nip44?.encrypt !== "function") {
                    throw new Error("nip44.encrypt unsupported");
                }
                result = await signer.nip44.encrypt(params.pubkey, params.plaintext);
                break;
            case "nip44.decrypt":
                if (typeof signer.nip44?.decrypt !== "function") {
                    throw new Error("nip44.decrypt unsupported");
                }
                result = await signer.nip44.decrypt(params.pubkey, params.ciphertext);
                break;
            default:
                throw new Error(`unsupported method: ${method}`);
        }

        postToIframe("rpc.result", { result }, message.requestId);
    } catch (error) {
        postToIframe(
            "rpc.error",
            {
                code: "rpc_failed",
                message: error instanceof Error ? error.message : String(error),
            },
            message.requestId,
        );
    }
}

async function handleEmbedMessage(event) {
    if (event.source !== iframe.contentWindow) {
        return;
    }
    if (event.origin !== getTargetOrigin()) {
        appendLog("warn", "origin が一致しないためメッセージを破棄しました", {
            expected: getTargetOrigin(),
            actual: event.origin,
        });
        return;
    }

    const validationError = validateEnvelope(event.data);
    if (validationError) {
        appendLog("warn", "不正な embed message を破棄しました", validationError);
        return;
    }

    const message = event.data;
    appendLog("recv", `${message.type} を受信`, message);

    switch (message.type) {
        case "ready":
            await handleReady();
            break;
        case "auth.request":
            await handleAuthRequest(message);
            break;
        case "rpc.request":
            await handleRpcRequest(message);
            break;
        case "post.success":
            updateStatus(handshakeStatus, "投稿成功を受信", "ok");
            break;
        case "post.error":
            updateStatus(handshakeStatus, `投稿失敗: ${message.payload.code}`, "error");
            break;
        default:
            appendLog("warn", "未処理の type を受信しました", message.type);
    }
}

async function announceLogin() {
    try {
        const pubkeyHex = await resolveCurrentPubkey();
        postToIframe("auth.login", { pubkeyHex });
        updateStatus(handshakeStatus, "auth.login を送信", "ok");
    } catch (error) {
        appendLog("error", "auth.login の送信に失敗しました", error instanceof Error ? error.message : String(error));
    }
}

async function announceLogout() {
    try {
        const pubkeyHex = lastPubkeyHex ?? await resolveCurrentPubkey();
        postToIframe("auth.logout", { pubkeyHex });
        updateStatus(handshakeStatus, "auth.logout を送信", "warn");
    } catch (error) {
        appendLog("error", "auth.logout の送信に失敗しました", error instanceof Error ? error.message : String(error));
    }
}

appUrlInput.value = getDefaultAppUrl();
parentOriginInput.value = window.location.origin;

reloadIframeButton.addEventListener("click", loadIframe);
announceLoginButton.addEventListener("click", () => {
    void announceLogin();
});
announceLogoutButton.addEventListener("click", () => {
    void announceLogout();
});
clearLogButton.addEventListener("click", () => {
    eventLog.value = "";
});

window.addEventListener("message", (event) => {
    void handleEmbedMessage(event);
});
window.addEventListener("focus", refreshSignerStatus);

refreshSignerStatus();
loadIframe();