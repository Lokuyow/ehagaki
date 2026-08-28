import { afterEach, describe, expect, it, vi } from "vitest";

const rxReqMock = vi.hoisted(() => ({ emit: vi.fn(), over: vi.fn() }));

vi.mock("rx-nostr", () => ({
    createRxBackwardReq: vi.fn(() => rxReqMock),
}));
vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({ event, attestation: {} }),
    isCurrentPostHistoryRawEventAttestation: () => true,
    usePostHistoryRelayEvents: (rxNostr: { use: Function }, rxReq: unknown, options: unknown) =>
        rxNostr.use(rxReq, options),
}));

import { PostHistoryContextFetchService } from "../../lib/postHistoryContextFetchService";
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
} from "../../lib/hostRelayRuntime";

afterEach(() => deactivateHostRelayConfig());

describe("PostHistoryContextFetchService", () => {
    it("merges all Host read defaults with only the limited contextual hint set", async () => {
        const hostConfig = Object.fromEntries(Array.from({ length: 9 }, (_, index) => [
            `wss://host-read-${index + 1}.example`,
            { read: true, write: false },
        ]));
        activateHostRelayConfig(hostConfig);
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: ({ complete }: { complete: () => void }) => {
                    complete();
                    return { unsubscribe: vi.fn() };
                },
            }),
        };
        const service = new PostHistoryContextFetchService({
            setTimeoutFn: (() => 1) as any,
            clearTimeoutFn: vi.fn(),
        });

        await service.fetchEventById(rxNostr as any, {
            eventId: "a".repeat(64),
            relayConfig: hostConfig,
            relayHints: Array.from({ length: 10 }, (_, index) => `wss://hint-${index + 1}.example`),
        }).promise;

        expect(rxNostr.use).toHaveBeenCalledWith(rxReqMock, {
            on: {
                relays: [
                    ...Array.from({ length: 9 }, (_, index) => `wss://host-read-${index + 1}.example/`),
                    ...Array.from({ length: 8 }, (_, index) => `wss://hint-${index + 1}.example/`),
                ],
            },
        });
    });
});
