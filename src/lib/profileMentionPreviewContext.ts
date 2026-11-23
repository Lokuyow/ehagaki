import { getContext, setContext } from "svelte";
import type { ProfileMention } from "./profileMention";
import type { ProfileData } from "./types";

interface ProfileMentionPreviewContext {
    read(pubkey: string): ProfileData | null | undefined;
    load(mentions: ProfileMention[]): void;
}

const contextKey = Symbol("profileMentionPreview");

export function provideProfileMentionPreview(context: ProfileMentionPreviewContext): void {
    setContext(contextKey, context);
}

export function getProfileMentionPreview(): ProfileMentionPreviewContext | undefined {
    return getContext(contextKey);
}
