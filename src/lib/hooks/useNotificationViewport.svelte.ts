import { onDestroy, tick } from 'svelte';

type Anchor = { ids: string[]; top: number };
type Snapshot = { atTop: boolean; anchors: Anchor[]; revision: number };

/** Keep the visible notification content, independently of a group's newest ID. */
export function useNotificationViewport(getList: () => HTMLElement | null, isActive: () => boolean) {
    let revision = 0, token = 0;
    let pending: Snapshot | null = null, sticky: Snapshot | null = null;
    let lastAdjustedTop: number | null = null;
    let cleanup = () => {};
    const container = () => getList()?.closest<HTMLElement>('.dialog-content') ?? null;
    const ids = (node: HTMLElement): string[] => JSON.parse(node.dataset.notificationEvents ?? '[]');
    function capture(): Snapshot | null {
        const root = container(), list = getList();
        if (!isActive() || !root || !list) return null;
        if (root.scrollTop <= 1) return { atTop: true, revision, anchors: [] };
        const bounds = root.getBoundingClientRect();
        return { atTop: root.scrollTop <= 1, revision, anchors: Array.from(list.querySelectorAll<HTMLElement>('.notification-entry'))
            .filter(node => { const box = node.getBoundingClientRect(); return box.bottom > bounds.top + 1 && box.top < bounds.bottom - 1; })
            .map(node => ({ ids: ids(node), top: node.getBoundingClientRect().top - bounds.top })) };
    }
    function restore(snapshot: Snapshot) {
        const root = container(), list = getList();
        if (!isActive() || snapshot.revision !== revision || !root || !list) return;
        let next = snapshot.atTop ? 0 : root.scrollTop;
        if (!snapshot.atTop) {
            const nodes = Array.from(list.querySelectorAll<HTMLElement>('.notification-entry'));
            for (const anchor of snapshot.anchors) {
                const node = nodes.find(node => ids(node).some(id => anchor.ids.includes(id)));
                if (!node) continue;
                next += node.getBoundingClientRect().top - root.getBoundingClientRect().top - anchor.top;
                break;
            }
        }
        if (Math.abs(root.scrollTop - next) > .5) root.scrollTop = next;
        lastAdjustedTop = root.scrollTop;
    }
    function reset() { revision++; token++; pending = null; sticky = null; lastAdjustedTop = null; }
    function observe(list: HTMLElement) {
        cleanup();
        const root = container();
        if (!root) return;
        const intent = () => reset();
        const scroll = () => {
            if (lastAdjustedTop != null && Math.abs(root.scrollTop - lastAdjustedTop) <= 1) return;
            reset();
        };
        for (const name of ['wheel', 'touchstart', 'pointerdown', 'keydown']) root.addEventListener(name, intent, { passive: true });
        root.addEventListener('scroll', scroll, { passive: true });
        const resize = new ResizeObserver(() => { if (sticky && !pending) restore(sticky); });
        resize.observe(list);
        cleanup = () => {
            for (const name of ['wheel', 'touchstart', 'pointerdown', 'keydown']) root.removeEventListener(name, intent);
            root.removeEventListener('scroll', scroll); resize.disconnect(); reset();
        };
    }
    onDestroy(() => cleanup());
    return { reset, observe,
        visibleSourceIds: () => { const snapshot = pending ?? capture(); return snapshot && !snapshot.atTop ? snapshot.anchors.flatMap(anchor => anchor.ids) : []; },
        preserve() {
            const snapshot = pending ?? capture();
            if (!snapshot) return;
            pending = snapshot;
            const epoch = ++token;
            void tick().then(() => {
                if (epoch !== token) return;
                pending = null; sticky = snapshot; restore(snapshot);
            });
        }
    };
}
