<script lang="ts">
    import { usePostButtonLongPress } from "../../../lib/hooks/usePostButtonLongPress.svelte";

    interface Props {
        disabled?: boolean;
        onComplete: () => void;
        onReleaseEarly?: () => void;
    }

    let { disabled = false, onComplete, onReleaseEarly }: Props = $props();

    const longPress = usePostButtonLongPress({
        isDisabled: () => disabled,
        onComplete: () => onComplete(),
        onReleaseEarly: () => onReleaseEarly?.(),
    });
</script>

<button
    type="button"
    data-progress={longPress.progress}
    data-ring-visible={longPress.ringVisible}
    onpointerdown={longPress.start}
    onpointerup={longPress.cancel}
    onpointerleave={longPress.cancel}
    onclick={() => {
        if (!longPress.consumeSuppressedClick()) onComplete();
    }}
>
    post
</button>
