import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    createPostHistoryThreadGraphParentLoadingIndicator,
} from "../../lib/postHistoryThreadGraphParentLoadingIndicator";

describe("postHistoryThreadGraphParentLoadingIndicator", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("同じ key を再 schedule すると前回 timer を置き換える", () => {
        const indicator = createPostHistoryThreadGraphParentLoadingIndicator();
        const callback = vi.fn();

        indicator.schedule("node-1", callback, 100);
        indicator.schedule("node-1", callback, 100);

        vi.advanceTimersByTime(100);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("clear は指定 key の timer を解除する", () => {
        const indicator = createPostHistoryThreadGraphParentLoadingIndicator();
        const callback = vi.fn();

        indicator.schedule("node-1", callback, 100);
        indicator.clear("node-1");

        vi.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
    });

    it("clearAll は全 timer を解除する", () => {
        const indicator = createPostHistoryThreadGraphParentLoadingIndicator();
        const callback = vi.fn();

        indicator.schedule("node-1", callback, 100);
        indicator.schedule("node-2", callback, 100);
        indicator.clearAll();

        vi.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
    });
});
