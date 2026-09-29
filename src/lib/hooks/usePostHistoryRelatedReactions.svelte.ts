import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import type { PostHistoryProfileSyncCoordinator } from "../postHistoryProfileSync";
import {
    buildPostHistoryReactionReadModel,
    type PostHistoryReactionReadModel,
} from "../postHistoryReactionReadModel";
import { postHistoryReactionRecordsAdapter } from "../postHistoryChildInteractionsAdapter";
import {
    postHistoryVisibleRangeChildInteractionRepairService,
    type PostHistoryRelatedReactionTarget,
} from "../postHistoryVisibleRangeChildInteractionRepairService";
import { triggerPostHistoryReactionLifecycle } from "../postHistoryReactionLifecycleTrigger";
import type { ProfileData, RelayConfig } from "../types";
import type { PostHistoryChildInteractionRecord } from "../storage/ehagakiDb";

export interface PostHistoryRelatedReactionCardTarget extends PostHistoryRelatedReactionTarget {}

export function usePostHistoryRelatedReactions(params: {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getTargets: () => PostHistoryRelatedReactionCardTarget[];
    profileSync: PostHistoryProfileSyncCoordinator;
}) {
    let recordsByEventId = $state.raw<
        Record<string, PostHistoryChildInteractionRecord[]>
    >({});
    let profilesByPubkey = $state.raw<Record<string, ProfileData | null>>({});
    let loadedEventIds = $state.raw<Record<string, true>>({});
    let retryRevision = $state(0);
    let generation = 0;
    const completedFetchKeys = new Set<string>();
    const inFlightEventIds = new Set<string>();
    const latestAttemptKeys = new Map<string, string>();
    type RepairTask = ReturnType<
        typeof postHistoryVisibleRangeChildInteractionRepairService.repairRelatedCardReactions
    >;
    let repairTask: RepairTask | null = null;

    const unsubscribeProfiles = params.profileSync.subscribe((pubkey, profile) => {
        profilesByPubkey = { ...profilesByPubkey, [pubkey]: profile };
    });
    const retryWhenOnline = () => {
        retryRevision += 1;
    };
    const retryWhenVisible = () => {
        if (document.visibilityState === "visible") retryRevision += 1;
    };
    if (typeof window !== "undefined") {
        window.addEventListener("online", retryWhenOnline);
        document.addEventListener("visibilitychange", retryWhenVisible);
    }
    onDestroy(() => {
        generation += 1;
        repairTask?.cancel();
        if (typeof window !== "undefined") {
            window.removeEventListener("online", retryWhenOnline);
            document.removeEventListener("visibilitychange", retryWhenVisible);
        }
        unsubscribeProfiles();
    });

    function getReadModel(eventId: string): PostHistoryReactionReadModel | null {
        if (!loadedEventIds[eventId]) {
            return null;
        }

        return buildPostHistoryReactionReadModel(
            recordsByEventId[eventId] ?? [],
            profilesByPubkey,
        );
    }

    function isLoaded(eventId: string): boolean {
        return !!loadedEventIds[eventId];
    }

    $effect(() => {
        const show = params.getShow();
        const pubkey = params.getPubkeyHex() ?? "";
        const rxNostr = params.getRxNostr();
        const relayConfig = params.getRelayConfig();
        const targets = params.getTargets();
        const currentRetryRevision = retryRevision;
        if (!show) {
            generation += 1;
            repairTask?.cancel();
            repairTask = null;
            completedFetchKeys.clear();
            latestAttemptKeys.clear();
            recordsByEventId = {};
            loadedEventIds = {};
            return;
        }
        const currentGeneration = ++generation;
        let active = true;
        let localRepairTask: RepairTask | null = null;
        const isActive = () => active
            && currentGeneration === generation
            && params.getShow()
            && (params.getPubkeyHex() ?? "") === pubkey
            && params.getRxNostr() === rxNostr;
        const targetsByEventId = new Map<string, PostHistoryRelatedReactionCardTarget>();
        for (const target of targets) {
            if (!target.eventId) continue;
            const current = targetsByEventId.get(target.eventId);
            targetsByEventId.set(target.eventId, {
                eventId: target.eventId,
                relayHints: Array.from(new Set([
                    ...(current?.relayHints ?? []),
                    ...target.relayHints,
                ])).sort(),
            });
        }
        const uniqueTargets = Array.from(targetsByEventId.values());
        const eventIds = uniqueTargets.map((target) => target.eventId);
        const relayConfigKey = JSON.stringify(
            Object.entries(relayConfig ?? {}).sort(([left], [right]) => left.localeCompare(right)),
        );
        const completedFetchKeyFor = (target: PostHistoryRelatedReactionCardTarget) =>
            JSON.stringify([target.eventId, target.relayHints, relayConfigKey]);
        const attemptKeyFor = (target: PostHistoryRelatedReactionCardTarget) =>
            JSON.stringify([completedFetchKeyFor(target), currentRetryRevision]);
        const currentTargetIds = new Set(uniqueTargets.map((target) => target.eventId));
        for (const eventId of latestAttemptKeys.keys()) {
            if (!currentTargetIds.has(eventId)) latestAttemptKeys.delete(eventId);
        }
        uniqueTargets.forEach((target) =>
            latestAttemptKeys.set(target.eventId, attemptKeyFor(target)),
        );

        void (async () => {
            const cachedRecords = await postHistoryReactionRecordsAdapter
                .getReactionRecordsForParents?.(eventIds)
                ?? (await Promise.all(eventIds.map((eventId) =>
                    postHistoryReactionRecordsAdapter.getReactionRecords(eventId),
                ))).flat();
            if (!isActive()) {
                return;
            }

            const nextRecords: typeof recordsByEventId = {};
            for (const eventId of eventIds) {
                nextRecords[eventId] = cachedRecords.filter(
                    (record) => record.parentEventId === eventId,
                );
            }
            recordsByEventId = { ...recordsByEventId, ...nextRecords };
            loadedEventIds = {
                ...loadedEventIds,
                ...Object.fromEntries(eventIds.map((eventId) => [eventId, true])),
            };
            for (const record of cachedRecords) {
                const profile = params.profileSync.ensureProfile(record.authorPubkey, record.relayUrls);
                if (profile) profilesByPubkey = { ...profilesByPubkey, [record.authorPubkey]: profile };
            }
            if (!rxNostr || eventIds.length === 0) {
                return;
            }

            await triggerPostHistoryReactionLifecycle({
                source: "related-card-display",
                parentEventIds: eventIds,
                rxNostr,
                relayConfig,
                isActive,
            });
            if (!isActive()) {
                return;
            }
            const postDeletionCache = await postHistoryReactionRecordsAdapter
                .getReactionRecordsForParents?.(eventIds)
                ?? (await Promise.all(eventIds.map((eventId) =>
                    postHistoryReactionRecordsAdapter.getReactionRecords(eventId),
                ))).flat();
            if (!isActive()) {
                return;
            }
            for (const eventId of eventIds) {
                nextRecords[eventId] = postDeletionCache.filter(
                    (record) => record.parentEventId === eventId,
                );
            }
            recordsByEventId = { ...recordsByEventId, ...nextRecords };
            const toFetch = uniqueTargets.filter((target) =>
                !completedFetchKeys.has(completedFetchKeyFor(target))
                && !inFlightEventIds.has(target.eventId),
            );
            if (!toFetch.length) {
                return;
            }
            toFetch.forEach((target) => inFlightEventIds.add(target.eventId));
            const attemptKeys = new Map(toFetch.map((target) => [
                target.eventId,
                attemptKeyFor(target),
            ]));
            localRepairTask = postHistoryVisibleRangeChildInteractionRepairService
                .repairRelatedCardReactions(rxNostr, {
                targets: toFetch,
                relayConfig,
                isActive,
            });
            repairTask = localRepairTask;
            const repairResult = await localRepairTask.promise.catch(() => ({
                status: "partial" as const,
                targetEventIds: toFetch.map((target) => target.eventId),
            }));
            if (repairTask === localRepairTask) {
                repairTask = null;
            }
            localRepairTask = null;
            toFetch.forEach((target) => inFlightEventIds.delete(target.eventId));
            const currentSession = params.getShow()
                && (params.getPubkeyHex() ?? "") === pubkey
                && params.getRxNostr() === rxNostr;
            const needsRestart = toFetch.some((target) => {
                const latestAttemptKey = latestAttemptKeys.get(target.eventId);
                return latestAttemptKey !== undefined
                    && (repairResult.status === "cancelled"
                        || latestAttemptKey !== attemptKeys.get(target.eventId));
            });
            if (currentSession && needsRestart) {
                retryRevision += 1;
            }
            if (!isActive() || repairResult.status === "cancelled") {
                return;
            }

            if (repairResult.status === "success") {
                const fetchedTargetIds = new Set(repairResult.targetEventIds);
                toFetch
                    .filter((target) => fetchedTargetIds.has(target.eventId))
                    .forEach((target) =>
                        completedFetchKeys.add(completedFetchKeyFor(target)),
                    );
            }
            const refreshed = await postHistoryReactionRecordsAdapter
                .getReactionRecordsForParents?.(eventIds)
                ?? (await Promise.all(eventIds.map((eventId) =>
                    postHistoryReactionRecordsAdapter.getReactionRecords(eventId),
                ))).flat();
            if (!isActive()) {
                return;
            }
            for (const eventId of eventIds) {
                nextRecords[eventId] = refreshed.filter(
                    (record) => record.parentEventId === eventId,
                );
            }
            recordsByEventId = { ...recordsByEventId, ...nextRecords };
            for (const record of refreshed) {
                const profile = params.profileSync.ensureProfile(record.authorPubkey, record.relayUrls);
                if (profile) profilesByPubkey = { ...profilesByPubkey, [record.authorPubkey]: profile };
            }
            const finalDeletionResult = await triggerPostHistoryReactionLifecycle({
                source: "related-card-display",
                parentEventIds: eventIds,
                rxNostr,
                relayConfig,
                isActive,
            });
            if (!isActive()) {
                return;
            }
            if (finalDeletionResult.deletedReactionEventIds.length > 0) {
                const afterDeletion = await postHistoryReactionRecordsAdapter
                    .getReactionRecordsForParents?.(eventIds)
                    ?? (await Promise.all(eventIds.map((eventId) =>
                        postHistoryReactionRecordsAdapter.getReactionRecords(eventId),
                    ))).flat();
                if (!isActive()) {
                    return;
                }
                for (const eventId of eventIds) {
                    nextRecords[eventId] = afterDeletion.filter(
                        (record) => record.parentEventId === eventId,
                    );
                }
                recordsByEventId = { ...recordsByEventId, ...nextRecords };
            }
        })().catch(() => undefined);
        return () => {
            active = false;
            localRepairTask?.cancel();
            if (repairTask === localRepairTask) {
                repairTask = null;
            }
        };
    });

    return { getReadModel, isLoaded };
}
