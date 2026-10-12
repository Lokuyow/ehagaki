<script lang="ts">
    import { usePostHistoryListing } from "../../lib/hooks/usePostHistoryListing.svelte";
    import type { RxNostr } from "rx-nostr";
    interface Props { show: boolean; pubkeyHex: string; rxNostr: RxNostr; onClose(): void }
    let { show, pubkeyHex, rxNostr }: Props = $props();
    const history = usePostHistoryListing({ getShow: () => show, getPubkeyHex: () => pubkeyHex,
        getRxNostr: () => rxNostr, getRelayConfig: () => undefined });
</script>

{#each history.posts as post (post.eventId)}
    <p class="post-history-item">{post.content}</p>
{/each}
{#if history.isFetchingFromRelays}<p>リレーと同期中...</p>{/if}
{#if history.state.syncStatus === "failed"}<p>リレーとの同期に失敗しました</p>{/if}
{#if history.state.hasOlderLocal}
    <button disabled={!history.canLoadOlder} onclick={() => void history.loadOlder()}>さらに古い投稿を表示</button>
{/if}
{#if history.canFetchOlderFromRelays || history.isFetchingFromRelays}
    <button disabled={!history.canFetchOlderFromRelays} onclick={() => void history.fetchOlderFromRelays()}>リレーから続きを取得</button>
{/if}
