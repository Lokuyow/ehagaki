import { seckeySigner } from "@rx-nostr/crypto";
import type { RxNostr } from "rx-nostr";
import type { EventTemplate } from "nostr-tools";
import { authState } from "../stores/authStore.svelte";
import { writeRelaysStore } from "../stores/relayStore.svelte";
import { isHostRelayConfigActive } from "./hostRelayRuntime";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { PostEventSender } from "./postEventBuilder";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    attestFullyVerifiedPostHistoryRawEvent,
    type PostHistoryRawEventAttestation,
} from "./postHistoryRawEventVerification";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import type { SensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import type { WindowNostr } from "nostr-tools/nip07";
import { sensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "./sensitiveContentPayload";
import { postHistoryContextFetchService } from "./postHistoryContextFetchService";
import { relayConfigStore } from "../stores/relayStore.svelte";
import { isFullyVerifiedEvent } from "./sensitiveEventUtils";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import type { PostResult, AuthState, KeyManagerInterface, NostrEvent } from "./types";
import { assertActiveSession } from "./sessionLiveness";
import {
    prepareSignedEventTemplate,
    validateSignedEventResult,
} from "./signedEventResultValidator";

export const POST_DELETION_SUPPORTED_KINDS = [1, 6, 42, 1111] as const;

export interface DeletionRequestResult extends PostResult {
    deletedAt?: number;
    deletionEventId?: string;
    deletionEvent?: NostrEvent;
    deletionEventAttestation?: PostHistoryRawEventAttestation;
    sensitivePayloadOmitted?: boolean;
}

export interface DeletionSigner {
    signEvent?: (event: EventTemplate) => Promise<unknown>;
}

export interface PostDeletionServiceDeps {
    authStateStore?: {
        value: AuthState;
    };
    keyManager?: KeyManagerInterface;
    window?: {
        nostr?: Partial<Pick<WindowNostr, "signEvent">>;
    };
    console?: Console;
    seckeySignerFn?: (key: string) => DeletionSigner;
    getNip46SignerForSessionFn?: (
        expectedPubkey: string,
    ) => Promise<DeletionSigner | null | undefined>;
    getParentClientSignerFn?: () => DeletionSigner | null | undefined;
    writeRelaysStore?: {
        value: string[];
    };
    postHistoryDeletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "saveLocalDeletion"
    >;
    sensitivePayloadRepository?: Pick<SensitivePayloadRepository, "getByIds">;
    fetchPayloadFn?: typeof postHistoryContextFetchService.fetchEventById;
    saveSensitivePayloadFn?: SensitivePayloadRepository["putCandidate"];
    eventSenderFactory?: (
        rxNostr: RxNostr,
        console: Console,
    ) => Pick<PostEventSender, "sendEvent">;
    now?: () => number;
}

type SupportedPostKind = (typeof POST_DELETION_SUPPORTED_KINDS)[number];

type DeletionRequestTemplate = {
    kind: 5;
    pubkey: string;
    content: "";
    tags: string[][];
    created_at: number;
};

function createFallbackConsole(): Console {
    return {
        log: () => undefined,
        warn: () => undefined,
        error: () => undefined,
    } as Console;
}

export function canRequestPostDeletion(
    post: Pick<PostHistoryRecord, "eventId" | "kind" | "pubkeyHex" | "deletedAt">,
    currentPubkey: string | null | undefined,
): boolean {
    if (!currentPubkey || post.pubkeyHex !== currentPubkey) {
        return false;
    }

    if (typeof post.deletedAt === "number") {
        return false;
    }

    return POST_DELETION_SUPPORTED_KINDS.includes(post.kind as SupportedPostKind)
        && typeof post.eventId === "string"
        && post.eventId.length > 0;
}

export function buildDeletionRequestEvent(
    post: Pick<PostHistoryRecord, "eventId" | "kind" | "pubkeyHex">,
    createdAt: number = Math.floor(Date.now() / 1000),
    payloadEventId?: string,
): DeletionRequestTemplate {
    const targets: string[][] = [["e", post.eventId], ["k", String(post.kind)]];
    if (payloadEventId) {
        targets.push(["e", payloadEventId], ["k", "36"]);
    }
    return {
        kind: 5,
        pubkey: post.pubkeyHex,
        content: "",
        tags: targets,
        created_at: createdAt,
    };
}

export function buildDeletionRelayUrls(
    post: Pick<
        PostHistoryRecord,
        | "kind"
        | "acceptedRelays"
        | "fetchedRelays"
        | "relayHints"
        | "channelRelayHints"
    >,
    writeRelays: string[],
    payloadEvidence?: { acceptedRelays?: string[]; fetchedRelays?: string[] },
): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(post.acceptedRelays ?? []),
        ...(post.fetchedRelays ?? []),
        ...(post.relayHints ?? []),
        ...(post.kind === 42 ? post.channelRelayHints ?? [] : []),
        ...(payloadEvidence?.acceptedRelays ?? []),
        ...(payloadEvidence?.fetchedRelays ?? []),
        ...writeRelays,
    ]);
}

