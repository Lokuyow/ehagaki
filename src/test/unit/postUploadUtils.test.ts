import { describe, expect, it, vi } from 'vitest';

import {
    createPostUploadHandlers,
    getFilesFromInputEvent,
    updateEditorUploadState,
} from '../../lib/postUploadUtils';

describe('updateEditorUploadState', () => {
    it('アップロード状態とエラーメッセージを更新する', () => {
        const target = {
            isUploading: false,
            uploadErrorMessage: '',
        };

        updateEditorUploadState(target, true, 'error');
        expect(target).toEqual({
            isUploading: true,
            uploadErrorMessage: 'error',
        });

        updateEditorUploadState(target, false);
        expect(target).toEqual({
            isUploading: false,
            uploadErrorMessage: '',
        });
    });
});

describe('getFilesFromInputEvent', () => {
    it('input event から files を取り出す', () => {
        const files = [new File(['content'], 'test.png', { type: 'image/png' })] as unknown as FileList;

        expect(getFilesFromInputEvent({
            target: {
                files,
            },
        } as unknown as Event)).toBe(files);
    });

    it('files がない場合は undefined を返す', () => {
        expect(getFilesFromInputEvent({
            target: {
                files: null,
            },
        } as unknown as Event)).toBeUndefined();
    });
});

describe('createPostUploadHandlers', () => {
    it('空ファイル入力では uploadFiles を呼ばない', async () => {
        const uploadFiles = vi.fn(async (_params: unknown) => undefined);
        const handlers = createPostUploadHandlers({
            getCurrentEditor: () => null,
            getFileInput: () => undefined,
            getImageOxMap: () => ({}),
            getImageXMap: () => ({}),
            getUploadFailedText: (key: string) => key,
            updateUploadState: vi.fn(),
            uploadFiles,
        });

        await handlers.performUpload([]);

        expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('performUpload で現在の editor / maps / fileInput を渡す', async () => {
        const editor = { id: 'editor' } as any;
        const fileInput = { value: '' } as HTMLInputElement;
        let imageOxMap: Record<string, string> = { a: 'ox-a' };
        let imageXMap: Record<string, string> = { a: 'x-a' };
        const updateUploadState = vi.fn();
        const uploadFiles = vi.fn(async (_params: unknown) => undefined);
        const handlers = createPostUploadHandlers({
            getCurrentEditor: () => editor,
            getFileInput: () => fileInput,
            getImageOxMap: () => imageOxMap,
            getImageXMap: () => imageXMap,
            getUploadFailedText: (key: string) => `translated:${key}`,
            updateUploadState,
            uploadFiles,
        });

        imageOxMap = { b: 'ox-b' };
        imageXMap = { b: 'x-b' };

        const files = [new File(['content'], 'test.png', { type: 'image/png' })];
        await handlers.performUpload(files);

        expect(uploadFiles).toHaveBeenCalledWith({
            files,
            currentEditor: editor,
            fileInput,
            updateUploadState,
            imageOxMap: { b: 'ox-b' },
            imageXMap: { b: 'x-b' },
            getUploadFailedText: expect.any(Function),
        });
        const uploadParams = uploadFiles.mock.calls.at(0)?.[0] as
            | { getUploadFailedText: (key: string) => string }
            | undefined;

        if (!uploadParams) {
            throw new Error('uploadFiles should have been called');
        }

        expect(uploadParams.getUploadFailedText('key')).toBe('translated:key');
    });

    it('handleFileSelect で選択ファイルのアップロードを開始する', async () => {
        const uploadFiles = vi.fn(async (_params: unknown) => undefined);
        const handlers = createPostUploadHandlers({
            getCurrentEditor: () => null,
            getFileInput: () => undefined,
            getImageOxMap: () => ({}),
            getImageXMap: () => ({}),
            getUploadFailedText: (key: string) => key,
            updateUploadState: vi.fn(),
            uploadFiles,
        });
        const files = [new File(['content'], 'test.png', { type: 'image/png' })] as unknown as FileList;

        handlers.handleFileSelect({
            target: {
                files,
            },
        } as unknown as Event);
        await Promise.resolve();

        expect(uploadFiles).toHaveBeenCalledWith(expect.objectContaining({ files }));
    });
});