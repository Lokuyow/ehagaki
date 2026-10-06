<script lang="ts">
    import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
    import type { RxNostr } from "rx-nostr";
    import { onMount } from "svelte";
    import { PostManager } from "../../lib/postManager";
    import type { NostrEvent } from "../../lib/types";

    const secretKey = generateSecretKey();
    const pubkey = getPublicKey(secretKey);
    const relayUrl = "wss://sensitive-harness.example.com/";
    const sentEvents: Array<{ event: NostrEvent; targetRelays: string[] }> = [];
    const historyEvents: NostrEvent[] = [];
    const payloadCandidates: NostrEvent[] = [];
    const notifications: string[] = [];
    let resultText = $state("idle");
    let canonicalStructure = $state<NostrEvent | null>(null);

    const replyQuoteState = $state<any>({ reply: null, quotes: [] });
    const contentWarningStore = { value: true, reset() { this.value = false; } };
    const contentWarningReasonStore = { value: "Sensitive preview", reset() { this.value = ""; } };

    const rxNostr = {
        getDefaultRelays: () => ({ [relayUrl]: { url: relayUrl, read: true, write: true } }),
        send(event: NostrEvent, options: { on?: { relays?: string[] } }) {
            const targetRelays = options.on?.relays ?? [];
            sentEvents.push({ event, targetRelays: [...targetRelays] });
            return {
                subscribe(observer: { next: (packet: unknown) => void }) {
                    queueMicrotask(() => observer.next({
                        from: relayUrl,
                        ok: true,
                        done: true,
                        event,
                        eventId: event.id,
                        type: "ok",
                        message: "",
                    }));
                    return { unsubscribe() {} };
                },
            };
        },
    } as unknown as RxNostr;

    const postManager = new PostManager(rxNostr, {
        authStateStore: {
            value: {
                type: "nsec",
                isAuthenticated: true,
                pubkey,
                npub: "",
                nprofile: "",
                isValid: true,
                isInitialized: true,
            },
        },
        hashtagStore: { hashtags: [], tags: [] },
        mediaFreePlacementStore: { value: true },
        mediaGalleryStore: {
            getContentUrls: () => [],
            getImageBlurhashMap: () => ({}),
            clearAll() {},
        },
        contentWarningStore,
        contentWarningReasonStore,
        keyManager: {
            getFromStore: () => "playwright-test-key",
            loadFromStorage: () => "playwright-test-key",
            isWindowNostrAvailable: () => false,
        },
        seckeySignerFn: () => ({ signEvent: (template: any) => finalizeEvent(template, secretKey) }),
        savePostHistoryFn: async ({ event }: { event: NostrEvent }) => { historyEvents.push(event); },
        saveSensitivePayloadFn: async ({ event }: { event: NostrEvent }) => { payloadCandidates.push(event); },
        writeRelaysStore: { value: [relayUrl] },
        getClientTagFn: () => null,
        createImetaTagFn: async () => [],
        resetEditorStateFn() {},
        resetPostStatusFn() {},
        saveHashtagsToHistoryFn: async () => {},
        settingsStore: {
            clientTagEnabled: false,
            failClosedContentWarning: true,
            quoteNotificationEnabled: false,
            replyNotificationEnabled: false,
        },
        replyQuoteState: { value: replyQuoteState },
        channelContextState: { value: null },
        clearReplyQuoteFn: () => { replyQuoteState.reply = null; replyQuoteState.quotes = []; },
        notificationPort: {
            notifyPostSuccess: () => { notifications.push("success"); return true; },
            notifyPostError: () => { notifications.push("error"); return true; },
        },
    } as any);

    async function submitSensitivePost(): Promise<void> {
        resultText = "pending";
        const result = await postManager.submitPost("Sensitive browser body");
        resultText = result.success ? "success" : `error:${result.error ?? "unknown"}`;
        canonicalStructure = historyEvents.at(-1) ?? null;
    }

    async function replyToCanonical(): Promise<void> {
        if (!canonicalStructure) return;
        contentWarningStore.value = false;
        contentWarningReasonStore.value = "";
        replyQuoteState.reply = {
            mode: "reply",
            eventId: canonicalStructure.id,
            relayHints: [relayUrl],
            authorPubkey: pubkey,
            quoteNotificationEnabled: false,
            authorDisplayName: null,
            authorPicture: null,
            referencedEvent: canonicalStructure,
            rootEventId: null,
            rootRelayHint: null,
            rootPubkey: null,
            loading: false,
            error: null,
        };
        const result = await postManager.submitPost("Reply to canonical Structure");
        resultText = result.success ? "reply-success" : `reply-error:${result.error ?? "unknown"}`;
    }

    onMount(() => {
        (window as any).__SENSITIVE_PAYLOAD_HARNESS__ = {
            pubkey,
            relayUrl,
            sentEvents,
            historyEvents,
            payloadCandidates,
            notifications,
            get canonicalStructure() { return canonicalStructure; },
        };
    });
</script>

<main>
    <button type="button" data-testid="submit-sensitive" onclick={() => void submitSensitivePost()}>
        Submit Sensitive post
    </button>
    <button type="button" data-testid="reply-canonical" disabled={!canonicalStructure} onclick={() => void replyToCanonical()}>
        Reply to canonical Structure
    </button>
    <output data-testid="submit-result">{resultText}</output>
</main>
