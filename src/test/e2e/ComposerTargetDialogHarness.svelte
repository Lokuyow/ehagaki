<script lang="ts">
    import { nip19 } from "nostr-tools";
    import ComposerTargetDialog from "../../components/ComposerTargetDialog.svelte";
    import HeaderComponent from "../../components/HeaderComponent.svelte";
    import type {
        ComposerResolvedTarget,
        ComposerTargetResolveResult,
    } from "../../lib/composerTargetResolver";
    import type {
        ComposerEventTarget,
    } from "../../lib/composerTargetApplyController";
    import type { ComposerTargetAction } from "../../lib/composerTargetUtils";

    const ids = {
        kind1: "1".repeat(64),
        kind40: "4".repeat(64),
        kind42: "2".repeat(64),
        stale: "a".repeat(64),
        namelessChannel: "8".repeat(64),
        longNameChannel: "9".repeat(64),
    };
    const inputs = {
        kind1: nip19.noteEncode(ids.kind1),
        kind40: nip19.noteEncode(ids.kind40),
        kind42: nip19.noteEncode(ids.kind42),
        stale: nip19.noteEncode(ids.stale),
        namelessChannel: nip19.noteEncode(ids.namelessChannel),
        longNameChannel: nip19.noteEncode(ids.longNameChannel),
        unsupported: nip19.npubEncode("b".repeat(64)),
        nsec: nip19.nsecEncode(Uint8Array.from({ length: 32 }, () => 7)),
    };

    let show = $state(false);
    let applications = $state<Array<{ action: ComposerTargetAction; kind: number }>>([]);

    function makeTarget(
        kind: 1 | 40 | 42,
        eventId: string,
        channelName: string | null = "Fixture channel",
    ): ComposerResolvedTarget {
        const hasChannel = kind !== 1;
        return {
            event: {
                id: eventId,
                pubkey: "c".repeat(64),
                created_at: 1,
                kind,
                tags: [],
                content: kind === 40
                    ? JSON.stringify({ name: "Fixture channel" })
                    : `Fixture kind ${kind}`,
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
            channelQuery: hasChannel
                ? {
                    eventId: "e".repeat(64),
                    relayHints: ["wss://verified.example.com/"],
                }
                : null,
        };
    }

    function resolveForId(eventId: string): ComposerTargetResolveResult {
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
        return { status: "resolved", target: makeTarget(1, eventId) };
    }

    const resolver = {
        resolve(params: { pointer: { eventId: string } }) {
            let cancelled = false;
            let timer: ReturnType<typeof setTimeout> | undefined;
            const delay = params.pointer.eventId === ids.stale ? 700 : 20;
            const promise = new Promise<ComposerTargetResolveResult>((resolve) => {
                timer = setTimeout(() => {
                    resolve(cancelled
                        ? { status: "cancelled" }
                        : resolveForId(params.pointer.eventId));
                }, delay);
            });
            return {
                promise,
                cancel() {
                    cancelled = true;
                    if (timer !== undefined) clearTimeout(timer);
                },
            };
        },
    };

    function apply(
        action: ComposerTargetAction,
        target: ComposerEventTarget,
    ): boolean {
        applications = [...applications, { action, kind: target.kind }];
        return true;
    }

    const harness = {
        ready: true,
        inputs,
        get applications() {
            return applications;
        },
    };
    (window as typeof window & {
        __COMPOSER_TARGET_HARNESS__?: typeof harness;
    }).__COMPOSER_TARGET_HARNESS__ = harness;
</script>

<svelte:head>
    <title>Composer Target Dialog Playwright Harness</title>
</svelte:head>

<div class="composer-target-playwright-harness">
    <HeaderComponent
        onResetPostContent={() => undefined}
        onSaveDraft={async () => true}
        onShowDraftList={() => undefined}
        onChooseTarget={() => show = true}
        canSaveDraft={true}
        canResetPostContent={true}
        showMascot={false}
        showFlavorText={false}
    />
    <main>
        <p>Deterministic composer target fixture</p>
        <output aria-label="適用結果">
            {applications.map(({ action, kind }) => `${kind}:${action}`).join(",")}
        </output>
    </main>
</div>

<ComposerTargetDialog
    {show}
    onClose={() => show = false}
    onApply={apply}
    rxNostr={{} as never}
    {resolver}
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
