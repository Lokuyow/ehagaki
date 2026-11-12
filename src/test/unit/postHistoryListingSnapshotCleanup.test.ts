import { describe, expect, it, vi } from 'vitest';

import {
    clearRegisteredPersistedPostHistoryListingSnapshots,
    registerClearPersistedPostHistoryListingSnapshots,
} from '../../lib/postHistoryListingSnapshotCleanup';

describe('postHistoryListingSnapshotCleanup', () => {
    it('一覧モジュール未読込のクリアは何もしない', () => {
        expect(() => clearRegisteredPersistedPostHistoryListingSnapshots()).not.toThrow();
    });

    it('登録された clearPersistedPostHistoryListingSnapshots を呼ぶ', () => {
        const clearPersistedPostHistoryListingSnapshots = vi.fn();
        registerClearPersistedPostHistoryListingSnapshots(
            clearPersistedPostHistoryListingSnapshots,
        );

        clearRegisteredPersistedPostHistoryListingSnapshots();

        expect(clearPersistedPostHistoryListingSnapshots).toHaveBeenCalledOnce();
    });
});