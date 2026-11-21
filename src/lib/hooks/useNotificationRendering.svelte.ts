import { untrack } from 'svelte';
import { notificationGroupSourceIds, type NotificationGroup } from '../notificationGrouping';

export { notificationGroupSourceIds };
type Card = { group: NotificationGroup; key: string };

/** Retain mounted cards when arrivals move them beyond the current page. */
export function useNotificationRendering(getGroups: () => NotificationGroup[]) {
    const staged = typeof IntersectionObserver !== 'undefined';
    let count = $state(10);
    let mountedSources = new Map<string, string>();
    let nextKey = 0;
    let previousCards: Card[] = [];
    const cards = $derived.by(() => {
        const groups = getGroups();
        let end = staged ? count : groups.length;
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
    function renderMore() {
        if (!hasMore) return false;
        count = Math.max(count, cards.length) + 10;
        return true;
    }
    function reset() { count = 10; mountedSources.clear(); previousCards = []; }
    return { get cards() { return cards; }, get hasMore() { return hasMore; }, renderMore, reset };
}
