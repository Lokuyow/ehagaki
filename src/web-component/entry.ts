import { EHagakiComposerElement } from "./fullElement";
import { registerComposerDistribution } from "./distributionRegistration";
import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

export { EHagakiComposerElement, EHAGAKI_COMPOSER_TAG_NAME };
export * from "./types";

registerComposerDistribution("full", EHagakiComposerElement);
