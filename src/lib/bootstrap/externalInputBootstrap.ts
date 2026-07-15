import { ReplyQuoteService } from "../replyQuoteService";
import { ChannelContextService } from "../channelContextService";
import { checkIfOpenedFromShare } from "../shareHandler";
import {
    getChannelFromUrlQuery,
    getContentFromUrlQuery,
    hasContentQueryParam,
    cleanupAllQueryParams,
    getReplyQuoteFromUrlQuery,
    hasChannelQueryParam,
    hasReplyQuoteQueryParam,
} from "../urlQueryHandler";
import { RelayConfigUtils } from '../relayConfigUtils';
import {
    checkServiceWorkerStatus,
    testServiceWorkerCommunication,
    getSharedMediaWithFallback,
} from "../utils/swCommunication";
import { sharedMediaRepository } from "../storage/sharedMediaRepository";
import { processExternalChannelContextQuery } from './externalChannelContextBootstrapUtils';
import { processReplyQuoteReference } from './externalReplyQuoteBootstrapUtils';
import type {
    ChannelContextQueryTarget,
    NostrEvent,
    ReplyQuoteQueryTarget,
    ReplyQuoteQueryResult,
} from "../types";

interface SharedMediaStoreLike {
    files: File[];
    metadata?: any;
    title: string;
    text: string;
    url: string;
    shareId: string | null;
    bodyStatus: 'pending' | 'applied' | 'not-applicable';
    automaticRetryCount: number;
    received: boolean;
}

export interface RunExternalInputBootstrapParams {
    sharedError: string | null;
    sharedMediaStore: SharedMediaStoreLike;
    setSharedMediaError: (message: string | null, durationMs?: number) => void;
    consumeFirstVisitFlag: () => boolean;
    showWelcomeDialog: () => void;
    updateUrlQueryContentStore: (content: string) => void;
    setChannelContext: (value: any) => void;
    setReplyQuote: (value: any) => void;
    updateReferencedEvent: (eventId: string, event: any, threadInfo: any) => void;
    initializeReplyNotificationRecipients?: (eventId: string, event: NostrEvent) => void;
    setReplyQuoteError: (eventId: string, message: string) => void;
    rxNostr?: any;
    relayConfig: any;
    locationHref: string;
    allowSharedMediaRecovery?: boolean;
}

function getSharedMediaErrorMessage(errorCode: string | null): string | null {
    switch (errorCode) {
        case "processing-error":
            return "共有メディアの処理中にエラーが発生しました";
        case "no-image":
            return "共有メディアが見つかりませんでした";
        case "upload-failed":
            return "メディアのアップロードに失敗しました";
        case "network-error":
            return "ネットワークエラーが発生しました";
        case "client-error":
            return "メディア共有処理でエラーが発生しました";
        default:
            return null;
    }
}

async function bootstrapSharedMedia({
    sharedError,
    sharedMediaStore,
    setSharedMediaError,
    locationHref,
    allowSharedMediaRecovery = false,
}: Pick<
    RunExternalInputBootstrapParams,
    | "sharedError"
    | "sharedMediaStore"
    | "setSharedMediaError"
    | "locationHref"
    | "allowSharedMediaRecovery"
>): Promise<void> {
    const openedFromShare = checkIfOpenedFromShare();

    try {
        if (!openedFromShare && !allowSharedMediaRecovery) {
            return;
        }

        const shared = openedFromShare
            ? await getSharedMediaWithFallback()
            : await sharedMediaRepository.getLatest();
        if (!openedFromShare && (!shared || (shared.automaticRetryCount ?? 0) < 1)) {
            return;
        }
        if (shared && (shared.images.length || shared.title || shared.text || shared.url)) {
            sharedMediaStore.files = shared.images;
            sharedMediaStore.metadata = shared.metadata;
            sharedMediaStore.title = shared.title ?? "";
            sharedMediaStore.text = shared.text ?? "";
            sharedMediaStore.url = shared.url ?? "";
            sharedMediaStore.shareId = shared.shareId ?? null;
            sharedMediaStore.bodyStatus = shared.bodyStatus ?? "not-applicable";
            sharedMediaStore.automaticRetryCount = shared.automaticRetryCount ?? 0;
            sharedMediaStore.received = true;
            return;
        }

        console.warn("No shared media data received");
        const sharedMediaErrorMessage = getSharedMediaErrorMessage(sharedError);
        if (sharedMediaErrorMessage) {
            setSharedMediaError(sharedMediaErrorMessage, 5000);
        }
        if (sharedError) {
            console.error("Shared image processing failed with error parameter:", {
                error: sharedError,
                location: locationHref,
            });
        }
    } catch (error) {
        console.error("共有メディアの処理中にエラー:", error);
        const sharedMediaErrorMessage = getSharedMediaErrorMessage(sharedError);
        if (sharedMediaErrorMessage) {
            setSharedMediaError(sharedMediaErrorMessage, 5000);
        }
    }
}

