import { EHagakiComposerElement } from "./fullElement";
import { registerComposerDistribution } from "./distributionRegistration";
import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

export { EHagakiComposerElement };
export {
    EHAGAKI_COMPOSER_API_VERSION,
    EHAGAKI_COMPOSER_TAG_NAME,
} from "./types";
export type {
    EHagakiComposerContext,
    EHagakiComposerInitializationErrorDetail,
    EHagakiComposerPostErrorDetail,
    EHagakiComposerPostSuccessDetail,
    EHagakiComposerReadyDetail,
    EHagakiComposerSettings,
} from "./types";

registerComposerDistribution("full", EHagakiComposerElement);
