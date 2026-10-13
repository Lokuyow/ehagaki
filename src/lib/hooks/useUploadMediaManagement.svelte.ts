import {
    emptyUploadMediaManagementView,
    UploadMediaManagementController,
} from "../upload/uploadMediaManagementController";
import { evictUploadMediaImages } from "../uploadMediaImageCacheClient";
import { uploadDestinationsRepository } from "../storage/uploadDestinationsRepository";

export function useUploadMediaManagement() {
    let view = $state(emptyUploadMediaManagementView());
    const controller = new UploadMediaManagementController({
        loadDestinations: (pubkey) => uploadDestinationsRepository.getAll(pubkey),
        evictImages: evictUploadMediaImages,
        onChange: (next) => { view = next; },
    });
    return { get value() { return view; }, controller };
}
