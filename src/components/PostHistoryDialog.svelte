<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { postHistoryRepository } from "../lib/storage/postHistoryRepository";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";
    import { toNevent } from "../lib/utils/nostrUtils";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";
    import { writeRelaysStore } from "../stores/relayStore.svelte";

    interface Props {
        show: boolean;
        onClose: () => void;
        pubkeyHex?: string | null;
    }

    let {
        show = $bindable(false),
        onClose,
        pubkeyHex = null,
    }: Props = $props();

    let posts = $state<PostHistoryRecord[]>([]);
    let copyState = $state<Record<string, "copied" | "failed" | undefined>>({});

    function handleClose() {
        show = false;
        onClose?.();
    }

    useDialogHistory(() => show, handleClose, true);

    $effect(() => {
        if (show) {
            void postHistoryRepository
                .getAll({ pubkeyHex })
                .then((loadedPosts) => {
                    if (show) posts = loadedPosts;
                });
        }
    });

    function formatPostedAt(postedAt: number): string {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(postedAt));
    }

    function buildPreview(content: string): string {
        const normalized = content.replace(/\s+/g, " ").trim();
        return normalized || " ";
    }

    function getMediaText(post: PostHistoryRecord): string {
        if (post.media.length === 0) return `${$_("postHistory.media")}: 0`;

        const imageCount = post.media.filter((item) =>
            item.mimeType?.startsWith("image/"),
        ).length;
        const videoCount = post.media.filter((item) =>
            item.mimeType?.startsWith("video/"),
        ).length;
        const otherCount = post.media.length - imageCount - videoCount;
        const parts = [
            imageCount > 0 ? `image ${imageCount}` : "",
            videoCount > 0 ? `video ${videoCount}` : "",
            otherCount > 0 ? `media ${otherCount}` : "",
        ].filter(Boolean);

        return `${$_("postHistory.media")}: ${parts.join(", ")}`;
    }

    function buildNevent(post: PostHistoryRecord): string {
        return toNevent({
            eventId: post.eventId,
            authorPubkey: post.pubkeyHex,
            kind: post.kind,
            acceptedRelays: post.acceptedRelays,
            relayHints: post.relayHints,
            writeRelays: writeRelaysStore.value,
        });
    }

    async function handleCopyNevent(post: PostHistoryRecord) {
        const nevent = buildNevent(post);
        const copied = nevent
            ? await tryCopyToClipboard(nevent, "nevent", navigator, window)
            : false;

        copyState = {
            ...copyState,
            [post.eventId]: copied ? "copied" : "failed",
        };

        setTimeout(() => {
            copyState = {
                ...copyState,
                [post.eventId]: undefined,
            };
        }, 1800);
    }
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("postHistory.title")}
    description={$_("postHistory.description")}
    contentClass="post-history-dialog"
    footerVariant="close-button"
    initialFocus="content"
>
    <div class="post-history-heading">
        <h3>{$_("postHistory.title")}</h3>
    </div>

    <div class="post-history-container">
        {#if posts.length === 0}
            <div class="empty-message">{$_("postHistory.empty")}</div>
        {:else}
            <ul class="post-history-list">
                {#each posts as post (post.eventId)}
                    <li class="post-history-item">
                        <div class="post-history-main">
                            <div class="post-preview">
                                {buildPreview(post.content)}
                            </div>
                            <div class="post-meta">
                                <span>
                                    {$_("postHistory.postedAt")}: {formatPostedAt(
                                        post.postedAt,
                                    )}
                                </span>
                                <span>
                                    {$_("postHistory.eventId")}: {shortenMiddle(
                                        post.eventId,
                                        8,
                                        6,
                                    )}
                                </span>
                                <span>{getMediaText(post)}</span>
                                {#if post.deletedAt}
                                    <span>{$_("postHistory.deleted")}</span>
                                {/if}
                            </div>
                        </div>
                        <div class="post-history-actions">
                            {#if copyState[post.eventId]}
                                <span
                                    class:copy-failed={copyState[
                                        post.eventId
                                    ] === "failed"}
                                >
                                    {copyState[post.eventId] === "copied"
                                        ? $_("postHistory.copied")
                                        : $_("postHistory.copyFailed")}
                                </span>
                            {/if}
                            <Button
                                className="copy-nevent-button"
                                variant="default"
                                shape="square"
                                ariaLabel={$_("postHistory.copyNevent")}
                                onClick={() => void handleCopyNevent(post)}
                            >
                                <div class="copy-icon svg-icon"></div>
                            </Button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button
                    {...props}
                    className="modal-close"
                    variant="default"
                    shape="square"
                    ariaLabel={$_("global.close")}
                >
                    <div
                        class="xmark-icon svg-icon"
                        aria-label={$_("global.close")}
                    ></div>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>

<style>
    :global(.post-history-dialog .dialog-content) {
        padding: 0;
    }

    .post-history-heading {
        width: 100%;
        padding: 18px 16px;
        border-bottom: 1px solid var(--border-hr);
    }

    .post-history-heading h3 {
        margin: 0;
        font-size: 1.25rem;
    }

    .post-history-container {
        width: 100%;
        min-height: 100px;
        overflow-y: auto;
    }

    .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        color: var(--text-muted);
        font-size: 1rem;
    }

    .post-history-list {
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .post-history-item {
        display: flex;
        align-items: stretch;
        gap: 8px;
        border-bottom: 1px solid var(--border-hr);
        padding: 12px;
    }

    .post-history-item:last-child {
        border-bottom: none;
    }

    .post-history-main {
        display: grid;
        gap: 8px;
        min-width: 0;
        flex: 1;
    }

    .post-preview {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text);
        font-size: 1rem;
    }

    .post-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 10px;
        color: var(--text-muted);
        font-size: 0.82rem;
        line-height: 1.3;
    }

    .post-history-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text-muted);
        font-size: 0.82rem;
        flex-shrink: 0;
    }

    .copy-failed {
        color: var(--danger);
    }

    :global(.copy-nevent-button) {
        width: 44px;
        min-height: 44px;
        --btn-bg: var(--dialog);
    }

    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }

    .xmark-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
        width: 20px;
        height: 20px;
    }
</style>
