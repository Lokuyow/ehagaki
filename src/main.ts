import { mount } from 'svelte'
import './app.css'
import { applyEmbedSettingsBootstrap } from './lib/bootstrap/embedSettingsBootstrap'

applyEmbedSettingsBootstrap()

const { default: App } = await import('./App.svelte')

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
