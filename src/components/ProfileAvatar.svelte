<script lang="ts">
    import { Avatar } from "bits-ui";
    import type { HTMLImgAttributes } from "svelte/elements";

    type AvatarImageStatus = "loading" | "loaded" | "error";

    interface Props {
        src?: string;
        alt?: string;
        rootClassName?: string;
        imageClassName?: string;
        fallbackClassName?: string;
        fallbackAriaLabel?: string;
        loadingStatus?: AvatarImageStatus;
        onLoadingStatusChange?: (status: AvatarImageStatus) => void;
        crossorigin?: HTMLImgAttributes["crossorigin"];
        referrerpolicy?: HTMLImgAttributes["referrerpolicy"];
        delayMs?: number;
    }

    let {
        src = "",
        alt = "",
        rootClassName = "",
        imageClassName = "",
        fallbackClassName = "",
        fallbackAriaLabel = "User",
        loadingStatus = undefined,
        onLoadingStatusChange = undefined,
        crossorigin = undefined,
        referrerpolicy = undefined,
        delayMs = 0,
    }: Props = $props();
</script>

<Avatar.Root
    class={rootClassName}
    {loadingStatus}
    {onLoadingStatusChange}
    {delayMs}
>
    {#if src}
        <Avatar.Image
            {src}
            {alt}
            class={imageClassName}
            loading="lazy"
            {crossorigin}
            {referrerpolicy}
        />
    {/if}
    <Avatar.Fallback class={`profile-avatar-fallback ${fallbackClassName}`}>
        <div
            class="profile-avatar-fallback-icon svg-icon"
            aria-label={fallbackAriaLabel}
        ></div>
    </Avatar.Fallback>
</Avatar.Root>

<style>
    :global(.profile-avatar-fallback) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        .profile-avatar-fallback-icon {
            mask-image: url("/icons/circle-user-solid-full.svg");
            width: 100%;
            height: 100%;
        }
    }
</style>
