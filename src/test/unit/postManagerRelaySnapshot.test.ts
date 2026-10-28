import { describe, expect, it, vi } from "vitest";
import { Observable } from "rxjs";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";
import type { OkPacketAgainstEvent, RxNostr } from "rx-nostr";
import { PostManager } from "../../lib/postManager";
import type { AuthState } from "../../lib/types";
import { createDeferred } from "../deferredTestUtils";

const defaultA = "wss://default-a.example/";
const storeA = "wss://store-a.example/";
const additionalA = "wss://additional-a.example/";
const defaultB = "wss://default-b.example/";
const storeB = "wss://store-b.example/";
const additionalB = "wss://additional-b.example/";
const recipient = "wss://recipient.example/";
const recipientPubkey = "a".repeat(64);

async function startDeferredPost(sensitive: boolean, empty: boolean) {
    const secret = generateSecretKey();
    let defaults = empty ? [] : [defaultA];
    const writeRelaysStore = { value: empty ? [] : [storeA.replace(/\/$/, ""), storeA] };
    const channelRelays = empty ? [] : [additionalA.replace(/\/$/, ""), defaultA, additionalA];
    const signing = createDeferred<void>();
    const signingStarted = createDeferred<void>();
    const discovery = createDeferred<{ readRelays: string[] }>();
    const published: { relay: string; kind: number; eventId: string }[] = [];
    const rx = {
        getDefaultRelays: () => Object.fromEntries([
            ...defaults.map(url => [url, { url, read: true, write: true }]),
            ["wss://read-only.example/", { url: "wss://read-only.example/", read: true, write: false }],
        ]),
        send: (event: Parameters<RxNostr["send"]>[0], options: Parameters<RxNostr["send"]>[1]) => {
            const on = options?.on as { relays?: string[]; defaultWriteRelays?: boolean } | undefined;
            const targets = [...new Set([...(on?.defaultWriteRelays ? defaults : []), ...(on?.relays ?? [])])];
            return new Observable<OkPacketAgainstEvent>(subscriber => {
                queueMicrotask(() => {
                    for (const relay of targets) {
                        published.push({ relay, kind: event.kind!, eventId: event.id! });
                        subscriber.next({
                            type: "OK", from: relay, eventId: event.id!, ok: true, done: true,
                            notice: "", message: ["OK", event.id!, true, ""],
                        });
                    }
                    subscriber.complete();
                });
            });
        },
    } as unknown as RxNostr;
    let firstSignature = true;
    const lookup = vi.fn(() => discovery.promise);
    const manager = new PostManager(rx, {
        authStateStore: { value: {
            type: "parentClient", isAuthenticated: true, pubkey: getPublicKey(secret),
            npub: "", nprofile: "", isValid: true, isInitialized: true,
        } as AuthState },
        getParentClientSignerFn: () => ({
            signEvent: async (template: EventTemplate) => {
                if (firstSignature) {
                    firstSignature = false;
                    signingStarted.resolve();
                    await signing.promise;
                }
                return finalizeEvent(template, secret);
            },
        }),
        console: { log() {}, warn() {}, error() {} } as Console,
        hashtagStore: { hashtags: [], tags: empty ? [] : [["p", recipientPubkey]] },
        contentWarningStore: { value: sensitive, reset() {} },
        contentWarningReasonStore: { value: "fixture", reset() {} },
        settingsStore: { failClosedContentWarning: sensitive, clientTagEnabled: false, quoteNotificationEnabled: false },
        replyQuoteState: { value: { reply: null, quotes: [] } },
        writeRelaysStore,
        channelContextState: { value: {
            eventId: "c".repeat(64), channelRelays, relayHints: [],
            name: null, about: null, picture: null,
        } },
        getClientTagFn: () => null,
        nip65ReadRelayLookupFn: lookup,
        saveSensitivePayloadFn: async () => {},
        saveHashtagsToHistoryFn() {},
        clearReplyQuoteFn() {},
        notificationPort: { notifyPostSuccess: () => true, notifyPostError: () => true },
    });
    const pending = manager.submitPost("snapshot fixture");
    await signingStarted.promise;
    expect(published).toEqual([]);
    // Keep the same RxNostr and auth session; mutate both source arrays in place.
    defaults = [defaultB];
    writeRelaysStore.value.splice(0, writeRelaysStore.value.length, storeB);
    channelRelays.splice(0, channelRelays.length, additionalB);
    signing.resolve();
    if (!empty) await vi.waitFor(() => expect(lookup).toHaveBeenCalledOnce());
    discovery.resolve({ readRelays: empty ? [] : [recipient] });
    const first = await pending;
    return { result: first.deliverySettled ? await first.deliverySettled : first, published };
}

describe("post-start immutable relay target snapshots", () => {
    it.each([false, true])("uses captured author/store and separate additional roles after deferred signing (Sensitive=%s)", async sensitive => {
        const { result, published } = await startDeferredPost(sensitive, false);
        expect(result).toMatchObject({
            success: true, fullyDelivered: true,
            delivery: {
                authorWrite: { requestedRelays: [defaultA, storeA], acceptedRelays: [defaultA, storeA] },
                additional: [{ requestedRelays: [additionalA, defaultA], acceptedRelays: [additionalA, defaultA] }],
                taggedUserRead: { [recipientPubkey]: { acceptedRelays: [recipient] } },
            },
        });
        expect(new Set(published.map(item => item.relay))).toEqual(new Set([defaultA, storeA, additionalA, recipient]));
        for (const relay of [defaultA, storeA, additionalA, recipient]) {
            expect(published.filter(item => item.relay === relay && item.kind === 42)).toHaveLength(1);
            if (sensitive) expect(published.filter(item => item.relay === relay && item.kind === 36)).toHaveLength(1);
        }
        expect(published.some(item => [defaultB, storeB, additionalB].includes(item.relay))).toBe(false);
    });

    it.each([false, true])("keeps an empty captured target set empty when live relays appear during signing (Sensitive=%s)", async sensitive => {
        const { result, published } = await startDeferredPost(sensitive, true);
        expect(result).toMatchObject({
            success: false, error: "no_write_relays",
            delivery: { authorWrite: { requestedRelays: [], status: "unavailable" } },
        });
        expect(published).toEqual([]);
    });
});
