<script lang="ts">
    import type {
        PostHistoryPreviewContent as PostHistoryPreviewContentData,
        PostHistoryPreviewSegment,
    } from "../lib/postHistoryDialogUtils";
    import TextLinkSegments from "./TextLinkSegments.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";
    import { getProfileMentionPreview } from "../lib/profileMentionPreviewContext";
    import { profileMentionLabel, shortenProfileMentionLabel } from "../lib/profileMention";
    import { buildHashtagExternalClientUrl, buildProfileExternalClientUrl } from "../lib/postHistoryExternalClient";
    import { settingsStore } from "../stores/settingsStore.svelte";

    type EmojiLoadState = "loading" | "ready" | "failed";
    type EmojiImageMeta = {
        aspectRatio: number;
    };
    type PreviewRefAction = (
        node: HTMLDivElement,
        eventId: string,
    ) => { destroy?: () => void } | void;
    import { untrack, type Snippet } from "svelte";

    interface Props {
        previewContent: PostHistoryPreviewContentData;
        textOverlay?: Snippet;
        emojiLoadStateByUrl?: Record<string, EmojiLoadState | undefined>;
        emojiImageMetaByUrl?: Record<string, EmojiImageMeta | undefined>;
        previewCollapseAction?: PreviewRefAction;
        previewCollapseEventId?: string;
        previewContentId?: string;
        isCollapsed?: boolean;
        emojiSize?: number;
        fontSize?: string;
        lineHeight?: number;
        contentClass?: string;
        collapsedContentClass?: string;
        kind?: number;
    }

    let {
        previewContent,
        textOverlay = undefined,
        emojiLoadStateByUrl = {},
        emojiImageMetaByUrl = {},
        previewCollapseAction = (() => ({})) as PreviewRefAction,
        previewCollapseEventId = "",
        previewContentId = undefined,
        isCollapsed = false,
        emojiSize = 30,
        fontSize = "1rem",
        lineHeight = 1.5,
        contentClass = "",
        collapsedContentClass = "",
        kind = undefined,
    }: Props = $props();

    const emojiSlotWidthByUrl = new Map<string, number>();
    const mentionProfiles = getProfileMentionPreview();
    const externalClient = $derived({
        client: settingsStore.externalNostrClient,
        customUrlTemplate: settingsStore.externalNostrClientCustomUrl,
    });

    function isTextOrEmojiSegment(
        segment: PostHistoryPreviewSegment,
    ): segment is Exclude<PostHistoryPreviewSegment, { type: "media" }> {
        return segment.type !== "media";
    }

    const textSegments = $derived.by(() =>
        previewContent.segments.filter(isTextOrEmojiSegment),
    );

    $effect(() => {
        const mentions = textSegments.flatMap(segment => segment.type === "mention" ? [segment.profile] : []);
        if (mentions.length) untrack(() => mentionProfiles?.load(mentions));
    });

    const hasRenderableText = $derived.by(() =>
        textSegments.some(
            (segment) =>
                segment.type === "emoji" ||
                segment.type === "link" ||
                segment.type === "mention" ||
                segment.type === "hashtag" ||
                (segment.type === "text" && segment.text.trim().length > 0),
        ),
    );

    function isEmojiReady(url: string): boolean {
        return emojiLoadStateByUrl[url] === "ready";
    }

    function hasEmojiFailed(url: string): boolean {
        return emojiLoadStateByUrl[url] === "failed";
    }

    function formatPixelValue(value: number): string {
        return Number.isInteger(value)
            ? `${value}`
            : value
                  .toFixed(6)
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d*?)0+$/, "$1");
    }

    function getEmojiSlotStyle(url: string): string {
        let slotWidth = emojiSlotWidthByUrl.get(url);
        if (slotWidth === undefined) {
            const aspectRatio = emojiImageMetaByUrl[url]?.aspectRatio;
            const hasAspectRatio =
                typeof aspectRatio === "number" &&
                Number.isFinite(aspectRatio) &&
                aspectRatio > 0;
            slotWidth = hasAspectRatio
                ? emojiSize * aspectRatio
                : emojiSize;
            emojiSlotWidthByUrl.set(url, slotWidth);
        }

        return [
            `width: ${formatPixelValue(slotWidth)}px;`,
            `height: ${emojiSize}px;`,
            "vertical-align: bottom;",
        ].join(" ");
    }
</script>

<div
    class="post-history-preview-content"
    style={`--post-content-font-size: ${fontSize}; --post-content-line-height: ${lineHeight};`}
