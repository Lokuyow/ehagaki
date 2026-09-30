import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent } from "nostr-tools";
import { createRxNostr } from "rx-nostr";
import { Nip65RelayDirectory, getNip65RelayDirectory } from "../../lib/nip65RelayDirectory";
import { parseComposerTargetInput } from "../../lib/composerTargetUtils";
import { createComposerTargetResolver } from "../../lib/composerTargetResolver";
import { applyReplyQuoteQuery } from "../../lib/bootstrap/externalInputBootstrap";
import { PostManager } from "../../lib/postManager";
import { ReplyQuoteService } from "../../lib/replyQuoteService";
import {
    clearReplyQuote, replyQuoteState, setReplyQuote, setReplyQuoteError, updateReferencedEvent,
} from "../../stores/replyQuoteStore.svelte";
import type { AuthState } from "../../lib/types";

const quietConsole = { log() {}, warn() {}, error() {} } as unknown as Console;

async function reply(input: string, authorRelay: string, mode: "cold" | "warm" | "prefetch") {
    const rxNostr = createRxNostr({ verifier: async (event) => verifyEvent(event) });
    const relayConfig = { [authorRelay]: { read: true, write: true } };
    rxNostr.setDefaultRelays(relayConfig);
    clearReplyQuote();
    try {
        const parsed = parseComposerTargetInput(input);
        if (parsed.status !== "supported") throw new Error("fixture pointer invalid");
        if (mode === "warm") await getNip65RelayDirectory(rxNostr).lookup(parsed.pointer.authorHint!);
        const resolver = createComposerTargetResolver({
            replyQuoteService: new ReplyQuoteService({ console: quietConsole }),
            // The cold case starts recipient discovery at submission. Prefetch
            // separately covers the real Composer's already-running lookup.
            ...(mode !== "prefetch" ? { lookupAuthorWriteRelaysFn: async () => [] } : {}),
        });
        const resolved = await resolver.resolve({ pointer: parsed.pointer, rxNostr, relayConfig }).promise;
        if (resolved.status !== "resolved") throw new Error("fixture target unresolved");
        await applyReplyQuoteQuery({
            replyQuoteQuery: {
                reply: { eventId: resolved.target.event.id, authorPubkey: resolved.target.event.pubkey, relayHints: resolved.target.relayHints },
                quotes: [],
            },
            preloadedEvents: { [resolved.target.event.id]: resolved.target.event },
            rxNostr, relayConfig, setReplyQuote, updateReferencedEvent, setReplyQuoteError,
        });
        const reference = replyQuoteState.value.reply!;
        const state = {
            authorPubkey: reference.authorPubkey,
            referencedAuthor: reference.referencedEvent?.pubkey,
            relayHints: [...reference.relayHints],
            unsignedHasRecipient: new ReplyQuoteService().buildReplyTags(reference)
                .some((tag) => tag[0] === "p" && tag[1] === reference.authorPubkey),
        };
        // Ephemeral signing material stays in this closure, never in harness output.
        const secret = generateSecretKey();
        const pubkey = getPublicKey(secret);
        const authStateStore = { value: {
            type: "parentClient", isAuthenticated: true, pubkey,
            npub: "", nprofile: "", isValid: true, isInitialized: true,
        } as AuthState };
        const history: Array<{ eventId: string; verified: boolean; acceptedRelays?: string[] }> = [];
        const manager = new PostManager(rxNostr, {
            authStateStore, replyQuoteState, console: quietConsole,
            getParentClientSignerFn: () => ({ signEvent: async (event: Parameters<typeof finalizeEvent>[0]) => finalizeEvent(event, secret) }),
            getClientTagFn: () => null,
            saveHashtagsToHistoryFn: () => {},
            notificationPort: { notifyPostSuccess: () => true, notifyPostError: () => true },
            savePostHistoryFn: ({ event, acceptedRelays }) => {
                history.push({ eventId: event.id, verified: verifyEvent(event), acceptedRelays });
            },
        });
        const result = await manager.submitPost("Local routing fixture");
        return { state, result, history };
    } finally {
        rxNostr.dispose();
        clearReplyQuote();
    }
}

async function directory(pubkey: string, discoveryRelays: string[]) {
    const rxNostr = createRxNostr({ verifier: async (event) => verifyEvent(event) });
    try {
        return await new Nip65RelayDirectory(rxNostr).lookup(pubkey, { discoveryRelays });
    } finally {
        rxNostr.dispose();
    }
}

declare global {
    interface Window {
        __NIP65_ROUTING_HARNESS__: { reply: typeof reply; directory: typeof directory };
    }
}
window.__NIP65_ROUTING_HARNESS__ = { reply, directory };
