import type { ChannelContextState, DraftChannelData } from '../lib/types';

let channelContext = $state<ChannelContextState | null>(null);

const channelContextChangeListeners = new Set<
    (state: ChannelContextState | null) => void
>();

function cloneChannelContext(
    value: ChannelContextState | DraftChannelData,
): ChannelContextState {
    return {
        ...value,
        relayHints: [...value.relayHints],
    };
}

function notifyChannelContextChanged(): void {
    channelContextChangeListeners.forEach((listener) => {
        listener(channelContext);
    });
}

export const channelContextState = {
    get value() { return channelContext; },
};

export function onChannelContextChanged(
    listener: (state: ChannelContextState | null) => void,
): () => void {
    channelContextChangeListeners.add(listener);
    return () => {
        channelContextChangeListeners.delete(listener);
    };
}

export function setChannelContext(value: ChannelContextState): void {
    channelContext = cloneChannelContext(value);
    notifyChannelContextChanged();
}

export function restoreChannelContext(value: DraftChannelData): void {
    channelContext = cloneChannelContext(value);
    notifyChannelContextChanged();
}

export function clearChannelContext(): void {
    channelContext = null;
    notifyChannelContextChanged();
}