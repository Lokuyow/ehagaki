const postHistorySearchRevisions = new Map<string, number>();
let channelMetadataSearchRevision = 0;

export function getPostHistorySearchRevision(pubkeyHex: string): number {
    return postHistorySearchRevisions.get(pubkeyHex) ?? 0;
}

export function bumpPostHistorySearchRevision(pubkeyHex: string): void {
    postHistorySearchRevisions.set(
        pubkeyHex,
        getPostHistorySearchRevision(pubkeyHex) + 1,
    );
}

export function getChannelMetadataSearchRevision(): number {
    return channelMetadataSearchRevision;
}

export function bumpChannelMetadataSearchRevision(): void {
    channelMetadataSearchRevision += 1;
}

export function resetPostHistoryLocalSearchRevisionsForTesting(): void {
    postHistorySearchRevisions.clear();
    channelMetadataSearchRevision = 0;
}
