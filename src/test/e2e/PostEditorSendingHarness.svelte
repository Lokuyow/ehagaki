<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import PostComponent from '../../components/PostComponent.svelte';
    import { editorState, resetPostStatus, updatePostStatus } from '../../stores/editorStore.svelte';
    import { isLoadingProfileStore, profileDataStore, profileLoadedStore } from '../../stores/profileStore.svelte';

    let sending = $derived(editorState.postStatus.sending);

    function toggleSending(): void {
        updatePostStatus({ ...editorState.postStatus, sending: !editorState.postStatus.sending });
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
    <output data-testid="sending-state">{sending ? 'sending' : 'idle'}</output>
    <PostComponent hasStoredKey={true} />
</main>
