# eHagaki Agent Development Guide

This is the canonical repository instruction file for coding agents working on eHagaki.

## Project overview

eHagaki is a post-focused Nostr client with on-device image and video compression. It includes a Tiptap-based composer, multiple authentication methods and accounts, drafts and post history, replies and quotes, public-channel posting, PWA share-target support, iframe embedding, and Japanese and English localization.

## Tech stack

- Svelte 5, TypeScript, Vite
- Tiptap v3 and ProseMirror
- bits-ui
- rx-nostr v3, nostr-tools, and related Nostr libraries
- Dexie and IndexedDB
- Vitest, Testing Library, and Playwright
- svelte-i18n
- vite-plugin-pwa
- FFmpeg.wasm and Mediabunny

Use `npm`. Do not replace it with `pnpm` or `yarn`.

## Before editing

- Read the target files, their callers, related stores or services, and relevant tests.
- Before designing or editing, read the repository skill under `.agents/skills/` whose declared scope matches the task. Do not read every skill unconditionally.
- Use multiple matching skills together when the task crosses their boundaries.
- Treat skill references and maps as navigation aids; if they differ from the current checkout, prefer the checkout.
- Follow the current code's naming, design, and responsibility boundaries.
- Preserve existing user-visible behavior unless the requested change requires otherwise.
- Keep changes within the requested scope, and do not mix unrelated refactoring into feature work or bug fixes.
- Do not modify implementation code and repository instruction files in the same task unless explicitly requested.
- Do not invent product behavior, protocol behavior, commands, or compatibility requirements.
- If an ambiguity materially affects behavior and cannot be resolved from the repository or applicable specifications, mark it as `needs confirmation` rather than guessing.
- Do not commit, push, open a pull request, release, or deploy unless explicitly requested.
- When implementation depends on current third-party library APIs, use Context7 when available after checking `package.json`, local types, and existing project usage. Prefer the repository code and applicable protocol specifications for project behavior. Do not use Context7 as a substitute for NIPs or eHagaki-specific design decisions.

Prefer existing project abstractions and installed-library APIs over new bespoke implementations. Check `package.json` and the relevant local documentation before adding a dependency or duplicating functionality.

### Repository skill routing

- `.agents/skills/ehagaki-nostr/SKILL.md`: NIP, event/tag, relay, signing, and Nostr protocol or data-flow work.
- `.agents/skills/ehagaki-browser-debug/SKILL.md`: browser-specific behavior, IME, viewport, focus, and real-browser reproduction or measurement.
- `.agents/skills/ehagaki-embed-runtime/SKILL.md`: standalone, iframe, and Web Component runtime boundaries, Parent Client, Custom Element, and delegation contracts.
- `.agents/skills/ehagaki-editor/SKILL.md`: Tiptap/ProseMirror documents, extensions/plugins, transactions, and editor state or lifecycle.

These skills contain the detailed investigation procedures and implementation maps for their domains. Read only the matching skill(s), and use their references as indexes rather than copying their domain-specific runbooks into this file.

## Abstraction and tooling threshold

Do not turn a single implementation case, review finding, or artificial edge case into a new repository-wide abstraction or mechanism.

This applies especially to:

- New helpers, adapters, or shared interfaces
- Shared components introduced primarily to remove one instance of duplication
- New state machines or coordination layers
- Dedicated race-prevention mechanisms
- Generic extension points created for hypothetical future use
- New repository-wide design rules inferred from one feature

As a default, wait until at least three independent practical cases support the same abstraction before treating it as an established project pattern.

`N` means the number of independent examples found in different usage sites or materially different real-world situations. Do not count the following as separate examples:

- Re-reviewing or revising the same problem
- Narrower edge cases of the same feature
- Similar conditions split artificially into multiple tests
- Multiple symptoms or tests caused by the same underlying issue

For `N=1` or `N=2`, it is acceptable to describe the suspected pattern, record a hypothesis, or leave a small local seam when it directly helps the current task. Clearly label such conclusions as provisional. Do not introduce a generalized tool, state-management layer, or extension point solely on that basis.

This threshold delays premature commitment; it does not prohibit early reasoning or documentation.

The threshold does not apply when one case already demonstrates:

- A security vulnerability
- Data loss, corruption, or inconsistency
- A clear protocol or product-specification violation
- A regression or defect reproducible through normal user behavior
- A serious issue that can be fixed locally without adding disproportionate complexity

Before introducing an abstraction, be able to identify:

- The shared invariant across the independent cases
- The behavior that genuinely varies between them
- The concrete cost of keeping the implementations local
- Why the proposed mechanism is simpler to maintain than the duplication or risk it replaces

