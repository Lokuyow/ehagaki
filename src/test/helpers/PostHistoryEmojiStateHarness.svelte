<script lang="ts">
    import { usePostHistoryEmojiState } from "../../lib/hooks/usePostHistoryEmojiState.svelte";

    interface Props {
        urls: string[];
        show?: boolean;
        onStateChanged?: () => void;
        onReady: (state: ReturnType<typeof usePostHistoryEmojiState>) => void;
    }

    let { urls, show = true, onStateChanged, onReady }: Props = $props();

    const emojiState = usePostHistoryEmojiState({
        getShow: () => show,
        getEmojiUrls: () => urls,
        onStateChanged: () => onStateChanged?.(),
    });
    $effect.pre(() => {
        onReady(emojiState);
    });
</script>
