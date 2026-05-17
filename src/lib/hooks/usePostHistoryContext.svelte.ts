import type { RxNostr } from "rx-nostr";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
    type PostHistoryContextFetchTask,
} from "../postHistoryContextFetchService";
import {
    parseKind1ThreadReferences,
    type PostHistoryThreadReferences,
} from "../postHistoryNip10Utils";
import { RelayConfigUtils } from "../relayConfigUtils";
import { ProfileManager } from "../profileManager";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import {
    profilesRepository,
    type ProfilesRepository,
} from "../storage/profilesRepository";
import {
    cloneNostrEvent,
    isSignedNostrEvent,
} from "../postHistoryEventUtils";

export type PostHistoryContextTargetKind = "reply" | "root";
export type PostHistoryContextTargetStatus =
    | "unloaded"
    | "loading"
    | "loaded"
    | "missing"
    | "failed";

export interface PostHistoryContextTargetState {
    eventId: string;
    status: PostHistoryContextTargetStatus;
    visible: boolean;
    showLoadingIndicator: boolean;
    event: NostrEvent | null;
    profile: ProfileData | null;
    relayUrl: string | null;
    error: string | null;
}

export interface PostHistoryContextItemState {
    references: PostHistoryThreadReferences;
    reply: PostHistoryContextTargetState | null;
    root: PostHistoryContextTargetState | null;
}

interface LoadPostHistoryContextTargetOptions {
    force?: boolean;
}

interface UsePostHistoryContextParams {
    getShow: () => boolean;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    postHistoryRepositoryImpl?: Pick<PostHistoryRepository, "getByEventId">;
    profilesRepositoryImpl?: Pick<ProfilesRepository, "get">;
    contextFetchService?: Pick<PostHistoryContextFetchService, "fetchEventById">;
}

function toEventFromRecord(record: PostHistoryRecord): NostrEvent {
    if (isSignedNostrEvent(record.rawEvent)) {
        return cloneNostrEvent(record.rawEvent);
    }

    return {
        id: record.eventId,
        pubkey: record.pubkeyHex,
        kind: record.kind,
        content: record.content,
        tags: record.tags.map((tag) => [...tag]),
        created_at: record.createdAt,
        sig: "",
    };
}

function buildInitialTargetState(eventId: string): PostHistoryContextTargetState {
    return {
        eventId,
        status: "unloaded",
        visible: false,
        showLoadingIndicator: false,
        event: null,
        profile: null,
        relayUrl: null,
        error: null,
    };
}

function buildRelayHintsForTarget(
    post: PostHistoryRecord,
    references: PostHistoryThreadReferences,
    kind: PostHistoryContextTargetKind,
): string[] {
    const markerRelayHint = kind === "reply"
        ? references.replyRelayHint ?? references.rootRelayHint
        : references.rootRelayHint;

    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(markerRelayHint ? [markerRelayHint] : []),
        ...references.relayHints,
        ...post.relayHints,
        ...post.acceptedRelays,
        ...(post.fetchedRelays ?? []),
    ], { limit: 8 });
}

function buildContextState(post: PostHistoryRecord): PostHistoryContextItemState {
    const references = parseKind1ThreadReferences(toEventFromRecord(post));
    const reply = references.parentId
        ? buildInitialTargetState(references.parentId)
        : null;
    const root = references.rootId && references.rootId !== references.parentId
        ? buildInitialTargetState(references.rootId)
        : null;

    return { references, reply, root };
}

