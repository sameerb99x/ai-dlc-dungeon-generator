import {
  dimensionInvalidForSettings,
  settingsInvalid,
} from "../internal/diagnostics.js";
import type { PlayabilityConstraints } from "../types/constraints.js";
import type { SettingsDiagnostic } from "../types/diagnostics.js";
import type { MapDimensions } from "../types/dimensions.js";
import type { Result } from "../types/result.js";
import { ok, err } from "../types/result.js";
import type { DungeonSettings, RawSettings } from "../types/settings.js";

const DEFAULTS = {
  minPathLength: 5,
  minRoomWidth: 3,
  minRoomHeight: 3,
  maxRoomWidth: 12,
  maxRoomHeight: 12,
  corridorWidth: 1,
  maxDeadEnds: 10,
} as const;

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function validateDimensions(
  width: number,
  height: number,
  diagnostics: SettingsDiagnostic[],
): boolean {
  if (!isPositiveInteger(width)) {
    diagnostics.push(
      dimensionInvalidForSettings("Width must be a positive integer.", { field: "width" }),
    );
  }
  if (!isPositiveInteger(height)) {
    diagnostics.push(
      dimensionInvalidForSettings("Height must be a positive integer.", { field: "height" }),
    );
  }
  return diagnostics.length === 0;
}

function validateConstraints(
  raw: RawSettings,
  diagnostics: SettingsDiagnostic[],
): PlayabilityConstraints | undefined {
  const minPathLength = raw.minPathLength ?? DEFAULTS.minPathLength;
  const minRoomWidth = raw.minRoomWidth ?? DEFAULTS.minRoomWidth;
  const minRoomHeight = raw.minRoomHeight ?? DEFAULTS.minRoomHeight;
  const maxRoomWidth = raw.maxRoomWidth ?? DEFAULTS.maxRoomWidth;
  const maxRoomHeight = raw.maxRoomHeight ?? DEFAULTS.maxRoomHeight;
  const corridorWidth = raw.corridorWidth ?? DEFAULTS.corridorWidth;
  const maxDeadEnds = raw.maxDeadEnds ?? DEFAULTS.maxDeadEnds;

  const values: Array<[string, number]> = [
    ["minPathLength", minPathLength],
    ["minRoomWidth", minRoomWidth],
    ["minRoomHeight", minRoomHeight],
    ["maxRoomWidth", maxRoomWidth],
    ["maxRoomHeight", maxRoomHeight],
    ["corridorWidth", corridorWidth],
    ["maxDeadEnds", maxDeadEnds],
  ];

  for (const [field, value] of values) {
    if (!Number.isInteger(value) || value < 0) {
      diagnostics.push(
        settingsInvalid(`${field} must be a non-negative integer.`, { field }),
      );
    }
  }

  if (minRoomWidth > maxRoomWidth) {
    diagnostics.push(
      settingsInvalid("minRoomWidth cannot exceed maxRoomWidth.", {
        field: "minRoomWidth",
      }),
    );
  }

  if (minRoomHeight > maxRoomHeight) {
    diagnostics.push(
      settingsInvalid("minRoomHeight cannot exceed maxRoomHeight.", {
        field: "minRoomHeight",
      }),
    );
  }

  if (corridorWidth < 1) {
    diagnostics.push(
      settingsInvalid("corridorWidth must be at least 1.", { field: "corridorWidth" }),
    );
  }

  if (diagnostics.length > 0) {
    return undefined;
  }

  return {
    minPathLength,
    minRoomWidth,
    minRoomHeight,
    maxRoomWidth,
    maxRoomHeight,
    corridorWidth,
    maxDeadEnds,
  };
}

export function createSettings(
  raw: RawSettings,
): Result<DungeonSettings, SettingsDiagnostic[]> {
  const diagnostics: SettingsDiagnostic[] = [];

  if (!validateDimensions(raw.width, raw.height, diagnostics)) {
    return err(diagnostics);
  }

  const constraints = validateConstraints(raw, diagnostics);
  if (!constraints) {
    return err(diagnostics);
  }

  const seedInput = raw.seedInput ?? "";
  if (typeof seedInput !== "string") {
    return err([
      settingsInvalid("seedInput must be a string.", { field: "seedInput" }),
    ]);
  }

  const dimensions: MapDimensions = {
    width: raw.width,
    height: raw.height,
  };

  return ok({
    dimensions,
    seedInput,
    constraints,
  });
}

export { DEFAULTS as SETTINGS_DEFAULTS };
