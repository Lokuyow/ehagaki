<script lang="ts">
    import { Dialog } from "bits-ui";
    import { tick } from "svelte";
    import { _ } from "svelte-i18n";
    import { nosskey } from "../lib/nosskeyService.svelte";

    let container: HTMLDivElement | undefined = $state();
    let layer: HTMLElement | null = $state(null);
    let previousFocus: HTMLElement | null = null;

    $effect(() => {
        if (container) return nosskey.attach(container);
    });

    $effect(() => {
        const root = layer;
        if (!nosskey.state.visible || !root) return;
        const doc = root.ownerDocument;
        previousFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
        const blocked = new Set<HTMLElement>();

        function blockBackground() {
            for (const child of doc.body.children) {
                if (!(child instanceof HTMLElement) || child.contains(root ?? null) || child.inert) continue;
                child.inert = true;
                blocked.add(child);
            }
        }

        blockBackground();
        const observer = new MutationObserver(blockBackground);
        observer.observe(doc.body, { childList: true });
        return () => {
            observer.disconnect();
            for (const child of blocked) child.inert = false;
            const prior = previousFocus;
            previousFocus = null;
            void tick().then(() => {
                if (nosskey.state.visible) return;
                if (prior?.isConnected && prior !== doc.body
                    && !prior.closest("[inert], [hidden]") && !prior.matches(":disabled")) {
                    prior.focus({ preventScroll: true });
                    if (doc.activeElement === prior) return;
                }

                const dialog = doc.querySelector<HTMLElement>(
                    '[data-state="open"][role="dialog"]:not([hidden]), [data-state="open"][role="alertdialog"]',
                );
                const fallback = dialog?.querySelector<HTMLElement>("button:not(:disabled)")
                    ?? dialog
                    ?? doc.querySelector<HTMLElement>(".login-btn, .profile-display")
                    ?? doc.querySelector<HTMLElement>("main[tabindex]");
                fallback?.focus({ preventScroll: true });
            });
        };
    });
</script>

<Dialog.Root open={nosskey.state.visible}>
    <Dialog.Portal to={document.body}>
        <Dialog.Content
            forceMount
            bind:ref={layer}
            class="nosskey-approval-layer"
            hidden={!nosskey.state.visible}
            escapeKeydownBehavior="ignore"
            interactOutsideBehavior="ignore"
            onCloseAutoFocus={(event) => event.preventDefault()}
            preventScroll={false}
        >
            <Dialog.Title class="visually-hidden">Nosskey</Dialog.Title>
            <div bind:this={container} class="nosskey-approval-frame" class:dark={nosskey.state.theme === "neutral-dark"}></div>
            {#if nosskey.state.notice === "timeout"}
                <p class="nosskey-approval-status" role="status">{$_("nosskey.close_previous")}</p>
            {:else if nosskey.state.pending > 1}
                <p class="nosskey-approval-status" role="status">{$_("nosskey.waiting")}</p>
            {/if}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<style>
    :global(.nosskey-approval-layer) {
        position: fixed;
        inset: 0;
        z-index: 20000;
        display: grid;
        place-content: center;
        justify-items: center;
        padding: 12px;
        background: rgb(0 0 0 / 55%);
    }
    :global(.nosskey-approval-layer[hidden]) { display: none; }
    .nosskey-approval-frame { --frame-background: #fff; }
    .nosskey-approval-frame.dark { --frame-background: #141414; }
    .nosskey-approval-frame :global(iframe) {
        width: min(420px, calc(100vw - 24px));
        height: min(560px, calc(100dvh - 100px));
        border: 0;
        border-radius: 12px;
        background: var(--frame-background);
    }
    .nosskey-approval-status {
        max-width: 420px;
        margin: 8px 0 0;
        color: white;
    }
</style>
