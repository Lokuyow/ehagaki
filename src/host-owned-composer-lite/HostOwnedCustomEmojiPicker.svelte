<script lang="ts">
  import { _ } from "svelte-i18n";

  export interface HostOwnedCustomEmojiItem {
    identityKey: string;
    shortcode: string;
    src: string;
    setAddress: string | null;
    shortcodeLower: string;
    sortIndex: number;
    sourceType: "kind10030";
    sourceAddress: string | null;
  }

  interface Props {
    items: readonly HostOwnedCustomEmojiItem[];
    onSelect: (item: HostOwnedCustomEmojiItem) => void;
  }

  let { items, onSelect }: Props = $props();
</script>

<div class="host-owned-emoji-picker" aria-label={$_("keyboardButtonBar.custom_emoji")}>
  {#each items as item (item.identityKey)}
    <button type="button" class="emoji-button" onclick={() => onSelect(item)} aria-label={`:${item.shortcode}:`}>
      <img src={item.src} alt={`:${item.shortcode}:`} />
    </button>
  {/each}
</div>

<style>
  .host-owned-emoji-picker { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; }
  .emoji-button { width: 36px; height: 36px; border: 0; background: transparent; padding: 4px; cursor: pointer; }
  .emoji-button img { width: 100%; height: 100%; object-fit: contain; }
</style>
