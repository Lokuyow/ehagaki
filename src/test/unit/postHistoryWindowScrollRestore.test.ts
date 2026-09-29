import { describe, expect, it } from 'vitest';
import { canRestoreAutoLoadWindowScroll } from '../../lib/hooks/usePostHistoryDialogViewport.svelte';

describe('post history bounded-window scroll restoration', () => {
    it('keeps an older-page commit only when scrollTop can absorb the removed top extent', () => {
        expect(canRestoreAutoLoadWindowScroll('older', 420, 0, 418)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('older', 420, 0, 422)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('older', 420, 0, 423)).toBe(false);
    });

    it('keeps a newer-page commit only when remaining scroll range can absorb the removed tail', () => {
        expect(canRestoreAutoLoadWindowScroll('newer', 0, 360, 358)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('newer', 0, 360, 362)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('newer', 0, 360, 363)).toBe(false);
    });

    it('does not defer a commit when the removed extent is within measurement tolerance', () => {
        expect(canRestoreAutoLoadWindowScroll('older', 0, 0, 2)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('newer', 0, 0, 2)).toBe(true);
        expect(canRestoreAutoLoadWindowScroll('older', 0, 0, 2.01)).toBe(false);
    });
});
