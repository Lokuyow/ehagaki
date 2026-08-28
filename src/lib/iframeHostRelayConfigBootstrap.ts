import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
    embedMessageRequiresRequestId,
    getParentOriginFromSearch,
    isEmbedMessageEnvelope,
    isValidEmbedRequestId,
} from "./embedProtocol";
import { parseHostRelayConfig } from "./hostRelayConfig";
import type { RelayConfig } from "./types";

export const HOST_RELAY_CONFIG_QUERY_PARAM = "hostRelayConfig";
export const HOST_RELAY_CONFIG_BOOTSTRAP_TIMEOUT_MS = 10000;

export type HostRelayBootstrapResult =
    | { enabled: false }
    | { enabled: true; relayConfig: RelayConfig }
    | { enabled: true; error: { code: string; message?: string } };

function isHostRelayConfigOptedIn(locationSearch: string): boolean {
    return new URLSearchParams(locationSearch).get(HOST_RELAY_CONFIG_QUERY_PARAM) === "1";
}

function isInIframe(windowObj: Window): boolean {
    try {
        return windowObj.self !== windowObj.top;
    } catch {
        return true;
    }
}

function createRequestId(windowObj: Window): string {
    return windowObj.crypto?.randomUUID?.()
        ?? `host-relay-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function postToParent(
    windowObj: Window,
    parentOrigin: string,
    type: "relays.request" | "relays.applied" | "relays.error",
    requestId: string,
    payload: Record<string, unknown>,
): void {
    windowObj.parent.postMessage({
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type,
        requestId,
        payload,
    }, parentOrigin);
}

/**
 * Resolves before App is imported. A marker is an explicit host-routing
 * contract, so every failure remains closed instead of falling back to user
 * relay discovery.
 */
export function bootstrapIframeHostRelayConfig(
    windowObj: Window = window,
    timeoutMs = HOST_RELAY_CONFIG_BOOTSTRAP_TIMEOUT_MS,
): Promise<HostRelayBootstrapResult> {
    const locationSearch = windowObj.location.search;
    if (!isHostRelayConfigOptedIn(locationSearch)) {
        return Promise.resolve({ enabled: false });
    }

    const parentOrigin = getParentOriginFromSearch(locationSearch);
    if (!isInIframe(windowObj) || !parentOrigin) {
        return Promise.resolve({
            enabled: true,
            error: { code: "relay_config_parent_unavailable" },
        });
    }

    const requestId = createRequestId(windowObj);
    return new Promise((resolve) => {
        let settled = false;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const finish = (result: HostRelayBootstrapResult) => {
            if (settled) return;
            settled = true;
            if (timeoutId !== undefined) clearTimeout(timeoutId);
            windowObj.removeEventListener("message", onMessage);
            resolve(result);
        };

        const fail = (code: string, message?: string) => {
            try {
                postToParent(windowObj, parentOrigin, "relays.error", requestId, {
                    timestamp: Date.now(),
                    code,
                    ...(message ? { message } : {}),
                });
            } catch {
                // The failure is still fail-closed even if the parent cannot be notified.
            }
            finish({ enabled: true, error: { code, ...(message ? { message } : {}) } });
        };

        const onMessage = (event: MessageEvent) => {
            const message = event.data;
            const type = typeof message === "object" && message !== null
                ? (message as { type?: unknown }).type
                : undefined;
            const isRelayResponse = type === "relays.set" || type === "relays.error";
            if (!isRelayResponse) return;

            if (event.source !== windowObj.parent || event.origin !== parentOrigin) {
                fail("relay_config_untrusted_parent");
                return;
            }
            if (!isEmbedMessageEnvelope(message)) {
                fail("relay_config_envelope_invalid");
                return;
            }
            if (
                embedMessageRequiresRequestId(message.type)
                && (!isValidEmbedRequestId(message.requestId) || message.requestId !== requestId)
            ) {
                fail("relay_config_request_id_invalid");
                return;
            }
            if (message.type === "relays.error") {
                fail(
                    typeof (message.payload as { code?: unknown } | undefined)?.code === "string"
                        ? (message.payload as { code: string }).code
                        : "relay_config_parent_error",
                );
                return;
            }

            try {
                const relayConfig = parseHostRelayConfig(message.payload);
                postToParent(windowObj, parentOrigin, "relays.applied", requestId, {
                    timestamp: Date.now(),
                });
                finish({ enabled: true, relayConfig });
            } catch (error) {
                fail(
                    "relay_config_invalid_payload",
                    error instanceof Error ? error.message : undefined,
                );
            }
        };

        windowObj.addEventListener("message", onMessage);
        timeoutId = setTimeout(() => fail("relay_config_timeout"), Math.max(1, timeoutMs));
        try {
            postToParent(windowObj, parentOrigin, "relays.request", requestId, {
                timestamp: Date.now(),
            });
        } catch {
            fail("relay_config_request_failed");
        }
    });
}
