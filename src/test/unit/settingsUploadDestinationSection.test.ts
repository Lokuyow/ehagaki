import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SettingsUploadDestinationSection from "../../components/settings/SettingsUploadDestinationSection.svelte";
import type { UploadDestination } from "../../lib/types";

const testAuth = vi.hoisted(() => ({ isAuthenticated: false, pubkey: null as string | null }));
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
            uploadDestinationTestSuccess: "接続テストに成功しました",
            uploadDestinationBlossomTestInfoLabel: "Blossom 接続テストの説明",
            uploadDestinationBlossomTestInfoNoUpload: "このテストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。",
            uploadDestinationBlossomTestInfoAuthorization: "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。",
            uploadDestinationTesting: "確認中",
            uploadDestinationSetDefault: "既定",
            uploadDestinationMoveUp: "Up",
            uploadDestinationMoveDown: "Down",
            uploadDestinationRelayFetching: "BUD-03 取得中",
            uploadDestinationRelayFetch: "BUD-03 から取得",
            uploadDestinationRelayPublishing: "BUD-03 publish 中",
            uploadDestinationRelayPublish: "BUD-03 へ publish",
            uploadDestinationRelayInfoLabel: "BUD-03 の説明",
            uploadDestinationRelayInfoScope: "BUD-03 の説明",
            uploadDestinationRelayInfoOrder: "BUD-03 の説明",
            uploadDestinationRelayInfoFetch: "BUD-03 の説明",
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
            uploadDestinationTestSuccess: "Connection test succeeded",
            uploadDestinationBlossomTestInfoLabel: "About the Blossom connection test",
            uploadDestinationBlossomTestInfoNoUpload: "This test does not upload a file. It checks upload availability with HEAD /upload.",
            uploadDestinationBlossomTestInfoAuthorization: "Under the Blossom protocol, the authorization request may ask you to sign the upload permission needed for this check.",
            uploadDestinationTesting: "Testing",
            uploadDestinationSetDefault: "Default",
            uploadDestinationMoveUp: "Up",
            uploadDestinationMoveDown: "Down",
            uploadDestinationRelayFetching: "Fetching BUD-03",
            uploadDestinationRelayFetch: "Fetch from BUD-03",
            uploadDestinationRelayPublishing: "Publishing BUD-03",
            uploadDestinationRelayPublish: "Publish to BUD-03",
            uploadDestinationRelayInfoLabel: "BUD-03 info",
            uploadDestinationRelayInfoScope: "BUD-03 info",
            uploadDestinationRelayInfoOrder: "BUD-03 info",
            uploadDestinationRelayInfoFetch: "BUD-03 info",
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
        relayFetching: false,
        relayPublishing: false,
        relaySyncResults: null,
    },
    load: vi.fn(async () => undefined),
    save: vi.fn(async () => undefined),
    test: vi.fn(async () => undefined),
    delete: vi.fn(async () => undefined),
    setDefault: vi.fn(async () => undefined),
    move: vi.fn(async () => undefined),
    fetchFromRelays: vi.fn(async () => undefined),
    publishToRelays: vi.fn(async () => undefined),
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
        value: testAuth,
    },
}));

