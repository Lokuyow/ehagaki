# eHagaki Agent Development Guide

This is the canonical repository-wide guidance for eHagaki, a post-focused Nostr client with a Tiptap composer, on-device media compression, multiple accounts, drafts/history, PWA share targets, and iframe/Web Component embeds.

## Scope and decisions

- Follow the explicit task scope and preserve existing behavior outside it. Do not mix product implementation and repository instruction edits unless requested.
- Read the target code and enough surrounding callers, state, services, or tests to understand the change safely; choose that scope from the task, not a fixed reading checklist.
- Resolve routine choices from the task, current checkout, specifications, and existing conventions. Continue authorized investigation, reversible editing, and verification without redundant permission checks.
- Ask only when an unresolved choice materially affects user-visible behavior, public contracts, security/secrets/data, compatibility, scope, or irreversible/external actions. Continue independent authorized work while it is pending.
- Commit, push, PR creation, release, and deployment require explicit authorization. Authorization already given for the task does not need to be requested again.
- Skills supply domain guidance, not additional scope or inferred approval gates. Explicit task instructions take precedence. If a Skill explicitly requires a pause that affects the task, cite its exact instruction and explain why it applies.

## Skill routing and sources

Before designing or editing domain behavior, read only the matching Skill(s). Combine them only when the task crosses their boundaries; do not read all four by default.

| Domain | Skill | Boundary |
| --- | --- | --- |
| Browser-specific failures or real-browser integration investigation | [ehagaki-browser-debug](.agents/skills/ehagaki-browser-debug/SKILL.md) | Not ordinary UI/CSS/text edits |
| Tiptap/ProseMirror document, transaction, or editor lifecycle | [ehagaki-editor](.agents/skills/ehagaki-editor/SKILL.md) | Not surrounding posting UI |
| Runtime ownership and iframe/Web Component public contracts | [ehagaki-embed-runtime](.agents/skills/ehagaki-embed-runtime/SKILL.md) | Not ordinary standalone UI |
| Nostr protocol and event/relay/signing data flow | [ehagaki-nostr](.agents/skills/ehagaki-nostr/SKILL.md) | Not protocol-independent presentation |

Skill references/maps are optional indexes: read relevant sections when you need their detail or cannot locate the owner. Current checkout takes precedence over maps. When a requested change makes a referenced responsibility or contract inaccurate, update the affected documentation; unrelated map maintenance is not required.

Use `internalDocs/` for prior decisions and `references/` for external specifications when relevant and present; do not create these directories just to satisfy guidance. For third-party API decisions, check `package.json`, local types, and current usage first, then use Context7 when available. Library guidance does not replace NIPs or eHagaki contracts.

## Stack and ownership

Use npm, Svelte 5, TypeScript, Vite, Tiptap v3/ProseMirror, bits-ui, rx-nostr v3/nostr-tools, Dexie, svelte-i18n, and the installed media libraries. Prefer existing abstractions and installed APIs before adding dependencies or bespoke implementations.

- `src/App.svelte` owns top-level wiring; reusable business logic, persistence, protocol construction, and complex transitions belong in existing controllers/services/bootstrap modules.
- `src/components/` owns rendering, accessibility, and UI event wiring; `src/lib/hooks/` owns reusable rune-based UI coordination; `src/stores/` owns reactive state.
- `src/lib/bootstrap/` owns initialization; `src/lib/storage/` persistence; `src/lib/upload/` upload transport/protocol; `src/lib/videoCompression/` compression; `src/lib/editor/` editor internals; `src/lib/tags/` Nostr tags. Reuse current controllers/services under `src/lib/`, shared types, and utilities.
- App authentication, session restoration, dialog coordination, and external input belong in existing app/controller/bootstrap layers, not rendering code or stores.
- Upload transport stays separate from component state; post-specific transitions stay in post controllers. Preserve abort/retry/progress, placeholders, gallery/free placement, destinations, compression selection, MIME support, and persisted metadata unless requested otherwise.

Prefer a local solution to a new shared helper, state machine, adapter, or extension point. As a default, require three independent practical cases before establishing a generalized pattern; multiple symptoms/tests of one problem are one case. For one or two cases, keep any hypothesis provisional. A demonstrated security issue, data loss, specification violation, normal-use regression, or serious locally fixable defect does not need three examples. Any abstraction should reduce maintenance cost without disproportionate state or lifecycle coupling.

## Svelte and UI conventions

