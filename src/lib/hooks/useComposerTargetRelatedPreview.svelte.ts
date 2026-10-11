import { onDestroy, untrack } from "svelte";
import type { RxNostr } from "rx-nostr";
import type { ComposerResolvedTarget } from "../composerTargetResolver";
import { COMPOSER_RELATED_PREVIEW_KINDS } from "../composerTargetRelatedPreview";
import { parseReactionReference } from "../reactionReference";
import { createPostHistoryRelatedTargetResolver, type PostHistoryRelatedTargetResolver,
    type RelatedTargetDescriptor } from "../postHistoryRelatedTargetResolver.svelte";
import { isRepostOuterKind, parseRepostReference, resolveRepostPreview } from "../postRepostUtils";
import { verifyRelatedEvent } from "../relatedEventVerification";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { RelayConfig } from "../types";
import { loadStoredRepostTarget } from "./usePostHistoryRepostPreviews.svelte";

let nextScope = 0;
export function useComposerTargetRelatedPreview(params: {
    getShow: () => boolean;
    getTarget: () => ComposerResolvedTarget | null;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getPubkey: () => string | null | undefined;
    resolver?: PostHistoryRelatedTargetResolver;
}) {
    const scopeKey = `composer-target-related:${++nextScope}`;
    const resolver = params.resolver ?? createPostHistoryRelatedTargetResolver({
        getShow: params.getShow, getRxNostr: params.getRxNostr, getRelayConfig: params.getRelayConfig,
        requireFullVerification: true,
        loadRepostTarget: loadStoredRepostTarget,
    });
    let generation = 0;
    let resolutionFailed = $state(false);
    const clear = () => untrack(() => {
        generation++;
        resolutionFailed = false;
        resolver.invalidateScope(scopeKey);
        if (!params.resolver) resolver.reset();
    });
    function ensure(desc: RelatedTargetDescriptor, retry = false) {
        const current = generation;
        resolutionFailed = false;
        void (retry ? resolver.retryTarget(desc) : resolver.ensureTarget(desc)).catch(() => {
            if (generation === current) resolutionFailed = true;
        });
    }
    function parse(target: ComposerResolvedTarget) {
        return isRepostOuterKind(target.event.kind) ? parseRepostReference(target.event)
            : parseReactionReference(target.event);
    }
    function descriptor(target: ComposerResolvedTarget): RelatedTargetDescriptor | null {
        const reference = parse(target).reference;
        return reference ? { targetEventId: reference.eventId, authorHint: reference.authorHint,
            relayHints: RelayConfigUtils.sanitizeExternalRelayUrls([...reference.relayHints, ...target.relayHints]),
            sourceEventId: target.event.id, relationKind: isRepostOuterKind(target.event.kind) ? "repost" : "reaction",
            scopeKey } : null;
    }
    $effect(() => {
        const show = params.getShow();
        const target = params.getTarget();
        params.getRxNostr(); params.getRelayConfig(); params.getPubkey();
        untrack(() => {
            clear();
            if (show && target && [6, 7, 16].includes(target.event.kind)) {
                const desc = descriptor(target);
                if (desc) ensure(desc);
            }
        });
        return clear;
    });
    onDestroy(clear);
    function getPreview() {
        const target = params.getTarget();
        if (!params.getShow() || !target || ![6, 7, 16].includes(target.event.kind)) return null;
        resolver.getScopeRevision(scopeKey);
        const parsed = parse(target);
        const empty = { event: null, profile: null, relayHints: [] as string[] };
        if (resolutionFailed) return { ...empty, status: "error" as const };
        if (!parsed.reference) return { ...empty, status: parsed.status };
        const snapshot = resolver.getTargetSnapshot(parsed.reference.eventId);
        if (snapshot?.errorCode === "invalid_event") return { ...empty, status: "invalid-target" as const };
        if (isRepostOuterKind(target.event.kind)) return resolveRepostPreview(target.event, snapshot, COMPOSER_RELATED_PREVIEW_KINDS);
        if (snapshot?.event && !verifyRelatedEvent(snapshot.event, parsed.reference)) {
            return { ...empty, status: "invalid-target" as const };
        }
        if (snapshot?.event && !(COMPOSER_RELATED_PREVIEW_KINDS as readonly number[]).includes(snapshot.event.kind)) {
            return { ...empty, status: "unsupported-target-kind" as const };
        }
        return { status: snapshot?.status ?? "loading", event: snapshot?.event ?? null,
            profile: snapshot?.profile ?? null, relayHints: snapshot?.relayHints ?? parsed.reference.relayHints };
    }
    function retry() {
        const target = params.getTarget();
        if (!params.getShow() || !target || ![6, 7, 16].includes(target.event.kind)) return;
        const desc = descriptor(target);
        if (desc) ensure(desc, true);
    }
    return { getPreview, retry };
}
