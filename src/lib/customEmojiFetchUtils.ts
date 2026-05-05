export interface CustomEmojiFetchEventLike {
    kind: number;
    pubkey?: string;
    created_at?: number;
    tags: string[][];
}

export interface ParsedCustomEmojiSetAddress {
    pubkey: string;
    identifier: string;
    address: string;
}

export function buildCustomEmojiListFromFetchedEvents<TItem>({
    listEvent,
    setEvents,
    parseEmojiTags,
    getKind10030EmojiSetAddresses,
    parseEmojiSetAddress,
    mergeCustomEmojiItems,
}: {
    listEvent: CustomEmojiFetchEventLike;
    setEvents: CustomEmojiFetchEventLike[];
    parseEmojiTags: (tags: string[][], options: {
        setAddress?: string | null;
        sourceType?: 'kind10030' | 'kind30030';
        sourceAddress?: string | null;
        startSortIndex?: number;
    }) => TItem[];
    getKind10030EmojiSetAddresses: (event: CustomEmojiFetchEventLike | null) => string[];
    parseEmojiSetAddress: (value: unknown) => ParsedCustomEmojiSetAddress | null;
    mergeCustomEmojiItems: (groups: TItem[][]) => TItem[];
}): TItem[] {
    const directItems = parseEmojiTags(listEvent.tags, {
        sourceType: 'kind10030',
        sourceAddress: null,
        startSortIndex: 0,
    });
    const addresses = getKind10030EmojiSetAddresses(listEvent);
    if (addresses.length === 0) {
        return mergeCustomEmojiItems([directItems]);
    }

    const parsedAddresses = addresses
        .map((address) => parseEmojiSetAddress(address))
        .filter((address): address is ParsedCustomEmojiSetAddress => !!address);
    const validAddresses = new Set(parsedAddresses.map((address) => address.address));
    const eventsByAddress = new Map<string, CustomEmojiFetchEventLike>();

    for (const event of setEvents) {
        const identifier = event.tags.find((tag) => tag[0] === 'd')?.[1];
        if (!event.pubkey || !identifier) continue;
        const address = `30030:${event.pubkey}:${identifier}`;
        if (!validAddresses.has(address)) continue;

        const existing = eventsByAddress.get(address);
        if (!existing || (event.created_at ?? 0) > (existing.created_at ?? 0)) {
            eventsByAddress.set(address, event);
        }
    }

    let nextSortIndex = directItems.length;
    const groups = [directItems];
    for (const address of addresses) {
        const group = parseEmojiTags(eventsByAddress.get(address)?.tags ?? [], {
            setAddress: address,
            sourceType: 'kind30030',
            sourceAddress: address,
            startSortIndex: nextSortIndex,
        });
        nextSortIndex += group.length;
        groups.push(group);
    }

    return mergeCustomEmojiItems(groups);
}