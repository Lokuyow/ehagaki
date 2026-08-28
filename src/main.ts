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

function renderTerminalHostRelayBootstrapFailure(code: string): void {
  const target = document.getElementById('app')!
  target.replaceChildren()
  target.dataset.hostRelayBootstrap = 'failed'
  target.dataset.hostRelayBootstrapError = code
  const alert = document.createElement('div')
  alert.setAttribute('role', 'alert')
  alert.textContent = 'Host Relay Config bootstrap failed.'
  target.append(alert)
}

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

const app = hostRelayBootstrap.enabled && 'error' in hostRelayBootstrap
  ? (() => {
      // An opted-in iframe never starts the normal application graph after a
      // Host Relay bootstrap failure. This terminal document state prevents
      // later auth, account, or guest flows from reaching normal relay paths.
      renderTerminalHostRelayBootstrapFailure(hostRelayBootstrap.error.code)
      return null
    })()
  : await (async () => {
      const { default: App } = await import('./App.svelte')
      return mount(App, {
        target: document.getElementById('app')!,
        props: hostRelayBootstrap.enabled
          ? { hostRelayConfig: hostRelayBootstrap.relayConfig }
          : undefined,
      })
    })()

export default app