async function bootstrapReplyQuote({
    rxNostr,
    relayConfig,
    setReplyQuote,
    updateReferencedEvent,
    initializeReplyNotificationRecipients,
    setReplyQuoteError,
}: Pick<
    RunExternalInputBootstrapParams,
    | "rxNostr"
    | "relayConfig"
    | "setReplyQuote"
    | "updateReferencedEvent"
    | "initializeReplyNotificationRecipients"
    | "setReplyQuoteError"
>): Promise<void> {
    if (!hasReplyQuoteQueryParam()) {
        return;
    }

    const replyQuoteQuery = getReplyQuoteFromUrlQuery();
    if (!replyQuoteQuery) {
        return;
    }

    await applyReplyQuoteQuery({
        replyQuoteQuery,
        rxNostr,
        relayConfig,
        setReplyQuote,
        updateReferencedEvent,
        initializeReplyNotificationRecipients,
        setReplyQuoteError,
    });
}

export interface ApplyChannelContextQueryParams extends Pick<
    RunExternalInputBootstrapParams,
    | "rxNostr"
    | "relayConfig"
    | "setChannelContext"
> {
    channelContextQuery: ChannelContextQueryTarget;
}

function sanitizeChannelContextQuery(
    channelContextQuery: ChannelContextQueryTarget,
): ChannelContextQueryTarget {
    const sanitizedChannelRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        channelContextQuery.channelRelays,
    );

    return {
        ...channelContextQuery,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
            channelContextQuery.relayHints,
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        ),
        ...(sanitizedChannelRelays.length > 0
            ? {
                channelRelays: sanitizedChannelRelays,
            }
            : {}),
    };
}

export async function applyChannelContextQuery({
    channelContextQuery,
    rxNostr,
    relayConfig,
    setChannelContext,
}: ApplyChannelContextQueryParams): Promise<void> {
    const sanitizedChannelContextQuery = sanitizeChannelContextQuery(
        channelContextQuery,
    );
    await processExternalChannelContextQuery({
        channelContextQuery: sanitizedChannelContextQuery,
        channelContextService: new ChannelContextService(),
        rxNostr,
        relayConfig,
        setChannelContext,
    });
}

async function bootstrapChannelContext({
    rxNostr,
    relayConfig,
    setChannelContext,
}: Pick<RunExternalInputBootstrapParams, 'rxNostr' | 'relayConfig' | 'setChannelContext'>): Promise<void> {
    if (!hasChannelQueryParam()) {
        return;
    }

    const channelContext = getChannelFromUrlQuery();
    if (!channelContext) {
        return;
    }

    await applyChannelContextQuery({
        channelContextQuery: channelContext,
        rxNostr,
        relayConfig,
        setChannelContext,
    });
}

export interface ApplyReplyQuoteQueryParams extends Pick<
    RunExternalInputBootstrapParams,
    | "rxNostr"
    | "relayConfig"
    | "setReplyQuote"
    | "updateReferencedEvent"
    | "initializeReplyNotificationRecipients"
    | "setReplyQuoteError"
> {
    replyQuoteQuery: ReplyQuoteQueryResult;
    preloadedEvents?: Record<string, NostrEvent>;
}

function sanitizeReplyQuoteQuery(
    replyQuoteQuery: ReplyQuoteQueryResult,
): ReplyQuoteQueryResult {
    const sanitizeEntry = <T extends { relayHints: string[] }>(entry: T | null): T | null => {
        if (!entry) {
            return null;
        }

        return {
            ...entry,
            relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(entry.relayHints, {
                limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
            }),
        };
    };

    return {
        reply: sanitizeEntry(replyQuoteQuery.reply),
        quotes: replyQuoteQuery.quotes
            .map((quote) => sanitizeEntry(quote))
            .filter((quote): quote is NonNullable<typeof quote> => quote !== null),
    };
}

