import { expect, test, vi } from 'vitest';
import { createNotificationTargetQueue, createNotificationTargetWorkQueue } from '../../lib/notificationTargetQueue';
import type { PostHistoryRelatedTargetResolver, RelatedTargetDescriptor } from '../../lib/postHistoryRelatedTargetResolver.svelte';

const descriptor = (id: string, scopeKey = 'notifications'): RelatedTargetDescriptor => ({ targetEventId: id, scopeKey, relationKind: 'notification' });
function fixture() {
    const tasks: Array<ReturnType<typeof Promise.withResolvers<null>>> = [];
    const ensureTarget = vi.fn(() => { const task = Promise.withResolvers<null>(); tasks.push(task); return task.promise; });
    const base = { ensureTarget, retryTarget: ensureTarget, reset: vi.fn(), invalidateScope: vi.fn() } as unknown as PostHistoryRelatedTargetResolver;
    return { tasks, base, ensureTarget, queue: createNotificationTargetQueue(base, () => true) };
}
test('shares identical requests for a target', async () => {
    const f = fixture();
    const first = f.queue.ensureTarget(descriptor('a'));
    expect(f.queue.ensureTarget(descriptor('a'))).toBe(first);
    expect(f.ensureTarget).toHaveBeenCalledOnce();
    f.tasks[0].resolve(null);
    await first;
});

test('a stage limits concurrent work to four, discards cancelled jobs and admits new sessions', async () => {
    const stage = createNotificationTargetWorkQueue();
    const running = Array.from({ length: 4 }, () => Promise.withResolvers<number>());
    const old = running.map((task, index) => stage.run(String(index), () => task.promise));
    const work = vi.fn(async () => 5);
    const cancelled = stage.run('removed', work);
    const waiting = stage.run('waiting', work);
    expect(work).not.toHaveBeenCalled();
    stage.cancel('removed');
    await expect(cancelled).resolves.toBeNull();

    running[0].resolve(0);
    await expect(waiting).resolves.toBe(5);
    expect(work).toHaveBeenCalledOnce();
    stage.run('blocking', () => new Promise(() => {}));
    const discarded = stage.run('discarded', work);
    stage.reset();
    await expect(discarded).resolves.toBeNull();
    await expect(stage.run('new', work)).resolves.toBe(5);
    running.slice(1).forEach(task => task.resolve(0));
    await Promise.all(old);
    expect(work).toHaveBeenCalledTimes(2);
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
    const old = [f.queue.ensureTarget(descriptor('a')), f.queue.ensureTarget(descriptor('a', 'quote'))];
    f.queue.reset();
    await expect(old[1]).resolves.toBeNull();
    const current = f.queue.ensureTarget(descriptor('new'));
    f.tasks[0].resolve(null);
    await Promise.all(old);
    expect(f.ensureTarget).toHaveBeenCalledTimes(2);
    f.tasks[1].resolve(null); await current;
    expect(f.base.reset).toHaveBeenCalledOnce();
});
test('scope cancellation drops its waiting jobs and allows immediate resubmission', async () => {
    const f = fixture();
    const active = f.queue.ensureTarget(descriptor('a'));
    const removed = f.queue.ensureTarget(descriptor('a', 'quote'));
    const kept = f.queue.ensureTarget(descriptor('a', 'reply'));
    f.queue.invalidateScope('quote');
    const replacement = f.queue.ensureTarget(descriptor('a', 'quote'));

    await expect(removed).resolves.toBeNull();
    f.tasks[0].resolve(null);
    await active;
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenLastCalledWith(descriptor('a', 'reply'), undefined));
    f.tasks[1].resolve(null);
    await kept;
    await vi.waitFor(() => expect(f.ensureTarget).toHaveBeenLastCalledWith(descriptor('a', 'quote'), undefined));
    f.tasks[2].resolve(null);
    await replacement;
});
