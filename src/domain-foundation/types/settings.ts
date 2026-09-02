import type { PlayabilityConstraints } from "./constraints.js";
import type { MapDimensions } from "./dimensions.js";

export interface DungeonSettings {
  readonly dimensions: MapDimensions;
  readonly seedInput: string;
  readonly constraints: PlayabilityConstraints;
}

/** Parsed-but-not-yet-normalized settings input for U1 local validation. */
export interface RawSettings {
  readonly width: number;
  readonly height: number;
  readonly seedInput?: string;
  readonly minPathLength?: number;
  readonly minRoomWidth?: number;
  readonly minRoomHeight?: number;
  readonly maxRoomWidth?: number;
  readonly maxRoomHeight?: number;
  readonly corridorWidth?: number;
  readonly maxDeadEnds?: number;
}
