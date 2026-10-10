import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent } from "nostr-tools";
import type { RxNostr, OkPacketAgainstEvent } from "rx-nostr";
import type { Observer } from "rxjs";
import { PostManager } from "../../lib/postManager";
import type { AuthState, NostrEvent } from "../../lib/types";
import type { SaveSensitivePayloadInput } from "../../lib/storage/sensitivePayloadRepository";

const author = "wss://author.example/", recipient = "wss://recipient.example/", extra = "wss://extra.example/";
const recipientPubkey = "a".repeat(64);
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }

function harness(options: { extra?: string[]; authorRelays?: string[]; save?: (input: SaveSensitivePayloadInput) => Promise<void>; signStructure?: () => Promise<void> } = {}) {
    const secret = generateSecretKey(), pubkey = getPublicKey(secret);
    const auth = { value: { type: "parentClient", isAuthenticated: true, pubkey, npub: "", nprofile: "",
        isValid: true, isInitialized: true } as AuthState };
    const routes = deferred<{ readRelays: string[] }>();
    const sends: { relay: string; event: NostrEvent; observer: Observer<OkPacketAgainstEvent>; unsubscribe: ReturnType<typeof vi.fn> }[] = [];
    const rx = {
        getDefaultRelays: () => Object.fromEntries([author, ...(options.authorRelays ?? [])].map(url => [url, { url, read: true, write: true }])),
        send: vi.fn((event, options) => ({ subscribe: (observer: Observer<OkPacketAgainstEvent>) => {
            const unsubscribe = vi.fn();
            sends.push({ event, relay: options.on.relays[0], observer, unsubscribe });
            return { unsubscribe };
        } })),
    } as unknown as RxNostr;
    const cached: SaveSensitivePayloadInput[] = [];
    const history: NostrEvent[] = [];
    const sign = vi.fn(async template => {
        if (template.kind !== 36) await options.signStructure?.();
        return finalizeEvent(template, secret);
    });
    const notifyPostError = vi.fn(), clearReplyQuoteFn = vi.fn();
    const manager = new PostManager(rx, {
        authStateStore: auth, console: { log() {}, warn() {}, error() {} } as Console,
        replyQuoteState: { value: { reply: null, quotes: [] } },
        hashtagStore: { hashtags: [], tags: [["p", recipientPubkey]] },
        contentWarningStore: { value: true, reset() {} }, contentWarningReasonStore: { value: "fixture", reset() {} },
        settingsStore: { failClosedContentWarning: true, clientTagEnabled: false } as never,
        channelContextState: options.extra ? { value: { eventId: "b".repeat(64), channelRelays: options.extra, relayHints: [] } } as never : undefined,
        writeRelaysStore: { value: [author] },
        getParentClientSignerFn: () => ({ signEvent: sign }), getClientTagFn: () => null,
        nip65ReadRelayLookupFn: () => routes.promise, saveHashtagsToHistoryFn() {}, clearReplyQuoteFn,
        notificationPort: { notifyPostSuccess: vi.fn(), notifyPostError },
        saveSensitivePayloadFn: async input => { cached.push(input); await options.save?.(input); },
        savePostHistoryFn: async input => { history.push(input.event); },
    });
    const pending = manager.submitPost("sensitive fixture");
    const send = (relay: string, kind: number) => sends.find(item => item.relay === relay && item.event.kind === kind)!;
    const ack = (relay: string, kind: number, ok = true, done = true) => {
        const item = send(relay, kind);
        item.observer.next({ from: relay.replace(/\/$/, ""), eventId: item.event.id, ok, done,
            type: "OK", notice: ok ? "" : done ? "restricted: fixture" : "auth-required: fixture",
            message: ["OK", item.event.id, ok, ""] });
    };
    return { manager, rx, auth, routes, sends, send, ack, cached, history, sign, pending, notifyPostError, clearReplyQuoteFn };
}
const flush = () => vi.advanceTimersByTimeAsync(0);
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Sensitive NIP-65 per-relay Payload -> ACK -> Structure", () => {
    it.each(["author-first", "recipient-first"])("gates each relay and signs one immutable Structure (%s)", async order => {
        const h = harness(); await flush();
        expect(h.sends.map(item => [item.relay, item.event.kind])).toEqual([[author, 36]]);
        h.routes.resolve({ readRelays: [recipient] }); await flush();
        expect(h.sends.map(item => item.event.kind)).toEqual([36, 36]);
        const first = order === "author-first" ? author : recipient, second = first === author ? recipient : author;
        h.ack(first, 36); await flush();
        expect(h.send(first, 1)).toBeDefined(); expect(h.send(second, 1)).toBeUndefined();
        const structure = h.send(first, 1).event;
        expect(structure.content).toBe(""); expect(structure.tags).toContainEqual(["c", h.send(first, 36).event.id, first]);
        expect(h.cached[0].acceptedRelays).toEqual([first]);
        h.ack(second, 36); await flush();
        expect(h.send(second, 1).event).toEqual(structure);
        expect(h.sign).toHaveBeenCalledTimes(2); expect(verifyEvent(structure)).toBe(true);
        h.ack(recipient, 1); await flush();
        let settled = false; void h.pending.then(() => { settled = true; }); await flush(); expect(settled).toBe(false);
        h.ack(author, 1); await flush();
        const result = await h.pending;
        expect(result).toMatchObject({ success: true, fullyDelivered: true, eventId: structure.id,
            delivery: { authorWrite: { acceptedRelays: [author] }, taggedUserRead: { [recipientPubkey]: { acceptedRelays: [recipient] } } } });
        expect(new Set(result.acceptedRelays)).toEqual(new Set([author, recipient]));
        expect(new Set(h.cached.at(-1)!.acceptedRelays)).toEqual(new Set([author, recipient]));
        expect(h.history).toEqual([structure]);
    });

    it.each(["reject", "timeout", "auth-timeout"])("never sends Structure to a Payload %s relay", async failure => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [recipient] }); await flush();
        h.ack(author, 36); await flush(); h.ack(author, 1);
        if (failure !== "timeout") h.ack(recipient, 36, false, failure === "reject");
        await vi.advanceTimersByTimeAsync(failure === "auth-timeout" ? 30_000 : 12_000);
        const result = await h.pending;
        expect(h.send(recipient, 1)).toBeUndefined();
        expect(result).toMatchObject({ success: true, fullyDelivered: false, acceptedRelays: [author] });
        const delivery = result.delivery!.taggedUserRead[recipientPubkey]!;
        expect(delivery.acceptedRelays).toEqual([]);
        if (failure === "reject") expect(delivery.rejectedRelays).toEqual([{ relay: recipient, category: "restricted", reason: "restricted: fixture" }]);
        else expect(delivery.timedOutRelays).toEqual([recipient]);
        if (failure === "auth-timeout") expect(delivery.authRequiredRelays).toEqual([recipient]);
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author]);
    });

    it("reuses ACKs when the same URL gains recipient/additional roles later", async () => {
        const h = harness({ extra: [author] }); await flush(); h.ack(author, 36); await flush(); h.ack(author, 42); await flush();
        h.routes.resolve({ readRelays: [author, author.replace(/\/$/, "")] }); await flush();
        const result = await h.pending;
        expect(h.sends.map(item => item.event.kind)).toEqual([36, 42]);
        expect(result).toMatchObject({ success: true, fullyDelivered: true,
            delivery: { authorWrite: { acceptedRelays: [author] }, taggedUserRead: { [recipientPubkey]: { acceptedRelays: [author] } }, additional: [{ acceptedRelays: [author] }] } });
    });

    it.each(["structure-reject", "signature-failure"])("Payload alone is sensitive_partial_publish (%s)", async failure => {
        const h = harness({ signStructure: failure === "signature-failure" ? async () => { throw Error("fixture"); } : undefined });
        await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36); await flush();
        if (failure === "structure-reject") h.ack(author, 1, false);
        await flush();
        expect(await h.pending).toMatchObject({ success: false, error: "postComponent.error.sensitive_partial_publish", acceptedRelays: [] });
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author]); expect(h.history).toEqual([]);
        expect(h.notifyPostError).toHaveBeenCalledExactlyOnceWith({ code: "sensitive_partial_publish" });
        expect(h.clearReplyQuoteFn).not.toHaveBeenCalled();
    });

    it("no accepted Payload retains ordinary failure semantics", async () => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36, false); await flush();
        expect(await h.pending).toMatchObject({ success: false, error: "post_rejected", acceptedRelays: [] });
        expect(h.sign).toHaveBeenCalledOnce(); expect(h.cached).toEqual([]);
    });

    it.each(["cancel", "logout", "session", "runtime", "same-runtime"])("preserves Payload ACKs but blocks Structure during cache wait (%s)", async change => {
        const save = deferred<void>(); const h = harness({ save: () => save.promise });
        await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36); await flush();
        if (change === "cancel") h.manager.cancelActiveNip65Operations();
        if (change === "logout") h.auth.value.isAuthenticated = false;
        if (change === "session") h.auth.value = { ...h.auth.value, pubkey: "f".repeat(64) };
        if (change === "runtime") h.manager.setRxNostr({ ...h.rx } as RxNostr);
        if (change === "same-runtime") h.manager.setRxNostr(h.rx);
        save.resolve(); await flush();
        expect(await h.pending).toMatchObject({ success: false, error: "postComponent.error.sensitive_partial_publish" });
        expect(h.sends.map(item => item.event.kind)).toEqual([36]);
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author]);
    });

    it.each(["logout", "runtime", "deadline"])("blocks a late Structure signature (%s)", async change => {
        const signing = deferred<void>(); const h = harness({ signStructure: () => signing.promise });
        await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36); await flush();
        if (change === "logout") h.auth.value.isAuthenticated = false;
        if (change === "runtime") h.manager.setRxNostr({ ...h.rx } as RxNostr);
        if (change === "deadline") await vi.advanceTimersByTimeAsync(30_000);
        signing.resolve(); await flush();
        expect(await h.pending).toMatchObject({ success: false, error: "postComponent.error.sensitive_partial_publish" });
        expect(h.sends).toHaveLength(1);
    });

    it("late AUTH Payload ACK gives Structure its own 12s, capped at the shared 30s", async () => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36, false, false);
        await vi.advanceTimersByTimeAsync(25_000); h.ack(author, 36); await flush();
        expect(h.send(author, 1)).toBeDefined();
        let settled = false; void h.pending.then(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(4_999); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        expect(await h.pending).toMatchObject({ success: false, error: "postComponent.error.sensitive_partial_publish", timedOutRelays: [author] });
        const frozen = JSON.stringify(await h.pending); h.ack(author, 1); await flush();
        expect(JSON.stringify(await h.pending)).toBe(frozen);
    });

    it("a late Payload ACK starts a fresh 12s Structure budget", async () => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [] });
        await vi.advanceTimersByTimeAsync(11_000); h.ack(author, 36); await flush();
        await vi.advanceTimersByTimeAsync(11_999); h.ack(author, 1); await flush();
        expect(await h.pending).toMatchObject({ success: true, fullyDelivered: false });
    });

    it("fulfilled classes settle at 1500ms with a silent extra relay and retain confirmed ACKs", async () => {
        const silent = "wss://silent.example/";
        const h = harness({ extra: [extra], authorRelays: [silent] }); await flush(); h.routes.resolve({ readRelays: [author] });
        h.ack(author, 36); h.ack(extra, 36); await flush(); h.ack(author, 42); await flush();
        // The silent redundant author is still pending after all required classes have ACKs.
        h.ack(extra, 42); await flush();
        let settled = false; void h.pending.then(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(1499); expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        expect((await h.pending).timedOutRelays).toEqual([silent]);
        expect(await h.pending).toMatchObject({ success: true, fullyDelivered: true });
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author, extra]);
    });

    it("network cutoff freezes ACKs while queued cache persistence is still awaited", async () => {
        const save = deferred<void>(); const h = harness({ save: () => save.promise });
        await flush(); h.routes.resolve({ readRelays: [] }); h.ack(author, 36); await flush();
        let settled = false; void h.pending.then(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(30_000); expect(settled).toBe(false);
        expect(h.sends).toHaveLength(1); save.resolve(); await flush();
        expect(await h.pending).toMatchObject({ success: false, error: "postComponent.error.sensitive_partial_publish" });
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author]);
    });

    it("retains ACKs from already started sends after session change and preserves the new composer", async () => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [recipient] }); await flush();
        h.ack(author, 36); await flush(); h.ack(author, 1); await flush();
        h.auth.value = { ...h.auth.value, pubkey: "f".repeat(64) };
        h.ack(recipient, 36); await flush();
        const result = await h.pending;
        expect(result).toMatchObject({ success: true, fullyDelivered: false, preserveComposerContent: true,
            acceptedRelays: [author], delivery: { taggedUserRead: { [recipientPubkey]: { status: "cancelled", acceptedRelays: [], unconfirmedRelays: [recipient] } } } });
        expect(h.send(recipient, 1)).toBeUndefined();
        expect(h.cached.at(-1)!.acceptedRelays).toEqual([author, recipient]);
        expect(h.history).toEqual([h.send(author, 1).event]);
        expect(h.clearReplyQuoteFn).not.toHaveBeenCalled();
    });

    it("Structure AUTH can complete after its normal timeout without resetting the 30s cap", async () => {
        const h = harness(); await flush(); h.routes.resolve({ readRelays: [author] });
        await vi.advanceTimersByTimeAsync(10_000); h.ack(author, 36); await flush();
        h.ack(author, 1, false, false); await vi.advanceTimersByTimeAsync(15_000);
        h.ack(author, 1); await flush();
        expect(await h.pending).toMatchObject({ success: true, fullyDelivered: true, acceptedRelays: [author] });
    });

    it("a cache save failure preserves main's publish behavior", async () => {
        const h = harness({ save: async () => { throw Error("storage fixture"); } });
        await flush(); h.routes.resolve({ readRelays: [author] }); h.ack(author, 36); await flush(); h.ack(author, 1); await flush();
        expect(await h.pending).toMatchObject({ success: true, fullyDelivered: true, acceptedRelays: [author] });
    });
});
