import type { Coordinate } from "./coordinate.js";
import type { MapDimensions } from "./dimensions.js";
import type { Corridor, Room } from "./geometry.js";
import type { TileGrid } from "./tile.js";

export interface DungeonCandidate {
  readonly dimensions: MapDimensions;
  readonly tiles: TileGrid;
  readonly rooms: ReadonlyArray<Room>;
  readonly corridors: ReadonlyArray<Corridor>;
  readonly entrance: Coordinate;
  readonly exit: Coordinate;
}

export interface Dungeon {
  readonly dimensions: MapDimensions;
  readonly tiles: TileGrid;
  readonly rooms: ReadonlyArray<Room>;
  readonly corridors: ReadonlyArray<Corridor>;
  readonly entrance: Coordinate;
  readonly exit: Coordinate;
}
