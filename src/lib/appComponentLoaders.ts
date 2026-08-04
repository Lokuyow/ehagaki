import {
    createComponentLoader,
    type ComponentLoadFailureKind,
    type ComponentLoadResult,
} from "./appComponentLoader";

type PostComponent = typeof import("../components/PostComponent.svelte").default;
type LoginDialogComponent = typeof import("../components/LoginDialog.svelte").default;
type ProfileComponent = typeof import("../components/ProfileComponent.svelte").default;
type SettingsDialogComponent = typeof import("../components/SettingsDialog.svelte").default;
type WelcomeDialogComponent = typeof import("../components/WelcomeDialog.svelte").default;
type DraftListDialogComponent = typeof import("../components/DraftListDialog.svelte").default;
type PostHistoryDialogComponent = typeof import("../components/PostHistoryDialog.svelte").default;
type ComposerTargetDialogComponent = typeof import("../components/ComposerTargetDialog.svelte").default;
type CustomEmojiPickerComponent = typeof import("../components/CustomEmojiPicker.svelte").default;

export type AppComponentKey =
    | "post"
    | "login"
    | "profile"
    | "settings"
    | "welcome"
    | "draft-list"
    | "post-history"
    | "composer-target"
    | "custom-emoji-picker";

export interface AppComponentLoadFailure {
    componentKey: AppComponentKey;
    failureKind: ComponentLoadFailureKind;
    error: unknown;
}

export interface AppComponentLoaders {
    loadPostComponent(): Promise<void>;
    loadLoginDialog(): Promise<void>;
    loadProfileDialog(): Promise<void>;
    loadSettingsDialog(): Promise<void>;
    loadWelcomeDialog(): Promise<void>;
    loadDraftListDialog(): Promise<void>;
    loadPostHistoryDialog(): Promise<void>;
    preloadPostHistoryDialog(): Promise<void>;
    loadComposerTargetDialog(): Promise<void>;
    loadCustomEmojiPicker(): Promise<void>;
}

export interface AppComponentLoaderTargets {
    isStaleAssetReloadRequired(): boolean;
    onLoadFailure(failure: AppComponentLoadFailure): void;
    setPostComponent(component: PostComponent): void;
    setLoginDialogComponent(component: LoginDialogComponent): void;
    setProfileComponent(component: ProfileComponent): void;
    setSettingsDialogComponent(component: SettingsDialogComponent): void;
    setWelcomeDialogComponent(component: WelcomeDialogComponent): void;
    setDraftListDialogComponent(component: DraftListDialogComponent): void;
    setPostHistoryDialogComponent(component: PostHistoryDialogComponent): void;
    setComposerTargetDialogComponent(component: ComposerTargetDialogComponent): void;
    setCustomEmojiPickerComponent(component: CustomEmojiPickerComponent): void;
}

function applyLoadResult<T, Key extends AppComponentKey>(
    result: ComponentLoadResult<T, Key>,
    setter: (component: T) => void,
    onLoadFailure: (failure: AppComponentLoadFailure) => void,
): void {
    if (result.status === "loaded") {
        setter(result.component);
        return;
    }
    onLoadFailure(result);
}

export function createAppComponentLoaders(
    targets: AppComponentLoaderTargets,
): AppComponentLoaders {
    const commonOptions = {
        isStale: targets.isStaleAssetReloadRequired,
    };
    const loadPostComponentModule = createComponentLoader(
        "post",
        () => import("../components/PostComponent.svelte"),
        { ...commonOptions, eager: true },
    );
    const loadLoginDialogModule = createComponentLoader(
        "login",
        () => import("../components/LoginDialog.svelte"),
        commonOptions,
    );
    const loadProfileComponentModule = createComponentLoader(
        "profile",
        () => import("../components/ProfileComponent.svelte"),
        commonOptions,
    );
    const loadSettingsDialogModule = createComponentLoader(
        "settings",
        () => import("../components/SettingsDialog.svelte"),
        commonOptions,
    );
    const loadWelcomeDialogModule = createComponentLoader(
        "welcome",
        () => import("../components/WelcomeDialog.svelte"),
        commonOptions,
    );
    const loadDraftListDialogModule = createComponentLoader(
        "draft-list",
        () => import("../components/DraftListDialog.svelte"),
        commonOptions,
    );
    const loadPostHistoryDialogModule = createComponentLoader(
        "post-history",
        () => import("../components/PostHistoryDialog.svelte"),
        commonOptions,
    );
    const loadComposerTargetDialogModule = createComponentLoader(
        "composer-target",
        () => import("../components/ComposerTargetDialog.svelte"),
        commonOptions,
    );
    const loadCustomEmojiPickerModule = createComponentLoader(
        "custom-emoji-picker",
        () => import("../components/CustomEmojiPicker.svelte"),
        commonOptions,
    );

    return {
        async loadPostComponent() {
            applyLoadResult(
                await loadPostComponentModule(),
                targets.setPostComponent,
                targets.onLoadFailure,
            );
        },
        async loadLoginDialog() {
            applyLoadResult(
                await loadLoginDialogModule(),
                targets.setLoginDialogComponent,
                targets.onLoadFailure,
            );
        },
        async loadProfileDialog() {
            applyLoadResult(
                await loadProfileComponentModule(),
                targets.setProfileComponent,
                targets.onLoadFailure,
            );
        },
        async loadSettingsDialog() {
            applyLoadResult(
                await loadSettingsDialogModule(),
                targets.setSettingsDialogComponent,
                targets.onLoadFailure,
            );
        },
        async loadWelcomeDialog() {
            applyLoadResult(
                await loadWelcomeDialogModule(),
                targets.setWelcomeDialogComponent,
                targets.onLoadFailure,
            );
        },
        async loadDraftListDialog() {
            applyLoadResult(
                await loadDraftListDialogModule(),
                targets.setDraftListDialogComponent,
                targets.onLoadFailure,
            );
        },
        async loadPostHistoryDialog() {
            applyLoadResult(
                await loadPostHistoryDialogModule(),
                targets.setPostHistoryDialogComponent,
                targets.onLoadFailure,
            );
        },
        async preloadPostHistoryDialog() {
            const result = await loadPostHistoryDialogModule.preload();
            if (result.status === "loaded") {
                targets.setPostHistoryDialogComponent(result.component);
            }
        },
        async loadComposerTargetDialog() {
            applyLoadResult(
                await loadComposerTargetDialogModule(),
                targets.setComposerTargetDialogComponent,
                targets.onLoadFailure,
            );
        },
        async loadCustomEmojiPicker() {
            applyLoadResult(
                await loadCustomEmojiPickerModule(),
                targets.setCustomEmojiPickerComponent,
                targets.onLoadFailure,
            );
        },
    };
}
