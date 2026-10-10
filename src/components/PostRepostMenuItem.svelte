<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";
    interface Props { pending?: boolean; onSelect: (event: Event) => void }
    let { pending = false, onSelect }: Props = $props();
</script>
<DropdownMenu.Item class="menu-action-button" disabled={pending} {onSelect}>
    <div class="repost-icon svg-icon" aria-hidden="true"></div>
    <span>{$_(pending ? "repost.sending" : "repost.action")}</span>
</DropdownMenu.Item>
<style>
    :global(.repost-icon) { mask-image: url("/icons/sync_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"); }
</style>
