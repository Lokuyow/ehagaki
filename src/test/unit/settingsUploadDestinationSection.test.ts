import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SettingsUploadDestinationSection from "../../components/settings/SettingsUploadDestinationSection.svelte";
import type { UploadDestination } from "../../lib/types";

let currentLocale = "ja";

const translations = {
    ja: {
        clearInput: "入力内容を消去",
        settingsDialog: {
            uploadDestinationPreset: "プリセット",
            uploadDestinationProtocol: "Protocol",
            uploadDestinationEnabled: "有効",
            uploadDestinationSave: "保存",
            uploadDestinationAdd: "追加",
            uploadDestinationClose: "閉じる",
            uploadDestinationManage: "管理",
            uploadDestinationEdit: "編集",
            uploadDestinationDelete: "削除",
            uploadDestinationTest: "接続テスト",
            uploadDestinationTesting: "確認中",
            uploadDestinationSetDefault: "既定",
            uploadDestinationMoveUp: "Up",
            uploadDestinationMoveDown: "Down",
            uploadDestinationBud03Fetching: "BUD-03 取得中",
            uploadDestinationBud03Fetch: "BUD-03 から取得",
            uploadDestinationBud03Publishing: "BUD-03 publish 中",
            uploadDestinationBud03Publish: "BUD-03 へ publish",
            uploadDestinationBud03InfoLabel: "BUD-03 の説明",
            uploadDestinationBud03InfoScope: "BUD-03 の説明",
            uploadDestinationBud03InfoOrder: "BUD-03 の説明",
            uploadDestinationBud03InfoFetch: "BUD-03 の説明",
            uploadDestinationUnknown: "未確認",
            uploadDestinationNone: "未設定",
            uploadDestinationDefault: "既定",
            uploadDestinationDisabled: "無効",
            uploadDestinationMimeCollapse: "折りたたむ",
            uploadDestinationMimeExpand: "すべて表示",
            uploadDestinationInvalidNip96Url: "NIP-96 のURLは絶対HTTP(S) URLである必要があります。",
            upload_destination: "アップロード先",
        },
        postComponent: {
            cancel: "キャンセル",
        },
    },
    en: {
        clearInput: "Clear input",
        settingsDialog: {
            uploadDestinationPreset: "Preset",
            uploadDestinationProtocol: "Protocol",
            uploadDestinationEnabled: "Enabled",
            uploadDestinationSave: "Save",
            uploadDestinationAdd: "Add",
            uploadDestinationClose: "Close",
            uploadDestinationManage: "Manage",
            uploadDestinationEdit: "Edit",
            uploadDestinationDelete: "Delete",
            uploadDestinationTest: "Test",
            uploadDestinationTesting: "Testing",
            uploadDestinationSetDefault: "Default",
            uploadDestinationMoveUp: "Up",
            uploadDestinationMoveDown: "Down",
            uploadDestinationBud03Fetching: "Fetching BUD-03",
            uploadDestinationBud03Fetch: "Fetch from BUD-03",
            uploadDestinationBud03Publishing: "Publishing BUD-03",
            uploadDestinationBud03Publish: "Publish to BUD-03",
            uploadDestinationBud03InfoLabel: "BUD-03 info",
            uploadDestinationBud03InfoScope: "BUD-03 info",
            uploadDestinationBud03InfoOrder: "BUD-03 info",
            uploadDestinationBud03InfoFetch: "BUD-03 info",
            uploadDestinationUnknown: "Unknown",
            uploadDestinationNone: "None",
            uploadDestinationDefault: "Default",
            uploadDestinationDisabled: "Disabled",
            uploadDestinationMimeCollapse: "Collapse",
            uploadDestinationMimeExpand: "Show all",
            uploadDestinationInvalidNip96Url: "The NIP-96 URL must be an absolute HTTP(S) URL.",
            upload_destination: "Upload destinations",
        },
        postComponent: {
            cancel: "Cancel",
        },
    },
};

const mockUploadDestinationStore = vi.hoisted(() => ({
    value: {
        destinations: [],
        defaultDestination: null,
        testResults: {},
        bud03Fetching: false,
        bud03Publishing: false,
        bud03Status: null,
    },
    load: vi.fn(async () => undefined),
    save: vi.fn(async () => undefined),
    test: vi.fn(async () => undefined),
    delete: vi.fn(async () => undefined),
    setDefault: vi.fn(async () => undefined),
    move: vi.fn(async () => undefined),
    fetchBud03: vi.fn(async () => undefined),
    publishBud03: vi.fn(async () => undefined),
}));

