type BooleanDialogStore = {
    set: (value: boolean) => void;
};

export function createDialogVisibilityHandlers(store: BooleanDialogStore) {
    return {
        open: () => store.set(true),
        close: () => store.set(false),
        handleOpenChange: (open: boolean) => {
            if (!open) {
                store.set(false);
            }
        },
    };
}
