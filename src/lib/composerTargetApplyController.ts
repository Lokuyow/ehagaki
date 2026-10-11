import type {
    ApplyReplyQuoteQueryParams,
    HydrateReplyQuoteReferencesParams,
} from "./bootstrap/externalInputBootstrap";
import type { ChannelContextApplyHandle } from "./channelContextApplyController";
import { verifyRelatedEvent } from './relatedEventVerification';
import { isReactionTargetKind } from './postReactionUtils';
import { clearReactionTarget, setReactionTarget } from '../stores/reactionComposerStore.svelte';
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
    isCurrent?: () => boolean;
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
    prepareReactionTarget?: (target: ComposerEventTarget) => Promise<{ event: NostrEvent; relayHints: string[] } | null>;
    captureReactionOwnership?: () => () => boolean;
    logger?: Pick<Console, "error">;
}

export interface ComposerTargetApplyController {
    applyReply(target: ComposerEventTarget): boolean;
    applyQuote(target: ComposerEventTarget): boolean;
    applyChannel(target: ComposerEventTarget): boolean;
    applyReaction(target: ComposerEventTarget): Promise<boolean>;
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
    let reactionRequest = 0;

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
        reactionRequest++;
        if (!applyChannelContext(target)) {
            return false;
        }

        clearReactionTarget();
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
        reactionRequest++;
        const channelApplied = applyChannelContext(target);
        if (!channelApplied && target.source === "manual") {
            return false;
        }

        clearReactionTarget();
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
        reactionRequest++;
        if (target.kind !== 40 || !applyChannelContext(target)) {
            return false;
        }
        clearReactionTarget();
        deps.clearReplyReference();
        deps.focusEditor();
        return true;
    }

    async function applyReaction(target: ComposerEventTarget): Promise<boolean> {
        const request = ++reactionRequest;
        const isOwned = deps.captureReactionOwnership?.() ?? (() => true);
        if (!isReactionTargetKind(target.kind)) return false;
        try {
            const prepared = target.event ? { event: target.event, relayHints: target.relayHints }
                : await deps.prepareReactionTarget?.(target);
            const verified = prepared && verifyRelatedEvent(prepared.event, { eventId: target.eventId,
                authorHint: target.authorPubkey, targetKindHint: target.kind, relayHints: target.relayHints });
            if (!verified || request !== reactionRequest || !isOwned() || target.isCurrent?.() === false) return false;
            // Commit synchronously only after preparation: failed requests leave every existing context untouched.
            currentChannelApplyHandle?.release();
            currentChannelApplyHandle = null;
            deps.clearReplyQuote();
            deps.clearChannelContext();
            setReactionTarget(verified.event, prepared!.relayHints);
            deps.focusEditor();
            return true;
        } catch { return false; }
    }

    return {
        applyReply,
        applyQuote,
        applyChannel,
        applyReaction,
        dispose() {
            reactionRequest++;
            currentChannelApplyHandle?.release();
            currentChannelApplyHandle = null;
        },
    };
}
