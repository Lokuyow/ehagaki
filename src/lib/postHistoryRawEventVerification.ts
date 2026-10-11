import { getEventHash as getRxNostrEventHash } from "@rx-nostr/crypto";
import type {
    EventPacket,
    RxNostr,
    RxNostrUseOptions,
    RxReq,
} from "rx-nostr";
import { filter, map, type Observable } from "rxjs";
import { validateEvent, verifyEvent } from "nostr-tools";
import {
    createPlainNostrEventSnapshot,
    isSignedNostrEvent,
} from "./postHistoryEventUtils";
import type { NostrEvent } from "./types";

/**
 * Kept independently from record schema versions. A stored result produced by
 * a different rule must be migrated before it is used by JSONL export.
 */
export const RAW_EVENT_VERIFICATION_RULE_VERSION = 1;

export type RawEventVerificationState = {
    status: "valid" | "invalid";
    ruleVersion: number;
};

/**
 * This is intentionally opaque. The runtime registry, rather than its
 * TypeScript shape, decides whether a repository can trust it.
 */
export interface PostHistoryRawEventAttestation {
    readonly __postHistoryRawEventAttestation?: never;
}

export interface AttestedPostHistoryRawEvent {
    event: NostrEvent;
    attestation: PostHistoryRawEventAttestation;
}

export interface PostHistoryRelayEventPacket extends EventPacket {
    event: NostrEvent;
    attestation: PostHistoryRawEventAttestation;
}

export interface PostHistoryRelayEventSource {
    use(
        rxReq: RxReq,
        options?: Partial<RxNostrUseOptions>,
    ): Observable<PostHistoryRelayEventPacket>;
}

type AttestationEvidence = "full" | "rx-nostr-signature";

type AttestationEntry = {
    fingerprint: string;
    ruleVersion: number;
    evidence: AttestationEvidence;
};

const attestations = new WeakMap<object, AttestationEntry>();
const eventAttestations = new WeakMap<object, PostHistoryRawEventAttestation>();
const relaySources = new WeakMap<object, PostHistoryRelayEventSource>();
type EventVerifier = (event: NostrEvent) => boolean | Promise<boolean>;
const scanVerifierCaches = new WeakMap<RxNostr, ReturnType<typeof createPostHistoryScanVerifier>>();

/** Only exact, successfully verified wire fingerprints may bypass Schnorr. */
export function createPostHistoryScanVerifier(baseVerifier: EventVerifier, capacity = 1024, pendingCapacity = 64) {
    const valid = new Map<string, true>();
    const pending = new Map<string, Promise<boolean>>();
    let scope: { owner: string; kinds: readonly number[] } | null = null;
    let generation = 0;
    const verify = async (event: NostrEvent): Promise<boolean> => {
        if (!scope || event.pubkey !== scope.owner || !scope.kinds.includes(event.kind)) return baseVerifier(event);
        if (!isSignedNostrEvent(event)) return false;
        const snapshot = createPlainNostrEventSnapshot(event);
        const fingerprint = createFingerprint(snapshot);
        if (!fingerprint) return false;
        const key = `${RAW_EVENT_VERIFICATION_RULE_VERSION}:${fingerprint}`;
        const currentGeneration = generation;
        let result: boolean;
        if (valid.has(key)) {
            valid.delete(key); valid.set(key, true);
            result = true;
        } else {
            let verification = pending.get(key);
            if (!verification) {
                verification = Promise.resolve().then(() => baseVerifier(snapshot));
                if (pending.size < pendingCapacity) pending.set(key, verification);
            }
            try { result = await verification; }
            finally { if (pending.get(key) === verification) pending.delete(key); }
            if (result && generation === currentGeneration && scope) {
                valid.delete(key); valid.set(key, true);
                while (valid.size > capacity) valid.delete(valid.keys().next().value!);
            }
        }
        return result && createFingerprint(event) === fingerprint;
    };
    return { verify, acquire(owner: string, kinds: readonly number[]) {
        if (scope) throw new Error("A post-history scan is already using this verifier");
        scope = { owner, kinds: [...kinds] }; generation += 1;
        return () => { scope = null; generation += 1; valid.clear(); pending.clear(); };
    } };
}

export function registerPostHistoryScanVerifier(rxNostr: RxNostr, cache: ReturnType<typeof createPostHistoryScanVerifier>): void {
    scanVerifierCaches.set(rxNostr, cache);
}

export function acquirePostHistoryScanVerification(rxNostr: RxNostr, owner: string, kinds: readonly number[]): () => void {
    return scanVerifierCaches.get(rxNostr)?.acquire(owner, kinds) ?? (() => undefined);
}

