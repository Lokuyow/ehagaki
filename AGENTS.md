# eHagaki Agent Development Guide

Canonical repository-wide guidance for eHagaki, a post-focused Nostr client with a Tiptap composer, media compression, accounts, drafts/history, PWA share targets, and iframe/Web Component embeds.

## Scope, authorization, and safety

- Follow the explicit task scope and preserve behavior outside it. Keep product implementation and instruction maintenance separate unless both are requested.
- Resolve routine choices from the task and current checkout. Continue authorized investigation, reversible editing, and verification without redundant permission checks. Ask only about unresolved choices that materially affect behavior, public contracts, security/data, compatibility, scope, or irreversible/external actions; continue independent work while waiting.
- Commit, push, PR creation, release, and deployment require explicit authorization. Existing authorization remains valid for the task.
- Skills provide domain guidance, not extra scope or inferred approval gates. Explicit task instructions take precedence. If a Skill explicitly requires a pause that affects the task, quote and link that instruction and explain its applicability.
- Never expose nsec/private keys, authentication tokens/payloads, or signing-request bodies in logs, fixtures, traces, screenshots, or reports. Do not weaken sanitization, URL/origin/auth validation, or runtime trust boundaries without an explicit requirement and appropriate verification.

## Read according to the task

Read the target code and enough surrounding callers, state, services, and tests to understand the change safely. Select guidance by the behavior being investigated or changed, not merely by a filename or technology keyword.

| When the task involves | Read |
| --- | --- |
| Svelte components, hooks, stores, UI, styles, or localization | [Svelte and UI conventions](.agents/guides/svelte.md) |
| Setup, implementation/configuration verification, builds, or browser-test execution | [Development and verification](.agents/guides/development.md) |
| Browser-specific failures or investigation of real-browser integration defects | [ehagaki-browser-debug](.agents/skills/ehagaki-browser-debug/SKILL.md) |
| Tiptap/ProseMirror document, transaction, or editor lifecycle | [ehagaki-editor](.agents/skills/ehagaki-editor/SKILL.md) |
| Runtime ownership or iframe/Web Component public contracts | [ehagaki-embed-runtime](.agents/skills/ehagaki-embed-runtime/SKILL.md) |
| Nostr protocol or event/relay/signing data flow | [ehagaki-nostr](.agents/skills/ehagaki-nostr/SKILL.md) |

Read the matching Skill before designing or editing its domain behavior; combine Skills only across relevant boundaries. Ordinary UI/CSS/text edits do not require a domain Skill by themselves. Honor an explicitly named Skill, including for an instruction audit. References/maps are optional indexes: read relevant sections when an owner or contract is unclear, not every reference by default.

Use code/types/tests to locate and verify current implementation, product docs for public contracts, and NIPs for protocol semantics. Maps do not override these sources. Use `internalDocs/` for prior decisions and `references/` for external specifications when relevant and present; these local resources may be absent from a clean checkout. For third-party APIs, inspect `package.json`, installed types, and current usage first, then consult Context7 when available. Library guidance does not replace NIPs or eHagaki contracts. Update documentation made inaccurate by the requested change without unrelated map maintenance.

## Stack and responsibility

Use npm, Svelte 5, TypeScript, Vite, Tiptap v3/ProseMirror, bits-ui, rx-nostr v3/nostr-tools, Dexie, svelte-i18n, and installed media libraries. Prefer current abstractions and installed APIs before adding dependencies.

- `src/App.svelte` owns top-level wiring. Business logic, persistence, protocol construction, and complex transitions belong in existing controllers/services/bootstrap modules.
- `src/components/` owns rendering, accessibility, and event wiring; `src/lib/hooks/` reusable UI coordination; `src/stores/` reactive state. Authentication, session restoration, dialog coordination, and external input belong in existing app/controller/bootstrap layers.
- Keep initialization in `src/lib/bootstrap/`, persistence in `src/lib/storage/`, upload transport/protocol in `src/lib/upload/`, compression in `src/lib/videoCompression/`, editor internals in `src/lib/editor/`, and Nostr tags in `src/lib/tags/`.
- Keep upload transport separate from component state and post-specific transitions in post controllers. Preserve abort/retry/progress, placeholders, gallery/free placement, destinations, compression selection, MIME support, and persisted metadata unless requested otherwise.

Prefer a local solution unless a shared responsibility and actual reuse justify an abstraction. Judge common helpers, state machines, adapters, and extension points by duplication removed and maintenance cost versus added state/lifecycle coupling; no fixed number of examples is required. Fix demonstrated defects without waiting for additional cases.

## Compatibility and persistence

- Support Windows Chrome/Edge/Firefox, Android Chrome/Firefox, and iOS Safari (including iOS Chrome/Firefox's WebKit behavior). Check new platform features against these targets; add browser workarounds only for a requirement, compatibility contract, or observed need.
- Standalone supports a minimum width of 360 CSS px. iframe/Web Component content must also reflow below 360px with essential actions accessible, without unintended horizontal scrolling, clipping, or overlap. Verify relevant host widths when affected; do not assume fixed height, DPR, or fullscreen.
- Keep all database `open()` callers, including worker/iframe access, version-compatible. Preserve migrations, account for stale tabs/workers, and verify affected upgrades. Do not reset user data as a migration shortcut without explicit approval.
- Share schema/cache/worker/protocol version constants when they represent one contract, using side-effect-free modules rather than runtime-heavy imports. Cache/SW changes must coordinate names, cleanup, installed clients, update prompting, offline, base-path, and share-target behavior.

## Completion

Choose checks by impact using the development guide. Documentation-only changes need frontmatter where applicable, links/anchors, routing and allowed-file-scope checks, and `git diff --check`; application suites are unnecessary unless executable configuration or implementation is affected.

Once required checks pass for the final relevant changes and no relevant concern remains, complete the task. Repeat or broaden verification only for further changes, failures, or unresolved concerns. Report the rationale, material risks, and executed/unexecuted checks truthfully. Remove temporary investigation files and instrumentation; never commit `test-results/`, `playwright-report/`, `blob-report/`, or `playwright/.cache/`.
