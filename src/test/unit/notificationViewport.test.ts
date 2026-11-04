import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Harness from './fixtures/NotificationViewportHarness.svelte';
import type { useNotificationViewport } from '../../lib/hooks/useNotificationViewport.svelte';
let resize: () => void;
beforeEach(() => vi.stubGlobal('ResizeObserver', class { constructor(callback: () => void) { resize = callback; } observe() {} disconnect() {} }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function fixture(active = () => true) {
    let api!: ReturnType<typeof useNotificationViewport>, root!: HTMLElement, list!: HTMLElement;
    render(Harness, { active, ready: (value, container, element) => { api = value; root = container; list = element; } });
    root.scrollTop = 100;
    root.getBoundingClientRect = () => ({ top: 0, bottom: 300 } as DOMRect);
    const positions = { a: 150, b: 250 };
    const nodes = Object.entries(positions).map(([id]) => {
        const node = document.createElement('article'); node.className = 'notification-entry'; node.dataset.notificationEvents = JSON.stringify([id]);
        node.getBoundingClientRect = () => ({ top: positions[id as 'a' | 'b'] - root.scrollTop, bottom: positions[id as 'a' | 'b'] - root.scrollTop + 60 } as DOMRect);
        list.append(node); return node;
    });
    return { api, root, positions, nodes };
}
it('holds the source identity through grouped-card replacement and delayed layout growth', async () => {
    const { api, root, positions, nodes } = fixture();
    expect(api.visibleSourceIds()).toEqual(['a', 'b']);
    api.preserve(); positions.a += 80; positions.b += 80; nodes[0].dataset.notificationEvents = '["newest", "a"]';
    await tick(); expect(root.scrollTop).toBe(180);
    positions.a += 20; positions.b += 20; resize(); expect(root.scrollTop).toBe(200);
});
it('uses the next visible source if the first anchor disappears', async () => {
    const { api, root, positions, nodes } = fixture();
    api.preserve(); nodes[0].remove(); positions.b += 90;
    await tick(); expect(root.scrollTop).toBe(190);
});
it('keeps the head at zero and abandons compensation after a real user gesture', async () => {
    const { api, root, positions } = fixture();
    root.scrollTop = 0; api.preserve(); root.scrollTop = 50;
    await tick(); expect(root.scrollTop).toBe(0);
    root.scrollTop = 100; api.preserve(); root.dispatchEvent(new Event('wheel')); root.scrollTop = 170; positions.a += 100;
    await tick(); resize(); expect(root.scrollTop).toBe(170);
});
it('does not apply a queued restore after closing or changing session', async () => {
    let active = true;
    const { api, root, positions } = fixture(() => active);
    api.preserve(); active = false; api.reset(); positions.a += 100;
    await tick(); resize(); expect(root.scrollTop).toBe(100);
});
it('abandons a pending restore when scrolling continues without a new pointer gesture', async () => {
    const { api, root, positions } = fixture();
    api.preserve(); root.scrollTop = 170; root.dispatchEvent(new Event('scroll')); positions.a += 100;
    await tick(); resize(); expect(root.scrollTop).toBe(170);
});