afterEach(() => {
    cleanup();
    testAuth.isAuthenticated = false;
    testAuth.pubkey = null;
    currentLocale = "ja";
    mockUploadDestinationStore.value = {
        destinations: [],
        defaultDestination: null,
        testResults: {},
        relayFetching: false,
        relayPublishing: false,
        relaySyncResults: null,
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

function setExistingBlossomDestination(): void {
    setExistingNip96Destination();
    const destination = (mockUploadDestinationStore.value as unknown as {
        destinations: UploadDestination[];
    }).destinations[0]!;
    destination.name = "Blossom";
    destination.protocol = "blossom";
    destination.serverUrl = "https://blossom.example";
    destination.resolvedUploadUrl = undefined;
    destination.presetId = "custom";
    destination.auth = { type: "blossom-bud11" };
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
        mockUploadDestinationStore.fetchFromRelays.mockClear();
        mockUploadDestinationStore.publishToRelays.mockClear();
    });

    it("keeps exactly two sync actions and allows NIP-96-only publication", async () => {
        testAuth.isAuthenticated = true; testAuth.pubkey = 'owner';
        setExistingNip96Destination();
        render(SettingsUploadDestinationSection, { rxNostr: {} as never });
        await fireEvent.click(screen.getByRole('button', { name: '管理' }));
        const fetchButton = screen.getByRole('button', { name: 'BUD-03 から取得' }) as HTMLButtonElement;
        const publishButton = screen.getByRole('button', { name: 'BUD-03 へ publish' }) as HTMLButtonElement;
        expect(fetchButton.disabled).toBe(false); expect(publishButton.disabled).toBe(false);
        await fireEvent.click(fetchButton); await fireEvent.click(publishButton);
        expect(mockUploadDestinationStore.fetchFromRelays).toHaveBeenCalledOnce();
        expect(mockUploadDestinationStore.publishToRelays).toHaveBeenCalledOnce();
    });
    it.each(['relayFetching', 'relayPublishing'] as const)("disables both sync buttons during %s", async field => {
        testAuth.isAuthenticated = true; testAuth.pubkey = 'owner';
        setExistingNip96Destination(); mockUploadDestinationStore.value[field] = true;
        render(SettingsUploadDestinationSection, { rxNostr: {} as never });
        await fireEvent.click(screen.getByRole('button', { name: '管理' }));
        const buttons = screen.getAllByRole('button').filter(button => button.textContent?.includes('BUD-03') && !button.getAttribute('aria-label')) as HTMLButtonElement[];
        expect(buttons).toHaveLength(2); expect(buttons.every(button => button.disabled)).toBe(true);
    });
    it("shows the upload icon beside its label and keeps the manage button text-only", () => {
        render(SettingsUploadDestinationSection);

        const icon = document.querySelector(
            '.upload-destination-setting-icon',
        );
        expect(icon).toBeTruthy();
        expect(icon?.getAttribute('aria-hidden')).toBe('true');

        const manageButton = screen.getByRole('button', { name: '管理' });
        expect(manageButton.querySelector('.svg-icon')).toBeNull();
        expect(manageButton.textContent).toContain('管理');
    });

    it("starts with the first Blossom preset and places custom after both preset groups", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();

        const presetSelect = screen.getByLabelText("プリセット") as HTMLSelectElement;
        expect(presetSelect.value).toBe("blossom-band");
        expect(presetSelect.options[0].value).toBe("blossom-band");
        expect(presetSelect.options[presetSelect.options.length - 1].value).toBe("custom");
        expect(Array.from(presetSelect.children).map(child => child.tagName)).toEqual(["OPTGROUP", "OPTGROUP", "OPTION"]);
        expect(screen.queryByLabelText("Protocol")).toBeNull();
        expect(screen.queryByLabelText("URL")).toBeNull();
        expect((screen.getByRole("button", { name: "保存" }) as HTMLButtonElement).disabled).toBe(false);
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));
        expect(getSavedDestination()).toMatchObject({ presetId: "blossom-band", protocol: "blossom", serverUrl: "https://blossom.band" });
    });

    it("shows Protocol only for custom and retains the last preset's protocol", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        const presetSelect = screen.getByLabelText("プリセット");

        for (const [presetId, protocol] of [["share-yabu-me", "nip96"], ["blossom-band", "blossom"]]) {
            await fireEvent.change(presetSelect, { target: { value: presetId } });
            expect(screen.queryByLabelText("Protocol")).toBeNull();
            await fireEvent.change(presetSelect, { target: { value: "custom" } });
            expect((screen.getByLabelText("Protocol") as HTMLSelectElement).value).toBe(protocol);
            expect((screen.getByLabelText("URL") as HTMLInputElement).value).toBe("");
            expect(Array.from((screen.getByLabelText("Protocol") as HTMLSelectElement).options).map(option => option.value)).toEqual(["blossom", "nip96", "custom-http"]);
        }
    });

    it("shows and clears a custom URL while keeping the protocol and button state", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });

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

    it("hides custom URL and clear button when returning to a preset", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        const presetSelect = screen.getByLabelText("プリセット");
        await fireEvent.change(presetSelect, { target: { value: "custom" } });
        await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://custom.example/upload" } });
        expect(screen.getByRole("button", { name: "入力内容を消去" })).toBeTruthy();
        await fireEvent.change(presetSelect, { target: { value: "blossom-band" } });
        expect(screen.queryByLabelText("URL")).toBeNull();
        expect(screen.queryByLabelText("Protocol")).toBeNull();
        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));
        expect(getSavedDestination()).toMatchObject({ protocol: "blossom", serverUrl: "https://blossom.band" });
    });

    it("renders the URL input with in-field clear button styling", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        expect(input.classList.contains("upload-destination-url-input")).toBe(true);
    });

    it("uses localized accessible names for the clear button", async () => {
        currentLocale = "en";
        render(SettingsUploadDestinationSection);
        await openAddForm();
        await fireEvent.change(screen.getByLabelText("Preset"), { target: { value: "custom" } });

        const input = screen.getByLabelText("URL") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "https://example.com" } });

        const clearButton = screen.getByRole("button", { name: "Clear input" });
        expect(clearButton).toBeTruthy();
        expect(clearButton.getAttribute("aria-label")).toBe("Clear input");

        currentLocale = "ja";
        cleanup();
        render(SettingsUploadDestinationSection);
        await openAddForm();

        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });
        const japaneseInput = screen.getByLabelText("URL") as HTMLInputElement;
        await fireEvent.input(japaneseInput, { target: { value: "https://example.com" } });

        const japaneseClearButton = screen.getByRole("button", { name: "入力内容を消去" });
        expect(japaneseClearButton).toBeTruthy();
        expect(japaneseInput).toBeInstanceOf(HTMLInputElement);
    });

    it("rejects an invalid custom NIP-96 URL before saving", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });

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

    it("allows changing an existing preset's protocol after switching to custom", async () => {
        setExistingNip96Destination();
        render(SettingsUploadDestinationSection);
        await tick();
        fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await tick();
        fireEvent.click(screen.getByRole("button", { name: "編集" }));
        await tick();

        expect(screen.queryByLabelText("Protocol")).toBeNull();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });
        const protocolSelect = screen.getByLabelText("Protocol") as HTMLSelectElement;
        expect(protocolSelect.value).toBe("nip96");
        await fireEvent.change(protocolSelect, { target: { value: "custom-http" } });
        await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://custom.example/upload" } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        const savedDestination = getSavedDestination();
        expect(savedDestination).toEqual(expect.objectContaining({
            id: "existing-nip96",
            protocol: "custom-http",
            presetId: "custom",
        }));
        expect(savedDestination).not.toHaveProperty("resolvedUploadUrl");
    });

    it("clears the NIP-96 validation error when another protocol is selected", async () => {
        render(SettingsUploadDestinationSection);
        await openAddForm();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });

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
        await fireEvent.change(presetSelect, { target: { value: "share-yabu-me" } });

        expect(screen.queryByLabelText("Protocol")).toBeNull();
        expect(screen.queryByLabelText("URL")).toBeNull();
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));
        expect(getSavedDestination()).toMatchObject({ protocol: "nip96", serverUrl: "https://share.yabu.me/api/v2/media" });
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

        expect(screen.queryByLabelText("URL")).toBeNull();
        await fireEvent.change(screen.getByLabelText("プリセット"), { target: { value: "custom" } });
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

    it.each([
        ["https://files.example", "https://files.example"],
        ["https://files.example/", "https://files.example"],
        ["https://FILES.example:443", " https://files.example/ "],
    ])("preserves discovery metadata when re-saving equivalent NIP-96 URLs (%s → %s)", async (storedUrl, editedUrl) => {
        setExistingNip96Destination();
        const destination = (mockUploadDestinationStore.value.destinations as UploadDestination[])[0];
        Object.assign(destination, { presetId: "custom", serverUrl: storedUrl,
            resolvedUploadUrl: "https://api.files.example/upload", nip96ServerUrl: "https://files.example", nip96UrlMode: "discovery" });
        render(SettingsUploadDestinationSection);
        await fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await fireEvent.click(screen.getByRole("button", { name: "編集" }));
        if (editedUrl !== storedUrl) await fireEvent.input(screen.getByLabelText("URL"), { target: { value: editedUrl } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(getSavedDestination()).toMatchObject({ serverUrl: "https://files.example/",
            resolvedUploadUrl: "https://api.files.example/upload", nip96ServerUrl: "https://files.example", nip96UrlMode: "discovery" });
    });

    it.each([
        ["https://files.example", "https://other.example"],
        ["https://files.example/upload", "https://files.example/upload/"],
        ["https://files.example/upload?a=1", "https://files.example/upload?a=2"],
        ["invalid legacy URL", "https://files.example"],
    ])("clears discovery metadata when changing or repairing a NIP-96 URL (%s → %s)", async (storedUrl, editedUrl) => {
        setExistingNip96Destination();
        const destination = (mockUploadDestinationStore.value.destinations as UploadDestination[])[0];
        Object.assign(destination, { presetId: "custom", serverUrl: storedUrl,
            resolvedUploadUrl: "https://api.files.example/upload", nip96ServerUrl: "https://files.example", nip96UrlMode: "discovery" });
        render(SettingsUploadDestinationSection);
        await fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await fireEvent.click(screen.getByRole("button", { name: "編集" }));
        await fireEvent.input(screen.getByLabelText("URL"), { target: { value: editedUrl } });
        await fireEvent.click(screen.getByRole("button", { name: "保存" }));

        const saved = getSavedDestination();
        expect(saved).not.toHaveProperty("resolvedUploadUrl");
        expect(saved).not.toHaveProperty("nip96ServerUrl");
        expect(saved).not.toHaveProperty("nip96UrlMode");
    });

    it("shows a successful Blossom connection test even when the result has no message", async () => {
        setExistingBlossomDestination();
        (mockUploadDestinationStore.value as unknown as {
            testResults: Record<string, { success: boolean; message?: string }>;
        }).testResults = {
            "existing-nip96": { success: true },
        };

        render(SettingsUploadDestinationSection);
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "管理" }));
        await tick();

        expect(screen.getByText("接続テストに成功しました")).toBeTruthy();

        await fireEvent.click(
            screen.getByRole("button", { name: "Blossom 接続テストの説明" }),
        );
        expect(
            screen.getByText(
                "このテストでは実際のファイルをアップロードせず、HEAD /upload でアップロード可否を確認します。",
            ),
        ).toBeTruthy();
        expect(
            screen.getByText(
                "Blossom の仕様上、確認に必要な署名で upload 権限が要求される場合があります。",
            ),
        ).toBeTruthy();
    });

    it("keeps the existing failed connection test message and localizes the Blossom feedback in English", async () => {
        currentLocale = "en";
        setExistingBlossomDestination();
        (mockUploadDestinationStore.value as unknown as {
            testResults: Record<string, { success: boolean; message?: string }>;
        }).testResults = {
            "existing-nip96": {
                success: false,
                message: "Authentication is required or was rejected",
            },
        };

        render(SettingsUploadDestinationSection);
        await tick();
        await fireEvent.click(screen.getByRole("button", { name: "Manage" }));
        await tick();

        expect(screen.getByText("Authentication is required or was rejected")).toBeTruthy();
        expect(screen.queryByText("Connection test succeeded")).toBeNull();

        await fireEvent.click(
            screen.getByRole("button", { name: "About the Blossom connection test" }),
        );
        expect(
            screen.getByText(
                "This test does not upload a file. It checks upload availability with HEAD /upload.",
            ),
        ).toBeTruthy();
        expect(
            screen.getByText(
                "Under the Blossom protocol, the authorization request may ask you to sign the upload permission needed for this check.",
            ),
        ).toBeTruthy();
    });
});
