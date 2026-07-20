import type { ChannelContextState, DraftChannelData } from '../lib/types';
import {
    cloneChannelContextProvenance,
    type ChannelContextProvenance,
} from '../lib/channelContextRuntime';

let channelContext = $state<ChannelContextState | null>(null);
let channelContextProvenance = $state<ChannelContextProvenance | null>(null);

const channelContextChangeListeners = new Set<
    (state: ChannelContextState | null) => void
>();

function cloneChannelContext(
    value: ChannelContextState | DraftChannelData,
): ChannelContextState {
    return {
        ...value,
        relayHints: [...value.relayHints],
        ...(value.channelRelays
            ? { channelRelays: [...value.channelRelays] }
            : {}),
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

export const channelContextProvenanceState = {
    get value() { return channelContextProvenance; },
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
    channelContextProvenance = null;
    notifyChannelContextChanged();
}

export function setChannelContextWithProvenance(
    value: ChannelContextState,
    provenance: ChannelContextProvenance,
): void {
    channelContext = cloneChannelContext(value);
    channelContextProvenance = cloneChannelContextProvenance(provenance);
    notifyChannelContextChanged();
}

export function restoreChannelContext(value: DraftChannelData): void {
    channelContext = cloneChannelContext(value);
    channelContextProvenance = null;
    notifyChannelContextChanged();
}

export function clearChannelContext(): void {
    channelContext = null;
    channelContextProvenance = null;
    notifyChannelContextChanged();
}
