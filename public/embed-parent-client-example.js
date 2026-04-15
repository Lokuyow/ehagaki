import { finalizeEvent, getPublicKey as getPublicKeyFromSecret } from "https://esm.sh/nostr-tools@2.23.3/pure";
import { decode as decodeNip19, neventEncode } from "https://esm.sh/nostr-tools@2.23.3/nip19";
import { SimplePool } from "https://esm.sh/nostr-tools@2.23.3/pool";

const EMBED_NAMESPACE = "ehagaki.embed";
const EMBED_VERSION = 1;
const PARENT_SESSION_STORAGE_KEY = "ehagaki.parent-client-sample.session";
const TIMELINE_RELAYS = ["wss://nos.lol"];
const TIMELINE_EVENT_LIMIT = 24;
const TIMELINE_QUERY_MAX_WAIT_MS = 4000;

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
const parentAuthStatus = document.getElementById("parent-auth-status");
const authFeedback = document.getElementById("auth-feedback");
const handshakeStatus = document.getElementById("handshake-status");
const timelineStatus = document.getElementById("timeline-status");
const timelineSelection = document.getElementById("timeline-selection");
const timelineList = document.getElementById("timeline-list");
const loginNip07Button = document.getElementById("login-nip07");
const secretKeyInput = document.getElementById("secret-key");
const loginSecretKeyButton = document.getElementById("login-secret-key");
const reloadIframeButton = document.getElementById("reload-iframe");
const announceLogoutButton = document.getElementById("announce-logout");
const refreshTimelineButton = document.getElementById("refresh-timeline");
const clearReplyQuoteButton = document.getElementById("clear-reply-quote");
const clearLogButton = document.getElementById("clear-log");
const iframe = document.getElementById("ehagaki-iframe");

const AUTH_METHOD_LABELS = {
    nip07: "NIP-07",
    nsec: "秘密鍵",
};

let lastPubkeyHex = null;
let activeParentSession = null;
let isIframeReady = false;
let timelineEvents = [];
let selectedReplyReference = null;
let selectedQuoteReferences = [];
let timelineSubscription = null;

const timelinePool = new SimplePool({
    enablePing: true,
    enableReconnect: true,
});

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

function setAuthFeedback(message = "", tone = "") {
    authFeedback.textContent = message;
    if (tone) {
        authFeedback.dataset.tone = tone;
        return;
    }
    delete authFeedback.dataset.tone;
}

function getNip07Signer() {
    const signer = window.nostr;
    if (!signer || typeof signer.getPublicKey !== "function" || typeof signer.signEvent !== "function") {
        throw new Error("親ページで利用できる NIP-07 signer が見つかりません");
    }
    return signer;
}

function createSecretKeySession(secretKey) {
    const trimmed = typeof secretKey === "string" ? secretKey.trim() : "";
    if (!trimmed) {
        throw new Error("秘密鍵を入力してください");
    }

    let decoded;
    try {
        decoded = decodeNip19(trimmed);
    } catch {
        throw new Error("有効な nsec を入力してください");
    }

    if (decoded.type !== "nsec" || !(decoded.data instanceof Uint8Array) || decoded.data.length !== 32) {
        throw new Error("有効な nsec を入力してください");
    }

    const pubkeyHex = getPublicKeyFromSecret(decoded.data);
    if (!isHex64(pubkeyHex)) {
        throw new Error("秘密鍵から公開鍵を導出できませんでした");
    }

    return {
        method: "nsec",
        pubkeyHex,
        secretKey: trimmed,
        secretKeyBytes: decoded.data,
    };
}

function hydrateStoredParentSession(value) {
    if (!isRecord(value) || !isNonEmptyString(value.method)) {
        return null;
    }

    if (value.method === "nip07") {
        return {
            method: "nip07",
            pubkeyHex: isHex64(value.pubkeyHex) ? value.pubkeyHex : null,
        };
    }

    if (value.method === "nsec" && isNonEmptyString(value.secretKey)) {
        try {
            return createSecretKeySession(value.secretKey);
        } catch {
            return null;
        }
    }

    return null;
}

function serializeParentSession(session) {
    if (!session) {
        return null;
    }

    return session.method === "nsec"
        ? {
            method: "nsec",
            pubkeyHex: session.pubkeyHex,
            secretKey: session.secretKey,
        }
        : {
            method: "nip07",
            pubkeyHex: session.pubkeyHex,
        };
}

