import type {
    EmbedComposerSetContextPayload,
    EmbedSettingsSetPayload,
} from "../lib/embedProtocol";
import type { AppLayoutMode } from "../lib/appRuntimeEnvironment";

export const EHAGAKI_COMPOSER_TAG_NAME = "ehagaki-composer";
export const EHAGAKI_COMPOSER_API_VERSION = 1;

export type EHagakiComposerLayoutMode = AppLayoutMode;

export type EHagakiComposerContext = EmbedComposerSetContextPayload;
export type EHagakiComposerSettings = EmbedSettingsSetPayload;

export interface EHagakiComposerReadyDetail {
    apiVersion: typeof EHAGAKI_COMPOSER_API_VERSION;
}

export interface EHagakiComposerInitializationErrorDetail {
    code: "initialization_failed" | "multiple_instances_unsupported" | "disconnected";
    message: string;
}

export interface EHagakiComposerPostSuccessDetail {
    eventId?: string;
    replyToEventId?: string;
    quotedEventIds?: string[];
}

export interface EHagakiComposerPostErrorDetail {
    code: string;
    message?: string;
}
