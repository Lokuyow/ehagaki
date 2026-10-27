<script lang="ts">
    import { getProfileFallbackAvatar } from "../lib/profileFallbackAvatar";
    import { untrack } from "svelte";
    import { Avatar } from "bits-ui";
    import type { HTMLImgAttributes } from "svelte/elements";
    import {
        ensureProfilePictureMarker,
        isSameOriginProfilePictureUrl,
    } from "../lib/profilePictureUrlUtils";

    type AvatarImageStatus = "loading" | "loaded" | "error";

    interface Props {
        pubkeyHex?: string;
        displayName?: string;
        name?: string;
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
        pubkeyHex = "",
        displayName = "",
        name = "",
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

    let fallbackAvatar = $derived(getProfileFallbackAvatar({ pubkeyHex, displayName, name }));
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
    let shouldExposeFallbackAsImage = $derived(
        avatarLoadingStatus === "error" && Boolean(fallbackAriaLabel),
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
        const status = !safeSrc ? "error" : loadingStatus ?? (preferInstantDisplay ? "loaded" : "loading");
        // Image events must not subscribe this source-reset effect to the current status.
        untrack(() => setAvatarLoadingStatus(status));
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
        role={shouldExposeFallbackAsImage ? "img" : undefined}
        aria-label={shouldExposeFallbackAsImage ? fallbackAriaLabel : undefined}
        aria-hidden={shouldExposeFallbackAsImage ? undefined : "true"}
    >
        {#if fallbackAvatar}
            <img class="profile-avatar-initial" src={fallbackAvatar.dataUrl} alt="" aria-hidden="true" />
        {:else}
            <div class="profile-avatar-fallback-icon svg-icon" aria-hidden="true"></div>
        {/if}
    </Avatar.Fallback>
</Avatar.Root>

<style>
    .profile-avatar-initial {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }

    :global(.profile-avatar-fallback) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        opacity: 1;

        .profile-avatar-fallback-icon {
            mask-image: url("/icons/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
