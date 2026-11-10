import { getNip46ConnectRelaysStorageKey } from './authStorageKeys';
import { sanitizeNip46NostrConnectRelays } from './nip46Service';
import {
    NIP46_ERROR_MESSAGES,
    NIP46_RELAY_CONNECTION_FAILED_PREFIX,
} from './nip46ErrorMessages';

// Default relay candidates for the initial NIP-46 connection attempt.
// The published nostrconnect URI is rebuilt from the ready relay subset,
// not from this full candidate list.
export const DEFAULT_NIP46_CONNECTION_RELAY_CANDIDATES = [
    'wss://nostr.oxtr.dev/',
    'wss://theforest.nostr1.com/',
    'wss://relay.primal.net/',
    'wss://ephemeral.snowflare.cc/',
] as const;

export type Nip46ConnectionRelayValidationErrorKey =
    | 'loginDialog.nostrconnect_relay_required'
    | 'loginDialog.nostrconnect_relay_invalid';

export type Nip46ConnectionRelayValidationResult = {
    relays: string[];
    errorKey: Nip46ConnectionRelayValidationErrorKey | null;
};

function normalizeDraftRelay(relay: string): string | null {
    const [normalized] = sanitizeNip46NostrConnectRelays([relay]);
    return normalized ?? null;
}

export function createNip46ConnectionRelayDrafts(
    relays: readonly string[],
): string[] {
    return relays.length > 0 ? [...relays] : [''];
}

export function ensureNip46ConnectionRelayDraftRows(
    relays: string[],
): string[] {
    return relays.length > 0 ? [...relays] : [''];
}

export function getDefaultNip46ConnectionRelayCandidates(): string[] {
    const sanitized = sanitizeNip46NostrConnectRelays([
        ...DEFAULT_NIP46_CONNECTION_RELAY_CANDIDATES,
    ]);

    return sanitized.length === DEFAULT_NIP46_CONNECTION_RELAY_CANDIDATES.length
        ? sanitized
        : [];
}

export function validateNip46ConnectionRelayDrafts(
    relays: string[],
): Nip46ConnectionRelayValidationResult {
    const trimmedRelays = relays
        .map((relay) => relay.trim())
        .filter((relay) => relay.length > 0);

    if (trimmedRelays.length === 0) {
        return {
            relays: [],
            errorKey: 'loginDialog.nostrconnect_relay_required',
        };
    }

    const hasInvalidRelay = trimmedRelays.some(
        (relay) => normalizeDraftRelay(relay) === null,
    );
    const sanitizedRelays = sanitizeNip46NostrConnectRelays(trimmedRelays);

    if (sanitizedRelays.length === 0 || hasInvalidRelay) {
        return {
            relays: sanitizedRelays,
            errorKey: 'loginDialog.nostrconnect_relay_invalid',
        };
    }

    return {
        relays: sanitizedRelays,
        errorKey: null,
    };
}

export function loadLastUsedNip46ConnectionRelayCandidates(
    storage: Storage | null | undefined,
): string[] {
    if (!storage) {
        return [];
    }

    try {
        const rawValue = storage.getItem(getNip46ConnectRelaysStorageKey());
        if (!rawValue) {
            return [];
        }

        const parsed = JSON.parse(rawValue) as unknown;
        if (!Array.isArray(parsed)) {
            return [];
        }

        const validationResult = validateNip46ConnectionRelayDrafts(
            parsed.filter((relay): relay is string => typeof relay === 'string'),
        );

        return validationResult.errorKey === null ? validationResult.relays : [];
    } catch {
        return [];
    }
}

export function resolveInitialNip46ConnectionRelayCandidates(
    storage: Storage | null | undefined,
): string[] {
    const savedRelays = loadLastUsedNip46ConnectionRelayCandidates(storage);
    if (savedRelays.length > 0) {
        return savedRelays;
    }

    return getDefaultNip46ConnectionRelayCandidates();
}

export function saveLastUsedNip46ConnectionRelayCandidates(
    storage: Storage | null | undefined,
    relays: string[],
): void {
    if (!storage) {
        return;
    }

    const validationResult = validateNip46ConnectionRelayDrafts(relays);
    if (validationResult.errorKey !== null) {
        return;
    }

    try {
        storage.setItem(
            getNip46ConnectRelaysStorageKey(),
            JSON.stringify(validationResult.relays),
        );
    } catch {
        // noop
    }
}

