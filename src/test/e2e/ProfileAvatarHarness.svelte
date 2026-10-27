<script lang="ts">
    import { untrack } from "svelte";
    import ProfileAvatar from '../../components/ProfileAvatar.svelte';
    import FooterComponent from '../../components/FooterComponent.svelte';
    import ReplyQuotePreview from '../../components/ReplyQuotePreview.svelte';
    import PostHistoryReactionDetails from '../../components/PostHistoryReactionDetails.svelte';
    import PostHistoryRelatedEventCard from '../../components/PostHistoryRelatedEventCard.svelte';
    import { profileDataStore, profileLoadedStore } from '../../stores/profileStore.svelte';
    import { updateAuthState } from '../../stores/authStore.svelte';
    import type { ReplyQuoteState } from '../../lib/types';
    let name = $state('山田');
    let pubkey = $state('abcdef' + '0'.repeat(58));
    let picture = $state('');
    const noop = () => {};
    let profile = $derived({name: '', displayName: name, picture, npub: '', nprofile: ''});
    let event = $derived({id: '11'.repeat(32), pubkey, kind: 1, content: 'Test post', tags: [], created_at: 1, sig: '22'.repeat(64)});
    let reference: ReplyQuoteState = $derived({mode: 'reply', eventId: event.id, relayHints: [], authorPubkey: pubkey,
        quoteNotificationEnabled: false, authorDisplayName: name || null, authorPicture: picture || null,
        referencedEvent: event, rootEventId: null, rootRelayHint: null, rootPubkey: null, loading: false, error: null});
    $effect(() => {
        const activeProfile = profile;
        const activePubkey = pubkey;
        untrack(() => {
            profileDataStore.set(activeProfile);
            profileLoadedStore.set(true);
            updateAuthState({type: 'nip07', isValid: true, pubkey: activePubkey});
        });
    });
</script>
<div class="ehagaki-app-root">
    <label>Name <input aria-label="Name" bind:value={name} /></label>
    <button onclick={() => pubkey = '123456' + '0'.repeat(58)}>Switch account</button>
    <button onclick={() => picture = new URL('broken-avatar.png', location.href).href}>Broken image</button>
    <button onclick={() => picture = new URL('ehagaki_icon_x512.png', location.href).href}>Valid image</button>
    <button onclick={() => document.documentElement.classList.toggle('light')}>Theme</button>
    <div class="sizes">
        {#each [24, 36, 64] as size}
            <div style={`width:${size}px;height:${size}px;border-radius:50%;overflow:hidden`}>
                <ProfileAvatar pubkeyHex={pubkey} displayName={name} src={picture} />
            </div>
        {/each}
    </div>
    <ReplyQuotePreview {reference} mode="reply" onClear={noop} />
    <PostHistoryReactionDetails readModel={{totalCount: 1, groups: [{content: '+', count: 1, reactors: [{eventId: 'react', pubkey, profile, createdAt: 1}]}]}} />
    <PostHistoryRelatedEventCard {event} {profile} />
    <FooterComponent isAuthenticated={true} isAuthInitialized={true} isSwitchingAccount={false} swNeedRefresh={false}
        onShowLoginDialog={noop} onOpenPostHistoryDialog={noop} onOpenSettingsDialog={noop} onOpenLogoutDialog={noop} />
</div>
<style>.sizes { display: flex; gap: 12px; margin: 20px; } .ehagaki-app-root { padding-bottom: 100px; }</style>