function loadParentSession() {
    try {
        const stored = window.localStorage.getItem(PARENT_SESSION_STORAGE_KEY);
        if (!stored) {
            return null;
        }

        return hydrateStoredParentSession(JSON.parse(stored));
    } catch {
        return null;
    }
}

function saveParentSession(session) {
    try {
        if (session) {
            window.localStorage.setItem(
                PARENT_SESSION_STORAGE_KEY,
                JSON.stringify(serializeParentSession(session)),
            );
            return;
        }
        window.localStorage.removeItem(PARENT_SESSION_STORAGE_KEY);
    } catch {
        // ignore storage failures in the standalone sample
    }
}

function refreshParentAuthStatus() {
    if (activeParentSession) {
        updateStatus(
            parentAuthStatus,
            `親クライアントログイン済み (${AUTH_METHOD_LABELS[activeParentSession.method]})`,
            "ok",
        );
        return;
    }

    updateStatus(parentAuthStatus, "親クライアント未ログイン", "warn");
}

function getNip07Capabilities() {
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

function getAvailableCapabilities() {
    if (!activeParentSession) {
        return [];
    }

    if (activeParentSession.method === "nsec") {
        return ["signEvent"];
    }

    return getNip07Capabilities();
}

function refreshSignerStatus() {
    if (activeParentSession?.method === "nsec") {
        updateStatus(signerStatus, "秘密鍵 signer 利用中: signEvent", "ok");
        return;
    }

    const capabilities = getNip07Capabilities();
    if (activeParentSession?.method === "nip07") {
        if (capabilities.length === 0) {
            updateStatus(signerStatus, "NIP-07 signer 接続待ち", "warn");
            return;
        }

        updateStatus(
            signerStatus,
            `NIP-07 signer 利用中: ${capabilities.join(", ")}`,
            "ok",
        );
        return;
    }

    if (capabilities.length === 0) {
        updateStatus(signerStatus, "NIP-07 signer 未検出 / 秘密鍵ログイン可", "warn");
        return;
    }

    updateStatus(
        signerStatus,
        `NIP-07 利用可能: ${capabilities.join(", ")}`,
        "ok",
    );
}

function refreshAuthControls() {
    const isLoggedIn = activeParentSession !== null;

    loginNip07Button.disabled = isLoggedIn;
    secretKeyInput.disabled = isLoggedIn;
    loginSecretKeyButton.disabled = isLoggedIn || !isNonEmptyString(secretKeyInput.value);
    announceLogoutButton.disabled = !isLoggedIn;
}

function setParentSession(session) {
    activeParentSession = session;
    saveParentSession(session);

    if (session?.method === "nsec") {
        secretKeyInput.value = session.secretKey;
    } else if (!session) {
        secretKeyInput.value = "";
    } else {
        secretKeyInput.value = "";
    }

    refreshParentAuthStatus();
    refreshSignerStatus();
    refreshAuthControls();
}

function clearParentSession() {
    activeParentSession = null;
    saveParentSession(null);
    secretKeyInput.value = "";
    refreshParentAuthStatus();
    refreshSignerStatus();
    refreshAuthControls();
}

function ensureLoggedOutFor(nextMethod) {
    if (!activeParentSession) {
        return true;
    }

    const currentMethod = AUTH_METHOD_LABELS[activeParentSession.method];
    const requestedMethod = AUTH_METHOD_LABELS[nextMethod];
    const message = `${currentMethod} でログイン中です。${requestedMethod} でログインするには先にログアウトしてください。`;
    setAuthFeedback(message, "warn");
    appendLog("warn", message);
    return false;
}

function buildSecretKeySigner(session) {
    return {
        async getPublicKey() {
            return session.pubkeyHex;
        },
        async signEvent(event) {
            return finalizeEvent(
                {
                    kind: event.kind,
                    content: event.content,
                    tags: event.tags ?? [],
                    created_at: event.created_at,
                },
                session.secretKeyBytes,
            );
        },
    };
}

function getActiveSigner() {
    if (!activeParentSession) {
        throw new Error("親クライアントがログインしていません");
    }

    return activeParentSession.method === "nip07"
        ? getNip07Signer()
        : buildSecretKeySigner(activeParentSession);
}

function truncateMiddle(value, head = 8, tail = 8) {
    if (!isNonEmptyString(value) || value.length <= head + tail + 3) {
        return value;
    }

    return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

function normalizeTimelineContent(content) {
    if (typeof content !== "string") {
        return "(本文なし)";
    }

    const normalized = content.replace(/\r\n/g, "\n").trim();
    if (!normalized) {
        return "(本文なし)";
    }

    return normalized.length > 280 ? `${normalized.slice(0, 280)}…` : normalized;
}

function formatTimelineTimestamp(createdAt) {
    if (!Number.isInteger(createdAt)) {
        return "時刻不明";
    }

    return new Date(createdAt * 1000).toLocaleString();
}

function isTimelineEvent(event) {
    return isRecord(event)
        && event.kind === 1
        && isHex64(event.id)
        && isHex64(event.pubkey)
        && Number.isInteger(event.created_at)
        && typeof event.content === "string"
        && Array.isArray(event.tags);
}

function createTimelineReference(event) {
    return {
        eventId: event.id,
        queryValue: neventEncode({
            id: event.id,
            relays: TIMELINE_RELAYS,
            author: event.pubkey,
            kind: event.kind,
        }),
        pubkey: event.pubkey,
        createdAt: event.created_at,
        preview: normalizeTimelineContent(event.content),
    };
}

function isReplySelected(eventId) {
    return selectedReplyReference?.eventId === eventId;
}

function isQuoteSelected(eventId) {
    return selectedQuoteReferences.some((reference) => reference.eventId === eventId);
}

function updateTimelineSelection() {
    const replyLabel = selectedReplyReference
        ? `${truncateMiddle(selectedReplyReference.eventId)} / ${truncateMiddle(selectedReplyReference.pubkey, 8, 6)}`
        : "なし";
    const quoteLabel = selectedQuoteReferences.length === 0
        ? "0 件"
        : `${selectedQuoteReferences.length} 件 (${selectedQuoteReferences
            .slice(0, 2)
            .map((reference) => truncateMiddle(reference.eventId))
            .join(", ")}${selectedQuoteReferences.length > 2 ? ", ..." : ""})`;

    timelineSelection.textContent = `reply: ${replyLabel} / quote: ${quoteLabel}`;
    clearReplyQuoteButton.disabled = !selectedReplyReference && selectedQuoteReferences.length === 0;
}

function createTimelineItem(event) {
    const article = document.createElement("article");
    article.className = "timeline-item";

    const header = document.createElement("div");
    header.className = "timeline-item-header";

    const author = document.createElement("span");
    author.textContent = `pubkey ${truncateMiddle(event.pubkey, 10, 8)}`;

    const timestamp = document.createElement("span");
    timestamp.textContent = formatTimelineTimestamp(event.created_at);

    const eventId = document.createElement("span");
    eventId.className = "timeline-event-id";
    eventId.textContent = truncateMiddle(event.id, 12, 10);

    header.append(author, timestamp, eventId);

    const content = document.createElement("div");
    content.className = "timeline-content";
    content.textContent = normalizeTimelineContent(event.content);

    const actions = document.createElement("div");
    actions.className = "timeline-actions";

    const replyButton = document.createElement("button");
    replyButton.type = "button";
    replyButton.className = `secondary${isReplySelected(event.id) ? " is-active" : ""}`;
    replyButton.textContent = isReplySelected(event.id) ? "reply 解除" : "reply テスト";
    replyButton.addEventListener("click", () => {
        void selectReplyEvent(event);
    });

    const quoteButton = document.createElement("button");
    quoteButton.type = "button";
    quoteButton.className = `secondary${isQuoteSelected(event.id) ? " is-active" : ""}`;
    quoteButton.textContent = isQuoteSelected(event.id) ? "quote 解除" : "quote 追加";
    quoteButton.addEventListener("click", () => {
        void toggleQuoteEvent(event);
    });

    actions.append(replyButton, quoteButton);
    article.append(header, content, actions);

    return article;
}

function renderTimeline() {
    timelineList.textContent = "";

    if (timelineEvents.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "timeline-empty";
        emptyState.textContent = "タイムラインをまだ取得していません。";
        timelineList.append(emptyState);
        updateTimelineSelection();
        return;
    }

    timelineEvents.forEach((event) => {
        timelineList.append(createTimelineItem(event));
    });

    updateTimelineSelection();
}

function mergeTimelineEvents(events) {
    const merged = new Map(timelineEvents.map((event) => [event.id, event]));

    events.forEach((event) => {
        if (!isTimelineEvent(event)) {
            return;
        }
        merged.set(event.id, event);
    });

    timelineEvents = [...merged.values()]
        .sort((left, right) => right.created_at - left.created_at || left.id.localeCompare(right.id))
        .slice(0, TIMELINE_EVENT_LIMIT);
}

function buildComposerContextPayload() {
    return {
        ...(selectedReplyReference ? { reply: selectedReplyReference.queryValue } : {}),
        quotes: selectedQuoteReferences.map((reference) => reference.queryValue),
    };
}

function reloadIframeForReplyQuote(reason, detail) {
    updateDisplayedEmbedUrl();

    if (!isIframeReady) {
        loadIframe();
        appendLog("info", reason, detail);
        return;
    }

    try {
        const payload = buildComposerContextPayload();
        postToIframe("composer.setContext", payload);
        updateStatus(handshakeStatus, "reply / quote コンテキストを同期しました", "ok");
        appendLog("info", reason, detail);
    } catch (error) {
        appendLog("warn", "runtime context 同期に失敗したため iframe を再読み込みします", error instanceof Error ? error.message : String(error));
        loadIframe();
        appendLog("info", reason, detail);
    }
}

async function selectReplyEvent(event) {
    const reference = createTimelineReference(event);

    if (isReplySelected(reference.eventId)) {
        selectedReplyReference = null;
        renderTimeline();
        reloadIframeForReplyQuote("reply テスト設定を解除しました", {
            quoteCount: selectedQuoteReferences.length,
        });
        return;
    }

    selectedReplyReference = reference;
    selectedQuoteReferences = selectedQuoteReferences.filter(
        (quoteReference) => quoteReference.eventId !== reference.eventId,
    );

    renderTimeline();
    reloadIframeForReplyQuote("reply テスト設定を更新しました", {
        reply: reference.queryValue,
        quoteCount: selectedQuoteReferences.length,
    });
}

async function toggleQuoteEvent(event) {
    const reference = createTimelineReference(event);

    if (isQuoteSelected(reference.eventId)) {
        selectedQuoteReferences = selectedQuoteReferences.filter(
            (quoteReference) => quoteReference.eventId !== reference.eventId,
        );
        renderTimeline();
        reloadIframeForReplyQuote("quote テスト設定を更新しました", {
            reply: selectedReplyReference?.queryValue,
            quoteCount: selectedQuoteReferences.length,
        });
        return;
    }

    if (isReplySelected(reference.eventId)) {
        selectedReplyReference = null;
    }

    selectedQuoteReferences = [...selectedQuoteReferences, reference];
    renderTimeline();
    reloadIframeForReplyQuote("quote テスト設定を更新しました", {
        reply: selectedReplyReference?.queryValue,
        quoteCount: selectedQuoteReferences.length,
    });
}

function clearReplyQuoteSelection() {
    if (!selectedReplyReference && selectedQuoteReferences.length === 0) {
        return;
    }

    selectedReplyReference = null;
    selectedQuoteReferences = [];
    renderTimeline();
    updateDisplayedEmbedUrl();

    if (!isIframeReady) {
        loadIframe();
        appendLog("info", "reply / quote テスト設定を解除しました", null);
        return;
    }

    try {
        postToIframe("composer.clearContext");
        updateStatus(handshakeStatus, "reply / quote コンテキストを解除しました", "ok");
        appendLog("info", "reply / quote テスト設定を解除しました", null);
    } catch (error) {
        appendLog("warn", "runtime context 解除に失敗したため iframe を再読み込みします", error instanceof Error ? error.message : String(error));
        loadIframe();
        appendLog("info", "reply / quote テスト設定を解除しました", null);
    }
}

function startTimelineSubscription() {
    const since = timelineEvents[0]?.created_at
        ? timelineEvents[0].created_at + 1
        : Math.floor(Date.now() / 1000) - 300;

    timelineSubscription = timelinePool.subscribeMany(
        TIMELINE_RELAYS,
        {
            kinds: [1],
            since,
        },
        {
            label: "embed sample timeline",
            onevent(event) {
                mergeTimelineEvents([event]);
                renderTimeline();
                updateStatus(
                    timelineStatus,
                    `${TIMELINE_RELAYS[0]} 接続中 (${timelineEvents.length} 件)`,
                    "ok",
                );
            },
        },
    );
}

async function loadTimeline() {
    refreshTimelineButton.disabled = true;
    updateStatus(timelineStatus, "タイムライン読み込み中", "warn");

    if (timelineSubscription) {
        timelineSubscription.close("timeline-refresh");
        timelineSubscription = null;
    }

    try {
        const events = await timelinePool.querySync(
            TIMELINE_RELAYS,
            {
                kinds: [1],
                limit: TIMELINE_EVENT_LIMIT,
            },
            {
                label: "embed sample timeline sync",
                maxWait: TIMELINE_QUERY_MAX_WAIT_MS,
            },
        );

        mergeTimelineEvents(events);
        renderTimeline();
        startTimelineSubscription();
        updateStatus(
            timelineStatus,
            `${TIMELINE_RELAYS[0]} 接続中 (${timelineEvents.length} 件)`,
            "ok",
        );
        appendLog("info", "簡易タイムラインを更新しました", {
            relay: TIMELINE_RELAYS[0],
            count: timelineEvents.length,
        });
    } catch (error) {
        updateStatus(timelineStatus, "タイムライン取得失敗", "error");
        renderTimeline();
        appendLog("error", "簡易タイムラインの取得に失敗しました", error instanceof Error ? error.message : String(error));
    } finally {
        refreshTimelineButton.disabled = false;
    }
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
    url.searchParams.delete("reply");
    url.searchParams.delete("quote");

    if (selectedReplyReference) {
        url.searchParams.set("reply", selectedReplyReference.queryValue);
    }

    selectedQuoteReferences.forEach((reference) => {
        url.searchParams.append("quote", reference.queryValue);
    });

    return url.toString();
}

function updateDisplayedEmbedUrl() {
    iframeSrcDisplay.textContent = buildEmbedUrl();
}

function loadIframe() {
    const embedUrl = buildEmbedUrl();
    isIframeReady = false;
    iframe.src = embedUrl;
    iframeSrcDisplay.textContent = embedUrl;
    updateStatus(handshakeStatus, "iframe 読み込み中", "warn");
    appendLog("info", "iframe を再読み込みしました", { embedUrl });
}

async function resolveCurrentPubkey() {
    const pubkeyHex = await getActiveSigner().getPublicKey();
    if (!isHex64(pubkeyHex)) {
        throw new Error("signer が不正な pubkey を返しました");
    }

    if (activeParentSession && activeParentSession.pubkeyHex !== pubkeyHex) {
        activeParentSession = {
            ...activeParentSession,
            pubkeyHex,
        };
        saveParentSession(activeParentSession);
        refreshParentAuthStatus();
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
    isIframeReady = true;

    if (!activeParentSession) {
        updateStatus(handshakeStatus, "ready を受信。未ログイン待機中", "ok");
        appendLog("info", "ready を受信しました。親クライアントがログインした時点で auth.login を送信します");
        return;
    }

    updateStatus(handshakeStatus, "ready を受信。親ログイン状態を同期中", "ok");
    appendLog("info", "ready を受信したため保存済みの親ログイン状態を iframe へ同期します");
    await announceLogin({ source: "ready" });
}

async function activateParentSession(session, options = {}) {
    setParentSession(session);
    lastPubkeyHex = session.pubkeyHex;
    setAuthFeedback(`${AUTH_METHOD_LABELS[session.method]}でログインしました`, "ok");
    appendLog("info", `${AUTH_METHOD_LABELS[session.method]} で親クライアントをログイン状態にしました`, {
        pubkeyHex: session.pubkeyHex,
    });
    await announceLogin({ source: options.source ?? "manual" });
}

async function handleNip07Login() {
    if (!ensureLoggedOutFor("nip07")) {
        return;
    }

    try {
        const pubkeyHex = await getNip07Signer().getPublicKey();
        if (!isHex64(pubkeyHex)) {
            throw new Error("signer が不正な pubkey を返しました");
        }

        setAuthFeedback();
        await activateParentSession({
            method: "nip07",
            pubkeyHex,
        }, {
            source: "manual",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAuthFeedback(`NIP-07 ログインに失敗しました: ${message}`, "error");
        appendLog("error", "NIP-07 ログインに失敗しました", message);
    }
}

async function handleSecretKeyLogin() {
    if (!ensureLoggedOutFor("nsec")) {
        return;
    }

    try {
        setAuthFeedback();
        await activateParentSession(createSecretKeySession(secretKeyInput.value), {
            source: "manual",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAuthFeedback(`秘密鍵ログインに失敗しました: ${message}`, "error");
        appendLog("error", "秘密鍵ログインに失敗しました", message);
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
    const signer = getActiveSigner();

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

async function announceLogin(options = {}) {
    const methodLabel = activeParentSession
        ? AUTH_METHOD_LABELS[activeParentSession.method]
        : "親クライアント";

    try {
        if (!activeParentSession) {
            throw new Error("parent_client_not_logged_in");
        }

        const pubkeyHex = await resolveCurrentPubkey();

        if (options.source !== "ready" && !isIframeReady) {
            updateStatus(handshakeStatus, "親ログイン済み。iframe ready 待ち", "ok");
            appendLog("info", `${methodLabel} でログイン済みです。ready 受信後に auth.login を送信します`, { pubkeyHex });
            return;
        }

        postToIframe("auth.login", { pubkeyHex });
        updateStatus(handshakeStatus, options.source === "ready"
            ? `${methodLabel} のログイン状態を再同期しました`
            : `${methodLabel} のログイン状態を同期しました`, "ok");
    } catch (error) {
        if (options.source === "ready") {
            clearParentSession();
            setAuthFeedback("保存済みの親ログイン状態を復元できませんでした。再ログインしてください。", "warn");
            updateStatus(handshakeStatus, "親ログイン状態の再同期に失敗", "warn");
        }
        appendLog("error", "auth.login の送信に失敗しました", error instanceof Error ? error.message : String(error));
    }
}

async function announceLogout() {
    const methodLabel = activeParentSession
        ? AUTH_METHOD_LABELS[activeParentSession.method]
        : "親クライアント";

    try {
        const pubkeyHex = activeParentSession?.pubkeyHex ?? lastPubkeyHex;
        clearParentSession();
        setAuthFeedback(`${methodLabel} からログアウトしました`, "ok");

        if (!pubkeyHex) {
            updateStatus(handshakeStatus, "親ログアウト済み", "warn");
            appendLog("info", `${methodLabel} をログアウトしました`);
            return;
        }

        if (!isIframeReady) {
            updateStatus(handshakeStatus, "親ログアウト済み。iframe 未接続", "warn");
            appendLog("info", `${methodLabel} をログアウトしました。再接続後も auth.login は送信されません`, { pubkeyHex });
            return;
        }

        postToIframe("auth.logout", { pubkeyHex });
        updateStatus(handshakeStatus, "親ログアウトに合わせ auth.logout を送信しました", "warn");
        appendLog("info", `${methodLabel} のログアウトを iframe に通知しました`, { pubkeyHex });
    } catch (error) {
        appendLog("error", "auth.logout の送信に失敗しました", error instanceof Error ? error.message : String(error));
    }
}

appUrlInput.value = getDefaultAppUrl();
parentOriginInput.value = window.location.origin;
const storedParentSession = loadParentSession();
if (storedParentSession) {
    setParentSession(storedParentSession);
    appendLog("info", `保存済みの ${AUTH_METHOD_LABELS[storedParentSession.method]} ログイン状態を復元しました。ready 受信後に auth.login を再送します`, {
        pubkeyHex: storedParentSession.pubkeyHex ?? undefined,
    });
} else {
    refreshParentAuthStatus();
    refreshSignerStatus();
    refreshAuthControls();
}

renderTimeline();
updateDisplayedEmbedUrl();
reloadIframeButton.addEventListener("click", loadIframe);
loginNip07Button.addEventListener("click", () => {
    void handleNip07Login();
});
secretKeyInput.addEventListener("input", () => {
    setAuthFeedback();
    refreshAuthControls();
});
loginSecretKeyButton.addEventListener("click", () => {
    void handleSecretKeyLogin();
});
announceLogoutButton.addEventListener("click", () => {
    void announceLogout();
});
refreshTimelineButton.addEventListener("click", () => {
    void loadTimeline();
});
clearReplyQuoteButton.addEventListener("click", clearReplyQuoteSelection);
clearLogButton.addEventListener("click", () => {
    eventLog.value = "";
});

window.addEventListener("message", (event) => {
    void handleEmbedMessage(event);
});
window.addEventListener("focus", refreshSignerStatus);
window.addEventListener("beforeunload", () => {
    timelineSubscription?.close("page-unload");
    timelinePool.close(TIMELINE_RELAYS);
    timelinePool.destroy();
});

loadIframe();
void loadTimeline();