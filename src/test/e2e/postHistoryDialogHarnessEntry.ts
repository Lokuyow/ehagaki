import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';
import PostHistoryDialogHarness from './PostHistoryDialogHarness.svelte';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Harness mount target was not found.');
}

if (new URLSearchParams(location.search).has("repost")) {
    const { default: PostRepostHarness } = await import("./PostRepostHarness.svelte");
    mount(PostRepostHarness, { target });
} else mount(PostHistoryDialogHarness, { target });
