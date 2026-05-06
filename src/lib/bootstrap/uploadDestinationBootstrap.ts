import type { EmbedUploadEndpointBootstrapPreference } from "./embedSettingsBootstrap";

export async function applyUploadDestinationBootstrap(
    preference: EmbedUploadEndpointBootstrapPreference | null,
): Promise<void> {
    if (!preference) return;

    const { uploadDestinationsRepository } = await import(
        "../storage/uploadDestinationsRepository"
    );
    await uploadDestinationsRepository.applyUploadEndpointPreference({
        endpoint: preference.endpoint,
        mode: preference.mode,
        pubkeyHex: null,
    });
}
