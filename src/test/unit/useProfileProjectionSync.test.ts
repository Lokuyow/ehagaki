import { flushSync } from "svelte";
import { describe, expect, it, vi } from "vitest";

import { createProfileProjectionSyncHookHarness } from "../helpers/profileProjectionSyncHookHarness.svelte";
import type { ProfileData } from "../../lib/types";

const PROFILE_A: ProfileData = {
    name: "alice",
    displayName: "Alice",
    picture: "https://example.com/alice.png",
    npub: "npub-alice",
    nprofile: "nprofile-alice",
};

const PROFILE_B: ProfileData = {
    name: "bob",
    displayName: "Bob",
    picture: "https://example.com/bob.png",
    npub: "npub-bob",
    nprofile: "nprofile-bob",
};

describe("useProfileProjectionSync", () => {
    it("current profile and account projectionをcache通知から更新する", () => {
        const applyCurrentProfile = vi.fn();
        const applyAccountProfile = vi.fn();
        let callback: ((pubkeyHex: string, profile: ProfileData | null) => void) | undefined;
        const unsubscribe = vi.fn();
        const service = {
            subscribeProfiles: vi.fn((_pubkeys, next) => {
                callback = next;
                return unsubscribe;
            }),
        } as never;
        const harness = createProfileProjectionSyncHookHarness({
            applyCurrentProfile,
            applyAccountProfile,
        });

        flushSync(() => {
            harness.setCurrentPubkey("alice");
            harness.setAccountPubkeys(["alice", "alice", "bob"]);
            harness.setService(service);
        });

        expect((service as any).subscribeProfiles).toHaveBeenCalledWith(
            ["alice", "bob"],
            expect.any(Function),
        );

        callback?.("alice", PROFILE_A);
        expect(applyAccountProfile).toHaveBeenCalledWith("alice", PROFILE_A);
        expect(applyCurrentProfile).toHaveBeenCalledWith(PROFILE_A);

        callback?.("bob", PROFILE_B);
        expect(applyAccountProfile).toHaveBeenCalledWith("bob", PROFILE_B);
        expect(applyCurrentProfile).toHaveBeenCalledTimes(1);

        harness.dispose();
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("service/account変更後のstale callbackを無視する", () => {
        const applyCurrentProfile = vi.fn();
        const applyAccountProfile = vi.fn();
        const callbacks: Array<(pubkeyHex: string, profile: ProfileData | null) => void> = [];
        const unsubscribes = [vi.fn(), vi.fn()];
        const services = [
            {
                subscribeProfiles: vi.fn((_pubkeys, next) => {
                    callbacks.push(next);
                    return unsubscribes[0];
                }),
            },
            {
                subscribeProfiles: vi.fn((_pubkeys, next) => {
                    callbacks.push(next);
                    return unsubscribes[1];
                }),
            },
        ] as never[];
        const harness = createProfileProjectionSyncHookHarness({
            applyCurrentProfile,
            applyAccountProfile,
        });

        flushSync(() => {
            harness.setCurrentPubkey("alice");
            harness.setAccountPubkeys(["alice", "bob"]);
            harness.setService(services[0]);
        });
        flushSync(() => harness.setService(services[1]));

        callbacks[0]("alice", PROFILE_A);
        expect(applyCurrentProfile).not.toHaveBeenCalled();
        expect(applyAccountProfile).not.toHaveBeenCalled();

        callbacks[1]("alice", PROFILE_A);
        expect(applyCurrentProfile).toHaveBeenCalledWith(PROFILE_A);
        expect(unsubscribes[0]).toHaveBeenCalledOnce();

        flushSync(() => {
            harness.setAccountPubkeys(["alice", "carol"]);
        });
        callbacks[1]("bob", PROFILE_B);
        expect(applyAccountProfile).toHaveBeenCalledTimes(1);

        harness.dispose();
        expect(unsubscribes[1]).toHaveBeenCalledTimes(2);
    });

    it("null通知やlogout後の通知で既存projectionを消さない", () => {
        const applyCurrentProfile = vi.fn();
        const applyAccountProfile = vi.fn();
        let callback: ((pubkeyHex: string, profile: ProfileData | null) => void) | undefined;
        const service = {
            subscribeProfiles: vi.fn((_pubkeys, next) => {
                callback = next;
                return vi.fn();
            }),
        } as never;
        const harness = createProfileProjectionSyncHookHarness({
            applyCurrentProfile,
            applyAccountProfile,
        });

        flushSync(() => {
            harness.setCurrentPubkey("alice");
            harness.setAccountPubkeys(["alice"]);
            harness.setService(service);
        });
        callback?.("alice", null);
        expect(applyCurrentProfile).not.toHaveBeenCalled();
        expect(applyAccountProfile).not.toHaveBeenCalled();

        flushSync(() => {
            harness.setCurrentPubkey(null);
            harness.setAccountPubkeys([]);
        });
        callback?.("alice", PROFILE_A);
        expect(applyCurrentProfile).not.toHaveBeenCalled();
        expect(applyAccountProfile).not.toHaveBeenCalled();

        harness.dispose();
    });
});
