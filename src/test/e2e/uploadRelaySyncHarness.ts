import "../../app.css";
import "../../i18n";
import { mount } from "svelte";
import { locale, waitLocale } from "svelte-i18n";
import { createRxNostr } from "rx-nostr";
import { verifyEvent, nip19, type EventTemplate, type VerifiedEvent } from "nostr-tools";
import SettingsUploadDestinationSection from "../../components/settings/SettingsUploadDestinationSection.svelte";
import { setNip07Auth } from "../../stores/authStore.svelte";
import { uploadDestinationStore } from "../../stores/uploadDestinationStore.svelte";
import { uploadDestinationsRepository } from "../../lib/storage/uploadDestinationsRepository";
import { DEFAULT_UPLOAD_CAPABILITIES } from "../../lib/upload/uploadDestinationPresets";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import { NostrAuthService } from "../../lib/nostrAuthService";
import { resolveCurrentUploadDestination } from "../../lib/upload/resolveCurrentUploadDestination";

declare global {
    interface Window {
        fixtureSignUploadEvent: (template: EventTemplate) => Promise<VerifiedEvent>;
        uploadRelaySnapshot: () => { id: string; protocol: string; serverUrl: string; enabled: boolean; isDefault: boolean; nip96UrlMode?: string }[];
        uploadRelayFixtureImage: () => Promise<boolean>;
    }
}
const query = new URLSearchParams(location.search);
const owner = query.get("owner")!;
await waitLocale();
locale.set(query.get("lang") ?? "ja");
await waitLocale();
Reflect.set(window, "nostr", { getPublicKey: async () => owner, signEvent: (template: EventTemplate) => window.fixtureSignUploadEvent(template) });
setNip07Auth(owner, nip19.npubEncode(owner), "fixture");
const rxNostr = createRxNostr({ verifier: async event => verifyEvent(event), skipFetchNip11: true, retry: { strategy: "off" } });
rxNostr.setDefaultRelays({ "wss://relay.example/": { read: true, write: true } });
const timestamp = Date.now();
for (const [index, protocol] of (["blossom", "nip96", "custom-http"] as const).entries()) {
    await uploadDestinationsRepository.put({
        id: protocol, pubkeyHex: owner, name: protocol, protocol,
        serverUrl: protocol === "blossom" ? "https://old-blossom.example" : "https://files.example/api",
        ...(protocol === "nip96" ? { nip96ServerUrl: "https://files.example", resolvedUploadUrl: "https://files.example/api" } : {}),
        presetId: "custom", enabled: true, isDefault: index === 0, sortIndex: index,
        createdAt: timestamp, updatedAt: timestamp, schemaVersion: 1,
        auth: { type: protocol === "blossom" ? "blossom-bud11" : protocol === "nip96" ? "nip98" : "custom" },
        capabilities: { ...DEFAULT_UPLOAD_CAPABILITIES },
    });
}
window.uploadRelaySnapshot = () => uploadDestinationStore.value.destinations.map(({ id, protocol, serverUrl, enabled, isDefault, nip96UrlMode }) => ({ id, protocol, serverUrl, enabled, isDefault, nip96UrlMode }));
window.uploadRelayFixtureImage = async () => {
    const result = await new Nip96UploadAdapter().upload({
        destination: await resolveCurrentUploadDestination(),
        file: new File(["fixture image"], "fixture.png", { type: "image/png" }),
        authService: new NostrAuthService({ expectedPubkey: owner }), fetch: window.fetch.bind(window),
    });
    return result.success;
};
const app = document.getElementById("app")!;
const target = query.get("surface") === "shadow" ? app.attachShadow({ mode: "open" }) : app;
if (target instanceof ShadowRoot) {
    for (const sheet of document.querySelectorAll('style, link[rel="stylesheet"]')) target.append(sheet.cloneNode(true));
}
mount(SettingsUploadDestinationSection, { target, props: { rxNostr } });
window.addEventListener("pagehide", () => { uploadDestinationStore.reset(); rxNostr.dispose(); }, { once: true });
