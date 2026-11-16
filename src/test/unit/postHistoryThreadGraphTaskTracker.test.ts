import { describe, expect, it } from "vitest";
import { createPostHistoryThreadGraphTaskTracker } from "../../lib/postHistoryThreadGraphTaskTracker";

describe("postHistoryThreadGraphTaskTracker", () => {
    it("graph request id を単調増加で管理する", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();

        expect(tracker.getRequestId()).toBe(0);
        expect(tracker.incrementRequestId()).toBe(1);
        expect(tracker.getRequestId()).toBe(1);
        expect(tracker.incrementRequestId()).toBe(2);
    });

    it("child request token を key ごとに保持し、削除と全消去ができる", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();

        const firstToken = tracker.createChildRequestToken("a");
        const secondToken = tracker.createChildRequestToken("b");

        expect(firstToken).toBe(1);
        expect(secondToken).toBe(2);
        expect(tracker.getChildRequestToken("a")).toBe(1);
        expect(tracker.getChildRequestToken("b")).toBe(2);

        tracker.deleteChildRequestToken("a");
        expect(tracker.getChildRequestToken("a")).toBeUndefined();

        tracker.clearChildRequestTokens();
        expect(tracker.getChildRequestToken("b")).toBeUndefined();
    });

    it("parent request token は key ごとに独立し、同じ key の再発行だけが前の token を無効にする", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();

        const firstToken = tracker.createParentRequestToken("a");
        const otherToken = tracker.createParentRequestToken("b");
        expect(tracker.getParentRequestToken("a")).toBe(firstToken);
        expect(tracker.getParentRequestToken("b")).toBe(otherToken);

        const secondToken = tracker.createParentRequestToken("a");
        expect(secondToken).not.toBe(firstToken);
        expect(tracker.getParentRequestToken("a")).toBe(secondToken);
        expect(tracker.getParentRequestToken("b")).toBe(otherToken);

        tracker.deleteParentRequestToken("a", firstToken);
        expect(tracker.getParentRequestToken("a")).toBe(secondToken);
        tracker.deleteParentRequestToken("a", secondToken);
        expect(tracker.getParentRequestToken("a")).toBeUndefined();

        tracker.clearParentRequestTokens();
        expect(tracker.getParentRequestToken("b")).toBeUndefined();
    });

    it("children/deletion task は key 単位で置換時に前回 task を cancel する", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();
        const firstChildrenCancel = { called: false };
        const secondChildrenCancel = { called: false };
        const firstDeletionCancel = { called: false };

        tracker.replaceChildrenFetchTask("children", {
            cancel: () => {
                firstChildrenCancel.called = true;
            },
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });
        tracker.replaceChildrenFetchTask("children", {
            cancel: () => {
                secondChildrenCancel.called = true;
            },
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });

        tracker.replaceDeletionFetchTask("deletions", {
            cancel: () => {
                firstDeletionCancel.called = true;
            },
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });
        tracker.replaceDeletionFetchTask("deletions", {
            cancel: () => undefined,
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });

        expect(firstChildrenCancel.called).toBe(true);
        expect(firstDeletionCancel.called).toBe(true);
        expect(secondChildrenCancel.called).toBe(false);
    });

    it("cancelAndClearFetchTasks は残っている task を cancel して全消去する", () => {
        const tracker = createPostHistoryThreadGraphTaskTracker();
        const childrenCancel = { called: false };
        const deletionCancel = { called: false };

        tracker.replaceChildrenFetchTask("children", {
            cancel: () => {
                childrenCancel.called = true;
            },
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });
        tracker.replaceDeletionFetchTask("deletions", {
            cancel: () => {
                deletionCancel.called = true;
            },
            promise: Promise.resolve({
                status: "success",
                events: [],
                relayUrls: [],
                fetchedAt: Date.now(),
            }),
        });

        tracker.cancelAndClearFetchTasks();

        expect(childrenCancel.called).toBe(true);
        expect(deletionCancel.called).toBe(true);

        tracker.cancelAndClearFetchTasks();
        expect(childrenCancel.called).toBe(true);
        expect(deletionCancel.called).toBe(true);
    });
});
