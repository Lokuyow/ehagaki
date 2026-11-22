import { isHex64 } from './utils/nostrHexUtils';
import type { StoredAccount } from './types';

type AccountAuthType = StoredAccount['type'];

export interface ManagedRestoreCandidate {
    pubkeyHex: string;
    type: AccountAuthType;
    activateOnSuccess: boolean;
}

export function buildManagedRestoreCandidates({
    activePubkey,
    accounts,
}: {
    activePubkey: string | null;
    accounts: ReadonlyArray<Pick<StoredAccount, 'pubkeyHex' | 'type'>>;
}): ManagedRestoreCandidate[] {
    const selected = isHex64(activePubkey)
        ? accounts.find(account => account.pubkeyHex === activePubkey)
        : undefined;
    if (selected && selected.type !== 'parentClient') {
        // A saved selection is not invalidated by an unavailable credential or signer.
        return [{
            pubkeyHex: selected.pubkeyHex,
            type: selected.type,
            activateOnSuccess: false,
        }];
    }

    const candidates: ManagedRestoreCandidate[] = [];
    for (const account of accounts) {
        if (account.pubkeyHex === activePubkey || account.type === 'parentClient') continue;

        candidates.push({
            pubkeyHex: account.pubkeyHex,
            type: account.type,
            activateOnSuccess: true,
        });
    }

    return candidates;
}
