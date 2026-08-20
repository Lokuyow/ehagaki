import { mount } from 'svelte'
import './app.css'
import 'photoswipe/style.css'
import { applyEmbedSettingsBootstrap } from './lib/bootstrap/embedSettingsBootstrap'
import { applyUploadDestinationBootstrap } from './lib/bootstrap/uploadDestinationBootstrap'
import { handleStaleAssetPreloadError } from './lib/staleAssetPreloadError'
import { configureAppRuntimeEnvironment } from './lib/appRuntimeEnvironment'
import { startServiceWorkerRegistration } from './lib/bootstrap/serviceWorkerBootstrap'

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

const { default: App } = await import('./App.svelte')

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
