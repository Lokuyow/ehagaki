import type {
    ApplyReplyQuoteQueryParams,
    HydrateReplyQuoteReferencesParams,
} from "./bootstrap/externalInputBootstrap";
import type { ChannelContextApplyHandle } from "./channelContextApplyController";
import type {
    ChannelContextQueryTarget,
    NostrEvent,
    ReplyQuoteQueryTarget,
} from "./types";

export interface ComposerEventTarget {
    source: "manual" | "post-history";
    kind: number;
    eventId: string;
    relayHints: string[];
    authorPubkey: string | null;
    event?: NostrEvent;
    channelQuery: ChannelContextQueryTarget | null;
}

export interface ComposerTargetApplyControllerDependencies {
    startChannelContextQuery(
        query: ChannelContextQueryTarget,
        source: ComposerEventTarget["source"],
    ): ChannelContextApplyHandle;
    applyReplyQuoteQuery(params: ApplyReplyQuoteQueryParams): Promise<void>;
    hydrateReplyQuoteReferences(
        params: HydrateReplyQuoteReferencesParams,
    ): Promise<void>;
    getReplyQuoteApplyParams(): Pick<
        ApplyReplyQuoteQueryParams,
        | "rxNostr"
        | "relayConfig"
        | "setReplyQuote"
        | "updateReferencedEvent"
        | "setReplyQuoteError"
    >;
    clearChannelContext(): void;
    hasReplyOrQuotes(): boolean;
    clearReplyQuote(): void;
    clearReplyReference(): void;
    addQuoteReference(
        reference: ReplyQuoteQueryTarget,
    ): HydrateReplyQuoteReferencesParams["references"][number] | null;
    focusEditor(): void;
    logger?: Pick<Console, "error">;
}

export interface ComposerTargetApplyController {
    applyReply(target: ComposerEventTarget): boolean;
    applyQuote(target: ComposerEventTarget): boolean;
    applyChannel(target: ComposerEventTarget): boolean;
    dispose(): void;
}

const FALLBACK_LOGGER: Pick<Console, "error"> = console;

function buildReferenceTarget(target: ComposerEventTarget): ReplyQuoteQueryTarget {
    return {
        eventId: target.eventId,
        relayHints: [...target.relayHints],
        authorPubkey: target.authorPubkey,
    };
}

function buildPreloadedEvents(
    target: ComposerEventTarget,
): Record<string, NostrEvent> | undefined {
    return target.event ? { [target.eventId]: target.event } : undefined;
}

function getLogPrefix(
    target: ComposerEventTarget,
    operation: "reply" | "quote" | "channel",
): string {
    if (target.source === "post-history") {
        if (operation === "reply") return "投稿履歴からのリプライhydrateに失敗:";
        if (operation === "quote") return "投稿履歴からの引用適用に失敗:";
        return "投稿履歴からのチャンネル適用に失敗:";
    }
    if (operation === "reply") return "手入力からのリプライhydrateに失敗:";
    if (operation === "quote") return "手入力からの引用適用に失敗:";
    return "手入力からのチャンネル適用に失敗:";
}

export function createComposerTargetApplyController(
    deps: ComposerTargetApplyControllerDependencies,
): ComposerTargetApplyController {
    const logger = deps.logger ?? FALLBACK_LOGGER;
    let currentChannelApplyHandle: ChannelContextApplyHandle | null = null;

    function applyChannelContext(target: ComposerEventTarget): boolean {
        currentChannelApplyHandle?.release();
        currentChannelApplyHandle = null;

        if (target.channelQuery) {
            try {
                currentChannelApplyHandle = deps.startChannelContextQuery(
                    target.channelQuery,
                    target.source,
                );
                return true;
            } catch (error) {
                logger.error(getLogPrefix(target, "channel"), error);
                return false;
            }
        }

        deps.clearChannelContext();
        return target.kind !== 42;
    }

    function applyReply(target: ComposerEventTarget): boolean {
        if (!applyChannelContext(target)) {
            return false;
        }

        const preloadedEvents = buildPreloadedEvents(target);
        void deps.applyReplyQuoteQuery({
            replyQuoteQuery: {
                reply: buildReferenceTarget(target),
                quotes: [],
            },
            ...deps.getReplyQuoteApplyParams(),
            ...(preloadedEvents ? { preloadedEvents } : {}),
        }).catch((error) => {
            logger.error(getLogPrefix(target, "reply"), error);
        });

        deps.focusEditor();
        return true;
    }

    function applyQuote(target: ComposerEventTarget): boolean {
        const channelApplied = applyChannelContext(target);
        if (!channelApplied && target.source === "manual") {
            return false;
        }

        if (deps.hasReplyOrQuotes()) {
            deps.clearReplyQuote();
        }

        const hydrationTarget = deps.addQuoteReference(
            buildReferenceTarget(target),
        );
        if (!hydrationTarget) {
            deps.focusEditor();
            return true;
        }

        const preloadedEvents = buildPreloadedEvents(target);
        void deps.hydrateReplyQuoteReferences({
            references: [hydrationTarget],
            ...deps.getReplyQuoteApplyParams(),
            ...(preloadedEvents ? { preloadedEvents } : {}),
        }).catch((error) => {
            logger.error(getLogPrefix(target, "quote"), error);
        });

        deps.focusEditor();
        return true;
    }

    function applyChannel(target: ComposerEventTarget): boolean {
        if (target.kind !== 40 || !applyChannelContext(target)) {
            return false;
        }
        deps.clearReplyReference();
        deps.focusEditor();
        return true;
    }

    return {
        applyReply,
        applyQuote,
        applyChannel,
        dispose() {
            currentChannelApplyHandle?.release();
            currentChannelApplyHandle = null;
        },
    };
}
