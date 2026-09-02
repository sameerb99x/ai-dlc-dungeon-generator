import type { Coordinate } from "../types/coordinate.js";
import type {
  CoordinateDiagnostic,
  DomainDiagnostic,
  SettingsDiagnostic,
} from "../types/diagnostics.js";

type DiagnosticOptions = {
  readonly field?: string;
  readonly rule?: string;
  readonly coordinate?: Coordinate;
  readonly path?: string;
};

function baseDiagnostic(
  code: DomainDiagnostic["code"] | SettingsDiagnostic["code"],
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic | SettingsDiagnostic {
  return {
    code,
    message,
    ...(options.field !== undefined ? { field: options.field } : {}),
    ...(options.rule !== undefined ? { rule: options.rule } : {}),
    ...(options.coordinate !== undefined
      ? { coordinate: { x: options.coordinate.x, y: options.coordinate.y } }
      : {}),
    ...(options.path !== undefined ? { path: options.path } : {}),
  };
}

export function coordinateInvalid(
  message: string,
  options: DiagnosticOptions = {},
): CoordinateDiagnostic {
  return {
    ...baseDiagnostic("coordinate.invalid", message, options),
    code: "coordinate.invalid",
  };
}

export function dimensionInvalidForDomain(
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic {
  return {
    ...baseDiagnostic("dimension.invalid", message, options),
    code: "dimension.invalid",
  };
}

export function dimensionInvalidForSettings(
  message: string,
  options: DiagnosticOptions = {},
): SettingsDiagnostic {
  return {
    ...baseDiagnostic("dimension.invalid", message, options),
    code: "dimension.invalid",
  };
}

export function settingsInvalid(
  message: string,
  options: DiagnosticOptions = {},
): SettingsDiagnostic {
  return {
    ...baseDiagnostic("settings.invalid", message, options),
    code: "settings.invalid",
  };
}

export function gridShapeInvalid(
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic {
  return {
    ...baseDiagnostic("grid.shape.invalid", message, options),
    code: "grid.shape.invalid",
  };
}

export function tileInvalid(
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic {
  return {
    ...baseDiagnostic("tile.invalid", message, options),
    code: "tile.invalid",
  };
}

export function markerCountInvalid(
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic {
  return {
    ...baseDiagnostic("marker.count.invalid", message, options),
    code: "marker.count.invalid",
  };
}

export function markerTerrainInvalid(
  message: string,
  options: Coordinate,
): DomainDiagnostic {
  return {
    ...baseDiagnostic("marker.terrain.invalid", message, { coordinate: options }),
    code: "marker.terrain.invalid",
  };
}

export function markerOverlapInvalid(message: string): DomainDiagnostic {
  return {
    ...baseDiagnostic("marker.overlap.invalid", message),
    code: "marker.overlap.invalid",
  };
}

export function geometryInvalid(
  message: string,
  options: DiagnosticOptions = {},
): DomainDiagnostic {
  return {
    ...baseDiagnostic("geometry.invalid", message, options),
    code: "geometry.invalid",
  };
}
