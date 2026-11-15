interface EmbedRuntimeService {
    initialize(options: { locationSearch?: string }): boolean;
}

export interface InitializeEmbedRuntimeServicesParams {
    locationSearch: string;
    parentClientAuthService: EmbedRuntimeService;
    embedComposerContextService: EmbedRuntimeService;
    embedSettingsService: EmbedRuntimeService;
    embedStorageService: EmbedRuntimeService;
    embedIndexedDbService: EmbedRuntimeService;
    /** Called right after embed storage initializes, before IndexedDB. */
    onEmbedStorageReady(): void;
}

/**
 * Initialize the iframe embed services from the page query, in the order the
 * app depends on. Returns whether a parent client is available.
 */
export function initializeEmbedRuntimeServices(
    params: InitializeEmbedRuntimeServicesParams,
): { parentClientAvailable: boolean } {
    const { locationSearch } = params;
    const parentClientAvailable = params.parentClientAuthService.initialize({ locationSearch });
    params.embedComposerContextService.initialize({ locationSearch });
    params.embedSettingsService.initialize({ locationSearch });
    if (params.embedStorageService.initialize({ locationSearch })) {
        params.onEmbedStorageReady();
    }
    params.embedIndexedDbService.initialize({ locationSearch });
    return { parentClientAvailable };
}
