import { embedStorageService } from './embedStorageService';
import {
    EMBED_SETTING_STORAGE_KEYS,
    withSettingsPreferenceMetadata,
} from './embedStorageKeys';

export function persistChangedEmbedSettingKeys(keys: readonly string[]): void {
    embedStorageService.persistLocalStorageKeys(
        withSettingsPreferenceMetadata(keys),
    );
}

export function persistAllEmbedSettingKeys(): void {
    embedStorageService.persistLocalStorageKeys([...EMBED_SETTING_STORAGE_KEYS]);
}