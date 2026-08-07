import { describe, expect, it } from "vitest";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";
import { getTrustedParentEmbedMessage } from "../../lib/embedMessageTrustGate";
import { createMockWindow } from "../embedWindowTestUtils";

function createEvent(
    data: unknown,
    origin: string,
    source: MessageEventSource | null,
): MessageEvent {
    return { data, origin, source } as MessageEvent;
}

function createEnvelope() {
    return {
        namespace: EMBED_MESSAGE_NAMESPACE,
        version: EMBED_MESSAGE_VERSION,
        type: "settings.set",
        requestId: "request-1",
    };
}

describe("getTrustedParentEmbedMessage", () => {
    it("valid envelope、exact parent source、exact trusted originを受理する", () => {
        const { windowObj, parent } = createMockWindow();
        const event = createEvent(
            createEnvelope(),
            "https://parent.example.com",
            parent as unknown as MessageEventSource,
        );

        expect(getTrustedParentEmbedMessage(
            event,
            windowObj,
            "https://parent.example.com",
        )).toEqual(createEnvelope());
    });

    it.each([
        ["namespace不一致", { ...createEnvelope(), namespace: "other.embed" }],
        ["version不一致", { ...createEnvelope(), version: 2 }],
        ["envelopeではないdata", { type: "settings.set" }],
    ])("%sを拒否する", (_description, data) => {
        const { windowObj, parent } = createMockWindow();

        expect(getTrustedParentEmbedMessage(
            createEvent(
                data,
                "https://parent.example.com",
                parent as unknown as MessageEventSource,
            ),
            windowObj,
            "https://parent.example.com",
        )).toBeNull();
    });

    it("source不一致を拒否する", () => {
        const { windowObj } = createMockWindow();

        expect(getTrustedParentEmbedMessage(
            createEvent(
                createEnvelope(),
                "https://parent.example.com",
                {} as MessageEventSource,
            ),
            windowObj,
            "https://parent.example.com",
        )).toBeNull();
    });

    it("同一originのsibling sourceを拒否する", () => {
        const { windowObj } = createMockWindow();
        const sibling = {} as MessageEventSource;

        expect(getTrustedParentEmbedMessage(
            createEvent(createEnvelope(), "https://parent.example.com", sibling),
            windowObj,
            "https://parent.example.com",
        )).toBeNull();
    });

    it("origin不一致を拒否する", () => {
        const { windowObj, parent } = createMockWindow();

        expect(getTrustedParentEmbedMessage(
            createEvent(
                createEnvelope(),
                "https://other.example.com",
                parent as unknown as MessageEventSource,
            ),
            windowObj,
            "https://parent.example.com",
        )).toBeNull();
    });

    it("trusted originがnullの場合は既存どおりoriginを追加で判定しない", () => {
        const { windowObj, parent } = createMockWindow();
        const event = createEvent(
            createEnvelope(),
            "https://other.example.com",
            parent as unknown as MessageEventSource,
        );

        expect(getTrustedParentEmbedMessage(event, windowObj, null)).toEqual(
            createEnvelope(),
        );
    });

    it("runtimeでunknown typeでも既存envelope判定どおり返す", () => {
        const { windowObj, parent } = createMockWindow();
        const message = { ...createEnvelope(), type: "future.message" };

        expect(getTrustedParentEmbedMessage(
            createEvent(
                message,
                "https://parent.example.com",
                parent as unknown as MessageEventSource,
            ),
            windowObj,
            "https://parent.example.com",
        )).toEqual(message);
    });
});
