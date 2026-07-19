import { createRxBackwardReq } from "rx-nostr";
import type { RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import {
    CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
    CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT,
    CHANNEL_VERIFIED_WRITE_RELAY_CACHE_LIMIT,
} from "./channelContextConstants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    ChannelNetworkResolution,
    NostrEvent,
    RelayConfig,
    ResolvedChannelMetadata,
} from "./types";


interface ChannelMetadataContent {
    name?: string | null;
    about?: string | null;
    picture?: string | null;
    relays: string[];
}

interface ChannelMetadataParseResult {
    metadata: ChannelMetadataContent;
    isValid: boolean;
}

type FetchEventResult =
    | { status: "found"; event: NostrEvent; relayUrl: string | null }
    | { status: "not-found" }
    | { status: "timeout" }
    | { status: "request-error"; cause?: unknown }
    | { status: "aborted" };

type MetadataRequestEndStatus = "complete" | "timeout" | "request-error";

type FetchLatestMetadataResult =
    | {
        status: MetadataRequestEndStatus;
        event: NostrEvent | null;
        relayUrls: string[];
        metadata: ChannelMetadataContent;
        cause?: unknown;
    }
    | { status: "aborted" };

export interface ChannelContextResolveOptions {
    signal?: AbortSignal;
}

export interface ChannelContextServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
    createRxBackwardReqFn?: typeof createRxBackwardReq;
}

function sanitizeMetadataText(value: unknown): string | null | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function resolveMetadataValue(
    overrideValue: string | null | undefined,
    baseValue: string | null | undefined,
): string | null {
    if (overrideValue !== undefined) return overrideValue;
    if (baseValue !== undefined) return baseValue;
    return null;
}

function toChannelContextState(
    resolvedChannelMetadata: ResolvedChannelMetadata,
): ChannelContextState {
    return {
        eventId: resolvedChannelMetadata.channelEventId,
        relayHints: [...resolvedChannelMetadata.relayHints],
        ...(resolvedChannelMetadata.channelRelays?.length
            ? { channelRelays: [...resolvedChannelMetadata.channelRelays] }
            : {}),
        name: resolvedChannelMetadata.name,
        about: resolvedChannelMetadata.about,
        picture: resolvedChannelMetadata.picture,
    };
}

function isPreferredMetadataEvent(candidate: NostrEvent, current: NostrEvent | null): boolean {
    if (!current) return true;
    if (candidate.created_at !== current.created_at) {
        return candidate.created_at > current.created_at;
    }
    return candidate.id.localeCompare(current.id) < 0;
}

