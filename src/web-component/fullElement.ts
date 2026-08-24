import { EHagakiComposerElement as ComposerElementBase } from "./element";

/** The existing full distribution keeps the regular application root. */
export class EHagakiComposerElement extends ComposerElementBase {
    protected override loadApp(): Promise<{ default: any }> {
        return import("../App.svelte");
    }
}
