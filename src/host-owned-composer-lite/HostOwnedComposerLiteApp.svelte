<script lang="ts">
  import { onMount } from "svelte";
  import "../i18n";
  import { Tooltip } from "bits-ui";
  import { waitLocale } from "svelte-i18n";
  import PostComponent from "../components/PostComponent.svelte";
  import KeyboardButtonBar from "../components/KeyboardButtonBar.svelte";
  import ReasonInput from "../components/ReasonInput.svelte";
  import type { Component } from "svelte";
  import type { HostOwnedCustomEmojiItem } from "./HostOwnedCustomEmojiPicker.svelte";
  import type { AppEmbedAppliedSettingKey, AppEmbedNotificationPort } from "../lib/appEmbedController";
  import type { AppPostNotificationPort } from "../lib/appNotificationPort";
  import type { EmbedSettingsSetPayload } from "../lib/embedProtocol";
  import { validateEmbedComposerSetContextPayload } from "../lib/embedComposerContextValidation";
  import { buildEmbedComposerContextPatch, applyEmbedComposerContent } from "../lib/embedComposerContextApply";
  import { buildComposerContextUpdatedPayload } from "../lib/embedComposerContextNotification";
  import { prepareExternalChannelContext } from "../lib/channelContextRuntime";
  import {
    clearChannelContext,
    effectiveChannelContextState,
    setChannelContextRuntimeState,
    setChannelContextWithProvenance,
  } from "../stores/channelContextStore.svelte";
  import {
    clearReplyQuote,
    replyQuoteState,
    setReplyQuote,
    settleReplyQuoteReferencesWithoutHydration,
  } from "../stores/replyQuoteStore.svelte";
  import { clearUrlQueryContentStore, updateUrlQueryContentStore } from "../stores/sharedContentStore.svelte";
  import { settingsStore } from "../stores/settingsStore.svelte";
  import { uploadDestinationsRepository } from "../lib/storage/uploadDestinationsRepository";
  import type { CustomEmojiSelection } from "../lib/customEmojiUsage";
  import type { EHagakiCustomEmojiCatalogItem, EHagakiHostOwnedComposerOptions } from "../web-component/types";
  import type PostComponentType from "../components/PostComponent.svelte";

  interface Props {
    notificationPort: AppPostNotificationPort & AppEmbedNotificationPort;
    onInitialized: () => void;
    hostOwnedConfig: EHagakiHostOwnedComposerOptions & {
      customEmojis: EHagakiCustomEmojiCatalogItem[];
      signal: AbortSignal;
    };
  }

  let { notificationPort, onInitialized, hostOwnedConfig }: Props = $props();
  let postComponentRef: PostComponentType | null = $state(null);
  let customEmojiPickerOpen = $state(false);
  let HostOwnedCustomEmojiPicker: Component<any> | null = $state(null);
  let hostCustomEmojiItems = $state<HostOwnedCustomEmojiItem[]>([]);

  function replaceHostCustomEmojis(catalog: readonly EHagakiCustomEmojiCatalogItem[]): void {
    hostCustomEmojiItems = catalog.map((item, sortIndex) => ({
      identityKey: `${item.shortcode.toLowerCase()}\u0000${item.url}\u0000${item.setAddress ?? ""}\u0000${sortIndex}`,
      shortcode: item.shortcode,
      shortcodeLower: item.shortcode.toLowerCase(),
      src: item.url,
      setAddress: item.setAddress ?? null,
      sortIndex,
      sourceType: "kind10030",
      sourceAddress: null,
    }));
  }

  function handleCustomEmojiSelect(emoji: CustomEmojiSelection): void {
    postComponentRef?.insertCustomEmoji({
      identityKey: emoji.identityKey,
      shortcode: emoji.shortcode,
      src: emoji.src,
      setAddress: emoji.setAddress,
    });
  }

  async function setCustomEmojiPickerOpen(open: boolean): Promise<void> {
    if (open && !HostOwnedCustomEmojiPicker) {
      HostOwnedCustomEmojiPicker = (await import("./HostOwnedCustomEmojiPicker.svelte")).default;
    }
    customEmojiPickerOpen = open;
  }

  export async function setHostCustomEmojis(
    catalog: EHagakiCustomEmojiCatalogItem[],
  ): Promise<void> {
    replaceHostCustomEmojis(catalog);
  }

  export async function setEmbedContext(payload: unknown): Promise<void> {
    const validated = validateEmbedComposerSetContextPayload(payload);
    const { channelContext, replyQuoteQuery } = buildEmbedComposerContextPatch(
      validated,
      replyQuoteState.value,
    );

    applyEmbedComposerContent(validated.content, {
      clearUrlQueryContentStore,
      updateUrlQueryContentStore,
      resetPostContent: () => postComponentRef?.resetPostContent(),
      insertTextContent: (content) => postComponentRef?.insertTextContent(content),
    });

    if (channelContext !== undefined) {
      if (channelContext === null) {
        clearChannelContext();
      } else {
        const prepared = prepareExternalChannelContext(channelContext, "manual");
        setChannelContextWithProvenance(
          {
            eventId: prepared.coordinatorQuery.eventId,
            relayHints: prepared.coordinatorQuery.relayHints,
            name: null,
            about: null,
            picture: null,
          },
          prepared.provenance,
          Symbol(`host-owned-lite:${prepared.coordinatorQuery.eventId}`),
        );
        setChannelContextRuntimeState({ phase: "ready", quality: null, source: "seed" });
      }
    }

    if (replyQuoteQuery === undefined) return;
    if (replyQuoteQuery === null) {
      clearReplyQuote();
      return;
    }
    settleReplyQuoteReferencesWithoutHydration(setReplyQuote(replyQuoteQuery));
    const contextUpdated = buildComposerContextUpdatedPayload(
      replyQuoteState.value,
      effectiveChannelContextState.value,
    );
    notificationPort.notifyComposerContextUpdated({
      ...contextUpdated,
      channel: contextUpdated.channel ?? null,
    });
  }

  export async function setEmbedSettings(
    payload: EmbedSettingsSetPayload,
  ): Promise<ReadonlyArray<AppEmbedAppliedSettingKey>> {
    const applied = settingsStore.applyParentSettings(payload, "parentForced") as AppEmbedAppliedSettingKey[];
    if (payload.uploadEndpoint !== undefined) {
      await uploadDestinationsRepository.applyUploadEndpointPreference({
        endpoint: payload.uploadEndpoint,
        mode: "forced",
        pubkeyHex: null,
      });
      applied.push("uploadEndpoint");
    }
    return applied;
  }

  onMount(() => {
    replaceHostCustomEmojis(hostOwnedConfig.customEmojis);
    void waitLocale().then(onInitialized);
  });
</script>

<Tooltip.Provider>
  <div class="ehagaki-app host-owned-composer-lite">
    <main class="composer-main">
      <PostComponent
        bind:this={postComponentRef}
        hasStoredKey={false}
        hasPostingCapability={true}
        {notificationPort}
        {hostOwnedConfig}
        {hostCustomEmojiItems}
      />
      {#if customEmojiPickerOpen && HostOwnedCustomEmojiPicker}
        <HostOwnedCustomEmojiPicker items={hostCustomEmojiItems} onSelect={handleCustomEmojiSelect} />
      {/if}
    </main>
    <ReasonInput />
    <KeyboardButtonBar
      onUploadImage={() => postComponentRef?.openFileDialog()}
      {customEmojiPickerOpen}
      hasPostingCapability={true}
      mediaEnabled={!!hostOwnedConfig.uploadMedia}
      customEmojiEnabled={true}
      onCustomEmojiPickerOpenChange={(open) => void setCustomEmojiPickerOpen(open)}
    />
  </div>
</Tooltip.Provider>

<style>
  .ehagaki-app {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background: var(--bg);
  }

  .composer-main {
    min-width: 0;
    padding: 8px;
  }
</style>
