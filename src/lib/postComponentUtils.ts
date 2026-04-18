import type { Editor as TipTapEditor } from '@tiptap/core';

import type {
    FullscreenMediaItem,
    MediaGalleryItem,
    PostResult,
    PostStatus,
} from './types';
import { parseDimString } from './utils/mediaNodeUtils';

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

function resolveMediaDimensions(params: {
    dim?: string;
    dimensions?: { width: number; height: number } | null;
}): { width?: number; height?: number } {
    if (
        params.dimensions &&
        params.dimensions.width > 0 &&
        params.dimensions.height > 0
    ) {
        return {
            width: params.dimensions.width,
            height: params.dimensions.height,
        };
    }

    const parsed = parseDimString(params.dim);
    if (!parsed) {
        return {};
    }

    return parsed;
}

export function collectFullscreenMediaItems(params: {
    mediaFreePlacement: boolean;
    galleryItems: MediaGalleryItem[];
    currentEditor: TipTapEditor | null;
}): FullscreenMediaItem[] {
    if (!params.mediaFreePlacement) {
        return params.galleryItems
            .filter((item) => !item.isPlaceholder)
            .map((item) => {
                const dimensions = resolveMediaDimensions({
                    dim: item.dim,
                    dimensions: item.dimensions,
                });

                return {
                    id: item.id,
                    src: item.src,
                    alt: item.alt,
                    type: item.type,
                    dim: item.dim,
                    width: dimensions.width,
                    height: dimensions.height,
                };
            });
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
            const dimensions = resolveMediaDimensions({
                dim: node.attrs.dim as string | undefined,
            });

            items.push({
                id: node.attrs.id as string | undefined,
                src: node.attrs.src as string,
                alt: node.attrs.alt as string | undefined,
                type: node.type.name as 'image' | 'video',
                dim: node.attrs.dim as string | undefined,
                width: dimensions.width,
                height: dimensions.height,
            });
        }
    });

    return items;
}

export function findFullscreenMediaIndex(
    items: FullscreenMediaItem[],
    activeMediaId?: string,
    activeSrc?: string,
): number {
    if (activeMediaId) {
        const indexById = items.findIndex((item) => item.id === activeMediaId);
        if (indexById >= 0) {
            return indexById;
        }
    }

    if (!activeSrc) {
        return -1;
    }

    return items.findIndex((item) => item.src === activeSrc);
}

export function getFullscreenMediaItemAt(
    items: FullscreenMediaItem[],
    index: number,
): FullscreenMediaItem | undefined {
    return items[index];
}

type TransferableEditorMediaNode = {
    node: any;
    pos: number;
};

function collectTransferableEditorMediaNodes(
    currentEditor: TipTapEditor,
): TransferableEditorMediaNode[] {
    const mediaNodes: TransferableEditorMediaNode[] = [];

    currentEditor.state.doc.descendants((node: any, pos: number) => {
        if (
            (node.type.name === 'image' || node.type.name === 'video') &&
            !node.attrs.isPlaceholder
        ) {
            mediaNodes.push({ node, pos });
        }
    });

    return mediaNodes;
}

export function moveEditorMediaToGallery(params: {
    currentEditor: TipTapEditor;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    addGalleryItem: (item: MediaGalleryItem) => void;
    createMediaItemId: () => string;
}): boolean {
    const mediaNodes = collectTransferableEditorMediaNodes(params.currentEditor);

    if (mediaNodes.length === 0) {
        return false;
    }

    mediaNodes.forEach(({ node }) => {
        const src = node.attrs.src as string | undefined;

        if (!src) {
            return;
        }

        params.addGalleryItem({
            id: params.createMediaItemId(),
            type: node.type.name as 'image' | 'video',
            src,
            isPlaceholder: false,
            blurhash: node.attrs.blurhash ?? undefined,
            ox: params.imageOxMap[src] ?? undefined,
            x: params.imageXMap[src] ?? undefined,
            dim: node.attrs.dim ?? undefined,
            alt: node.attrs.alt ?? undefined,
        });
    });

    let transaction = params.currentEditor.state.tr;
    [...mediaNodes].reverse().forEach(({ node, pos }) => {
        transaction = transaction.delete(pos, pos + node.nodeSize);
    });
    params.currentEditor.view.dispatch(transaction);

    return true;
}

export function moveGalleryMediaToEditor(params: {
    currentEditor: TipTapEditor;
    items: MediaGalleryItem[];
}): {
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    hadItems: boolean;
} {
    if (params.items.length === 0) {
        return {
            imageOxMap: {},
            imageXMap: {},
            hadItems: false,
        };
    }

    const { schema } = params.currentEditor.state;
    let transaction = params.currentEditor.state.tr;
    let insertPos = params.currentEditor.state.doc.content.size;
    const newOxMap: Record<string, string> = {};
    const newXMap: Record<string, string> = {};

    params.items.forEach((item) => {
        if (item.isPlaceholder) {
            return;
        }

        const src = item.src;
        if (item.type === 'image' && schema.nodes.image) {
            const imageNode = schema.nodes.image.create({
                src,
                alt: item.alt ?? 'Image',
                blurhash: item.blurhash ?? null,
                dim: item.dim ?? null,
            });
            transaction = transaction.insert(insertPos, imageNode);
            insertPos += imageNode.nodeSize;
        } else if (item.type === 'video' && schema.nodes.video) {
            const videoNode = schema.nodes.video.create({ src });
            transaction = transaction.insert(insertPos, videoNode);
            insertPos += videoNode.nodeSize;
        }

        if (item.ox) newOxMap[src] = item.ox;
        if (item.x) newXMap[src] = item.x;
    });

    params.currentEditor.view.dispatch(transaction);

    return {
        imageOxMap: newOxMap,
        imageXMap: newXMap,
        hadItems: true,
    };
}