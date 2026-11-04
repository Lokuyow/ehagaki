import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RxNostr } from 'rx-nostr';
import { createInboundSyncResult } from '../postHistorySyncResultTestUtils';
const mocks = vi.hoisted(() => ({ get: vi.fn(), save: vi.fn(), run: vi.fn(), cancel: vi.fn() }));
vi.mock('../../lib/storage/notificationRepository', () => ({ notificationRepository: {
    getSyncState: mocks.get,
    updateSyncState: async (id: string, update: (previous: unknown) => unknown) => {
        const next = update(await mocks.get(id)); await mocks.save(next); return next;
    },
} }));
vi.mock('../../lib/postHistoryLightweightSyncCoordinator', () => ({ postHistoryLightweightSyncCoordinator: { runInbound: mocks.run } }));
import { syncNotifications } from '../../lib/notificationSyncService';
import { configureNotifications } from '../../lib/notificationFeaturePolicy';

const owner = 'a'.repeat(64), runtime = {} as RxNostr;
beforeEach(() => {
    vi.useFakeTimers(); vi.setSystemTime(1_800_000_000_000); vi.clearAllMocks();
    mocks.get.mockResolvedValue(undefined); mocks.save.mockResolvedValue(undefined);
    mocks.run.mockReturnValue({ promise: Promise.resolve(createInboundSyncResult({ status: 'success' })), cancel: mocks.cancel });
});
afterEach(() => { vi.useRealTimers(); configureNotifications(true); });
describe('notification synchronization coverage', () => {
    it('does not request or advance coverage while notifications are disabled', async () => {
        configureNotifications(false);
        expect(await syncNotifications(runtime, { ownerPubkeyHex: owner }).promise).toBeNull();
        expect(mocks.run).not.toHaveBeenCalled();
        expect(mocks.save).not.toHaveBeenCalled();
    });
    it('resumes from saved coverage after the disabled interval', async () => {
        mocks.get.mockResolvedValue({ recentSince: 100, olderUntil: 50 });
        configureNotifications(false);
        await syncNotifications(runtime, { ownerPubkeyHex: owner }).promise;
        configureNotifications(true);
        await syncNotifications(runtime, { ownerPubkeyHex: owner }).promise;
        expect(mocks.run).toHaveBeenCalledTimes(1);
        expect(mocks.run).toHaveBeenCalledWith(runtime, expect.objectContaining({ since: 100, includeNotifications: true }));
    });
    it('starts seven days back independently of the existing post-history cursor', async () => {
        await syncNotifications(runtime, { ownerPubkeyHex: owner }).promise;
        expect(mocks.run).toHaveBeenCalledWith(runtime, expect.objectContaining({ since: 1_800_000_000 - 604800,
            until: 1_800_000_000, limit: 150, reason: 'notification-initial' }));
        expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({ recentSince: 1_800_000_000 - 300, olderUntil: 1_800_000_000 - 604801 });
    });
    it('keeps the inclusive second when a page is saturated and does not advance recent coverage', async () => {
        mocks.run.mockReturnValue({ promise: Promise.resolve(createInboundSyncResult({ status: 'success', saturated: true,
            maybeIncomplete: true, oldestSeenCreatedAt: 1_799_999_000 })), cancel: mocks.cancel });
        await syncNotifications(runtime, { ownerPubkeyHex: owner }).promise;
        expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({ recentSince: 1_800_000_000 - 604800,
            pendingUntil: 1_799_999_000, olderUntil: 1_800_000_000 - 604801 });
    });
    it('does not advance older coverage on a timeout with partial events', async () => {
        mocks.get.mockResolvedValue({ olderUntil: 500, recentSince: 100, exhausted: false });
        mocks.run.mockReturnValue({ promise: Promise.resolve(createInboundSyncResult({ status: 'timeout', maybeIncomplete: true,
            oldestSeenCreatedAt: 200 })), cancel: mocks.cancel });
        await syncNotifications(runtime, { ownerPubkeyHex: owner, older: true }).promise;
        expect(mocks.run).toHaveBeenCalledWith(runtime, expect.objectContaining({ since: 0, until: 500, limit: 100 }));
        expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({ olderUntil: 500, recentSince: 100, exhausted: false });
    });
    it('does not mark a saturated single-second boundary as exhausted', async () => {
        mocks.get.mockResolvedValue({ olderUntil: 500, recentSince: 100, exhausted: false });
        mocks.run.mockReturnValue({ promise: Promise.resolve(createInboundSyncResult({ status: 'success', saturated: true,
            maybeIncomplete: true, oldestSeenCreatedAt: 500 })), cancel: mocks.cancel });
        await syncNotifications(runtime, { ownerPubkeyHex: owner, older: true }).promise;
        expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({ olderUntil: 500, exhausted: false });
    });
    it('drains a saturated recent gap before fetching older history and advances recent coverage only after completion', async () => {
        mocks.get.mockResolvedValue({ olderUntil: 50, recentSince: 100, pendingUntil: 500, pendingSince: 100,
            pendingThrough: 1000, exhausted: false });
        const result = await syncNotifications(runtime, { ownerPubkeyHex: owner, older: true }).promise;
        expect(mocks.run).toHaveBeenCalledWith(runtime, expect.objectContaining({ since: 100, until: 500 }));
        expect(mocks.save.mock.calls[0]?.[0]).toMatchObject({ olderUntil: 50, recentSince: 700, pendingUntil: null });
        expect(result?.notificationsExhausted).toBe(false);
    });
    it('reports exhaustion only after the older history itself is exhausted', async () => {
        mocks.get.mockResolvedValue({ olderUntil: 50, recentSince: 100, exhausted: false });
        const result = await syncNotifications(runtime, { ownerPubkeyHex: owner, older: true }).promise;
        expect(result?.notificationsExhausted).toBe(true);
    });
    it('cancels before transport when its account/session no longer owns the request', async () => {
        const task = syncNotifications(runtime, { ownerPubkeyHex: owner }); task.cancel(); await task.promise;
        expect(mocks.run).not.toHaveBeenCalled(); expect(mocks.save).not.toHaveBeenCalled();
    });
});
