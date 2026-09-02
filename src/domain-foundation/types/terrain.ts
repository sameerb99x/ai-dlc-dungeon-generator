export type Terrain = "walkable" | "blocked";

export const TERRAIN_VALUES: readonly Terrain[] = ["walkable", "blocked"] as const;

export function isTerrain(value: unknown): value is Terrain {
  return value === "walkable" || value === "blocked";
}
