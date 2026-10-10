import { onDestroy } from "svelte";
import type { PostHistoryRelatedTargetResolver, RelatedTargetDescriptor } from "../postHistoryRelatedTargetResolver.svelte";
import { classifyRepostTargetKind, getRepostReference, isRepostOuterKind, parseRepostReference, verifyRepostTarget, verifySupportedRepostTarget } from "../postRepostUtils";
import { postHistoryRepository } from "../storage/postHistoryRepository";
import { ehagakiDb, type PostHistoryRecord } from "../storage/ehagakiDb";
import { getPostHistoryLocalRevision } from "../storage/postHistoryLocalWriteScope";

let nextScope = 0;
export async function loadStoredRepostTarget(descriptor: RelatedTargetDescriptor) {
    if (!descriptor.sourceEventId) return null;
    const outer = await postHistoryRepository.getByEventId(descriptor.sourceEventId);
    const reference = outer && getRepostReference(outer);
    const target = outer?.repostTarget ?? (outer && reference
        ? (await ehagakiDb.postHistory.where("pubkeyHex").equals(outer.pubkeyHex)
            .filter((record) => isRepostOuterKind(record.kind) && record.repostTarget?.rawEvent.id === reference.eventId).first())?.repostTarget
        : undefined);
    const verified = reference && reference.eventId === descriptor.targetEventId && target
        // The resolver shares raw events by ID. Each outer's constraints and
        // supported kind are checked by getPreview() and snapshot persistence.
        ? verifyRepostTarget(target.rawEvent, { eventId: descriptor.targetEventId, authorHint: null, relayHints: [] }) : null;
    return verified ? { event: verified.event, relayHints: target!.relayHints } : null;
}

export function usePostHistoryRepostPreviews(params: { getShow: () => boolean;
    getPubkey: () => string | null | undefined; getPosts: () => PostHistoryRecord[];
    resolver: PostHistoryRelatedTargetResolver }) {
    const scopeKey = `post-history-repost:${++nextScope}`;
    let generation = 0;
    let saveErrors = $state<Record<string, boolean>>({});
    function descriptor(post: PostHistoryRecord): RelatedTargetDescriptor | null {
        const reference = getRepostReference(post);
        return reference ? { targetEventId: reference.eventId, authorHint: reference.authorHint,
            relayHints: reference.relayHints, relationKind: "repost", sourceEventId: post.eventId, scopeKey } : null;
    }
    function getPreview(post: PostHistoryRecord) {
        params.resolver.getScopeRevision(scopeKey);
        const parsed = parseRepostReference(post);
        const ref = parsed.reference;
        if (!ref) return { status: parsed.status, event: null, profile: null, relayHints: [] };
        const snapshot = params.resolver.getTargetSnapshot(ref.eventId);
        if (snapshot?.event && !verifyRepostTarget(snapshot.event, ref)) {
            return { status: "invalid-target" as const, event: null, profile: null, relayHints: snapshot.relayHints };
        }
        if (snapshot?.event) {
            const status = classifyRepostTargetKind(ref.outerKind, snapshot.event.kind);
            if (status !== "supported") return { status, event: null, profile: null, relayHints: snapshot.relayHints };
        }
        return { status: snapshot?.status ?? "loading", event: snapshot?.event ?? null,
            profile: snapshot?.profile ?? null, relayHints: snapshot?.relayHints ?? ref.relayHints,
            saveFailed: saveErrors[post.eventId] ?? false };
    }
    async function ensure(post: PostHistoryRecord, force = false) {
        const desc = descriptor(post);
        const owner = params.getPubkey();
        const current = generation;
        if (!desc || !owner) return;
        const expectedRevision = await getPostHistoryLocalRevision(ehagakiDb, owner);
        const isActive = () => generation === current && params.getShow() && params.getPubkey() === owner
            && params.getPosts().some((item) => item.eventId === post.eventId && item.deletedAt === undefined);
        if (!isActive()) return;
        const cached = params.resolver.getTargetSnapshot(desc.targetEventId);
        const snapshot = force
            ? await params.resolver.retryTarget(desc)
            : await params.resolver.ensureTarget(desc, { force: !!post.repostTarget && cached?.status !== "resolved" });
        if (!isActive() || !snapshot?.event) return;
        const reference = getRepostReference(post);
        const verified = reference && verifySupportedRepostTarget(snapshot.event, reference);
        if (!verified) return;
        try {
            await postHistoryRepository.attachRepostTarget({ outerEventId: post.eventId, target: verified.event,
                relayHints: snapshot.relayHints, localWriteScope: { ownerPubkeyHex: owner, expectedRevision, isActive } });
            if (isActive() && saveErrors[post.eventId]) saveErrors = { ...saveErrors, [post.eventId]: false };
        } catch {
            if (isActive()) saveErrors = { ...saveErrors, [post.eventId]: true };
        }
    }
    $effect(() => {
        const posts = params.getPosts();
        const owner = params.getPubkey();
        if (!params.getShow() || !owner) return;
        for (const post of posts) if (isRepostOuterKind(post.kind) && post.deletedAt === undefined) void ensure(post).catch(() => undefined);
        return () => { generation++; params.resolver.invalidateScope(scopeKey); };
    });
    onDestroy(() => { generation++; params.resolver.invalidateScope(scopeKey); });
    return { getPreview, retry: (post: PostHistoryRecord) => { void ensure(post, !saveErrors[post.eventId]).catch(() => undefined); } };
}
export type RepostPreviewState = ReturnType<ReturnType<typeof usePostHistoryRepostPreviews>["getPreview"]>;
