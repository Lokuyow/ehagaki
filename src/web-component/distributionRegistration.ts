import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

type ComposerElementConstructor = CustomElementConstructor;

const distributionKey = Symbol.for("ehagaki-composer.distribution");

/**
 * A document may load exactly one composer distribution. Checking before
 * customElements.define makes full/Lite conflicts deterministic rather than
 * silently retaining whichever module happened to evaluate first.
 */
export function registerComposerDistribution(
    distribution: "full" | "host-owned-lite",
    element: ComposerElementConstructor,
): void {
    const globalObject = globalThis as typeof globalThis & {
        [distributionKey]?: "full" | "host-owned-lite";
    };
    const registered = globalObject[distributionKey];
    if (registered && registered !== distribution) {
        throw new Error(
            `Cannot import the ${distribution} eHagaki Composer distribution after ${registered} in the same document.`,
        );
    }
    globalObject[distributionKey] = distribution;

    const existing = customElements.get(EHAGAKI_COMPOSER_TAG_NAME);
    if (!existing) {
        customElements.define(EHAGAKI_COMPOSER_TAG_NAME, element);
        return;
    }
    if (existing !== element) {
        throw new Error("ehagaki-composer is already defined by a different distribution.");
    }
}
