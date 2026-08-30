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
    EHagakiComposerEditorEmptyChangeDetail,
    EHagakiComposerInitializationErrorDetail,
    EHagakiComposerPostErrorDetail,
    EHagakiComposerPostSuccessDetail,
    EHagakiComposerReadyDetail,
    EHagakiComposerSettings,
    HostRelayConfig,
    HostRelayConfigEntry,
} from "./types";

registerComposerDistribution("full", EHagakiComposerElement);
