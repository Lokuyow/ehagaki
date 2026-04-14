import type { Editor as TipTapEditor } from '@tiptap/core';

import type {
    FullscreenMediaItem,
    MediaGalleryItem,
    PostResult,
    PostStatus,
} from './types';

interface PostStatusHandlersParams {
    updatePostStatus: (postStatus: PostStatus) => void;
    clearContentAfterSuccess: () => void;
    onPostSuccess?: () => void;
}

interface SecretKeyPostManager {
    prepareImageBlurhashMap: (
        editor: TipTapEditor,
        imageOxMap: Record<string, string>,
        imageXMap: Record<string, string>,
    ) => Record<string, any>;
    submitPost: (
        content: string,
        imageImetaMap?: Record<string, any>,
    ) => Promise<PostResult>;
}

function createSendingStatus(): PostStatus {
    return {
        sending: true,
        success: false,
        error: false,
        message: '',
        completed: false,
    };
}

function createSuccessStatus(): PostStatus {
    return {
        sending: false,
        success: true,
        error: false,
        message: 'postComponent.post_success',
        completed: true,
    };
}

function createErrorStatus(message?: string): PostStatus {
    return {
        sending: false,
        success: false,
        error: true,
        message: message || 'postComponent.post_error',
        completed: false,
    };
}

export function createPostStatusHandlers({
    updatePostStatus,
    clearContentAfterSuccess,
    onPostSuccess,
}: PostStatusHandlersParams) {
    return {
        markSending: () => {
            updatePostStatus(createSendingStatus());
        },
        markSuccess: () => {
            updatePostStatus(createSuccessStatus());
            clearContentAfterSuccess();
            onPostSuccess?.();
        },
        markFailure: (message?: string) => {
            updatePostStatus(createErrorStatus(message));
        },
    };
}

export async function submitPendingPostWithSecretKey(params: {
    postManager: SecretKeyPostManager;
    currentEditor: TipTapEditor;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    pendingPost: string;
    onStart: () => void;
    onSuccess: () => void;
    onFailure: (message?: string) => void;
}): Promise<void> {
    const imageBlurhashMap = params.postManager.prepareImageBlurhashMap(
        params.currentEditor,
        params.imageOxMap,
        params.imageXMap,
    );

    params.onStart();

    try {
        const result = await params.postManager.submitPost(
            params.pendingPost,
            imageBlurhashMap,
        );

        if (result.success) {
            params.onSuccess();
            return;
        }

        params.onFailure(result.error);
    } catch {
        params.onFailure();
    }
}

export function collectFullscreenMediaItems(params: {
    mediaFreePlacement: boolean;
    galleryItems: MediaGalleryItem[];
    currentEditor: TipTapEditor | null;
}): FullscreenMediaItem[] {
    if (!params.mediaFreePlacement) {
        return params.galleryItems
            .filter((item) => !item.isPlaceholder)
            .map((item) => ({ src: item.src, alt: item.alt, type: item.type }));
    }

    if (!params.currentEditor) {
        return [];
    }

    const items: FullscreenMediaItem[] = [];

    params.currentEditor.state.doc.descendants((node: any) => {
        if (
            (node.type.name === 'image' || node.type.name === 'video') &&
            !node.attrs.isPlaceholder
        ) {
            items.push({
                src: node.attrs.src as string,
                alt: node.attrs.alt as string | undefined,
                type: node.type.name as 'image' | 'video',
            });
        }
    });

    return items;
}

export function getFullscreenMediaItemAt(
    items: FullscreenMediaItem[],
    index: number,
): FullscreenMediaItem | undefined {
    return items[index];
}