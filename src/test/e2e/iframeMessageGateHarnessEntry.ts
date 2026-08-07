import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";

type HarnessWindow = Window & typeof globalThis & {
    __IFRAME_MESSAGE_GATE_HARNESS__?: {
        sendValidContext: () => void;
        sendInvalidEnvelopeContext: () => void;
        sendSiblingContext: () => void;
        sendWrongOriginContext: () => void;
        sendSiblingStorageResult: () => void;
        sendStorageResult: () => void;
    };
};

type StorageRequest = {
    requestId: string;
};

const frames = document.getElementById("frames")!;
const ready = document.getElementById("harness-ready")!;
const storageRequestId = document.getElementById("storage-request-id")!;
const siblingSendStatus = document.getElementById("sibling-send-status")!;
const origin = window.location.origin;

function createFrame(name: string, src: string): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.name = name;
    iframe.title = name;
    iframe.src = src;
    frames.append(iframe);
    return iframe;
}

const target = createFrame(
    "iframe-message-gate-target",
    `iframe-message-gate-child-playwright.html?parentOrigin=${encodeURIComponent(origin)}`,
);
const wrongOriginTarget = createFrame(
    "iframe-message-gate-wrong-origin-target",
    "iframe-message-gate-child-playwright.html?parentOrigin=https%3A%2F%2Funtrusted.example.com",
);
const sender = createFrame(
    "iframe-message-gate-sender",
    "iframe-message-gate-sender-playwright.html",
);

let latestStorageRequest: StorageRequest | null = null;

function contextEnvelope() {
    return {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "composer.setContext",
        requestId: "context-request",
        payload: { content: "iframe gate harness" },
    };
}

function storageResultEnvelope(value: string) {
    if (!latestStorageRequest) return null;
    return {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "storage.result",
        requestId: latestStorageRequest.requestId,
        payload: {
            timestamp: Date.now(),
            values: { locale: value },
        },
    };
}

function postFromParent(targetFrame: HTMLIFrameElement, message: unknown): void {
    targetFrame.contentWindow?.postMessage(message, origin);
}

function postFromSibling(message: unknown): void {
    siblingSendStatus.textContent = "";
    sender.contentWindow?.postMessage(
        {
            type: "iframe-message-gate.send",
            targetName: target.name,
            targetOrigin: origin,
            message,
        },
        origin,
    );
}

window.addEventListener("message", (event) => {
    if (event.source === sender.contentWindow && event.data?.type === "iframe-message-gate.sender.sent") {
        siblingSendStatus.textContent = "sent";
        return;
    }

    if (
        event.source === target.contentWindow
        && event.data?.type === "storage.get"
        && typeof event.data.requestId === "string"
    ) {
        latestStorageRequest = { requestId: event.data.requestId };
        storageRequestId.textContent = event.data.requestId;
    }
});

(window as HarnessWindow).__IFRAME_MESSAGE_GATE_HARNESS__ = {
    sendValidContext: () => postFromParent(target, contextEnvelope()),
    sendInvalidEnvelopeContext: () => postFromParent(target, {
        ...contextEnvelope(),
        namespace: "invalid.embed",
    }),
    sendSiblingContext: () => postFromSibling(contextEnvelope()),
    sendWrongOriginContext: () => postFromParent(wrongOriginTarget, contextEnvelope()),
    sendSiblingStorageResult: () => {
        const message = storageResultEnvelope("fake");
        if (message) postFromSibling(message);
    },
    sendStorageResult: () => {
        const message = storageResultEnvelope("en");
        if (message) postFromParent(target, message);
    },
};

Promise.all([target, wrongOriginTarget, sender].map((iframe) => new Promise<void>((resolve) => {
    iframe.addEventListener("load", () => resolve(), { once: true });
}))).then(() => {
    ready.textContent = "true";
});
