import type { RelayProfileService } from "../../lib/relayProfileService";
import {
    useReplyQuoteProfileSync,
    type ReplyQuoteProfileSyncLifecycleDependencies,
} from "../../lib/hooks/useReplyQuoteProfileSync.svelte";

export function createReplyQuoteProfileSyncHookHarness(
    deps: Omit<ReplyQuoteProfileSyncLifecycleDependencies, "getRelayProfileService">,
) {
    let service = $state<RelayProfileService | undefined>();
    const dispose = $effect.root(() => {
        useReplyQuoteProfileSync({
            ...deps,
            getRelayProfileService: () => service,
        });
    });

    return {
        setService(nextService: RelayProfileService | undefined) {
            service = nextService;
        },
        dispose,
    };
}
