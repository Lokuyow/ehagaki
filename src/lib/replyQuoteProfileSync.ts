import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayProfileService } from "./relayProfileService";
import type {
    ProfileData,
    ReplyQuoteComposerState,
    ReplyQuoteState,
} from "./types";

interface ReplyQuoteProfileTarget {
    key: string;
    presentation: ProfilePresentation;
    applyProfile: (profile: ProfilePresentation) => void;
}

interface ProfilePresentation {
    displayName: string | null;
    picture: string | null;
}

interface DesiredProfileSync {
    pubkey: string;
    relayHints: string[];
    targets: Map<string, ReplyQuoteProfileTarget>;
}

interface ActiveProfileSync extends DesiredProfileSync {
    unsubscribe: () => void;
    lastProfile: ProfileData | null;
    disposed: boolean;
}

export interface ReplyQuoteProfileSyncDependencies {
    relayProfileService: Pick<
        RelayProfileService,
        "fetchProfileRealtime" | "subscribeProfile"
    >;
    updateAuthorProfile: (
        eventId: string,
        pubkey: string,
        profile: {
            displayName: string | null;
            picture: string | null;
        },
    ) => void;
    updateReplyNotificationRecipientProfile: (
        eventId: string,
        pubkey: string,
        profile: {
            displayName: string | null;
            picture: string | null;
        },
    ) => void;
    logger?: Pick<Console, "error">;
}

export interface ReplyQuoteProfileSyncController {
    sync(state: ReplyQuoteComposerState): void;
    dispose(): void;
}

function toProfilePresentation(profile: ProfileData): ProfilePresentation {
    return {
        displayName: profile.displayName.trim() || profile.name.trim() || null,
        picture: profile.picture.trim() || null,
    };
}

function areProfilePresentationsEqual(
    left: ProfilePresentation,
    right: ProfilePresentation,
): boolean {
    return left.displayName === right.displayName
        && left.picture === right.picture;
}

function appendReferenceTargets(
    desiredByPubkey: Map<string, DesiredProfileSync>,
    reference: ReplyQuoteState,
    deps: ReplyQuoteProfileSyncDependencies,
): void {
    const appendTarget = (
        pubkey: string,
        target: ReplyQuoteProfileTarget,
    ) => {
        if (!pubkey) {
            return;
        }

        const current = desiredByPubkey.get(pubkey) ?? {
            pubkey,
            relayHints: [],
            targets: new Map<string, ReplyQuoteProfileTarget>(),
        };
        current.relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...current.relayHints,
            ...reference.relayHints,
        ], {
            limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
        });
        current.targets.set(target.key, target);
        desiredByPubkey.set(pubkey, current);
    };

    if (reference.authorPubkey) {
        appendTarget(reference.authorPubkey, {
            key: `${reference.mode}:author:${reference.eventId}:${reference.authorPubkey}`,
            presentation: {
                displayName: reference.authorDisplayName,
                picture: reference.authorPicture,
            },
            applyProfile: (profile) => {
                deps.updateAuthorProfile(
                    reference.eventId,
                    reference.authorPubkey!,
                    profile,
                );
            },
        });
    }

    for (const recipient of reference.replyNotificationRecipients ?? []) {
        appendTarget(recipient.pubkey, {
            key: `${reference.mode}:recipient:${reference.eventId}:${recipient.pubkey}`,
            presentation: {
                displayName: recipient.displayName,
                picture: recipient.picture,
            },
            applyProfile: (profile) => {
                deps.updateReplyNotificationRecipientProfile(
                    reference.eventId,
                    recipient.pubkey,
                    profile,
                );
            },
        });
    }
}

function collectDesiredProfileSyncs(
    state: ReplyQuoteComposerState,
    deps: ReplyQuoteProfileSyncDependencies,
): Map<string, DesiredProfileSync> {
    const desiredByPubkey = new Map<string, DesiredProfileSync>();
    if (state.reply) {
        appendReferenceTargets(desiredByPubkey, state.reply, deps);
    }
    for (const quote of state.quotes) {
        appendReferenceTargets(desiredByPubkey, quote, deps);
    }
    return desiredByPubkey;
}

export function createReplyQuoteProfileSyncController(
    deps: ReplyQuoteProfileSyncDependencies,
): ReplyQuoteProfileSyncController {
    const logger = deps.logger ?? console;
    const activeByPubkey = new Map<string, ActiveProfileSync>();

    const applyProfile = (active: ActiveProfileSync, profile: ProfileData | null) => {
        if (active.disposed || !profile) {
            return;
        }

        active.lastProfile = profile;
        const presentation = toProfilePresentation(profile);

        for (const target of active.targets.values()) {
            if (areProfilePresentationsEqual(target.presentation, presentation)) {
                continue;
            }
            target.presentation = presentation;
            target.applyProfile(presentation);
        }
    };

    const requestProfile = (active: ActiveProfileSync) => {
        void deps.relayProfileService.fetchProfileRealtime(active.pubkey, {
            additionalRelays: active.relayHints,
        }).then((profile) => {
            if (activeByPubkey.get(active.pubkey) === active) {
                applyProfile(active, profile);
            }
        }).catch((error) => {
            logger.error("返信・引用プロフィールの取得に失敗:", error);
        });
    };

    const sync = (state: ReplyQuoteComposerState) => {
        const desiredByPubkey = collectDesiredProfileSyncs(state, deps);

        for (const [pubkey, active] of activeByPubkey.entries()) {
            if (desiredByPubkey.has(pubkey)) {
                continue;
            }
            active.disposed = true;
            active.unsubscribe();
            activeByPubkey.delete(pubkey);
        }

        for (const [pubkey, desired] of desiredByPubkey.entries()) {
            const current = activeByPubkey.get(pubkey);
            if (current) {
                const previousRelayHints = current.relayHints.join("\n");
                current.relayHints = desired.relayHints;
                current.targets = desired.targets;
                if (current.lastProfile) {
                    applyProfile(current, current.lastProfile);
                }
                if (previousRelayHints !== current.relayHints.join("\n")) {
                    requestProfile(current);
                }
                continue;
            }

            const active: ActiveProfileSync = {
                ...desired,
                unsubscribe: () => undefined,
                lastProfile: null,
                disposed: false,
            };
            activeByPubkey.set(pubkey, active);
            active.unsubscribe = deps.relayProfileService.subscribeProfile(
                pubkey,
                (profile) => applyProfile(active, profile),
            );
            requestProfile(active);
        }
    };

    const dispose = () => {
        for (const active of activeByPubkey.values()) {
            active.disposed = true;
            active.unsubscribe();
        }
        activeByPubkey.clear();
    };

    return { sync, dispose };
}