vi.mock("svelte-i18n", async () => {
    const { readable } = await import("svelte/store");

    return {
        _: readable((key: string) => {
            const [namespace, nestedKey] = key.split(".");
            const localeData = currentLocale === "en" ? translations.en : translations.ja;
            if (namespace === "settingsDialog") {
                return localeData.settingsDialog[nestedKey as keyof typeof localeData.settingsDialog] ?? key;
            }
            if (namespace === "postComponent") {
                return localeData.postComponent[nestedKey as keyof typeof localeData.postComponent] ?? key;
            }
            return localeData[key as keyof typeof localeData] ?? key;
        }),
        locale: readable("ja"),
    };
});

vi.mock("../../stores/uploadDestinationStore.svelte", () => ({
    uploadDestinationStore: mockUploadDestinationStore,
}));

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        value: {
            isAuthenticated: false,
            pubkey: null,
        },
    },
}));

afterEach(() => {
    cleanup();
    currentLocale = "ja";
    mockUploadDestinationStore.value = {
        destinations: [],
        defaultDestination: null,
        testResults: {},
        bud03Fetching: false,
        bud03Publishing: false,
        bud03Status: null,
    };
});

async function openAddForm(): Promise<void> {
    const manageLabel = currentLocale === "en" ? "Manage" : "管理";
    const addLabel = currentLocale === "en" ? "Add" : "追加";

    fireEvent.click(screen.getByRole("button", { name: manageLabel }));
    await tick();
    fireEvent.click(screen.getByRole("button", { name: addLabel }));
    await tick();
}

function setExistingNip96Destination(): void {
    const destination: UploadDestination = {
            id: "existing-nip96",
            pubkeyHex: null,
            name: "share.yabu.me",
            protocol: "nip96",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
            presetId: "share-yabu-me",
            isDefault: true,
            enabled: true,
            createdAt: 1,
            updatedAt: 1,
            capabilities: {
                maxUploadSize: null,
                supportedMimeTypes: [],
                supportsDelete: false,
                supportsList: false,
                supportsMirror: false,
                supportsMediaOptimization: false,
                authRequired: true,
                source: "preset",
            },
            auth: { type: "nip98" },
            schemaVersion: 1,
    };
    (mockUploadDestinationStore.value as unknown as { destinations: UploadDestination[] }).destinations = [
        destination,
    ];
}

function getSavedDestination(): UploadDestination {
    return (mockUploadDestinationStore.save.mock.calls as unknown as Array<[UploadDestination]>)[0]![0];
}

