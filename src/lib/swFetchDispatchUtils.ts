import type { ServiceWorkerFetchRoute } from './swRoutingUtils';

export async function dispatchServiceWorkerFetchRoute({
    route,
    uploadHandler,
    profileImageHandler,
    channelImageHandler,
    customEmojiImageHandler,
}: {
    route: ServiceWorkerFetchRoute;
    uploadHandler: () => Promise<Response | undefined>;
    profileImageHandler: () => Promise<Response | undefined>;
    channelImageHandler?: () => Promise<Response | undefined>;
    customEmojiImageHandler: () => Promise<Response | undefined>;
}): Promise<Response | undefined> {
    if (route === 'upload') {
        return await uploadHandler();
    }

    if (route === 'profile-image') {
        return await profileImageHandler();
    }

    if (route === 'channel-image') {
        return await channelImageHandler?.();
    }

    if (route === 'custom-emoji-image') {
        return await customEmojiImageHandler();
    }

    return undefined;
}
