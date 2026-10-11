import { startVerificationServiceHost } from "@rx-nostr/crypto";
import { verifyPostHistoryJsonlEvent } from "./postHistoryJsonlEventVerifier";

startVerificationServiceHost(verifyPostHistoryJsonlEvent);