describe("SettingsUploadDestinationSection", () => {
    beforeEach(() => {
        mockUploadDestinationStore.load.mockClear();
        mockUploadDestinationStore.save.mockClear();
        mockUploadDestinationStore.test.mockClear();
        mockUploadDestinationStore.delete.mockClear();
        mockUploadDestinationStore.setDefault.mockClear();
        mockUploadDestinationStore.move.mockClear();
        mockUploadDestinationStore.fetchBud03.mockClear();
        mockUploadDestinationStore.publishBud03.mockClear();
    });

    it("shows and clears a custom URL while keeping the protocol and button state", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;
        const presetSelect = screen.getByLabelText("プリセット") as HTMLSelectElement;

        expect(input).toBeInstanceOf(HTMLInputElement);
        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();

        await fireEvent.change(protocolSelect, { target: { value: "custom-http" } });
        await fireEvent.input(input, { target: { value: "https://example.com/upload" } });

        expect(screen.getByRole("button", { name: "入力内容を消去" })).toBeTruthy();
        expect(presetSelect.value).toBe("custom");
        expect(protocolSelect.value).toBe("custom-http");

        const saveButton = screen.getByRole("button", { name: "保存" });
        expect((saveButton as HTMLButtonElement).disabled).toBe(false);

        await fireEvent.click(screen.getByRole("button", { name: "入力内容を消去" }));
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(input.value).toBe("");
        expect(presetSelect.value).toBe("custom");
        expect(protocolSelect.value).toBe("custom-http");
        expect(document.activeElement).toBe(input);
        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();
        expect((screen.getByRole("button", { name: "保存" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("clears a URL that was filled from a preset without restoring the preset URL", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const presetSelect = screen.getByLabelText("プリセット") as HTMLSelectElement;
        const input = screen.getByLabelText("URL") as HTMLInputElement;

        await fireEvent.change(presetSelect, { target: { value: "blossom-band" } });
        expect(input.value).not.toBe("");

        await fireEvent.click(screen.getByRole("button", { name: "入力内容を消去" }));
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(input.value).toBe("");
        expect(presetSelect.value).toBe("custom");
        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();
        expect((screen.getByRole("button", { name: "保存" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("renders the URL input with in-field clear button styling", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        expect(input.classList.contains("upload-destination-url-input")).toBe(true);
    });

    it("uses localized accessible names for the clear button", async () => {
        currentLocale = "en";
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "https://example.com" } });

        const clearButton = screen.getByRole("button", { name: "Clear input" });
        expect(clearButton).toBeTruthy();
        expect(clearButton.getAttribute("aria-label")).toBe("Clear input");

        currentLocale = "ja";
        cleanup();
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const japaneseInput = screen.getByLabelText("URL") as HTMLInputElement;
        await fireEvent.input(japaneseInput, { target: { value: "https://example.com" } });

        const japaneseClearButton = screen.getByRole("button", { name: "入力内容を消去" });
        expect(japaneseClearButton).toBeTruthy();
        expect(japaneseInput).toBeInstanceOf(HTMLInputElement);
    });

    it("rejects an invalid custom NIP-96 URL before saving", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;

        await fireEvent.change(protocolSelect, { target: { value: "nip96" } });
        await fireEvent.input(input, { target: { value: "//example.com/upload" } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(mockUploadDestinationStore.save).not.toHaveBeenCalled();
        expect(screen.getByRole("alert").textContent).toContain(
            "NIP-96 のURLは絶対HTTP(S) URLである必要があります。",
        );
    });

    it("preserves a manually selected protocol when editing a preset destination", async () => {
        setExistingNip96Destination();
        render(SettingsUploadDestinationSection);
        await tick();
        fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await tick();
        fireEvent.click(screen.getByRole("button", { name: "編集" }));
        await tick();

        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;
        expect(protocolSelect.value).toBe("nip96");
        await fireEvent.change(protocolSelect, { target: { value: "custom-http" } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        const savedDestination = getSavedDestination();
        expect(savedDestination).toEqual(expect.objectContaining({
            id: "existing-nip96",
            protocol: "custom-http",
            presetId: "share-yabu-me",
        }));
        expect(savedDestination).not.toHaveProperty("resolvedUploadUrl");
    });

    it("clears the NIP-96 validation error when another protocol is selected", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;
        await fireEvent.change(protocolSelect, { target: { value: "nip96" } });
        await fireEvent.input(input, { target: { value: "relative/upload" } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));
        expect(screen.getByRole("alert")).toBeTruthy();

        await fireEvent.change(protocolSelect, { target: { value: "blossom" } });
        expect(screen.queryByRole("alert")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(mockUploadDestinationStore.save).toHaveBeenCalledWith(
            expect.objectContaining({ protocol: "blossom" }),
        );
    });

    it("keeps preset protocol and URL when a preset is selected", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const presetSelect = screen.getByLabelText("プリセット") as HTMLSelectElement;
        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;
        const input = screen.getByLabelText("URL") as HTMLInputElement;
        await fireEvent.change(presetSelect, { target: { value: "share-yabu-me" } });

        expect(protocolSelect.value).toBe("nip96");
        expect(input.value).toBe("https://share.yabu.me/api/v2/media");
    });

    it.each([
        ["share-yabu-me", "share.yabu.me", "https://share.yabu.me/api/v2/media", "https://yabu.me/api/v2/media"],
        ["nostrcheck-me", "nostrcheck.me", "https://nostrcheck.me/api/v2/media", "https://cdn.nostrcheck.me/"],
        ["nostr-build", "nostr.build", "https://nostr.build/api/v2/nip96/upload", "https://nostr.build/api/v2/nip96/upload"],
        ["nostpic-com", "nostpic.com", "https://nostpic.com/api/v2/media", "https://nostpic.com/api/v2/media"],
        ["files-sovbit-host", "files.sovbit.host", "https://files.sovbit.host/api/v2/media", "https://files.sovbit.host/upload"],
    ])("saves %s with its fixed identity and direct NIP-96 endpoint", async (presetId, name, serverUrl, resolvedUploadUrl) => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: presetId } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(mockUploadDestinationStore.save).toHaveBeenCalledWith(expect.objectContaining({
            name,
            protocol: "nip96",
            serverUrl,
            resolvedUploadUrl,
            presetId,
        }));
    });

    it("does not retain a preset direct endpoint after a user edits the server URL", async () => {
        setExistingNip96Destination();
        render(SettingsUploadDestinationSection);
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "編集" }));
        await tick();

        await fireEvent.input(screen.getByLabelText("URL"), {
            target: { value: "https://custom.example/upload" },
        });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        const savedDestination = getSavedDestination();
        expect(savedDestination.name).toBe("custom.example");
        expect(savedDestination).not.toHaveProperty("resolvedUploadUrl");
    });

    it("keeps the preset display name while re-saving an unchanged preset destination", async () => {
        setExistingNip96Destination();
        render(SettingsUploadDestinationSection);
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "編集" }));
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(getSavedDestination()).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
        }));
    });
});
