export const CHANNEL_METADATA_SCHEMA_VERSION = 2;

export function isCurrentChannelMetadataSchemaVersion(value: unknown): value is number {
    return typeof value === "number"
        && Number.isInteger(value)
        && value >= CHANNEL_METADATA_SCHEMA_VERSION;
}
