import { onDestroy, untrack } from 'svelte';
import { notificationGroupSourceIds, type NotificationGroup } from '../notificationGrouping';

export { notificationGroupSourceIds };
type Card = { group: NotificationGroup; key: string };

/** Retain mounted cards when arrivals move them beyond the current page. */
export function useNotificationRendering(getGroups: () => NotificationGroup[], isActive: () => boolean) {
    let count = $state(10);
    let mountedSources = new Map<string, string>();
    let nextKey = 0;
    let previousCards: Card[] = [];
    const cards = $derived.by(() => {
        const groups = getGroups();
        let end = count;
        groups.forEach((group, index) => { if (notificationGroupSourceIds(group).some(id => mountedSources.has(id))) end = Math.max(end, index + 1); });
        const used = new Set<string>();
        const previousByKey = new Map(previousCards.map(card => [card.key, card]));
        let changed = previousCards.length !== Math.min(end, groups.length);
        const next = groups.slice(0, end).map((group, index) => {
            let key: string | undefined;
            for (const id of notificationGroupSourceIds(group)) {
                const candidate = mountedSources.get(id);
                if (candidate && !used.has(candidate)) { key = candidate; break; }
            }
            key ??= `notification-card-${++nextKey}`;
            used.add(key);
            // An unchanged card keeps its object so its block is left alone.
            const old = previousByKey.get(key);
            const card = old && old.group === group ? old : { group, key };
            changed ||= card !== previousCards[index];
            return card;
        });
        if (changed) previousCards = next;
        return previousCards;
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
    function reset() { disconnect(); count = 10; mountedSources.clear(); previousCards = []; }
    onDestroy(disconnect);
    return { get cards() { return cards; }, get hasMore() { return hasMore; }, sentinel, reset };
}
