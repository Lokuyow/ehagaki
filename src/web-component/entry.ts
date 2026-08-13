import { EHagakiComposerElement } from "./element";
import { EHAGAKI_COMPOSER_TAG_NAME } from "./types";

export { EHagakiComposerElement, EHAGAKI_COMPOSER_TAG_NAME };
export * from "./types";

if (!customElements.get(EHAGAKI_COMPOSER_TAG_NAME)) {
    customElements.define(EHAGAKI_COMPOSER_TAG_NAME, EHagakiComposerElement);
}
