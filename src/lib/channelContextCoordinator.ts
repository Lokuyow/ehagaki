import type { RxNostr } from "rx-nostr";
import {
    CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT,
    CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
} from "./channelContextConstants";
import { ChannelContextService } from "./channelContextService";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    channelMetadataRepository,
    type ChannelMetadataCache,
    type ChannelMetadataRepository,
    type UpsertResolvedChannelInput,
} from "./storage/channelMetadataRepository";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    ChannelNetworkResolution,
    RelayConfig,
} from "./types";

export type ChannelContextCoordinatorSnapshotSource = "seed" | "cache" | "network";

export interface ChannelContextCoordinatorSnapshot {
    context: ChannelContextState;
    cache: ChannelMetadataCache | null;
    source: ChannelContextCoordinatorSnapshotSource;
}

export type ChannelContextCoordinatorRefreshResult =
    | { status: "updated"; snapshot: ChannelContextCoordinatorSnapshot }
    | { status: "failed"; snapshot: ChannelContextCoordinatorSnapshot }
    | { status: "skipped"; snapshot: ChannelContextCoordinatorSnapshot }
    | { status: "aborted"; snapshot: ChannelContextCoordinatorSnapshot };

export interface ChannelContextCoordinatorHandle {
    initial: ChannelContextCoordinatorSnapshot;
    cacheReady: Promise<ChannelContextCoordinatorSnapshot>;
    refresh: Promise<ChannelContextCoordinatorRefreshResult>;
    release(): void;
}

interface ChannelContextNetworkService {
    resolveChannelMetadataWithInternalHints(
        query: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        options?: { signal?: AbortSignal },
    ): Promise<ChannelNetworkResolution>;
}

export interface ChannelContextCoordinatorDeps {
    service?: ChannelContextNetworkService;
    repository?: ChannelMetadataRepository;
    logger?: Pick<Console, "error">;
}

interface SharedResolutionOutcome {
    status: "updated" | "failed" | "aborted";
    cache: ChannelMetadataCache | null;
    didPersistVerifiedResult?: boolean;
}

interface SharedResolutionEntry {
    eventId: string;
    rxNostr: RxNostr;
    relayConfig?: RelayConfig | null;
    relayHints: string[];
    hintRevision: number;
    consumers: Set<symbol>;
    abortController: AbortController;
    promise: Promise<SharedResolutionOutcome>;
}

const FALLBACK_LOGGER: Pick<Console, "error"> = console;

function sanitizeReadRelays(relays: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays, {
        limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
    });
}

function sanitizeWriteRelays(relays: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays, {
        limit: CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT,
    });
}

function mergeReadRelays(...relayGroups: string[][]): string[] {
    return sanitizeReadRelays(RelayConfigUtils.mergeRelayConfigs(...relayGroups));
}

function mergeWriteRelays(...relayGroups: string[][]): string[] {
    return sanitizeWriteRelays(RelayConfigUtils.mergeRelayConfigs(...relayGroups));
}

function buildSeedContext(query: ChannelContextQueryTarget): ChannelContextState {
    const channelRelays = sanitizeWriteRelays(query.channelRelays);
    return {
        eventId: query.eventId,
        relayHints: sanitizeReadRelays(query.relayHints),
        ...(channelRelays.length > 0 ? { channelRelays } : {}),
        name: query.name ?? null,
        about: query.about ?? null,
        picture: query.picture ?? null,
    };
}

function mergeCacheIntoContext(
    seed: ChannelContextState,
    cache: ChannelMetadataCache | null,
): ChannelContextState {
    if (!cache) return seed;

    const hasVerifiedRoot = cache.resolutionQuality === "verified-root-only"
        || cache.resolutionQuality === "verified-metadata";
    const hasVerifiedMetadata = cache.resolutionQuality === "verified-metadata";
    const channelRelays = hasVerifiedMetadata
        ? mergeWriteRelays(cache.relays, seed.channelRelays ?? [])
        : mergeWriteRelays(seed.channelRelays ?? []);

    return {
        eventId: seed.eventId,
        relayHints: mergeReadRelays(
            seed.relayHints,
            ...(hasVerifiedRoot ? [cache.relayHints] : []),
            ...(hasVerifiedMetadata ? [cache.relays] : []),
        ),
        ...(channelRelays.length > 0 ? { channelRelays } : {}),
        name: hasVerifiedMetadata ? cache.name : seed.name ?? cache.name,
        about: hasVerifiedMetadata ? cache.about : seed.about ?? cache.about,
        picture: hasVerifiedMetadata ? cache.picture : seed.picture ?? cache.picture,
    };
}

