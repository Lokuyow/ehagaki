import { describe, expect, it, vi } from 'vitest';

import {
    createClearSharedMediaDbOperation,
    createPutSharedMediaDbOperation,
    executeServiceWorkerIndexedDbOperation,
} from '../../lib/swIndexedDbOperationUtils';

describe('swIndexedDbOperationUtils', () => {
    it('executeServiceWorkerIndexedDbOperation wires open and success handlers', async () => {
        const request = {
            onupgradeneeded: null as any,
            onerror: null as any,
            onsuccess: null as any,
        };
        const db = { close: vi.fn() };
        const operation = vi.fn((database, resolve) => {
            expect(database).toBe(db);
            resolve();
        });

        const transaction = { objectStore: vi.fn() };
        const onUpgradeNeeded = vi.fn();
        queueMicrotask(() => {
            request.onupgradeneeded?.({ target: { result: db, transaction } });
            request.onsuccess?.({ target: { result: db } });
        });

        await executeServiceWorkerIndexedDbOperation({
            indexedDb: {
                open: vi.fn(() => request),
            },
            dbName: 'eHagakiDB',
            dbVersion: 1,
            onUpgradeNeeded,
            operation,
        });

        expect(operation).toHaveBeenCalledTimes(1);
        expect(onUpgradeNeeded).toHaveBeenCalledWith(db, transaction);
    });

    it('blocked を通知した後も同じ open request の成功を待つ', async () => {
        const request = {
            onupgradeneeded: null as any,
            onblocked: null as null | (() => void),
            onerror: null as any,
            onsuccess: null as any,
        };
        const db = { close: vi.fn() };
        const onBlocked = vi.fn();
        const onBlockedResolved = vi.fn();
        const operation = vi.fn((_database, resolve) => resolve());

        queueMicrotask(() => {
            request.onblocked?.();
            request.onsuccess?.({ target: { result: db } });
        });

        await executeServiceWorkerIndexedDbOperation({
            indexedDb: { open: vi.fn(() => request) },
            dbName: 'eHagakiDB',
            dbVersion: 150,
            onBlocked,
            onBlockedResolved,
            operation,
        });

        expect(onBlocked).toHaveBeenCalledOnce();
        expect(onBlockedResolved).toHaveBeenCalledOnce();
        expect(operation).toHaveBeenCalledWith(db, expect.any(Function), expect.any(Function));
    });

    it('blocked 後に open error なら解除通知を送らない', async () => {
        const openError = new Error('open failed');
        const request = {
            error: openError,
            onupgradeneeded: null as any,
            onblocked: null as null | (() => void),
            onerror: null as null | (() => void),
            onsuccess: null as any,
        };
        const onBlocked = vi.fn();
        const onBlockedResolved = vi.fn();

        queueMicrotask(() => {
            request.onblocked?.();
            request.onerror?.();
        });

        await expect(executeServiceWorkerIndexedDbOperation({
            indexedDb: { open: vi.fn(() => request) },
            dbName: 'eHagakiDB',
            dbVersion: 150,
            onBlocked,
            onBlockedResolved,
            operation: vi.fn(),
        })).rejects.toBe(openError);

        expect(onBlocked).toHaveBeenCalledOnce();
        expect(onBlockedResolved).not.toHaveBeenCalled();
    });

    it('VersionError を保持して reject し DB reset へ変換しない', async () => {
        const versionError = Object.assign(new Error('Requested version is lower'), {
            name: 'VersionError',
        });
        const request = {
            error: versionError,
            onupgradeneeded: null as any,
            onblocked: null as null | (() => void),
            onerror: null as null | (() => void),
            onsuccess: null as any,
        };

        queueMicrotask(() => request.onerror?.());

        await expect(executeServiceWorkerIndexedDbOperation({
            indexedDb: { open: vi.fn(() => request) },
            dbName: 'eHagakiDB',
            dbVersion: 140,
            operation: vi.fn(),
        })).rejects.toBe(versionError);
    });

    it('createPutSharedMediaDbOperation persists into the shared media store', async () => {
        const putRequest = { onsuccess: null as (() => void) | null };
        const db = {
            objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
            close: vi.fn(),
            transaction: vi.fn().mockReturnValue({
                objectStore: vi.fn().mockReturnValue({
                    put: vi.fn().mockReturnValue(putRequest),
                    delete: vi.fn(),
                }),
                onerror: null,
            }),
        };
        const resolve = vi.fn();
        const reject = vi.fn();

        createPutSharedMediaDbOperation({
            storeName: 'sharedMedia',
            record: { id: 'latest' },
        })(db as any, resolve, reject);

        putRequest.onsuccess?.();

        expect(db.transaction).toHaveBeenCalledWith(['sharedMedia'], 'readwrite');
        expect(resolve).toHaveBeenCalledTimes(1);
        expect(reject).not.toHaveBeenCalled();
        expect(db.close).toHaveBeenCalledTimes(1);
    });

    it('createClearSharedMediaDbOperation resolves even when delete transaction errors', async () => {
        const deleteRequest = { onsuccess: null as (() => void) | null };
        const transaction = {
            objectStore: vi.fn().mockReturnValue({
                put: vi.fn(),
                delete: vi.fn().mockReturnValue(deleteRequest),
            }),
            onerror: null as (() => void) | null,
        };
        const db = {
            objectStoreNames: { contains: vi.fn().mockReturnValue(true) },
            close: vi.fn(),
            transaction: vi.fn().mockReturnValue(transaction),
        };
        const resolve = vi.fn();

        createClearSharedMediaDbOperation({
            storeName: 'sharedMedia',
            recordId: 'latest',
        })(db as any, resolve, vi.fn());

        transaction.onerror?.();

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(db.close).toHaveBeenCalledTimes(1);
    });
});
