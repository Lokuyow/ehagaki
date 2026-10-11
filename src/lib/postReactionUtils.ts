import { verifyRelatedEvent } from './relatedEventVerification';
import { matchesReactionReferenceTarget, parseReactionReference } from './reactionReference';
import { RelayConfigUtils } from './relayConfigUtils';
import { normalizeReactionValue, type ReactionValue } from './reactionValue';
import type { NostrEvent } from './types';

export const REACTION_TARGET_KINDS = [1, 6, 7, 16, 42, 1111] as const;
export function isReactionTargetKind(kind: number): boolean { return (REACTION_TARGET_KINDS as readonly number[]).includes(kind); }

export function buildReactionEvent(target: NostrEvent, pubkey: string, value: ReactionValue,
    relayHints: readonly string[], createdAt: number, clientTag?: string[] | null) {
    const verified = verifyRelatedEvent(target);
    if (!verified || !isReactionTargetKind(verified.event.kind)) throw new Error('invalid_reaction_target');
    const event = verified.event;
    const hint = RelayConfigUtils.sanitizeExternalRelayUrls([...relayHints])[0];
    const content = normalizeReactionValue(value);
    const tags = [['e', event.id, hint ?? '', event.pubkey],
        hint ? ['p', event.pubkey, hint] : ['p', event.pubkey], ['k', String(event.kind)]];
    if (content.emojiTag) tags.push(content.emojiTag);
    if (clientTag) tags.push([...clientTag]);
    const template = { kind: 7, pubkey, content: content.content, tags, created_at: createdAt };
    const reference = parseReactionReference(template).reference;
    if (!reference || !matchesReactionReferenceTarget(reference,
        { eventId: event.id, targetAuthorPubkey: event.pubkey, targetKind: event.kind })) throw new Error('invalid_reaction_target');
    return template;
}