When the generalized mechanism would create more state, asynchronous coordination, lifecycle coupling, or maintenance burden than the confirmed problem warrants, prefer the smallest local implementation and continue observing.

When present, use:

- `internalDocs/` for implementation decisions and prior resolution notes.
- `references/` for external specifications and library documentation.

If either directory is absent, continue with the available repository sources; do not create it solely to satisfy this guidance.

## Development commands

The repository scripts in `package.json` are the source of truth.

```pwsh
npm run dev
npm run preview
npm run build
npm run check
npm run complexity:thread-graph
npm test
npm run test:unit
npm run test:ui
npm run test:e2e
npm run deploy
```

Run one Vitest file:

```pwsh
npm run test -- <file>
```

Run selected Playwright tests:

```pwsh
npx playwright test <file-or-filter>
```

`prebuild` is an npm lifecycle hook and runs automatically before `npm run build`.

Use a repository-pinned Node version when one is defined. Otherwise, inspect the current runtime instead of assuming a Node version.

## Verification

Run the narrowest relevant verification first, then broaden it according to the impact area.

- Run affected unit or integration tests while implementing.
- For implementation changes, run `npm test` by default before finishing. It also runs the thread-graph complexity check.
- Run `npm run check` for Svelte or TypeScript changes.
- Run `npm run build` for changes affecting Vite, PWA behavior, service workers, workers, generated output, asset paths, bundling, FFmpeg, Mediabunny, WebCodecs, or WASM assets.
- Use Playwright for browser integration and user interactions that unit or component tests cannot prove. For browser-specific investigation, use `.agents/skills/ehagaki-browser-debug/`; prefer relevant existing tests and keep ad hoc artifacts temporary. Device emulation is not evidence of real OS keyboard, browser chrome, PWA standalone UI, or WebView behavior.
- Run `npm run deploy` only when deployment is explicitly requested, and run `npm run build` first.
- Documentation-only changes do not require application test suites unless they alter executable configuration or reveal an implementation issue.

Do not claim that a check passed unless it was actually run. Report relevant checks that were not run and why.

## Runtime targets

Supported browser families:

- Windows: Chrome, Edge, and Firefox
- Android: Chrome and Firefox
- iOS: Safari

Chrome and Firefox on iOS use WebKit. Treat iOS compatibility as Safari-family behavior. Check new web-platform features against these targets before adopting them.

### Responsive layout baseline

- For the standalone application, treat 360 CSS px as the minimum supported mobile viewport width.
- At 360 CSS px, the standalone UI must remain usable without unintended horizontal scrolling, clipped controls, overlapping content, or inaccessible essential actions.
- Standalone viewports narrower than 360 CSS px are not a required compatibility target unless explicitly requested.
- iframe and Web Component embeds are not subject to the 360 CSS px minimum.
- Do not treat an embedded layout as unsupported solely because its host width is below 360 CSS px.
- Embedded layouts must continue to reflow at narrower host widths without unintended horizontal scrolling, clipped essential content, overlapping controls, or inaccessible essential actions.
- Do not introduce fixed widths or minimum widths that unnecessarily prevent iframe or Web Component layouts from shrinking below 360 CSS px.
- When space is constrained in an embed, prefer reflow, wrapping, compact presentation, or intentional reduction of nonessential presentation over clipping essential content or controls.
- For changes that can affect embedded layout, verify representative host widths below 360 CSS px that are relevant to the affected UI.
- Do not assume a fixed viewport height, device pixel ratio, or full-screen mobile viewport.

## Architecture and responsibility boundaries

Keep `src/App.svelte` focused on orchestration and top-level wiring. Do not add reusable business logic, persistence logic, protocol construction, or complex state transitions directly to it.

Use the current structure:

- `src/components/`: rendering, accessibility, and UI event wiring
- `src/lib/bootstrap/`: application, session, and external-input initialization
- `src/lib/editor/`: editor extensions, configuration, lifecycle, and editor-specific behavior
- `src/lib/hooks/`: reusable Svelte rune-based UI coordination
- `src/lib/storage/`: IndexedDB schema and repositories
- `src/lib/upload/`: upload protocol and upload-domain logic
- `src/lib/tags/`: Nostr tag handling
- `src/lib/types/` and `src/lib/types.ts`: shared types
- `src/lib/utils/`: reusable transformations and low-level utilities
- `src/lib/videoCompression/`: video-compression implementations
- `src/stores/`: reactive application state
- `src/test/`: shared test setup, mocks, unit tests, integration tests, and E2E tests

Controller and service modules currently live under `src/lib/` as well as its focused subdirectories. Reuse an existing controller, service, bootstrap module, hook, repository, or utility before introducing another abstraction.

App-level authentication, session restoration, dialog coordination, initialization, and external-input handling belong in the existing app, controller, or bootstrap layers rather than component rendering code or stores.

