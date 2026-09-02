export type Marker = "none" | "entrance" | "exit";

export const MARKER_VALUES: readonly Marker[] = ["none", "entrance", "exit"] as const;

export function isMarker(value: unknown): value is Marker {
  return value === "none" || value === "entrance" || value === "exit";
}
