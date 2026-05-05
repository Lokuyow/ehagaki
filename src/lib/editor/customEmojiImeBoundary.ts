export const CUSTOM_EMOJI_IME_BOUNDARY = "\u200B";

export function stripCustomEmojiImeBoundaries(text: string | null | undefined): string {
    if (!text) return "";
    return text.replaceAll(CUSTOM_EMOJI_IME_BOUNDARY, "");
}