function toRepositoryInput(resolution: Exclude<
    ChannelNetworkResolution,
    { status: "failed" | "aborted" }
>): UpsertResolvedChannelInput {
    if (resolution.status === "root-only") {
        return {
            channelEventId: resolution.channelEventId,
            quality: "verified-root-only",
            metadataLookup: resolution.metadataLookup,
            verifiedSourceRelays: resolution.verifiedSourceRelays,
            creatorPubkey: resolution.creatorPubkey,
            createEventCreatedAt: resolution.createEventCreatedAt,
        };
    }

    return {
        channelEventId: resolution.metadata.channelEventId,
        quality: "verified-metadata",
        metadataLookup: resolution.metadataLookup,
        name: resolution.metadata.name,
        about: resolution.metadata.about,
        picture: resolution.metadata.picture,
        relays: resolution.metadata.channelRelays,
        verifiedSourceRelays: resolution.metadata.verifiedSourceRelays,
        creatorPubkey: resolution.metadata.creatorPubkey,
        createEventCreatedAt: resolution.metadata.createEventCreatedAt,
        ...(resolution.metadata.metadataEventId
            ? { metadataEventId: resolution.metadata.metadataEventId }
            : {}),
        ...(typeof resolution.metadata.metadataCreatedAt === "number"
            ? { metadataCreatedAt: resolution.metadata.metadataCreatedAt }
            : {}),
    };
}

function hasNewRelayHints(candidateHints: string[], attemptedHints: string[]): boolean {
    const attempted = new Set(attemptedHints);
    return candidateHints.some((relay) => !attempted.has(relay));
}

function areRelayHintsEqual(first: string[], second: string[]): boolean {
    return first.length === second.length
        && first.every((relay, index) => relay === second[index]);
}

function canNewHintsBypassRetrySuppression(
    cache: ChannelMetadataCache | null,
    candidateHints: string[],
    attemptedHints: string[],
): boolean {
    return !!cache
        && (cache.lastResolutionAttemptStatus === "failed"
            || cache.lastResolutionAttemptStatus === "incomplete")
        && hasNewRelayHints(candidateHints, attemptedHints);
}

export class ChannelContextCoordinator {
    private readonly service: ChannelContextNetworkService;
    private readonly repository: ChannelMetadataRepository;
    private readonly logger: Pick<Console, "error">;
    private readonly inFlightByRxNostr = new WeakMap<
        RxNostr,
        Map<string, SharedResolutionEntry>
    >();
    private readonly lastAttemptHintsByRxNostr = new WeakMap<
        RxNostr,
        Map<string, string[]>
    >();

    constructor(deps: ChannelContextCoordinatorDeps = {}) {
        this.service = deps.service ?? new ChannelContextService();
        this.repository = deps.repository ?? channelMetadataRepository;
        this.logger = deps.logger ?? FALLBACK_LOGGER;
    }

