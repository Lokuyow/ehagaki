import { getEventHash, schnorr, type EventVerifier } from "@rx-nostr/crypto";
import { validateEvent } from "nostr-tools";
import { isSignedNostrEvent } from "./postHistoryEventUtils";

const HEX_64 = /^[0-9a-f]{64}$/;
const SIGNATURE_HEX = /^[0-9a-fA-F]{128}$/;

/** Full NIP-01 verification; malformed crypto input is an event rejection. */
export const verifyPostHistoryJsonlEvent: EventVerifier = async (event) => {
    if (!isSignedNostrEvent(event) || !validateEvent(event)
        || !HEX_64.test(event.id) || !HEX_64.test(event.pubkey)
        || !SIGNATURE_HEX.test(event.sig)) return false;

    const hash = getEventHash(event);
    if (hash !== event.id) return false;
    // The wire guards cover hex conversion and Schnorr argument lengths.
    // noble returns false for invalid points/signatures. Unexpected runtime
    // exceptions deliberately reach the host's VerificationResponse.error.
    return schnorr.verify(event.sig, hash, event.pubkey);
};
