import type { NostrEvent } from '../lib/types';
import { createPlainNostrEventSnapshot } from '../lib/postHistoryEventUtils';
import { RelayConfigUtils } from '../lib/relayConfigUtils';

export interface ReactionComposerState {
    event: NostrEvent;
    eventId: string;
    authorPubkey: string;
    kind: number;
    relayHints: string[];
    ownerToken: symbol;
    sessionToken: symbol;
}
export type ReactionSessionEndReason = 'cancel' | 'success' | 'reset' | 'ownership';
const listeners = new Set<(state: ReactionComposerState | null, reason?: ReactionSessionEndReason) => void>();
let target = $state.raw<ReactionComposerState | null>(null);
export const reactionComposerState = { get value() { return target; } };
export function onReactionComposerChanged(listener: (state: ReactionComposerState | null, reason?: ReactionSessionEndReason) => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
export function setReactionTarget(event: NostrEvent, relayHints: string[]): void {
    target = { event: createPlainNostrEventSnapshot(event), eventId: event.id, authorPubkey: event.pubkey,
        kind: event.kind, relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(relayHints), ownerToken: Symbol('reaction'),
        sessionToken: target?.sessionToken ?? Symbol('reaction-session') };
    listeners.forEach(listener => listener(target));
}
export function clearReactionTarget(reason: ReactionSessionEndReason = 'cancel'): void {
    if (!target) return;
    target = null;
    listeners.forEach(listener => listener(null, reason));
}
