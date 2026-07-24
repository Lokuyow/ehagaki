import { describe, expect, it } from 'vitest';

import {
    createDialogVisibilityHandlers,
} from '../../lib/appDialogUtils';

function createBooleanStore(initialValue = false) {
    let value = initialValue;

    return {
        get value() {
            return value;
        },
        set: (nextValue: boolean) => {
            value = nextValue;
        },
    };
}

describe('createDialogVisibilityHandlers', () => {
    it('open と close で dialog state を切り替える', () => {
        const store = createBooleanStore();
        const handlers = createDialogVisibilityHandlers(store);

        handlers.open();
        expect(store.value).toBe(true);

        handlers.close();
        expect(store.value).toBe(false);
    });

    it('handleOpenChange(false) で閉じ、true では変更しない', () => {
        const store = createBooleanStore(true);
        const handlers = createDialogVisibilityHandlers(store);

        handlers.handleOpenChange(true);
        expect(store.value).toBe(true);

        handlers.handleOpenChange(false);
        expect(store.value).toBe(false);
    });
});
