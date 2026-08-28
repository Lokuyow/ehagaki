import type {
    EmbedComposerSetContextPayload,
    EmbedSettingsSetPayload,
} from "../lib/embedProtocol";
import type { HostRelayConfig, HostRelayConfigEntry } from "../lib/hostRelayConfig";

export const EHAGAKI_COMPOSER_TAG_NAME = "ehagaki-composer";
export const EHAGAKI_COMPOSER_API_VERSION = 1;

export type EHagakiComposerContext = EmbedComposerSetContextPayload;
export type EHagakiComposerSettings = EmbedSettingsSetPayload;
export type { HostRelayConfig, HostRelayConfigEntry };

/** A reply, quote, or channel value captured with Host-owned submission. */
export interface EHagakiComposerContextReference {
    readonly eventId: string;
    readonly relayHints: readonly string[];
    readonly authorPubkey: string | null;
}

export interface EHagakiComposerContextSnapshot {
    readonly reply: EHagakiComposerContextReference | null;
    readonly quotes: readonly EHagakiComposerContextReference[];
    readonly channel: {
        readonly eventId: string;
        readonly relayHints: readonly string[];
        readonly channelRelays?: readonly string[];
    } | null;
}

/**
 * The editable composer result. It deliberately is not a Nostr event: the
 * embedding host owns event shape, signing, tags that establish references,
 * and publication.
 */
export interface EHagakiComposerOutput {
    readonly content: string;
    readonly tags: readonly (readonly string[])[];
    readonly context: EHagakiComposerContextSnapshot;
}

export interface EHagakiHostSubmissionResult {
    /** Optional host-assigned Nostr event id for the existing success event. */
    eventId?: string;
}

export interface EHagakiHostMediaMetadata {
    originalName: string;
    originalSize: number;
    originalType: string;
    processedName: string;
    processedSize: number;
    processedType: string;
    ox?: string;
    width?: number;
    height?: number;
    blurhash?: string;
}

export interface EHagakiHostMediaUploadResult {
    url: string;
    /** Optional, already validated imeta fields such as `blurhash` or `alt`. */
    imeta?: Record<string, string>;
}

export interface EHagakiHostOwnedComposerOptions {
    submit: (
        output: Readonly<EHagakiComposerOutput>,
        options: { signal: AbortSignal },
    ) => Promise<EHagakiHostSubmissionResult | void> | EHagakiHostSubmissionResult | void;
    uploadMedia?: (
        file: File,
        metadata: Readonly<EHagakiHostMediaMetadata>,
        options: { signal: AbortSignal },
    ) => Promise<EHagakiHostMediaUploadResult> | EHagakiHostMediaUploadResult;
    contentWarningEnabled?: boolean;
    hashtagPinEnabled?: boolean;
}

export interface EHagakiCustomEmojiCatalogItem {
    shortcode: string;
    url: string;
    setAddress?: string | null;
}

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
