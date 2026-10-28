<script lang="ts">
    import type { RxNostr } from "rx-nostr";
    import { Portal } from "bits-ui";
    import { _ } from "svelte-i18n";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
    import { observeRelayDeliveries } from "../lib/relay/deliveryProgress";
    import { createRelayDeliveryToasts, type RelayDeliveryToast } from "../lib/relay/deliveryToasts";
    import { positionDeliveryToasts } from "../lib/relay/deliveryToastPosition";

    interface Props { rxNostr?: RxNostr }
    let { rxNostr }: Props = $props();
    const runtime = getAppRuntimeEnvironment();
    let rows = $state<RelayDeliveryToast[]>([]);
    let controller: ReturnType<typeof createRelayDeliveryToasts> | undefined;
    let container = $state<HTMLDivElement>();
    let target = $state(runtime.overlayTarget);
    let position = $state("visibility:hidden");
    $effect(() => {
        const rx = rxNostr;
        if (!rx) { rows = []; return; }
        const current = createRelayDeliveryToasts(observeRelayDeliveries(rx), next => { rows = next; });
        controller = current;
        return () => { current.dispose(); if (controller === current) controller = undefined; };
    });
    $effect(() => {
        if (!container) return;
        return positionDeliveryToasts(container, runtime, placement => {
            if (target !== placement.target) {
                target = placement.target;
                position = "visibility:hidden";
                return;
            }
            target = placement.target;
            position = placement.style;
        });
    });
    const ratio = (row: RelayDeliveryToast) => row.progress.state === "complete" ? 1
        : Math.min(.95, row.progress.total ? row.progress.accepted / row.progress.total : 0);
</script>

{#if rows.length}
    <Portal to={target}>
        <div bind:this={container} class="relay-delivery-stack" style={position} data-relay-delivery-stack>
            {#each rows as row (row.progress.id)}
                <button type="button" class="relay-delivery-toast" class:discovering={row.progress.discovering}
                    class:complete={row.progress.state === "complete"} class:fading={row.fading}
                    style={`--delivery-ratio:${ratio(row)};--delivery-strength:${40 + ratio(row) * 60}%;--delivery-fade:${row.fadeMs}ms;`}
                    data-delivery-id={row.progress.id} data-delivery-state={row.progress.state}
                    aria-label={$_("relayDelivery.dismiss")}
                    aria-describedby={`relay-delivery-${row.progress.id}`}
                    onpointerdown={event => event.preventDefault()}
                    onclick={() => controller?.dismiss(row.progress.id)}>
                    <span class="relay-delivery-track" role="progressbar" id={`relay-delivery-${row.progress.id}`}
                        aria-label={$_(row.progress.discovering ? "relayDelivery.discovering" : "relayDelivery.progress",
                            { values: { accepted: row.progress.accepted, total: row.progress.total } })}
                        aria-valuemin={0} aria-valuemax={100}
                        aria-valuenow={row.progress.discovering ? undefined : Math.round(ratio(row) * 100)}>
                        <span class="relay-delivery-fill"></span>
                    </span>
                </button>
            {/each}
        </div>
    </Portal>
{/if}

<style>
    .relay-delivery-stack {
        z-index: 100001; display: flex; flex-direction: row; align-items: stretch; gap: 8px;
        box-sizing: border-box; pointer-events: none; overflow-y: auto;
        padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
        scrollbar-width: none;
    }
    .relay-delivery-toast {
        all: unset; box-sizing: border-box; display: flex; align-items: center;
        flex: 1 1 32px; min-width: 0; height: 100%; padding: 12px 7px; border-radius: 999px;
        cursor: pointer; pointer-events: auto;
        opacity: 1; transition: opacity var(--delivery-fade) ease-out;
        -webkit-tap-highlight-color: transparent;
    }
    .relay-delivery-toast:focus-visible { outline: 2px solid var(--accent-color, #20bc7a); outline-offset: -2px; }
    .relay-delivery-track { position: relative; display: block; width: 18px; height: 100%; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--text, #888) 12%, transparent); }
    .relay-delivery-fill {
        position: absolute; bottom: 0; display: block; width: 100%; height: calc(var(--delivery-ratio) * 100%); border-radius: inherit;
        background: color-mix(in srgb, var(--accent-color, #20bc7a) var(--delivery-strength), #7a9b8c);
        transition: height 240ms ease-out, background-color 240ms ease-out;
    }
    .discovering .relay-delivery-fill { height: 30%; animation: delivery-discover 1.4s ease-in-out infinite alternate; }
    .complete .relay-delivery-fill { animation: delivery-complete 700ms ease-out; }
    .fading { opacity: 0; }
    @keyframes delivery-discover { from { transform: translateY(0); } to { transform: translateY(-230%); } }
    @keyframes delivery-complete { 40% { filter: brightness(1.35); } }
    @media (prefers-reduced-motion: reduce) {
        .relay-delivery-toast, .relay-delivery-fill { animation: none; }
        .relay-delivery-fill { transition: none; }
    }
</style>
