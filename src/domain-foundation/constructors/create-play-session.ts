import { copyCoordinate } from "../internal/defensive-copy.js";
import type { Dungeon } from "../types/dungeon.js";
import type { PlaySessionState } from "../types/play-session.js";

export function createPlaySession(dungeon: Dungeon): PlaySessionState {
  return {
    position: copyCoordinate(dungeon.entrance),
    completed: false,
  };
}
