import {
    extractPostHistoryMedia,
    postHistoryRepository,
    type PostHistoryRepository,
    type PostHistorySaveInput,
} from './storage/postHistoryRepository';
import {
    postMediaCacheRepository,
    type PostMediaCacheRepository,
} from './storage/postMediaCacheRepository';

export async function savePostedEventWithMediaCacheLink(params: {
    input: PostHistorySaveInput;
    postHistoryRepositoryImpl?: Pick<PostHistoryRepository, 'putPostedEvent'>;
    postMediaCacheRepositoryImpl?: Pick<
        PostMediaCacheRepository,
        'linkEventIdByUrls'
    >;
}): Promise<void> {
    const {
        input,
        postHistoryRepositoryImpl = postHistoryRepository,
        postMediaCacheRepositoryImpl = postMediaCacheRepository,
    } = params;

    await postHistoryRepositoryImpl.putPostedEvent(input);

    const urls = extractPostHistoryMedia(input.event)
        .map((media) => media.url)
        .filter(Boolean);
    if (urls.length === 0) {
        return;
    }

    await postMediaCacheRepositoryImpl.linkEventIdByUrls({
        eventId: input.event.id,
        urls,
    });
}