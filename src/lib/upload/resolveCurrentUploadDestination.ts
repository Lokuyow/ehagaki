import { authState } from "../../stores/authStore.svelte";
import { uploadDestinationsRepository } from "../storage/uploadDestinationsRepository";
import { resolveUploadDestinationForUse } from "./uploadDestinationResolver";
import type { UploadDestination } from "../types";

export function getCurrentUploadIdentity(): { pubkeyHex: string | null; npub: string | null } {
    const auth = authState.value;
    return auth.isAuthenticated && auth.type !== "npub"
        ? { pubkeyHex: auth.pubkey || null, npub: auth.npub || null }
        : { pubkeyHex: null, npub: null };
}

export async function resolveCurrentUploadDestination(): Promise<UploadDestination> {
    const identity = getCurrentUploadIdentity();
    return resolveUploadDestinationForUse(
        await uploadDestinationsRepository.getDefault(identity.pubkeyHex),
        identity,
    );
}
