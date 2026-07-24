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
    "postHistory.contextRetry": "再試行",
    "global.close": "閉じる",
};

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => translations[key] ?? key),
}));

function resolvedTarget(
    kind: number,
    channelName: string | null = "General",
): ComposerResolvedTarget {
    const channel = kind === 40 || kind === 42;
    return {
        event: {
            id: "1".repeat(64),
            pubkey: "2".repeat(64),
            created_at: 1,
            kind,
            tags: [],
            content: kind === 40
                ? JSON.stringify({ name: "General", about: "Channel" })
                : "Preview body",
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
        expect((screen.getByLabelText("Nostrイベント") as HTMLInputElement).value)
            .toBe("");
    });
});
