import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Harness mount target was not found.');
}

if (new URLSearchParams(location.search).has("history-opening")) {
    const { default: HistoryOpeningHarness } = await import("./HistoryOpeningHarness.svelte");
    mount(HistoryOpeningHarness, { target });
} else if (new URLSearchParams(location.search).has("repost")) {
    const { default: PostRepostHarness } = await import("./PostRepostHarness.svelte");
    mount(PostRepostHarness, { target });
} else {
    const { default: PostHistoryDialogHarness } = await import("./PostHistoryDialogHarness.svelte");
    mount(PostHistoryDialogHarness, { target });
}
