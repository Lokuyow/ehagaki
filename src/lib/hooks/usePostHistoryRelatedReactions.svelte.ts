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
    let generation = 0;
    const fetchedEventIds = new Set<string>();
    const inFlightEventIds = new Set<string>();
    type RepairTask = ReturnType<
        typeof postHistoryVisibleRangeChildInteractionRepairService.repairRelatedCardReactions
    >;
    let repairTask: RepairTask | null = null;

    const unsubscribeProfiles = params.profileSync.subscribe((pubkey, profile) => {
        profilesByPubkey = { ...profilesByPubkey, [pubkey]: profile };
    });
    onDestroy(() => {
        generation += 1;
        repairTask?.cancel();
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
        const targets = params.getTargets();
        if (!show) {
            generation += 1;
            repairTask?.cancel();
            repairTask = null;
            fetchedEventIds.clear();
            inFlightEventIds.clear();
            recordsByEventId = {};
            loadedEventIds = {};
            return;
        }
        const currentGeneration = ++generation;
        let active = true;
        let requestedTargets: PostHistoryRelatedReactionCardTarget[] = [];
        let localRepairTask: RepairTask | null = null;
        const isActive = () => active
            && currentGeneration === generation
            && params.getShow()
            && (params.getPubkeyHex() ?? "") === pubkey
            && params.getRxNostr() === rxNostr;
        const uniqueTargets = Array.from(new Map(
            targets
                .filter((target) => target.eventId)
                .map((target) => [target.eventId, target]),
        ).values());
        const eventIds = uniqueTargets.map((target) => target.eventId);

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
                relayConfig: params.getRelayConfig(),
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
                !fetchedEventIds.has(target.eventId)
                && !inFlightEventIds.has(target.eventId),
            );
            if (!toFetch.length) {
                return;
            }
            requestedTargets = toFetch;
            toFetch.forEach((target) => inFlightEventIds.add(target.eventId));
            localRepairTask = postHistoryVisibleRangeChildInteractionRepairService
                .repairRelatedCardReactions(rxNostr, {
                targets: toFetch,
                relayConfig: params.getRelayConfig(),
                isActive,
            });
            repairTask = localRepairTask;
            const repairResult = await localRepairTask.promise;
            if (repairTask === localRepairTask) {
                repairTask = null;
            }
            localRepairTask = null;
            toFetch.forEach((target) => inFlightEventIds.delete(target.eventId));
            if (!isActive() || repairResult.status === "cancelled") {
                return;
            }

            repairResult.targetEventIds.forEach((eventId) => fetchedEventIds.add(eventId));
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
                relayConfig: params.getRelayConfig(),
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
            requestedTargets.forEach((target) => inFlightEventIds.delete(target.eventId));
            localRepairTask?.cancel();
            if (repairTask === localRepairTask) {
                repairTask = null;
            }
        };
    });

    return { getReadModel, isLoaded };
}