function createFingerprint(event: NostrEvent): string | null {
    if (!validateEvent(event as never)) {
        return null;
    }

    try {
        const hash = getRxNostrEventHash(event as never);
        if (hash !== event.id) {
            return null;
        }

        // The canonical hash covers every Nostr signing field other than sig.
        // Include id and sig as well so post-attestation mutation is detected.
        return `${hash}\u0000${event.id}\u0000${event.sig}`;
    } catch {
        return null;
    }
}

function createAttestation(
    event: NostrEvent,
    evidence: AttestationEvidence,
): AttestedPostHistoryRawEvent | null {
    const snapshot = createPlainNostrEventSnapshot(event);
    const fingerprint = createFingerprint(snapshot);
    if (!fingerprint) {
        return null;
    }

    const token: PostHistoryRawEventAttestation = {};
    attestations.set(token, {
        fingerprint,
        ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
        evidence,
    });
    eventAttestations.set(snapshot, token);

    return { event: snapshot, attestation: token };
}

/**
 * Use this for signed events that did not arrive through rx-nostr: local
 * signers, JSONL import and the repository fallback.
 */
export function attestFullyVerifiedPostHistoryRawEvent(
    event: unknown,
): AttestedPostHistoryRawEvent | null {
    try {
        if (!isSignedNostrEvent(event)) {
            return null;
        }

        const snapshot = createPlainNostrEventSnapshot(event);
        const fingerprint = createFingerprint(snapshot);
        if (!fingerprint) {
            return null;
        }

        if (!verifyEvent(snapshot as never)) {
            return null;
        }

        const token: PostHistoryRawEventAttestation = {};
        attestations.set(token, {
            fingerprint,
            ruleVersion: RAW_EVENT_VERIFICATION_RULE_VERSION,
            evidence: "full",
        });
        eventAttestations.set(snapshot, token);
        return { event: snapshot, attestation: token };
    } catch {
        return null;
    }
}

/**
 * Resolve an optional runtime proof. A forged or stale token never succeeds;
 * callers must then use the full-verification fallback.
 */
export function isCurrentPostHistoryRawEventAttestation(
    event: NostrEvent,
    attestation: PostHistoryRawEventAttestation | undefined,
): boolean {
    const resolvedAttestation = attestation
        ?? (typeof event === "object" && event
            ? eventAttestations.get(event)
            : undefined);
    if (!resolvedAttestation || typeof resolvedAttestation !== "object") {
        return false;
    }

    const entry = attestations.get(resolvedAttestation);
    if (!entry || entry.ruleVersion !== RAW_EVENT_VERIFICATION_RULE_VERSION) {
        return false;
    }

    return createFingerprint(event) === entry.fingerprint;
}

/**
 * The only producer of relay attestations. It is deliberately nested inside
 * the source capability, after the configured rxNostr.use() Observable.
 */
export function createPostHistoryRelayEventSource(
    rxNostr: RxNostr,
): PostHistoryRelayEventSource {
    return {
        use(rxReq, options) {
            return rxNostr.use(rxReq, options).pipe(
                map((packet) => {
                    const event = packet.event as NostrEvent | undefined;
                    if (!event) {
                        return null;
                    }

                    // rx-nostr has already verified the Schnorr signature.
                    const attested = createAttestation(event, "rx-nostr-signature");
                    return attested
                        ? { ...packet, ...attested } satisfies PostHistoryRelayEventPacket
                        : null;
                }),
                filter((packet): packet is PostHistoryRelayEventPacket => packet !== null),
            );
        },
    };
}

/**
 * authBootstrap registers the production source. Keeping the map private
 * makes a plain cast unable to create a relay-derived attestation.
 */
export function registerPostHistoryRelayEventSource(
    rxNostr: RxNostr,
): PostHistoryRelayEventSource {
    const source = createPostHistoryRelayEventSource(rxNostr);
    relaySources.set(rxNostr, source);
    return source;
}

export function usePostHistoryRelayEvents(
    rxNostr: RxNostr,
    rxReq: RxReq,
    options?: Partial<RxNostrUseOptions>,
): Observable<PostHistoryRelayEventPacket> {
    // Production always uses the source registered from authBootstrap. The
    // lazy branch keeps dependency-injected RxNostr instances on the same
    // actual-use boundary; it never exposes an API that attests a raw event.
    return (relaySources.get(rxNostr) ?? createPostHistoryRelayEventSource(rxNostr))
        .use(rxReq, options);
}
