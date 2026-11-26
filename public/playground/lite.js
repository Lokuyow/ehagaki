// Host-owned Composer Lite playground.
// Full and Lite register the same <ehagaki-composer> tag, so this document
// imports only the Lite distribution.
import { THEME_PRESETS } from './shell.js';

await import('../web-component/host-owned/ehagaki-composer.js');

const mount = document.querySelector('#mount');
const log = document.querySelector('#log');
const status = document.querySelector('#status');
const mountConfigStatus = document.querySelector('#mount-config-status');
const lastSubmitOutput = document.querySelector('#last-submit-output');
let composer;
let mountedConfig;
let creationGeneration = 0;
let failNextSubmit = false;
let failNextUpload = false;
const defaultMountHeight = '460px';

const get = (id) => document.querySelector(`#${id}`);
const checked = (id) => get(id).checked;
const value = (id) => get(id).value;
const safeError = (error) => ({ name: error?.name ?? 'Error', message: error?.message ?? String(error) });
const stringify = (input, pretty = false) => {
  try { return JSON.stringify(input, null, pretty ? 2 : 0); } catch { return '[unserializable]'; }
};
const write = (label, input) => {
  log.textContent += `${label} ${stringify(input)}\n`;
  log.scrollTop = log.scrollHeight;
};
const currentMountConfig = () => ({
  upload: checked('upload-media') ? 'on' : 'off',
  contentWarning: checked('content-warning') ? 'on' : 'off',
  hashtagPin: checked('hashtag-pin') ? 'on' : 'off',
  keyboardButtonBar: checked('keyboard-bar') ? 'on' : 'off',
  editorSubmitButton: checked('editor-submit-button') ? 'on' : 'off',
  enterKeyBehavior: value('enter-behavior'),
  submitShortcutPreset: value('submit-shortcut-preset'),
  editorAutoGrow: (() => {
    const min = value('editor-min-lines').trim();
    const max = value('editor-max-lines').trim();
    return !min && !max ? 'legacy' : `${min || '?'}/${max || '?'}`;
  })(),
});
const readyText = (config) => `ready | upload: ${config.upload} | CW: ${config.contentWarning} | hashtag pin: ${config.hashtagPin} | bar: ${config.keyboardButtonBar} | editor submit: ${config.editorSubmitButton} | enter: ${config.enterKeyBehavior} | shortcuts: ${config.submitShortcutPreset} | editor: ${config.editorAutoGrow}`;
const setReadyStatus = (config) => {
  const text = readyText(config);
  status.textContent = text;
  mountConfigStatus.textContent = text;
};
const setMountHeight = (height) => {
  mount.style.height = height;
  document.body.style.setProperty('--composer-dock-height', height);
};
const applyPreferredHeight = (config) => {
  if (
    !checked('follow-preferred-height')
    || config.editorAutoGrow === 'legacy'
    || composer?.preferredHeight === null
  ) {
    return false;
  }
  setMountHeight(`${composer.preferredHeight}px`);
  status.textContent = `ホストが推奨の高さを適用: ${composer.preferredHeight}px`;
  return true;
};
const ensureComposer = () => {
  if (!composer || !composer.isConnected) throw new Error('Composerが作成されていません。');
  return composer;
};
const run = async (label, action) => {
  try {
    const result = await action();
    write(label, result === undefined ? 'ok' : result);
  } catch (error) {
    write(`${label} error:`, safeError(error));
  }
};
const delayWithAbort = (delay, signal, operation) => new Promise((resolve, reject) => {
  if (signal.aborted) {
    write(`${operation} signal:`, { aborted: true });
    reject(new Error(`${operation} aborted`));
    return;
  }
  if (delay === 0) { resolve(); return; }
  let settled = false;
  const timer = setTimeout(() => {
    settled = true;
    signal.removeEventListener('abort', onAbort);
    resolve();
  }, delay);
  const onAbort = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
    write(`${operation} signal:`, { aborted: signal.aborted });
    reject(new Error(`${operation} aborted`));
  };
  signal.addEventListener('abort', onAbort, { once: true });
});
const customEmojiAsset = (name) => new URL(`../${name}`, import.meta.url).href;
const customEmojiCatalog = [
  { shortcode: 'wave', url: customEmojiAsset('ehagaki_icon.webp') },
  { shortcode: 'sparkles', url: customEmojiAsset('ehagaki_icon_circle.webp') },
  { shortcode: 'coffee', url: customEmojiAsset('ehagaki_ogp.webp') },
];
const quoteValues = () => value('quotes-references').split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const contextChannel = () => {
  const reference = value('channel-reference').trim();
  if (!reference) throw new Error('先に有効なチャンネルの参照先を入力してください。');
  const relay = value('channel-relay').trim();
  return {
    reference,
    ...(relay ? { relays: [relay] } : {}),
    name: value('channel-name').trim() || null,
    about: value('channel-about').trim() || null,
  };
};
const submitShortcutsForPreset = (preset) => {
  if (preset === 'host-defined') {
    return {
      submitShortcuts: [
        { id: 'primary', modifiers: ['ctrlOrMeta', 'shift'] },
        { id: 'secondary', modifiers: ['alt'] },
        { id: 'shift-submit', modifiers: ['shift'] },
      ],
    };
  }
  if (preset === 'disabled') return { submitShortcuts: [] };
  return {};
};

