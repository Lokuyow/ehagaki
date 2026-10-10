import { expect, test, type Page } from "@playwright/test";
import { finalizeEvent, generateSecretKey, nip19, verifyEvent } from "nostr-tools";

// Run the same native-timer regression in installed Chrome locally; CI can use
// its normal Chromium installation. Never record signing payloads in traces.
test.use({ channel: process.env.EHAGAKI_TEST_CHROME_CHANNEL, trace: "off" });

const contextualRelay = "wss://context.example/";
const authorRelay = "wss://author.example/";
const recipientRelay = "wss://recipient.example/";
const silentAuthorRelay = "wss://silent-author.example/";
const silentRecipientRelay = "wss://silent-recipient.example/";

async function relayFixture(page: Page, mode: "fast" | "hung" | "timeout", silentClasses: "none" | "author" | "recipient" | "both" = "none", manual = false) {
    const secret = generateSecretKey();
    const target = finalizeEvent({ kind: 1, created_at: 100, tags: [], content: "Local target fixture" }, secret);
    const recipientRelays = [recipientRelay, ...(["recipient", "both"].includes(silentClasses) ? [silentRecipientRelay] : [])];
    const relayList = finalizeEvent({ kind: 10002, created_at: 200, tags: recipientRelays.map((relay) => ["r", relay, "read"]), content: "" }, secret);
    const requests: Array<{ relay: string; kind: number | undefined }> = [];
    const closes: string[] = [];
    const publications: Array<{ relay: string; eventId: string; verified: boolean; hasRecipient: boolean }> = [];
    const stages: Array<{ relay: string; eventId: string; kind: number }> = [];
    const pendingAcks = new Map<string, () => void>();
    await page.routeWebSocket(/^wss:\/\//, (socket) => {
        socket.onMessage((raw) => {
            const message = JSON.parse(raw.toString());
            if (message[0] === "CLOSE") closes.push(socket.url());
            if (message[0] === "EVENT") {
                const event = message[1];
                publications.push({
                    relay: socket.url(), eventId: event.id, verified: verifyEvent(event),
                    hasRecipient: event.tags.some((tag: string[]) => tag[0] === "p" && tag[1] === target.pubkey),
                });
                stages.push({ relay: socket.url(), eventId: event.id, kind: event.kind });
                if (manual) {
                    pendingAcks.set(`${socket.url()}:${event.kind}`, () => socket.send(JSON.stringify(["OK", event.id, true, ""])));
                    return;
                }
                if (![silentAuthorRelay, silentRecipientRelay].includes(socket.url())) {
                    socket.send(JSON.stringify(["OK", event.id, true, ""]));
                }
            }
            if (message[0] !== "REQ") return;
            const [_, subscriptionId, filter] = message;
            const kind = filter.kinds?.[0];
            requests.push({ relay: socket.url(), kind });
            if (filter.ids?.includes(target.id) && socket.url() === contextualRelay) {
                socket.send(JSON.stringify(["EVENT", subscriptionId, target]));
            }
            if (kind === 10002 && mode === "timeout") return;
            if (kind === 10002 && socket.url() === contextualRelay) {
                setTimeout(() => {
                    socket.send(JSON.stringify(["EVENT", subscriptionId, relayList]));
                    socket.send(JSON.stringify(["EOSE", subscriptionId]));
                }, 100);
                return;
            }
            if (kind === 10002 && mode === "hung" && socket.url() === "wss://purplepag.es/") return;
            socket.send(JSON.stringify(["EOSE", subscriptionId]));
        });
    });
    await page.goto("nip65-routing-playwright.html");
    await page.waitForFunction(() => !!window.__NIP65_ROUTING_HARNESS__);
    return {
        pubkey: target.pubkey,
        pointer: nip19.neventEncode({ id: target.id, author: target.pubkey, kind: 1, relays: [contextualRelay] }),
        requests, closes, publications, stages,
        ack: (relay: string, kind: number) => {
            const key = `${relay}:${kind}`;
            const ack = pendingAcks.get(key);
            if (!ack) throw new Error("fixture publish not started");
            pendingAcks.delete(key); ack();
        },
    };
}

