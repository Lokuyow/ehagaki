import { createRxBackwardReq } from "rx-nostr";
import type { RxNostr } from "rx-nostr";
import { FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
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

interface FetchEventResult {
    event: NostrEvent | null;
    relayUrl: string | null;
}

interface FetchLatestMetadataResult {
    event: NostrEvent | null;
    relayUrls: string[];
    metadata: ChannelMetadataContent;
}

export interface ChannelContextResolveOptions {
    signal?: AbortSignal;
}

export interface ChannelContextServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
}

function sanitizeMetadataText(value: unknown): string | null | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }

    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function resolveMetadataValue(
    overrideValue: string | null | undefined,
    baseValue: string | null | undefined,
): string | null {
    if (overrideValue !== undefined) {
        return overrideValue;
    }

    if (baseValue !== undefined) {
        return baseValue;
    }

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

export class ChannelContextService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;

    constructor(deps: ChannelContextServiceDeps = {}) {
        this.console = deps.console || (typeof console !== "undefined"
            ? console
            : { log: () => {}, warn: () => {}, error: () => {} } as Console);
        this.setTimeoutFn = deps.setTimeoutFn || ((fn: () => void, ms: number) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn || ((id: ReturnType<typeof setTimeout>) => clearTimeout(id));
    }

    resolveChannelContext(
        channelContextQuery: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
    ): Promise<ChannelContextState> {
        return this.resolveChannelMetadata(
            channelContextQuery,
            rxNostr,
            relayConfig,
        ).then(toChannelContextState);
    }

    resolveChannelMetadata(
        channelContextQuery: ChannelContextQueryTarget,
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        options: ChannelContextResolveOptions = {},
    ): Promise<ResolvedChannelMetadata> {
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
    ): Promise<ResolvedChannelMetadata> {
        const rootResult = await this.fetchEventById(
            eventId,
            relayHints,
            rxNostr,
            relayConfig,
            5000,
            options.signal,
        );

        const baseMetadataResult = rootResult.event?.kind === 40
            ? this.parseChannelMetadataContent(rootResult.event.content)
            : { metadata: { relays: [] }, isValid: false };
        const baseMetadata = baseMetadataResult.metadata;

        const metadataReadRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(
                baseMetadata.relays,
                rootResult.relayUrl ? [rootResult.relayUrl] : [],
                relayHints,
            ),
        );

        const metadataResult = rootResult.event?.kind === 40 && rootResult.event.pubkey
            ? await this.fetchLatestMetadataEvent(
                eventId,
                rootResult.event.pubkey,
                metadataReadRelays,
                rxNostr,
                relayConfig,
                5000,
                options.signal,
            )
            : { event: null, relayUrls: [], metadata: { relays: [] } };

        const latestMetadata = metadataResult.metadata;

        const channelRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(
                latestMetadata.relays,
                baseMetadata.relays,
            ),
        );

        const resolvedRelayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(
                relayHints,
                rootResult.relayUrl ? [rootResult.relayUrl] : [],
                metadataResult.relayUrls,
            ),
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        );

        return {
            channelEventId: eventId,
            relayHints: resolvedRelayHints,
            ...(channelRelays.length > 0
                ? { channelRelays }
                : {}),
            name: resolveMetadataValue(latestMetadata.name, baseMetadata.name),
            about: resolveMetadataValue(latestMetadata.about, baseMetadata.about),
            picture: resolveMetadataValue(latestMetadata.picture, baseMetadata.picture),
            creatorPubkey: rootResult.event?.kind === 40 ? rootResult.event.pubkey : null,
            createEventCreatedAt: rootResult.event?.kind === 40 ? rootResult.event.created_at : null,
            metadataEventId: metadataResult.event?.id ?? null,
            metadataCreatedAt: metadataResult.event?.created_at ?? null,
        };
    }

    private parseChannelMetadataContent(content: string): ChannelMetadataParseResult {
        try {
            const parsed = JSON.parse(content);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                return {
                    metadata: { relays: [] },
                    isValid: false,
                };
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
                    ),
                },
                isValid: true,
            };
        } catch {
            return {
                metadata: { relays: [] },
                isValid: false,
            };
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
            ...(temporaryRelays.size > 0
                ? { relays: Array.from(temporaryRelays) }
                : {}),
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
            const rxReq = createRxBackwardReq();
            let resolved = false;
            let subscription: { unsubscribe?: () => void } | undefined;
            let timeoutId: ReturnType<typeof setTimeout> | undefined;

            const handleAbort = () => {
                safeResolve({ event: null, relayUrl: null });
            };

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
                if (resolved) {
                    return;
                }

                resolved = true;
                cleanup();
                resolve(result);
            };

            if (signal?.aborted) {
                safeResolve({ event: null, relayUrl: null });
                return;
            }

            signal?.addEventListener("abort", handleAbort, { once: true });

            try {
                subscription = rxNostr.use(rxReq, {
                    on: this.buildReadOnParams(relayHints, relayConfig),
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        if (packet.event?.id !== eventId) {
                            return;
                        }

                        safeResolve({
                            event: packet.event,
                            relayUrl: typeof packet.from === "string" ? packet.from : null,
                        });
                    },
                    complete: () => {
                        safeResolve({ event: null, relayUrl: null });
                    },
                    error: (error: unknown) => {
                        this.console.error("チャンネルイベント取得エラー:", error);
                        safeResolve({ event: null, relayUrl: null });
                    },
                });

                rxReq.emit({ ids: [eventId] });
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("チャンネルイベント取得タイムアウト");
                    safeResolve({ event: null, relayUrl: null });
                }, timeoutMs);
            } catch (error) {
                this.console.error("チャンネルイベントリクエスト作成エラー:", error);
                safeResolve({ event: null, relayUrl: null });
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
            const rxReq = createRxBackwardReq();
            let resolved = false;
            let subscription: { unsubscribe?: () => void } | undefined;
            let timeoutId: ReturnType<typeof setTimeout> | undefined;
            let latestEvent: NostrEvent | null = null;
            let latestMetadata: ChannelMetadataContent = { relays: [] };
            const relayUrls = new Set<string>();

            const handleAbort = () => {
                safeResolve();
            };

            const cleanup = () => {
                if (timeoutId !== undefined) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = undefined;
                }
                signal?.removeEventListener("abort", handleAbort);
                subscription?.unsubscribe?.();
                subscription = undefined;
            };

            const safeResolve = () => {
                if (resolved) {
                    return;
                }

                resolved = true;
                cleanup();
                resolve({
                    event: latestEvent,
                    relayUrls: Array.from(relayUrls),
                    metadata: latestMetadata,
                });
            };

            if (signal?.aborted) {
                safeResolve();
                return;
            }

            signal?.addEventListener("abort", handleAbort, { once: true });

            try {
                subscription = rxNostr.use(rxReq, {
                    on: this.buildReadOnParams(relayHints, relayConfig),
                }).subscribe({
                    next: (packet: { event?: NostrEvent; from?: string }) => {
                        const event = packet.event;
                        if (!event || event.kind !== 41 || event.pubkey !== authorPubkey) {
                            return;
                        }

                        const matchesChannel = event.tags.some(
                            (tag) => tag[0] === "e" && tag[1] === eventId,
                        );
                        if (!matchesChannel) {
                            return;
                        }

                        const parsedMetadata = this.parseChannelMetadataContent(
                            event.content,
                        );
                        if (!parsedMetadata.isValid) {
                            return;
                        }

                        if (typeof packet.from === "string") {
                            relayUrls.add(packet.from);
                        }

                        if (!latestEvent || event.created_at > latestEvent.created_at) {
                            latestEvent = event;
                            latestMetadata = parsedMetadata.metadata;
                        }
                    },
                    complete: () => {
                        safeResolve();
                    },
                    error: (error: unknown) => {
                        this.console.error("チャンネル metadata 取得エラー:", error);
                        safeResolve();
                    },
                });

                rxReq.emit({ kinds: [41], authors: [authorPubkey], "#e": [eventId] } as any);
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    this.console.warn("チャンネル metadata 取得タイムアウト");
                    safeResolve();
                }, timeoutMs);
            } catch (error) {
                this.console.error("チャンネル metadata リクエスト作成エラー:", error);
                safeResolve();
            }
        });
    }
}