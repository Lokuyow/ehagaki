<script lang="ts">
    import { Avatar } from "bits-ui";
    import { untrack } from "svelte";
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
        showLoadingIndicator?: boolean;
        pending?: boolean;
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
        showLoadingIndicator = false,
        pending = false,
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
        return preferInstantDisplay && !showLoadingIndicator ? "loaded" : "loading";
    };

    let avatarLoadingStatus = $state<AvatarImageStatus>(
        getInitialAvatarStatus(),
    );
    let fallbackIsLoading = $derived(showLoadingIndicator && (
        avatarLoadingStatus === "loading" || (pending && !safeSrc)
    ));
    let shouldExposeFallbackAsImage = $derived(
        (avatarLoadingStatus === "error" || fallbackIsLoading) && Boolean(fallbackAriaLabel),
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

    $effect.pre(() => {
        const nextStatus = !safeSrc ? "error" : loadingStatus
            ?? (preferInstantDisplay && !showLoadingIndicator ? "loaded" : "loading");
        // Reset for new inputs, without resetting a completed load/error event.
        untrack(() => setAvatarLoadingStatus(nextStatus));
    });
</script>

<Avatar.Root
    class={rootClassName}
    loadingStatus={avatarLoadingStatus}
    onLoadingStatusChange={handleRootLoadingStatusChange}
    {delayMs}
    aria-busy={fallbackIsLoading ? "true" : undefined}
>
    {#if safeSrc}
        <Avatar.Image
            src={safeSrc}
            {alt}
            class={imageClassName}
            loading={showLoadingIndicator ? "eager" : "lazy"}
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
        data-loading={fallbackIsLoading ? "true" : undefined}
    >
        <div
            class="profile-avatar-fallback-icon svg-icon"
            aria-hidden="true"
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

    :global(.profile-avatar-fallback[data-loading="true"]) {
        opacity: 1;
        animation: profile-avatar-loading-pulse 1.6s ease-in-out infinite;
    }

    @keyframes profile-avatar-loading-pulse {
        50% {
            opacity: 0.4;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(.profile-avatar-fallback[data-loading="true"]) {
            animation: none;
            outline: 1px dotted currentColor;
            outline-offset: -1px;
            border-radius: 50%;
        }
    }

    @keyframes profile-avatar-fallback-reveal {
        to {
            opacity: 1;
        }
    }
</style>
