import { describe, expect, it } from "vitest";
import { usePostHistoryPostActionUiController } from "../../lib/hooks/usePostHistoryPostActionUiController.svelte";

type TestPost = {
    eventId: string;
    content: string;
};

function createPost(eventId: string): TestPost {
    return {
        eventId,
        content: `content:${eventId}`,
    };
}

describe("usePostHistoryPostActionUiController", () => {
    it("tracks and switches the open post item menu", () => {
        const controller = usePostHistoryPostActionUiController<TestPost>();

        controller.setPostMenuOpen("post-a", true);
        expect(controller.isPostMenuOpen("post-a")).toBe(true);
        expect(controller.isPostMenuOpen("post-b")).toBe(false);

        controller.setPostMenuOpen("post-b", true);
        expect(controller.isPostMenuOpen("post-a")).toBe(true);
        expect(controller.isPostMenuOpen("post-b")).toBe(true);

        controller.setPostMenuOpen("post-a", false);
        expect(controller.isPostMenuOpen("post-a")).toBe(false);
        expect(controller.isPostMenuOpen("post-b")).toBe(true);
    });

    it("opens delete confirmation with the selected post and closes menus", () => {
        const controller = usePostHistoryPostActionUiController<TestPost>();
        const post = createPost("delete-target");

        controller.setPostMenuOpen("delete-target", true);
        controller.setPostMenuOpen("other-post", true);

        controller.openDeleteConfirm(post);

        expect(controller.deleteConfirmOpen).toBe(true);
        expect(controller.deleteTargetPost).toStrictEqual(post);
        expect(controller.isPostMenuOpen("delete-target")).toBe(false);
        expect(controller.isPostMenuOpen("other-post")).toBe(false);
    });

    it("resets delete confirmation state on cancel, close, and reset", () => {
        const controller = usePostHistoryPostActionUiController<TestPost>();
        const post = createPost("delete-target");

        controller.openDeleteConfirm(post);
        controller.cancelDeleteConfirm();
        expect(controller.deleteConfirmOpen).toBe(false);
        expect(controller.deleteTargetPost).toBeNull();

        controller.openDeleteConfirm(post);
        controller.setDeleteConfirmOpen(false);
        expect(controller.deleteConfirmOpen).toBe(false);
        expect(controller.deleteTargetPost).toBeNull();

        controller.openDeleteConfirm(post);
        controller.setPostMenuOpen("post-a", true);
        controller.reset();
        expect(controller.deleteConfirmOpen).toBe(false);
        expect(controller.deleteTargetPost).toBeNull();
        expect(controller.isPostMenuOpen("post-a")).toBe(false);
    });

    it("can reset only delete confirmation without touching menu state", () => {
        const controller = usePostHistoryPostActionUiController<TestPost>();

        controller.setPostMenuOpen("post-a", true);
        controller.openDeleteConfirm(createPost("delete-target"));
        controller.setPostMenuOpen("post-a", true);

        controller.resetDeleteConfirmation();

        expect(controller.deleteConfirmOpen).toBe(false);
        expect(controller.deleteTargetPost).toBeNull();
        expect(controller.isPostMenuOpen("post-a")).toBe(true);
    });

    it("only clears the selected target when confirm handling is delegated", () => {
        const controller = usePostHistoryPostActionUiController<TestPost>();
        const post = createPost("delete-target");

        controller.openDeleteConfirm(post);
        controller.clearDeleteTarget();

        expect(controller.deleteConfirmOpen).toBe(true);
        expect(controller.deleteTargetPost).toBeNull();
    });
});
