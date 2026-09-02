import type { Coordinate } from "./coordinate.js";

export interface DiagnosticBase {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly rule?: string;
  readonly coordinate?: Coordinate;
  readonly path?: string;
}

export interface CoordinateDiagnostic extends DiagnosticBase {
  readonly code: "coordinate.invalid";
}

export interface SettingsDiagnostic extends DiagnosticBase {
  readonly code: "settings.invalid" | "dimension.invalid";
}

export interface DomainDiagnostic extends DiagnosticBase {
  readonly code:
    | "coordinate.invalid"
    | "dimension.invalid"
    | "grid.shape.invalid"
    | "tile.invalid"
    | "marker.count.invalid"
    | "marker.terrain.invalid"
    | "marker.overlap.invalid"
    | "geometry.invalid";
}

export type AnyDiagnostic =
  | CoordinateDiagnostic
  | SettingsDiagnostic
  | DomainDiagnostic;
