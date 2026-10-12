import { untrack } from 'svelte';
import type { RelayProfileService } from '../relayProfileService';
import type { ProfileData } from '../types';
import type { ReactionComposerState } from '../../stores/reactionComposerStore.svelte';

export type ReactionTargetProfileService = Pick<RelayProfileService, 'fetchProfileRealtime' | 'subscribeProfile'>;

export function useReactionTargetProfile(params: {
    getTarget: () => ReactionComposerState;
    getProfileService: () => ReactionTargetProfileService | undefined;
}) {
    let profile = $state.raw<ProfileData | null>(null);
    let owner = $state<symbol | null>(null);
    $effect(() => {
        const target = params.getTarget();
        const service = params.getProfileService();
        owner = target.ownerToken;
        profile = null;
        if (!service) return;
        let active = true;
        const apply = (next: ProfileData | null) => {
            if (active && next && params.getTarget().ownerToken === target.ownerToken
                && params.getProfileService() === service) profile = next;
        };
        const unsubscribe = untrack(() => service.subscribeProfile(target.authorPubkey, apply));
        untrack(() => { void service.fetchProfileRealtime(target.authorPubkey, {
            additionalRelays: target.relayHints,
        }).then(apply).catch(() => undefined); });
        return () => { active = false; unsubscribe(); };
    });
    return { get profile() { return params.getTarget().ownerToken === owner ? profile : null; } };
}
