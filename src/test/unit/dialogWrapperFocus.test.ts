import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DialogFocusHarness from './fixtures/DialogFocusHarness.svelte';

async function openFrom(opener: HTMLElement): Promise<void> {
    opener.focus();
    await fireEvent.keyDown(opener, { key: 'Enter' });
    await fireEvent.click(opener);
    await screen.findByRole('button', { name: 'close-dialog' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    await tick();
}

describe('DialogWrapper close focus', () => {
    afterEach(() => {
        cleanup();
        document.body.replaceChildren();
    });

    it('キーボードで開いて閉じると、開いたボタンへ一度だけ戻る', async () => {
        let opens = 0;
        render(DialogFocusHarness, { props: { onOpen: () => { opens += 1; } } });
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        const focus = vi.spyOn(opener, 'focus');

        await fireEvent.keyDown(document, { key: 'Escape' });
        await tick();

        expect(opens).toBe(1);
        expect(focus).toHaveBeenCalledTimes(1);
        expect(focus).toHaveBeenCalledWith({ preventScroll: true });
        expect(document.activeElement).toBe(opener);
    });

    it('閉じるボタンの Enter では開いたボタンを再度押さない', async () => {
        let opens = 0;
        render(DialogFocusHarness, { props: { onOpen: () => { opens += 1; } } });
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        const closeButton = screen.getByRole('button', { name: 'close-dialog' });
        closeButton.focus();

        await fireEvent.keyDown(closeButton, { key: 'Enter' });
        await fireEvent.click(closeButton);
        await tick();

        expect(opens).toBe(1);
        expect(document.activeElement).toBe(opener);
    });

    it('戻り先が DOM から消えていても要素を起こし直さない', async () => {
        render(DialogFocusHarness);
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        const focus = vi.spyOn(opener, 'focus');
        opener.remove();

        await fireEvent.keyDown(document, { key: 'Escape' });
        await tick();

        expect(opener.isConnected).toBe(false);
        expect(document.body.contains(opener)).toBe(false);
        expect(focus).not.toHaveBeenCalled();
    });

    it('明示したダイアログ内の戻り先には戻さない', async () => {
        const { rerender } = render(DialogFocusHarness);
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        const inside = screen.getByTestId('inside');
        const focus = vi.spyOn(inside, 'focus');
        focus.mockClear();
        await rerender({ returnFocus: inside });

        await fireEvent.keyDown(document, { key: 'Escape' });
        await tick();

        expect(focus).not.toHaveBeenCalled();
        expect(document.activeElement).not.toBe(inside);
    });

    it('明示したダイアログ外の returnFocus へ一度だけ戻る', async () => {
        const alternate = document.createElement('button');
        alternate.type = 'button';
        alternate.textContent = 'alternate';
        document.body.appendChild(alternate);
        const { rerender } = render(DialogFocusHarness);
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        const openerFocus = vi.spyOn(opener, 'focus');
        const alternateFocus = vi.spyOn(alternate, 'focus');
        await rerender({ returnFocus: alternate });

        await fireEvent.keyDown(document, { key: 'Escape' });
        await tick();

        expect(alternateFocus).toHaveBeenCalledTimes(1);
        expect(alternateFocus).toHaveBeenCalledWith({ preventScroll: true });
        expect(openerFocus).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(alternate);
    });

    it('restoreFocusOnClose を閉じる直前に false にすると戻さない', async () => {
        const view = render(DialogFocusHarness);
        const opener = screen.getByRole('button', { name: 'open-dialog' });
        await openFrom(opener);
        expect(document.activeElement).not.toBe(opener);
        const focus = vi.spyOn(opener, 'focus');

        view.component.closeWithoutRestore();
        await tick();

        expect(focus).not.toHaveBeenCalled();
        expect(document.activeElement).not.toBe(opener);
    });
});
