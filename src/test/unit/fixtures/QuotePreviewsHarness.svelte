<script lang="ts">
    import { untrack } from 'svelte';
    import type { RxNostr } from 'rx-nostr';
    import { usePostHistoryQuotePreviews } from '../../../lib/hooks/usePostHistoryQuotePreviews.svelte';
    import type { PostHistoryRelatedTargetResolver } from '../../../lib/postHistoryRelatedTargetResolver.svelte';
    import type { PostHistoryRecord } from '../../../lib/storage/ehagakiDb';
    interface Props { posts: PostHistoryRecord[]; resolver: PostHistoryRelatedTargetResolver; runtime: RxNostr; show?: boolean; }
    let { posts, resolver, runtime, show = true }: Props = $props();
    const quotes = usePostHistoryQuotePreviews({ getShow: () => show, getPosts: () => posts,
        getRxNostr: () => runtime, getRelayConfig: () => null, relatedTargetResolver: untrack(() => resolver) });
</script>
{#if show}
    {#each posts as post (post.eventId)}
        {#each quotes.getQuotePreviews(post) as preview (preview.eventId)}
            <div data-testid={post.eventId}>
                <p>{preview.status}</p>
                {#if preview.status === 'resolved'}<p>{preview.event.content}</p>{/if}
            </div>
        {/each}
    {/each}
{/if}
