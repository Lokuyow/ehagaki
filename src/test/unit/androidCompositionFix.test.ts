import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it('keeps a pending Android composition alive until natural end and cleans up on destroy', async () => {
    vi.resetModules();
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Android Chrome');
    const { AndroidCompositionFix } = await import('../../lib/editor/androidCompositionFix');
    vi.useFakeTimers();
    const editor = new Editor({ extensions: [StarterKit, AndroidCompositionFix], content: '<p>text</p>' });
    await vi.advanceTimersByTimeAsync(0);
    const updates = vi.fn();
    editor.view.dom.addEventListener('compositionupdate', updates);
    try {
        editor.view.dom.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        await vi.advanceTimersByTimeAsync(12000);
        expect(editor.view.composing).toBe(true);
        expect(updates).toHaveBeenCalledTimes(3);
        editor.view.dom.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
        expect((editor.storage as unknown as { androidCompositionFix: { keepAliveInterval: unknown } }).androidCompositionFix.keepAliveInterval).toBeNull();
        await vi.advanceTimersByTimeAsync(8000);
        expect(updates).toHaveBeenCalledTimes(3);
        editor.view.dom.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    } finally {
        editor.destroy();
    }
    await vi.advanceTimersByTimeAsync(8000);
    expect(updates).toHaveBeenCalledTimes(3);
});
