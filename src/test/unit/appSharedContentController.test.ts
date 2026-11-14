import { describe, expect, it, vi } from 'vitest';
import {
    createAppSharedContentController,
    type AppSharedContentControllerDependencies,
    type SharedContentComposer,
} from '../../lib/appSharedContentController';
import type { SharedMediaStoreState } from '../../lib/types';

const RETRY_MESSAGE = '共有メディアのアップロードに失敗しました。次回起動時に一度だけ再試行します。';
const RESHARE_MESSAGE = '共有メディアのアップロードに失敗しました。元のアプリからもう一度共有してください。';
const FAILED_MESSAGE = '共有コンテンツの取り込みに失敗しました';

function createStore(overrides: Partial<SharedMediaStoreState> = {}): SharedMediaStoreState {
    return {
        files: [],
        metadata: undefined,
        title: '',
        text: '',
        url: '',
        shareId: 'share-1',
        bodyStatus: 'not-applicable',
        automaticRetryCount: 0,
        received: true,
        ...overrides,
    };
}

function createFile(name = 'image.png'): File {
    return new File(['x'], name, { type: 'image/png' });
}

function createHarness(options: {
    store?: Partial<SharedMediaStoreState>;
    composer?: Partial<SharedContentComposer> | null;
    deps?: Partial<AppSharedContentControllerDependencies>;
} = {}) {
    const store = createStore(options.store);
    const composer = options.composer === null
        ? null
        : {
            appendSharedTextContent: vi.fn(() => true),
            uploadFiles: vi.fn(async () => ({ failedResults: [], results: [{}] })),
            ...options.composer,
        };
    const deps = {
        sharedMediaStore: store,
        clearSharedMediaStore: vi.fn(() => {
            store.received = false;
            store.shareId = null;
            store.files = [];
        }),
        setSharedMediaError: vi.fn(),
        acknowledgeSharedMedia: vi.fn(async () => true),
        sharedMediaRepository: {
            updateLatestForShare: vi.fn(async () => 'updated' as const),
            deleteLatestForShare: vi.fn(async () => 'deleted' as const),
        },
        composeSharedText: vi.fn(() => 'shared text'),
        getComposer: vi.fn(() => composer),
        logger: { error: vi.fn() },
        ...options.deps,
    };

    return {
        store,
        composer,
        deps,
        controller: createAppSharedContentController(deps),
    };
}

