<script lang="ts">
  import { onMount } from "svelte";
  import "../i18n";
  import { Tooltip } from "bits-ui";
  import { waitLocale } from "svelte-i18n";
  import PostComponent from "../components/PostComponent.svelte";
  import KeyboardButtonBar from "../components/KeyboardButtonBar.svelte";
  import ReasonInput from "../components/ReasonInput.svelte";
  import ChannelContextPreview from "../components/ChannelContextPreview.svelte";
  import ReplyQuotePreview from "../components/ReplyQuotePreview.svelte";
  import type { Component } from "svelte";
  import type { HostOwnedCustomEmojiItem } from "./HostOwnedCustomEmojiPicker.svelte";
  import type { AppEmbedAppliedSettingKey, AppEmbedNotificationPort } from "../lib/appEmbedController";
  import type { AppPostNotificationPort } from "../lib/appNotificationPort";
  import type { EmbedSettingsSetPayload } from "../lib/embedProtocol";
  import {
    selectVerifiedPreloadedEvents,
    validateEmbedComposerSetContextPayload,
  } from "../lib/embedComposerContextValidation";
  import { buildEmbedComposerContextPatch, applyEmbedComposerContent } from "../lib/embedComposerContextApply";
  import { buildComposerContextUpdatedPayload } from "../lib/embedComposerContextNotification";
  import { prepareExternalChannelContext } from "../lib/channelContextRuntime";
  import { useComposerLayoutMetrics } from "../lib/hooks/useComposerLayoutMetrics.svelte";
  import { POST_EDITOR_COMPACT_MIN_HEIGHT, POST_EDITOR_MIN_HEIGHT } from "../lib/postLayoutUtils";
  import {
    clearChannelContext,
    channelContextProvenanceState,
    effectiveChannelContextState,
    setChannelContextRuntimeState,
    setChannelContextWithProvenance,
  } from "../stores/channelContextStore.svelte";
  import {
    clearReplyQuote,
    clearReplyReference,
    removeQuoteReference,
    replyQuoteState,
    setReplyQuote,
    settleReplyQuoteReferencesWithoutHydration,
    updateReferencedEvent,
  } from "../stores/replyQuoteStore.svelte";
  import { setupViewportListener } from "../stores/uiStore.svelte";
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
  let composerScrollRegionEl: HTMLDivElement | null = $state(null);
  let composerScrollContentEl: HTMLDivElement | null = $state(null);
  let customEmojiPickerRegionEl: HTMLDivElement | null = $state(null);

  const composerLayoutMetrics = useComposerLayoutMetrics({
    setupViewportListener: () => setupViewportListener({ hasHeader: false, hasFooter: false }),
    getComposerScrollRegionEl: () => composerScrollRegionEl,
    getComposerScrollContentEl: () => composerScrollContentEl,
    getCustomEmojiPickerRegionEl: () => customEmojiPickerRegionEl,
    getCustomEmojiPickerOpen: () => customEmojiPickerOpen,
    getReplyQuoteState: () => replyQuoteState.value,
    minHeight: POST_EDITOR_MIN_HEIGHT,
  });
  let postEditorMinHeight = $derived(
    customEmojiPickerOpen ? POST_EDITOR_COMPACT_MIN_HEIGHT : POST_EDITOR_MIN_HEIGHT,
  );
  let postAvailableComposerHeight = $derived(
    customEmojiPickerOpen
      ? Math.max(postEditorMinHeight, composerLayoutMetrics.composerAvailableHeight - composerLayoutMetrics.customEmojiPickerHeight)
      : composerLayoutMetrics.composerAvailableHeight,
  );

  function notifyContextUpdated(): void {
    const contextUpdated = buildComposerContextUpdatedPayload(
      replyQuoteState.value,
      effectiveChannelContextState.value,
      channelContextProvenanceState.value,
    );
    notificationPort.notifyComposerContextUpdated({
      ...contextUpdated,
      channel: contextUpdated.channel ?? null,
    });
  }

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

    if (replyQuoteQuery !== undefined) {
      if (replyQuoteQuery === null) {
        clearReplyQuote();
      } else {
        const targets = setReplyQuote(replyQuoteQuery);
        const preloaded = selectVerifiedPreloadedEvents(validated.preloadedEvents, targets);
        for (const target of targets) {
          const event = preloaded[target.eventId];
          if (event) updateReferencedEvent(target, event);
        }
        // No relay is introduced in Lite. References without a verified preload
        // remain stable, collapsed context entries rather than loading forever.
        settleReplyQuoteReferencesWithoutHydration(targets);
      }
    }
    // A channel-only patch is a public context change too.
    notifyContextUpdated();
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
  <main class="ehagaki-app-root host-owned-composer-lite">
    <div class="main-content">
      <div class="composer-scroll-region" bind:this={composerScrollRegionEl}>
        <div class="composer-scroll-content" bind:this={composerScrollContentEl}>
          {#if effectiveChannelContextState.value}
            <div class="composer-block composer-reference-block">
              <ChannelContextPreview
                channel={effectiveChannelContextState.value}
                runtime={{ phase: "ready", quality: null, source: "seed" }}
                onClear={() => { clearChannelContext(); notifyContextUpdated(); }}
              />
            </div>
          {/if}
          {#if replyQuoteState.value.reply}
            <div class="composer-block composer-reference-block">
              <ReplyQuotePreview
                reference={replyQuoteState.value.reply}
                mode="reply"
                onClear={() => { clearReplyReference(); notifyContextUpdated(); }}
              />
            </div>
          {/if}
          <div class="composer-block composer-post-block" data-composer-block="post">
            <div class="composer-post-layout">
              <PostComponent
                bind:this={postComponentRef}
                hasStoredKey={false}
                hasPostingCapability={true}
                availableComposerHeight={postAvailableComposerHeight}
                minEditorHeight={postEditorMinHeight}
                {notificationPort}
                {hostOwnedConfig}
                {hostCustomEmojiItems}
              />
              {#if customEmojiPickerOpen && HostOwnedCustomEmojiPicker}
                <div class="custom-emoji-picker-region" bind:this={customEmojiPickerRegionEl}>
                  <HostOwnedCustomEmojiPicker
                    items={hostCustomEmojiItems}
                    onSelect={handleCustomEmojiSelect}
                  />
                </div>
              {/if}
            </div>
          </div>
          {#each replyQuoteState.value.quotes as quote (quote.eventId)}
            <div class="composer-block composer-reference-block">
              <ReplyQuotePreview
                reference={quote}
                mode="quote"
                onClear={() => { removeQuoteReference(quote.eventId); notifyContextUpdated(); }}
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
    <ReasonInput />
    <KeyboardButtonBar
      onUploadImage={() => postComponentRef?.openFileDialog()}
      {customEmojiPickerOpen}
      hasPostingCapability={true}
      mediaEnabled={!!hostOwnedConfig.uploadMedia}
      customEmojiEnabled={true}
      onCustomEmojiPickerOpenChange={(open) => void setCustomEmojiPickerOpen(open)}
    />
  </main>
</Tooltip.Provider>

<style>
  .ehagaki-app-root {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: var(--bg);
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: var(--main-content-top-spacing);
    width: 100%;
    height: calc(100% - var(--composer-bottom-reserved-height) - var(--main-content-keyboard-adjustment) - var(--reason-input-height));
    min-height: 0;
    overflow: hidden;
  }

  .composer-scroll-region { width: 100%; flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .composer-scroll-content { width: 100%; min-height: 100%; display: flex; flex: 1 0 auto; flex-direction: column; gap: 4px; }
  .composer-block { width: 100%; display: flex; flex-direction: column; align-items: center; min-width: 0; }
  .composer-post-block { flex: 1 1 auto; min-height: 0; }
  .composer-post-layout { width: 100%; max-width: 800px; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; align-items: stretch; }
  .custom-emoji-picker-region { width: 100%; flex: 0 0 auto; min-height: 0; position: relative; z-index: 99; }
</style>
