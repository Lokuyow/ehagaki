import { fireEvent, render, screen } from "@testing-library/svelte";
import { nip19 } from "nostr-tools";
import { readable } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ComposerTargetDialog from "../../components/ComposerTargetDialog.svelte";
import type {
    ComposerResolvedTarget,
    ComposerTargetResolveResult,
} from "../../lib/composerTargetResolver";

const translations: Record<string, string> = {
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
    "composerTarget.channelUnavailable": "チャンネルを確認できませんでした。",
    "composerTarget.preview": "イベントのプレビュー",
    "composerTarget.creator": "作成者",
    "postHistory.expand": "もっと見る",
    "postHistory.collapse": "折りたたむ",
    "postHistory.contextRetry": "再試行",
    "global.close": "閉じる",
};

const customEmojiMock = vi.hoisted(() => ({
    preloadCustomEmojiImageWithMeta: vi.fn(),
}));

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => translations[key] ?? key),
}));

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

describe("ComposerTargetDialog", () => {
    beforeEach(() => {
        vi.useFakeTimers();
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
        expect(screen.getByRole("button", { name: "返信する" })).not.toBeNull();
        expect(screen.getByRole("button", { name: "引用する" })).not.toBeNull();
        expect(onApply).not.toHaveBeenCalled();
    });

    it.each([
        [1, ["返信する", "引用する"]],
        [40, ["投稿する"]],
        [42, ["返信する", "引用する"]],
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
            name: /^(返信する|引用する|投稿する)$/,
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
        expect(screen.queryByRole("button", { name: "返信する" }))
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

        await fireEvent.click(expandButton);

        expect(screen.getByText(hiddenText)).toBeTruthy();
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