export function usePostHistoryContext({
    getShow,
    getRxNostr,
    getRelayConfig,
    postHistoryRepositoryImpl = postHistoryRepository,
    profilesRepositoryImpl = profilesRepository,
    contextFetchService = postHistoryContextFetchService,
}: UsePostHistoryContextParams) {
    let stateByPostId = $state.raw<Record<string, PostHistoryContextItemState>>({});
    let requestId = 0;
    const tasksByKey = new Map<string, PostHistoryContextFetchTask>();
    const loadingDelayTimersByKey = new Map<string, ReturnType<typeof setTimeout>>();

    function getTargetKey(
        postEventId: string,
        kind: PostHistoryContextTargetKind,
    ): string {
        return `${postEventId}:${kind}`;
    }

    function clearLoadingDelayTimer(key: string): void {
        const timer = loadingDelayTimersByKey.get(key);
        if (!timer) {
            return;
        }

        clearTimeout(timer);
        loadingDelayTimersByKey.delete(key);
    }

    function clearAllLoadingDelayTimers(): void {
        loadingDelayTimersByKey.forEach((timer) => clearTimeout(timer));
        loadingDelayTimersByKey.clear();
    }

    function getCurrentTargetState(
        postEventId: string,
        kind: PostHistoryContextTargetKind,
    ): PostHistoryContextTargetState | null {
        const context = stateByPostId[postEventId];
        if (!context) {
            return null;
        }

        return kind === "reply" ? context.reply : context.root;
    }

    function cancelCurrentContextFetches(): void {
        tasksByKey.forEach((task) => task.cancel());
        tasksByKey.clear();
        clearAllLoadingDelayTimers();
    }

    function resetState(): void {
        cancelCurrentContextFetches();
        requestId += 1;
        stateByPostId = {};
    }

    function getContextState(post: PostHistoryRecord): PostHistoryContextItemState {
        return stateByPostId[post.eventId] ?? buildContextState(post);
    }

    async function resolveProfile(
        event: NostrEvent,
        additionalRelays: string[] = [],
    ): Promise<ProfileData | null> {
        try {
            const cachedProfile = await profilesRepositoryImpl.get(event.pubkey);
            if (cachedProfile) {
                return cachedProfile;
            }
        } catch {
            // Fall through to the network path when available.
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            return null;
        }

        try {
            const profileManager = new ProfileManager(rxNostr as never);
            return await profileManager.fetchProfileData(event.pubkey, {
                additionalRelays,
                forceRemote: false,
            });
        } catch {
            return null;
        }
    }

    function updateTargetState(
        postEventId: string,
        kind: PostHistoryContextTargetKind,
        targetState: PostHistoryContextTargetState,
    ): void {
        const currentContext = stateByPostId[postEventId];
        if (!currentContext) {
            return;
        }

        stateByPostId = {
            ...stateByPostId,
            [postEventId]: {
                ...currentContext,
                [kind]: targetState,
            },
        };
    }

    function scheduleLoadingIndicator(
        postEventId: string,
        kind: PostHistoryContextTargetKind,
    ): void {
        const key = getTargetKey(postEventId, kind);
        clearLoadingDelayTimer(key);

        const timer = setTimeout(() => {
            loadingDelayTimersByKey.delete(key);
            const target = getCurrentTargetState(postEventId, kind);
            if (!target || target.status !== "loading" || !target.visible) {
                return;
            }

            updateTargetState(postEventId, kind, {
                ...target,
                showLoadingIndicator: true,
            });
        }, 400);

        loadingDelayTimersByKey.set(key, timer);
    }

    async function loadTarget(
        post: PostHistoryRecord,
        kind: PostHistoryContextTargetKind,
        options: LoadPostHistoryContextTargetOptions = {},
    ): Promise<void> {
        const context = getContextState(post);
        const target = kind === "reply" ? context.reply : context.root;
        if (!target) {
            return;
        }

        if (!stateByPostId[post.eventId]) {
            stateByPostId = {
                ...stateByPostId,
                [post.eventId]: context,
            };
        }

        if (target.status === "loading") {
            updateTargetState(post.eventId, kind, {
                ...target,
                visible: true,
                showLoadingIndicator: false,
            });
            scheduleLoadingIndicator(post.eventId, kind);
            return;
        }

        if (!options.force && target.status !== "unloaded") {
            clearLoadingDelayTimer(getTargetKey(post.eventId, kind));
            updateTargetState(post.eventId, kind, {
                ...target,
                visible: true,
                showLoadingIndicator: false,
            });
            return;
        }

        const activeRequestId = ++requestId;
        const targetKey = getTargetKey(post.eventId, kind);
        const loadingState: PostHistoryContextTargetState = {
            ...target,
            status: "loading",
            visible: true,
            showLoadingIndicator: false,
            error: null,
        };
        updateTargetState(post.eventId, kind, loadingState);
        scheduleLoadingIndicator(post.eventId, kind);

        const existingRecord = await postHistoryRepositoryImpl.getByEventId(target.eventId);
        if (activeRequestId !== requestId || !getShow()) {
            clearLoadingDelayTimer(targetKey);
            return;
        }

        if (existingRecord) {
            const event = toEventFromRecord(existingRecord);
            const relayHints = buildRelayHintsForTarget(post, context.references, kind);
            const profile = await resolveProfile(event, relayHints);
            if (activeRequestId !== requestId || !getShow()) {
                clearLoadingDelayTimer(targetKey);
                return;
            }
            clearLoadingDelayTimer(targetKey);
            const currentTarget = getCurrentTargetState(post.eventId, kind) ?? target;
            updateTargetState(post.eventId, kind, {
                ...currentTarget,
                status: "loaded",
                showLoadingIndicator: false,
                event,
                profile,
                relayUrl: null,
                error: null,
            });
            return;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            clearLoadingDelayTimer(targetKey);
            const currentTarget = getCurrentTargetState(post.eventId, kind) ?? target;
            updateTargetState(post.eventId, kind, {
                ...currentTarget,
                status: "failed",
                showLoadingIndicator: false,
                event: null,
                profile: null,
                relayUrl: null,
                error: "nostr_not_ready",
            });
            return;
        }

        const taskKey = getTargetKey(post.eventId, kind);
        tasksByKey.get(taskKey)?.cancel();
        const task = contextFetchService.fetchEventById(rxNostr, {
            eventId: target.eventId,
            relayHints: buildRelayHintsForTarget(post, context.references, kind),
            relayConfig: getRelayConfig(),
        });
        tasksByKey.set(taskKey, task);

        const result = await task.promise;
        tasksByKey.delete(taskKey);
        if (activeRequestId !== requestId || !getShow()) {
            clearLoadingDelayTimer(targetKey);
            return;
        }

        if (!result.event) {
            clearLoadingDelayTimer(targetKey);
            const currentTarget = getCurrentTargetState(post.eventId, kind) ?? target;
            updateTargetState(post.eventId, kind, {
                ...currentTarget,
                status: "missing",
                showLoadingIndicator: false,
                event: null,
                profile: null,
                relayUrl: null,
                error: null,
            });
            return;
        }

        clearLoadingDelayTimer(targetKey);
        const profile = await resolveProfile(
            result.event,
            buildRelayHintsForTarget(post, context.references, kind),
        );
        if (activeRequestId !== requestId || !getShow()) {
            clearLoadingDelayTimer(targetKey);
            return;
        }
        const currentTarget = getCurrentTargetState(post.eventId, kind) ?? target;
        updateTargetState(post.eventId, kind, {
            ...currentTarget,
            status: "loaded",
            showLoadingIndicator: false,
            event: result.event,
            profile,
            relayUrl: result.relayUrl,
            error: null,
        });
    }

    function hideTarget(
        post: PostHistoryRecord,
        kind: PostHistoryContextTargetKind,
    ): void {
        const context = getContextState(post);
        const target = kind === "reply" ? context.reply : context.root;
        if (!target) {
            return;
        }

        if (!stateByPostId[post.eventId]) {
            stateByPostId = {
                ...stateByPostId,
                [post.eventId]: context,
            };
        }

        clearLoadingDelayTimer(getTargetKey(post.eventId, kind));
        updateTargetState(post.eventId, kind, {
            ...target,
            visible: false,
            showLoadingIndicator: false,
        });
    }

    function toggleTarget(
        post: PostHistoryRecord,
        kind: PostHistoryContextTargetKind,
    ): void {
        const context = getContextState(post);
        const target = kind === "reply" ? context.reply : context.root;
        if (!target) {
            return;
        }

        if (target.visible) {
            hideTarget(post, kind);
            return;
        }

        void loadTarget(post, kind);
    }

    function retryTarget(
        post: PostHistoryRecord,
        kind: PostHistoryContextTargetKind,
    ): void {
        void loadTarget(post, kind, { force: true });
    }

    $effect(() => {
        if (!getShow()) {
            resetState();
        }
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        return () => {
            cancelCurrentContextFetches();
        };
    });

    return {
        getContextState,
        loadTarget,
        toggleTarget,
        retryTarget,
        cancelCurrentContextFetches,
        resetState,
    };
}