describe('createAppSharedContentController', () => {
    it('共有を受け取っていなければ何もしない', async () => {
        const { controller, deps } = createHarness({ store: { received: false } });

        await controller.consumeSharedContent();

        expect(deps.getComposer).not.toHaveBeenCalled();
        expect(deps.clearSharedMediaStore).not.toHaveBeenCalled();
    });

    it('コンポーザが未マウントなら共有を保持したまま何もしない', async () => {
        const { controller, deps, store } = createHarness({ composer: null });

        await controller.consumeSharedContent();

        expect(deps.clearSharedMediaStore).not.toHaveBeenCalled();
        expect(deps.sharedMediaRepository.updateLatestForShare).not.toHaveBeenCalled();
        expect(store.received).toBe(true);
    });

    it('本文だけの共有はエディタへ反映し、記録を削除してストアを空にする', async () => {
        const { controller, deps, composer } = createHarness({
            store: { bodyStatus: 'pending', text: 'hello' },
        });

        await controller.consumeSharedContent();

        expect(composer?.appendSharedTextContent).toHaveBeenCalledWith('shared text');
        expect(deps.sharedMediaRepository.updateLatestForShare).toHaveBeenCalledWith(
            'share-1',
            expect.objectContaining({ bodyStatus: 'applied', automaticRetryCount: 0 }),
        );
        expect(deps.acknowledgeSharedMedia).toHaveBeenCalledWith('share-1');
        expect(deps.sharedMediaRepository.deleteLatestForShare).toHaveBeenCalledWith('share-1');
        expect(composer?.uploadFiles).not.toHaveBeenCalled();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('本文の反映後に記録が古くなっていたら、アップロードせずストアだけ空にする', async () => {
        const { controller, deps, composer } = createHarness({
            store: { bodyStatus: 'pending', files: [createFile()] },
            deps: {
                sharedMediaRepository: {
                    updateLatestForShare: vi.fn(async () => 'stale' as const),
                    deleteLatestForShare: vi.fn(async () => 'deleted' as const),
                },
            },
        });

        await controller.consumeSharedContent();

        expect(composer?.uploadFiles).not.toHaveBeenCalled();
        expect(deps.sharedMediaRepository.deleteLatestForShare).not.toHaveBeenCalled();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('すべてアップロードできたら記録を削除する', async () => {
        const file = createFile();
        const { controller, deps, composer } = createHarness({ store: { files: [file] } });

        await controller.consumeSharedContent();

        expect(composer?.uploadFiles).toHaveBeenCalledWith([file]);
        expect(deps.sharedMediaRepository.deleteLatestForShare).toHaveBeenCalledWith('share-1');
        expect(deps.setSharedMediaError).not.toHaveBeenCalled();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('Service Worker の確認に失敗したら記録を残す', async () => {
        const { controller, deps } = createHarness({
            store: { files: [createFile()] },
            deps: { acknowledgeSharedMedia: vi.fn(async () => false) },
        });

        await controller.consumeSharedContent();

        expect(deps.sharedMediaRepository.deleteLatestForShare).not.toHaveBeenCalled();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('初回のアップロード失敗は再試行回数を記録して残す', async () => {
        const file = createFile();
        const { controller, deps } = createHarness({
            store: { files: [file] },
            composer: {
                uploadFiles: vi.fn(async () => ({ failedResults: [{}], results: [] })),
            },
        });

        await controller.consumeSharedContent();

        expect(deps.sharedMediaRepository.updateLatestForShare).toHaveBeenCalledWith(
            'share-1',
            expect.objectContaining({ images: [file], automaticRetryCount: 1 }),
        );
        expect(deps.sharedMediaRepository.deleteLatestForShare).not.toHaveBeenCalled();
        expect(deps.setSharedMediaError).toHaveBeenCalledWith(RETRY_MESSAGE, 5000);
    });

    it('再試行済みのアップロード失敗は記録を削除し、再共有を促す', async () => {
        const { controller, deps } = createHarness({
            store: { files: [createFile()], automaticRetryCount: 1 },
            composer: { uploadFiles: vi.fn(async () => null) },
        });

        await controller.consumeSharedContent();

        expect(deps.sharedMediaRepository.deleteLatestForShare).toHaveBeenCalledWith('share-1');
        expect(deps.setSharedMediaError).toHaveBeenCalledWith(RESHARE_MESSAGE, 5000);
    });

    it('本文をエディタへ反映できなければ記録を変更せず、失敗を伝える', async () => {
        const { controller, deps } = createHarness({
            store: { bodyStatus: 'pending', files: [createFile()] },
            composer: { appendSharedTextContent: vi.fn(() => false) },
        });

        await controller.consumeSharedContent();

        expect(deps.sharedMediaRepository.updateLatestForShare).not.toHaveBeenCalled();
        expect(deps.sharedMediaRepository.deleteLatestForShare).not.toHaveBeenCalled();
        expect(deps.setSharedMediaError).toHaveBeenCalledWith(FAILED_MESSAGE, 5000);
        expect(deps.logger.error).toHaveBeenCalledOnce();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('処理中に別の共有へ差し替わっていたら、新しい共有のストアは消さない', async () => {
        const { controller, deps, store } = createHarness({
            store: { files: [createFile()] },
            composer: {
                uploadFiles: vi.fn(async () => {
                    store.shareId = 'share-2';
                    store.files = [];
                    return { failedResults: [], results: [{}] };
                }),
            },
        });

        await controller.consumeSharedContent();

        expect(deps.sharedMediaRepository.deleteLatestForShare).toHaveBeenCalledWith('share-1');
        expect(deps.clearSharedMediaStore).not.toHaveBeenCalled();
    });

    it('処理中に届いた新しい共有を、現在の処理が終わったあとに取り込む', async () => {
        const firstFile = createFile('first.png');
        const { controller, deps, store, composer } = createHarness({
            store: { files: [firstFile] },
        });
        composer!.uploadFiles = vi.fn(async () => {
            store.shareId = 'share-2';
            store.files = [];
            store.bodyStatus = 'pending';
            return { failedResults: [], results: [{}] };
        });

        await controller.consumeSharedContent();
        await vi.waitFor(() => {
            expect(deps.sharedMediaRepository.deleteLatestForShare).toHaveBeenCalledWith('share-2');
        });

        expect(composer?.appendSharedTextContent).toHaveBeenCalledOnce();
        expect(deps.clearSharedMediaStore).toHaveBeenCalledOnce();
    });

    it('処理中に重ねて呼ばれても、同じ共有を二重に取り込まない', async () => {
        let releaseUpload: () => void = () => undefined;
        const uploadFiles = vi.fn(() => new Promise<{ failedResults: unknown[]; results: unknown[] }>((resolve) => {
            releaseUpload = () => resolve({ failedResults: [], results: [{}] });
        }));
        const { controller } = createHarness({
            store: { files: [createFile()] },
            composer: { uploadFiles },
        });

        const first = controller.consumeSharedContent();
        await controller.consumeSharedContent();
        releaseUpload();
        await first;

        expect(uploadFiles).toHaveBeenCalledOnce();
    });
});