    resolveInternal(
        query: ChannelContextQueryTarget,
        rxNostr?: RxNostr,
        relayConfig?: RelayConfig | null,
    ): ChannelContextCoordinatorHandle {
        const sanitizedQuery: ChannelContextQueryTarget = {
            ...query,
            relayHints: sanitizeReadRelays(query.relayHints),
            ...(query.channelRelays
                ? { channelRelays: sanitizeWriteRelays(query.channelRelays) }
                : {}),
        };
        const seedContext = buildSeedContext(sanitizedQuery);
        const initial: ChannelContextCoordinatorSnapshot = {
            context: seedContext,
            cache: null,
            source: "seed",
        };
        let released = false;
        let releaseSharedConsumer: (() => void) | null = null;

        const cacheReady = this.repository.get(sanitizedQuery.eventId)
            .then((cache) => ({
                context: mergeCacheIntoContext(seedContext, cache),
                cache,
                source: cache ? "cache" as const : "seed" as const,
            }))
            .catch((error) => {
                this.logger.error("チャンネルキャッシュの読み込みに失敗しました:", error);
                return initial;
            });

        const refresh = cacheReady.then(async (cachedSnapshot) => {
            if (released || !rxNostr) {
                return { status: "skipped", snapshot: cachedSnapshot } as const;
            }

            const attemptedHints = this.getLastAttemptHints(rxNostr, sanitizedQuery.eventId);
            const shouldRefresh = this.repository.shouldRefresh(cachedSnapshot.cache)
                || canNewHintsBypassRetrySuppression(
                    cachedSnapshot.cache,
                    sanitizedQuery.relayHints,
                    attemptedHints,
                );
            if (!shouldRefresh) {
                return { status: "skipped", snapshot: cachedSnapshot } as const;
            }

            const refreshQuery = {
                ...sanitizedQuery,
                relayHints: cachedSnapshot.context.relayHints,
            };
            const shared = this.acquireSharedResolution(
                refreshQuery,
                rxNostr,
                relayConfig,
            );
            releaseSharedConsumer = shared.release;
            try {
                const outcome = await shared.promise;
                if (released || outcome.status === "aborted") {
                    return { status: "aborted", snapshot: cachedSnapshot } as const;
                }
                const snapshot: ChannelContextCoordinatorSnapshot = {
                    context: mergeCacheIntoContext(seedContext, outcome.cache),
                    cache: outcome.cache,
                    source: outcome.status === "updated" || outcome.didPersistVerifiedResult
                        ? "network"
                        : cachedSnapshot.source,
                };
                return outcome.status === "updated"
                    ? { status: "updated", snapshot } as const
                    : { status: "failed", snapshot } as const;
            } finally {
                releaseSharedConsumer?.();
                releaseSharedConsumer = null;
            }
        }).catch((error) => {
            this.logger.error("チャンネルのバックグラウンド解決に失敗しました:", error);
            return { status: "failed", snapshot: initial } as const;
        });

        return {
            initial,
            cacheReady,
            refresh,
            release: () => {
                if (released) return;
                released = true;
                releaseSharedConsumer?.();
                releaseSharedConsumer = null;
            },
        };
    }

    private acquireSharedResolution(
        query: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
    ): { promise: Promise<SharedResolutionOutcome>; release: () => void } {
        let byEventId = this.inFlightByRxNostr.get(rxNostr);
        if (!byEventId) {
            byEventId = new Map();
            this.inFlightByRxNostr.set(rxNostr, byEventId);
        }

        let entry = byEventId.get(query.eventId);
        if (entry?.abortController.signal.aborted) {
            if (byEventId.get(query.eventId) === entry) {
                byEventId.delete(query.eventId);
            }
            entry = undefined;
        }
        if (entry) {
            const mergedRelayHints = mergeReadRelays(entry.relayHints, query.relayHints);
            if (!areRelayHintsEqual(entry.relayHints, mergedRelayHints)) {
                entry.relayHints = mergedRelayHints;
                entry.hintRevision += 1;
            }
        } else {
            const nextEntry: SharedResolutionEntry = {
                eventId: query.eventId,
                rxNostr,
                relayConfig,
                relayHints: [...query.relayHints],
                hintRevision: 0,
                consumers: new Set(),
                abortController: new AbortController(),
                promise: Promise.resolve({ status: "aborted", cache: null }),
            };
            nextEntry.promise = Promise.resolve()
                .then(() => this.executeSharedResolution(nextEntry))
                .catch(async (error) => {
                    if (nextEntry.abortController.signal.aborted) {
                        return { status: "aborted", cache: null } as const;
                    }
                    this.logger.error("共有チャンネル解決に失敗しました:", error);
                    await this.markFetchFailedSafely(nextEntry.eventId);
                    return {
                        status: "failed",
                        cache: await this.getCacheSafely(nextEntry.eventId),
                    } as const;
                })
                .finally(() => {
                    if (byEventId?.get(nextEntry.eventId) === nextEntry) {
                        byEventId.delete(nextEntry.eventId);
                    }
                });
            entry = nextEntry;
            byEventId.set(query.eventId, entry);
        }

        const consumerId = Symbol(query.eventId);
        entry.consumers.add(consumerId);
        let consumerReleased = false;
        return {
            promise: entry.promise,
            release: () => {
                if (consumerReleased) return;
                consumerReleased = true;
                entry?.consumers.delete(consumerId);
                if (entry && entry.consumers.size === 0) {
                    entry.abortController.abort();
                }
            },
        };
    }

