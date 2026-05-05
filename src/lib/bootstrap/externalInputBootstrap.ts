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
import { processExternalChannelContextQuery } from './externalChannelContextBootstrapUtils';
import { processReplyQuoteReference } from './externalReplyQuoteBootstrapUtils';
import type { RelayProfileService } from "../relayProfileService";
import type { ChannelContextQueryTarget, ReplyQuoteQueryResult } from "../types";

interface SharedMediaStoreLike {
    files: File[];
    metadata?: any;
    received: boolean;
}

export interface RunExternalInputBootstrapParams {
    sharedError: string | null;
    sharedMediaStore: SharedMediaStoreLike;
    isSharedMediaProcessed: () => boolean;
    markSharedMediaProcessed: () => void;
    setSharedMediaError: (message: string | null, durationMs?: number) => void;
    consumeFirstVisitFlag: () => boolean;
    showWelcomeDialog: () => void;
    updateUrlQueryContentStore: (content: string) => void;
    setChannelContext: (value: any) => void;
    setReplyQuote: (value: any) => void;
    updateReferencedEvent: (eventId: string, event: any, threadInfo: any) => void;
    updateAuthorDisplayName: (eventId: string, name: string) => void;
    setReplyQuoteError: (eventId: string, message: string) => void;
    relayProfileService?: RelayProfileService;
    rxNostr?: any;
    relayConfig: any;
    locationHref: string;
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
    isSharedMediaProcessed,
    markSharedMediaProcessed,
    setSharedMediaError,
    locationHref,
}: Pick<
    RunExternalInputBootstrapParams,
    | "sharedError"
    | "sharedMediaStore"
    | "isSharedMediaProcessed"
    | "markSharedMediaProcessed"
    | "setSharedMediaError"
    | "locationHref"
>): Promise<void> {
    if (!checkIfOpenedFromShare() || isSharedMediaProcessed()) {
        return;
    }

    try {
        const shared = await getSharedMediaWithFallback();
        if (shared?.images?.length) {
            sharedMediaStore.files = shared.images;
            sharedMediaStore.metadata = shared.metadata;
            sharedMediaStore.received = true;
            markSharedMediaProcessed();
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
    relayProfileService,
    rxNostr,
    relayConfig,
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
}: Pick<
    RunExternalInputBootstrapParams,
    | "relayProfileService"
    | "rxNostr"
    | "relayConfig"
    | "setReplyQuote"
    | "updateReferencedEvent"
    | "updateAuthorDisplayName"
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
        relayProfileService,
        rxNostr,
        relayConfig,
        setReplyQuote,
        updateReferencedEvent,
        updateAuthorDisplayName,
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
    | "relayProfileService"
    | "rxNostr"
    | "relayConfig"
    | "setReplyQuote"
    | "updateReferencedEvent"
    | "updateAuthorDisplayName"
    | "setReplyQuoteError"
> {
    replyQuoteQuery: ReplyQuoteQueryResult;
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

export async function applyReplyQuoteQuery({
    replyQuoteQuery,
    relayProfileService,
    rxNostr,
    relayConfig,
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
}: ApplyReplyQuoteQueryParams): Promise<void> {
    const sanitizedReplyQuoteQuery = sanitizeReplyQuoteQuery(replyQuoteQuery);

    setReplyQuote(sanitizedReplyQuoteQuery);

    if (!rxNostr) {
        return;
    }

    const references = [
        ...(sanitizedReplyQuoteQuery.reply ? [sanitizedReplyQuoteQuery.reply] : []),
        ...sanitizedReplyQuoteQuery.quotes,
    ];

    if (references.length === 0) {
        return;
    }

    const rqService = new ReplyQuoteService();
    await Promise.allSettled(
        references.map((reference) =>
            processReplyQuoteReference({
                reference,
                replyQuoteService: rqService,
                relayProfileService,
                rxNostr,
                relayConfig,
                updateReferencedEvent,
                updateAuthorDisplayName,
                setReplyQuoteError,
            }),
        ),
    );
}

export async function runExternalInputBootstrap({
    sharedError,
    sharedMediaStore,
    isSharedMediaProcessed,
    markSharedMediaProcessed,
    setSharedMediaError,
    consumeFirstVisitFlag,
    showWelcomeDialog,
    updateUrlQueryContentStore,
    setChannelContext,
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
    relayProfileService,
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
        isSharedMediaProcessed,
        markSharedMediaProcessed,
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
        relayProfileService,
        rxNostr,
        relayConfig,
        setReplyQuote,
        updateReferencedEvent,
        updateAuthorDisplayName,
        setReplyQuoteError,
    });

    cleanupAllQueryParams();
}