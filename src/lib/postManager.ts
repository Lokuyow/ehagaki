import type { RxNostr } from "rx-nostr";
import { seckeySigner } from "@rx-nostr/crypto";
import type { EventTemplate } from "nostr-tools";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { keyManager } from "./keyManager.svelte";
import { authState } from "../stores/authStore.svelte";
import { mediaFreePlacementStore } from "../stores/uploadStore.svelte";
import { hashtagDataStore, getHashtagDataSnapshot, contentWarningStore, contentWarningReasonStore, hashtagPinStore } from "../stores/tagsStore.svelte";
import { createImetaTag } from "./tags/imetaTag";
import { buildClientTag } from "./tags/clientTag";
import { extractPostContentWithEmojiTags, type ExtractedPostContent } from "./utils/editorDocumentUtils";
import { extractImageBlurhashMap, getMimeTypeFromUrl } from "../lib/tags/imetaTag";
import { resetEditorState, resetPostStatus } from "../stores/editorStore.svelte";
import type { PostDeliveryClassResult, PostDeliverySummary, RelayRejection, ImageImetaMetadataMap, PostResult, PostManagerDeps, HashtagStore, NostrEvent, PostManagerSigner } from "./types";
import { iframeMessageService } from "./iframeMessageService";
import { saveHashtagsToHistory } from "./utils/hashtagHistory";
import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
import { trimTrailingNewlineAfterMedia, PostValidator, PostEventBuilder, PostEventSender, type PostEventTemplate } from "./postEventBuilder";
import { ReplyQuoteService } from "./replyQuoteService";
import { replyQuoteState, clearReplyQuote } from "../stores/replyQuoteStore.svelte";
import { settingsStore } from "../stores/settingsStore.svelte";
import { writeRelaysStore } from "../stores/relayStore.svelte";
import { isHostRelayConfigActive } from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
  attestFullyVerifiedPostHistoryRawEvent,
  type PostHistoryRawEventAttestation,
} from "./postHistoryRawEventVerification";
import { assertActiveSession, captureActiveSessionPubkey } from "./sessionLiveness";
import {
  prepareSignedEventTemplate,
  validateSignedEventResult,
} from "./signedEventResultValidator";
import {
  buildNip22ReplyTags,
  resolveSubmissionKind,
} from "./sensitiveEventUtils";
import {
  buildSensitivePayloadEvent,
  buildSensitiveStructureEvent,
  type SensitiveContentStructureKind,
} from "./sensitiveContentPayload";
import { sensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import { getNip65RelayDirectory, type Nip65RelayDirectoryEntry } from "./nip65RelayDirectory";

const NIP65_DISCOVERY_BUDGET_MS = 3_000;
const NIP65_POST_OPERATION_DEADLINE_MS = 30_000;

interface Nip65RelayOutcome {
  accepted?: true;
  rejected?: RelayRejection;
  timedOut?: true;
  unconfirmed?: true;
  authRequired?: true;
}

interface Nip65RelayRoles {
  authorWrite: boolean;
  additional: boolean;
  recipients: Set<string>;
}

interface ActiveNip65Operation {
  cancel(): void;
}

function createRelayRoles(): Nip65RelayRoles {
  return { authorWrite: false, additional: false, recipients: new Set() };
}

function createDeliveryClassResult(
  relays: string[],
  outcomes: Map<string, Nip65RelayOutcome>,
  unavailable = false,
  cancelled = false,
): PostDeliveryClassResult {
  const acceptedRelays: string[] = [];
  const rejectedRelays: RelayRejection[] = [];
  const timedOutRelays: string[] = [];
  const authRequiredRelays: string[] = [];
  const unconfirmedRelays: string[] = [];

  for (const relay of relays) {
    const outcome = outcomes.get(relay);
    if (outcome?.accepted) acceptedRelays.push(relay);
    if (outcome?.rejected) rejectedRelays.push(outcome.rejected);
    if (outcome?.timedOut) timedOutRelays.push(relay);
    if (outcome?.unconfirmed) unconfirmedRelays.push(relay);
    if (outcome?.authRequired && !outcome.accepted && !outcome.rejected) {
      authRequiredRelays.push(relay);
    }
  }

  const delivered = acceptedRelays.length > 0;
  const hasUnconfirmed = timedOutRelays.length > 0 || unconfirmedRelays.length > 0;
  const hasPartialFailure = rejectedRelays.length > 0 || hasUnconfirmed;
  const status: PostDeliveryClassResult["status"] = delivered
    ? (hasPartialFailure ? "partial" : "delivered")
    : cancelled
      ? "cancelled"
      : unavailable || relays.length === 0
        ? "unavailable"
        : "not-delivered";

  return {
    status,
    requestedRelays: [...relays],
    acceptedRelays,
    rejectedRelays,
    timedOutRelays,
    authRequiredRelays,
    unconfirmedRelays,
  };
}

// 後方互換性のためre-export
export { trimTrailingNewlineAfterMedia, PostValidator, PostEventBuilder, PostEventSender } from "./postEventBuilder";

type ReplyQuoteNotifyOptions = {
  eventId?: string;
  replyToEventId?: string;
  quotedEventIds?: string[];
};

// --- メインのPostManager（依存性を組み合わせ） ---
export class PostManager {
  private rxNostr: RxNostr | null = null;
  private eventSender: PostEventSender | null = null;
  private activeNip65Operations = new Set<ActiveNip65Operation>();
  private operationGeneration = 0;

  constructor(
    rxNostr?: RxNostr,
    private deps: PostManagerDeps = {}
  ) {
    if (rxNostr) {
      this.setRxNostr(rxNostr);
    }

    // デフォルト依存性の設定
    this.deps.console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);
    this.deps.authStateStore = deps.authStateStore || authState;
    this.deps.hashtagStore = deps.hashtagStore || hashtagDataStore;
    this.deps.mediaFreePlacementStore = deps.mediaFreePlacementStore || mediaFreePlacementStore;
    this.deps.mediaGalleryStore = deps.mediaGalleryStore || mediaGalleryStore;
    this.deps.contentWarningStore = deps.contentWarningStore || contentWarningStore;
    this.deps.contentWarningReasonStore = deps.contentWarningReasonStore || contentWarningReasonStore;
    this.deps.keyManager = deps.keyManager || keyManager;
    this.deps.createImetaTagFn = deps.createImetaTagFn || createImetaTag;
    this.deps.settingsStore = deps.settingsStore || settingsStore;
    this.deps.writeRelaysStore = deps.writeRelaysStore || writeRelaysStore;
    this.deps.replyQuoteState = deps.replyQuoteState || replyQuoteState;
    this.deps.getClientTagFn = deps.getClientTagFn || (() =>
      buildClientTag(this.deps.settingsStore?.clientTagEnabled ?? true)
    );
    this.deps.seckeySignerFn = deps.seckeySignerFn || seckeySigner; // ★追加
    this.deps.extractContentWithImagesFn = deps.extractContentWithImagesFn;
    this.deps.extractContentWithEmojiTagsFn = deps.extractContentWithEmojiTagsFn || (
      deps.extractContentWithImagesFn
        ? (editor: TipTapEditor) => ({ content: deps.extractContentWithImagesFn!(editor), emojiTags: [] })
        : extractPostContentWithEmojiTags
    );
    this.deps.extractImageBlurhashMapFn = deps.extractImageBlurhashMapFn || extractImageBlurhashMap;
    this.deps.resetEditorStateFn = deps.resetEditorStateFn || resetEditorState;
    this.deps.resetPostStatusFn = deps.resetPostStatusFn || resetPostStatus;
    this.deps.notificationPort =
      deps.iframeMessageService || deps.notificationPort || iframeMessageService;
    // Keep the legacy dependency field populated for existing callers/tests;
    // all post notifications use the transport-neutral port above.
    this.deps.iframeMessageService = this.deps.notificationPort;
    this.deps.hashtagPinStore = deps.hashtagPinStore || hashtagPinStore;
    this.deps.saveHashtagsToHistoryFn = deps.saveHashtagsToHistoryFn || saveHashtagsToHistory;
    this.deps.clearReplyQuoteFn = deps.clearReplyQuoteFn || clearReplyQuote;
    this.deps.saveSensitivePayloadFn = deps.saveSensitivePayloadFn
      || ((input) => sensitivePayloadRepository.putCandidate(input));
  }

  setRxNostr(rxNostr: RxNostr) {
    if (this.eventSender) {
      this.cancelActiveNip65Operations();
    }
    this.rxNostr = rxNostr;
    this.eventSender = new PostEventSender(rxNostr, this.deps.console || console);
  }

  cancelActiveNip65Operations(): void {
    this.operationGeneration += 1;
    for (const operation of this.activeNip65Operations) {
      operation.cancel();
    }
    this.activeNip65Operations.clear();
  }

  private clearReplyQuoteAfterSuccess(): void {
    this.deps.clearReplyQuoteFn?.();
  }

  private getReplyQuoteNotifyOptions(): ReplyQuoteNotifyOptions | undefined {
    const rqState = this.deps.replyQuoteState!.value;
    const quotedEventIds = Array.from(
      new Set(rqState.quotes.map((quote) => quote.eventId)),
    );

    if (!rqState.reply && quotedEventIds.length === 0) {
      return undefined;
    }

    return {
      ...(rqState.reply ? { replyToEventId: rqState.reply.eventId } : {}),
      ...(quotedEventIds.length > 0 ? { quotedEventIds } : {}),
    };
  }

  private getReplyQuoteIdentity(): string {
    const state = this.deps.replyQuoteState!.value;
    return JSON.stringify({
      reply: state.reply?.eventId ?? null,
      quotes: state.quotes.map((quote) => quote.eventId),
    });
  }

  private notifyPostFailure(error: string): PostResult {
    this.deps.notificationPort?.notifyPostError(error);
    return { success: false, error };
  }

  private handleSubmissionError(logMessage: string): PostResult {
    this.deps.console?.error(logMessage, {
      stage: 'submission',
      reason: 'unexpected',
    });
    return this.notifyPostFailure('post_error');
  }

  private async buildSubmissionEvent(params: {
    processedContent: string;
    hashtags: string[];
    tags: string[][];
    pubkey: string;
    imageImetaMap?: ImageImetaMetadataMap;
    contentWarningEnabled: boolean;
    contentWarningReason: string;
    failClosedContentWarning: boolean;
    publicationKind: number;
    replyQuoteTags?: string[][];
    channelContext?: import("./types").ChannelContextState | null;
    emojiTags?: string[][];
  }): Promise<PostEventTemplate & { pubkey: string }> {
    const event = await PostEventBuilder.buildEvent(
      params.processedContent,
      params.hashtags,
      params.tags,
      params.pubkey,
      params.imageImetaMap,
      this.deps.createImetaTagFn,
      this.deps.getClientTagFn,
      params.contentWarningEnabled,
      params.contentWarningReason,
      params.replyQuoteTags,
      params.channelContext,
      params.emojiTags,
      params.failClosedContentWarning,
      params.publicationKind,
    );
    return { ...event, pubkey: params.pubkey };
  }

  private async buildNip22ReplyTags(
    parent: import("./types").NostrEvent,
    parentRelayHint: string,
  ): Promise<string[][] | null> {
    return buildNip22ReplyTags(parent, parentRelayHint);
  }

  private finalizeSubmittedPost(
    result: PostResult,
    hashtags: string[],
    rqNotifyOptions?: ReplyQuoteNotifyOptions,
    clearReplyQuote = true,
  ): PostResult {
    if (result.success) {
      void Promise.resolve(this.deps.saveHashtagsToHistoryFn?.(hashtags)).catch(() => {
        this.deps.console?.warn?.("hashtag_history_save_failed", {
          stage: 'post-success',
          reason: 'unexpected',
        });
      });
      if (clearReplyQuote) this.clearReplyQuoteAfterSuccess();
      this.deps.notificationPort?.notifyPostSuccess({
        ...rqNotifyOptions,
        ...(result.eventId ? { eventId: result.eventId } : {}),
      });
      return result;
    }

    this.deps.notificationPort?.notifyPostError(result.error);
    return result;
  }

  private async saveSubmittedPostHistory(params: {
    event: NostrEvent;
    attestation: PostHistoryRawEventAttestation;
    result: PostResult;
    additionalWriteRelays?: string[];
    writeRelayHintSnapshot: string[];
  }): Promise<void> {
    if (!params.result.success || !this.deps.savePostHistoryFn) return;

    const acceptedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
      params.result.acceptedRelays,
    );
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
      ...acceptedRelays,
      ...(params.additionalWriteRelays ?? []),
      ...params.writeRelayHintSnapshot,
    ], { limit: 3 });

    try {
      await this.deps.savePostHistoryFn({
        event: params.event,
        attestation: params.attestation,
        acceptedRelays,
        relayHints,
      });
    } catch {
      this.deps.console?.warn?.("post_history_save_failed", {
        stage: 'post-history',
        reason: 'unexpected',
      });
    }
  }

  private async publishNip65Event(params: {
    event: NostrEvent;
    sensitive?: {
      structureTemplate: PostEventTemplate & { pubkey: string };
      payloadAttestation: PostHistoryRawEventAttestation;
      signStructure(hint: string): Promise<NostrEvent>;
    };
    sessionPubkey: string;
    additionalWriteRelays?: string[];
    discoveryRelaysByRecipient?: Record<string, string[]>;
  }): Promise<PostResult> {
    const sender = this.eventSender;
    const rxNostr = this.rxNostr;
    if (!sender || !rxNostr) return { success: false, error: "nostr_not_ready" };

    const authStateStore = this.deps.authStateStore!;
    const capturedAuthState = authStateStore.value;
    const capturedGeneration = this.operationGeneration;
    const operationStartedAt = Date.now();
    const discoveryDeadline = operationStartedAt + NIP65_DISCOVERY_BUDGET_MS;
    const deadlineAt = operationStartedAt + 12_000;
    const authDeadlineAt = operationStartedAt + NIP65_POST_OPERATION_DEADLINE_MS;
    const defaultWriteRelays = sender.getDefaultWriteRelays();
    if (isHostRelayConfigActive() && defaultWriteRelays.length === 0) {
      return {
        success: false,
        fullyDelivered: false,
        error: "no_write_relays",
        acceptedRelays: [],
        delivery: {
          authorWrite: createDeliveryClassResult([], new Map(), true),
          taggedUserRead: {},
          additional: [],
        },
      };
    }
    const additionalRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
      params.additionalWriteRelays,
    );
    const recipientPubkeys = Array.from(new Set<string>(
      (params.sensitive?.structureTemplate.tags ?? params.event.tags ?? []).flatMap((tag: unknown) => {
        if (!Array.isArray(tag) || tag[0] !== "p") return [];
        const pubkey = tag[1];
        return typeof pubkey === "string" && /^[0-9a-f]{64}$/i.test(pubkey) ? [pubkey] : [];
      }),
    ));
    const rolesByRelay = new Map<string, Nip65RelayRoles>();
    const recipientRelays = new Map<string, Set<string>>();
    const recipientRouteStatus = new Map<string, "found" | "unavailable" | "cancelled">();
    const outcomes = new Map<string, Nip65RelayOutcome>();
    const payloadOutcomes = new Map<string, Nip65RelayOutcome>();
    const structureLaunched = new Set<string>();
    const payloadCached = new Set<string>();
    let cacheWrites = Promise.resolve();
    let structurePromise: Promise<NostrEvent | null> | undefined;
    let structureHint: string | undefined;
    let structureEvent: NostrEvent | undefined;
    let structureSigningFailed = false;
    const launchedRelays = new Set<string>();
    const wavePromises: Promise<void>[] = [];
    let acceptsDiscovery = true;
    let operationActive = true;
    let cancelled = false;
    let lastError: string | undefined;
    let resultFinalized = false;
    let successTimer: ReturnType<typeof setTimeout> | undefined;
    const successSettlement = new AbortController();
    let resolveCancellation!: () => void;
    const cancellation = new Promise<void>((resolve) => {
      resolveCancellation = resolve;
    });
    let resolveCutoff!: () => void;
    const cutoff = new Promise<void>((resolve) => { resolveCutoff = resolve; });
    const closeSends = () => {
      operationActive = false;
      acceptsDiscovery = false;
      // ACK progress is already recorded. Close transport and project unresolved targets.
      successSettlement.abort();
      for (const relay of launchedRelays) {
        const outcome = outcomes.get(relay);
        if (!outcome?.accepted && !outcome?.rejected) {
          outcomes.set(relay, { ...outcome, unconfirmed: true, ...(!cancelled ? { timedOut: true as const } : {}) });
        }
      }
      resultFinalized = true;
      resolveCutoff();
    };
    const hardTimer = setTimeout(closeSends, Math.max(1, authDeadlineAt - Date.now()));

    const operation: ActiveNip65Operation = {
      cancel: () => {
        if (!operationActive) return;
        operationActive = false;
        cancelled = true;
        acceptsDiscovery = false;
        resolveCancellation();
      },
    };
    this.activeNip65Operations.add(operation);

    const isCurrent = (): boolean => {
      if (!operationActive || resultFinalized || structureSigningFailed || Date.now() >= authDeadlineAt) return false;
      const currentAuth = authStateStore.value;
      if (
        capturedGeneration !== this.operationGeneration
        || this.rxNostr !== rxNostr || this.eventSender !== sender
        || currentAuth !== capturedAuthState
        || !currentAuth.isAuthenticated
        || currentAuth.pubkey !== params.sessionPubkey
      ) {
        operation.cancel();
        return false;
      }
      return true;
    };

    const getRoles = (relay: string): Nip65RelayRoles => {
      let roles = rolesByRelay.get(relay);
      if (!roles) {
        roles = createRelayRoles();
        rolesByRelay.set(relay, roles);
      }
      return roles;
    };

    defaultWriteRelays.forEach((relay) => { getRoles(relay).authorWrite = true; });
    additionalRelays.forEach((relay) => { getRoles(relay).additional = true; });

    const settleSuccessfulClasses = (): void => {
      const hasAck = (relays: Iterable<string>) => [...relays].some((relay) => outcomes.get(relay)?.accepted);
      const complete = (params.sensitive !== undefined || recipientPubkeys.length > 0)
        && hasAck(defaultWriteRelays)
        && recipientPubkeys.every((pubkey) => hasAck(recipientRelays.get(pubkey) ?? []))
        && (additionalRelays.length === 0 || hasAck(additionalRelays));
      if (!complete || !isCurrent()) {
        if (successTimer !== undefined) clearTimeout(successTimer);
        successTimer = undefined;
        return;
      }
      if (successTimer !== undefined || successSettlement.signal.aborted) return;
      successTimer = setTimeout(() => {
        successTimer = undefined;
        if (isCurrent()) closeSends();
      }, Math.min(PostEventSender.DEFAULT_SETTLE_TIMEOUTS.successMs, authDeadlineAt - Date.now()));
    };

    const applyWaveResult = (result: PostResult, targets: string[], final = true,
      ledger = outcomes): void => {
      if (resultFinalized) return;
      if (final && result.error) lastError = result.error;
      const accepted = new Set(RelayConfigUtils.sanitizeExternalRelayUrls(result.acceptedRelays));
      const rejected = new Map(
        (result.rejectedRelays ?? []).map((item) => [
          RelayConfigUtils.normalizeExternalRelayUrl(item.relay) ?? item.relay,
          item,
        ]),
      );
      const timedOut = new Set(RelayConfigUtils.sanitizeExternalRelayUrls(result.timedOutRelays));
      const authRequired = new Set(RelayConfigUtils.sanitizeExternalRelayUrls(result.authRequiredRelays));

      for (const relay of targets) {
        if (ledger.get(relay)?.accepted) continue;
        if (accepted.has(relay)) {
          ledger.set(relay, { accepted: true });
        } else if (rejected.has(relay)) {
          ledger.set(relay, {
            rejected: { ...rejected.get(relay)!, relay },
            ...(authRequired.has(relay) ? { authRequired: true } : {}),
          });
        } else if (timedOut.has(relay)) {
          ledger.set(relay, {
            timedOut: true,
            unconfirmed: true,
            ...(authRequired.has(relay) ? { authRequired: true } : {}),
          });
        } else {
          ledger.set(relay, {
            unconfirmed: true,
            ...(authRequired.has(relay) ? { authRequired: true } : {}),
          });
        }
      }
      if (ledger === payloadOutcomes) {
        for (const relay of targets) {
          const payload = payloadOutcomes.get(relay);
          if (!structureLaunched.has(relay)) {
            outcomes.set(relay, payload?.accepted ? { unconfirmed: true } : { ...payload });
          }
          if (payload?.accepted) queueStructure(relay);
        }
      }
      settleSuccessfulClasses();
    };

    const queueStructure = (relay: string): void => {
      const sensitive = params.sensitive;
      if (!sensitive || payloadCached.has(relay)) return;
      payloadCached.add(relay);
      // Freeze the hint on the first confirmed Payload ACK, including recipient ACKs.
      structureHint ??= relay;
      const acceptedRelays = [...payloadOutcomes].filter(([, value]) => value.accepted).map(([url]) => url);
      const ownCacheWrite = cacheWrites.then(async () => {
        try {
          await this.deps.saveSensitivePayloadFn?.({
            event: params.event, attestation: sensitive.payloadAttestation,
            acceptedRelays, relayHints: [...rolesByRelay.keys()],
          });
        } catch {
          this.deps.console?.warn?.("sensitive_payload_cache_save_failed", { stage: "payload-publish", reason: "storage" });
        }
      });
      cacheWrites = ownCacheWrite;
      // Reserve one shared signing promise before any asynchronous cache/signing work.
      structurePromise ??= ownCacheWrite.then(async () => {
        if (!isCurrent()) return null;
        try {
          const event = await sensitive.signStructure(structureHint!);
          if (!isCurrent()) return null;
          structureEvent = event;
          return event;
        } catch {
          structureSigningFailed = true;
          lastError = "post_error";
          return null;
        }
      });
      const job = (async () => {
        await ownCacheWrite;
        if (!isCurrent()) return;
        const event = await structurePromise;
        if (!event || !isCurrent() || structureLaunched.has(relay)) return;
        structureLaunched.add(relay);
        outcomes.set(relay, { unconfirmed: true });
        const result = await sender.sendEvent(event, {
          targetRelays: [relay], includeDefaultWriteRelays: false, waitForAllRelays: true,
          deadlineAt: Math.min(Date.now() + 12_000, authDeadlineAt), authDeadlineAt,
          settleSignal: successSettlement.signal,
          onProgress: (progress: PostResult) => applyWaveResult(progress, [relay], false),
        });
        applyWaveResult(result, [relay]);
      })().catch(() => { lastError = "post_network_error"; });
      wavePromises.push(job);
    };

    const launchPayloads = (relayUrls: string[]): void => {
      for (const relay of RelayConfigUtils.sanitizeExternalRelayUrls(relayUrls)) {
        if (!isCurrent() || launchedRelays.has(relay)) continue;
        launchedRelays.add(relay);
        const job = sender.sendEvent(params.event, {
          targetRelays: [relay], includeDefaultWriteRelays: false, waitForAllRelays: true,
          deadlineAt: Math.min(Date.now() + 12_000, authDeadlineAt), authDeadlineAt,
          settleSignal: successSettlement.signal,
          onProgress: (progress: PostResult) => applyWaveResult(progress, [relay], false, payloadOutcomes),
        }).then((result) => applyWaveResult(result, [relay], true, payloadOutcomes))
          .catch(() => applyWaveResult({ success: false, error: "post_network_error" }, [relay], true, payloadOutcomes));
        wavePromises.push(job);
      }
    };

    const launchAdditionalRelays = (relayUrls: string[]): void => {
      if (!isCurrent() || !acceptsDiscovery) return;
      if (params.sensitive) { launchPayloads(relayUrls); return; }
      const targets = RelayConfigUtils.sanitizeExternalRelayUrls(relayUrls)
        .filter((relay) => !launchedRelays.has(relay));
      if (targets.length === 0) return;
      targets.forEach((relay) => launchedRelays.add(relay));
      const wave = sender.sendEvent(params.event, {
        targetRelays: targets,
        includeDefaultWriteRelays: false,
        waitForAllRelays: true,
        deadlineAt,
        authDeadlineAt,
        settleSignal: successSettlement.signal,
        onProgress: (result: PostResult) => applyWaveResult(result, targets, false),
      }).then((result) => applyWaveResult(result, targets))
        .catch(() => {
          lastError = "post_network_error";
          for (const relay of targets) {
            if (!outcomes.has(relay)) outcomes.set(relay, { unconfirmed: true });
          }
        });
      wavePromises.push(wave);
    };

    try {
      const initialTargets = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...defaultWriteRelays,
        ...additionalRelays,
      ]);
      if (params.sensitive) {
        if (initialTargets.length === 0) lastError = "no_write_relays";
        launchPayloads(initialTargets);
      } else {
        initialTargets.forEach((relay) => launchedRelays.add(relay));
        const initialWave = sender.sendEvent(params.event, {
          targetRelays: additionalRelays,
          includeDefaultWriteRelays: true,
          waitForAllRelays: recipientPubkeys.length > 0,
          deadlineAt,
          authDeadlineAt,
          settleSignal: successSettlement.signal,
          onProgress: (result: PostResult) => applyWaveResult(result, initialTargets, false),
        }).then((result) => applyWaveResult(result, initialTargets))
          .catch(() => {
            lastError = "post_network_error";
            for (const relay of initialTargets) {
              if (!outcomes.has(relay)) outcomes.set(relay, { unconfirmed: true });
            }
          });
        wavePromises.push(initialWave);
      }

      const lookups = recipientPubkeys.map(async (pubkey) => {
        try {
          const entry: Pick<Nip65RelayDirectoryEntry, "readRelays"> = this.deps.nip65ReadRelayLookupFn
            ? await this.deps.nip65ReadRelayLookupFn(pubkey, {
              discoveryRelays: params.discoveryRelaysByRecipient?.[pubkey],
              deadlineAt: discoveryDeadline,
              resolveOnReadRoute: true,
            })
            : await getNip65RelayDirectory(rxNostr).lookup(pubkey, {
              discoveryRelays: params.discoveryRelaysByRecipient?.[pubkey],
              deadlineAt: discoveryDeadline,
              resolveOnReadRoute: true,
            });
          if (!acceptsDiscovery || !isCurrent()) return;
          const relays = RelayConfigUtils.sanitizeExternalRelayUrls(entry.readRelays);
          recipientRelays.set(pubkey, new Set(relays));
          recipientRouteStatus.set(pubkey, relays.length > 0 ? "found" : "unavailable");
          relays.forEach((relay) => getRoles(relay).recipients.add(pubkey));
          launchAdditionalRelays(relays);
          settleSuccessfulClasses();
        } catch {
          if (acceptsDiscovery && isCurrent()) {
            recipientRelays.set(pubkey, new Set());
            recipientRouteStatus.set(pubkey, "unavailable");
          }
        }
      });

      let discoveryTimer: ReturnType<typeof setTimeout> | undefined;
      if (lookups.length > 0) {
        await Promise.race([
          Promise.all(lookups),
          cancellation,
          cutoff,
          new Promise<void>((resolve) => {
            discoveryTimer = setTimeout(resolve, Math.max(1, discoveryDeadline - Date.now()));
          }),
        ]);
      }
      if (discoveryTimer !== undefined) clearTimeout(discoveryTimer);
      acceptsDiscovery = false;
      for (const pubkey of recipientPubkeys) {
        if (!recipientRouteStatus.has(pubkey)) {
          recipientRelays.set(pubkey, new Set());
          recipientRouteStatus.set(pubkey, cancelled ? "cancelled" : "unavailable");
        }
      }

      const drainJobs = async () => {
        let drained = 0;
        while (drained < wavePromises.length) {
          const batch = wavePromises.slice(drained);
          drained = wavePromises.length;
          await Promise.all(batch);
        }
      };
      await Promise.race([drainJobs(), cutoff]);
      // Stop launch/ACK mutation before waiting for persistence outside the network cap.
      closeSends();
      await cacheWrites;

      const toClass = (
        relays: string[],
        unavailable = false,
        wasCancelled = false,
      ) => createDeliveryClassResult(relays, outcomes, unavailable,
        wasCancelled || (params.sensitive !== undefined && cancelled));
      const authorWrite = toClass(
        defaultWriteRelays,
        defaultWriteRelays.length === 0,
      );
      const taggedUserRead: Record<string, PostDeliveryClassResult> = Object.fromEntries(recipientPubkeys.map((pubkey) => {
        const relays = [...(recipientRelays.get(pubkey) ?? [])];
        const routeStatus = recipientRouteStatus.get(pubkey);
        return [pubkey, toClass(
          relays,
          routeStatus === "unavailable",
          routeStatus === "cancelled",
        )];
      }));
      const additional: PostDeliveryClassResult[] = additionalRelays.length > 0
        ? [toClass(additionalRelays)]
        : [];
      const delivery: PostDeliverySummary = { authorWrite, taggedUserRead, additional };
      const acceptedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        [...outcomes.entries()]
          .filter(([, outcome]) => outcome.accepted)
          .map(([relay]) => relay),
      );
      const rejectedRelays = [...outcomes.values()]
        .flatMap((outcome) => outcome.rejected ? [outcome.rejected] : []);
      const timedOutRelays = [...outcomes.entries()]
        .filter(([, outcome]) => outcome.timedOut)
        .map(([relay]) => relay);
      const authRequiredRelays = [...outcomes.entries()]
        .filter(([, outcome]) => outcome.authRequired)
        .map(([relay]) => relay);
      const success = acceptedRelays.length > 0;
      const fullyDelivered = authorWrite.acceptedRelays.length > 0
        && Object.values(taggedUserRead).every((result) => result.acceptedRelays.length > 0)
        && additional.every((result) => result.acceptedRelays.length > 0);
      const hasUnconfirmed = timedOutRelays.length > 0
        || [...outcomes.values()].some((outcome) => outcome.unconfirmed);
      const error = success
        ? undefined
        : params.sensitive && [...payloadOutcomes.values()].some((outcome) => outcome.accepted)
          ? "postComponent.error.sensitive_partial_publish"
        : lastError
          ?? (hasUnconfirmed ? "post_timeout" : "post_rejected");

      return {
        success,
        fullyDelivered,
        ...(error ? { error } : {}),
        ...(success ? { eventId: structureEvent?.id ?? params.event.id } : {}),
        acceptedRelays,
        ...(rejectedRelays.length ? { rejectedRelays } : {}),
        ...(timedOutRelays.length ? { timedOutRelays } : {}),
        ...(authRequiredRelays.length ? { authRequiredRelays } : {}),
        delivery,
      };
    } finally {
      resultFinalized = true;
      clearTimeout(hardTimer);
      if (successTimer !== undefined) clearTimeout(successTimer);
      operation.cancel();
      this.activeNip65Operations.delete(operation);
    }
  }

  private async sendPreparedEvent(params: {
    event: PostEventTemplate & { pubkey: string };
    sessionPubkey: string;
    hashtags: string[];
    rqNotifyOptions?: ReplyQuoteNotifyOptions;
    signer?: PostManagerSigner;
    additionalWriteRelays?: string[];
    discoveryRelaysByRecipient?: Record<string, string[]>;
    signEvent?: (event: EventTemplate) => Promise<unknown>;
    logSignedEvent?: boolean;
    splitSensitiveContent: boolean;
    writeRelaySnapshot: string[];
    writeRelayHintSnapshot: string[];
    replyQuoteIdentity: string;
  }): Promise<PostResult> {
    this.deps.console?.debug?.('[PostManager] sendPreparedEvent start', {
      eventKind: params.event?.kind,
    });

    const sender = this.eventSender;
    const rxNostr = this.rxNostr;
    const capturedAuth = this.deps.authStateStore!.value;
    const generation = this.operationGeneration;
    const signEvent = params.signEvent
      ?? (typeof params.signer?.signEvent === "function"
        ? params.signer.signEvent.bind(params.signer) : undefined);
    if (params.signer && !signEvent) return this.notifyPostFailure("nostr_sign_event_not_supported");
    const isSessionActive = () => {
      const auth = this.deps.authStateStore!.value;
      return auth === capturedAuth && auth.isAuthenticated && auth.pubkey === params.sessionPubkey
        && this.rxNostr === rxNostr && this.eventSender === sender
        && this.operationGeneration === generation;
    };
    const signTemplate = async (template: PostEventTemplate & { pubkey: string }) => {
      assertActiveSession(this.deps.authStateStore!, params.sessionPubkey);
      if (!isSessionActive()) throw new Error("post_event_runtime_changed");
      if (params.signer && !signEvent) throw new Error("nostr_sign_event_not_supported");
      const prepared = prepareSignedEventTemplate(template);
      const signed = signEvent ? await signEvent(prepared.signerTemplate) : template;
      if (!isSessionActive()) throw new Error("post_event_session_changed");
      const event = validateSignedEventResult(prepared.expectedTemplate, signed, params.sessionPubkey);
      const attested = attestFullyVerifiedPostHistoryRawEvent(event);
      if (!attested) throw new Error("post_error");
      return attested;
    };
    const usePayload = params.splitSensitiveContent
      && params.event.tags.some((tag) => tag[0] === "content-warning");
    let published: ReturnType<typeof attestFullyVerifiedPostHistoryRawEvent> = null;
    let signed: NonNullable<ReturnType<typeof attestFullyVerifiedPostHistoryRawEvent>>;
    try {
      signed = await signTemplate(usePayload
        ? buildSensitivePayloadEvent(params.event.kind as SensitiveContentStructureKind,
          params.event.content, params.sessionPubkey, params.event.created_at)
        : params.event);
    } catch {
      return this.notifyPostFailure("post_error");
    }
    if (!usePayload) published = signed;
    const result = await this.publishNip65Event({
      event: signed.event,
      sessionPubkey: params.sessionPubkey,
      additionalWriteRelays: params.additionalWriteRelays,
      discoveryRelaysByRecipient: params.discoveryRelaysByRecipient,
      ...(usePayload ? { sensitive: {
        structureTemplate: params.event,
        payloadAttestation: signed.attestation,
        signStructure: async (hint: string) => {
          const attested = await signTemplate(buildSensitiveStructureEvent(params.event, signed.event.id, hint));
          published = attested;
          return attested.event;
        },
      } } : {}),
    });
    if (result.error === "postComponent.error.sensitive_partial_publish") {
      this.deps.notificationPort?.notifyPostError({ code: "sensitive_partial_publish" });
      return result;
    }
    const structure = published as ReturnType<typeof attestFullyVerifiedPostHistoryRawEvent>;
    const resultWithEvent: PostResult = result.success && structure
      ? { ...result, eventId: structure.event.id, event: structure.event } : result;
    if (structure) await this.saveSubmittedPostHistory({
      event: structure.event, attestation: structure.attestation, result: resultWithEvent,
      additionalWriteRelays: params.additionalWriteRelays,
      writeRelayHintSnapshot: params.writeRelayHintSnapshot,
    });
    const preserveComposerContent = !isSessionActive();
    return this.finalizeSubmittedPost(
      preserveComposerContent ? { ...resultWithEvent, preserveComposerContent: true } : resultWithEvent,
      params.hashtags, params.rqNotifyOptions,
      !preserveComposerContent && this.getReplyQuoteIdentity() === params.replyQuoteIdentity,
    );
  }

  // 外部APIは変更なし（後方互換性のため）
  validatePost(content: string): { valid: boolean; error?: string } {
    const authStateStore = this.deps.authStateStore!;
    return PostValidator.validatePost(
      content,
      authStateStore.value.isAuthenticated,
      !!this.rxNostr
    );
  }

  async submitPost(
    content: string,
    imageImetaMap?: ImageImetaMetadataMap,
    emojiTags: string[][] = [],
  ): Promise<PostResult> {
    // 末尾のメディアURL直後の改行を削除
    let processedContent = trimTrailingNewlineAfterMedia(content);
    const quoteNotificationEnabled = this.deps.settingsStore!.quoteNotificationEnabled;

    // インラインのnostr: URIから引用タグを抽出（ストアベースのURI追加前に実行）
    const inlineQuoteTags = this.deps.replyQuoteService?.extractInlineQuoteTags?.(
      processedContent,
      quoteNotificationEnabled,
    )
      ?? new ReplyQuoteService().extractInlineQuoteTags(
        processedContent,
        quoteNotificationEnabled,
      );

    // ストア由来の引用がある場合、文末にnostr: URIを追加
    const rqStateForUri = this.deps.replyQuoteState!.value;
    if (rqStateForUri.quotes.length > 0) {
      const rqService = this.deps.replyQuoteService || new ReplyQuoteService();
      const existingInlineQuoteEventIds = new Set(
        inlineQuoteTags.filter((tag) => tag[0] === 'q').map((tag) => tag[1]),
      );
      const quoteUris = rqStateForUri.quotes
        .filter((quote) => !existingInlineQuoteEventIds.has(quote.eventId))
        .map((quote) =>
          rqService.generateNostrUri(
            quote.eventId,
            quote.relayHints,
            quote.authorPubkey,
          ),
        );

      if (quoteUris.length > 0) {
        processedContent = `${processedContent.trimEnd()}\n${quoteUris.join('\n')}`.trim();
      }
    }

    const validation = this.validatePost(processedContent);
    if (!validation.valid) {
      return this.notifyPostFailure(validation.error!);
    }

    if (!this.eventSender) {
      return this.notifyPostFailure("nostr_not_ready");
    }

    if (
      isHostRelayConfigActive()
      && RelayConfigUtils.sanitizeExternalRelayUrls(
        this.deps.writeRelaysStore?.value,
      ).length === 0
    ) {
      return this.notifyPostFailure("no_write_relays");
    }

    try {
      // 依存性から認証状態とストアを取得
      const authStateStore = this.deps.authStateStore!;
      const sessionPubkey = captureActiveSessionPubkey(authStateStore);
      const hashtagStore = this.deps.hashtagStore!;
      const { hashtags, tags } = this.getHashtagArrays(hashtagStore);
      const keyMgr = this.deps.keyManager!;
      const windowObj = this.deps.window || (typeof window !== 'undefined' ? window : undefined);

      // Content Warning状態を取得
      const contentWarningEnabled = this.deps.contentWarningStore!.value;
      const contentWarningReason = this.deps.contentWarningReasonStore!.value;
      const failClosedContentWarning = this.deps.settingsStore!.failClosedContentWarning === true;
      const channelContext = this.deps.channelContextState?.value ?? null;
      const additionalWriteRelays = channelContext?.channelRelays;
      const writeRelaySnapshot = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...Object.values(this.rxNostr!.getDefaultRelays())
          .filter((relay) => relay.write)
          .map((relay) => relay.url),
        ...(this.deps.writeRelaysStore?.value ?? []),
        ...(additionalWriteRelays ?? []),
      ]);
      const writeRelayHintSnapshot = RelayConfigUtils.sanitizeExternalRelayUrls(
        this.deps.writeRelaysStore?.value ?? [],
      );

      // リプライ/引用タグを構築
      const rqState = this.deps.replyQuoteState!.value;
      let replyQuoteTags: string[][] | undefined;
      const rqNotifyOptions = this.getReplyQuoteNotifyOptions();
      const replyEvent = rqState.reply?.referencedEvent ?? null;
      if (
        rqState.reply
        && !channelContext
        && (!replyEvent
          || replyEvent.id !== rqState.reply.eventId
          || ![1, 1111].includes(replyEvent.kind)
          || (rqState.reply.authorPubkey && replyEvent.pubkey !== rqState.reply.authorPubkey))
      ) {
        return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
      }
      const publicationKind = resolveSubmissionKind({
        channel: !!channelContext,
        hasReply: !!rqState.reply,
        ...(replyEvent ? { replyKind: replyEvent.kind } : {}),
      });
      if (publicationKind === null) {
        return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
      }
      if (rqState.reply || rqState.quotes.length > 0) {
        const rqService = this.deps.replyQuoteService || new ReplyQuoteService();
        replyQuoteTags = [];

        if (rqState.reply) {
          if (channelContext) {
            replyQuoteTags.push([
              'e',
              rqState.reply.eventId,
              rqState.reply.relayHints[0] || '',
              'reply',
              ...(rqState.reply.authorPubkey ? [rqState.reply.authorPubkey] : []),
            ]);

            rqService
              .buildReplyTags(rqState.reply)
              .filter((tag) => tag[0] === 'p')
              .forEach((tag) => {
                replyQuoteTags!.push(tag);
              });
          } else if (
            publicationKind === 1111
          ) {
            const nip22ReplyTags = replyEvent
              ? await this.buildNip22ReplyTags(
                replyEvent,
                rqState.reply.relayHints[0] ?? "",
              )
              : null;
            if (!nip22ReplyTags) {
              return this.notifyPostFailure("postComponent.error.reply_target_event_unavailable");
            }
            replyQuoteTags.push(...nip22ReplyTags);
            if (publicationKind === 1111) {
              const existingAuthors = new Set(
                replyQuoteTags.filter((tag) => tag[0] === "p").map((tag) => tag[1]),
              );
              rqService.buildReplyTags(rqState.reply)
                .filter((tag) => tag[0] === "p")
                .forEach((tag) => {
                  if (existingAuthors.has(tag[1])) return;
                  existingAuthors.add(tag[1]);
                  replyQuoteTags!.push(tag);
                });
            }
          } else {
            replyQuoteTags.push(...rqService.buildReplyTags(rqState.reply));
          }
        }

        const existingQuoteEventIds = new Set<string>();
        const existingPPubkeys = new Set(
          replyQuoteTags.filter((tag) => tag[0] === 'p').map((tag) => tag[1]),
        );

        rqState.quotes.forEach((quote) => {
          rqService.buildQuoteTags(quote, quote.quoteNotificationEnabled).forEach((tag) => {
            if (tag[0] === 'q') {
              if (existingQuoteEventIds.has(tag[1])) {
                return;
              }
              existingQuoteEventIds.add(tag[1]);
            }

            if (tag[0] === 'p') {
              if (existingPPubkeys.has(tag[1])) {
                return;
              }
              existingPPubkeys.add(tag[1]);
            }

            replyQuoteTags!.push(tag);
          });
        });
      }

      // Contextual discovery hints are kept attached to the exact referenced
      // author that produced each p-tag. Never infer a target from unrelated tags.
      const discoveryRelaysByRecipient: Record<string, string[]> = {};
      const addContextForTaggedAuthor = (
        authorPubkey: string | null,
        relayHints: string[],
        associatedTags: string[][],
      ) => {
        if (
          !authorPubkey
          || !associatedTags.some((tag) => tag[0] === 'p' && tag[1] === authorPubkey)
        ) {
          return;
        }
        discoveryRelaysByRecipient[authorPubkey] = RelayConfigUtils.sanitizeExternalRelayUrls([
          ...(discoveryRelaysByRecipient[authorPubkey] ?? []),
          ...relayHints,
        ]);
      };
      const rqServiceForDiscovery = this.deps.replyQuoteService || new ReplyQuoteService();
      if (rqState.reply) {
        addContextForTaggedAuthor(
          rqState.reply.authorPubkey,
          rqState.reply.relayHints,
          rqServiceForDiscovery.buildReplyTags(rqState.reply),
        );
      }
      for (const quote of rqState.quotes) {
        if (quote.quoteNotificationEnabled) {
          addContextForTaggedAuthor(
            quote.authorPubkey,
            quote.relayHints,
            rqServiceForDiscovery.buildQuoteTags(quote, true),
          );
        }
      }

      // インライン引用タグをマージ（重複排除）
      if (inlineQuoteTags.length > 0) {
        if (!replyQuoteTags) {
          replyQuoteTags = [];
        }
        const existingQEventIds = new Set(
          replyQuoteTags.filter(t => t[0] === 'q').map(t => t[1])
        );
        const existingPPubkeys = new Set(
          replyQuoteTags.filter(t => t[0] === 'p').map(t => t[1])
        );
        for (const tag of inlineQuoteTags) {
          if (tag[0] === 'q' && !existingQEventIds.has(tag[1])) {
            replyQuoteTags.push(tag);
            existingQEventIds.add(tag[1]);
          } else if (tag[0] === 'p' && !existingPPubkeys.has(tag[1])) {
            replyQuoteTags.push(tag);
            existingPPubkeys.add(tag[1]);
          }
        }
      }

      const auth = authStateStore.value;
      const isExtensionAuth = auth.type === 'nip07';

      // 拡張機能認証（NIP-07）の場合はwindow.nostrを使用
      if (isExtensionAuth && keyMgr.isWindowNostrAvailable() && windowObj?.nostr) {
        try {
          const pubkey = auth.pubkey;
          if (!pubkey) {
            return this.notifyPostFailure('pubkey_not_found');
          }

          const signEvent = typeof windowObj.nostr.signEvent === 'function'
            ? windowObj.nostr.signEvent.bind(windowObj.nostr)
            : undefined;

          if (!signEvent) {
            return this.notifyPostFailure('nostr_sign_event_not_supported');
          }

          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            failClosedContentWarning,
            publicationKind,
            replyQuoteTags,
            channelContext,
            emojiTags,
          });

          return await this.sendPreparedEvent({
            event,
            sessionPubkey,
            hashtags,
            rqNotifyOptions,
            signEvent,
            logSignedEvent: true,
            additionalWriteRelays,
            discoveryRelaysByRecipient,
            splitSensitiveContent: failClosedContentWarning,
            writeRelaySnapshot,
            writeRelayHintSnapshot,
            replyQuoteIdentity: JSON.stringify({ reply: rqState.reply?.eventId ?? null, quotes: rqState.quotes.map((quote) => quote.eventId) }),
          });
        } catch (err) {
          return this.handleSubmissionError('window.nostrでの投稿エラー:');
        }
      }

      // NIP-46リモートサイナーの場合
      if (auth.type === 'nip46') {
        try {
          const pubkey = auth.pubkey;
          if (!pubkey) {
            return this.notifyPostFailure('pubkey_not_found');
          }

          const nip46Signer = await this.deps.getNip46SignerForSessionFn?.(pubkey);
          const currentAuth = this.deps.authStateStore!.value;
          if (
            !nip46Signer
            || !currentAuth.isAuthenticated
            || currentAuth.type !== 'nip46'
            || currentAuth.pubkey !== pubkey
          ) {
            return this.notifyPostFailure('nip46_signer_not_available');
          }

          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            failClosedContentWarning,
            publicationKind,
            replyQuoteTags,
            channelContext,
            emojiTags,
          });

          return await this.sendPreparedEvent({
            event,
            sessionPubkey,
            hashtags,
            rqNotifyOptions,
            signer: nip46Signer,
            additionalWriteRelays,
            discoveryRelaysByRecipient,
            splitSensitiveContent: failClosedContentWarning,
            writeRelaySnapshot,
            writeRelayHintSnapshot,
            replyQuoteIdentity: JSON.stringify({ reply: rqState.reply?.eventId ?? null, quotes: rqState.quotes.map((quote) => quote.eventId) }),
          });
        } catch (err) {
          return this.handleSubmissionError('NIP-46での投稿エラー:');
        }
      }

      // 親クライアント連携の場合
      if (auth.type === 'parentClient') {
        const parentClientSigner = this.deps.getParentClientSignerFn?.();
        if (!parentClientSigner) {
          return this.notifyPostFailure('parent_client_signer_not_available');
        }

        const pubkey = auth.pubkey;
        if (!pubkey) {
          return this.notifyPostFailure('pubkey_not_found');
        }

        try {
          const event = await this.buildSubmissionEvent({
            processedContent,
            hashtags,
            tags,
            pubkey,
            imageImetaMap,
            contentWarningEnabled,
            contentWarningReason,
            failClosedContentWarning,
            publicationKind,
            replyQuoteTags,
            channelContext,
            emojiTags,
          });

          return await this.sendPreparedEvent({
            event,
            sessionPubkey,
            hashtags,
            rqNotifyOptions,
            signer: parentClientSigner,
            additionalWriteRelays,
            discoveryRelaysByRecipient,
            splitSensitiveContent: failClosedContentWarning,
            writeRelaySnapshot,
            writeRelayHintSnapshot,
            replyQuoteIdentity: JSON.stringify({ reply: rqState.reply?.eventId ?? null, quotes: rqState.quotes.map((quote) => quote.eventId) }),
          });
        } catch (err) {
          return this.handleSubmissionError('親クライアント連携での投稿エラー:');
        }
      }

      // ローカルキーを使用（秘密鍵直入れの場合）
      const storedKey = keyMgr.getFromStore() || keyMgr.loadFromStorage(auth.pubkey);
      if (!storedKey) {
        return this.notifyPostFailure('key_not_found');
      }

      const event = await this.buildSubmissionEvent({
        processedContent,
        hashtags,
        tags,
        pubkey: sessionPubkey,
        imageImetaMap,
        contentWarningEnabled,
        contentWarningReason,
        failClosedContentWarning,
        publicationKind,
        replyQuoteTags,
        channelContext,
        emojiTags,
      });

      const signer = this.deps.seckeySignerFn
        ? this.deps.seckeySignerFn(storedKey)
        : seckeySigner(storedKey);
      return await this.sendPreparedEvent({
        event,
        sessionPubkey,
        hashtags,
        rqNotifyOptions,
        signer,
        additionalWriteRelays,
        discoveryRelaysByRecipient,
        splitSensitiveContent: failClosedContentWarning,
        writeRelaySnapshot,
        writeRelayHintSnapshot,
        replyQuoteIdentity: JSON.stringify({ reply: rqState.reply?.eventId ?? null, quotes: rqState.quotes.map((quote) => quote.eventId) }),
      });

    } catch (err) {
      return this.handleSubmissionError('投稿エラー:');
    }
  }

  // テスト用の内部コンポーネントへのアクセス
  getEventSender(): PostEventSender | null {
    return this.eventSender;
  }

  private getHashtagArrays(store?: HashtagStore): { hashtags: string[]; tags: string[][] } {
    const resolvedStore = store || this.deps.hashtagStore!;

    const snapshotFn = this.deps.hashtagSnapshotFn;
    if (snapshotFn) {
      const snapshot = snapshotFn(resolvedStore);
      return {
        hashtags: Array.isArray(snapshot?.hashtags) ? [...snapshot.hashtags] : [],
        tags: Array.isArray(snapshot?.tags) ? snapshot.tags.map((tag) => [...tag]) : []
      };
    }

    if (resolvedStore === hashtagDataStore) {
      try {
        const snapshot = getHashtagDataSnapshot();
        return {
          hashtags: Array.isArray(snapshot?.hashtags) ? [...snapshot.hashtags] : [],
          tags: Array.isArray(snapshot?.tags) ? snapshot.tags.map((tag) => [...tag]) : []
        };
      } catch (error) {
        this.deps.console?.warn("hashtag_snapshot_failed", error);
      }
    }

    return {
      hashtags: Array.isArray(resolvedStore?.hashtags) ? [...resolvedStore.hashtags] : [],
      tags: Array.isArray(resolvedStore?.tags) ? resolvedStore.tags.map((tag) => [...tag]) : []
    };
  }

  // --- PostComponent 統合メソッド ---
  preparePostPayload(editor: TipTapEditor): ExtractedPostContent {
    const extraction = this.deps.extractContentWithEmojiTagsFn!(editor);
    if (!this.deps.mediaFreePlacementStore!.value) {
      // ギャラリーモード: エディタのテキスト + ギャラリーのメディアURL
      const galleryUrls = this.deps.mediaGalleryStore!.getContentUrls();
      if (galleryUrls.length > 0) {
        const textPart = extraction.content.trim();
        return {
          content: textPart ? textPart + '\n' + galleryUrls.join('\n') : galleryUrls.join('\n'),
          emojiTags: extraction.emojiTags,
        };
      }
    }
    return extraction;
  }

  preparePostContent(editor: TipTapEditor): string {
    return this.preparePostPayload(editor).content;
  }

  prepareImageBlurhashMap(editor: TipTapEditor, imageOxMap: Record<string, string>, imageXMap: Record<string, string>): ImageImetaMetadataMap {
    if (!this.deps.mediaFreePlacementStore!.value) {
      // ギャラリーモード: ギャラリーのメタデータを使用
      return this.deps.mediaGalleryStore!.getImageBlurhashMap();
    }

    const imageAttributeMap: Record<string, {
      dim?: string;
      alt?: string;
      size?: number;
      uploadProtocol?: 'blossom' | 'nip96' | 'custom-http';
    }> = {};
    editor?.state?.doc?.descendants?.((node) => {
      if (node.type?.name !== 'image' || !node.attrs?.src || node.attrs?.isPlaceholder) {
        return;
      }

      const rawSize = typeof node.attrs.size === 'number'
        ? node.attrs.size
        : Number(node.attrs.size);

      imageAttributeMap[node.attrs.src] = {
        dim: node.attrs.dim ?? undefined,
        alt: node.attrs.alt ?? undefined,
        size: Number.isFinite(rawSize) && rawSize > 0 ? rawSize : undefined,
        uploadProtocol: node.attrs.uploadProtocol ?? undefined,
      };
    });

    const rawImageBlurhashMap = this.deps.extractImageBlurhashMapFn!(editor);
    const imageBlurhashMap: ImageImetaMetadataMap = {};
    for (const [url, blurhash] of Object.entries(rawImageBlurhashMap)) {
      imageBlurhashMap[url] = {
        m: getMimeTypeFromUrl(url),
        blurhash,
        dim: imageAttributeMap[url]?.dim,
        alt: imageAttributeMap[url]?.alt,
        size: imageAttributeMap[url]?.size,
        uploadProtocol: imageAttributeMap[url]?.uploadProtocol,
        ox: imageOxMap[url],
        x: imageXMap[url],
      };
    }
    return imageBlurhashMap;
  }

  async performPostSubmission(
    editor: TipTapEditor,
    postPayload: ExtractedPostContent,
    imageOxMap: Record<string, string>,
    imageXMap: Record<string, string>,
    onStart?: () => void,
    onSuccess?: (result?: PostResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    const imageBlurhashMap = this.prepareImageBlurhashMap(editor, imageOxMap, imageXMap);

    onStart?.();

    try {
      const result = await this.submitPost(postPayload.content, imageBlurhashMap, postPayload.emojiTags);
      if (result.success) {
        onSuccess?.(result);
      } else {
        onError?.(result.error || "post_error");
      }
    } catch (error) {
      onError?.("post_error");
    }
  }

  private applyEmptyStateToEditor(editor: TipTapEditor): void {
    editor.chain().clearContent().run();
  }

  resetPostContent(editor: TipTapEditor): void {
    this.applyEmptyStateToEditor(editor);
    this.deps.resetEditorStateFn?.();
    this.deps.resetPostStatusFn?.();
    this.deps.contentWarningStore!.reset(); // Content Warningもリセット
    this.deps.contentWarningReasonStore!.reset(); // Content Warning Reasonもリセット
    // ギャラリーモード: ギャラリーもリセット
    this.deps.mediaGalleryStore!.clearAll();
    // リプライ/引用状態もクリア
    this.deps.clearReplyQuoteFn?.();
  }

  clearContentAfterSuccess(editor: TipTapEditor): void {
    // ピン留めON時: エディタクリア前にハッシュタグを保存
    const pinEnabled = this.deps.hashtagPinStore!.value;
    const hashtags = pinEnabled
      ? this.getHashtagArrays(this.deps.hashtagStore).hashtags
      : [];

    this.applyEmptyStateToEditor(editor);
    this.deps.contentWarningStore!.reset(); // Content Warningもリセット
    this.deps.contentWarningReasonStore!.reset(); // Content Warning Reasonもリセット
    // ギャラリーモード: ギャラリーもクリア
    this.deps.mediaGalleryStore!.clearAll();

    // ピン留めON+ハッシュタグがある場合: エディタにハッシュタグを復元
    if (pinEnabled && hashtags.length > 0) {
      const hashtagText = ' ' + hashtags.map(h => '#' + h).join(' ');
      editor.commands.insertContent(hashtagText);
    }

    // Preserve the current focus state, including an intentionally hidden IME.
    // Keep the caret before any restored pinned hashtags without refocusing.
    editor.commands.setTextSelection(1);
  }
}
