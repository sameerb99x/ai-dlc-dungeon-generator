import type {
  DungeonSettings,
  EffectiveGenerationRequest,
  RawSettings,
  SettingsDiagnostic,
  VersionMetadata,
} from "../domain-foundation/index.js";

export interface RandomState { readonly resolvedSeed: string; readonly drawCount: number }
export interface RandomDiagnostic { readonly code: "random.range.invalid" | "random.choice.empty"; readonly message: string; readonly field?: string }
export interface RandomSource {
  nextUnit(): number;
  nextInteger(minInclusive: number, maxInclusive: number): import("../domain-foundation/index.js").Result<number, RandomDiagnostic>;
  choose<T>(values: readonly T[]): import("../domain-foundation/index.js").Result<T, RandomDiagnostic>;
  shuffle<T>(values: readonly T[]): readonly T[];
  snapshot(): RandomState;
}
export interface SupportedLimits {
  readonly minDimension: number;
  readonly maxDimension: number;
  readonly maxTiles: number;
  readonly maxRoomDimension: number;
  readonly maxCorridorWidth: number;
  readonly maxPathLength: number;
  readonly maxDeadEnds: number;
}
export interface ProcessingWarning { readonly code: "seed.entropy.fallback"; readonly message: string }
export interface ProcessedSettings { readonly request: EffectiveGenerationRequest; readonly warnings: readonly ProcessingWarning[] }
export type SettingsProcessingOutcome = import("../domain-foundation/index.js").Result<ProcessedSettings, readonly SettingsDiagnostic[]>;
export interface SettingsProcessor {
  process(raw: RawSettings, limits: SupportedLimits, versions: VersionMetadata): SettingsProcessingOutcome;
  validateFeasibility(settings: DungeonSettings, limits: SupportedLimits): readonly SettingsDiagnostic[];
  resolveSeed(seedInput: string): { readonly resolvedSeed: string; readonly warnings: readonly ProcessingWarning[] };
}
export const DEFAULT_SUPPORTED_LIMITS: SupportedLimits = {
  minDimension: 10, maxDimension: 120, maxTiles: 14_400, maxRoomDimension: 120,
  maxCorridorWidth: 120, maxPathLength: 14_400, maxDeadEnds: 14_400,
};
