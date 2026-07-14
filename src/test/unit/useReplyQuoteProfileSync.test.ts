import { flushSync } from "svelte";
import { describe, expect, it, vi } from "vitest";

import { createReplyQuoteProfileSyncHookHarness } from "../helpers/replyQuoteProfileSyncHookHarness.svelte";
import type { ReplyQuoteProfileSyncController } from "../../lib/replyQuoteProfileSync";
import type { ReplyQuoteComposerState } from "../../lib/types";

describe("useReplyQuoteProfileSync", () => {
    it("starts after async service initialization without recreating on state changes", () => {
        const state: ReplyQuoteComposerState = { reply: null, quotes: [] };
        let listener: (() => void) | undefined;
        const unsubscribe = vi.fn();
        const controller: ReplyQuoteProfileSyncController = {
            sync: vi.fn(),
            dispose: vi.fn(),
        };
        const createController = vi.fn(() => controller);
        const harness = createReplyQuoteProfileSyncHookHarness({
            getReplyQuoteState: () => state,
            onReplyQuoteChanged: (next) => {
                listener = next;
                return unsubscribe;
            },
            createController,
        });

        flushSync();
        expect(createController).not.toHaveBeenCalled();

        const serviceA = {} as never;
        flushSync(() => harness.setService(serviceA));

        expect(createController).toHaveBeenCalledOnce();
        expect(createController).toHaveBeenCalledWith(serviceA);
        expect(controller.sync).toHaveBeenCalledOnce();
        expect(controller.sync).toHaveBeenCalledWith(state);

        listener?.();
        listener?.();

        expect(createController).toHaveBeenCalledOnce();
        expect(controller.sync).toHaveBeenCalledTimes(3);
        expect(controller.dispose).not.toHaveBeenCalled();
        expect(unsubscribe).not.toHaveBeenCalled();

        harness.dispose();
    });

    it("disposes the old controller on service switch and the active controller on destroy", () => {
        const state: ReplyQuoteComposerState = { reply: null, quotes: [] };
        const unsubscribeA = vi.fn();
        const unsubscribeB = vi.fn();
        const controllerA: ReplyQuoteProfileSyncController = {
            sync: vi.fn(),
            dispose: vi.fn(),
        };
        const controllerB: ReplyQuoteProfileSyncController = {
            sync: vi.fn(),
            dispose: vi.fn(),
        };
        const services = [{}, {}] as never[];
        const createController = vi.fn()
            .mockReturnValueOnce(controllerA)
            .mockReturnValueOnce(controllerB);
        const onReplyQuoteChanged = vi.fn()
            .mockReturnValueOnce(unsubscribeA)
            .mockReturnValueOnce(unsubscribeB);
        const harness = createReplyQuoteProfileSyncHookHarness({
            getReplyQuoteState: () => state,
            onReplyQuoteChanged,
            createController,
        });

        flushSync(() => harness.setService(services[0]));
        flushSync(() => harness.setService(services[1]));

        expect(controllerA.dispose).toHaveBeenCalledOnce();
        expect(unsubscribeA).toHaveBeenCalledOnce();
        expect(controllerB.sync).toHaveBeenCalledOnce();
        expect(controllerB.dispose).not.toHaveBeenCalled();

        harness.dispose();

        expect(unsubscribeB).toHaveBeenCalledOnce();
        expect(controllerB.dispose).toHaveBeenCalledOnce();
    });
});
