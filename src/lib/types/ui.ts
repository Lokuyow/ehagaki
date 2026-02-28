// --- UI, Component, BalloonMessage, ServiceWorker, Adapter関連型定義 ---

// UI and Component types
export interface SettingsDialogProps {
    show?: boolean;
    onClose: () => void;
    onRefreshRelaysAndProfile?: () => void;
    selectedCompression?: string;
    onSelectedCompressionChange?: (value: string) => void;
    selectedEndpoint?: string;
    onSelectedEndpointChange?: (value: string) => void;
    onOpenWelcomeDialog?: () => void;
}

export interface CompressionLevel {
    label: string;
    value: string;
}

export interface UploadEndpoint {
    label: string;
    url: string;
}

// BalloonMessage関連型定義
export type BalloonMessageType = "success" | "error" | "warning" | "info";

export interface BalloonMessage {
    type: "success" | "error" | "warning" | "info";
    message: string;
}

// 投稿エラー種別
export type PostErrorType = "post_rejected" | "post_timeout" | "post_network_error" | "post_error";

export interface I18nFunction {
    (key: string): string | undefined;
}

// PostComponent UI状態型定義
export interface PostComponentUIState {
    showSecretKeyDialog: boolean;
    pendingPost: string;
    showImageFullscreen: boolean;
    fullscreenImageSrc: string;
    fullscreenImageAlt: string;
    showPopupModal: boolean;
    popupX: number;
    popupY: number;
    popupMessage: string;
}

// Service Worker types
export interface ServiceWorkerStatus {
    isReady: boolean;
    hasController: boolean;
    canCommunicate: boolean;
    error?: string;
}

// App Utils types
export interface StorageAdapter {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export interface NavigatorAdapter {
    language: string;
}

export interface WindowAdapter {
    location: {
        reload(): void;
    };
}

export interface TimeoutAdapter {
    setTimeout(callback: () => void, delay: number): void;
}

export interface MousePosition {
    x: number;
    y: number;
}

export interface ViewportInfo {
    centerX: number;
    centerY: number;
    offsetX: number;
    offsetY: number;
}

export interface ZoomCalculation {
    newScale: number;
    newTranslate: MousePosition;
}

export interface TouchPosition {
    x: number;
    y: number;
}

export interface PinchInfo {
    distance: number;
    centerX: number;
    centerY: number;
}
