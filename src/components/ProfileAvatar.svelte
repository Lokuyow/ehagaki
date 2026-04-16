<script lang="ts">
    import { Avatar } from "bits-ui";
    import type { HTMLImgAttributes } from "svelte/elements";
    import {
        ensureProfilePictureMarker,
        isSameOriginProfilePictureUrl,
    } from "../lib/profilePictureUrlUtils";

    type AvatarImageStatus = "loading" | "loaded" | "error";

    interface Props {
        src?: string;
        alt?: string;
        rootClassName?: string;
        imageClassName?: string;
        fallbackClassName?: string;
        fallbackAriaLabel?: string;
        fallbackDelayMs?: number;
        preferInstantDisplay?: boolean;
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
        fallbackDelayMs = 120,
        preferInstantDisplay = true,
        loadingStatus = undefined,
        onLoadingStatusChange = undefined,
        crossorigin = undefined,
        referrerpolicy = undefined,
        delayMs = 0,
    }: Props = $props();

    let safeSrc = $derived(ensureProfilePictureMarker(src));
    let effectiveCrossorigin = $derived(
        crossorigin ??
            (safeSrc && isSameOriginProfilePictureUrl(safeSrc)
                ? "anonymous"
                : undefined),
    );
    let effectiveReferrerPolicy = $derived(
        referrerpolicy ?? (safeSrc ? "no-referrer" : undefined),
    );

    const getInitialAvatarStatus = (): AvatarImageStatus => {
        if (loadingStatus !== undefined) return loadingStatus;
        if (!safeSrc) return "error";
        return preferInstantDisplay ? "loaded" : "loading";
    };

    let avatarLoadingStatus = $state<AvatarImageStatus>(
        getInitialAvatarStatus(),
    );

    function setAvatarLoadingStatus(status: AvatarImageStatus) {
        if (avatarLoadingStatus === status) return;
        avatarLoadingStatus = status;
        onLoadingStatusChange?.(status);
    }

    function handleRootLoadingStatusChange(status: AvatarImageStatus) {
        if (loadingStatus !== undefined) {
            onLoadingStatusChange?.(status);
            return;
        }
        setAvatarLoadingStatus(status);
    }

    function handleImageLoad() {
        if (loadingStatus === undefined) {
            setAvatarLoadingStatus("loaded");
        }
    }

    function handleImageError() {
        if (loadingStatus === undefined) {
            setAvatarLoadingStatus("error");
        }
    }

    $effect(() => {
        if (!safeSrc) {
            setAvatarLoadingStatus("error");
            return;
        }

        if (loadingStatus !== undefined) {
            setAvatarLoadingStatus(loadingStatus);
            return;
        }

        setAvatarLoadingStatus(preferInstantDisplay ? "loaded" : "loading");
    });
</script>

<Avatar.Root
    class={rootClassName}
    loadingStatus={avatarLoadingStatus}
    onLoadingStatusChange={handleRootLoadingStatusChange}
    {delayMs}
>
    {#if safeSrc}
        <Avatar.Image
            src={safeSrc}
            {alt}
            class={imageClassName}
            loading="lazy"
            crossorigin={effectiveCrossorigin}
            referrerpolicy={effectiveReferrerPolicy}
            onload={handleImageLoad}
            onerror={handleImageError}
        />
    {/if}
    <Avatar.Fallback
        class={`profile-avatar-fallback ${fallbackClassName}`}
        style={`--profile-avatar-fallback-delay: ${fallbackDelayMs}ms;`}
    >
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
        opacity: 1;

        .profile-avatar-fallback-icon {
            mask-image: url("/icons/circle-user-solid-full.svg");
            width: 100%;
            height: 100%;
        }
    }

    :global(.profile-avatar-fallback[data-status="loading"]) {
        opacity: 0;
        animation: profile-avatar-fallback-reveal 0s linear
            var(--profile-avatar-fallback-delay, 120ms) forwards;
    }

    :global(.profile-avatar-fallback[data-status="loaded"]) {
        opacity: 0;
        animation: none;
    }

    :global(.profile-avatar-fallback[data-status="error"]) {
        opacity: 1;
        animation: none;
    }

    @keyframes profile-avatar-fallback-reveal {
        to {
            opacity: 1;
        }
    }
</style>
