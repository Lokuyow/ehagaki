import { registerComposerDistribution } from "./distributionRegistration";
import { EHagakiHostOwnedLiteComposerElement } from "./hostOwnedLiteElement";
import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

export { EHagakiHostOwnedLiteComposerElement as EHagakiComposerElement, EHAGAKI_COMPOSER_TAG_NAME };
export * from "./types";

registerComposerDistribution("host-owned-lite", EHagakiHostOwnedLiteComposerElement);