async function createComposer() {
  const generation = ++creationGeneration;
  const config = currentMountConfig();
  composer?.remove();
  setMountHeight(defaultMountHeight);
  composer = document.createElement('ehagaki-composer');
  composer.id = 'composer';
  composer.assetBase = new URL('../web-component/host-owned/', import.meta.url).href;
  const hostOptions = {
    async submit(output, { signal, shortcutId }) {
      write('submit output:', output);
      write('submit shortcut:', shortcutId === undefined ? 'none' : shortcutId);
      lastSubmitOutput.textContent = stringify(output, true);
      await delayWithAbort(Number(value('submit-delay')), signal, 'submit');
      if (signal.aborted) {
        write('submit signal:', { aborted: true });
        throw new Error('example host submit aborted');
      }
      const shouldFail = failNextSubmit || value('submit-behavior') === 'fail-once';
      failNextSubmit = false;
      if (value('submit-behavior') === 'fail-once') get('submit-behavior').value = 'success';
      if (shouldFail) {
        write('simulated submit failure:', { signalAborted: signal.aborted });
        throw new Error('example host submit failure');
      }
      status.textContent = `投稿に成功: ${output.content}`;
      return { eventId: 'a'.repeat(64) };
    },
    contentWarningEnabled: config.contentWarning === 'on',
    hashtagPinEnabled: config.hashtagPin === 'on',
    keyboardButtonBarEnabled: config.keyboardButtonBar === 'on',
    editorSubmitButtonEnabled: config.editorSubmitButton === 'on',
    enterKeyBehavior: config.enterKeyBehavior,
    ...submitShortcutsForPreset(config.submitShortcutPreset),
    ...(() => {
      const min = value('editor-min-lines').trim();
      const max = value('editor-max-lines').trim();
      return {
        ...(min ? { editorMinLines: Number(min) } : {}),
        ...(max ? { editorMaxLines: Number(max) } : {}),
      };
    })(),
    ...(config.upload === 'on' ? {
      async uploadMedia(file, metadata, { signal }) {
        write('upload metadata:', metadata);
        await delayWithAbort(Number(value('upload-delay')), signal, 'upload');
        if (signal.aborted) {
          write('upload signal:', { aborted: true });
          throw new Error('example host upload aborted');
        }
        const shouldFail = failNextUpload || file.name.includes('fail');
        failNextUpload = false;
        if (shouldFail) {
          write('simulated upload failure:', { fileName: file.name, signalAborted: signal.aborted });
          throw new Error('example host upload failure');
        }
        return {
          url: `https://example.invalid/media/${encodeURIComponent(file.name)}`,
          imeta: { m: metadata.processedType, alt: file.name },
        };
      },
    } : {}),
  };
  composer.configureHostOwned(hostOptions);
  applyTheme(composer);
  for (const name of ['ehagaki-ready', 'ehagaki-preferred-height-change', 'ehagaki-post-success', 'ehagaki-post-error', 'ehagaki-composer-context-updated', 'ehagaki-initialization-error']) {
    composer.addEventListener(name, (event) => {
      write(name, event.detail);
      if (name === 'ehagaki-preferred-height-change') applyPreferredHeight(config);
      if (name === 'ehagaki-post-success') status.textContent = `投稿成功: ${event.detail.eventId ?? 'ホストが受理'}`;
      if (name === 'ehagaki-post-error') status.textContent = `投稿エラー: ${event.detail.code}`;
    });
  }
  mount.append(composer);
  status.textContent = '作成中';
  mountConfigStatus.textContent = `mounting | ${readyText(config).replace(/^ready \| /, '')}`;
  await composer.whenReady();
  if (generation !== creationGeneration) return;
  mountedConfig = config;
  setReadyStatus(config);
  applyPreferredHeight(config);
  write('create configuration:', config);
}

