interface ChannelMetadataEventVersion {
    createdAt: number;
    eventId: string;
}

/**
 * Returns a positive value when candidate should replace current.
 * For equal timestamps, NIP-01 retains the lexicographically lower event id.
 */
export function compareChannelMetadataEventVersions(
    candidate: ChannelMetadataEventVersion,
    current: ChannelMetadataEventVersion,
): -1 | 0 | 1 {
    if (candidate.createdAt !== current.createdAt) {
        return candidate.createdAt > current.createdAt ? 1 : -1;
    }
    if (candidate.eventId === current.eventId) {
        return 0;
    }
    return candidate.eventId < current.eventId ? 1 : -1;
}
