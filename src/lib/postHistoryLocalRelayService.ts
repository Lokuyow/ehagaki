import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";
import { normalizeLocalRelayUrl } from "./localRelayUrl";
import { LocalRelayTransport, type LocalRelayTask, type LocalRelayPage } from "./localRelayTransport";
import { POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS, type PostHistoryRelayFetchRequest } from "./postHistoryRelayFetchService";
import { isPostHistoryAuthoredKind } from "./postHistoryKinds";
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
    ownerPubkeyHex: string;
    url: string;
    isActive(): boolean;
    abort: AbortController;
}

interface LocalRelayServiceDeps {
    transport?: Pick<LocalRelayTransport, "fetchAuthored" | "fetchRelated" | "storeSignedEvent">;
    repository?: Pick<typeof postHistoryRepository, "upsertFetchedEvents" | "getByEventId">;
    payloads?: Pick<typeof sensitivePayloadRepository, "putCandidate" | "getByIds">;
    deletions?: Pick<typeof postHistoryDeletionRequestsRepository, "upsertImportedDeletionEvents" | "getAllForTargetAuthorPubkey">;
    getLocalRevision?: (owner: string) => Promise<number>;
    runtimeKind?: () => string;
}

export interface LocalRelayHistoryReadResult extends Pick<LocalRelayPage, "nextUntil" | "hasMore"> {
    ownerPubkeyHex: string;
    localRevision: number;
    changed: boolean;
    eventIds: string[];
}

/** App-owned coordination; repositories stay free of network side effects. */
export class PostHistoryLocalRelayService {
    private session: LocalRelaySession | null = null;
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
        const session: LocalRelaySession = { ownerPubkeyHex: input.ownerPubkeyHex, url,
            isActive: input.isActive, abort: new AbortController() };
        this.session = session;
        return () => { if (this.session === session) this.cancelSession(); };
    }

    cancelSession(): void {
        this.session?.abort.abort();
        this.session = null;
        this.stores.clear();
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
        const session = this.currentSession(input.event.pubkey);
        if (session) this.store(session, input, isActive);
    }

    private store(session: LocalRelaySession, input: AttestedPostHistoryRawEvent, isActive: () => boolean): void {
        const { event, attestation } = input;
        if (!this.isCurrent(session) || !isActive() || event.pubkey !== session.ownerPubkeyHex
            || (!isPostHistoryAuthoredKind(event.kind) && event.kind !== 5 && event.kind !== 36)
            || !isCurrentPostHistoryRawEventAttestation(event, attestation)) return;
        const key = `${session.url}:${event.id}`;
        if (this.stores.has(key)) return;
        // Catch synchronous transport errors too; this hook cannot fail a post.
        const job = Promise.resolve().then(async () => {
            if (!this.isCurrent(session) || !isActive() || !isCurrentPostHistoryRawEventAttestation(event, attestation)) return;
            await this.getTransport().storeSignedEvent(session.url, event, session.abort.signal).promise;
        }).catch(() => undefined).finally(() => {
            if (this.stores.get(key) === job) this.stores.delete(key);
        });
        this.stores.set(key, job);
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
            const saved = await this.repository.upsertFetchedEvents({ events: page.events.map((item) => ({ ...item, relayUrls: [] })),
                fetchedAt: page.fetchedAt, localWriteScope: scope });
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
                        deletionEvents: deletions.map(({ event }) => event), fetchedAt: page.fetchedAt, localWriteScope: scope });
                    changed ||= result.appliedDeletionCount > 0;
                }
            }
            // A related-read timeout does not discard the already committed authored page.
            if (cancelled || !this.isCurrent(session) || !request.isActive()
                || await this.getLocalRevision(session.ownerPubkeyHex) !== localRevision) return null;
            return { ownerPubkeyHex: session.ownerPubkeyHex, localRevision, changed,
                eventIds: page.events.map(({ event }) => event.id), nextUntil: page.nextUntil, hasMore: page.hasMore };
        })().catch(() => null).finally(() => {
            cancel(); clearTimeout(timer); session.abort.signal.removeEventListener("abort", cancel);
        });
        return { promise, cancel };
    }

    archiveAdoptedAuthored(events: PostHistoryFetchedEventItem[], scope: { ownerPubkeyHex: string; expectedRevision?: number; isActive(): boolean }): Promise<void> {
        const session = this.currentSession(scope.ownerPubkeyHex);
        if (!session || !scope.isActive()) return Promise.resolve();
        return (async () => {
            const revision = scope.expectedRevision ?? await this.getLocalRevision(scope.ownerPubkeyHex);
            const current = () => this.isCurrent(session) && scope.isActive();
            const adopted: NostrEvent[] = [];
            for (const candidate of events) {
                if (!current()) return;
                if (candidate.event.pubkey !== scope.ownerPubkeyHex || !isPostHistoryAuthoredKind(candidate.event.kind)) continue;
                const record = await this.repository.getByEventId(candidate.event.id);
                if (!current() || await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) return;
                if (!record || record.pubkeyHex !== scope.ownerPubkeyHex || !isSameSignedNostrEvent(record.rawEvent, candidate.event)) continue;
                const verified = isCurrentPostHistoryRawEventAttestation(candidate.event, candidate.attestation)
                    ? { event: candidate.event, attestation: candidate.attestation! }
                    : attestFullyVerifiedPostHistoryRawEvent(record.rawEvent);
                if (!verified) continue;
                adopted.push(verified.event);
                if (record.deletedAt === undefined) this.store(session, verified, current);
                const reference = getSensitivePayloadReference(verified.event);
                if (reference) {
                    const [payload] = await this.payloads.getByIds([reference.eventId]);
                    if (payload && verifySensitivePayloadLink(verified.event, payload.rawEvent as NostrEvent)) {
                        const attested = attestFullyVerifiedPostHistoryRawEvent(payload.rawEvent);
                        if (attested && current()) {
                            adopted.push(attested.event);
                            if (record.deletedAt === undefined && payload.deletedAt === undefined) this.store(session, attested, current);
                        }
                    }
                }
            }
            if (!adopted.length || !current()) return;
            const deletions = await this.deletions.getAllForTargetAuthorPubkey(scope.ownerPubkeyHex);
            if (!current() || await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) return;
            for (const deletion of deletions) {
                // The exact adopted Structure/linked Payload proves the target here,
                // including a previously pending deletion reference for kind 36.
                if (!adopted.some((event) => isValidDeletionRequestForTarget(deletion.rawEvent as NostrEvent, event))) continue;
                const verified = attestFullyVerifiedPostHistoryRawEvent(deletion.rawEvent);
                if (verified) this.store(session, verified, current);
            }
        })().catch(() => undefined);
    }
}

export const postHistoryLocalRelayService = new PostHistoryLocalRelayService();
