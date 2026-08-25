<script lang="ts">
    import { useComposerLayoutMetrics } from "../../../lib/hooks/useComposerLayoutMetrics.svelte";

    interface Props {
        setupViewportListener: () => (() => void) | undefined;
        keyboardLayoutState: number;
    }

    let { setupViewportListener, keyboardLayoutState }: Props = $props();

    useComposerLayoutMetrics({
        setupViewportListener: () => {
            // Mirror the reactive keyboard layout read made during real setup.
            void keyboardLayoutState;
            return setupViewportListener();
        },
        getComposerScrollRegionEl: () => null,
        getComposerScrollContentEl: () => null,
        getCustomEmojiPickerRegionEl: () => null,
        getCustomEmojiPickerOpen: () => false,
        getReplyQuoteState: () => ({ reply: null, quotes: [] }),
        minHeight: 100,
    });
</script>

<div data-testid="composer-layout-metrics-hook"></div>
