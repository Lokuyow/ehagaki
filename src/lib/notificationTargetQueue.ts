import type { PostHistoryRelatedTargetResolver, RelatedTargetDescriptor } from './postHistoryRelatedTargetResolver.svelte';

type Result = Awaited<ReturnType<PostHistoryRelatedTargetResolver['ensureTarget']>>;
type Job = { scope: string; run: () => Promise<Result>; finish: (value: Result) => void; fail: (error: unknown) => void };

/** Serialize requests for the same target so retries cannot overtake its current lookup. */
export function createNotificationTargetQueue(base: PostHistoryRelatedTargetResolver, active: () => boolean): PostHistoryRelatedTargetResolver {
    const groups = new Map<string, Job[]>();
    const running = new Set<string>();
    const pending = new Map<string, { scope: string; task: Promise<Result> }>();
    let generation = 0;

    async function runGroup(id: string, jobs: Job[]) {
        running.add(id);
        const epoch = generation;
        while (epoch === generation && active() && jobs.length) {
            const job = jobs.shift()!;
            try {
                const value = await job.run();
                job.finish(epoch === generation && active() ? value : null);
            } catch (error) {
                job.fail(error);
            }
        }
        if (epoch !== generation) return;
        for (const job of jobs) job.finish(null);
        groups.delete(id);
        running.delete(id);
    }
    function schedule(descriptor: RelatedTargetDescriptor, run: Job['run'], mode = ''): Promise<Result> {
        if (!active()) return Promise.resolve(null);
        const key = JSON.stringify([descriptor, mode]);
        const existing = pending.get(key);
        if (existing) return existing.task;
        const task = new Promise<Result>((finish, fail) => {
            const jobs = groups.get(descriptor.targetEventId) ?? [];
            jobs.push({ scope: descriptor.scopeKey, run, finish, fail });
            groups.set(descriptor.targetEventId, jobs);
            if (!running.has(descriptor.targetEventId)) void runGroup(descriptor.targetEventId, jobs);
        });
        pending.set(key, { scope: descriptor.scopeKey, task });
        const clear = () => { if (pending.get(key)?.task === task) pending.delete(key); };
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
            for (const [key, entry] of pending) if (entry.scope === scope) pending.delete(key);
            for (const jobs of groups.values()) for (let index = jobs.length - 1; index >= 0; index--) {
                const job = jobs[index];
                if (job.scope === scope) {
                    jobs.splice(index, 1);
                    job.finish(null);
                }
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

type Work = { id: string; start: () => Promise<void>; cancel: () => void };

/** Give each stage its own slots so a slow relay cannot block local reads. */
export function createNotificationTargetWorkQueue() {
    const waiting = new Set<Work>();
    const running = new Set<Work>();

    function pump() {
        for (const job of waiting) {
            if (running.size >= 4) break;
            waiting.delete(job);
            running.add(job);
            void job.start().finally(() => {
                if (running.delete(job)) pump();
            });
        }
    }

    return {
        run<T>(id: string, work: () => Promise<T>): Promise<T | null> {
            return new Promise((resolve, reject) => {
                waiting.add({
                    id,
                    async start() {
                        try { resolve(await work()); }
                        catch (error) { reject(error); }
                    },
                    cancel: () => resolve(null),
                });
                pump();
            });
        },
        cancel(id: string) {
            for (const job of waiting) {
                if (job.id !== id) continue;
                waiting.delete(job);
                job.cancel();
            }
        },
        reset() {
            for (const job of waiting) job.cancel();
            waiting.clear();
            running.clear();
        },
    };
}
