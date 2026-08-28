import { mount } from 'svelte'
import './app.css'
import 'photoswipe/style.css'
import { applyEmbedSettingsBootstrap } from './lib/bootstrap/embedSettingsBootstrap'
import { applyUploadDestinationBootstrap } from './lib/bootstrap/uploadDestinationBootstrap'
import { handleStaleAssetPreloadError } from './lib/staleAssetPreloadError'
import { configureAppRuntimeEnvironment } from './lib/appRuntimeEnvironment'
import { startServiceWorkerRegistration } from './lib/bootstrap/serviceWorkerBootstrap'
import { bootstrapIframeHostRelayConfig } from './lib/iframeHostRelayConfigBootstrap'

configureAppRuntimeEnvironment({
  storage: window.localStorage,
  window,
  document,
  domRoot: document,
  styleTarget: document.documentElement,
  layoutTarget: document.body,
  overlayTarget: document.body,
  themeTarget: document.documentElement,
  layoutMode: 'viewport',
  runtimeKind: window.top === window ? 'standalone' : 'iframe',
  appHomeHref: import.meta.env.BASE_URL,
  assetBase: new URL(import.meta.env.BASE_URL, window.location.href),
  serviceWorkerEnabled: true,
  externalInputEnabled: true,
  historyEnabled: true,
  localNsecAuthEnabled: true,
})
startServiceWorkerRegistration()

window.addEventListener('vite:preloadError', (event) => {
  handleStaleAssetPreloadError(event)
})

const embedSettingsBootstrapResult = applyEmbedSettingsBootstrap()
await applyUploadDestinationBootstrap(
  embedSettingsBootstrapResult.uploadEndpointPreference,
)

const { themeColorStore } = await import('./stores/themeColorStore.svelte')
themeColorStore.setExternalLayers({
  forcedAccentColor: embedSettingsBootstrapResult.parsedSettings.accentColor ?? null,
  forcedBaseColor: embedSettingsBootstrapResult.parsedSettings.baseColor ?? null,
  defaultAccentColor: embedSettingsBootstrapResult.parsedDefaultSettings.accentColor ?? null,
  defaultBaseColor: embedSettingsBootstrapResult.parsedDefaultSettings.baseColor ?? null,
})
themeColorStore.reload()

const hostRelayBootstrap = await bootstrapIframeHostRelayConfig()

const { default: App } = await import('./App.svelte')

const app = mount(App, {
  target: document.getElementById('app')!,
  props: hostRelayBootstrap.enabled
    ? ('relayConfig' in hostRelayBootstrap
      ? { hostRelayConfig: hostRelayBootstrap.relayConfig }
      : { hostRelayBootstrapError: hostRelayBootstrap.error })
    : undefined,
})

export default app
