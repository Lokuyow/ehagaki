import { getEventHash as getRxNostrEventHash } from "@rx-nostr/crypto";
import type {
    EventPacket,
    RxNostr,
    RxNostrUseOptions,
    RxReq,
} from "rx-nostr";
import { filter, map, type Observable } from "rxjs";
import { validateEvent, verifyEvent } from "nostr-tools";
import { createPlainNostrEventSnapshot } from "./postHistoryEventUtils";
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
    event: NostrEvent,
): AttestedPostHistoryRawEvent | null {
    const snapshot = createPlainNostrEventSnapshot(event);
    const fingerprint = createFingerprint(snapshot);
    if (!fingerprint) {
        return null;
    }

    try {
        if (!verifyEvent(snapshot as never)) {
            return null;
        }
    } catch {
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