function sanitizeReplyQuoteReferences(
    references: ReplyQuoteQueryTarget[],
): ReplyQuoteQueryTarget[] {
    return references.map((reference) => ({
        ...reference,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(
            reference.relayHints,
            { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
        ),
    }));
}

export interface HydrateReplyQuoteReferencesParams extends Pick<
    RunExternalInputBootstrapParams,
    | "rxNostr"
    | "relayConfig"
    | "updateReferencedEvent"
    | "initializeReplyNotificationRecipients"
    | "setReplyQuoteError"
> {
    references: ReplyQuoteQueryTarget[];
    preloadedEvents?: Record<string, NostrEvent>;
}

export async function hydrateReplyQuoteReferences({
    references,
    preloadedEvents = {},
    rxNostr,
    relayConfig,
    updateReferencedEvent,
    initializeReplyNotificationRecipients,
    setReplyQuoteError,
}: HydrateReplyQuoteReferencesParams): Promise<void> {
    const sanitizedReferences = sanitizeReplyQuoteReferences(references);
    const resolvableReferences = sanitizedReferences.filter((reference) =>
        !!rxNostr || !!preloadedEvents[reference.eventId],
    );

    if (resolvableReferences.length === 0) {
        return;
    }

    const rqService = new ReplyQuoteService();
    await Promise.allSettled(
        resolvableReferences.map((reference) =>
            processReplyQuoteReference({
                reference,
                replyQuoteService: rqService,
                initialEvent: preloadedEvents[reference.eventId],
                rxNostr,
                relayConfig,
                updateReferencedEvent,
                initializeReplyNotificationRecipients,
                setReplyQuoteError,
            }),
        ),
    );
}

export async function applyReplyQuoteQuery({
    replyQuoteQuery,
    preloadedEvents = {},
    rxNostr,
    relayConfig,
    setReplyQuote,
    updateReferencedEvent,
    initializeReplyNotificationRecipients,
    setReplyQuoteError,
}: ApplyReplyQuoteQueryParams): Promise<void> {
    const sanitizedReplyQuoteQuery = sanitizeReplyQuoteQuery(replyQuoteQuery);

    setReplyQuote(sanitizedReplyQuoteQuery);

    const references = [
        ...(sanitizedReplyQuoteQuery.reply ? [sanitizedReplyQuoteQuery.reply] : []),
        ...sanitizedReplyQuoteQuery.quotes,
    ];

    if (references.length === 0) {
        return;
    }

    await hydrateReplyQuoteReferences({
        references,
        preloadedEvents,
        rxNostr,
        relayConfig,
        updateReferencedEvent,
        initializeReplyNotificationRecipients,
        setReplyQuoteError,
    });
}

export async function runExternalInputBootstrap({
    sharedError,
    sharedMediaStore,
    setSharedMediaError,
    consumeFirstVisitFlag,
    showWelcomeDialog,
    updateUrlQueryContentStore,
    setChannelContext,
    setReplyQuote,
    updateReferencedEvent,
    initializeReplyNotificationRecipients,
    setReplyQuoteError,
    rxNostr,
    relayConfig,
    locationHref,
}: RunExternalInputBootstrapParams): Promise<void> {
    if (checkIfOpenedFromShare()) {
        const swStatus = await checkServiceWorkerStatus();
        const canCommunicate = await testServiceWorkerCommunication();

        if (!swStatus.isReady || !swStatus.hasController || !canCommunicate) {
            console.warn(
                "Service Worker not ready for shared image processing:",
                swStatus,
            );
        }
    }

    await bootstrapSharedMedia({
        sharedError,
        sharedMediaStore,
        setSharedMediaError,
        locationHref,
    });

    if (consumeFirstVisitFlag()) {
        showWelcomeDialog();
    }

    if (hasContentQueryParam()) {
        const queryContent = getContentFromUrlQuery();
        if (queryContent) {
            updateUrlQueryContentStore(queryContent);
        }
    }

    await bootstrapChannelContext({
        rxNostr,
        relayConfig,
        setChannelContext,
    });

    await bootstrapReplyQuote({
        rxNostr,
        relayConfig,
        setReplyQuote,
        updateReferencedEvent,
        initializeReplyNotificationRecipients,
        setReplyQuoteError,
    });

    cleanupAllQueryParams();
}