export class ChannelContextService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;
    private createRxBackwardReqFn: typeof createRxBackwardReq;

    constructor(deps: ChannelContextServiceDeps = {}) {
        this.console = deps.console || (typeof console !== "undefined"
            ? console
            : { log: () => { }, warn: () => { }, error: () => { } } as Console);
        this.setTimeoutFn = deps.setTimeoutFn || ((fn, ms) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn || ((id) => clearTimeout(id));
        this.createRxBackwardReqFn = deps.createRxBackwardReqFn || createRxBackwardReq;
    }

    async resolveChannelContext(
        channelContextQuery: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
    ): Promise<ChannelContextState> {
        const resolution = await this.resolveChannelMetadata(channelContextQuery, rxNostr, relayConfig);
        if (resolution.status === "resolved") {
            return toChannelContextState(resolution.metadata);
        }
        const verifiedSourceRelays = resolution.status === "root-only"
            ? resolution.verifiedSourceRelays
            : [];
        return {
            eventId: channelContextQuery.eventId,
            relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
                RelayConfigUtils.mergeRelayConfigs(channelContextQuery.relayHints, verifiedSourceRelays),
                { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
            ),
            name: null,
            about: null,
            picture: null,
        };
    }

    resolveChannelMetadata(
        channelContextQuery: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        options: ChannelContextResolveOptions = {},
    ): Promise<ChannelNetworkResolution> {
        const sanitizedHints = RelayConfigUtils.sanitizeExternalRelayUrls(
            channelContextQuery.relayHints,
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        );
        return this.resolveChannelMetadataInternal(
            channelContextQuery.eventId,
            sanitizedHints,
            rxNostr,
            relayConfig,
            options,
        );
    }

    private async resolveChannelMetadataInternal(
        eventId: string,
        relayHints: string[],
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        options: ChannelContextResolveOptions = {},
    ): Promise<ChannelNetworkResolution> {
        const rootResult = await this.fetchEventById(
            eventId,
            relayHints,
            rxNostr,
            relayConfig,
            5000,
            options.signal,
        );
        if (rootResult.status === "aborted") return { status: "aborted" };
        if (rootResult.status === "not-found") {
            return { status: "failed", reason: "root-not-found" };
        }
        if (rootResult.status === "timeout") {
            return { status: "failed", reason: "timeout" };
        }
        if (rootResult.status === "request-error") {
            return {
                status: "failed",
                reason: "request-error",
                ...(rootResult.cause !== undefined ? { cause: rootResult.cause } : {}),
            };
        }
        if (rootResult.event.kind !== 40) {
            return { status: "failed", reason: "wrong-kind" };
        }

        const rootEvent = rootResult.event;
        const baseMetadataResult = this.parseChannelMetadataContent(rootEvent.content);
        const baseMetadata = baseMetadataResult.metadata;
        const metadataReadRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(
                baseMetadata.relays,
                rootResult.relayUrl ? [rootResult.relayUrl] : [],
                relayHints,
            ),
            { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
        );
        const metadataResult = await this.fetchLatestMetadataEvent(
            eventId,
            rootEvent.pubkey,
            metadataReadRelays,
            rxNostr,
            relayConfig,
            5000,
            options.signal,
        );
        if (metadataResult.status === "aborted") return { status: "aborted" };

        const metadataLookup = metadataResult.status === "complete"
            ? "complete" as const
            : "incomplete" as const;
        const verifiedSourceRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            [
                ...(rootResult.relayUrl ? [rootResult.relayUrl] : []),
                ...metadataResult.relayUrls,
            ],
            { limit: CHANNEL_VERIFIED_SOURCE_RELAY_CACHE_LIMIT },
        );
        if (!baseMetadataResult.isValid && !metadataResult.event) {
            return {
                status: "root-only",
                quality: "verified-root-only",
                reason: "invalid-root-content",
                metadataLookup,
                channelEventId: eventId,
                creatorPubkey: rootEvent.pubkey,
                createEventCreatedAt: rootEvent.created_at,
                verifiedSourceRelays,
            };
        }

        const latestMetadata = metadataResult.metadata;
        const channelRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(latestMetadata.relays, baseMetadata.relays),
            { limit: CHANNEL_VERIFIED_WRITE_RELAY_CACHE_LIMIT },
        );
        const resolvedRelayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(relayHints, verifiedSourceRelays),
            { limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT },
        );
        return {
            status: "resolved",
            quality: "verified-metadata",
            metadataLookup,
            metadata: {
                channelEventId: eventId,
                relayHints: resolvedRelayHints,
                ...(channelRelays.length > 0 ? { channelRelays } : {}),
                name: resolveMetadataValue(latestMetadata.name, baseMetadata.name),
                about: resolveMetadataValue(latestMetadata.about, baseMetadata.about),
                picture: resolveMetadataValue(latestMetadata.picture, baseMetadata.picture),
                creatorPubkey: rootEvent.pubkey,
                createEventCreatedAt: rootEvent.created_at,
                metadataEventId: metadataResult.event?.id ?? null,
                metadataCreatedAt: metadataResult.event?.created_at ?? null,
                verifiedSourceRelays,
            },
        };
    }

    private parseChannelMetadataContent(content: string): ChannelMetadataParseResult {
        try {
            const parsed = JSON.parse(content);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                return { metadata: { relays: [] }, isValid: false };
            }
            const record = parsed as Record<string, unknown>;
            return {
                metadata: {
                    name: sanitizeMetadataText(record.name),
                    about: sanitizeMetadataText(record.about),
                    picture: sanitizeMetadataText(record.picture),
                    relays: RelayConfigUtils.sanitizeExternalRelayUrls(
                        Array.isArray(record.relays)
                            ? record.relays.filter((value): value is string => typeof value === "string")
                            : [],
                        { limit: CHANNEL_VERIFIED_WRITE_RELAY_CACHE_LIMIT },
                    ),
                },
                isValid: true,
            };
        } catch {
            return { metadata: { relays: [] }, isValid: false };
        }
    }

    private buildReadOnParams(
        relayHints: string[],
        relayConfig?: RelayConfig | null,
    ): { defaultReadRelays: boolean; relays?: string[] } {
        const hasReadRelays = !!relayConfig
            && RelayConfigUtils.extractReadRelays(relayConfig).length > 0;
        const temporaryRelays = new Set<string>(relayHints);
        if (!hasReadRelays) {
            RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS)
                .forEach((relayUrl) => temporaryRelays.add(relayUrl));
        }
        return {
            defaultReadRelays: hasReadRelays,
            ...(temporaryRelays.size > 0 ? { relays: Array.from(temporaryRelays) } : {}),
        };
    }

    private fetchEventById(
        eventId: string,
        relayHints: string[],
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        timeoutMs = 5000,
        signal?: AbortSignal,
    ): Promise<FetchEventResult> {
        return new Promise((resolve) => {
            let resolved = false;
            let subscription: { unsubscribe?: () => void } | undefined;
            let timeoutId: ReturnType<typeof setTimeout> | undefined;
            const cleanup = () => {
                if (timeoutId !== undefined) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = undefined;
                }
                signal?.removeEventListener("abort", handleAbort);
                subscription?.unsubscribe?.();
                subscription = undefined;
            };
            const safeResolve = (result: FetchEventResult) => {
                if (resolved) return;
                resolved = true;
                cleanup();
                resolve(result);
            };
            const handleAbort = () => safeResolve({ status: "aborted" });
            if (signal?.aborted) {
                safeResolve({ status: "aborted" });
                return;
            }
            signal?.addEventListener("abort", handleAbort, { once: true });
            timeoutId = this.setTimeoutFn(() => {
                this.console.warn("チャンネルイベント取得タイムアウト");
                safeResolve({ status: "timeout" });
            }, timeoutMs);
            try {
                const rxReq = this.createRxBackwardReqFn();
                subscription = rxNostr.use(rxReq, {
                    on: this.buildReadOnParams(relayHints, relayConfig),
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        if (packet.event?.id !== eventId) return;
                        safeResolve({
                            status: "found",
                            event: packet.event,
                            relayUrl: typeof packet.from === "string" ? packet.from : null,
                        });
                    },
                    complete: () => safeResolve({ status: "not-found" }),
                    error: (cause: unknown) => {
                        this.console.error("チャンネルイベント取得エラー:", cause);
                        safeResolve({ status: "request-error", cause });
                    },
                });
                if (resolved) {
                    subscription?.unsubscribe?.();
                    subscription = undefined;
                    return;
                }
                rxReq.emit({ ids: [eventId] });
                rxReq.over();
            } catch (cause) {
                this.console.error("チャンネルイベントリクエスト作成エラー:", cause);
                safeResolve({ status: "request-error", cause });
            }
        });
    }

    private fetchLatestMetadataEvent(
        eventId: string,
        authorPubkey: string,
        relayHints: string[],
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        timeoutMs = 5000,
        signal?: AbortSignal,
    ): Promise<FetchLatestMetadataResult> {
        return new Promise((resolve) => {
            let resolved = false;
            let subscription: { unsubscribe?: () => void } | undefined;
            let timeoutId: ReturnType<typeof setTimeout> | undefined;
            let latestEvent: NostrEvent | null = null;
            let latestMetadata: ChannelMetadataContent = { relays: [] };
            const relayUrls = new Set<string>();
            const cleanup = () => {
                if (timeoutId !== undefined) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = undefined;
                }
                signal?.removeEventListener("abort", handleAbort);
                subscription?.unsubscribe?.();
                subscription = undefined;
            };
            const safeResolve = (
                status: MetadataRequestEndStatus | "aborted",
                cause?: unknown,
            ) => {
                if (resolved) return;
                resolved = true;
                cleanup();
                if (status === "aborted") {
                    resolve({ status: "aborted" });
                    return;
                }
                resolve({
                    status,
                    event: latestEvent,
                    relayUrls: Array.from(relayUrls),
                    metadata: latestMetadata,
                    ...(cause !== undefined ? { cause } : {}),
                });
            };
            const handleAbort = () => safeResolve("aborted");
            if (signal?.aborted) {
                safeResolve("aborted");
                return;
            }
            signal?.addEventListener("abort", handleAbort, { once: true });
            timeoutId = this.setTimeoutFn(() => {
                this.console.warn("チャンネル metadata 取得タイムアウト");
                safeResolve("timeout");
            }, timeoutMs);
            try {
                const rxReq = this.createRxBackwardReqFn();
                subscription = rxNostr.use(rxReq, {
                    on: this.buildReadOnParams(relayHints, relayConfig),
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        const event = packet.event;
                        if (!event || event.kind !== 41 || event.pubkey !== authorPubkey) return;
                        if (!event.tags.some((tag) => tag[0] === "e" && tag[1] === eventId)) return;
                        const parsedMetadata = this.parseChannelMetadataContent(event.content);
                        if (!parsedMetadata.isValid) return;
                        if (typeof packet.from === "string") relayUrls.add(packet.from);
                        if (isPreferredMetadataEvent(event, latestEvent)) {
                            latestEvent = event;
                            latestMetadata = parsedMetadata.metadata;
                        }
                    },
                    complete: () => safeResolve("complete"),
                    error: (cause: unknown) => {
                        this.console.error("チャンネル metadata 取得エラー:", cause);
                        safeResolve("request-error", cause);
                    },
                });
                if (resolved) {
                    subscription?.unsubscribe?.();
                    subscription = undefined;
                    return;
                }
                rxReq.emit({ kinds: [41], authors: [authorPubkey], "#e": [eventId] } as any);
                rxReq.over();
            } catch (cause) {
                this.console.error("チャンネル metadata リクエスト作成エラー:", cause);
                safeResolve("request-error", cause);
            }
        });
    }
}