export function extractNip46ConnectionUriRelays(
    value: string | null | undefined,
): string[] {
    if (!value || !value.startsWith('nostrconnect://')) {
        return [];
    }

    const queryStartIndex = value.indexOf('?');
    if (queryStartIndex < 0) {
        return [];
    }

    const query = value.slice(queryStartIndex + 1).split('#', 1)[0] ?? '';
    const searchParams = new URLSearchParams(query);
    return sanitizeNip46NostrConnectRelays(searchParams.getAll('relay'));
}

export async function generateNip46ConnectionQrSvg(
    value: string,
): Promise<string> {
    const { default: QRCode } = await import('qrcode');
    return await QRCode.toString(value, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 288,
        color: {
            dark: '#111111',
            light: '#FFFFFFFF',
        },
    });
}

export function openNip46ConnectionUri(
    value: string,
    locationLike: Pick<Location, 'assign'> | undefined = globalThis.location,
): boolean {
    if (!value || !locationLike) {
        return false;
    }

    try {
        locationLike.assign(value);
        return true;
    } catch {
        return false;
    }
}

export type Nip46NostrConnectErrorDisplay =
    | { kind: 'key'; key: string }
    | { kind: 'hidden' }
    | { kind: 'raw'; message: string };

// No longer thrown by nip46Service; kept so stale messages still read well.
const LEGACY_CONNECTION_FAILED_MESSAGES = [
    'Timed out waiting for switch_relays response',
];
const LEGACY_RELAY_RECONCILIATION_FAILED_MESSAGES = [
    'Timed out waiting for final relay list',
    'Remote signer returned an unsupported final relay',
];

const NIP46_NOSTR_CONNECT_ERROR_KEYS = new Map<string, string>([
    [NIP46_ERROR_MESSAGES.nostrConnectRelayRequired, 'loginDialog.nostrconnect_relay_required'],
    [NIP46_ERROR_MESSAGES.nostrConnectTimeout, 'loginDialog.nostrconnect_timeout'],
    [NIP46_RELAY_CONNECTION_FAILED_PREFIX, 'loginDialog.nostrconnect_connection_failed'],
    [NIP46_ERROR_MESSAGES.handshakePoolUnavailable, 'loginDialog.nostrconnect_connection_failed'],
    ...LEGACY_CONNECTION_FAILED_MESSAGES.map(
        (message) => [message, 'loginDialog.nostrconnect_connection_failed'] as const,
    ),
    [NIP46_ERROR_MESSAGES.finalRelayListMissing, 'loginDialog.nostrconnect_relay_reconciliation_failed'],
    [NIP46_ERROR_MESSAGES.finalRelayListInvalid, 'loginDialog.nostrconnect_relay_reconciliation_failed'],
    ...LEGACY_RELAY_RECONCILIATION_FAILED_MESSAGES.map(
        (message) => [message, 'loginDialog.nostrconnect_relay_reconciliation_failed'] as const,
    ),
    [NIP46_ERROR_MESSAGES.finalRelayNoUsable, 'loginDialog.nostrconnect_no_usable_final_relay'],
    [NIP46_ERROR_MESSAGES.finalLocalRelayUnreachable, 'loginDialog.nostrconnect_local_final_relay_unreachable'],
    [NIP46_ERROR_MESSAGES.finalRelayVerificationFailed, 'loginDialog.nostrconnect_final_relay_verification_failed'],
]);

/** Maps a Nostr Connect error message to the login dialog's display. */
export function resolveNip46NostrConnectErrorDisplay(
    errorMessage: string,
): Nip46NostrConnectErrorDisplay {
    if (errorMessage === NIP46_ERROR_MESSAGES.nostrConnectCancelled) {
        return { kind: 'hidden' };
    }
    const key = NIP46_NOSTR_CONNECT_ERROR_KEYS.get(errorMessage)
        ?? (errorMessage.startsWith(`${NIP46_RELAY_CONNECTION_FAILED_PREFIX}:`)
            ? 'loginDialog.nostrconnect_connection_failed'
            : undefined);
    return key ? { kind: 'key', key } : { kind: 'raw', message: errorMessage };
}
