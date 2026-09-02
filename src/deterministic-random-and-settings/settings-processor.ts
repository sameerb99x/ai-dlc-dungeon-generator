import { createSettings, err, ok } from "../domain-foundation/index.js";
import type { DungeonSettings, RawSettings, SettingsDiagnostic, VersionMetadata } from "../domain-foundation/index.js";
import type { ProcessingWarning, SettingsProcessor, SupportedLimits } from "./types.js";

function diagnostic(code: SettingsDiagnostic["code"] | "settings.limit.exceeded" | "settings.feasibility.invalid", message: string, field: string): SettingsDiagnostic { return { code: code as SettingsDiagnostic["code"], message, field }; }
function keyFor(settings: DungeonSettings, limits: SupportedLimits): string { const c = settings.constraints; return JSON.stringify([settings.dimensions.width, settings.dimensions.height, c.minRoomWidth, c.minRoomHeight, c.maxRoomWidth, c.maxRoomHeight, c.corridorWidth, c.minPathLength, c.maxDeadEnds, limits]); }
export function createSettingsProcessor(): SettingsProcessor {
  const cache = new Map<string, readonly SettingsDiagnostic[]>(); let limitsKey = "";
  const validateFeasibility = (settings: DungeonSettings, limits: SupportedLimits): readonly SettingsDiagnostic[] => {
    const nextLimitsKey = JSON.stringify(limits); if (nextLimitsKey !== limitsKey) { cache.clear(); limitsKey = nextLimitsKey; }
    const key = keyFor(settings, limits); const cached = cache.get(key); if (cached) { cache.delete(key); cache.set(key, cached); return cached; }
    const { width, height } = settings.dimensions; const c = settings.constraints; const diagnostics: SettingsDiagnostic[] = [];
    if (width < limits.minDimension || width > limits.maxDimension) diagnostics.push(diagnostic("settings.limit.exceeded", "Width is outside supported limits.", "width"));
    if (height < limits.minDimension || height > limits.maxDimension) diagnostics.push(diagnostic("settings.limit.exceeded", "Height is outside supported limits.", "height"));
    if (width * height > limits.maxTiles) diagnostics.push(diagnostic("settings.limit.exceeded", "Map tile count exceeds supported limits.", "dimensions"));
    if (c.maxRoomWidth > width || c.maxRoomWidth > limits.maxRoomDimension) diagnostics.push(diagnostic("settings.feasibility.invalid", "Maximum room width cannot fit within supported dimensions.", "maxRoomWidth"));
    if (c.maxRoomHeight > height || c.maxRoomHeight > limits.maxRoomDimension) diagnostics.push(diagnostic("settings.feasibility.invalid", "Maximum room height cannot fit within supported dimensions.", "maxRoomHeight"));
    if (c.corridorWidth > width || c.corridorWidth > height || c.corridorWidth > limits.maxCorridorWidth) diagnostics.push(diagnostic("settings.feasibility.invalid", "Corridor width cannot fit within supported dimensions.", "corridorWidth"));
    if (c.minPathLength > limits.maxPathLength) diagnostics.push(diagnostic("settings.limit.exceeded", "Minimum path length exceeds supported limits.", "minPathLength"));
    if (c.maxDeadEnds > limits.maxDeadEnds) diagnostics.push(diagnostic("settings.limit.exceeded", "Dead-end limit exceeds supported limits.", "maxDeadEnds"));
    cache.set(key, diagnostics); if (cache.size > 128) cache.delete(cache.keys().next().value!); return diagnostics;
  };
  return {
    validateFeasibility,
    resolveSeed(seedInput: string) { const explicit = seedInput.trim(); if (explicit) return { resolvedSeed: explicit, warnings: [] }; try { if (globalThis.crypto?.getRandomValues) { const values = new Uint32Array(4); globalThis.crypto.getRandomValues(values); return { resolvedSeed: Array.from(values, value => value.toString(16).padStart(8, "0")).join(""), warnings: [] }; } } catch { /* fallback below */ } return { resolvedSeed: `fallback-${Date.now().toString(36)}`, warnings: [{ code: "seed.entropy.fallback", message: "Cryptographic entropy was unavailable; a time-derived seed was used." } satisfies ProcessingWarning] }; },
    process(raw: RawSettings, limits: SupportedLimits, versions: VersionMetadata) { const constructed = createSettings(raw); if (!constructed.ok) return err(constructed.error); const feasibility = validateFeasibility(constructed.value, limits); if (feasibility.length) return err(feasibility); const seed = this.resolveSeed(constructed.value.seedInput); return ok({ request: { settings: constructed.value, resolvedSeed: seed.resolvedSeed, generatorId: "default-dungeon-generator", generatorVersion: versions.generatorVersion }, warnings: seed.warnings }); },
  };
}
