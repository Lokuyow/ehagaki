import { cleanup, render, screen } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PostRepostResult } from "../../lib/postRepostService";
import PostRepostFeedback from "../../components/PostRepostFeedback.svelte";

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => ({
        "repost.sending": "リポスト送信中…",
        "repost.sent": "リポストしました",
        "repost.failed": "リポストできませんでした",
        "repost.relayMissing": "元投稿の取得先リレーを確認できませんでした",
        "repost.saveFailed": "リポストは送信済みですが、履歴を保存できませんでした",
        "repost.retrySave": "再保存",
    })[key] ?? key),
}));

afterEach(cleanup);

describe("PostRepostFeedback", () => {
    it("shows a top-right success toast without relay partial-failure detail", () => {
        const result: PostRepostResult = {
            success: true,
            rejectedRelays: [{ relay: "wss://relay.example.com", category: "error" }],
            timedOutRelays: ["wss://slow-relay.example.com"],
        };

        render(PostRepostFeedback, { props: { result } });

        expect(screen.getByRole("status").classList.contains("top-right")).toBe(true);
        expect(screen.getByText("リポストしました")).toBeTruthy();
        expect(screen.queryByText(/一部のリレー/)).toBeNull();
    });
});
