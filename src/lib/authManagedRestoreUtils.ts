import type { StoredAccount } from './types';

type AccountAuthType = StoredAccount['type'];

export interface ManagedRestoreCandidate {
    pubkeyHex: string;
    type: AccountAuthType;
    activateOnSuccess: boolean;
}

export function buildManagedRestoreCandidates({
    activePubkey,
    activeType,
    accounts,
}: {
    activePubkey: string | null;
    activeType: AccountAuthType | null;
    accounts: Array<Pick<StoredAccount, 'pubkeyHex' | 'type'>>;
}): ManagedRestoreCandidate[] {
    const candidates: ManagedRestoreCandidate[] = [];

    if (activePubkey && activeType && activeType !== 'parentClient') {
        candidates.push({
            pubkeyHex: activePubkey,
            type: activeType,
            activateOnSuccess: false,
        });
    }

    for (const account of accounts) {
        if (account.pubkeyHex === activePubkey) {
            continue;
        }

        if (account.type === 'parentClient') {
            continue;
        }

        candidates.push({
            pubkeyHex: account.pubkeyHex,
            type: account.type,
            activateOnSuccess: true,
        });
    }

    return candidates;
}