- Use runes, `interface Props` with `$props()`, and `Snippet` for new or modified child-content APIs.
- Reuse shared components and bits-ui primitives. Standard dialogs use `DialogWrapper.svelte`; confirmation/nested dialogs retain their appropriate bits-ui pattern. App-level visibility belongs in `dialogStore.svelte.ts`, local interaction state with its component.
- Preserve accessibility, keyboard behavior, and focus management. Do not suppress focus to conceal a viewport/focus defect.
- Localize user-visible text with svelte-i18n (`{$_('translation_key')}` in templates).
- Reusable icons belong in `public/icons/` and use the existing CSS mask pattern. Document runtime URLs use `import.meta.env.BASE_URL`; preserve GitHub Pages/Vercel base paths. Runtime-specific asset resolution belongs to the embed Skill.
- Stores use `.svelte.ts`, direct module imports, and runes. Do not restore barrel compatibility layers such as `appStore.svelte.ts`; use `svelte/store` for new state only for a justified external API requirement.
- Expose explicit store transitions. Start reactive coordination in the owning component/hook and I/O, auth restoration, subscriptions, and service initialization in the owning controller/bootstrap/service. Avoid `$effect` in stores; calling a service from a store does not justify moving lifecycle orchestration there.
- Follow neighboring state shapes, keep service references non-reactive where that is the existing pattern, and preserve out-of-scope store behavior without turning exceptions into new defaults.

## Security, compatibility, and persistence

Never expose nsec/private keys, authentication tokens/payloads, or signing-request bodies in logs, fixtures, traces, screenshots, or reports. Do not weaken sanitization, URL/origin/auth validation, or runtime trust boundaries without an explicit requirement and appropriate verification.

Supported families are Windows Chrome/Edge/Firefox, Android Chrome/Firefox, and iOS Safari (including iOS Chrome/Firefox's WebKit behavior). Check new web-platform features against these targets. Do not add speculative fallbacks or browser workarounds without a requirement, compatibility contract, or observed need.

Standalone supports a minimum width of 360 CSS px. iframe and Web Component embeds must also reflow below 360px: keep essential content and actions accessible without unintended horizontal scrolling, clipping, or overlap. Prefer wrapping/compact presentation over restrictive minimum widths; verify relevant sub-360px host widths when affected. Do not assume a fixed height, DPR, or fullscreen viewport.

For persisted data and shared runtime versions:

- Keep all database `open()` callers, including worker/iframe access, version-compatible. Preserve migrations and account for stale tabs/workers; verify upgrades when affected. Do not reset user data as a migration shortcut without explicit approval.
- Avoid duplicate schema/cache/worker/protocol version constants. Prefer a shared side-effect-free module when they represent one contract; do not import runtime-heavy code just for a constant.
- Cache/SW changes must coordinate names, cleanup, and existing installed clients; verify affected update prompting, offline, base-path, and share-target behavior.

## Commands and verification

`package.json` is the command source of truth. Use a pinned Node version if provided; otherwise inspect the runtime.

| Purpose | Command |
| --- | --- |
| Develop / preview | `npm run dev` / `npm run preview` |
| Focused Vitest | `npm run test -- <file>` |
| Full Vitest / unit directory | `npm test` / `npm run test:unit` |
| Svelte / TypeScript | `npm run check` |
| Build | `npm run build` (includes `prebuild`) |
| Selected Playwright | `npx playwright test <file-or-filter> --reporter=dot` |
| Full two-stage Playwright | `npm run test:e2e:agent` |
| Authorized deployment | `npm run deploy` after `npm run build` |

Start with the narrowest relevant verification. For implementation changes, run `npm test` by default (includes the thread-graph complexity check); Vitest selects the minimal agent reporter automatically. Run `npm run check` for Svelte/TypeScript changes and `npm run build` for bundling, generated output, asset/base paths, PWA/SW/workers, FFmpeg/Mediabunny/WebCodecs/WASM changes.

Use Playwright for browser integration or gestures that lower-level tests cannot prove. Device emulation is not proof of real OS keyboards, browser chrome, PWA standalone UI, or WebViews; browser investigation details belong to the browser Skill. Docs-only changes do not need application suites unless they alter executable configuration or reveal an implementation issue.

Test public behavior and meaningful regressions, not private implementation mirrors. Reuse `src/test/setup.ts`, `src/test/helpers.ts`, `src/test/mocks/`, store-module mock helpers, and existing Playwright harnesses. Keep tests deterministic and independent of real relays, accounts, secrets, and local user data. Respect `vi.mock()` hoisting; use a safe factory or `vi.hoisted` when needed.

Once relevant checks pass, repeat or broaden only for new changes, failures, or unresolved concerns. Bug fixes need an evidenced cause and regression coverage at the lowest sufficient level; do not mask symptoms with arbitrary delays, duplicate state, broad invalidation, or catch-all fallbacks.

Remove temporary investigation files and instrumentation. Do not commit `test-results/`, `playwright-report/`, `blob-report/`, or `playwright/.cache/`. Report the change rationale, relevant risks, and executed/unexecuted checks truthfully; browser evidence should identify project, viewport, operation, result, and real-device status.
