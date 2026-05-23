import QRCode from 'qrcode';
import { getNip46ConnectRelaysStorageKey } from './authStorageKeys';
import { sanitizeNip46NostrConnectRelays } from './nip46Service';

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