import type { RxNostr } from 'rx-nostr';
import { NOTIFICATION_LOOKBACK_SECONDS } from './notification';
import { postHistoryLightweightSyncCoordinator } from './postHistoryLightweightSyncCoordinator';
import { getPostHistoryAuthoredRelayScopeKey } from './postHistoryRelayResolver';
import { notificationRepository } from './storage/notificationRepository';
import type { PostHistoryInboundInteractionsSyncRequest, PostHistoryInboundInteractionsSyncResult } from './postHistoryInboundInteractionsSyncService';

export interface NotificationSyncResult extends PostHistoryInboundInteractionsSyncResult {
    notificationsExhausted?: boolean;
}

/** Cursors belong to notification coverage, independently of authored/history coverage. */
export function syncNotifications(rxNostr: RxNostr,
    params: Omit<PostHistoryInboundInteractionsSyncRequest, 'reason'> & { older?: boolean }) {
    let active = true;
    let task: ReturnType<typeof postHistoryLightweightSyncCoordinator.runInbound> | undefined;
    const isActive = () => active && params.isActive?.() !== false;
    const promise = (async (): Promise<NotificationSyncResult | null> => {
        const id = JSON.stringify([params.ownerPubkeyHex, getPostHistoryAuthoredRelayScopeKey(params.relayConfig)]);
        const state = await notificationRepository.getSyncState(id);
        if (!isActive()) return null;
        const now = Math.floor(Date.now() / 1000);
        const initialSince = Math.max(0, now - NOTIFICATION_LOOKBACK_SECONDS);
        const pending = params.older && state?.pendingUntil != null;
        if (params.older && state?.exhausted && !pending) return null;
        const since = pending ? state.pendingSince ?? state.recentSince : params.older ? 0 : state?.recentSince ?? initialSince;
        const until = pending ? state.pendingUntil! : params.older ? state?.olderUntil ?? initialSince : now;
        task = postHistoryLightweightSyncCoordinator.runInbound(rxNostr, { ...params, since, until,
            limit: state || params.older ? 100 : 150, relayLimit: 6, timeoutMs: 6000,
            reason: params.older ? 'notification-older' : state ? 'notification-refresh' : 'notification-initial', isActive });
        const result = await task.promise;
        if (!isActive() || result.status === 'cancelled') return result;
        const oldest = result.oldestSeenCreatedAt;
        const complete = result.status === 'success' && !result.maybeIncomplete;
        // Include the boundary second on the next page. A saturated single second
        // remains incomplete, rather than silently dropping events with until - 1.
        const updated = await notificationRepository.updateSyncState(id, previous => {
            const next = { id, ownerPubkeyHex: params.ownerPubkeyHex, recentSince: initialSince,
                olderUntil: Math.max(0, initialSince - 1), exhausted: false, ...previous, updatedAt: Date.now() };
            if (result.status !== 'success') return next;
            if (!params.older) {
                if (complete) {
                    next.recentSince = Math.max(next.recentSince, now - 300);
                    next.pendingUntil = null;
                    next.pendingSince = undefined; next.pendingThrough = undefined;
                } else {
                    next.pendingUntil = Math.max(next.pendingUntil ?? 0, oldest ?? now);
                    next.pendingSince = Math.min(next.pendingSince ?? since, since);
                    next.pendingThrough = Math.max(next.pendingThrough ?? 0, now);
                }
            } else if (pending) {
                // A concurrent refresh can introduce a newer gap. Do not clear it
                // using the completion of an older, narrower page.
                if ((next.pendingUntil ?? 0) <= until) {
                    next.pendingUntil = complete ? null : oldest ?? until;
                    if (complete) {
                        next.recentSince = Math.max(next.recentSince, (state.pendingThrough ?? now) - 300);
                        next.pendingSince = undefined; next.pendingThrough = undefined;
                    }
                }
            } else {
                next.olderUntil = Math.min(next.olderUntil, complete ? Math.max(0, (oldest ?? until) - 1) : oldest ?? until);
                next.exhausted ||= complete && result.uniqueCount === 0;
            }
            return next;
        }, isActive);
        return { ...result, notificationsExhausted: !!updated?.exhausted && updated.pendingUntil == null };
    })();
    return { promise, cancel: () => { active = false; task?.cancel(); } };
}
