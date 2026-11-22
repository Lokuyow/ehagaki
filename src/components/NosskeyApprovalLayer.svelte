<script lang="ts">
    import { Dialog } from "bits-ui";
    import { _ } from "svelte-i18n";
    import { readDialogOpener } from "../lib/dialogCloseFocus";
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
        };
    });

    function restoreFocus(event: Event): void {
        event.preventDefault();
        const root = layer;
        const prior = previousFocus;
        previousFocus = null;
        if (!root) return;

        // Bits UI calls this before unregistering the scope. Wait until it
        // releases focus and the background is interactive again.
        requestAnimationFrame(() => {
            if (nosskey.state.visible || !root.isConnected) return;
            const doc = root.ownerDocument;
            const dialog = doc.querySelector<HTMLElement>(
                '[data-state="open"]:is([role="dialog"], [role="alertdialog"]):not([hidden])',
            );
            const candidates = [
                prior,
                dialog,
                dialog?.querySelector<HTMLElement>("button:not(:disabled)"),
                doc.querySelector<HTMLElement>(".login-btn, .profile-display"),
                doc.querySelector<HTMLElement>("main[tabindex]"),
            ];
            for (const target of candidates) {
                if (!target?.isConnected || root.contains(target)
                    || target.closest("[inert], [hidden]") || target.matches(":disabled")) continue;
                target.focus({ preventScroll: true });
                if (doc.activeElement === target) break;
            }
        });
    }
</script>

<Dialog.Root open={nosskey.state.visible}>
    <Dialog.Portal to={document.body}>
        <Dialog.Content
            forceMount
            bind:ref={layer}
            class="nosskey-approval-layer"
            hidden={!nosskey.state.visible}
            onEscapeKeydown={(event) => {
                event.preventDefault();
                nosskey.dismissApproval();
            }}
            interactOutsideBehavior="ignore"
            onOpenAutoFocus={() => { previousFocus = readDialogOpener(layer?.ownerDocument); }}
            onCloseAutoFocus={restoreFocus}
            preventScroll={false}
        >
            <Dialog.Title class="visually-hidden">Nosskey</Dialog.Title>
            <button type="button" class="nosskey-close" onclick={nosskey.dismissApproval}>
                {$_("nosskey.close_approval")}
            </button>
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
    .nosskey-close {
        justify-self: end;
        margin-bottom: 8px;
        min-height: 44px;
        padding: 6px 12px;
        color: var(--text);
        background: var(--dialog-bg);
        border: 1px solid var(--btn-border);
        border-radius: 6px;
    }
    .nosskey-approval-status {
        max-width: 420px;
        margin: 8px 0 0;
        color: white;
    }
</style>
