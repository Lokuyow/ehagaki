import { untrack } from "svelte";

import type { RelayProfileService } from "../relayProfileService";
import type { ProfileData } from "../types";

export interface ProfileProjectionSyncDependencies {
    getRelayProfileService: () => RelayProfileService | undefined;
    getCurrentPubkey: () => string | null | undefined;
    getAccountPubkeys: () => string[];
    applyCurrentProfile: (profile: ProfileData) => void;
    applyAccountProfile: (pubkeyHex: string, profile: ProfileData) => void;
}

function uniqueNonEmptyPubkeys(pubkeys: string[]): string[] {
    return Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
}

/**
 * Keeps the current-account and account-list projections connected to the
 * shared profile metadata cache subscription. Fetching and persistence remain
 * owned by RelayProfileService/profileMetadataCache.
 */
export function useProfileProjectionSync(
    deps: ProfileProjectionSyncDependencies,
): void {
    $effect(() => {
        const service = deps.getRelayProfileService();
        const currentPubkey = deps.getCurrentPubkey() || null;
        const accountPubkeys = uniqueNonEmptyPubkeys(deps.getAccountPubkeys());
        const subscribedPubkeys = uniqueNonEmptyPubkeys([
            ...(currentPubkey ? [currentPubkey] : []),
            ...accountPubkeys,
        ]);

        if (
            !service
            || typeof service.subscribeProfiles !== "function"
            || subscribedPubkeys.length === 0
        ) {
            return;
        }

        let active = true;
        const subscriptionService = service;
        const subscriptionPubkeys = new Set(subscribedPubkeys);
        const unsubscribe = untrack(() => service.subscribeProfiles(
            subscribedPubkeys,
            (pubkeyHex, profile) => {
                if (
                    !active
                    || subscriptionService !== deps.getRelayProfileService()
                    || !subscriptionPubkeys.has(pubkeyHex)
                    || !profile
                ) {
                    return;
                }

                const currentPubkeyNow = deps.getCurrentPubkey() || null;
                const currentAccountPubkeys = new Set(
                    uniqueNonEmptyPubkeys(deps.getAccountPubkeys()),
                );
                const isCurrentProfile = currentPubkeyNow === pubkeyHex;

                if (!isCurrentProfile && !currentAccountPubkeys.has(pubkeyHex)) {
                    return;
                }

                deps.applyAccountProfile(pubkeyHex, profile);
                if (isCurrentProfile) {
                    deps.applyCurrentProfile(profile);
                }
            },
        ));

        return () => {
            active = false;
            unsubscribe();
        };
    });
}
