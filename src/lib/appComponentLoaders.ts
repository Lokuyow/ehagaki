import { createComponentLoader } from "./appComponentLoader";

type PostComponent = typeof import("../components/PostComponent.svelte").default;
type LoginDialogComponent = typeof import("../components/LoginDialog.svelte").default;
type ProfileComponent = typeof import("../components/ProfileComponent.svelte").default;
type SettingsDialogComponent = typeof import("../components/SettingsDialog.svelte").default;
type WelcomeDialogComponent = typeof import("../components/WelcomeDialog.svelte").default;
type DraftListDialogComponent = typeof import("../components/DraftListDialog.svelte").default;
type PostHistoryDialogComponent = typeof import("../components/PostHistoryDialog.svelte").default;
type ComposerTargetDialogComponent = typeof import("../components/ComposerTargetDialog.svelte").default;
type CustomEmojiPickerComponent = typeof import("../components/CustomEmojiPicker.svelte").default;

export interface AppComponentLoaders {
    loadPostComponent(): Promise<void>;
    loadLoginDialog(): Promise<void>;
    loadProfileDialog(): Promise<void>;
    loadSettingsDialog(): Promise<void>;
    loadWelcomeDialog(): Promise<void>;
    loadDraftListDialog(): Promise<void>;
    loadPostHistoryDialog(): Promise<void>;
    loadComposerTargetDialog(): Promise<void>;
    loadCustomEmojiPicker(): Promise<void>;
}

export interface AppComponentLoaderTargets {
    setPostComponent(component: PostComponent | null): void;
    setLoginDialogComponent(component: LoginDialogComponent | null): void;
    setProfileComponent(component: ProfileComponent | null): void;
    setSettingsDialogComponent(component: SettingsDialogComponent | null): void;
    setWelcomeDialogComponent(component: WelcomeDialogComponent | null): void;
    setDraftListDialogComponent(component: DraftListDialogComponent | null): void;
    setPostHistoryDialogComponent(component: PostHistoryDialogComponent | null): void;
    setComposerTargetDialogComponent(component: ComposerTargetDialogComponent | null): void;
    setCustomEmojiPickerComponent(component: CustomEmojiPickerComponent | null): void;
}

export function createAppComponentLoaders(
    targets: AppComponentLoaderTargets,
): AppComponentLoaders {
    const loadPostComponentModule = createComponentLoader<PostComponent>(
        () => import("../components/PostComponent.svelte"),
        { eager: true },
    );
    const loadLoginDialogModule = createComponentLoader<LoginDialogComponent>(
        () => import("../components/LoginDialog.svelte"),
    );
    const loadProfileComponentModule = createComponentLoader<ProfileComponent>(
        () => import("../components/ProfileComponent.svelte"),
    );
    const loadSettingsDialogModule = createComponentLoader<SettingsDialogComponent>(
        () => import("../components/SettingsDialog.svelte"),
    );
    const loadWelcomeDialogModule = createComponentLoader<WelcomeDialogComponent>(
        () => import("../components/WelcomeDialog.svelte"),
    );
    const loadDraftListDialogModule = createComponentLoader<DraftListDialogComponent>(
        () => import("../components/DraftListDialog.svelte"),
    );
    const loadPostHistoryDialogModule = createComponentLoader<PostHistoryDialogComponent>(
        () => import("../components/PostHistoryDialog.svelte"),
    );
    const loadComposerTargetDialogModule = createComponentLoader<ComposerTargetDialogComponent>(
        () => import("../components/ComposerTargetDialog.svelte"),
    );
    const loadCustomEmojiPickerModule = createComponentLoader<CustomEmojiPickerComponent>(
        () => import("../components/CustomEmojiPicker.svelte"),
    );

    return {
        async loadPostComponent(): Promise<void> {
            targets.setPostComponent(await loadPostComponentModule());
        },
        async loadLoginDialog(): Promise<void> {
            targets.setLoginDialogComponent(await loadLoginDialogModule());
        },
        async loadProfileDialog(): Promise<void> {
            targets.setProfileComponent(await loadProfileComponentModule());
        },
        async loadSettingsDialog(): Promise<void> {
            targets.setSettingsDialogComponent(await loadSettingsDialogModule());
        },
        async loadWelcomeDialog(): Promise<void> {
            targets.setWelcomeDialogComponent(await loadWelcomeDialogModule());
        },
        async loadDraftListDialog(): Promise<void> {
            targets.setDraftListDialogComponent(await loadDraftListDialogModule());
        },
        async loadPostHistoryDialog(): Promise<void> {
            targets.setPostHistoryDialogComponent(await loadPostHistoryDialogModule());
        },
        async loadComposerTargetDialog(): Promise<void> {
            targets.setComposerTargetDialogComponent(
                await loadComposerTargetDialogModule(),
            );
        },
        async loadCustomEmojiPicker(): Promise<void> {
            targets.setCustomEmojiPickerComponent(await loadCustomEmojiPickerModule());
        },
    };
}
