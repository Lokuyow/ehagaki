<script lang="ts">
    import { onMount } from "svelte";
    import { createAppComponentLoaders } from "../../lib/appComponentLoaders";
    import { ehagakiDb } from "../../lib/storage/ehagakiDb";
    import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";

    const owner = "a".repeat(64), eventId = "b".repeat(64);
    let History = $state<typeof import("../../components/PostHistoryDialog.svelte").default | null>(null);
    let ready = $state(false), open = $state(false);
    let trigger = $state<HTMLButtonElement | null>(null);
    const ignore = () => undefined;
    const loaders = createAppComponentLoaders({
        isStaleAssetReloadRequired: () => false, onLoadFailure: ignore,
        setPostComponent: ignore, setLoginDialogComponent: ignore, setProfileComponent: ignore,
        setSettingsDialogComponent: ignore, setWelcomeDialogComponent: ignore, setDraftListDialogComponent: ignore,
        setPostHistoryDialogComponent: (component) => { History = component; },
        setComposerTargetDialogComponent: ignore, setCustomEmojiPickerComponent: ignore,
    });
    const control = {
        entered: false,
        release: null as (() => void) | null,
        hold: false,
        arm() { this.hold = true; this.entered = false; },
    };
    onMount(() => {
        const read = postHistoryRepository.getLatestVisibleChunk.bind(postHistoryRepository);
        postHistoryRepository.getLatestVisibleChunk = async (options) => {
            if (control.hold) {
                control.hold = false; control.entered = true;
                await new Promise<void>((resolve) => { control.release = resolve; });
                control.release = null;
            }
            return read(options);
        };
        Reflect.set(window, "__HISTORY_OPENING__", control);
        const now = Date.now();
        void ehagakiDb.postHistory.put({ id: eventId, eventId, pubkeyHex: owner, kind: 1,
            content: "Opening fixture post", tags: [], createdAt: Math.floor(now / 1000), postedAt: now,
            relayHints: [], acceptedRelays: [], media: [], rawEvent: null, updatedAt: now, schemaVersion: 2 })
            .then(() => { ready = true; });
        return () => { postHistoryRepository.getLatestVisibleChunk = read; };
    });
    function launch() { open = true; void loaders.loadPostHistoryDialog(); }
</script>

<button bind:this={trigger} data-testid="history-launch" disabled={!ready}
    onmouseenter={() => void loaders.preloadPostHistoryDialog()}
    onfocus={() => void loaders.preloadPostHistoryDialog()}
    onpointerdown={() => void loaders.preloadPostHistoryDialog()} onclick={launch}>履歴</button>
{#if open && History}
    <History show={open} onClose={() => { open = false; }} pubkeyHex={owner} returnFocus={trigger} />
{/if}
