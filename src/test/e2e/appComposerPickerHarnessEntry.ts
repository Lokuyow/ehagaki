import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';
import App from '../../App.svelte';
import { STORAGE_KEYS } from '../../lib/constants';
import { updateAuthState } from '../../stores/authStore.svelte';
import { editorState, updatePostStatus } from '../../stores/editorStore.svelte';

const target = document.getElementById('app');

if (!target) {
    throw new Error('App composer picker harness mount target was not found.');
}

const TEST_PUBKEY = 'a'.repeat(64);

// Keep the unrelated first-visit welcome dialog from intercepting the composer
// interaction this harness is meant to exercise.
localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, '1');

type HarnessWindow = Window & typeof globalThis & {
    __APP_COMPOSER_PICKER_HARNESS__?: {
        setAuthenticated(): void;
        setSending(): void;
        setIdle(): void;
    };
};

updateAuthState({
    type: 'nsec',
    isInitialized: true,
    isValid: true,
    pubkey: TEST_PUBKEY,
    npub: 'npub1testappcomposer',
    nprofile: 'nprofile1testappcomposer',
});

mount(App, { target });

(window as HarnessWindow).__APP_COMPOSER_PICKER_HARNESS__ = {
    setAuthenticated: () => {
        updateAuthState({
            type: 'nsec',
            isInitialized: true,
            isValid: true,
            pubkey: TEST_PUBKEY,
            npub: 'npub1testappcomposer',
            nprofile: 'nprofile1testappcomposer',
        });
    },
    setSending: () => {
        updatePostStatus({ ...editorState.postStatus, sending: true });
    },
    setIdle: () => {
        updatePostStatus({ ...editorState.postStatus, sending: false });
    },
};
