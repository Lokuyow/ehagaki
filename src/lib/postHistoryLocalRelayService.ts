import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";
import { normalizeLocalRelayUrl } from "./localRelayUrl";
import { LocalRelayTransport, type LocalRelayTask, type LocalRelayPage } from "./localRelayTransport";
import { POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS, type PostHistoryRelayFetchRequest } from "./postHistoryRelayFetchService";
import { isPostHistoryAuthoredKind, POST_HISTORY_AUTHORED_KINDS_KEY } from "./postHistoryKinds";
import { attestFullyVerifiedPostHistoryRawEvent, isCurrentPostHistoryRawEventAttestation,
    type AttestedPostHistoryRawEvent } from "./postHistoryRawEventVerification";
import { isSameSignedNostrEvent } from "./postHistoryEventUtils";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "./sensitiveContentPayload";
import { isValidDeletionRequestForTarget } from "./postHistoryDeletionUtils";
import { postHistoryRepository, type PostHistoryFetchedEventItem } from "./storage/postHistoryRepository";
import { sensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import { postHistoryDeletionRequestsRepository } from "./storage/postHistoryDeletionRequestsRepository";
import { getPostHistoryLocalRevision, type PostHistoryLocalWriteScope } from "./storage/postHistoryLocalWriteScope";
import { ehagakiDb } from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";

interface LocalRelaySession {
    generation: number;
    ownerPubkeyHex: string;
    url: string;
    isActive(): boolean;
    abort: AbortController;
}

interface LocalRelayServiceDeps {
    transport?: Pick<LocalRelayTransport, "fetchAuthored" | "fetchRelated" | "storeSignedEvents">;
    repository?: Pick<typeof postHistoryRepository, "upsertFetchedEvents" | "getByEventId">;
    payloads?: Pick<typeof sensitivePayloadRepository, "putCandidate" | "getByIds">;
    deletions?: Pick<typeof postHistoryDeletionRequestsRepository, "upsertImportedDeletionEvents" | "getAllForTargetAuthorPubkey">;
    getLocalRevision?: (owner: string) => Promise<number>;
    runtimeKind?: () => string;
}

export interface LocalRelayHistoryReadResult extends Pick<LocalRelayPage, "nextUntil" | "hasMore" | "browsingRanges"> {
    sessionGeneration: number;
    ownerPubkeyHex: string;
    localRevision: number;
    changed: boolean;
    eventIds: string[];
}

/** App-owned coordination; repositories stay free of network side effects. */
export class PostHistoryLocalRelayService {
    private session: LocalRelaySession | null = null;
    private sessionGeneration = 0;
    private sessionListeners = new Set<() => void>();
    private stores = new Map<string, Promise<void>>();
    private transport: LocalRelayServiceDeps["transport"];
    private readonly repository;
    private readonly payloads;
    private readonly deletions;
    private readonly getLocalRevision;
    private readonly runtimeKind;

    constructor(deps: LocalRelayServiceDeps = {}) {
        this.transport = deps.transport;
        this.repository = deps.repository ?? postHistoryRepository;
        this.payloads = deps.payloads ?? sensitivePayloadRepository;
        this.deletions = deps.deletions ?? postHistoryDeletionRequestsRepository;
        this.getLocalRevision = deps.getLocalRevision ?? ((owner: string) => getPostHistoryLocalRevision(ehagakiDb, owner));
        this.runtimeKind = deps.runtimeKind ?? (() => getAppRuntimeEnvironment().runtimeKind);
    }

    private getTransport(): NonNullable<LocalRelayServiceDeps["transport"]> {
        return this.transport ??= new LocalRelayTransport();
    }

    configureSession(input: { ownerPubkeyHex: string | null; url: string | null; isActive(): boolean }): () => void {
        this.cancelSession();
        const url = input.url && normalizeLocalRelayUrl(input.url);
        if (this.runtimeKind() !== "standalone" || !input.ownerPubkeyHex || !url) return () => undefined;
        const session: LocalRelaySession = { generation: this.sessionGeneration, ownerPubkeyHex: input.ownerPubkeyHex, url,
            isActive: input.isActive, abort: new AbortController() };
        this.session = session;
        return () => { if (this.session === session) this.cancelSession(); };
    }

    cancelSession(): void {
        this.session?.abort.abort();
        this.session = null;
        this.stores.clear();
        this.sessionGeneration += 1;
        for (const listener of this.sessionListeners) listener();
    }

    getSessionGeneration(): number { return this.sessionGeneration; }

    onSessionInvalidated(listener: () => void): () => void {
        this.sessionListeners.add(listener);
        return () => { this.sessionListeners.delete(listener); };
    }

    isConfigured(owner: string | null | undefined): boolean { return !!this.currentSession(owner); }

    private currentSession(owner: string | null | undefined): LocalRelaySession | null {
        const session = this.session;
        return session && this.runtimeKind() === "standalone" && session.ownerPubkeyHex === owner
            && !session.abort.signal.aborted && session.isActive() ? session : null;
    }

    private isCurrent(session: LocalRelaySession): boolean {
        return this.currentSession(session.ownerPubkeyHex) === session;
    }

    storeSignedEventBestEffort(input: AttestedPostHistoryRawEvent, isActive: () => boolean = () => true): void {
        this.storeSignedEventsBestEffort([input], isActive);
    }

    storeSignedEventsBestEffort(inputs: AttestedPostHistoryRawEvent[], isActive: () => boolean = () => true): void {
        const session = inputs.length ? this.currentSession(inputs[0].event.pubkey) : null;
        if (session) this.storeBatch(session, inputs, isActive);
    }

    private storeBatch(session: LocalRelaySession, inputs: AttestedPostHistoryRawEvent[], isActive: () => boolean): void {
        if (!this.isCurrent(session) || !isActive()) return;
        const candidates = [...new Map(inputs.filter(({ event, attestation }) =>
            event.pubkey === session.ownerPubkeyHex
            && (isPostHistoryAuthoredKind(event.kind) || event.kind === 5 || event.kind === 36)
            && isCurrentPostHistoryRawEventAttestation(event, attestation)
            && !this.stores.has(`${session.url}:${event.id}`)).map(item => [item.event.id, item])).values()];
        if (!candidates.length) return;
        const keys = candidates.map(({ event }) => `${session.url}:${event.id}`);
        // Catch synchronous transport errors too; this hook cannot fail a post.
        const job = Promise.resolve().then(async () => {
            if (!this.isCurrent(session) || !isActive()) return;
            const events = candidates.filter(({ event, attestation }) => isCurrentPostHistoryRawEventAttestation(event, attestation))
                .map(({ event }) => event);
            if (events.length) await this.getTransport().storeSignedEvents(session.url, events, session.abort.signal).promise;
        }).catch(() => undefined).finally(() => {
            for (const key of keys) if (this.stores.get(key) === job) this.stores.delete(key);
        });
        for (const key of keys) this.stores.set(key, job);
    }

    read(request: PostHistoryRelayFetchRequest & { targets?: NostrEvent[]; isActive(): boolean }): LocalRelayTask<LocalRelayHistoryReadResult> {
        const session = this.currentSession(request.pubkeyHex);
        if (!session) return { promise: Promise.resolve(null), cancel: () => undefined };
        const abort = new AbortController();
        let cancelled = false;
        const cancel = () => { cancelled = true; abort.abort(); };
        session.abort.signal.addEventListener("abort", cancel, { once: true });
        const timer = setTimeout(() => abort.abort(), POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS);
        const active = () => !abort.signal.aborted && this.isCurrent(session) && request.isActive();
        const promise = (async (): Promise<LocalRelayHistoryReadResult | null> => {
            const localRevision = await this.getLocalRevision(session.ownerPubkeyHex);
            if (!active()) return null;
            const scope: PostHistoryLocalWriteScope = { ownerPubkeyHex: session.ownerPubkeyHex,
                expectedRevision: localRevision, isActive: active };
            const page = await this.getTransport().fetchAuthored(session.url, request, abort.signal).promise;
            if (!page || !active()) return null;
            // A resume hint is not exhaustion evidence. Empty pages retain their request bound;
            // head refreshes may seed a missing hint, but cannot rewind older pagination.
            const resumeUntil = page.nextUntil ?? request.until;
            const saved = await this.repository.upsertFetchedEvents({ events: page.events.map((item) => ({ ...item, relayUrls: [] })),
                fetchedAt: page.fetchedAt, localWriteScope: scope,
                localBrowsingWrite: { ...scope, kindsKey: POST_HISTORY_AUTHORED_KINDS_KEY, localRelayUrl: session.url,
                    browsingRanges: page.browsingRanges,
                    ...(request.reason !== "repair-visible-range" && resumeUntil !== undefined && resumeUntil !== null
                        ? { resumeHint: { nextUntil: resumeUntil }, initializeResumeHintOnly: request.reason !== "older-backfill" } : {}) } });
            if (saved.applied === false || !active()) return null;
            let changed = saved.insertedCount + saved.updatedCount + saved.appliedDeletionCount > 0;
            const targets = [...new Map([...page.events.map(({ event }) => event), ...(request.targets ?? [])]
                .filter((event) => event.pubkey === session.ownerPubkeyHex && isPostHistoryAuthoredKind(event.kind))
                .map((event) => [event.id, event])).values()];
            const payloadIds = targets.flatMap((event) => {
                const reference = getSensitivePayloadReference(event);
                return reference ? [reference.eventId] : [];
            });
            const targetIds = [...targets.map((event) => event.id), ...payloadIds];
            // Related reads are bounded to this authored page/current view, not a mirror.
            const related = await Promise.allSettled([
                payloadIds.length ? this.getTransport().fetchRelated(session.url,
                    { ids: [...new Set(payloadIds)], authors: [session.ownerPubkeyHex], kinds: [36], limit: payloadIds.length }, abort.signal).promise
                    : Promise.resolve([]),
                targetIds.length ? this.getTransport().fetchRelated(session.url,
                    { authors: [session.ownerPubkeyHex], kinds: [5], "#e": [...new Set(targetIds)], limit: request.limit ?? 150 }, abort.signal).promise
                    : Promise.resolve([]),
            ]);
            if (active()) {
                const payloads = related[0].status === "fulfilled" ? related[0].value ?? [] : [];
                for (const item of payloads) {
                    if (!active()) break;
                    if (targets.some((target) => verifySensitivePayloadLink(target, item.event))) {
                        await this.payloads.putCandidate({ ...item, localWriteScope: scope });
                        changed = true;
                    }
                }
                const deletions = related[1].status === "fulfilled" ? related[1].value ?? [] : [];
                if (active() && deletions.length) {
                    const result = await this.deletions.upsertImportedDeletionEvents({ ownerPubkeyHex: session.ownerPubkeyHex,
                        deletionEvents: deletions, fetchedAt: page.fetchedAt, localWriteScope: scope });
                    changed ||= result.appliedDeletionCount > 0;
                }
            }
            // A related-read timeout does not discard the already committed authored page.
            if (cancelled || !this.isCurrent(session) || !request.isActive()
                || await this.getLocalRevision(session.ownerPubkeyHex) !== localRevision) return null;
            return { ownerPubkeyHex: session.ownerPubkeyHex, sessionGeneration: session.generation,
                localRevision, changed, browsingRanges: page.browsingRanges,
                eventIds: page.events.map(({ event }) => event.id), nextUntil: page.nextUntil, hasMore: page.hasMore };
        })().catch(() => null).finally(() => {
            cancel(); clearTimeout(timer); session.abort.signal.removeEventListener("abort", cancel);
        });
        return { promise, cancel };
    }

    archiveAdoptedAuthored(events: PostHistoryFetchedEventItem[], scope: PostHistoryLocalWriteScope): Promise<void> {
        const session = this.currentSession(scope.ownerPubkeyHex);
        if (!session || !scope.isActive() || scope.expectedRevision === undefined) return Promise.resolve();
        return (async () => {
            const revision = scope.expectedRevision;
            const current = () => this.isCurrent(session) && scope.isActive();
            const adopted = new Map<string, NostrEvent>();
            const archive = new Map<string, AttestedPostHistoryRawEvent>();
            const structuresByPayloadId = new Map<string, Array<{ event: NostrEvent; deleted: boolean }>>();
            for (const candidate of events) {
                if (!current()) return;
                if (adopted.has(candidate.event.id) || candidate.event.pubkey !== scope.ownerPubkeyHex || !isPostHistoryAuthoredKind(candidate.event.kind)) continue;
                const record = await this.repository.getByEventId(candidate.event.id);
                if (!current() || await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) return;
                if (!record || record.pubkeyHex !== scope.ownerPubkeyHex || !isSameSignedNostrEvent(record.rawEvent, candidate.event)) continue;
                const verified = isCurrentPostHistoryRawEventAttestation(candidate.event, candidate.attestation)
                    ? { event: candidate.event, attestation: candidate.attestation! }
                    : attestFullyVerifiedPostHistoryRawEvent(record.rawEvent);
                if (!verified) continue;
                adopted.set(verified.event.id, verified.event);
                if (record.deletedAt === undefined) archive.set(verified.event.id, verified);
                const reference = getSensitivePayloadReference(verified.event);
                if (reference) {
                    const structures = structuresByPayloadId.get(reference.eventId) ?? [];
                    structures.push({ event: verified.event, deleted: record.deletedAt !== undefined });
                    structuresByPayloadId.set(reference.eventId, structures);
                }
            }
            if (!adopted.size || !current()) return;
            const payloads = await this.payloads.getByIds([...structuresByPayloadId.keys()]);
            if (!current() || await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) return;
            for (const payload of payloads) {
                const linked = structuresByPayloadId.get(payload.id)?.filter(({ event }) =>
                    verifySensitivePayloadLink(event, payload.rawEvent as NostrEvent)) ?? [];
                const verified = linked.length ? attestFullyVerifiedPostHistoryRawEvent(payload.rawEvent) : null;
                if (!verified) continue;
                adopted.set(verified.event.id, verified.event);
                if (payload.deletedAt === undefined && linked.some(({ deleted }) => !deleted)) archive.set(verified.event.id, verified);
            }
            const deletions = await this.deletions.getAllForTargetAuthorPubkey(scope.ownerPubkeyHex);
            if (!current() || await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) return;
            for (const deletion of deletions) {
                // The exact adopted Structure/linked Payload proves the target here,
                // including a previously pending deletion reference for kind 36.
                if (![...adopted.values()].some(event => isValidDeletionRequestForTarget(deletion.rawEvent as NostrEvent, event))) continue;
                const verified = attestFullyVerifiedPostHistoryRawEvent(deletion.rawEvent);
                if (verified) archive.set(verified.event.id, verified);
            }
            // Selection and dedupe finish before opening one finite batch socket.
            // Callers still await neither this work nor local ACKs for external delivery.
            this.storeBatch(session, [...archive.values()], current);
        })().catch(() => undefined);
    }
}

export const postHistoryLocalRelayService = new PostHistoryLocalRelayService();