get('create-composer').onclick = () => void createComposer().catch((error) => write('create error:', safeError(error)));
get('follow-preferred-height').onchange = () => {
  if (!checked('follow-preferred-height')) {
    setMountHeight(defaultMountHeight);
    return;
  }
  applyPreferredHeight(mountedConfig ?? currentMountConfig());
};
get('set-custom-emojis').onclick = () => void run('setCustomEmojis:', async () => {
  await ensureComposer().setCustomEmojis(customEmojiCatalog);
  return customEmojiCatalog;
});
get('clear-custom-emojis').onclick = () => void run('clear custom emojis:', async () => {
  await ensureComposer().setCustomEmojis([]);
  return [];
});
get('remove-composer').onclick = () => {
  if (!composer) return;
  composer.remove();
  status.textContent = '取り外しました（同じ要素を付け直せます）';
  mountConfigStatus.textContent = '取り外しました（作成時の設定は同じ要素が保持しています）';
  write('remove composer:', { reconnectable: true });
};
get('reconnect-composer').onclick = () => void run('reconnect same instance:', async () => {
  if (!composer) throw new Error('付け直すComposerがありません。');
  if (!composer.isConnected) mount.append(composer);
  await composer.whenReady();
  setReadyStatus(mountedConfig ?? currentMountConfig());
  return { sameInstance: true };
});
const applyContext = (label, payload) => run(label, async () => {
  await ensureComposer().setContext(payload);
  return payload;
});
get('set-content').onclick = () => void applyContext('setContext content:', { content: value('context-content') });
get('clear-content').onclick = () => void applyContext('clear content:', { content: null });
get('set-reply').onclick = () => void applyContext('setContext reply:', { reply: value('reply-reference').trim() });
get('clear-reply').onclick = () => void applyContext('clear reply:', { reply: null });
get('set-single-quote').onclick = () => void applyContext('setContext single quote:', { quotes: quoteValues().slice(0, 1) });
get('set-multiple-quotes').onclick = () => void applyContext('setContext multiple quotes:', { quotes: quoteValues() });
get('clear-quotes').onclick = () => void applyContext('clear quotes:', { quotes: null });
get('apply-reply-quotes').onclick = () => void applyContext('setContext reply + quotes:', { reply: value('reply-reference').trim(), quotes: quoteValues() });
get('set-channel').onclick = () => void run('setContext channel:', async () => {
  const payload = { channel: contextChannel() };
  await ensureComposer().setContext(payload);
  return payload;
});
get('clear-channel').onclick = () => void applyContext('clear channel:', { channel: null });
get('clear-all-context').onclick = () => void applyContext('clear all context:', { content: null, reply: null, quotes: null, channel: null });
get('apply-settings').onclick = () => void run('setSettings applied:', async () => {
  const payload = {
    locale: value('locale'),
    themeMode: value('theme-mode'),
    mediaFreePlacement: checked('media-free-placement'),
    imageQualityLevel: value('image-quality'),
    videoQualityLevel: value('video-quality'),
    clientTagEnabled: checked('client-tag'),
    quoteNotificationEnabled: checked('quote-notification'),
    replyNotificationEnabled: checked('reply-notification'),
    showMascot: checked('show-mascot'),
    showFlavorText: checked('show-flavor-text'),
  };
  write('setSettings payload:', payload);
  const applied = await ensureComposer().setSettings(payload);
  return [...applied];
});
get('apply-legacy-settings').onclick = () => void run('setSettings legacy applied:', async () => {
  const payload = {
    imageCompressionLevel: value('legacy-image-quality'),
    videoCompressionLevel: value('legacy-video-quality'),
  };
  write('setSettings legacy payload:', payload);
  const applied = await ensureComposer().setSettings(payload);
  return [...applied];
});
get('fail-submit').onclick = () => { failNextSubmit = true; write('simulated failure:', { operation: 'submit', next: true }); };
get('fail-upload').onclick = () => { failNextUpload = true; write('simulated failure:', { operation: 'upload', next: true }); };
get('clear-log').onclick = () => { log.textContent = ''; };

