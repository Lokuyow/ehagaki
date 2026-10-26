<script lang="ts">
    import { onMount } from "svelte";
    import { nip19, type EventTemplate, type VerifiedEvent } from "nostr-tools";
    import { locale, waitLocale } from "svelte-i18n";
    import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
    import { setNip07Auth } from "../../stores/authStore.svelte";
    import { profileDataStore } from "../../stores/profileStore.svelte";
    import { historyTabStore } from "../../stores/historyTabStore.svelte";
    import { uploadDestinationsRepository } from "../../lib/storage/uploadDestinationsRepository";
    import { createUploadDestinationFromPreset, UPLOAD_DESTINATION_PRESETS } from "../../lib/upload/uploadDestinationPresets";
    import { configureAppRuntimeEnvironment } from "../../lib/appRuntimeEnvironment";

    const query = new URLSearchParams(location.search);
    const owner = query.get("owner")!;
    const npub = nip19.npubEncode(owner);
    const destination = createUploadDestinationFromPreset({ preset: UPLOAD_DESTINATION_PRESETS.find(preset =>
        preset.id === (query.get("server") === "nostr-build" ? "nostr-build" : query.get("server") === "nostrcheck" ? "nostrcheck-me" : "share-yabu-me"))!, pubkeyHex: owner, isDefault: true });
    Reflect.set(window, "nostr", { getPublicKey: async () => owner, signEvent: (event: EventTemplate) =>
        (Reflect.get(window, "fixtureSignMediaRegistrationEvent") as (event: EventTemplate) => Promise<VerifiedEvent>)(event) });
    setNip07Auth(owner, npub, nip19.nprofileEncode({ pubkey: owner, relays: [] }));
    profileDataStore.set({ name: "fallback_name", displayName: query.has("profile-fallback") ? "" : "表示名🎨", picture: "", npub, nprofile: "" });
    if (query.has("container")) configureAppRuntimeEnvironment({ layoutMode: "container", runtimeKind: "iframe" });
    historyTabStore.select("media");
    let ready = $state(false), open = $state(true);
    onMount(() => {
        void (async () => {
            await waitLocale(); locale.set(query.get("lang") ?? "ja"); await waitLocale();
            await uploadDestinationsRepository.put(destination);
            if (query.get("server") === "nostr-build") {
                await uploadDestinationsRepository.put(createUploadDestinationFromPreset({
                    preset: UPLOAD_DESTINATION_PRESETS.find(preset => preset.id === "share-yabu-me")!, pubkeyHex: owner,
                }));
            }
            ready = true;
        })();
    });
</script>

{#if ready && open}<PostHistoryDialog show={true} pubkeyHex={owner} onClose={() => { open = false; }} />{/if}