test("native browser timers emit REQ and clean up an EOSE-completed Directory lookup", async ({ page }) => {
    const fixture = await relayFixture(page, "fast");
    const result = await page.evaluate(({ pubkey, relay }) =>
        window.__NIP65_ROUTING_HARNESS__.directory(pubkey, [relay]),
    { pubkey: fixture.pubkey, relay: contextualRelay });
    expect(result).toMatchObject({ status: "found", readRelays: [recipientRelay] });
    expect(fixture.requests.filter((request) => request.kind === 10002)).toHaveLength(5);
    await expect.poll(() => fixture.closes.length).toBeGreaterThan(0);
});

test("native browser timers time out and unsubscribe without Illegal invocation", async ({ page }) => {
    const fixture = await relayFixture(page, "timeout");
    const result = await page.evaluate(({ pubkey, relay }) =>
        window.__NIP65_ROUTING_HARNESS__.directory(pubkey, [relay]),
    { pubkey: fixture.pubkey, relay: contextualRelay });
    expect(result).toMatchObject({ status: "network-error", readRelays: [] });
    expect(fixture.requests.filter((request) => request.kind === 10002)).toHaveLength(5);
    await expect.poll(() => fixture.closes.length).toBeGreaterThan(0);
});

for (const scenario of [
    { name: "cold cache with a silent bootstrap", cache: "cold", relayMode: "hung" },
    { name: "cold cache with fast EOSEs", cache: "cold", relayMode: "fast" },
    { name: "warm bootstrap negative cache", cache: "warm", relayMode: "fast" },
    { name: "context added during Composer bootstrap prefetch", cache: "prefetch", relayMode: "hung" },
] as const) {
    test(`signed reply reaches both delivery classes: ${scenario.name}`, async ({ page }) => {
        const fixture = await relayFixture(page, scenario.relayMode);
        const pending = page.evaluate(({ pointer, authorRelay, mode }) =>
            window.__NIP65_ROUTING_HARNESS__.reply(pointer, authorRelay, mode),
        { pointer: fixture.pointer, authorRelay, mode: scenario.cache });
        await expect.poll(() => fixture.publications.some((packet) => packet.relay === authorRelay)).toBe(true);
        const result = await pending;
        expect(result.state).toMatchObject({
            authorPubkey: fixture.pubkey, referencedAuthor: fixture.pubkey,
            relayHints: [contextualRelay], unsignedHasRecipient: true,
        });
        expect(fixture.publications).toEqual([
            { relay: authorRelay, eventId: result.result.eventId, verified: true, hasRecipient: true },
            { relay: recipientRelay, eventId: result.result.eventId, verified: true, hasRecipient: true },
        ]);
        expect(result.result).toMatchObject({
            success: true, fullyDelivered: true, acceptedRelays: [authorRelay, recipientRelay],
            delivery: {
                authorWrite: { status: "delivered" },
                taggedUserRead: { [fixture.pubkey]: { status: "delivered" } },
            },
        });
        expect(result.history).toEqual([{ eventId: result.result.eventId, verified: true, acceptedRelays: [authorRelay, recipientRelay] }]);
        expect(fixture.requests.filter((request) => request.kind === 10002 && request.relay === contextualRelay)).toHaveLength(1);
        expect(result.waves.find((wave) => wave.relays.includes(recipientRelay))!.startedMs).toBeLessThan(1_000);
        expect(result.completedMs).toBeLessThan(2_500);
    });
}

for (const silentClasses of ["author", "recipient", "both"] as const) {
    test(`successful class ACKs finish promptly with silent ${silentClasses} relays`, async ({ page }) => {
        const fixture = await relayFixture(page, "hung", silentClasses);
        const extraAuthors = ["author", "both"].includes(silentClasses) ? [silentAuthorRelay] : [];
        const result = await page.evaluate(({ pointer, authorRelay, extraAuthors }) =>
            window.__NIP65_ROUTING_HARNESS__.reply(pointer, authorRelay, "cold", extraAuthors),
        { pointer: fixture.pointer, authorRelay, extraAuthors });
        expect(result.result).toMatchObject({ success: true, fullyDelivered: true, acceptedRelays: [authorRelay, recipientRelay] });
        expect(result.waves.find((wave) => wave.relays.includes(recipientRelay))!.startedMs).toBeLessThan(1_000);
        expect(result.completedMs).toBeLessThan(2_500);
        expect(result.history).toEqual([{ eventId: result.result.eventId, verified: true, acceptedRelays: [authorRelay, recipientRelay] }]);
        expect(result.result.timedOutRelays).toEqual(expect.arrayContaining([
            ...extraAuthors,
            ...(["recipient", "both"].includes(silentClasses) ? [silentRecipientRelay] : []),
        ]));
    });
}

