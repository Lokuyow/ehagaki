# Svelte and UI conventions

Read when changing Svelte components, hooks, stores, UI, styles, or localization. Repository-wide responsibility, safety, and compatibility rules remain in [AGENTS.md](../../AGENTS.md).

## Components and presentation

- Use runes, `interface Props` with `$props()`, and `Snippet` for new or modified child-content APIs.
- Reuse shared components and bits-ui primitives. Standard dialogs use `DialogWrapper.svelte`; confirmation/nested dialogs retain their appropriate bits-ui pattern. App-level visibility belongs in `dialogStore.svelte.ts`, local interaction state with its component.
- Preserve accessibility, keyboard behavior, and focus management. Do not suppress focus to conceal a viewport/focus defect.
- Localize user-visible text with svelte-i18n (`{$_('translation_key')}` in templates).
- Reusable icons belong in `public/icons/` and use the existing CSS mask pattern. Document runtime URLs use `import.meta.env.BASE_URL`; preserve GitHub Pages/Vercel base paths. For runtime-specific asset resolution, use the [embed runtime Skill](../skills/ehagaki-embed-runtime/SKILL.md).

## Reactive state and lifecycle

- Stores use `.svelte.ts`, direct module imports, and runes. Do not restore barrel compatibility layers such as `appStore.svelte.ts`; use `svelte/store` for new state only for a justified external API requirement.
- Expose explicit store transitions. Start reactive coordination in the owning component/hook and I/O, auth restoration, subscriptions, and service initialization in the owning controller/bootstrap/service. Avoid `$effect` in stores; calling a service from a store does not justify moving lifecycle orchestration there.
- Follow neighboring state shapes, keep service references non-reactive where that is the existing pattern, and preserve out-of-scope store behavior without turning exceptions into new defaults.
