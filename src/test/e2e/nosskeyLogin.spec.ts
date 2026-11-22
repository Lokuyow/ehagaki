import { expect, test } from "@playwright/test";
import { finalizeEvent, generateSecretKey, getPublicKey, type EventTemplate } from "nostr-tools";

test.use({ trace: "off", screenshot: "off", video: "off" });

test("Nosskey approval supports keyboard and pointer and stays lazy on reload @android-chrome", async ({ page }) => {
    const key = generateSecretKey();
    const owner = getPublicKey(key);
    await page.exposeFunction("fixtureSignNosskeyEvent", (template: EventTemplate) => finalizeEvent(template, key));
    let requests = 0;
    let authentications = 0;
    let published = false;
    await page.addInitScript(() => {
        localStorage.setItem("firstVisit", "1");
        localStorage.setItem("locale", "en");
        // This test fakes the signer at the iframe boundary. Windows WebKit
        // provides no native credential container for the emulated device.
        if (!navigator.credentials) {
            Object.defineProperty(navigator, "credentials", { value: {} });
        }
    });
    await page.routeWebSocket(/^wss?:\/\//, socket => {
        socket.onMessage(raw => {
            const message = JSON.parse(String(raw));
            if (!Array.isArray(message)) return;
            const [type, id] = message;
            if (type === "REQ") {
                socket.send(JSON.stringify(["AUTH", "test-challenge"]));
                socket.send(JSON.stringify(["EOSE", id]));
            }
            if (type === "AUTH") authentications++;
            if (type === "EVENT") {
                published ||= id.pubkey === owner && id.kind === 1;
                socket.send(JSON.stringify(["OK", id.id, true, ""]));
            }
        });
    });
    await page.route("https://nosskey.app/**", route => {
        requests++;
        return route.fulfill({ contentType: "text/html", body: `
            <button id="decline">Decline</button>
            <button id="approve">Approve</button>
            <script>
            const origin = ${JSON.stringify(new URL(page.url()).origin)};
            let request;
            const send = data => parent.postMessage(data, origin);
            addEventListener("message", event => {
                if (event.origin !== origin || event.data.type !== "nosskey:request") return;
                request = event.data;
                send({type:"nosskey:visibility", visible:true});
            });
            const respond = payload => {
                send({type:"nosskey:visibility", visible:false});
                send({type:"nosskey:response", id:request.id, ...payload});
            };
            document.querySelector("#decline").onclick = () => respond({error:{code:"USER_REJECTED",message:"Declined"}});
            document.querySelector("#approve").onclick = async () => respond({
                result: request.method === "signEvent"
                    ? await window.fixtureSignNosskeyEvent(request.params.event)
                    : ${JSON.stringify(owner)}
            });
            send({type:"nosskey:ready"});
            </script>` });
    });
    await page.goto("/ehagaki/");
    await page.locator(".login-btn").click();
    const login = page.getByRole("button", { name: "Log in with Nosskey (passkey)" });
    await expect(login).toBeVisible();
    expect(requests).toBe(0);
    await login.click();
    const iframe = page.frameLocator(".nosskey-approval-frame iframe");
    const decline = iframe.getByRole("button", { name: "Decline" });
    await expect(decline).toBeVisible();
    await decline.focus();
    await expect(decline).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("The Nosskey request was declined.")).toBeVisible();
    await expect.poll(() => page.locator(".login-dialog").evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
    await login.click();
    await iframe.getByRole("button", { name: "Approve" }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem("nostr-active-account"))).toBe(owner);
    await expect(page.locator(".login-dialog")).toBeHidden();
    expect(requests).toBe(1);
    await page.reload();
    await expect(page.locator(".profile-display")).toBeVisible();
    await expect(page.locator(".nosskey-approval-frame iframe")).toHaveCount(0);
    expect(requests).toBe(1);
    await page.locator(".tiptap-editor").fill("Nosskey test post");
    await page.locator("button.post-button").click();
    await iframe.getByRole("button", { name: "Approve" }).click();
    await expect.poll(() => published).toBe(true);
    expect(authentications).toBe(0);
});
