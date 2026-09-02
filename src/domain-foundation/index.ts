export { createCoordinate } from "./constructors/create-coordinate.js";
export { createSettings, SETTINGS_DEFAULTS } from "./constructors/create-settings.js";
export { createDungeon } from "./constructors/create-dungeon.js";
export { createPlaySession } from "./constructors/create-play-session.js";
export { dungeonsEqual } from "./compare/dungeons-equal.js";

export type { Result } from "./types/result.js";
export { ok, err } from "./types/result.js";

export type { Coordinate } from "./types/coordinate.js";
export type { MapDimensions } from "./types/dimensions.js";
export type { Terrain } from "./types/terrain.js";
export { TERRAIN_VALUES, isTerrain } from "./types/terrain.js";
export type { Marker } from "./types/marker.js";
export { MARKER_VALUES, isMarker } from "./types/marker.js";
export type { Tile, TileGrid } from "./types/tile.js";
export type { Room, Corridor } from "./types/geometry.js";
export type { PlayabilityConstraints } from "./types/constraints.js";
export type { DungeonSettings, RawSettings } from "./types/settings.js";
export type { Dungeon, DungeonCandidate } from "./types/dungeon.js";
export type { ValidationStatus, RuleResult, ValidationReport } from "./types/validation.js";
export type { EffectiveGenerationRequest } from "./types/generation-request.js";
export type { VersionMetadata } from "./types/version.js";
export type { DungeonResult } from "./types/dungeon-result.js";
export type { PlaySessionState } from "./types/play-session.js";
export type {
  CoordinateDiagnostic,
  SettingsDiagnostic,
  DomainDiagnostic,
  AnyDiagnostic,
} from "./types/diagnostics.js";
