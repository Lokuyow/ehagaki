import { PostManager } from '../../lib/postManager';
import type { PostResult } from '../../lib/types';
import { recordImeDebugLifecycle } from '../../lib/debug/imeDebugInstrumentation';

/** Replace only the transport boundary, keeping extraction and status ownership real. */
export function installPostSubmitHarness() {
    const submissions: Array<{ content: string; emojiTags: string[][]; metadata: unknown }> = [];
    let resolve: ((result: PostResult) => void) | undefined;
    let autoSuccessTimer: number | undefined;
    const debugAutoSuccess = new URLSearchParams(window.location.search).get('ehagakiImeDebug') === '1';
    const recordDebugHarnessEvent = (label: string, extra?: Record<string, unknown>) => {
        if (!debugAutoSuccess) return;
        recordImeDebugLifecycle(label, extra);
    };
    PostManager.prototype.submitPost = function (content, metadata, emojiTags) {
        submissions.push({ content, emojiTags: (emojiTags ?? []).map(tag => [...tag]), metadata });
        const result = new Promise<PostResult>((done) => { resolve = done; });
        if (debugAutoSuccess) {
            const delayMs = 600;
            recordDebugHarnessEvent('debug-auto-success-scheduled', { delayMs });
            autoSuccessTimer = window.setTimeout(() => {
                autoSuccessTimer = undefined;
                if (!resolve) return;
                recordDebugHarnessEvent('debug-auto-success-fired');
                harness.finish(true);
            }, delayMs);
        }
        return result;
    };
    const harness = {
        submissions,
        finish(success = true) {
            if (!resolve) throw new Error('No pending submission');
            if (autoSuccessTimer !== undefined) {
                window.clearTimeout(autoSuccessTimer);
                autoSuccessTimer = undefined;
            }
            const done = resolve;
            resolve = undefined;
            done({ success, ...(success ? {} : { error: 'postComponent.post_error' }) });
        },
    };
    (window as any).__postSubmitHarness = harness;
    return harness;
}
