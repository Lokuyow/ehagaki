import {
    fireEvent,
    render,
    screen,
    within,
} from "@testing-library/svelte";
import { nip19 } from "nostr-tools";
import { readable } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ComposerTargetDialog from "../../components/ComposerTargetDialog.svelte";
import type {
    ComposerResolvedTarget,
    ComposerTargetResolveResult,
} from "../../lib/composerTargetResolver";

const translations: Record<string, string> = {
    "common.showActions": "アクションを表示",
    "composerTarget.title": "宛先を指定",
    "composerTarget.description": "Nostrイベントを指定します。",
    "composerTarget.inputLabel": "Nostrイベント",
    "composerTarget.placeholder": "note1... または nevent1...",
    "composerTarget.parsing": "入力を確認中...",
    "composerTarget.checking": "イベントを取得中...",
    "composerTarget.channelLoading": "チャンネルを確認中...",
    "composerTarget.profileLoading": "プロフィールを取得中...",
    "composerTarget.fetchFailed": "取得できませんでした。",
    "composerTarget.notFound": "見つかりませんでした。",
    "composerTarget.timeout": "タイムアウトしました。",
    "composerTarget.reply": "返信する",
    "composerTarget.quote": "引用する",
    "composerTarget.post": "投稿する",
    "composerTarget.unsupportedKind": "このkindには対応していません。",
    "composerTarget.unsupportedFormat": "この形式にはまだ対応していません。",
    "composerTarget.invalidFormat": "有効なnoteまたはneventを入力してください。",
    "composerTarget.secretKey": "秘密鍵は入力できません。",
    "composerTarget.mismatch": "ヒントとイベントが一致しません。",
    "composerTarget.clearInput": "入力内容を消去",
    "composerTarget.channelUnavailable": "チャンネルを確認できませんでした。",
    "composerTarget.preview": "イベントのプレビュー",
    "composerTarget.creator": "作成者",
    "replyQuote.reply_label": "リプライ",
    "replyQuote.quote_label": "引用",
    "postHistory.expand": "もっと見る",
    "postHistory.collapse": "折りたたむ",
    "postHistory.contextRetry": "再試行",
    "postHistory.rawJson": "イベントJSONを表示",
    "postHistory.rawJsonTitle": "イベントJSON",
    "postHistory.rawJsonDescription": "投稿イベントのイベントJSONを表示します。",
    "postHistory.broadcast": "ブロードキャスト",
    "postHistory.broadcastSent": "ブロードキャストしました",
    "postHistory.broadcastPartial": "一部のリレーへブロードキャストしました",
    "postHistory.broadcastFailed": "ブロードキャストに失敗しました",
    "postHistory.delete": "削除",
    "postHistory.deleteRequestTitle": "削除リクエストを送信",
    "postHistory.deleteRequestDescription": "この投稿の削除リクエストをリレーへ送信します。",
    "postHistory.deleteRequestWarning": "削除はリレーへのリクエストであり、完全な削除は保証されません。",
    "postHistory.deleteConfirm": "送信",
    "postHistory.deleteCancel": "キャンセル",
    "postHistory.deleteSending": "送信中",
    "postHistory.deleteFailed": "削除リクエストの送信に失敗しました",
    "global.close": "閉じる",
};

const customEmojiMock = vi.hoisted(() => ({
    preloadCustomEmojiImageWithMeta: vi.fn(),
}));

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => translations[key] ?? key),
    locale: readable("ja-JP"),
}));

const postActionMocks = vi.hoisted(() => ({
    broadcast: vi.fn(),
    requestDeletion: vi.fn(),
}));

vi.mock("../../lib/postBroadcastService", async () => {
    const actual = await vi.importActual<
        typeof import("../../lib/postBroadcastService")
    >("../../lib/postBroadcastService");
    return {
        ...actual,
        postBroadcastService: { broadcast: postActionMocks.broadcast },
    };
});

vi.mock("../../lib/postDeletionService", async () => {
    const actual = await vi.importActual<
        typeof import("../../lib/postDeletionService")
    >("../../lib/postDeletionService");
    return {
        ...actual,
        postDeletionService: {
            requestDeletion: postActionMocks.requestDeletion,
        },
    };
});

vi.mock("../../lib/customEmoji", async () => {
    const actual = await vi.importActual<typeof import("../../lib/customEmoji")>(
        "../../lib/customEmoji",
    );
    return {
        ...actual,
        preloadCustomEmojiImageWithMeta:
            customEmojiMock.preloadCustomEmojiImageWithMeta,
    };
});

