import type { EmbedComposerSetContextPayload } from "./embedProtocol";
import { decodeEventPointerValue } from "./eventPointerUtils";
import { RelayConfigUtils } from "./relayConfigUtils";

export class EmbedComposerContextValidationError extends Error {
    constructor() {
        super("invalid_composer_context");
        this.name = "EmbedComposerContextValidationError";
    }
}

function invalid(): never {
    throw new EmbedComposerContextValidationError();
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateReference(value: unknown): void {
    if (
        typeof value !== "string"
        || decodeEventPointerValue(value, { relayValidation: "strict" }) === null
    ) {
        invalid();
    }
}

function validateMetadataField(channel: Record<string, unknown>, field: string): void {
    if (!Object.prototype.hasOwnProperty.call(channel, field)) return;
    const value = channel[field];
    if (value === undefined || value === null) return;
    if (typeof value !== "string" || value.trim().length === 0) invalid();
}

function validateChannel(value: unknown): void {
    if (value === undefined || value === null) return;
    if (!isRecord(value)) invalid();

    validateReference(value.reference);
    if (value.relays !== undefined) {
        if (!Array.isArray(value.relays)) invalid();
        for (const relay of value.relays) {
            if (
                typeof relay !== "string"
                || RelayConfigUtils.sanitizeExternalRelayUrls([relay], { limit: 1 }).length !== 1
            ) {
                invalid();
            }
        }
    }
    validateMetadataField(value, "name");
    validateMetadataField(value, "about");
    validateMetadataField(value, "picture");
}

/** Validates the complete request before any composer state is mutated. */
export function validateEmbedComposerSetContextPayload(
    value: unknown,
): EmbedComposerSetContextPayload {
    if (!isRecord(value)) invalid();

    if (value.reply !== undefined && value.reply !== null) {
        validateReference(value.reply);
    }
    if (value.quotes !== undefined && value.quotes !== null) {
        if (!Array.isArray(value.quotes)) invalid();
        for (const quote of value.quotes) validateReference(quote);
    }
    if (
        value.content !== undefined
        && value.content !== null
        && typeof value.content !== "string"
    ) {
        invalid();
    }
    validateChannel(value.channel);

    return value as unknown as EmbedComposerSetContextPayload;
}