export class PostDeletionService {
    private readonly deps: Required<
        Omit<
            PostDeletionServiceDeps,
            "eventSenderFactory" | "postHistoryRepository"
        >
    > & {
        eventSenderFactory?: PostDeletionServiceDeps["eventSenderFactory"];
        postHistoryDeletionRequestsRepository: Pick<
            PostHistoryDeletionRequestsRepository,
            "saveLocalDeletion"
        >;
        sensitivePayloadRepository: Pick<SensitivePayloadRepository, "getByIds">;
    };

    constructor(deps: PostDeletionServiceDeps = {}) {
        this.deps = {
            authStateStore: deps.authStateStore ?? authState,
            keyManager: deps.keyManager ?? keyManager,
            window: deps.window ?? (typeof window !== "undefined" ? window : {}),
            console:
                deps.console
                ?? (typeof globalThis.console !== "undefined"
                    ? globalThis.console
                    : createFallbackConsole()),
            seckeySignerFn: deps.seckeySignerFn ?? seckeySigner,
            getNip46SignerForSessionFn:
                deps.getNip46SignerForSessionFn
                ?? ((expectedPubkey) => nip46Service.getSignerForSession(expectedPubkey)),
            getParentClientSignerFn:
                deps.getParentClientSignerFn
                ?? (() => parentClientAuthService.getSigner()),
            writeRelaysStore: deps.writeRelaysStore ?? writeRelaysStore,
            postHistoryDeletionRequestsRepository:
                deps.postHistoryDeletionRequestsRepository
                ?? postHistoryDeletionRequestsRepository,
            eventSenderFactory: deps.eventSenderFactory,
            sensitivePayloadRepository: deps.sensitivePayloadRepository ?? sensitivePayloadRepository,
            fetchPayloadFn: deps.fetchPayloadFn ?? postHistoryContextFetchService.fetchEventById.bind(postHistoryContextFetchService),
            saveSensitivePayloadFn: deps.saveSensitivePayloadFn ?? sensitivePayloadRepository.putCandidate.bind(sensitivePayloadRepository),
            now: deps.now ?? Date.now,
        };
    }

