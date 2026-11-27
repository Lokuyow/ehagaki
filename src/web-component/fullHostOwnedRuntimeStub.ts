/**
 * The Full Web Component build resolves PostComponent's Host-owned imports to
 * these names. Host-owned submission and upload are compiled out of Full by
 * __EHAGAKI_COMPOSER_LITE__, so none of these is reachable at runtime; they
 * only keep the Host-owned output/upload modules out of the Full module graph.
 */
function unavailable(): never {
    throw new Error("Host-owned Composer behavior is unavailable in the Full Web Component.");
}

export const buildHostOwnedComposerOutput = unavailable;
export const getHostSubmissionEventId = unavailable;
export const createHostOwnedUploadDependencies = unavailable;
export const createHostOwnedUploadExecutor = unavailable;
