import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";

/** Resolves a small app-owned static asset from the active runtime delivery base. */
export function resolveAppAssetUrl(path: string): string {
    const assetBase = getAppRuntimeEnvironment().assetBase;
    return assetBase ? new URL(path, assetBase).href : `./${path}`;
}