    async requestDeletion(params: {
        post: PostHistoryRecord;
        rxNostr?: RxNostr;
    }): Promise<DeletionRequestResult> {
        const auth = this.deps.authStateStore.value;
        const currentPubkey = auth.pubkey || null;

        if (!params.rxNostr) {
            return { success: false, error: "nostr_not_ready" };
        }

        if (!auth.isAuthenticated || !currentPubkey) {
            return { success: false, error: "pubkey_not_found" };
        }

        if (
            isHostRelayConfigActive()
            && RelayConfigUtils.sanitizeExternalRelayUrls(
                this.deps.writeRelaysStore.value,
            ).length === 0
        ) {
            return { success: false, error: "no_write_relays" };
        }

        const assertSession = () => assertActiveSession(
            this.deps.authStateStore,
            currentPubkey,
        );

        if (!canRequestPostDeletion(params.post, currentPubkey)) {
            return { success: false, error: "deletion_request_not_allowed" };
        }

        let nip46Signer: DeletionSigner | null | undefined;
        if (auth.type === "nip46") {
            try {
                assertSession();
                nip46Signer = await this.deps.getNip46SignerForSessionFn(
                    currentPubkey,
                );
                const currentAuth = this.deps.authStateStore.value;
                if (
                    !nip46Signer
                    || !currentAuth.isAuthenticated
                    || currentAuth.type !== "nip46"
                    || currentAuth.pubkey !== currentPubkey
                ) {
                    return { success: false, error: "nip46_signer_not_available" };
                }
            } catch {
                this.deps.console.error("post_deletion_nip46_signer_failed", {
                    stage: 'resolve-signer',
                    reason: 'unexpected',
                });
                return { success: false, error: "post_error" };
            }
        }

        const signerResolution = this.resolveSigner(auth, nip46Signer);
        if (signerResolution.error) {
            return { success: false, error: signerResolution.error };
        }

        try {
            assertSession();
        } catch {
            return { success: false, error: "post_error" };
        }

        const associatedPayload = await this.resolveAssociatedPayload(params.post, params.rxNostr);
        const sensitivePayloadOmitted = isFullyVerifiedEvent(params.post.rawEvent)
            && !!getSensitivePayloadReference(params.post.rawEvent) && !associatedPayload;
        const deletionEvent = buildDeletionRequestEvent(
            params.post,
            Math.floor(this.deps.now() / 1000),
            associatedPayload?.id,
        );

        let signedEvent: NostrEvent;
        try {
            assertSession();
            const prepared = prepareSignedEventTemplate(deletionEvent);
            const signerResult = await signerResolution.signEvent!(prepared.signerTemplate);
            assertSession();
            signedEvent = validateSignedEventResult(
                prepared.expectedTemplate,
                signerResult,
                currentPubkey,
            );
            assertSession();
        } catch {
            this.deps.console.error("post_deletion_sign_failed", {
                stage: 'sign-event',
                reason: 'unexpected',
            });
            return { success: false, error: "post_error" };
        }

        const verifiedDeletionEvent = attestFullyVerifiedPostHistoryRawEvent(
            signedEvent,
        );
        if (!verifiedDeletionEvent) {
            return { success: false, error: "post_error" };
        }

        const additionalWriteRelays = buildDeletionRelayUrls(
            params.post,
            this.deps.writeRelaysStore.value,
            associatedPayload,
        );

        let result: PostResult;
        try {
            assertSession();
            result = await this.createEventSender(params.rxNostr).sendEvent(
                verifiedDeletionEvent.event,
                {
                    targetRelays: additionalWriteRelays,
                    includeDefaultWriteRelays: true,
                },
            );
        } catch {
            this.deps.console.error("post_deletion_send_failed", {
                stage: 'publish',
                reason: 'unexpected',
            });
            return { success: false, error: "post_error" };
        }

        if (!result.success) {
            return result;
        }

        const deletionEventId = verifiedDeletionEvent.event.id ?? result.eventId;
        if (!deletionEventId) {
            return { success: false, error: "post_error" };
        }

        const deletedAt = this.deps.now();

        try {
            await this.deps.postHistoryDeletionRequestsRepository.saveLocalDeletion({
                targetEvent: isFullyVerifiedEvent(params.post.rawEvent) ? params.post.rawEvent : undefined,
                targetEventIds: deletionEvent.tags
                    .filter((tag) => tag[0] === "e")
                    .map((tag) => tag[1]!),
                deletionEvent: verifiedDeletionEvent.event,
                attestation: verifiedDeletionEvent.attestation,
                deletedAt,
                relayUrls: additionalWriteRelays,
            });
        } catch {
            this.deps.console.warn("post_history_local_deletion_save_failed", {
                stage: 'post-history',
                reason: 'unexpected',
            });
        }

        return {
            ...result,
            eventId: deletionEventId,
            deletionEventId,
            deletionEvent: verifiedDeletionEvent.event,
            deletionEventAttestation: verifiedDeletionEvent.attestation,
            deletedAt,
            ...(sensitivePayloadOmitted ? { sensitivePayloadOmitted: true } : {}),
        };
    }

