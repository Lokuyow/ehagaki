export interface SharedMediaInput {
    image?: File;
    images?: File[];
    metadata?: unknown;
}

export interface SharedMediaIndexedDbRecord {
    id: string;
    images: Array<{
        name: string;
        type: string;
        size: number;
        lastModified: number;
        arrayBuffer: ArrayBuffer;
    }>;
    metadata?: unknown;
    createdAt: number;
    updatedAt: number;
    schemaVersion: number;
}

export async function buildSharedMediaIndexedDbRecord({
    sharedData,
    maxFileSize,
    recordId,
    schemaVersion,
    now = () => Date.now(),
}: {
    sharedData: SharedMediaInput;
    maxFileSize: number;
    recordId: string;
    schemaVersion: number;
    now?: () => number;
}): Promise<SharedMediaIndexedDbRecord> {
    const mediaFiles = sharedData.images ?? (sharedData.image ? [sharedData.image] : []);

    const mediaDataList = await Promise.all(
        mediaFiles.map(async (file) => {
            if (!(file instanceof File)) {
                throw new Error('Shared media item is not a File');
            }
            if (file.size > maxFileSize) {
                throw new Error(`File too large for IndexedDB persistence: ${file.name}`);
            }

            return {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified || now(),
                arrayBuffer: await file.arrayBuffer(),
            };
        }),
    );

    const timestamp = now();
    return {
        id: recordId,
        images: mediaDataList,
        metadata: sharedData.metadata,
        createdAt: timestamp,
        updatedAt: timestamp,
        schemaVersion,
    };
}