## Embedded runtime boundaries

- For runtime-specific work, use `.agents/skills/ehagaki-embed-runtime/` and preserve the existing runtime boundary, ownership, and trust-validation model.
- Keep embed-specific behavior within its runtime boundary rather than leaking it into unrelated standalone or global behavior.
- Do not weaken origin, authentication, or secret validation at runtime boundaries.

## Svelte components and UI

- Use Svelte 5 syntax and runes.
- Components that accept props should use the `interface Props` and `$props()` pattern.
- Use `Snippet` rather than legacy slots for new or modified child-content APIs.
- Keep components focused on rendering, accessibility, and event wiring. Extract reusable branching, transformation, fetching, and coordination logic.
- Prefer current shared components such as `Button.svelte`, `DialogWrapper.svelte`, loading placeholders, preview shells, and profile display components when they fit.
- Use `bits-ui` primitives for Dialog, AlertDialog, Popover, and related UI.
- Use `DialogWrapper.svelte` for standard application dialogs. Keep specialized behavior, such as confirmation dialogs or nested detail dialogs, on the appropriate existing bits-ui pattern.
- Keep application-level dialog visibility in `dialogStore.svelte.ts`; local interaction state may remain with the component that owns it.
- Preserve accessible titles, descriptions, labels, expanded state, control relationships, keyboard behavior, and focus management.
- Do not suppress focus management merely to hide an unresolved focus or viewport defect.

Use `svelte-i18n` for localized user-visible text. In Svelte templates, use:

```svelte
{$_('translation_key')}
```

Do not add untranslated user-visible strings where the surrounding UI is localized.

## Icons and deployment paths

- Place reusable SVG icons under `public/icons/`.
- Reuse the current CSS `mask-image` icon pattern.
- Use `import.meta.env.BASE_URL` when constructing runtime URLs that depend on the deployment base path.
- Do not assume the application is hosted at `/`; preserve the current GitHub Pages and Vercel behavior.

## Stores and side effects

- Store files under `src/stores/` use the `.svelte.ts` extension.
- Use Svelte 5 runes for new application state. Do not introduce `svelte/store` for new stores unless an external API requires it and the exception is justified.
- Import stores directly from their individual modules.
- Do not create or restore barrel-style compatibility layers such as `appStore.svelte.ts`.
- Avoid `$effect` inside stores. Expose explicit state-transition methods and start reactive coordination from the owning component or hook.
- Do not add new lifecycle side effects such as I/O startup, authentication restoration, subscription startup, or service initialization to stores.
- Delegate persistence and protocol work to the existing repository or service layer.
- Start and coordinate side effects from the appropriate component, controller, bootstrap module, service, or hook.
- A store method calling a repository or service is not by itself sufficient justification for putting new lifecycle orchestration in the store.
- Preserve existing store behavior when it is outside the requested scope; do not broaden current exceptions into a new default design.
- Keep service instance references non-reactive and expose explicit accessors when following an existing pattern.

Follow neighboring store naming and state-shape conventions instead of imposing a new repository-wide naming scheme.

## Tiptap and ProseMirror

For editor-related work, use `.agents/skills/ehagaki-editor/`. Use Tiptap v3 and ProseMirror APIs, and preserve the editor's existing plain-text Nostr posting semantics. The composer may render links, media, custom emoji, placeholders, and decorations, but do not introduce unrelated rich-text or Markdown semantics without an explicit requirement.

- Do not mutate a ProseMirror document or apply structural transactions while traversing it with `descendants()`, `nodesBetween()`, or a similar iterator.
- Collect intended structural changes before applying position-changing operations.
- Avoid circular paths such as editor subscription -> store setter -> dispatch -> editor subscription.
- Prevent append-transaction loops and respect no-op updates.
- Preserve undo and redo grouping when adding normalization transactions.
- Clean up DOM listeners, timers, subscriptions, and editor-owned references on destruction.

Keep posting UI, gallery UI, upload-result messaging, and upload workflow state out of `src/lib/editor/`. Reuse existing editor utilities, tag utilities, and extensions before adding duplicate parsing or document logic.

## Nostr behavior and secrets

For Nostr protocol or data-flow work, use `.agents/skills/ehagaki-nostr/` for the detailed workflow and implementation map.

- Prefer existing builders, resolvers, services, and utilities over new protocol paths or direct library calls from UI code.
- Verify the applicable NIPs and event/tag semantics; do not infer protocol behavior from UI appearance.
- Add or update protocol-focused tests for event or tag construction changes.
- Never expose nsec values, private keys, authentication payloads, tokens, or other secrets in logs, fixtures, screenshots, or reports.

## Upload and media behavior

