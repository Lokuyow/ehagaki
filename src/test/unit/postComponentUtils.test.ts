import { describe, expect, it, vi } from 'vitest';

import {
    collectFullscreenMediaItems,
    createPostStatusHandlers,
    getFullscreenMediaItemAt,
    submitPendingPostWithSecretKey,
} from '../../lib/postComponentUtils';

describe('createPostStatusHandlers', () => {
    it('送信開始・成功・失敗の状態を一貫して更新する', () => {
        const updatePostStatus = vi.fn();
        const clearContentAfterSuccess = vi.fn();
        const onPostSuccess = vi.fn();
        const handlers = createPostStatusHandlers({
            updatePostStatus,
            clearContentAfterSuccess,
            onPostSuccess,
        });

        handlers.markSending();
        handlers.markSuccess();
        handlers.markFailure('custom-error');
        handlers.markFailure();

        expect(updatePostStatus).toHaveBeenNthCalledWith(1, {
            sending: true,
            success: false,
            error: false,
            message: '',
            completed: false,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(2, {
            sending: false,
            success: true,
            error: false,
            message: 'postComponent.post_success',
            completed: true,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(3, {
            sending: false,
            success: false,
            error: true,
            message: 'custom-error',
            completed: false,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(4, {
            sending: false,
            success: false,
            error: true,
            message: 'postComponent.post_error',
            completed: false,
        });
        expect(clearContentAfterSuccess).toHaveBeenCalledOnce();
        expect(onPostSuccess).toHaveBeenCalledOnce();
    });
});

describe('submitPendingPostWithSecretKey', () => {
    it('成功時は start の後に success を呼ぶ', async () => {
        const postManager = {
            prepareImageBlurhashMap: vi.fn(() => ({ image: { blurhash: 'hash' } })),
            submitPost: vi.fn(async () => ({ success: true })),
        };
        const currentEditor = { id: 'editor' } as any;
        const onStart = vi.fn();
        const onSuccess = vi.fn();
        const onFailure = vi.fn();

        await submitPendingPostWithSecretKey({
            postManager,
            currentEditor,
            imageOxMap: { image: 'ox' },
            imageXMap: { image: 'x' },
            pendingPost: 'pending',
            onStart,
            onSuccess,
            onFailure,
        });

        expect(postManager.prepareImageBlurhashMap).toHaveBeenCalledWith(
            currentEditor,
            { image: 'ox' },
            { image: 'x' },
        );
        expect(postManager.submitPost).toHaveBeenCalledWith('pending', {
            image: { blurhash: 'hash' },
        });
        expect(onStart).toHaveBeenCalledOnce();
        expect(onSuccess).toHaveBeenCalledOnce();
        expect(onFailure).not.toHaveBeenCalled();
    });

    it('失敗結果や例外では failure を呼ぶ', async () => {
        const commonParams = {
            currentEditor: { id: 'editor' } as any,
            imageOxMap: {},
            imageXMap: {},
            pendingPost: 'pending',
            onStart: vi.fn(),
            onSuccess: vi.fn(),
        };

        const failedResult = vi.fn();
        await submitPendingPostWithSecretKey({
            ...commonParams,
            postManager: {
                prepareImageBlurhashMap: vi.fn(() => ({})),
                submitPost: vi.fn(async () => ({ success: false, error: 'result-error' })),
            },
            onFailure: failedResult,
        });

        expect(failedResult).toHaveBeenCalledWith('result-error');

        const thrownFailure = vi.fn();
        await submitPendingPostWithSecretKey({
            ...commonParams,
            postManager: {
                prepareImageBlurhashMap: vi.fn(() => ({})),
                submitPost: vi.fn(async () => {
                    throw new Error('boom');
                }),
            },
            onFailure: thrownFailure,
        });

        expect(thrownFailure).toHaveBeenCalledWith();
    });
});

describe('collectFullscreenMediaItems', () => {
    it('ギャラリーモードではプレースホルダーを除外して返す', () => {
        expect(collectFullscreenMediaItems({
            mediaFreePlacement: false,
            galleryItems: [
                { id: '1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false, alt: 'a' },
                { id: '2', type: 'video', src: 'https://example.com/b.mp4', isPlaceholder: true },
            ],
            currentEditor: null,
        })).toEqual([
            { src: 'https://example.com/a.jpg', alt: 'a', type: 'image' },
        ]);
    });

    it('フリー配置モードでは editor ノードから収集する', () => {
        const currentEditor = {
            state: {
                doc: {
                    descendants: (callback: (node: any) => void) => {
                        callback({
                            type: { name: 'image' },
                            attrs: { src: 'https://example.com/a.jpg', alt: 'a', isPlaceholder: false },
                        });
                        callback({
                            type: { name: 'video' },
                            attrs: { src: 'https://example.com/b.mp4', isPlaceholder: false },
                        });
                        callback({
                            type: { name: 'image' },
                            attrs: { src: 'placeholder', isPlaceholder: true },
                        });
                    },
                },
            },
        } as any;

        expect(collectFullscreenMediaItems({
            mediaFreePlacement: true,
            galleryItems: [],
            currentEditor,
        })).toEqual([
            { src: 'https://example.com/a.jpg', alt: 'a', type: 'image' },
            { src: 'https://example.com/b.mp4', alt: undefined, type: 'video' },
        ]);
    });
});

describe('getFullscreenMediaItemAt', () => {
    it('指定 index の item を返し、範囲外は undefined を返す', () => {
        const items = [
            { src: 'a', type: 'image' as const },
            { src: 'b', type: 'video' as const },
        ];

        expect(getFullscreenMediaItemAt(items, 1)).toEqual(items[1]);
        expect(getFullscreenMediaItemAt(items, 3)).toBeUndefined();
    });
});