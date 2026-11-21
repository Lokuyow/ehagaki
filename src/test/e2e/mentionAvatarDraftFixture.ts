import type { Page } from "@playwright/test";
import { nip19 } from "nostr-tools";
import { EHAGAKI_DB_NAME } from "../../lib/storage/ehagakiDbConstants";

export async function saveMentionDraftFixture(
    page: Page,
    { pubkey, owner = null, picture }: { pubkey: string; owner?: string | null; picture?: string },
): Promise<void> {
    const npub = nip19.npubEncode(pubkey);
    await page.evaluate(({ dbName, pubkey, owner, picture, npub }) => new Promise<void>((resolve, reject) => {
        const open = indexedDB.open(dbName);
        open.onupgradeneeded = () => open.transaction?.abort();
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
            const db = open.result;
            const tx = db.transaction(["drafts", "profiles"], "readwrite");
            const now = Date.now();
            tx.objectStore("drafts").put({
                id: "mention-avatar-test", scopeKey: owner ?? "__ehagaki_unscoped__", pubkeyHex: owner,
                content: `<p><span data-nostr-mention="nostr:${npub}">@Draft contact</span></p>`,
                preview: "@Draft contact", timestamp: now, updatedAt: now, schemaVersion: 1,
            });
            if (picture) tx.objectStore("profiles").put({
                pubkeyHex: pubkey, name: "Draft contact", displayName: "", npub, nprofile: "",
                pictureUrl: picture, fetchedAt: now, updatedAt: now, schemaVersion: 2,
            });
            tx.oncomplete = () => { db.close(); resolve(); };
            tx.onabort = () => { db.close(); reject(tx.error); };
        };
    }), { dbName: EHAGAKI_DB_NAME, pubkey, owner, picture, npub });
}

export async function restoreMentionDraftFixture(page: Page): Promise<void> {
    await page.locator(".draft-list-button").click();
    await page.locator(".draft-content").filter({ hasText: "Draft contact" }).click();
}