- Keep upload protocol and transport logic separate from component state.
- Keep post-specific upload state transitions in post-related controllers or utilities.
- Keep editor-specific paste and drag-and-drop behavior in editor modules.
- Reuse existing upload helpers, result utilities, media stores, adapters, and compression services.
- Preserve abort, retry, progress, placeholder, gallery, and free-placement behavior unless the request changes it.
- Do not silently change upload destinations, compression selection, MIME support, or persisted metadata.
- Do not add speculative fallback paths. A fallback must be justified by an explicit requirement, supported-platform compatibility, or verified runtime behavior.

## Persistence, PWA, and shared versions

Do not introduce new duplicate database, schema, cache, worker, or protocol version constants. When touching existing duplicated values, determine whether they represent one shared contract before changing them, and keep all consumers compatible.

When more than one runtime environment depends on a version:

- Prefer one side-effect-free shared constants module when technically possible.
- Import it from application, worker, service-worker, and test code when technically possible.
- Do not import a runtime-heavy module only to obtain constants.

When changing IndexedDB schema or persisted data:

- Find every database `open()` caller and keep versions compatible.
- Check service-worker and iframe-related access.
- Understand stale-tab and stale-service-worker behavior.
- Preserve or deliberately update migrations.
- Test upgrades from existing persisted state when required.
- Do not delete or reset user data as a migration shortcut unless explicitly approved.

When changing PWA or service-worker caches:

- Coordinate cache names, cleanup behavior, and shared version values.
- Consider already-installed workers and clients.
- Verify update prompting, offline behavior, base paths, and share-target behavior as applicable.

## Vitest and integration tests

Test user-visible behavior and public module behavior rather than private implementation details.

- Unit tests should cover one module or one focused behavior and mock external dependencies as needed.
- Integration tests should cover cooperation between modules while mocking external APIs, DOM boundaries, network access, and persistent storage.
- Reuse `src/test/setup.ts`, `src/test/helpers.ts`, and `src/test/mocks/` before defining new common infrastructure.
- Reuse the current store-module mock helpers for local or partial store overrides instead of duplicating the global module mock.
- Do not duplicate a global mock locally without a concrete need.
- Use dependency injection when the production interface already supports it.
- Be careful with `vi.mock()` hoisting. Use a hoisting-safe async factory, dynamic import, or `vi.hoisted` when a mock depends on shared variables or imported helpers.
- Keep tests deterministic. Do not rely on real relays, external networks, real accounts, secrets, local browser data, or timing races.
- For ProseMirror tests, preserve the production rule of collecting position-changing operations before applying them.

## Playwright and browser verification

Use Playwright for real-browser integration and user interactions that unit or component tests cannot prove. For browser-specific regressions or cause investigation, use `.agents/skills/ehagaki-browser-debug/`.

- Reuse existing Playwright projects, fixtures, and harnesses when they fit.
- Prefer semantic locators such as `getByRole`, `getByLabel`, `getByText`, or `data-testid`.
- Add persistent E2E coverage only when lower-level tests are insufficient. Keep it deterministic and independent of external networks, real accounts, secrets, and local user data.
- Delete temporary investigation specs, harnesses, scripts, screenshots, and traces when complete; do not commit Playwright artifacts.
- Report the executed browser project, viewport, operation, result, and whether real-device verification was performed.
- Treat Playwright device emulation as distinct from real OS keyboard, browser chrome, PWA standalone UI, or WebView behavior.

Do not commit:

- `test-results/`
- `playwright-report/`
- `blob-report/`
- `playwright/.cache/`

## Bug fixing

Do not make speculative changes.

Before editing:

1. Reproduce or identify the failing behavior.
2. Trace the relevant control flow.
3. Inspect state changes, subscriptions, async boundaries, lifecycle events, and render timing.
4. Determine the root cause.
5. Identify the smallest fix that addresses that cause.

Do not introduce workaround-style changes, such as arbitrary timing, focus or layout suppression, duplicate state, catch-all fallbacks, or broad invalidation, unless their necessity is demonstrated by code, logs, reproduction, or tests.

After fixing:

- Remove temporary logs and instrumentation.
- Revert discarded hypotheses and unnecessary experiments.
- Keep only changes required by the final explanation.
- Add a regression test at the lowest sufficient level.
- Verify the actual user-visible behavior.

Do not weaken sanitization, URL validation, origin validation, or authentication checks without an explicit requirement and appropriate verification.

## Final report

For implementation work, report:

- Root cause or implementation rationale
- Files changed
- Why the solution works and behavior preserved
- Possible side effects or remaining risks
- Temporary or unnecessary changes removed
- Tests and checks run, with results
- Relevant checks not run, with the reason

Keep the report focused on information that helps review the change.
