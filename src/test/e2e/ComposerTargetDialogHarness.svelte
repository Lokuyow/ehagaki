<script lang="ts">
    import { onMount } from "svelte";
    import { channelMetadataRepository } from "../../lib/storage/channelMetadataRepository";
    import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
    import { createPostHistoryRelatedTargetResolver } from "../../lib/postHistoryRelatedTargetResolver.svelte";
    import type { NostrEvent } from "../../lib/types";
    import ComposerTargetDialog from "../../components/ComposerTargetDialog.svelte";
    import HeaderComponent from "../../components/HeaderComponent.svelte";
    import type {
        ComposerResolvedTarget,
        ComposerTargetResolveResult,
    } from "../../lib/composerTargetResolver";
    import type { ComposerEventTarget } from "../../lib/composerTargetApplyController";
    import type { ComposerTargetAction } from "../../lib/composerTargetUtils";
    import { postHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";

    const ids = {
        kind1: "1".repeat(64),
        sensitive: "d".repeat(64),
        sensitivePayload: "c".repeat(64),
        kind40: "4".repeat(64),
        kind42: "2".repeat(64),
        stale: "a".repeat(64),
        wrappingPost: "6".repeat(64),
        linkPost: "5".repeat(64),
        exactlyFiveLinePost: "7".repeat(64),
        oversizedPost: "3".repeat(64),
        mediaPost: "0".repeat(64),
        whitespacePost: "b".repeat(64),
        namelessChannel: "8".repeat(64),
        longNameChannel: "9".repeat(64),
    };
    const sign = (kind: number, content: string, tags: string[][] = []): NostrEvent =>
        finalizeEvent({ kind, content, tags, created_at: 100 }, generateSecretKey());
    const relatedSource = sign(1, "Related fixture body");
    const nestedHidden = sign(1, "Nested JSON must stay hidden https://example.com/hidden.jpg");
    const nested6 = sign(6, JSON.stringify(nestedHidden), [["e", nestedHidden.id]]);
    const nested16 = sign(16, JSON.stringify(nestedHidden), [["e", nestedHidden.id], ["k", "1"]]);
    const relatedReaction = sign(7, "👀", [["e", nestedHidden.id]]);
    const relatedChannel = sign(40, JSON.stringify({ name: "Related fixture channel" }));
    const related42 = sign(42, "Related channel post", [["e", relatedChannel.id, "", "root"]]);
    const missingSource = sign(1, "Recovered related fixture");
    const heldSource = sign(1, "Released related fixture");
    const refTags = (event: NostrEvent) => [["e", event.id, "wss://related.example/", event.pubkey], ["p", event.pubkey], ["k", String(event.kind)]];
    const interactionEvents = {
        repost6: sign(6, JSON.stringify(relatedSource), [["e", relatedSource.id], ["p", relatedSource.pubkey]]),
        repost16: sign(16, "", refTags(related42)),
        repostTo6: sign(16, JSON.stringify(nested6), refTags(nested6)),
        repostTo16: sign(16, JSON.stringify(nested16), refTags(nested16)),
        reaction7: sign(7, "👍", refTags(relatedReaction)),
        channelReaction: sign(7, "👍", refTags(related42)),
        emojiReaction: sign(7, ":party:", [...refTags(relatedSource), ["emoji", "party", "https://example.com/reaction-party.png"]]),
        missingReaction: sign(7, "+", refTags(missingSource)),
        heldReaction: sign(7, "👍", refTags(heldSource)),
        markerReaction: sign(7, "👍", [["e", relatedSource.id, "", "reply"], ...refTags(relatedReaction)]),
        invalidReaction: sign(7, "👍", [["e", relatedSource.id, "", "reply"], ["e", "invalid"]]),
    };
    const interactionById = new Map(Object.values(interactionEvents).map(event => [event.id, event]));
    const relatedById = new Map([relatedSource, nested6, nested16, relatedReaction, related42, missingSource, heldSource]
        .map(event => [event.id, event]));
    let recoverMissing = false;
    let releaseHeld: (() => void) | null = null;
    const relatedFetchIds: string[] = [];
    const relatedCancelledIds: string[] = [];
    const relatedResolver = createPostHistoryRelatedTargetResolver({ requireFullVerification: true,
        getShow: () => show, getRxNostr: () => fixtureRuntime, getRelayConfig: () => null,
        postHistoryRepositoryImpl: { getByEventId: async () => null },
        contextFetchService: { fetchEventById: (_runtime, params) => {
            relatedFetchIds.push(params.eventId);
            let cancelled = false;
            const result = () => ({ event: cancelled || (params.eventId === missingSource.id && !recoverMissing)
                ? null : relatedById.get(params.eventId) ?? null, relayUrl: "wss://related.example/" });
            let finish: (() => void) | undefined;
            const promise = params.eventId === heldSource.id ? new Promise<ReturnType<typeof result>>(resolve => {
                finish = () => resolve(result()); releaseHeld = finish;
            }) : Promise.resolve(result());
            return { promise, cancel: () => { cancelled = true; relatedCancelledIds.push(params.eventId); finish?.(); } };
        } },
        deletionRequestsRepositoryImpl: { getDeletedTargets: async () => new Map(),
            upsertValidDeletionRequests: async () => ({ insertedCount: 0, updatedCount: 0, unchangedCount: 0, ignoredCount: 0 }) },
        deletionFetchService: { fetchDeletionRequests: () => ({ promise: Promise.resolve({ status: "success" as const,
            events: [], fetchedAt: 0, relayUrls: [] }), cancel: () => undefined }) },
        profileSyncCoordinator: { ensureProfile: () => ({ name: "Related fixture author", displayName: "", picture: "", npub: "", nprofile: "" }),
            subscribe: () => () => undefined, reset: () => undefined, dispose: () => undefined },
    });
    const fixtureRuntime = {} as never;
    const inputs: Record<string, string> = {
        ...Object.fromEntries(Object.entries(interactionEvents).map(([key, event]) => [key,
            event.kind === 16 ? nip19.neventEncode({ id: event.id, author: event.pubkey, kind: event.kind, relays: ["wss://input.example/"] })
                : nip19.noteEncode(event.id)])),
        kind1: nip19.noteEncode(ids.kind1),
        sensitive: nip19.noteEncode(ids.sensitive),
        sensitivePayload: nip19.neventEncode({
            id: ids.sensitivePayload,
            relays: ["wss://input.example.com/"],
            kind: 1,
        }),
        kind40: nip19.noteEncode(ids.kind40),
        kind42: nip19.noteEncode(ids.kind42),
        stale: nip19.noteEncode(ids.stale),
        wrappingPost: nip19.noteEncode(ids.wrappingPost),
        linkPost: nip19.noteEncode(ids.linkPost),
        exactlyFiveLinePost: nip19.noteEncode(ids.exactlyFiveLinePost),
        oversizedPost: nip19.noteEncode(ids.oversizedPost),
        mediaPost: nip19.noteEncode(ids.mediaPost),
        whitespacePost: nip19.noteEncode(ids.whitespacePost),
        namelessChannel: nip19.noteEncode(ids.namelessChannel),
        longNameChannel: nip19.noteEncode(ids.longNameChannel),
        unsupported: nip19.npubEncode("b".repeat(64)),
        nsec: nip19.nsecEncode(Uint8Array.from({ length: 32 }, () => 7)),
    };
    const wrappingPostContent = "wrapword ".repeat(24).trim();
    const linkTargetUrl = new URL(
        "reference-link-target",
        window.location.href,
    ).href;
    const linkPostContent = [
        `Reference target ${linkTargetUrl}`,
        "Line 2",
        "Line 3",
        "Line 4",
        "Line 5",
        `Line 6 ${"long-path-segment-".repeat(12)}`,
    ].join("\n");
    const exactlyFiveLinePostContent = Array.from(
        { length: 5 },
        (_, index) => `Line ${index + 1}`,
    ).join("\n");
    const oversizedPostContent = "oversized-content-".repeat(2_000);
    const whitespacePostContent = `${" \n".repeat(1_000)}Whitespace tail content`;
    const mediaUrls = Array.from(
        { length: 4 },
        (_, index) => new URL(`preview-media-${index + 1}.jpg`, window.location.href).href,
    );
    const videoUrl = new URL("preview-media-video.mp4", window.location.href).href;
    const mediaPostContent = `${"collapsed-prefix-".repeat(150)} ${[
        ...mediaUrls,
        videoUrl,
    ].join(" ")}`;

    const reactionEmojiUrl = "https://example.com/reaction-party.png";
    const resolverEventIds: string[] = [];
    const cancelledResolverEventIds: string[] = [];
    let releaseStaleResolver: (() => void) | null = null;

    function makeReaction(
        targetEventId: string,
        eventId: string,
        pubkey: string,
        content: string,
        tags: string[][] = [],
    ) {
        return {
            id: eventId,
            pubkey,
            created_at: 2,
            kind: 7,
            tags: [["e", targetEventId], ...tags],
            content,
            sig: "e".repeat(128),
        };
    }

    async function seedReactionFixtures(): Promise<void> {
        const targets = [ids.kind1, ids.kind42];
        await postHistoryChildInteractionsRepository.deleteChildInteractionsForParents(targets);
        for (const targetEventId of targets) {
            const prefix = targetEventId === ids.kind1 ? "a" : "b";
            await postHistoryChildInteractionsRepository.upsertChildInteractions({
                parentEventId: targetEventId,
                events: [
                    {
                        event: makeReaction(
                            targetEventId,
                            prefix.repeat(64),
                            "3".repeat(64),
                            "+",
                        ),
                        relayUrls: [],
                    },
                    {
                        event: makeReaction(
                            targetEventId,
                            (prefix === "a" ? "c" : "d").repeat(64),
                            "4".repeat(64),
                            ":party:",
                            [["emoji", "party", reactionEmojiUrl]],
                        ),
                        relayUrls: [],
                    },
                ],
            });
        }
    }

    let show = $state(false);
    let pubkeyHex = $state<string | null>(null);
    const reposts: string[] = [];
    let applications = $state<
        Array<{ action: ComposerTargetAction; kind: number; eventId: string }>
    >([]);

    function makeTarget(
        kind: 1 | 36 | 40 | 42,
        eventId: string,
        channelName: string | null = "Fixture channel",
        content = `Fixture kind ${kind}`,
    ): ComposerResolvedTarget {
        const hasChannel = kind === 40 || kind === 42;
        return {
            event: {
                id: eventId,
                pubkey: "c".repeat(64),
                created_at: 1,
                kind,
                tags: eventId === ids.sensitive
                    ? [
                          ["content-warning", "Sensitive fixture"],
                          ["c", ids.sensitivePayload, "wss://payload.example.com/"],
                      ]
                    : kind === 36 ? [["k", "1"]] : [],
                content:
                    kind === 40
                        ? JSON.stringify({ name: "Fixture channel" })
                        : content,
                sig: "d".repeat(128),
            },
            relayHints: ["wss://input.example.com/"],
            authorProfile: {
                name: "Fixture author",
                displayName: "Fixture Author",
                picture: "",
                npub: nip19.npubEncode("c".repeat(64)),
                nprofile: nip19.nprofileEncode({
                    pubkey: "c".repeat(64),
                    relays: [],
                }),
            },
            channelContext: hasChannel
                ? {
                      eventId: "e".repeat(64),
                      relayHints: ["wss://verified.example.com/"],
                      channelRelays: ["wss://verified.example.com/"],
                      name: channelName,
                      about: "Deterministic channel preview",
                      picture: null,
                  }
                : null,
            channelCreatorPubkey: hasChannel ? "f".repeat(64) : null,
            channelCreatorProfile: null,
            channelPictureCacheEligible: hasChannel,
            channelQuery: hasChannel
                ? {
                      eventId: "e".repeat(64),
                      relayHints: ["wss://verified.example.com/"],
                  }
                : null,
        };
    }

    function resolveForId(eventId: string): ComposerTargetResolveResult {
        const interaction = interactionById.get(eventId);
        if (interaction) return { status: "resolved", target: { ...makeTarget(1, eventId), event: interaction,
            authorProfile: { name: "Outer fixture author", displayName: "", picture: "", npub: "", nprofile: "" } } };
        if (eventId === ids.sensitive) {
            return { status: "resolved", target: makeTarget(1, eventId, null, "") };
        }
        if (eventId === ids.sensitivePayload) {
            return { status: "resolved", target: makeTarget(36, eventId, null, "Sensitive payload") };
        }
        if (eventId === ids.kind40) {
            return { status: "resolved", target: makeTarget(40, eventId) };
        }
        if (eventId === ids.namelessChannel) {
            return {
                status: "resolved",
                target: makeTarget(40, eventId, null),
            };
        }
        if (eventId === ids.longNameChannel) {
            return {
                status: "resolved",
                target: makeTarget(40, eventId, "LongChannelName".repeat(40)),
            };
        }
        if (eventId === ids.kind42) {
            return { status: "resolved", target: makeTarget(42, eventId) };
        }
        if (eventId === ids.wrappingPost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    wrappingPostContent,
                ),
            };
        }
        if (eventId === ids.linkPost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    linkPostContent,
                ),
            };
        }
        if (eventId === ids.exactlyFiveLinePost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    exactlyFiveLinePostContent,
                ),
            };
        }
        if (eventId === ids.oversizedPost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    oversizedPostContent,
                ),
            };
        }
        if (eventId === ids.mediaPost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    mediaPostContent,
                ),
            };
        }
        if (eventId === ids.whitespacePost) {
            return {
                status: "resolved",
                target: makeTarget(
                    1,
                    eventId,
                    "Fixture channel",
                    whitespacePostContent,
                ),
            };
        }
        return { status: "resolved", target: makeTarget(1, eventId) };
    }

    const resolver = {
        resolve(params: { pointer: { eventId: string } }) {
            const eventId = params.pointer.eventId;
            let cancelled = false;
            resolverEventIds.push(eventId);
            const promise = eventId === ids.stale
                ? new Promise<ComposerTargetResolveResult>((resolve) => {
                    releaseStaleResolver = () => resolve(
                        cancelled ? { status: "cancelled" } : resolveForId(eventId),
                    );
                })
                : Promise.resolve().then(() => resolveForId(eventId));
            return {
                promise,
                cancel() {
                    cancelled = true;
                    if (eventId === ids.stale) cancelledResolverEventIds.push(eventId);
                },
            };
        },
    };

    function apply(
        action: ComposerTargetAction,
        target: ComposerEventTarget,
    ): boolean {
        applications = [...applications, { action, kind: target.kind, eventId: target.event?.id ?? "" }];
        return true;
    }

    const harness = {
        ready: false,
        seedReactionFixtures,
        relatedFetchIds,
        relatedCancelledIds,
        reposts,
        useReactionOwner(owner: boolean) { pubkeyHex = owner ? interactionEvents.reaction7.pubkey : null; },
        recoverRelated() { recoverMissing = true; },
        releaseRelated() { releaseHeld?.(); },
        inputs,
        linkTargetUrl,
        oversizedPostContentLength: oversizedPostContent.length,
        resolverEventIds,
        cancelledResolverEventIds,
        releaseStaleResolver() {
            if (!releaseStaleResolver) throw new Error("stale resolver was not started");
            releaseStaleResolver();
            releaseStaleResolver = null;
        },
        get applications() {
            return applications;
        },
    };
    (
        window as typeof window & {
            __COMPOSER_TARGET_HARNESS__?: typeof harness;
        }
    ).__COMPOSER_TARGET_HARNESS__ = harness;
    onMount(() => { void channelMetadataRepository.upsertResolvedChannel({
        channelEventId: relatedChannel.id, creatorPubkey: relatedChannel.pubkey, createEventCreatedAt: relatedChannel.created_at,
        quality: "verified-metadata", metadataLookup: "complete", name: "Related fixture channel", about: null, picture: null,
    }).then(() => { harness.ready = true; }); });
</script>

<svelte:head>
    <title>Composer Target Dialog Playwright Harness</title>
</svelte:head>

<div class="composer-target-playwright-harness">
    <HeaderComponent
        onResetPostContent={() => undefined}
        onShowDraftList={() => undefined}
        onChooseTarget={() => (show = true)}
        canResetPostContent={true}
        showMascot={false}
        showFlavorText={false}
    />
    <main>
        <p>Deterministic composer target fixture</p>
        <output aria-label="適用結果">
            {applications
                .map(({ action, kind }) => `${kind}:${action}`)
                .join(",")}
        </output>
    </main>
</div>

<ComposerTargetDialog
    {show}
    onClose={() => (show = false)}
    onApply={apply}
    rxNostr={fixtureRuntime}
    {resolver}
    {relatedResolver}
    {pubkeyHex}
    onRepostPost={async post => { reposts.push(post.eventId); return { success: true }; }}
/>

<style>
    :global(body) {
        min-width: 320px;
        min-height: 100vh;
        margin: 0;
    }

    main {
        padding: 16px;
    }
</style>
