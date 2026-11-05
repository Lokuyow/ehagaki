import { expect, test, vi } from 'vitest';
import { createNotificationTargetQueue } from '../../lib/notificationTargetQueue';
import type { PostHistoryRelatedTargetResolver, RelatedTargetDescriptor } from '../../lib/postHistoryRelatedTargetResolver.svelte';

const descriptor = (id: string, scopeKey = 'notifications'): RelatedTargetDescriptor => ({ targetEventId: id, scopeKey, relationKind: 'notification' });
function fixture() {
    const tasks: Array<ReturnType<typeof Promise.withResolvers<null>>> = [];
    const ensureTarget = vi.fn(() => { const task = Promise.withResolvers<null>(); tasks.push(task); return task.promise; });
    const base = { ensureTarget, retryTarget: ensureTarget, reset: vi.fn(), invalidateScope: vi.fn() } as unknown as PostHistoryRelatedTargetResolver;
    return { tasks, base, ensureTarget, queue: createNotificationTargetQueue(base, () => true) };
}
test('shares queued work and limits target IDs across quote and notification scopes to four', async () => {
    const f = fixture();
    const results = Array.from({ length: 6 }, (_, index) => f.queue.ensureTarget(descriptor(String(index))));
    const shared = f.queue.ensureTarget(descriptor('5'));
    expect(f.ensureTarget).toHaveBeenCalledTimes(4);
    f.tasks[0].resolve(null);
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenCalledTimes(5));
    f.tasks[1].resolve(null);
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenCalledTimes(6));
    f.tasks.forEach(task => task.resolve(null));
    await Promise.all([...results, shared]);
    expect(f.ensureTarget).toHaveBeenCalledTimes(6);
});
test('same target in different scopes shares a slot while preserving scope registration', async () => {
    const f = fixture();
    const a = f.queue.ensureTarget(descriptor('a'));
    const b = f.queue.ensureTarget(descriptor('a', 'quote'));
    expect(f.ensureTarget).toHaveBeenCalledTimes(1);
    f.tasks[0].resolve(null);
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenCalledTimes(2));
    f.tasks[1].resolve(null); await Promise.all([a, b]);
});
test('reset discards waiting work and old completions cannot consume a new session slot', async () => {
    const f = fixture();
    const old = Array.from({ length: 5 }, (_, index) => f.queue.ensureTarget(descriptor(String(index))));
    f.queue.reset();
    await expect(old[4]).resolves.toBeNull();
    const current = f.queue.ensureTarget(descriptor('new'));
    f.tasks.slice(0, 4).forEach(task => task.resolve(null));
    await Promise.all(old);
    expect(f.ensureTarget).toHaveBeenCalledTimes(5);
    f.tasks[4].resolve(null); await current;
    expect(f.base.reset).toHaveBeenCalledOnce();
});
test('scope cancellation drops its waiting jobs without canceling another consumer', async () => {
    const f = fixture();
    const active = Array.from({ length: 4 }, (_, index) => f.queue.ensureTarget(descriptor(String(index))));
    const removed = f.queue.ensureTarget(descriptor('waiting', 'quote'));
    const kept = f.queue.ensureTarget(descriptor('kept'));
    f.queue.invalidateScope('quote');
    await expect(removed).resolves.toBeNull();
    f.tasks.slice(0, 4).forEach(task => task.resolve(null));
    await Promise.all(active);
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenCalledTimes(5));
    f.tasks[4].resolve(null); await kept;
});
