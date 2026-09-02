import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

async function sources(path: string): Promise<string[]> { const entries = await readdir(path, { withFileTypes: true }); return Promise.all(entries.filter(entry => entry.isFile() && entry.name.endsWith(".ts")).map(entry => readFile(join(path, entry.name), "utf8"))); }
describe("U2 import boundary", () => { it("does not import UI, storage, network, or later units", async () => { const text = (await sources("src/deterministic-random-and-settings")).join("\n"); expect(text).not.toMatch(/react|canvas|localStorage|fetch\(|application-core|browser-/i); }); });