for (const sensitive of [false, true]) {
    test(`recipient ACK precedes author ACK without crossing classes (${sensitive ? "Sensitive pair" : "ordinary"})`, async ({ page }) => {
        const fixture = await relayFixture(page, "hung", "none", true);
        const pending = page.evaluate(({ pointer, authorRelay, sensitive }) =>
            window.__NIP65_ROUTING_HARNESS__.reply(pointer, authorRelay, "cold", [], sensitive),
        { pointer: fixture.pointer, authorRelay, sensitive });
        const seen = (relay: string, kind: number) => fixture.stages.filter(stage => stage.relay === relay && stage.kind === kind);
        const structureKind = 1;
        if (sensitive) {
            await expect.poll(() => seen(authorRelay, 36).length).toBe(1);
            // Discovery and recipient Payload launch proceed while author Payload is unacknowledged.
            await expect.poll(() => seen(recipientRelay, 36).length).toBe(1);
            expect(fixture.stages.filter(stage => stage.kind === structureKind)).toEqual([]);
            fixture.ack(authorRelay, 36);
            await expect.poll(() => seen(authorRelay, structureKind).length).toBe(1);
            expect(seen(recipientRelay, structureKind)).toEqual([]);
            fixture.ack(recipientRelay, 36);
        }
        await expect.poll(() => seen(recipientRelay, structureKind).length).toBe(1);
        await expect.poll(() => seen(authorRelay, structureKind).length).toBe(1);
        expect(seen(authorRelay, structureKind)[0]!.eventId).toBe(seen(recipientRelay, structureKind)[0]!.eventId);
        fixture.ack(recipientRelay, structureKind);
        await page.waitForFunction(({ relay, kind }) => window.__NIP65_ROUTING_PROGRESS__.waves
            .some(wave => wave.kind === kind && wave.relays.includes(relay) && wave.completed), { relay: recipientRelay, kind: structureKind });
        const progress = await page.evaluate(() => window.__NIP65_ROUTING_PROGRESS__);
        const authorWave = progress.waves.find(wave => wave.kind === structureKind && wave.relays.includes(authorRelay))!;
        expect(authorWave.acceptedRelays).toEqual([]); expect(authorWave.completed).toBe(false);
        expect(progress.finished).toBe(false);
        fixture.ack(authorRelay, structureKind);
        const result = await pending;
        expect(result.result).toMatchObject({ success: true, fullyDelivered: true,
            delivery: { authorWrite: { acceptedRelays: [authorRelay] }, taggedUserRead: { [fixture.pubkey]: { acceptedRelays: [recipientRelay] } } } });
        expect(new Set(result.result.acceptedRelays)).toEqual(new Set([authorRelay, recipientRelay]));
        expect(result.history).toEqual([{ eventId: result.result.eventId, verified: true, acceptedRelays: expect.arrayContaining([authorRelay, recipientRelay]) }]);
        expect(fixture.publications.every(packet => packet.verified)).toBe(true);
        if (sensitive) {
            expect(result.signedKinds).toEqual([36, 1]);
            expect(result.payloadCache).toEqual([{ eventId: seen(authorRelay, 36)[0]!.eventId, acceptedRelays: expect.arrayContaining([authorRelay, recipientRelay]) }]);
            expect(fixture.stages).toHaveLength(4);
            for (const relay of [authorRelay, recipientRelay]) {
                expect(seen(relay, 36)).toHaveLength(1); expect(seen(relay, 1)).toHaveLength(1);
                expect(fixture.stages.indexOf(seen(relay, 36)[0]!)).toBeLessThan(fixture.stages.indexOf(seen(relay, 1)[0]!));
            }
        }
    });
}
