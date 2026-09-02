import type { DungeonSettings } from "./settings.js";

export interface EffectiveGenerationRequest {
  readonly settings: DungeonSettings;
  readonly resolvedSeed: string;
  readonly generatorId: string;
  readonly generatorVersion: string;
}
