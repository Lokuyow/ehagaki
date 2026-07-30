import {
    requestStaleReloadPrompt,
    staleAssetReloadState,
} from "../stores/staleAssetReloadStore.svelte";

export interface VitePreloadErrorEvent extends Event {
    payload?: unknown;
}

export function handleStaleAssetPreloadError(
    event: VitePreloadErrorEvent,
): boolean {
    if (!staleAssetReloadState.required) {
        return false;
    }

    event.preventDefault();
    requestStaleReloadPrompt();
    return true;
}

