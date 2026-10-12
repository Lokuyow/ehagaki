import { createServer } from "vite";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Test-only HTTPS certificate. No keys or trust-store changes are persisted.
const directory = mkdtempSync(join(tmpdir(), "ehagaki-local-relay-"));
const windowsOpenSSL = "C:/Program Files/Git/usr/bin/openssl.exe";
const openssl = process.env.EHAGAKI_TEST_OPENSSL
    ?? (existsSync(windowsOpenSSL) ? windowsOpenSSL : "openssl");
const key = join(directory, "key.pem"), cert = join(directory, "cert.pem");
const cleanup = () => {
    rmSync(key, { force: true }); rmSync(cert, { force: true });
    if (existsSync(directory)) rmdirSync(directory);
};
process.on("exit", cleanup);
execFileSync(openssl, ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
    "-subj", "/CN=127.0.0.1", "-addext", "subjectAltName=IP:127.0.0.1",
    "-keyout", key, "-out", cert], { stdio: "ignore" });
const server = await createServer({ server: { host: "127.0.0.1",
    port: Number(process.env.EHAGAKI_E2E_PORT), strictPort: true,
    https: { key: readFileSync(key), cert: readFileSync(cert) } } });
await server.listen();
cleanup();
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, async () => { await server.close(); process.exit(); });
