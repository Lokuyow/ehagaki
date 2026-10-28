import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';
import App from '../../App.svelte';
import { STORAGE_KEYS } from '../../lib/constants';
import { updateAuthState } from '../../stores/authStore.svelte';
import { editorState, updatePostStatus } from '../../stores/editorStore.svelte';
import { installPostSubmitHarness } from './postSubmitHarness';
import { AuthService } from '../../lib/authService';

installPostSubmitHarness();

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

// Let App complete its real post-auth bootstrap once the test authenticates.
// Updating the store alone does not prepare a posting session.
let authenticate: () => void;
const authenticationRequested = new Promise<void>(resolve => { authenticate = resolve; });
AuthService.prototype.initializeAuth = async () => {
    await authenticationRequested;
    return { hasAuth: true, pubkeyHex: TEST_PUBKEY };
};

mount(App, { target, props: { hostRelayConfig: {} } });

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
        authenticate();
    },
    setSending: () => {
        updatePostStatus({ ...editorState.postStatus, sending: true });
    },
    setIdle: () => {
        updatePostStatus({ ...editorState.postStatus, sending: false });
    },
};