// Theme: Lite has no internal SettingsDialog, so the host applies the public
// CSS Custom Properties on the element.
let activeThemePreset = null;
function applyTheme(element) {
  if (!element) return;
  const preset = activeThemePreset ? THEME_PRESETS[activeThemePreset] : null;
  if (preset) {
    element.style.setProperty('--ehagaki-accent-color', preset.accent);
    element.style.setProperty('--ehagaki-base-color', preset.base);
  } else {
    element.style.removeProperty('--ehagaki-accent-color');
    element.style.removeProperty('--ehagaki-base-color');
  }
}
const presetContainer = get('theme-presets');
const presetButtons = Object.entries(THEME_PRESETS).map(([name, preset]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'preset-button';
  button.setAttribute('aria-pressed', 'false');
  const swatches = document.createElement('span');
  swatches.className = 'preset-swatches';
  swatches.setAttribute('aria-hidden', 'true');
  for (const color of [preset.accent, preset.base]) {
    const swatch = document.createElement('span');
    swatch.className = 'preset-swatch';
    swatch.style.background = color;
    swatches.append(swatch);
  }
  const text = document.createElement('span');
  const label = document.createElement('span');
  label.className = 'preset-name';
  label.textContent = preset.label;
  const values = document.createElement('span');
  values.className = 'preset-values';
  values.textContent = `${preset.accent} / ${preset.base}`;
  text.append(label, document.createElement('br'), values);
  button.append(swatches, text);
  button.onclick = () => selectTheme(name);
  presetContainer.append(button);
  return [name, button];
});
function selectTheme(name) {
  activeThemePreset = name;
  for (const [presetName, button] of presetButtons) {
    button.setAttribute('aria-pressed', String(presetName === name));
  }
  applyTheme(composer);
  write('theme preset:', name ? { name, ...THEME_PRESETS[name] } : 'default');
}
get('reset-theme').onclick = () => selectTheme(null);

// Layout: dock the composer to the bottom of the viewport, or show it inline.
const dockToggle = get('dock-composer');
const applyDockMode = () => {
  document.body.classList.toggle('pg-dock', dockToggle.checked);
};
dockToggle.onchange = applyDockMode;
// A 460px dock covers most of a phone screen, so start inline on narrow viewports.
if (window.matchMedia('(max-width: 600px)').matches) dockToggle.checked = false;
applyDockMode();

get('context-content').value = 'Host-owned Lite playground content';
void createComposer().catch((error) => write('create error:', safeError(error)));
