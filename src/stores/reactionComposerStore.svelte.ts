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
}
let target = $state.raw<ReactionComposerState | null>(null);
export const reactionComposerState = { get value() { return target; } };
export function setReactionTarget(event: NostrEvent, relayHints: string[]): void {
    target = { event: createPlainNostrEventSnapshot(event), eventId: event.id, authorPubkey: event.pubkey,
        kind: event.kind, relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(relayHints), ownerToken: Symbol('reaction') };
}
export function clearReactionTarget(): void { target = null; }
