import type { PostHistoryRelatedTargetResolver, RelatedTargetDescriptor } from './postHistoryRelatedTargetResolver.svelte';

type Result = Awaited<ReturnType<PostHistoryRelatedTargetResolver['ensureTarget']>>;
type Job = { scope: string; run: () => Promise<Result>; finish: (value: Result) => void; fail: (error: unknown) => void };

/** Bound notification target work, including DB reads, across quotes and reposts. */
export function createNotificationTargetQueue(base: PostHistoryRelatedTargetResolver, active: () => boolean): PostHistoryRelatedTargetResolver {
    const groups = new Map<string, Job[]>();
    const running = new Set<string>();
    const pending = new Map<string, Promise<Result>>();
    let generation = 0;

    function pump() {
        if (!active()) return;
        for (const [id, jobs] of groups) {
            if (running.size >= 4) break;
            if (running.has(id)) continue;
            running.add(id);
            const epoch = generation;
            void (async () => {
                while (epoch === generation && active() && jobs.length) {
                    const job = jobs.shift()!;
                    try { const value = await job.run(); job.finish(epoch === generation && active() ? value : null); }
                    catch (error) { job.fail(error); }
                }
            })().finally(() => {
                if (epoch !== generation) return;
                for (const job of jobs) job.finish(null);
                groups.delete(id); running.delete(id); pump();
            });
        }
    }
    function schedule(descriptor: RelatedTargetDescriptor, run: Job['run'], mode = ''): Promise<Result> {
        if (!active()) return Promise.resolve(null);
        const key = JSON.stringify([descriptor, mode]);
        const existing = pending.get(key);
        if (existing) return existing;
        const task = new Promise<Result>((finish, fail) => {
            const jobs = groups.get(descriptor.targetEventId) ?? [];
            jobs.push({ scope: descriptor.scopeKey, run, finish, fail });
            groups.set(descriptor.targetEventId, jobs); pump();
        });
        pending.set(key, task);
        const clear = () => { if (pending.get(key) === task) pending.delete(key); };
        void task.then(clear, clear);
        return task;
    }
    const ensureTarget: PostHistoryRelatedTargetResolver['ensureTarget'] = (descriptor, options) => schedule(descriptor, () => base.ensureTarget(descriptor, options), JSON.stringify(options));
    return {
        ...base, ensureTarget,
        ensureTargets: (descriptors, options) => Promise.all(descriptors.map(descriptor => ensureTarget(descriptor, options))),
        retryTarget: (descriptor, options) => schedule(descriptor, () => base.retryTarget(descriptor, options), `retry:${JSON.stringify(options)}`),
        prepareRepostTarget: (descriptor, target) => schedule(descriptor, () => base.prepareRepostTarget(descriptor, target), 'prepare'),
        invalidateScope(scope) {
            for (const jobs of groups.values()) for (let index = jobs.length - 1; index >= 0; index--) {
                if (jobs[index].scope === scope) jobs.splice(index, 1)[0].finish(null);
            }
            base.invalidateScope(scope);
        },
        reset() {
            generation++;
            for (const jobs of groups.values()) for (const job of jobs) job.finish(null);
            groups.clear(); running.clear(); pending.clear(); base.reset();
        },
    };
}
