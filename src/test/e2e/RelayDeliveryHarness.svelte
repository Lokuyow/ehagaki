<script lang="ts">
    import { onDestroy } from "svelte";
    import { Subject } from "rxjs";
    import type { RxNostr } from "rx-nostr";
    import RelayDeliveryToasts from "../../components/RelayDeliveryToasts.svelte";
    import DialogWrapper from "../../components/DialogWrapper.svelte";
    import ConfirmDialog from "../../components/ConfirmDialog.svelte";
    import { startRelayPublish, cancelRelayOperations } from "../../lib/relay/publish";
    let open = $state(false);
    let confirmation = $state(false);
    const sources: Subject<any>[] = [];
    const rx = { send: () => { const source = new Subject<any>(); sources.push(source); return source; } } as unknown as RxNostr;
    const relays = ["wss://a.example/", "wss://b.example/", "wss://c.example/"];
    window.__deliveryHarness = {
        start() { const index = sources.length; startRelayPublish(rx, { id: `fixture-${index}`, kind: 1, content: "synthetic fixture" }, { targetRelays: relays }); return index; },
        ack(index, relay, ok = true, done = true) { sources[index].next({ from: relays[relay], eventId: `fixture-${index}`, ok, done, notice: "auth-required: fixture" }); },
        observed(index) { return sources[index].observed; }, reset() { cancelRelayOperations(rx); },
    };
    onDestroy(() => { cancelRelayOperations(rx); delete window.__deliveryHarness; });
</script>
<div class="controls">
    <input aria-label="Composer" placeholder="Synthetic composer" />
    <button onclick={() => { open = true; }}>Open dialog</button>
</div>
<div class="footer-bar">Footer controls</div>
<DialogWrapper bind:open title="Delivery dialog" description="Synthetic modal" footerVariant="close-button">
    <div style="height:190px;width:100%"><input aria-label="Dialog input" /><button onclick={() => { confirmation = true; }}>Open confirmation</button></div>
    {#snippet footer()}<button onclick={() => { open = false; }}>Close dialog</button>{/snippet}
</DialogWrapper>
<ConfirmDialog open={confirmation} onOpenChange={next => { confirmation = next; }} description="Synthetic confirmation" onConfirm={() => { confirmation = false; }} />
<RelayDeliveryToasts rxNostr={rx} />
<style>
    .controls { display: flex; flex-wrap: wrap; gap: 12px; padding: 20px; }
    .footer-bar { position: absolute; bottom: 0; height: 48px; width: 100%; background: var(--bg-footer); }
</style>
