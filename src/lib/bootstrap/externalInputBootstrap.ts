import { ReplyQuoteService } from "../replyQuoteService";
import { checkIfOpenedFromShare } from "../shareHandler";
import {
    getContentFromUrlQuery,
    hasContentQueryParam,
    cleanupAllQueryParams,
    getReplyQuoteFromUrlQuery,
    hasReplyQuoteQueryParam,
} from "../urlQueryHandler";
import {
    checkServiceWorkerStatus,
    testServiceWorkerCommunication,
    getSharedMediaWithFallback,
} from "../utils/swCommunication";
import type { RelayProfileService } from "../relayProfileService";

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

    setReplyQuote(replyQuoteQuery);

    if (!rxNostr) {
        return;
    }

    const references = [
        ...(replyQuoteQuery.reply ? [replyQuoteQuery.reply] : []),
        ...replyQuoteQuery.quotes,
    ];

    if (references.length === 0) {
        return;
    }

    const rqService = new ReplyQuoteService();
    await Promise.allSettled(
        references.map(async (reference) => {
            const event = await rqService.fetchReferencedEvent(
                reference.eventId,
                reference.relayHints,
                rxNostr,
                relayConfig,
            );

            if (!event) {
                setReplyQuoteError(reference.eventId, "Event not found");
                return;
            }

            const threadInfo = rqService.extractThreadInfo(event);
            updateReferencedEvent(reference.eventId, event, threadInfo);

            if (event.pubkey && relayProfileService) {
                const profile = await relayProfileService.fetchProfileRealtime(event.pubkey, {
                    additionalRelays: reference.relayHints,
                });
                if (!profile) {
                    return;
                }

                const displayName = profile.displayName || profile.name;
                if (displayName) {
                    updateAuthorDisplayName(reference.eventId, displayName);
                }
            }
        }),
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