# Development and verification

Read for setup, implementation/configuration verification, builds, or browser-test execution. `package.json`, installed tools, and current test configs are the command sources of truth. Completion and authorization rules are in [AGENTS.md](../../AGENTS.md).

## Setup and commands

Use a pinned Node version if provided; otherwise inspect the runtime. Current GitHub workflows use Node 22. Install with `npm ci`; `postinstall` applies and verifies the rx-nostr patch documented in [RX_NOSTR_PATCH.md](../../docs/RX_NOSTR_PATCH.md). No secrets or external accounts are required to boot the composer.

| Purpose | Command |
| --- | --- |
| Develop / preview | `npm run dev` / `npm run preview` |
| Web Component sample | `npm run dev:web-component` |
| Focused Vitest | `npm run test -- <file-or-filter>` |
| Full Vitest / unit directory | `npm test` / `npm run test:unit` |
| Svelte / TypeScript | `npm run check` |
| Build | `npm run build` |
| Combined Vitest, check, build, and diff check | `npm run validate` |
| Selected default-config Playwright | `npx playwright test <file-or-filter> --reporter=dot` |
| Two-stage Playwright: dev-server then ordinary projects | `npm run test:e2e:agent` |
| Local relay HTTPS Playwright | `npm run test:e2e:local-relay -- --reporter=dot` |
| Production Service Worker Playwright | `npm run test:e2e:sw -- --reporter=dot` |
| Explicitly authorized deployment, after build | `npm run deploy` |

`npm test`, `test:unit`, and focused `npm run test -- ...` include the thread-graph complexity check. `validate` runs the full Vitest suite and build; it is an available combined command, not a requirement for every edit, and does not include Playwright.

`npm run dev` uses `vite --host` (default port 5173). Without `VERCEL`, the app URL is `http://127.0.0.1:5173/ehagaki/`; `/` is not the app. Build includes `prebuild` (`npx rimraf dist`). In non-interactive environments use `CI=true` to avoid npx confirmation prompts; note the browser-selection effect below if reusing that environment for Playwright.

## Select verification by impact

Start with the narrowest checks that prove the changed behavior. Do not select a full suite solely because a file lives in a shared directory.

| Change or remaining uncertainty | Required verification |
| --- | --- |
| Local behavior with bounded consumers | Relevant unit/component/integration tests; cover a bug's evidenced cause at the lowest sufficient level |
| Svelte or TypeScript | `npm run check` in addition to relevant behavior checks |
| Common logic affecting multiple features; persistence; contracts spanning runtimes; dependency/test-infrastructure changes; impact that cannot be bounded confidently | Full `npm test`, after focused checks |
| Bundling, generated output, entrypoints, delivery/samples, asset/base paths, PWA/SW/workers, FFmpeg/Mediabunny/WebCodecs/WASM | `npm run build` and checks for the affected behavior |
| Rendering, browser integration, or gestures lower-level tests cannot prove | Relevant Playwright coverage; inspect actual rendering/geometry for visual changes |

For broad browser changes whose affected consumers cannot be covered confidently with selected specs, run the two-stage E2E suite. SW changes use mirrored unit coverage and the separate production SW suite for affected install/update/offline/cache behavior. Scope an E2E command with its actual config/project: neither two-stage E2E nor `validate` includes the SW suite.

Documentation-only validation is defined in AGENTS.md. For Skill edits, also run the available `skill-creator` validator and check representative triggering/non-triggering requests. A static routing walkthrough does not establish actual automatic invocation.

When redesigning instructions, use OpenAI's [AGENTS.md guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Skills guide](https://learn.chatgpt.com/docs/build-skills), and [instruction review guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) for concise routing and conditional detail. For invocation evaluation, see the [Skill eval examples](https://developers.openai.com/blog/eval-skills). These references do not require model-specific repository policies.

## Test quality and browser evidence

- Test public behavior and meaningful regressions. Reuse `src/test/setup.ts`, `src/test/helpers.ts`, `src/test/mocks/`, store-module mock helpers, and existing Playwright harnesses. Keep tests deterministic and independent of real relays, accounts, secrets, and local user data.
- Respect `vi.mock()` hoisting with safe factories or `vi.hoisted`. Do not mask failures with arbitrary delays, blanket retries, weakened assertions, duplicate state, broad invalidation, or catch-all fallbacks. Use observable readiness, events, and resource/geometry state.
- Playwright needs browser binaries separately from `npm ci` (`npx playwright install chromium`, or the required other engines). `CI=true` or `EHAGAKI_E2E_AGENT=1` selects Chromium-only mode; `EHAGAKI_E2E_ALL_BROWSERS=1` overrides it to use configured browser projects. Inspect `scripts/playwrightChromiumOnlyMode.mjs` and the selected config instead of inferring coverage from a project/device name.
- Ordinary E2E uses `scripts/playwrightWorktreePort.ts`; `EHAGAKI_E2E_PORT` can specify a port, otherwise the runner probes for a bindable candidate in its automatic range. Preserve strict-port isolation and do not reuse unrelated worktree servers.
- Report project/engine, viewport or host size, operation, result, and real-device status. Emulation does not prove OS keyboards, browser chrome, PWA standalone UI, or WebViews. Use the [browser debug Skill](../skills/ehagaki-browser-debug/SKILL.md) for investigating those defects; merely running a browser test does not require that Skill.