    private createEventSender(rxNostr: RxNostr): Pick<PostEventSender, "sendEvent"> {
        return this.deps.eventSenderFactory
            ? this.deps.eventSenderFactory(rxNostr, this.deps.console)
            : new PostEventSender(rxNostr, this.deps.console);
    }

    private async resolveAssociatedPayload(post: PostHistoryRecord, rxNostr: RxNostr): Promise<{
        id: string;
        acceptedRelays?: string[];
        fetchedRelays?: string[];
    } | undefined> {
        const structure = post.rawEvent as NostrEvent;
        if (!isFullyVerifiedEvent(structure)) return undefined;
        const reference = getSensitivePayloadReference(structure);
        if (!reference || structure.id !== post.eventId || structure.pubkey !== post.pubkeyHex) {
            return undefined;
        }
        let record;
        try {
            [record] = await this.deps.sensitivePayloadRepository.getByIds([reference.eventId]);
        } catch {
            return undefined;
        }
        if (record?.deletedAt !== undefined) return undefined;
        if (!record) {
            const task = this.deps.fetchPayloadFn(rxNostr, {
                eventId: reference.eventId,
                relayHints: RelayConfigUtils.sanitizeExternalRelayUrls([
                    ...(reference.relayHint ? [reference.relayHint] : []),
                    ...(post.acceptedRelays ?? []), ...(post.fetchedRelays ?? []), ...(post.relayHints ?? []),
                ]),
                relayConfig: relayConfigStore.value,
            });
            try {
                const fetched = await task.promise;
                if (!fetched.event || !verifySensitivePayloadLink(structure, fetched.event, reference.eventId)) return undefined;
                const fetchedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(fetched.relayUrl ? [fetched.relayUrl] : []);
                try {
                    await this.deps.saveSensitivePayloadFn({ event: fetched.event, fetchedRelays });
                } catch {
                    this.deps.console.warn("sensitive_payload_cache_save_failed", { stage: "deletion", reason: "storage" });
                }
                [record] = await this.deps.sensitivePayloadRepository.getByIds([reference.eventId]);
                if (record?.deletedAt !== undefined) return undefined;
                // A cache failure must not turn an unverified c pointer into a deletion target.
                if (!record) return { id: fetched.event.id, fetchedRelays };
            } catch {
                return undefined;
            } finally {
                task.cancel();
            }
        }
        const payload = record.rawEvent as NostrEvent;
        if (!verifySensitivePayloadLink(structure, payload, reference.eventId)) return undefined;
        return {
            id: reference.eventId,
            acceptedRelays: record.acceptedRelays,
            fetchedRelays: record.fetchedRelays,
        };
    }

    private resolveSigner(
        auth: AuthState,
        nip46Signer?: DeletionSigner | null,
    ): {
        signEvent?: DeletionSigner["signEvent"];
        error?: string;
    } {
        if (auth.type === "nip07") {
            const signEvent = this.deps.window.nostr?.signEvent;
            return typeof signEvent === "function"
                ? { signEvent: signEvent.bind(this.deps.window.nostr) }
                : { error: "nostr_sign_event_not_supported" };
        }

        if (auth.type === "nip46") {
            return this.resolveExternalSigner(
                nip46Signer,
                "nip46_signer_not_available",
            );
        }

        if (auth.type === "parentClient") {
            return this.resolveExternalSigner(
                this.deps.getParentClientSignerFn(),
                "parent_client_signer_not_available",
            );
        }

        const storedKey = this.deps.keyManager.getFromStore()
            || this.deps.keyManager.loadFromStorage(auth.pubkey);

        if (!storedKey) {
            return { error: "key_not_found" };
        }

        return this.resolveExternalSigner(
            this.deps.seckeySignerFn(storedKey),
            "nostr_sign_event_not_supported",
        );
    }

    private resolveExternalSigner(
        signer: DeletionSigner | null | undefined,
        missingSignerError: string,
    ): { signEvent?: DeletionSigner["signEvent"]; error?: string } {
        if (!signer) {
            return { error: missingSignerError };
        }

        return typeof signer.signEvent === "function"
            ? { signEvent: signer.signEvent.bind(signer) }
            : { error: "nostr_sign_event_not_supported" };
    }
}

export const postDeletionService = new PostDeletionService();
