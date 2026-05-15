import { describe, expect, it, vi } from 'vitest';
import { resolvePostHistoryOlderRelayFetchUntil } from '../../lib/hooks/usePostHistoryListing.svelte';

const PUBKEY_HEX = 'a'.repeat(64);

describe('resolvePostHistoryOlderRelayFetchUntil', () => {
    it('nextUntil があれば older-backfill の until に使う', async () => {
        const getOldestCreatedAt = vi.fn();

        await expect(resolvePostHistoryOlderRelayFetchUntil({
            nextUntil: 150,
            visibleOldestCreatedAt: 140,
            pubkeyHex: PUBKEY_HEX,
            getOldestCreatedAt,
            getNowSeconds: () => 999,
        })).resolves.toBe(150);
        expect(getOldestCreatedAt).not.toHaveBeenCalled();
    });

    it('nextUntil がなければ表示中の最古 createdAt を older-backfill の until に使う', async () => {
        const getOldestCreatedAt = vi.fn();

        await expect(resolvePostHistoryOlderRelayFetchUntil({
            nextUntil: null,
            visibleOldestCreatedAt: 140,
            pubkeyHex: PUBKEY_HEX,
            getOldestCreatedAt,
            getNowSeconds: () => 999,
        })).resolves.toBe(140);
        expect(getOldestCreatedAt).not.toHaveBeenCalled();
    });

    it('表示中の最古 createdAt がなければ DB 全体の最古 createdAt を older-backfill の until に使う', async () => {
        const getOldestCreatedAt = vi.fn().mockResolvedValue(130);

        await expect(resolvePostHistoryOlderRelayFetchUntil({
            nextUntil: null,
            visibleOldestCreatedAt: null,
            pubkeyHex: PUBKEY_HEX,
            getOldestCreatedAt,
            getNowSeconds: () => 999,
        })).resolves.toBe(130);
        expect(getOldestCreatedAt).toHaveBeenCalledWith(PUBKEY_HEX);
    });

    it('DB 全体の最古 createdAt もなければ現在 unix 秒を older-backfill の until に使う', async () => {
        await expect(resolvePostHistoryOlderRelayFetchUntil({
            nextUntil: null,
            visibleOldestCreatedAt: null,
            pubkeyHex: PUBKEY_HEX,
            getOldestCreatedAt: vi.fn().mockResolvedValue(null),
            getNowSeconds: () => 999,
        })).resolves.toBe(999);
    });
});
