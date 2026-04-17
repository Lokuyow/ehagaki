export interface MediaGalleryLayout {
    height: number;
    minWidth: number;
    maxWidth: number;
    actionButtonSize: number;
    copyButtonTop: number;
}

export const DEFAULT_MEDIA_GALLERY_LAYOUT: MediaGalleryLayout = {
    height: 180,
    minWidth: 100,
    maxWidth: 180,
    actionButtonSize: 50,
    copyButtonTop: 62,
};

export const MIN_EDITOR_HEIGHT_WHEN_KEYBOARD_OPEN = 72;

const COMPACT_GALLERY_REFERENCE_LAYOUT = {
    height: 96,
    minWidth: 72,
    maxWidth: 120,
    actionButtonSize: 40,
};

const MIN_COMPACT_GALLERY_HEIGHT = 48;
const MIN_COMPACT_ACTION_BUTTON_SIZE = 32;
const ACTION_BUTTON_OFFSET = 6;

function scaleCompactLayout(height: number): MediaGalleryLayout {
    const scale = height / COMPACT_GALLERY_REFERENCE_LAYOUT.height;
    const minWidth = Math.max(
        MIN_COMPACT_GALLERY_HEIGHT,
        Math.round(COMPACT_GALLERY_REFERENCE_LAYOUT.minWidth * scale),
    );
    const maxWidth = Math.max(
        minWidth,
        Math.round(COMPACT_GALLERY_REFERENCE_LAYOUT.maxWidth * scale),
    );
    const actionButtonSize = Math.max(
        MIN_COMPACT_ACTION_BUTTON_SIZE,
        Math.round(COMPACT_GALLERY_REFERENCE_LAYOUT.actionButtonSize * scale),
    );

    return {
        height,
        minWidth,
        maxWidth,
        actionButtonSize,
        copyButtonTop: Math.max(
            ACTION_BUTTON_OFFSET,
            height - actionButtonSize - ACTION_BUTTON_OFFSET,
        ),
    };
}

export function resolveMediaGalleryLayout({
    keyboardOpen,
    containerHeight,
}: {
    keyboardOpen: boolean;
    containerHeight?: number | null;
}): MediaGalleryLayout {
    if (!keyboardOpen) {
        return DEFAULT_MEDIA_GALLERY_LAYOUT;
    }

    const maxAllowedHeight =
        typeof containerHeight === "number"
            ? Math.max(
                0,
                Math.floor(containerHeight) -
                MIN_EDITOR_HEIGHT_WHEN_KEYBOARD_OPEN,
            )
            : COMPACT_GALLERY_REFERENCE_LAYOUT.height;

    const compactHeight = Math.min(
        COMPACT_GALLERY_REFERENCE_LAYOUT.height,
        Math.max(MIN_COMPACT_GALLERY_HEIGHT, maxAllowedHeight),
    );

    return scaleCompactLayout(compactHeight);
}