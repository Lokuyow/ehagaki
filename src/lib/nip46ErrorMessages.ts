/**
 * Error messages nip46Service throws for Nostr Connect failures that the login
 * UI translates. They reach LoginDialog as plain strings, so the service and
 * the UI mapping (nip46ConnectUiUtils) must share these constants.
 * Side-effect free: safe to import from UI code without loading the service.
 */
export const NIP46_ERROR_MESSAGES = {
    nostrConnectRelayRequired: 'At least one public wss relay is required for nostrconnect',
    nostrConnectTimeout: 'Nostr Connect timed out before the remote signer connected',
    nostrConnectCancelled: 'Nostr Connect connection was cancelled',
    handshakePoolUnavailable: 'Nostr Connect handshake pool is unavailable',
    finalRelayListMissing: 'Remote signer did not return final relay list',
    finalRelayListInvalid: 'Remote signer returned an invalid final relay list',
    finalRelayNoUsable: 'Remote signer did not return any usable connection relay',
    finalLocalRelayUnreachable: 'Could not connect to the local relay specified by the remote signer',
    finalRelayVerificationFailed:
        'Communication could not be verified on the relay selected by the remote signer',
} as const;

/** Relay pool failures are thrown as `${prefix}: ${details}`. */
export const NIP46_RELAY_CONNECTION_FAILED_PREFIX = 'Relay connection failed';

export function formatNip46RelayConnectionFailure(details: string): string {
    return `${NIP46_RELAY_CONNECTION_FAILED_PREFIX}: ${details}`;
}
