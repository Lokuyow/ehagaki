import { untrack } from "svelte";

import type { RelayProfileService } from "../relayProfileService";
import type { ReplyQuoteProfileSyncController } from "../replyQuoteProfileSync";
import type { ReplyQuoteComposerState } from "../types";

export interface ReplyQuoteProfileSyncLifecycleDependencies {
    getRelayProfileService: () => RelayProfileService | undefined;
    getReplyQuoteState: () => ReplyQuoteComposerState;
    onReplyQuoteChanged: (listener: () => void) => () => void;
    createController: (service: RelayProfileService) => ReplyQuoteProfileSyncController;
}

export function useReplyQuoteProfileSync(
    deps: ReplyQuoteProfileSyncLifecycleDependencies,
): void {
    $effect(() => {
        const service = deps.getRelayProfileService();
        if (!service) {
            return;
        }

        const controller = deps.createController(service);
        const sync = () => controller.sync(deps.getReplyQuoteState());
        const unsubscribeReplyQuoteChanges = deps.onReplyQuoteChanged(sync);

        untrack(sync);

        return () => {
            unsubscribeReplyQuoteChanges();
            controller.dispose();
        };
    });
}
