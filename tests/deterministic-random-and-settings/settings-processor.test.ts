import { describe, expect, it, vi } from "vitest";
import { createSettingsProcessor, DEFAULT_SUPPORTED_LIMITS } from "../../src/deterministic-random-and-settings/index.js";
const versions = { applicationVersion: "1", generatorVersion: "1", formatVersion: "1" };
const raw = { width: 20, height: 20, seedInput: "  replay  " };
describe("SettingsProcessor", () => {
  it("preserves raw seed settings but resolves a trimmed effective seed", () => { const outcome = createSettingsProcessor().process(raw, DEFAULT_SUPPORTED_LIMITS, versions); expect(outcome).toMatchObject({ ok: true, value: { request: { resolvedSeed: "replay", settings: { seedInput: "  replay  " } } } }); });
  it("rejects unsupported dimensions", () => { expect(createSettingsProcessor().process({ ...raw, width: 121 }, DEFAULT_SUPPORTED_LIMITS, versions)).toMatchObject({ ok: false, error: [{ code: "settings.limit.exceeded", field: "width" }] }); });
  it("uses a warning-bearing fallback when web crypto is absent", () => { const crypto = globalThis.crypto; vi.stubGlobal("crypto", undefined); vi.spyOn(Date, "now").mockReturnValue(123); const outcome = createSettingsProcessor().process({ ...raw, seedInput: "" }, DEFAULT_SUPPORTED_LIMITS, versions); expect(outcome).toMatchObject({ ok: true, value: { request: { resolvedSeed: "fallback-3f" }, warnings: [{ code: "seed.entropy.fallback" }] } }); vi.stubGlobal("crypto", crypto); vi.restoreAllMocks(); });
});
