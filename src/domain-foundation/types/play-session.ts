import type { Coordinate } from "./coordinate.js";

export interface PlaySessionState {
  readonly position: Coordinate;
  readonly completed: boolean;
}
