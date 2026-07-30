export interface StaleAssetReloadState {
    required: boolean;
    promptRevision: number;
}

let required = $state(false);
let promptRevision = $state(0);

export const staleAssetReloadState = {
    get required() {
        return required;
    },
    get promptRevision() {
        return promptRevision;
    },
};

export function markStaleAssetReloadRequired(): boolean {
    if (required) {
        return false;
    }
    required = true;
    return true;
}

export function requestStaleReloadPrompt(): number {
    promptRevision += 1;
    return promptRevision;
}

