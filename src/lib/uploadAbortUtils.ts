import { uploadAbortFlagStore } from '../stores/uploadStore.svelte';

export type UploadAbortChecker = () => boolean;

export function isDefaultUploadAborted(): boolean {
    return uploadAbortFlagStore.value;
}
