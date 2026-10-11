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
import { beginLocalRelayDiagnostic, diagnosticErrorType, noteLocalRelayDiagnosticAbort,
    type LocalRelayDiagnosticTrace, type LocalRelayDiagnosticReason } from "./localRelayDiagnostics";

interface LocalRelaySession {
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

    configureSession(input: { ownerPubkeyHex: string | null; url: string | null; isActive(): boolean }): (reason?: LocalRelayDiagnosticReason) => void {
        this.cancelSession("session-reconfigure");
        const url = input.url && normalizeLocalRelayUrl(input.url);
        if (this.runtimeKind() !== "standalone" || !input.ownerPubkeyHex || !url) return () => undefined;
        const session: LocalRelaySession = { ownerPubkeyHex: input.ownerPubkeyHex, url,
            isActive: input.isActive, abort: new AbortController() };
        this.session = session;
        return (reason = "app-session-cleanup") => { if (this.session === session) this.cancelSession(reason); };
    }

    cancelSession(reason: LocalRelayDiagnosticReason = "service-cancel"): void {
        if (this.session) noteLocalRelayDiagnosticAbort(this.session.abort.signal, reason);
        this.session?.abort.abort();
        this.session = null;
        this.stores.clear();
    }

    isConfigured(owner: string | null | undefined): boolean { return !!this.currentSession(owner); }

    private currentSession(owner: string | null | undefined, trace?: LocalRelayDiagnosticTrace): LocalRelaySession | null {
        const session = this.session;
        // Preserve the original short-circuit order and callback evaluation count.
        const missing = (reason: LocalRelayDiagnosticReason) => {
            trace?.record("session-check", { sessionFound: false, reason });
            return null;
        };
        if (!session) return missing("no-configured-session");
        if (this.runtimeKind() !== "standalone") return missing("runtime-not-standalone");
        if (session.ownerPubkeyHex !== owner) return missing("owner-mismatch");
        if (session.abort.signal.aborted) return missing("session-aborted");
        if (!session.isActive()) return missing("app-inactive");
        trace?.record("session-check", { sessionFound: true, ownerMatches: true, appActive: true, aborted: false });
        return session;
    }

    private isCurrent(session: LocalRelaySession): boolean {
        return this.currentSession(session.ownerPubkeyHex) === session;
    }

    storeSignedEventBestEffort(input: AttestedPostHistoryRawEvent, isActive: () => boolean = () => true, trace?: LocalRelayDiagnosticTrace): void {
        trace?.record("service-entered", { kind: input.event.kind, eventId: input.event.id,
            ownerMatches: this.session?.ownerPubkeyHex === input.event.pubkey });
        const session = this.currentSession(input.event.pubkey, trace);
        if (session) this.storeBatch(session, [input], isActive, trace);
        else trace?.finish("skipped-session");
    }

