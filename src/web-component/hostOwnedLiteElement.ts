import { EHagakiComposerElement } from "./element";

/**
 * The Lite entry keeps the public Custom Element API but uses the Host-owned
 * composition root. This is intentionally a build-time root, not a runtime
 * branch in the full application graph.
 */
export class EHagakiHostOwnedLiteComposerElement extends EHagakiComposerElement {
    protected override loadApp(): Promise<{ default: any }> {
        return import("../host-owned-composer-lite/HostOwnedComposerLiteApp.svelte");
    }

    protected override requiresHostOwnedConfiguration(): boolean {
        return true;
    }
}
