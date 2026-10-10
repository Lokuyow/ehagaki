import { EHagakiComposerElement } from "./fullElement";
import { registerComposerDistribution } from "./distributionRegistration";
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
    EHagakiUploadErrorName,
    EHagakiUploadOptions,
    EHagakiUploadResult,
    HostRelayConfig,
    HostRelayConfigEntry,
} from "./types";

registerComposerDistribution("full", EHagakiComposerElement);
