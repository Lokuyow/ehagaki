import { afterEach, describe, expect, it, vi } from "vitest";
import {
    bootstrapIframeHostRelayConfig,
    HOST_RELAY_CONFIG_BOOTSTRAP_TIMEOUT_MS,
} from "../../lib/iframeHostRelayConfigBootstrap";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";
import { createMockWindow } from "../embedWindowTestUtils";

const parentOrigin = "https://parent.example.com";

function relayResponse(type: "relays.set" | "relays.error", requestId: string, payload: unknown) {
    return {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type,
        requestId,
        payload,
    };
}

function requestIdFromParentCall(parent: { postMessage: ReturnType<typeof vi.fn> }): string {
    return parent.postMessage.mock.calls[0][0].requestId;
}

describe("iframe Host Relay Config bootstrap", () => {
    afterEach(() => vi.useRealTimers());

    it("is inert for markerless iframes", async () => {
        const { windowObj, parent } = createMockWindow();

        await expect(bootstrapIframeHostRelayConfig(windowObj)).resolves.toEqual({ enabled: false });
        expect(parent.postMessage).not.toHaveBeenCalled();
    });

    it("requests and applies a trusted strict config before App bootstrap", async () => {
        const { windowObj, parent, listeners } = createMockWindow(
            "?parentOrigin=https%3A%2F%2Fparent.example.com&hostRelayConfig=1",
        );
        const pending = bootstrapIframeHostRelayConfig(windowObj);
        const requestId = requestIdFromParentCall(parent);

        expect(parent.postMessage).toHaveBeenCalledWith(expect.objectContaining({
            type: "relays.request",
            requestId,
        }), parentOrigin);

        listeners.get("message")?.({
            source: parent as unknown as MessageEventSource,
            origin: parentOrigin,
            data: relayResponse("relays.set", requestId, [
                { url: "wss://host.example", read: true, write: false },
            ]),
        } as MessageEvent);

        await expect(pending).resolves.toEqual({
            enabled: true,
            relayConfig: {
                "wss://host.example/": { read: true, write: false },
            },
        });
        expect(parent.postMessage).toHaveBeenLastCalledWith(expect.objectContaining({
            type: "relays.applied",
            requestId,
        }), parentOrigin);
        expect(listeners.get("message")).toBeUndefined();
    });

    it.each([
        ["untrusted source", (parent: unknown, requestId: string) => ({
            source: {} as MessageEventSource,
            origin: parentOrigin,
            data: relayResponse("relays.set", requestId, []),
        })],
        ["request id mismatch", (parent: unknown) => ({
            source: parent as MessageEventSource,
            origin: parentOrigin,
            data: relayResponse("relays.set", "other-request", []),
        })],
        ["invalid payload", (parent: unknown, requestId: string) => ({
            source: parent as MessageEventSource,
            origin: parentOrigin,
            data: relayResponse("relays.set", requestId, []),
        })],
    ])("fails closed for %s", async (_label, eventFactory) => {
        const { windowObj, parent, listeners } = createMockWindow(
            "?parentOrigin=https%3A%2F%2Fparent.example.com&hostRelayConfig=1",
        );
        const pending = bootstrapIframeHostRelayConfig(windowObj);
        const requestId = requestIdFromParentCall(parent);

        listeners.get("message")?.(eventFactory(parent, requestId) as MessageEvent);

        await expect(pending).resolves.toMatchObject({
            enabled: true,
            error: expect.objectContaining({ code: expect.stringMatching(/^relay_config_/) }),
        });
        expect(parent.postMessage).toHaveBeenLastCalledWith(expect.objectContaining({
            type: "relays.error",
            requestId,
        }), parentOrigin);
    });

    it("fails closed on timeout instead of starting normal relay bootstrap", async () => {
        vi.useFakeTimers();
        const { windowObj, parent } = createMockWindow(
            "?parentOrigin=https%3A%2F%2Fparent.example.com&hostRelayConfig=1",
        );
        const pending = bootstrapIframeHostRelayConfig(
            windowObj,
            HOST_RELAY_CONFIG_BOOTSTRAP_TIMEOUT_MS,
        );

        await vi.advanceTimersByTimeAsync(HOST_RELAY_CONFIG_BOOTSTRAP_TIMEOUT_MS);

        await expect(pending).resolves.toEqual({
            enabled: true,
            error: { code: "relay_config_timeout" },
        });
        expect(parent.postMessage).toHaveBeenLastCalledWith(expect.objectContaining({
            type: "relays.error",
        }), parentOrigin);
    });
});
