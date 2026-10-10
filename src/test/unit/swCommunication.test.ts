import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
    getLatest: vi.fn(),
}));

vi.mock("../../lib/storage/sharedMediaRepository", () => ({
    sharedMediaRepository: {
        getLatest: mockState.getLatest,
    },
}));

import { getSharedMediaWithFallback } from "../../lib/utils/swCommunication";

describe("swCommunication", () => {
    let serviceWorkerDescriptor: PropertyDescriptor | undefined;

    beforeEach(() => {
        serviceWorkerDescriptor = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");
        mockState.getLatest.mockResolvedValue(null);
    });

    afterEach(() => {
        vi.clearAllMocks();
        if (serviceWorkerDescriptor) {
            Object.defineProperty(navigator, "serviceWorker", serviceWorkerDescriptor);
        } else {
            Reflect.deleteProperty(navigator, "serviceWorker");
        }
    });

    function installController(response: unknown): ReturnType<typeof vi.fn> {
        const postMessage = vi.fn((message: { action: string }, ports: MessagePort[]) => {
            ports[0]?.postMessage({ data: response });
        });
        Object.defineProperty(navigator, "serviceWorker", {
            configurable: true,
            value: { controller: { postMessage } },
        });
        return postMessage;
    }

    it("accepts a structurally valid Service Worker response", async () => {
        const postMessage = installController({
            images: [],
            title: "Shared title",
        });

        await expect(getSharedMediaWithFallback()).resolves.toMatchObject({
            images: [],
            title: "Shared title",
        });
        expect(postMessage).toHaveBeenCalledTimes(1);
    });

    it("rejects image entries that are not structured-cloned Files", async () => {
        const postMessage = installController({
            images: [{ name: "not-a-file.png" }],
        });

        await expect(getSharedMediaWithFallback()).resolves.toBeNull();
        expect(postMessage).toHaveBeenCalledTimes(2);
    });
});
