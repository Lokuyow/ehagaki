import { describe, expect, it, vi } from 'vitest';
import {
    applyDialogCloseAutoFocus,
    readDialogOpener,
    rememberDialogOpener,
    resolveDialogCloseFocusTarget,
} from '../../lib/dialogCloseFocus';

function appendButton(label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    document.body.appendChild(button);
    return button;
}

describe('dialogCloseFocus', () => {
    it('開いていた要素をダイアログ外の戻り先として覚える', () => {
        const opener = appendButton('opener');
        const container = document.createElement('div');
        const inside = document.createElement('button');
        container.appendChild(inside);
        document.body.appendChild(container);
        opener.focus();

        expect(readDialogOpener(document)).toBe(opener);
        expect(rememberDialogOpener(null, opener, container)).toBe(opener);
        expect(rememberDialogOpener(opener, inside, container)).toBe(opener);

        opener.remove();
        container.remove();
    });

    it('shadow root 内のボタンも戻り先として読める', () => {
        const host = document.createElement('div');
        const shadow = host.attachShadow({ mode: 'open' });
        const button = document.createElement('button');
        shadow.appendChild(button);
        document.body.appendChild(host);
        button.focus();

        expect(readDialogOpener(document)).toBe(button);

        host.remove();
    });

    it('接続中のダイアログ外要素へ preventScroll で一度戻し、クリックは発火しない', () => {
        const opener = appendButton('opener');
        const alternate = appendButton('alternate');
        let clicks = 0;
        alternate.addEventListener('click', () => {
            clicks += 1;
        });
        const focus = vi.spyOn(alternate, 'focus');
        const event = new Event('focusScope.onCloseAutoFocus', { cancelable: true });

        applyDialogCloseAutoFocus(event, {
            restore: true,
            explicit: alternate,
            opener,
            container: document.createElement('div'),
        });

        expect(event.defaultPrevented).toBe(true);
        expect(focus).toHaveBeenCalledTimes(1);
        expect(focus).toHaveBeenCalledWith({ preventScroll: true });
        expect(document.activeElement).toBe(alternate);
        expect(clicks).toBe(0);

        opener.remove();
        alternate.remove();
    });

    it('復元を止めたときはフォーカスを動かさない', () => {
        const opener = appendButton('opener');
        const other = appendButton('other');
        other.focus();
        const focus = vi.spyOn(opener, 'focus');
        const event = new Event('focusScope.onCloseAutoFocus', { cancelable: true });

        applyDialogCloseAutoFocus(event, {
            restore: false,
            opener,
            container: null,
        });

        expect(event.defaultPrevented).toBe(true);
        expect(focus).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(other);

        opener.remove();
        other.remove();
    });

    it('DOM から外れた戻り先は起こし直さない', () => {
        const detached = document.createElement('button');
        const container = document.createElement('div');
        document.body.appendChild(container);
        const event = new Event('focusScope.onCloseAutoFocus', { cancelable: true });

        expect(resolveDialogCloseFocusTarget(detached, null, container)).toBeNull();
        applyDialogCloseAutoFocus(event, {
            restore: true,
            explicit: detached,
            opener: null,
            container,
        });

        expect(detached.isConnected).toBe(false);
        expect(document.body.contains(detached)).toBe(false);
        container.remove();
    });

    it('切れた明示戻り先は起こさず、ダイアログ外の開いた要素へ戻す', () => {
        const detached = document.createElement('button');
        const opener = appendButton('opener');
        const event = new Event('focusScope.onCloseAutoFocus', { cancelable: true });

        applyDialogCloseAutoFocus(event, {
            restore: true,
            explicit: detached,
            opener,
            container: null,
        });

        expect(detached.isConnected).toBe(false);
        expect(document.body.contains(detached)).toBe(false);
        expect(document.activeElement).toBe(opener);
        opener.remove();
    });

    it('ダイアログ内の要素には戻さない', () => {
        const container = document.createElement('div');
        const inside = document.createElement('button');
        container.appendChild(inside);
        document.body.appendChild(container);
        const outside = appendButton('outside');
        outside.focus();
        const focus = vi.spyOn(inside, 'focus');
        const event = new Event('focusScope.onCloseAutoFocus', { cancelable: true });

        expect(resolveDialogCloseFocusTarget(inside, outside, container)).toBe(outside);
        applyDialogCloseAutoFocus(event, {
            restore: true,
            explicit: inside,
            opener: outside,
            container,
        });

        expect(focus).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(outside);

        container.remove();
        outside.remove();
    });
});
