<script lang="ts">
    import {
        buildChannelPictureProxyUrl,
        normalizeChannelPictureUrl,
    } from "../lib/channelPictureUrlUtils";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";

    interface Props {
        eventId: string;
        pictureUrl: string;
        cacheEligible: boolean;
        alt?: string;
        className?: string;
    }

    let {
        eventId,
        pictureUrl,
        cacheEligible,
        alt = "",
        className = "",
    }: Props = $props();

    // Snapshot control once. controllerchange must not switch a live image and
    // cause a second request; a later component mount can use the proxy.
    const serviceWorkerControlledAtMount = getAppRuntimeEnvironment().serviceWorkerEnabled
        && typeof navigator !== "undefined"
        && !!navigator.serviceWorker?.controller;
    let failedProxyUrl = $state<string | null>(null);
    let normalizedUrl = $derived(normalizeChannelPictureUrl(pictureUrl) ?? "");
    let proxyUrl = $derived(
        serviceWorkerControlledAtMount && cacheEligible && normalizedUrl
            ? buildChannelPictureProxyUrl({
                eventId,
                pictureUrl: normalizedUrl,
                baseUrl: import.meta.env.BASE_URL,
            }) ?? ""
            : "",
    );
    let sourceUrl = $derived(
        proxyUrl && failedProxyUrl !== proxyUrl ? proxyUrl : normalizedUrl,
    );

    function handleError(): void {
        if (proxyUrl && sourceUrl === proxyUrl) failedProxyUrl = proxyUrl;
    }
</script>

{#if sourceUrl}
    <img src={sourceUrl} {alt} class={className} onerror={handleError} />
{/if}
