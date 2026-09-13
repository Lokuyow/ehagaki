import { PostManager } from '../../lib/postManager';
import type { PostResult } from '../../lib/types';

/** Replace only the transport boundary, keeping extraction and status ownership real. */
export function installPostSubmitHarness() {
    const submissions: Array<{ content: string; emojiTags: string[][]; metadata: unknown }> = [];
    let resolve: ((result: PostResult) => void) | undefined;
    PostManager.prototype.submitPost = function (content, metadata, emojiTags) {
        submissions.push({ content, emojiTags: (emojiTags ?? []).map(tag => [...tag]), metadata });
        return new Promise<PostResult>((done) => { resolve = done; });
    };
    const harness = {
        submissions,
        finish(success = true) {
            if (!resolve) throw new Error('No pending submission');
            const done = resolve;
            resolve = undefined;
            done({ success, ...(success ? {} : { error: 'postComponent.post_error' }) });
        },
    };
    (window as any).__postSubmitHarness = harness;
    return harness;
}
