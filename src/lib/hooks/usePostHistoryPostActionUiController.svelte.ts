type PostHistoryPostActionTarget = {
    eventId: string;
};

export function usePostHistoryPostActionUiController<
    TPost extends PostHistoryPostActionTarget,
>() {
    let postMenuOpenState = $state<Record<string, boolean>>({});
    let deleteConfirmOpen = $state(false);
    let deleteTargetPost = $state<TPost | null>(null);

    function isPostMenuOpen(postEventId: string): boolean {
        return postMenuOpenState[postEventId] ?? false;
    }

    function setPostMenuOpen(postEventId: string, open: boolean): void {
        postMenuOpenState = {
            ...postMenuOpenState,
            [postEventId]: open,
        };
    }

    function closeAllPostItemMenus(): void {
        if (Object.keys(postMenuOpenState).length > 0) {
            postMenuOpenState = {};
        }
    }

    function setDeleteConfirmOpen(open: boolean): void {
        deleteConfirmOpen = open;
        if (!open) {
            deleteTargetPost = null;
        }
    }

    function openDeleteConfirm(post: TPost): void {
        closeAllPostItemMenus();
        deleteTargetPost = post;
        deleteConfirmOpen = true;
    }

    function cancelDeleteConfirm(): void {
        setDeleteConfirmOpen(false);
    }

    function clearDeleteTarget(): void {
        deleteTargetPost = null;
    }

    function resetDeleteConfirmation(): void {
        deleteConfirmOpen = false;
        deleteTargetPost = null;
    }

    function reset(): void {
        postMenuOpenState = {};
        resetDeleteConfirmation();
    }

    return {
        get deleteConfirmOpen() {
            return deleteConfirmOpen;
        },
        get deleteTargetPost() {
            return deleteTargetPost;
        },
        isPostMenuOpen,
        setPostMenuOpen,
        closeAllPostItemMenus,
        setDeleteConfirmOpen,
        openDeleteConfirm,
        cancelDeleteConfirm,
        clearDeleteTarget,
        resetDeleteConfirmation,
        reset,
    };
}