function createMediaOnlyPrefix(length = 2_000): string[] {
    const mediaUrls = Array.from(
        { length: 10 },
        (_, index) => `https://example.com/leading-${index}-${"media".repeat(4)}.jpg`,
    );
    const finalPrefix = "https://example.com/final-";
    const finalSuffix = ".jpg";
    const usedLength = mediaUrls.join("\n").length + 1;
    const fillLength = length - usedLength - finalPrefix.length - finalSuffix.length;
    mediaUrls.push(`${finalPrefix}${"x".repeat(fillLength)}${finalSuffix}`);
    return mediaUrls;
}

function resolvedTarget(
    kind: number,
    channelName: string | null = "General",
    content = "Preview body",
    tags: string[][] = [],
): ComposerResolvedTarget {
    const channel = kind === 40 || kind === 42;
    return {
        event: {
            id: "1".repeat(64),
            pubkey: "2".repeat(64),
            created_at: 1,
            kind,
            tags,
            content: kind === 40
                ? JSON.stringify({ name: "General", about: "Channel" })
                : content,
            sig: "3".repeat(128),
        },
        relayHints: ["wss://read.example.com/"],
        authorProfile: null,
        channelContext: channel
            ? {
                eventId: "4".repeat(64),
                relayHints: ["wss://verified.example.com/"],
                channelRelays: ["wss://verified.example.com/"],
                name: channelName,
                about: "Channel",
                picture: null,
            }
            : null,
        channelCreatorPubkey: channel ? "7".repeat(64) : null,
        channelCreatorProfile: null,
        channelPictureCacheEligible: channel,
        channelQuery: channel
            ? {
                eventId: "4".repeat(64),
                relayHints: ["wss://verified.example.com/"],
            }
            : null,
    };
}

function createResolver(result: ComposerTargetResolveResult) {
    return {
        resolve: vi.fn(() => ({
            promise: Promise.resolve(result),
            cancel: vi.fn(),
        })),
    };
}

async function enterNote(): Promise<void> {
    await fireEvent.input(
        screen.getByLabelText("Nostrイベント"),
        { target: { value: nip19.noteEncode("1".repeat(64)) } },
    );
    await vi.advanceTimersByTimeAsync(250);
    await vi.runAllTicks();
}

async function openActionMenu(): Promise<void> {
    await fireEvent.click(
        screen.getByRole("button", { name: "アクションを表示" }),
    );
    await vi.runAllTicks();
}