>
    {#if hasRenderableText}
        <div
            id={previewContentId}
            class={[
                "post-history-preview-text",
                contentClass,
                isCollapsed ? "post-history-preview-text-collapsed" : "",
                isCollapsed ? collapsedContentClass : "",
            ]
                .filter(Boolean)
                .join(" ")}
            use:previewCollapseAction={previewCollapseEventId}
        >
            {#each textSegments as segment, index (index)}
                {#if segment.type === "text" || segment.type === "link"}
                    <TextLinkSegments segments={[segment]} />
                {:else if segment.type === "mention"}
                    {@const pubkey = segment.profile.pubkey}
                    {@const profile = mentionProfiles?.read(pubkey)}
                    {@const name = profileMentionLabel(pubkey, profile)}
                    {@const label = shortenProfileMentionLabel(name)}
                    <a class="profile-mention" href={buildProfileExternalClientUrl(segment.profile, externalClient)} target="_blank" rel="noopener noreferrer"
                        title={name === label ? undefined : `@${name}`}><span class="profile-mention-prefix"><span class="profile-mention-avatar" aria-hidden="true"><ProfileAvatar
                            pubkeyHex={pubkey} displayName={profile?.displayName} name={profile?.name} src={profile?.picture}
                            fallbackAriaLabel="" fallbackDelayMs={0} rootClassName="profile-mention-avatar-root"
                            imageClassName="profile-mention-avatar-image" /></span>@</span>{label}</a>
                {:else if segment.type === "hashtag"}
                    {@const href = buildHashtagExternalClientUrl(segment.hashtag, externalClient, kind)}
                    {#if href}
                        <a class="hashtag-link" {href} target="_blank" rel="noopener noreferrer">#{segment.hashtag}</a>
                    {:else}
                        <span>#{segment.hashtag}</span>
                    {/if}
                {:else if hasEmojiFailed(segment.url)}
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <span
                        class="post-history-custom-emoji-slot post-history-custom-emoji-failed"
                        style={getEmojiSlotStyle(segment.url)}
                        role="img"
                        tabindex="0"
                        aria-label={segment.rawShortcodeText}
                        title={segment.rawShortcodeText}
                    >
                        {segment.rawShortcodeText}
                    </span>
                {:else}
                    <span
                        class="post-history-custom-emoji-slot"
                        style={getEmojiSlotStyle(segment.url)}
                    >
                        {#if isEmojiReady(segment.url)}
                            <img
                                src={segment.url}
                                alt={segment.rawShortcodeText}
                                title={segment.rawShortcodeText}
                                class="post-history-custom-emoji"
                                draggable="false"
                                loading="lazy"
                                decoding="async"
                            />
                        {:else}
                            <span
                                class="post-history-custom-emoji-placeholder"
                                aria-hidden="true"
                            ></span>
                        {/if}
                    </span>
                {/if}
            {/each}
        </div>
        {@render textOverlay?.()}
    {/if}
</div>

<style>
    .profile-mention,
    .hashtag-link {
        overflow-wrap: anywhere;
    }
    /* Keeps the icon beside "@" and stops the body's pre-wrap from adding a line inside the avatar. */
    .profile-mention-prefix {
        white-space: nowrap;
    }
    .profile-mention-avatar {
        display: inline-block;
        width: 1.25em;
        height: 1.25em;
        margin-inline-end: 0.2em;
        vertical-align: -0.25em;
    }
    .profile-mention-avatar :global(.profile-mention-avatar-root) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
    }
    .profile-mention-avatar :global(.profile-mention-avatar-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .post-history-preview-content {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .post-history-preview-text {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        font-size: var(--post-content-font-size, 1rem);
        line-height: var(--post-content-line-height, 1.5);
    }

    .post-history-preview-text-collapsed {
        max-height: calc(5 * var(--post-content-line-height, 1.5) * 1em);
        overflow: hidden;
    }

    .post-history-custom-emoji-slot {
        display: inline-grid;
        margin: 0;
        padding: 0;
    }

    .post-history-custom-emoji,
    .post-history-custom-emoji-placeholder {
        width: 100%;
        height: 100%;
    }

    .post-history-custom-emoji {
        display: block;
        margin: 0;
        padding: 0;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    .post-history-custom-emoji-failed {
        display: inline-grid;
        place-items: center;
        overflow: hidden;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
        font-size: 0.45em;
        line-height: 1;
        vertical-align: bottom;
        white-space: nowrap;
        cursor: help;
    }

    .post-history-custom-emoji-placeholder {
        display: block;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
    }
</style>
