<script lang="ts">
    import { onDestroy } from 'svelte';
    import PostComponent from '../../components/PostComponent.svelte';
    import { editorState, resetPostStatus, updatePostStatus } from '../../stores/editorStore.svelte';

    let sending = $derived(editorState.postStatus.sending);

    function toggleSending(): void {
        updatePostStatus({ ...editorState.postStatus, sending: !editorState.postStatus.sending });
    }

    onDestroy(() => {
        resetPostStatus();
    });
</script>

<main>
    <button type="button" data-testid="toggle-sending" onclick={toggleSending}>
        Toggle sending
    </button>
    <output data-testid="sending-state">{sending ? 'sending' : 'idle'}</output>
    <PostComponent hasStoredKey={true} />
</main>
