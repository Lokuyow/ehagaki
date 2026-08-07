import { STORAGE_KEYS } from "../../lib/constants";
import { EmbedComposerContextService } from "../../lib/embedComposerContextService";
import { EmbedSettingsService } from "../../lib/embedSettingsService";
import { EmbedStorageService } from "../../lib/embedStorageService";

const composerCount = document.getElementById("composer-count")!;
const settingsCount = document.getElementById("settings-count")!;
const storageButton = document.getElementById("storage-request")!;
const storageResult = document.getElementById("storage-result")!;

const composerContextService = new EmbedComposerContextService(window, console);
const settingsService = new EmbedSettingsService(window, console);
const storageService = new EmbedStorageService(window, console, 5_000);

let composerMessages = 0;
let settingsMessages = 0;

composerContextService.onRemoteSetContext(() => {
    composerMessages += 1;
    composerCount.textContent = String(composerMessages);
});
settingsService.onRemoteSetSettings(() => {
    settingsMessages += 1;
    settingsCount.textContent = String(settingsMessages);
});

composerContextService.initialize();
settingsService.initialize();
storageService.initialize();

storageButton.addEventListener("click", () => {
    storageResult.textContent = "";
    void storageService.get([STORAGE_KEYS.LOCALE]).then((result) => {
        storageResult.textContent = result.values?.[STORAGE_KEYS.LOCALE] ?? "missing";
    }).catch((error) => {
        storageResult.textContent = error.code ?? "error";
    });
});

document.getElementById("child-ready")!.textContent = "true";
