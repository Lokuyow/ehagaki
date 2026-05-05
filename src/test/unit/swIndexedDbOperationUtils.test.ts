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

        queueMicrotask(() => {
            request.onupgradeneeded?.({ target: { result: db } });
            request.onsuccess?.({ target: { result: db } });
        });

        await executeServiceWorkerIndexedDbOperation({
            indexedDb: {
                open: vi.fn(() => request),
            },
            dbName: 'eHagakiDB',
            dbVersion: 1,
            onUpgradeNeeded: vi.fn(),
            operation,
        });

        expect(operation).toHaveBeenCalledTimes(1);
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