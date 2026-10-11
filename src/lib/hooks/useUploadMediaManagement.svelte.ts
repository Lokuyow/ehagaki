import {
    emptyUploadMediaManagementView,
    UploadMediaManagementController,
} from "../upload/uploadMediaManagementController";
import { evictUploadMediaImages } from "../uploadMediaImageCacheClient";

export function useUploadMediaManagement() {
    let view = $state(emptyUploadMediaManagementView());
    const controller = new UploadMediaManagementController({
        evictImages: evictUploadMediaImages,
        onChange: (next) => { view = next; },
    });
    return { get value() { return view; }, controller };
}
