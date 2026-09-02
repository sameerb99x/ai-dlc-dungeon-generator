export interface Room {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Corridor {
  /** Ordered path vertices in bottom-left coordinate space. */
  readonly path: ReadonlyArray<{ readonly x: number; readonly y: number }>;
}
