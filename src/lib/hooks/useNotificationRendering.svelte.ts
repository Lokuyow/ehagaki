import { onDestroy, untrack } from 'svelte';
import type { NotificationGroup } from '../notificationGrouping';

export function notificationGroupSourceIds(group: NotificationGroup): string[] {
    return [...group.reactions, ...group.reposts].length
        ? [...group.reactions, ...group.reposts].map(item => item.eventId) : [group.record.eventId];
}

/** Retain mounted cards when arrivals move them beyond the current page. */
export function useNotificationRendering(getGroups: () => NotificationGroup[], isActive: () => boolean) {
    let count = $state(10);
    let mountedSources = new Map<string, string>();
    let nextKey = 0;
    const cards = $derived.by(() => {
        const groups = getGroups();
        let end = count;
        groups.forEach((group, index) => { if (notificationGroupSourceIds(group).some(id => mountedSources.has(id))) end = Math.max(end, index + 1); });
        const used = new Set<string>();
        return groups.slice(0, end).map(group => {
            const previous = notificationGroupSourceIds(group).map(id => mountedSources.get(id)).find(key => key && !used.has(key));
            const key = previous ?? `notification-card-${++nextKey}`;
            used.add(key);
            return { group, key };
        });
    });
    $effect.pre(() => {
        const current = cards;
        untrack(() => {
            mountedSources = new Map(current.flatMap(({ group, key }) => notificationGroupSourceIds(group).map(id => [id, key] as const)));
        });
    });
    const hasMore = $derived(cards.length < getGroups().length);
    let observer: IntersectionObserver | null = null;
    function disconnect() { observer?.disconnect(); observer = null; }
    let sentinelNode = $state<HTMLElement | null>(null);
    $effect(() => {
        const node = sentinelNode;
        const enabled = isActive();
        disconnect();
        if (!node || !enabled) return;
        const current = new IntersectionObserver(entries => {
            if (observer !== current || sentinelNode !== node || !isActive() || !entries.some(entry => entry.isIntersecting)) return;
            count = Math.max(count, cards.length) + 10;
        }, { root: node.closest('.dialog-content'), rootMargin: '0px 0px 600px 0px' });
        observer = current;
        current.observe(node);
        return disconnect;
    });
    function sentinel(node: HTMLElement) {
        sentinelNode = node;
        return { destroy() { if (sentinelNode === node) sentinelNode = null; } };
    }
    function reset() { disconnect(); count = 10; mountedSources.clear(); }
    onDestroy(disconnect);
    return { get cards() { return cards; }, get hasMore() { return hasMore; }, sentinel, reset };
}
