import type { Marker } from "./marker.js";
import type { Terrain } from "./terrain.js";

export interface Tile {
  readonly terrain: Terrain;
  readonly marker: Marker;
}

export type TileGrid = ReadonlyArray<ReadonlyArray<Tile>>;
