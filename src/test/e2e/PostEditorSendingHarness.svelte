<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import PostComponent from '../../components/PostComponent.svelte';
    import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';
    import type { CustomEmojiSelection } from '../../lib/customEmojiUsage';
    import { editorState, resetPostStatus, updatePostStatus } from '../../stores/editorStore.svelte';
    import { isLoadingProfileStore, profileDataStore, profileLoadedStore } from '../../stores/profileStore.svelte';

    let sending = $derived(editorState.postStatus.sending);
    let pickerOpen = $state(false);
    let postComponentRef: any = $state(null);

    const pickerEmoji = {
        shortcode: 'sending-safe',
        shortcodeLower: 'sending-safe',
        src: 'https://example.com/sending-safe.webp',
        identityKey: 'sending-safe\u0000https://example.com/sending-safe.webp',
        setAddress: null,
        sortIndex: 0,
        sourceType: 'kind10030' as const,
        sourceAddress: null,
    };

    function toggleSending(): void {
        updatePostStatus({ ...editorState.postStatus, sending: !editorState.postStatus.sending });
    }

    function completePost(): void {
        updatePostStatus({
            sending: false,
            success: true,
            error: false,
            message: 'postComponent.post_success',
            completed: true,
        });
        postComponentRef?.clearContentAfterSuccess?.();
    }

    function failPost(): void {
        updatePostStatus({
            sending: false,
            success: false,
            error: true,
            message: 'postComponent.post_error',
            completed: false,
        });
    }

    function selectPickerEmoji(emoji: CustomEmojiSelection): void {
        postComponentRef?.insertCustomEmoji?.(emoji);
    }

    onMount(() => {
        const hasProfileAvatar = window.location.search.includes('withProfileAvatar');
        const hasFallbackAvatar = window.location.search.includes('withFallbackAvatar');
        if (!hasProfileAvatar && !hasFallbackAvatar) return;

        profileDataStore.set({
            name: 'Geometry Test Profile',
            displayName: 'Geometry Test Profile',
            picture: hasProfileAvatar
                ? new URL(`${import.meta.env.BASE_URL}ehagaki_icon_x512.png`, window.location.origin).href
                : '',
            npub: '',
            nprofile: '',
        });
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(true);
    });

    onDestroy(() => {
        resetPostStatus();
        profileDataStore.set({ name: '', displayName: '', picture: '', npub: '', nprofile: '' });
        isLoadingProfileStore.set(false);
        profileLoadedStore.set(false);
    });
</script>

<main>
    <button type="button" data-testid="toggle-sending" onclick={toggleSending}>
        Toggle sending
    </button>
    <button type="button" data-testid="toggle-picker" onclick={() => (pickerOpen = !pickerOpen)}>
        Toggle picker
    </button>
    <button type="button" data-testid="complete-post" onclick={completePost}>
        Complete post
    </button>
    <button type="button" data-testid="fail-post" onclick={failPost}>
        Fail post
    </button>
    <output data-testid="sending-state">{sending ? 'sending' : 'idle'}</output>
    <PostComponent bind:this={postComponentRef} hasStoredKey={true} />
    {#if pickerOpen}
        <div data-testid="custom-emoji-picker-host">
            <CustomEmojiPicker
                open={pickerOpen}
                hostCustomEmojiItems={[pickerEmoji]}
                onSelect={selectPickerEmoji}
            />
        </div>
    {/if}
</main>
