import type { ChannelContextService } from '../channelContextService';
import type { ChannelContextQueryTarget } from '../types';

function hasProvidedChannelMetadata(
    channelContextQuery: ChannelContextQueryTarget,
): boolean {
    return !!(
        channelContextQuery.name
        || channelContextQuery.about
        || channelContextQuery.picture
    );
}

function hasProvidedChannelRelays(
    channelContextQuery: ChannelContextQueryTarget,
): boolean {
    return (channelContextQuery.channelRelays?.length ?? 0) > 0;
}

function buildBaseChannelContext(
    channelContextQuery: ChannelContextQueryTarget,
) {
    return {
        eventId: channelContextQuery.eventId,
        relayHints: channelContextQuery.relayHints,
        ...(channelContextQuery.channelRelays?.length
            ? { channelRelays: channelContextQuery.channelRelays }
            : {}),
        name: channelContextQuery.name ?? null,
        about: channelContextQuery.about ?? null,
        picture: channelContextQuery.picture ?? null,
    };
}

export async function processExternalChannelContextQuery({
    channelContextQuery,
    channelContextService,
    rxNostr,
    relayConfig,
    setChannelContext,
}: {
    channelContextQuery: ChannelContextQueryTarget;
    channelContextService: Pick<ChannelContextService, 'resolveChannelContext'>;
    rxNostr?: any;
    relayConfig: any;
    setChannelContext: (value: any) => void;
}): Promise<void> {
    const baseContext = buildBaseChannelContext(channelContextQuery);
    const metadataProvided = hasProvidedChannelMetadata(channelContextQuery);
    const channelRelaysProvided = hasProvidedChannelRelays(channelContextQuery);

    if (!rxNostr || metadataProvided) {
        setChannelContext(baseContext);
        return;
    }

    setChannelContext({
        ...baseContext,
        isMetadataLoading: true,
    });

    const resolvedChannelContext = await channelContextService.resolveChannelContext(
        channelContextQuery,
        rxNostr,
        relayConfig,
    );
    setChannelContext({
        ...resolvedChannelContext,
        ...(channelRelaysProvided
            ? { channelRelays: channelContextQuery.channelRelays }
            : {}),
        name: channelContextQuery.name ?? resolvedChannelContext.name,
        about: channelContextQuery.about ?? resolvedChannelContext.about,
        picture: channelContextQuery.picture ?? resolvedChannelContext.picture,
    });
}