import { mount } from 'svelte'
import './app.css'
import 'photoswipe/style.css'
import { applyEmbedSettingsBootstrap } from './lib/bootstrap/embedSettingsBootstrap'
import { applyUploadDestinationBootstrap } from './lib/bootstrap/uploadDestinationBootstrap'

const embedSettingsBootstrapResult = applyEmbedSettingsBootstrap()
await applyUploadDestinationBootstrap(
  embedSettingsBootstrapResult.uploadEndpointPreference,
)

const { default: App } = await import('./App.svelte')

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
