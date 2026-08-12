import type { RelayProfileService } from "../../lib/relayProfileService";
import {
    useProfileProjectionSync,
    type ProfileProjectionSyncDependencies,
} from "../../lib/hooks/useProfileProjectionSync.svelte";

export function createProfileProjectionSyncHookHarness(
    deps: Omit<ProfileProjectionSyncDependencies, "getRelayProfileService" | "getCurrentPubkey" | "getAccountPubkeys">,
) {
    let service = $state<RelayProfileService | undefined>();
    let currentPubkey = $state<string | null>(null);
    let accountPubkeys = $state<string[]>([]);
    const dispose = $effect.root(() => {
        useProfileProjectionSync({
            ...deps,
            getRelayProfileService: () => service,
            getCurrentPubkey: () => currentPubkey,
            getAccountPubkeys: () => accountPubkeys,
        });
    });

    return {
        setService(nextService: RelayProfileService | undefined) {
            service = nextService;
        },
        setCurrentPubkey(nextPubkey: string | null) {
            currentPubkey = nextPubkey;
        },
        setAccountPubkeys(nextPubkeys: string[]) {
            accountPubkeys = nextPubkeys;
        },
        dispose,
    };
}
