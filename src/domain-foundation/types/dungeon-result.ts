import type { Dungeon } from "./dungeon.js";
import type { EffectiveGenerationRequest } from "./generation-request.js";
import type { ValidationReport } from "./validation.js";
import type { VersionMetadata } from "./version.js";

export interface DungeonResult {
  readonly dungeon: Dungeon;
  readonly request: EffectiveGenerationRequest;
  readonly report: ValidationReport;
  readonly versions: VersionMetadata;
}
