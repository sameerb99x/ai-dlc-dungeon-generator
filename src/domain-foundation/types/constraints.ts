export interface PlayabilityConstraints {
  readonly minPathLength: number;
  readonly minRoomWidth: number;
  readonly minRoomHeight: number;
  readonly maxRoomWidth: number;
  readonly maxRoomHeight: number;
  readonly corridorWidth: number;
  readonly maxDeadEnds: number;
}
