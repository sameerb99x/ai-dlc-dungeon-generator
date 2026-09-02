import {
  coordinateInvalid,
} from "../internal/diagnostics.js";
import type { Coordinate } from "../types/coordinate.js";
import type { CoordinateDiagnostic } from "../types/diagnostics.js";
import type { Result } from "../types/result.js";
import { ok, err } from "../types/result.js";

function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

export function createCoordinate(
  x: number,
  y: number,
): Result<Coordinate, CoordinateDiagnostic> {
  if (!isInteger(x) || !isInteger(y)) {
    return err(
      coordinateInvalid("Coordinate components must be integers.", {
        field: !isInteger(x) ? "x" : "y",
      }),
    );
  }

  return ok({ x, y });
}
