import { authState } from "../../stores/authStore.svelte";
import { uploadDestinationsRepository } from "../storage/uploadDestinationsRepository";
import { resolveUploadDestinationForUse } from "./uploadDestinationResolver";
import type { UploadDestination } from "../types";

export async function resolveCurrentUploadDestination(): Promise<UploadDestination> {
    const identity = authState.value.isAuthenticated
        ? { pubkeyHex: authState.value.pubkey || null, npub: authState.value.npub || null }
        : { pubkeyHex: null, npub: null };
    return resolveUploadDestinationForUse(
        await uploadDestinationsRepository.getDefault(identity.pubkeyHex),
        identity,
    );
}
