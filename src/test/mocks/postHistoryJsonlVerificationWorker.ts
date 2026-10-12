import { afterEach, beforeEach, vi } from "vitest";
import type { VerificationRequest, VerificationResponse } from "@rx-nostr/crypto";
import { verifyPostHistoryJsonlEvent } from "../../lib/postHistoryJsonlEventVerifier";

/** Official wire protocol with real crypto, controllable delivery, no browser. */
export class PostHistoryJsonlVerificationWorkerMock extends EventTarget implements Worker {
    static instances: PostHistoryJsonlVerificationWorkerMock[] = [];
    onmessage: Worker["onmessage"] = null;
    onmessageerror: Worker["onmessageerror"] = null;
    onerror: Worker["onerror"] = null;
    terminated = false;
    hold = false;
    requests: VerificationRequest[] = [];
    deliveries: (() => void)[] = [];
    constructor(..._args: unknown[]) { super(); PostHistoryJsonlVerificationWorkerMock.instances.push(this); }
    postMessage(message: VerificationRequest | "ping"): void {
        if (message === "ping") {
            queueMicrotask(() => this.reply("pong"));
            return;
        }
        const request = { ...message, event: structuredClone(message.event) };
        this.requests.push(request);
        const deliver = () => {
            void verifyPostHistoryJsonlEvent(request.event).then(
                ok => this.reply({ reqId: request.reqId, ok }),
                () => this.reply({ reqId: request.reqId, ok: false, error: "test runtime failure" }),
            );
        };
        if (this.hold) this.deliveries.push(deliver);
        else queueMicrotask(deliver);
    }
    reply(data: VerificationResponse | "pong"): void {
        if (!this.terminated) this.dispatchEvent(new MessageEvent("message", { data }));
    }
    release(): void { for (const deliver of this.deliveries.splice(0)) deliver(); }
    terminate(): void { this.terminated = true; }
}

export function usePostHistoryJsonlVerificationWorkerMock(): void {
    beforeEach(() => {
        PostHistoryJsonlVerificationWorkerMock.instances = [];
        vi.stubGlobal("Worker", PostHistoryJsonlVerificationWorkerMock);
    });
    afterEach(() => {
        for (const worker of PostHistoryJsonlVerificationWorkerMock.instances) worker.terminate();
        vi.unstubAllGlobals();
    });
}
