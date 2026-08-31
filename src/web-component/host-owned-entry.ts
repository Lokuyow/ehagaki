import { registerComposerDistribution } from "./distributionRegistration";
import { EHagakiHostOwnedLiteComposerElement } from "./hostOwnedLiteElement";
import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

export { EHagakiHostOwnedLiteComposerElement as EHagakiComposerElement, EHAGAKI_COMPOSER_TAG_NAME };
export {
    EHAGAKI_COMPOSER_API_VERSION,
} from "./types";
export type {
    EHagakiComposerContext,
    EHagakiComposerEditorEmptyChangeDetail,
    EHagakiComposerInitializationErrorDetail,
    EHagakiComposerPostErrorDetail,
    EHagakiComposerPostSuccessDetail,
    EHagakiComposerPreferredHeightChangeDetail,
    EHagakiComposerReadyDetail,
    EHagakiComposerSettings,
    EHagakiComposerContextReference,
    EHagakiComposerContextSnapshot,
    EHagakiComposerOutput,
    EHagakiHostSubmissionResult,
    EHagakiHostMediaMetadata,
    EHagakiHostMediaUploadResult,
    EHagakiHostSubmitOptions,
    EHagakiHostSubmitShortcut,
    EHagakiHostSubmitShortcutModifier,
    EHagakiHostOwnedComposerOptions,
    EHagakiCustomEmojiCatalogItem,
} from "./types";

registerComposerDistribution("host-owned-lite", EHagakiHostOwnedLiteComposerElement);