describe("ComposerTargetDialog", () => {
    it("verified channel pictureを共通proxy componentで表示する", async () => {
        const original = navigator.serviceWorker;
        Object.defineProperty(navigator, "serviceWorker", {
            configurable: true,
            value: { controller: {} },
        });
        try {
            const target = resolvedTarget(40);
            target.channelContext!.picture = "https://images.example.com/channel.png";
            target.channelPictureCacheEligible = true;
            render(ComposerTargetDialog, {
                show: true,
                onClose: vi.fn(),
                onApply: vi.fn(() => true),
                rxNostr: {} as never,
                resolver: createResolver({ status: "resolved", target }),
            });

            await enterNote();
            const source = new URL(document.querySelector(".channel-picture")!.getAttribute("src")!);
            expect(source.pathname).toContain("/__ehagaki-image/channel");
            expect(source.searchParams.get("eventId")).toBe("4".repeat(64));
        } finally {
            Object.defineProperty(navigator, "serviceWorker", {
                configurable: true,
                value: original,
            });
        }
    });

    beforeEach(() => {
        vi.useFakeTimers();
        postActionMocks.broadcast.mockReset();
        postActionMocks.requestDeletion.mockReset();
        postActionMocks.broadcast.mockResolvedValue({ success: true });
        postActionMocks.requestDeletion.mockResolvedValue({
            success: true,
            deletedAt: 1,
            deletionEventId: "9".repeat(64),
        });
        customEmojiMock.preloadCustomEmojiImageWithMeta.mockResolvedValue({
            ready: true,
            width: 60,
            height: 30,
            aspectRatio: 2,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("入力値が空のときクリアボタンを表示しない", () => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target: resolvedTarget(1) }),
        });

        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();
    });

    it("入力するとクリアボタンが表示され、押すと入力値が空になってフォーカスが戻る", async () => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target: resolvedTarget(1) }),
        });

        const input = screen.getByLabelText("Nostrイベント");
        await fireEvent.input(input, { target: { value: "note" } });

        const clearButton = screen.getByRole("button", { name: "入力内容を消去" });
        expect(clearButton).not.toBeNull();
        expect(clearButton.getAttribute("type")).toBe("button");
        expect(clearButton.querySelector(".clear-input-icon")).not.toBeNull();

        await fireEvent.click(clearButton);

        expect((input as HTMLInputElement).value).toBe("");
        expect(document.activeElement).toBe(input);
        expect(screen.queryByRole("button", { name: "入力内容を消去" })).toBeNull();
    });

    it("クリアするとプレビューとエラー表示が消え、ダイアログは閉じない", async () => {
        const onClose = vi.fn();
        render(ComposerTargetDialog, {
            show: true,
            onClose,
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target: resolvedTarget(1) }),
        });

        const input = screen.getByLabelText("Nostrイベント");
        await fireEvent.input(input, { target: { value: nip19.noteEncode("1".repeat(64)) } });
        await vi.advanceTimersByTimeAsync(250);
        await vi.runAllTicks();

        expect(screen.getByRole("region", { name: "イベントのプレビュー" })).not.toBeNull();

        await fireEvent.input(input, { target: { value: "invalid" } });
        const clearButton = screen.getByRole("button", { name: "入力内容を消去" });
        await fireEvent.click(clearButton);

        expect(screen.queryByRole("region", { name: "イベントのプレビュー" })).toBeNull();
        expect(screen.queryByText("入力形式が正しくありません")).toBeNull();
        expect(onClose).not.toHaveBeenCalled();
    });

    it("開いた時に入力へフォーカスし、操作前はcomposer callbackを呼ばない", async () => {
        const onApply = vi.fn(() => true);
        const resolver = createResolver({
            status: "resolved",
            target: resolvedTarget(1),
        });
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply,
            rxNostr: {} as never,
            resolver,
        });

        await vi.runAllTicks();
        expect(document.activeElement).toBe(screen.getByLabelText("Nostrイベント"));
        await enterNote();
        expect(screen.getByRole("button", { name: "リプライ" })).not.toBeNull();
        expect(screen.getByRole("button", { name: "引用" })).not.toBeNull();
        expect(onApply).not.toHaveBeenCalled();
    });

    it.each([
        [1, ["リプライ", "引用"]],
        [40, ["投稿する"]],
        [42, ["リプライ", "引用"]],
    ] as const)("kind %iに対応する操作だけを表示する", async (kind, labels) => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(kind),
            }),
        });

        await enterNote();
        for (const label of labels) {
            expect(screen.getByRole("button", { name: label })).not.toBeNull();
        }
        expect(screen.queryAllByRole("button", {
            name: /^(リプライ|引用|投稿する)$/,
        })).toHaveLength(labels.length);
    });

    it("kind 40はチャンネル情報を維持しつつ投稿本文・絵文字・imetaメディアを表示しない", async () => {
        const mediaUrl = "https://example.com/channel-post-media.jpg";
        const emojiUrl = "https://example.com/channel-emoji.webp";
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(40, "General", "ignored", [
                    ["imeta", `url ${mediaUrl}`, "m image/jpeg"],
                    ["emoji", "party", emojiUrl],
                ]),
            }),
        });

        await enterNote();

        expect(document.querySelector(".channel-preview")).toBeTruthy();
        expect(document.querySelector(".channel-name")?.textContent).toContain(
            "General",
        );
        expect(document.querySelector(".post-content-preview")).toBeNull();
        expect(document.querySelector(".post-history-media-section")).toBeNull();
        expect(document.querySelector(".post-history-custom-emoji-slot")).toBeNull();
        expect(screen.queryByText(mediaUrl)).toBeNull();
        expect(screen.queryByText(":party:")).toBeNull();
        expect(screen.queryByRole("button", { name: "もっと見る" })).toBeNull();
        expect(document.querySelector("[aria-controls]")).toBeNull();
    });

    it("入力変更で古いtaskをcancelし、古い結果を表示しない", async () => {
        let settleFirst!: (result: ComposerTargetResolveResult) => void;
        const firstPromise = new Promise<ComposerTargetResolveResult>((resolve) => {
            settleFirst = resolve;
        });
        const firstCancel = vi.fn();
        const resolver = {
            resolve: vi.fn()
                .mockReturnValueOnce({ promise: firstPromise, cancel: firstCancel })
                .mockReturnValueOnce({
                    promise: Promise.resolve({
                        status: "resolved",
                        target: resolvedTarget(40),
                    }),
                    cancel: vi.fn(),
                }),
        };
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver,
        });

        await enterNote();
        await fireEvent.input(
            screen.getByLabelText("Nostrイベント"),
            { target: { value: nip19.noteEncode("5".repeat(64)) } },
        );
        expect(firstCancel).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(250);
        await vi.runAllTicks();
        expect(screen.getByRole("button", { name: "投稿する" })).not.toBeNull();

        settleFirst({
            status: "resolved",
            target: resolvedTarget(1),
        });
        await vi.runAllTicks();
        expect(screen.queryByRole("button", { name: "リプライ" }))
            .toBeNull();
    });

    it("未対応形式とnsecを取得せず安全に拒否する", async () => {
        const resolver = createResolver({
            status: "resolved",
            target: resolvedTarget(1),
        });
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver,
        });
        const input = screen.getByLabelText("Nostrイベント");

        await fireEvent.input(input, {
            target: { value: nip19.npubEncode("6".repeat(64)) },
        });
        expect(screen.getByText("この形式にはまだ対応していません。"))
            .not.toBeNull();
        await fireEvent.input(input, {
            target: { value: nip19.nsecEncode(Uint8Array.from({ length: 32 }, () => 7)) },
        });
        expect(screen.getByText("秘密鍵は入力できません。"))
            .not.toBeNull();
        expect(resolver.resolve).not.toHaveBeenCalled();
    });

    it("名前のないチャンネルは64桁IDを短縮して表示する", async () => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(40, null),
            }),
        });

        await enterNote();
        const channelName = document.querySelector(".channel-name");
        expect(channelName?.textContent?.trim()).toBe(
            "ID: 444444444444...44444444",
        );
        expect(channelName?.textContent).not.toContain("4".repeat(64));
    });

    it("非常に長い空白なしのチャンネル名を専用の折返し要素に表示する", async () => {
        const longName = "VeryLongChannelName".repeat(20);
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(40, longName),
            }),
        });

        await enterNote();
        const channelName = document.querySelector(".channel-name");
        expect(channelName?.textContent?.trim()).toBe(longName);
        expect(channelName?.classList.contains("channel-name")).toBe(true);
    });

    it("投稿履歴と同じ5行制限で折りたたみ、もっと見るボタンで展開する", async () => {
        const content = Array.from(
            { length: 6 },
            (_, index) => `line ${index + 1}`,
        ).join("\n");
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1, "General", content),
            }),
        });

        await enterNote();
        const previewContent = document.querySelector(".event-content");
        const expandButton = screen.getByRole("button", {
            name: "もっと見る",
        });
        expect(previewContent?.classList).toContain("event-content-collapsed");
        expect(expandButton.getAttribute("aria-expanded")).toBe("false");

        await fireEvent.click(expandButton);
        expect(previewContent?.classList).not.toContain(
            "event-content-collapsed",
        );
        expect(
            screen.getByRole("button", { name: "折りたたむ" }).getAttribute(
                "aria-expanded",
            ),
        ).toBe("true");
    });

    it("折りたたみ前後で本文URLをnative linkとして保ち、リンク操作でダイアログを閉じない", async () => {
        const onClose = vi.fn();
        const content = [
            "https://example.com/パス?q=値#場所）。",
            "line 2",
            "line 3",
            "line 4",
            "line 5",
            "https://second.example/path",
        ].join("\n");
        render(ComposerTargetDialog, {
            show: true,
            onClose,
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1, "General", content),
            }),
        });

        await enterNote();
        const firstLink = screen.getByRole("link", {
            name: "https://example.com/パス?q=値#場所",
        });
        expect(firstLink.getAttribute("href")).toBe(
            "https://example.com/%E3%83%91%E3%82%B9?q=%E5%80%A4#%E5%A0%B4%E6%89%80",
        );
        expect(firstLink.getAttribute("target")).toBe("_blank");
        expect(firstLink.getAttribute("rel")).toBe("noopener noreferrer");
        expect(document.querySelector(".event-content")?.classList).toContain(
            "event-content-collapsed",
        );

        await fireEvent.click(firstLink);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByLabelText("Nostrイベント")).toBeTruthy();

        await fireEvent.click(
            screen.getByRole("button", { name: "もっと見る" }),
        );
        expect(screen.getByRole("link", {
            name: "https://second.example/path",
        })).toBeTruthy();
        expect(document.querySelector(".event-content")?.classList).not
            .toContain("event-content-collapsed");
    });

    it("描画上限を超える投稿は折りたたみ中に一部だけ描画し、展開時だけ全文を表示する", async () => {
        const content = "large-content-".repeat(1_000);
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1, "General", content),
            }),
        });

        await enterNote();
        const previewContent = document.querySelector(".event-content");
        const expandButton = screen.getByRole("button", {
            name: "もっと見る",
        });
        expect(previewContent?.textContent?.length).toBeLessThan(
            content.length,
        );
        expect(expandButton.getAttribute("aria-controls")).toBe(
            previewContent?.id,
        );

        await fireEvent.click(expandButton);
        expect(previewContent?.textContent).toBe(content);
        const collapseButton = screen.getByRole("button", {
            name: "折りたたむ",
        });
        expect(collapseButton.getAttribute("aria-expanded")).toBe("true");

        await fireEvent.click(collapseButton);
        expect(previewContent?.textContent?.length).toBeLessThan(
            content.length,
        );
        expect(
            screen
                .getByRole("button", { name: "もっと見る" })
                .getAttribute("aria-expanded"),
        ).toBe("false");
    });

    it("未展開本文を2000文字以内に保ちつつ元イベント全文末尾のメディアを表示する", async () => {
        const lateImageUrl = "https://example.com/late-image.jpg";
        const content = `${"x".repeat(2_100)} ${lateImageUrl}`;
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1, "General", content),
            }),
        });

        await enterNote();

        expect(document.querySelector(".event-content")?.textContent?.length)
            .toBeLessThanOrEqual(2_000);
        expect(document.querySelectorAll(".post-history-image-cell"))
            .toHaveLength(1);
        expect(document.querySelector(".post-history-image-grid"))
            .toBeTruthy();
    });

    it("2000文字を超えるメディアURLだけの投稿は全メディアを表示し、展開操作を表示しない", async () => {
        const mediaUrls = Array.from(
            { length: 36 },
            (_, index) =>
                `https://example.com/${String(index).padStart(2, "0")}-${"media".repeat(8)}.jpg`,
        );
        const content = mediaUrls.join("\n");
        expect(content.length).toBeGreaterThan(2_000);

        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1, "General", content),
            }),
        });

        await enterNote();

        expect(document.querySelectorAll(".post-history-image-cell")).toHaveLength(
            mediaUrls.length,
        );
        expect(document.querySelector(".event-content")).toBeNull();
        expect(screen.queryByRole("button", { name: "もっと見る" })).toBeNull();
        expect(screen.queryByRole("button", { name: "折りたたむ" })).toBeNull();
        expect(document.querySelector("[aria-controls]")).toBeNull();
        expect(document.querySelector(".post-content-preview:empty")).toBeNull();
    });

    it("先頭2000文字が空白だけでも同じトグルDOMで後半本文を展開・再折りたたみできる", async () => {
        const whitespacePrefix = " \n".repeat(1_000);
        const hiddenText = "空白より後の本文";
        expect(whitespacePrefix).toHaveLength(2_000);
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(
                    1,
                    "General",
                    `${whitespacePrefix}${hiddenText}`,
                ),
            }),
        });

        await enterNote();

        expect(screen.queryByText(hiddenText)).toBeNull();
        const toggleButton = screen.getByRole("button", { name: "もっと見る" });
        const controlledId = toggleButton.getAttribute("aria-controls");
        expect(controlledId).toBeTruthy();
        const collapsedControlTarget = document.getElementById(controlledId!);
        expect(collapsedControlTarget?.hidden).toBe(true);
        expect(collapsedControlTarget?.getBoundingClientRect().height).toBe(0);

        toggleButton.focus();
        await fireEvent.click(toggleButton);

        const collapseButton = screen.getByRole("button", { name: "折りたたむ" });
        expect(collapseButton).toBe(toggleButton);
        expect(document.activeElement).toBe(toggleButton);
        expect(screen.getByText(hiddenText)).toBeTruthy();
        expect(document.querySelectorAll(`#${controlledId}`)).toHaveLength(1);

        await fireEvent.click(toggleButton);

        expect(screen.getByRole("button", { name: "もっと見る" })).toBe(
            toggleButton,
        );
        expect(document.activeElement).toBe(toggleButton);
        expect(screen.queryByText(hiddenText)).toBeNull();
        expect(document.getElementById(controlledId!)?.hidden).toBe(true);
    });

    it("先頭2000文字が画像URLだけでも後半に通常テキストがあれば展開できる", async () => {
        const mediaUrls = createMediaOnlyPrefix();
        const mediaPrefix = mediaUrls.join("\n");
        const hiddenText = "2000文字より後の本文";
        expect(mediaPrefix).toHaveLength(2_000);

        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(
                    1,
                    "General",
                    `${mediaPrefix}\n${hiddenText}`,
                ),
            }),
        });

        await enterNote();

        expect(document.querySelectorAll(".post-history-image-cell")).toHaveLength(
            mediaUrls.length,
        );
        expect(screen.queryByText(hiddenText)).toBeNull();
        const expandButton = screen.getByRole("button", { name: "もっと見る" });
        const controlledId = expandButton.getAttribute("aria-controls");
        expect(controlledId).toBeTruthy();
        const collapsedControlTarget = document.getElementById(controlledId!);
        expect(collapsedControlTarget).toBeTruthy();
        expect(collapsedControlTarget?.hidden).toBe(true);
        expect(collapsedControlTarget?.getBoundingClientRect().height).toBe(0);

        expandButton.focus();
        await fireEvent.click(expandButton);

        expect(screen.getByText(hiddenText)).toBeTruthy();
        expect(screen.getByRole("button", { name: "折りたたむ" })).toBe(
            expandButton,
        );
        expect(document.activeElement).toBe(expandButton);
        const expandedControlTargets = document.querySelectorAll(
            `#${controlledId}`,
        );
        expect(expandedControlTargets).toHaveLength(1);
        expect(expandedControlTargets[0].classList).toContain("event-content");
    });

    it("先頭2000文字が画像URLだけでも後半のカスタム絵文字を展開して表示する", async () => {
        const mediaUrls = createMediaOnlyPrefix();
        const mediaPrefix = mediaUrls.join("\n");
        const emojiUrl = "https://example.com/late-party.webp";
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(
                    1,
                    "General",
                    `${mediaPrefix}\n:party:`,
                    [["emoji", "party", emojiUrl]],
                ),
            }),
        });

        await enterNote();
        expect(screen.queryByRole("img", { name: ":party:" })).toBeNull();

        await fireEvent.click(
            screen.getByRole("button", { name: "もっと見る" }),
        );
        await vi.runAllTicks();

        expect(customEmojiMock.preloadCustomEmojiImageWithMeta).toHaveBeenCalledWith(
            emojiUrl,
        );
        expect(screen.getByRole("img", { name: ":party:" })).toBeTruthy();
    });

    it("投稿履歴形式のフッターへ日時・返信・引用・限定メニューだけを表示する", async () => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1),
            }),
        });

        await enterNote();

        expect(document.querySelector(".target-actions")).toBeNull();
        expect(document.querySelector(".target-preview-body")).toBeTruthy();
        expect(document.querySelector(".post-preview-footer")).toBeTruthy();
        expect(document.querySelector(".post-preview-date")?.textContent).toBeTruthy();
        const replyButton = screen.getByRole("button", { name: "リプライ" });
        const quoteButton = screen.getByRole("button", { name: "引用" });
        const footerActions = document.querySelector(
            ".post-preview-footer-actions",
        );
        const replyGroup = footerActions?.querySelector(
            ":scope > .post-preview-action-buttons-group",
        );
        const repliesSlot = replyGroup?.querySelector(
            ".post-preview-footer-replies-slot",
        );
        const reactionSlot = footerActions?.querySelector(
            ":scope > .post-preview-footer-reaction-slot",
        );

        expect(replyGroup?.contains(replyButton)).toBe(true);
        expect(replyGroup?.contains(quoteButton)).toBe(false);
        expect(repliesSlot?.childElementCount).toBe(0);
        expect(quoteButton.parentElement).toBe(footerActions);
        expect(reactionSlot?.parentElement).toBe(footerActions);
        expect(reactionSlot?.childElementCount).toBe(0);

        await openActionMenu();
        expect(document.querySelector(".post-history-menu-timestamp")?.textContent)
            .toBeTruthy();
        expect(screen.getByRole("menuitem", { name: "イベントJSONを表示" }))
            .toBeTruthy();
        expect(screen.getByRole("menuitem", { name: "ブロードキャスト" }))
            .toBeTruthy();
        expect(screen.queryByText(/コピー/)).toBeNull();
        expect(screen.queryByText(/返信を確認|返信を表示|返信を隠す/)).toBeNull();

        await fireEvent.click(
            screen.getByRole("menuitem", { name: "イベントJSONを表示" }),
        );
        await vi.runAllTicks();
        const rawJsonDialog = screen.getByRole("dialog", {
            name: "イベントJSON",
        });
        expect(rawJsonDialog.textContent).toContain('"content": "Preview body"');
        expect(screen.getByRole("dialog", { name: "宛先を指定" })).toBeTruthy();
    });

    it("kind 42も投稿履歴と同じ返信・引用・空スロット構造を使用する", async () => {
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(42),
            }),
        });

        await enterNote();

        const footerActions = document.querySelector(
            ".post-preview-footer-actions",
        );
        const replyGroup = footerActions?.querySelector(
            ":scope > .post-preview-action-buttons-group",
        );
        expect(replyGroup?.contains(
            screen.getByRole("button", { name: "リプライ" }),
        )).toBe(true);
        expect(replyGroup?.contains(
            screen.getByRole("button", { name: "引用" }),
        )).toBe(false);
        expect(replyGroup?.querySelector(
            ".post-preview-footer-replies-slot",
        )).toBeTruthy();
        expect(footerActions?.querySelector(
            ":scope > .post-preview-footer-reaction-slot",
        )).toBeTruthy();
    });

    it("一時レコードはrelay由来を推測せずブロードキャストへ渡す", async () => {
        const resolved = resolvedTarget(42);
        resolved.relayHints = ["wss://input-and-fetch.example.com/"];
        resolved.channelContext!.relayHints = ["wss://read-only.example.com/"];
        resolved.channelContext!.channelRelays = ["wss://channel-write.example.com/"];
        resolved.channelQuery!.relayHints = ["wss://query.example.com/"];
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target: resolved }),
        });

        await enterNote();
        await openActionMenu();
        await fireEvent.click(
            screen.getByRole("menuitem", { name: "ブロードキャスト" }),
        );
        await vi.runAllTicks();

        const post = postActionMocks.broadcast.mock.calls[0][0].post;
        expect(post.createdAt).toBe(1);
        expect(post.postedAt).toBe(1_000);
        expect(post.relayHints).toEqual([
            "wss://input-and-fetch.example.com/",
        ]);
        expect(post.acceptedRelays).toEqual([]);
        expect("fetchedRelays" in post).toBe(false);
        expect(post.channelRelayHints).toEqual([
            "wss://channel-write.example.com/",
        ]);
        expect(post.rawEvent).toStrictEqual(resolved.event);
    });

    it("部分解決では日時だけを表示し、完全解決済み未対応kindではメニューだけを表示する", async () => {
        const partial = resolvedTarget(1).event;
        const { unmount } = render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "error",
                reason: "network",
                event: partial,
                authorProfile: null,
            }),
        });

        await enterNote();
        expect(document.querySelector(".post-preview-date")?.textContent).toBeTruthy();
        expect(screen.queryByRole("button", { name: "リプライ" })).toBeNull();
        expect(screen.queryByRole("button", { name: "引用" })).toBeNull();
        expect(screen.queryByRole("button", { name: "アクションを表示" }))
            .toBeNull();

        unmount();
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(7),
            }),
        });
        await enterNote();
        expect(screen.queryByRole("button", { name: /リプライ|引用|投稿する/ }))
            .toBeNull();
        expect(screen.getByRole("button", { name: "アクションを表示" }))
            .toBeTruthy();
    });

    it("削除は自己投稿だけに表示し、キャンセル・送信中・失敗・再試行を扱う", async () => {
        const target = resolvedTarget(1);
        let resolveDeletion: ((value: { success: boolean }) => void) | undefined;
        postActionMocks.requestDeletion.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveDeletion = resolve;
            }),
        );
        const onClose = vi.fn();
        render(ComposerTargetDialog, {
            show: true,
            onClose,
            onApply: vi.fn(() => true),
            pubkeyHex: target.event.pubkey,
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target }),
        });

        await enterNote();
        await openActionMenu();
        await fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));
        let confirmDialog = screen.getByRole("alertdialog");
        await fireEvent.click(within(confirmDialog).getByRole("button", {
            name: "キャンセル",
        }));
        expect(postActionMocks.requestDeletion).not.toHaveBeenCalled();

        await openActionMenu();
        await fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));
        confirmDialog = screen.getByRole("alertdialog");
        const confirmButton = within(confirmDialog).getByRole("button", {
            name: "送信",
        });
        const confirmClick = fireEvent.click(confirmButton);
        void fireEvent.click(confirmButton);
        await vi.runAllTicks();
        expect(postActionMocks.requestDeletion).toHaveBeenCalledTimes(1);
        expect(
            (within(confirmDialog).getByRole("button", {
                name: "送信中",
            }) as HTMLButtonElement).disabled,
        ).toBe(true);

        resolveDeletion?.({ success: false });
        await confirmClick;
        await vi.runAllTicks();
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole("alertdialog").getAttribute("data-state"))
            .toBe("closed");
        expect(screen.getByText("削除リクエストの送信に失敗しました"))
            .toBeTruthy();

        postActionMocks.requestDeletion.mockResolvedValueOnce({
            success: true,
            deletedAt: 2,
            deletionEventId: "8".repeat(64),
        });
        await openActionMenu();
        expect(
            screen.getByRole("menuitem", { name: "削除" }).hasAttribute(
                "data-disabled",
            ),
        ).toBe(false);
        await fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));
        await fireEvent.click(
            within(screen.getByRole("alertdialog")).getByRole("button", {
                name: "送信",
            }),
        );
        await vi.runAllTicks();
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("他人の投稿では削除を表示せず、入力変更後の古い送信結果を反映しない", async () => {
        let resolveBroadcast: ((value: { success: boolean }) => void) | undefined;
        postActionMocks.broadcast.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveBroadcast = resolve;
            }),
        );
        render(ComposerTargetDialog, {
            show: true,
            onClose: vi.fn(),
            onApply: vi.fn(() => true),
            pubkeyHex: "f".repeat(64),
            rxNostr: {} as never,
            resolver: createResolver({
                status: "resolved",
                target: resolvedTarget(1),
            }),
        });

        await enterNote();
        await openActionMenu();
        expect(screen.queryByRole("menuitem", { name: "削除" })).toBeNull();
        void fireEvent.click(
            screen.getByRole("menuitem", { name: "ブロードキャスト" }),
        );
        await fireEvent.input(screen.getByLabelText("Nostrイベント"), {
            target: { value: nip19.noteEncode("5".repeat(64)) },
        });
        await vi.advanceTimersByTimeAsync(250);
        resolveBroadcast?.({ success: false });
        await vi.runAllTicks();

        expect(screen.queryByText("ブロードキャストに失敗しました")).toBeNull();
        expect(screen.getByRole("button", { name: "リプライ" })).toBeTruthy();
    });

    it("入力変更後に完了した古い削除結果では親ダイアログを閉じない", async () => {
        const target = resolvedTarget(1);
        let resolveDeletion:
            | ((value: {
                  success: boolean;
                  deletedAt: number;
                  deletionEventId: string;
              }) => void)
            | undefined;
        postActionMocks.requestDeletion.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveDeletion = resolve;
            }),
        );
        const onClose = vi.fn();
        render(ComposerTargetDialog, {
            show: true,
            onClose,
            onApply: vi.fn(() => true),
            pubkeyHex: target.event.pubkey,
            rxNostr: {} as never,
            resolver: createResolver({ status: "resolved", target }),
        });

        await enterNote();
        await openActionMenu();
        await fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));
        const confirmClick = fireEvent.click(
            within(screen.getByRole("alertdialog")).getByRole("button", {
                name: "送信",
            }),
        );
        await fireEvent.input(screen.getByLabelText("Nostrイベント"), {
            target: { value: nip19.noteEncode("6".repeat(64)) },
        });
        await vi.advanceTimersByTimeAsync(250);
        resolveDeletion?.({
            success: true,
            deletedAt: 2,
            deletionEventId: "8".repeat(64),
        });
        await confirmClick;
        await vi.runAllTicks();

        expect(onClose).not.toHaveBeenCalled();
        expect(screen.queryByText("削除リクエストの送信に失敗しました"))
            .toBeNull();
        expect(screen.getByRole("button", { name: "リプライ" })).toBeTruthy();
    });

    it("通信失敗は再試行でき、閉じる時に進行中taskと入力を破棄する", async () => {
        const cancel = vi.fn();
        const resolver = {
            resolve: vi.fn()
                .mockReturnValueOnce({
                    promise: Promise.resolve({
                        status: "error",
                        reason: "timeout",
                    }),
                    cancel,
                })
                .mockReturnValueOnce({
                    promise: new Promise<ComposerTargetResolveResult>(() => undefined),
                    cancel,
                }),
        };
        const onClose = vi.fn();
        render(ComposerTargetDialog, {
            show: true,
            onClose,
            onApply: vi.fn(() => true),
            rxNostr: {} as never,
            resolver,
        });

        await enterNote();
        await fireEvent.click(screen.getByRole("button", { name: "再試行" }));
        await vi.advanceTimersByTimeAsync(250);
        expect(resolver.resolve).toHaveBeenCalledTimes(2);

        await fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
        expect(cancel).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.queryByLabelText("Nostrイベント")).toBeNull();
    });
});
