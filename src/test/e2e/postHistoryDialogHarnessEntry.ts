import '../../app.css';
import '../../i18n';
import { mount } from 'svelte';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Harness mount target was not found.');
}

if (new URLSearchParams(location.search).has("media-registration-host")) {
    const iframe = document.createElement("iframe");
    const url = new URL(location.href);
    url.searchParams.delete("media-registration-host");
    url.searchParams.set("media-registration", "1");
    url.searchParams.set("container", "1");
    iframe.src = url.href;
    iframe.title = "Media registration fixture";
    iframe.style.cssText = "width:280px;height:760px;border:0;display:block";
    target.append(iframe);
} else if (new URLSearchParams(location.search).has("media-registration")) {
    const { default: UploadMediaRegistrationHarness } = await import("./UploadMediaRegistrationHarness.svelte");
    mount(UploadMediaRegistrationHarness, { target });
} else if (new URLSearchParams(location.search).has("history-opening")) {
    const { default: HistoryOpeningHarness } = await import("./HistoryOpeningHarness.svelte");
    mount(HistoryOpeningHarness, { target });
} else if (new URLSearchParams(location.search).has("repost")) {
    const { default: PostRepostHarness } = await import("./PostRepostHarness.svelte");
    mount(PostRepostHarness, { target });
} else {
    const { default: PostHistoryDialogHarness } = await import("./PostHistoryDialogHarness.svelte");
    mount(PostHistoryDialogHarness, { target });
}