    private async executeSharedResolution(
        entry: SharedResolutionEntry,
    ): Promise<SharedResolutionOutcome> {
        let attemptedHints: string[] = [];
        let didPersistVerifiedResult = false;
        while (!entry.abortController.signal.aborted) {
            attemptedHints = [...entry.relayHints];
            const attemptedHintRevision = entry.hintRevision;
            this.setLastAttemptHints(entry.rxNostr, entry.eventId, attemptedHints);
            const resolution = await this.service.resolveChannelMetadataWithInternalHints(
                { eventId: entry.eventId, relayHints: attemptedHints },
                entry.rxNostr,
                entry.relayConfig,
                { signal: entry.abortController.signal },
            );

            if (resolution.status === "aborted" || entry.abortController.signal.aborted) {
                return { status: "aborted", cache: null };
            }

            if (resolution.status === "failed") {
                await this.markFetchFailedSafely(entry.eventId);
                if (entry.abortController.signal.aborted) {
                    return { status: "aborted", cache: null };
                }
                const cache = await this.getCacheSafely(entry.eventId);
                if (entry.abortController.signal.aborted) {
                    return { status: "aborted", cache: null };
                }
                if (this.hasNewHintsSinceAttempt(
                    entry,
                    attemptedHintRevision,
                    attemptedHints,
                )) {
                    continue;
                }
                return {
                    status: "failed",
                    cache,
                    ...(didPersistVerifiedResult ? { didPersistVerifiedResult: true } : {}),
                };
            }

            const cache = await this.repository.upsertResolvedChannel(
                toRepositoryInput(resolution),
            );
            didPersistVerifiedResult = true;
            if (entry.abortController.signal.aborted) {
                return { status: "aborted", cache: null };
            }

            // Incomplete verified data is durable before a hint-driven retry. A
            // complete result is final for this attempt even if a consumer joined
            // during persistence; that hint remains available to a later refresh.
            if (
                resolution.metadataLookup === "incomplete"
                && this.hasNewHintsSinceAttempt(
                    entry,
                    attemptedHintRevision,
                    attemptedHints,
                )
            ) {
                continue;
            }
            return { status: "updated", cache };
        }

        return { status: "aborted", cache: null };
    }

    private hasNewHintsSinceAttempt(
        entry: SharedResolutionEntry,
        attemptedHintRevision: number,
        attemptedHints: string[],
    ): boolean {
        return entry.hintRevision > attemptedHintRevision
            && hasNewRelayHints(entry.relayHints, attemptedHints);
    }

    private getLastAttemptHints(rxNostr: RxNostr, eventId: string): string[] {
        return this.lastAttemptHintsByRxNostr.get(rxNostr)?.get(eventId) ?? [];
    }

    private setLastAttemptHints(rxNostr: RxNostr, eventId: string, hints: string[]): void {
        let byEventId = this.lastAttemptHintsByRxNostr.get(rxNostr);
        if (!byEventId) {
            byEventId = new Map();
            this.lastAttemptHintsByRxNostr.set(rxNostr, byEventId);
        }
        byEventId.set(eventId, [...hints]);
    }

    private async markFetchFailedSafely(eventId: string): Promise<void> {
        try {
            await this.repository.markFetchFailed(eventId);
        } catch (error) {
            this.logger.error("チャンネル取得失敗の記録に失敗しました:", error);
        }
    }

    private async getCacheSafely(eventId: string): Promise<ChannelMetadataCache | null> {
        try {
            return await this.repository.get(eventId);
        } catch (error) {
            this.logger.error("チャンネルキャッシュの再読み込みに失敗しました:", error);
            return null;
        }
    }
}

export const channelContextCoordinator = new ChannelContextCoordinator();
