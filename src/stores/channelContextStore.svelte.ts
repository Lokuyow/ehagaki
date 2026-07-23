import type { ChannelContextState, DraftChannelData } from '../lib/types';
import {
    buildEffectiveChannelContext,
    cloneChannelContextProvenance,
    type ChannelContextProvenance,
    type ChannelContextRuntimeState,
} from '../lib/channelContextRuntime';
import { decodeDraftChannelContext } from '../lib/draftChannelContext';

let channelContext = $state<ChannelContextState | null>(null);
let channelContextProvenance = $state<ChannelContextProvenance | null>(null);
let channelContextRuntime = $state<ChannelContextRuntimeState>({
    phase: 'idle',
    quality: null,
    source: null,
});
let channelContextOwnerToken: symbol | null = null;

const channelContextChangeListeners = new Set<
    (state: ChannelContextState | null) => void
>();

function cloneChannelContext(
    value: ChannelContextState,
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

export const channelContextRuntimeState = {
    get value() { return channelContextRuntime; },
};

export const effectiveChannelContextState = {
    get value() {
        return channelContext
            ? buildEffectiveChannelContext(channelContext, channelContextProvenance)
            : null;
    },
};

export function getChannelContextOwnerToken(): symbol | null {
    return channelContextOwnerToken;
}

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
    channelContextRuntime = {
        phase: 'ready',
        quality: null,
        source: 'seed',
    };
    channelContextOwnerToken = null;
    notifyChannelContextChanged();
}

export function setChannelContextWithProvenance(
    value: ChannelContextState,
    provenance: ChannelContextProvenance | null,
    ownerToken: symbol,
): void {
    channelContext = cloneChannelContext(value);
    channelContextProvenance = cloneChannelContextProvenance(provenance);
    channelContextOwnerToken = ownerToken;
    notifyChannelContextChanged();
}

export function restoreChannelContext(value: DraftChannelData): void {
    const { query, provenance } = decodeDraftChannelContext(value);
    channelContext = cloneChannelContext({
        eventId: query.eventId,
        relayHints: query.relayHints,
        ...(query.channelRelays ? { channelRelays: query.channelRelays } : {}),
        name: query.name ?? null,
        about: query.about ?? null,
        picture: query.picture ?? null,
    });
    channelContextProvenance = cloneChannelContextProvenance(provenance);
    channelContextRuntime = {
        phase: 'ready',
        quality: null,
        source: 'seed',
    };
    channelContextOwnerToken = null;
    notifyChannelContextChanged();
}

export function setChannelContextRuntimeState(
    value: ChannelContextRuntimeState,
): void {
    channelContextRuntime = { ...value };
}

export function clearChannelContext(): void {
    channelContext = null;
    channelContextProvenance = null;
    channelContextRuntime = {
        phase: 'idle',
        quality: null,
        source: null,
    };
    channelContextOwnerToken = null;
    notifyChannelContextChanged();
}