    private storeBatch(session: LocalRelaySession, inputs: AttestedPostHistoryRawEvent[], isActive: () => boolean, trace?: LocalRelayDiagnosticTrace): void {
        trace?.record("batch-entered", { count: inputs.length });
        const serviceCurrent = this.isCurrent(session);
        const callerActive = serviceCurrent ? isActive() : undefined;
        trace?.record("batch-check", { serviceCurrent, callerActive });
        if (!serviceCurrent || !callerActive) {
            trace?.finish(serviceCurrent ? "skipped-inactive" : "skipped-session", { reason: serviceCurrent ? "caller-inactive" : "session-stale" });
            return;
        }
        const candidates = [...new Map(inputs.filter(({ event, attestation }) => {
            const reason = event.pubkey !== session.ownerPubkeyHex ? "owner-mismatch"
                : !(isPostHistoryAuthoredKind(event.kind) || event.kind === 5 || event.kind === 36) ? "unsupported-kind"
                : !isCurrentPostHistoryRawEventAttestation(event, attestation) ? "attestation-invalid"
                : this.stores.has(`${session.url}:${event.id}`) ? "in-flight-duplicate" : undefined;
            trace?.record(reason ? "candidate-filtered" : "candidate-accepted", { kind: event.kind, eventId: event.id, reason });
            return !reason;
        }).map(item => [item.event.id, item])).values()];
        if (!candidates.length) { trace?.finish("filtered", { reason: "no-candidates" }); return; }
        const keys = candidates.map(({ event }) => `${session.url}:${event.id}`);
        // Catch synchronous transport errors too; this hook cannot fail a post.
        const job = Promise.resolve().then(async () => {
            trace?.record("batch-microtask");
            const serviceCurrent = this.isCurrent(session);
            const callerActive = serviceCurrent ? isActive() : undefined;
            trace?.record("microtask-check", { serviceCurrent, callerActive });
            if (!serviceCurrent || !callerActive) {
                trace?.finish(serviceCurrent ? "skipped-inactive" : "skipped-session", { reason: serviceCurrent ? "caller-inactive" : "session-stale" });
                return;
            }
            const events = candidates.filter(({ event, attestation }) => isCurrentPostHistoryRawEventAttestation(event, attestation))
                .map(({ event }) => event);
            trace?.record("attestation-recheck", { count: events.length });
            if (events.length) {
                trace?.record("transport-call", { count: events.length });
                await this.getTransport().storeSignedEvents(session.url, events, session.abort.signal, trace).promise;
            } else trace?.finish("filtered", { reason: "attestation-changed" });
        }).catch(error => { trace?.finish("exception", { errorType: diagnosticErrorType(error) }); }).finally(() => {
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
        const trace = beginLocalRelayDiagnostic("history-archive");
        trace?.record("archive-entered", { count: events.length });
        const session = this.currentSession(scope.ownerPubkeyHex, trace);
        if (!session) { trace?.finish("skipped-session"); return Promise.resolve(); }
        if (!scope.isActive()) { trace?.finish("skipped-inactive", { reason: "caller-inactive" }); return Promise.resolve(); }
        return (async () => {
            const revision = scope.expectedRevision ?? await this.getLocalRevision(scope.ownerPubkeyHex);
            const current = () => {
                const serviceCurrent = this.isCurrent(session);
                const callerActive = serviceCurrent ? scope.isActive() : undefined;
                trace?.record("archive-scope", { serviceCurrent, callerActive });
                if (!serviceCurrent || !callerActive) trace?.finish("aborted", { reason: serviceCurrent ? "caller-inactive" : "session-stale" });
                return serviceCurrent && !!callerActive;
            };
            const adopted = new Map<string, NostrEvent>();
            const archive = new Map<string, AttestedPostHistoryRawEvent>();
            const structuresByPayloadId = new Map<string, Array<{ event: NostrEvent; deleted: boolean }>>();
            for (const candidate of events) {
                if (!current()) return;
                if (adopted.has(candidate.event.id) || candidate.event.pubkey !== scope.ownerPubkeyHex || !isPostHistoryAuthoredKind(candidate.event.kind)) {
                    trace?.record("archive-filtered", { eventId: candidate.event.id, reason: adopted.has(candidate.event.id)
                        ? "archive-duplicate" : candidate.event.pubkey !== scope.ownerPubkeyHex ? "owner-mismatch" : "unsupported-kind" });
                    continue;
                }
                const record = await this.repository.getByEventId(candidate.event.id);
                if (!current()) return;
                if (await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) { trace?.finish("aborted", { reason: "revision-changed" }); return; }
                if (!record || record.pubkeyHex !== scope.ownerPubkeyHex || !isSameSignedNostrEvent(record.rawEvent, candidate.event)) {
                    trace?.record("archive-filtered", { eventId: candidate.event.id, reason: "not-adopted" }); continue;
                }
                const verified = isCurrentPostHistoryRawEventAttestation(candidate.event, candidate.attestation)
                    ? { event: candidate.event, attestation: candidate.attestation! }
                    : attestFullyVerifiedPostHistoryRawEvent(record.rawEvent);
                if (!verified) { trace?.record("archive-filtered", { eventId: candidate.event.id, reason: "attestation-invalid" }); continue; }
                trace?.record("db-verification-passed", { kind: verified.event.kind, eventId: verified.event.id });
                adopted.set(verified.event.id, verified.event);
                if (record.deletedAt === undefined) archive.set(verified.event.id, verified);
                const reference = getSensitivePayloadReference(verified.event);
                if (reference) {
                    const structures = structuresByPayloadId.get(reference.eventId) ?? [];
                    structures.push({ event: verified.event, deleted: record.deletedAt !== undefined });
                    structuresByPayloadId.set(reference.eventId, structures);
                }
            }
            trace?.record("archive-adopted", { count: adopted.size });
            if (!adopted.size) { trace?.finish("filtered", { reason: "no-adopted-events" }); return; }
            if (!current()) return;
            const payloads = await this.payloads.getByIds([...structuresByPayloadId.keys()]);
            if (!current()) return;
            if (await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) { trace?.finish("aborted", { reason: "revision-changed" }); return; }
            for (const payload of payloads) {
                const linked = structuresByPayloadId.get(payload.id)?.filter(({ event }) =>
                    verifySensitivePayloadLink(event, payload.rawEvent as NostrEvent)) ?? [];
                const verified = linked.length ? attestFullyVerifiedPostHistoryRawEvent(payload.rawEvent) : null;
                if (!verified) continue;
                adopted.set(verified.event.id, verified.event);
                if (payload.deletedAt === undefined && linked.some(({ deleted }) => !deleted)) archive.set(verified.event.id, verified);
            }
            const deletions = await this.deletions.getAllForTargetAuthorPubkey(scope.ownerPubkeyHex);
            if (!current()) return;
            if (await this.getLocalRevision(scope.ownerPubkeyHex) !== revision) { trace?.finish("aborted", { reason: "revision-changed" }); return; }
            for (const deletion of deletions) {
                // The exact adopted Structure/linked Payload proves the target here,
                // including a previously pending deletion reference for kind 36.
                if (![...adopted.values()].some(event => isValidDeletionRequestForTarget(deletion.rawEvent as NostrEvent, event))) continue;
                const verified = attestFullyVerifiedPostHistoryRawEvent(deletion.rawEvent);
                if (verified) archive.set(verified.event.id, verified);
            }
            // Selection and dedupe finish before opening one finite batch socket.
            // Callers still await neither this work nor local ACKs for external delivery.
            trace?.record("archive-candidates", { count: archive.size });
            this.storeBatch(session, [...archive.values()], current, trace);
        })().catch(error => { trace?.finish("exception", { errorType: diagnosticErrorType(error) }); });
    }
}

export const postHistoryLocalRelayService = new PostHistoryLocalRelayService();
