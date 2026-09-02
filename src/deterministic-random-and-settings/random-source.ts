import { err, ok } from "../domain-foundation/index.js";
import type { RandomDiagnostic, RandomSource, RandomState } from "./types.js";

function xmur3(input: string): number { let h = 1779033703 ^ input.length; for (let i = 0; i < input.length; i += 1) { h = Math.imul(h ^ input.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; }
function mulberry32(state: number): [number, number] { let t = (state + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), t | 1); r ^= r + Math.imul(r ^ (r >>> 7), r | 61); return [((r ^ (r >>> 14)) >>> 0) / 4_294_967_296, t]; }
export function createRandomSource(resolvedSeed: string): RandomSource {
  let state = xmur3(resolvedSeed); let drawCount = 0;
  const nextUnit = (): number => { const [value, next] = mulberry32(state); state = next; drawCount += 1; return value; };
  return {
    nextUnit,
    nextInteger(minInclusive, maxInclusive) {
      if (!Number.isInteger(minInclusive) || !Number.isInteger(maxInclusive) || minInclusive > maxInclusive) return err({ code: "random.range.invalid", message: "Integer bounds must be finite ordered integers.", field: "range" } satisfies RandomDiagnostic);
      return ok(minInclusive + Math.floor(nextUnit() * (maxInclusive - minInclusive + 1)));
    },
    choose<T>(values: readonly T[]) { if (values.length === 0) return err({ code: "random.choice.empty", message: "Cannot choose from an empty collection.", field: "values" } satisfies RandomDiagnostic); const choice = this.nextInteger(0, values.length - 1); return choice.ok ? ok(values[choice.value]!) : choice; },
    shuffle<T>(values: readonly T[]) { const copy = [...values]; for (let index = copy.length - 1; index > 0; index -= 1) { const target = Math.floor(nextUnit() * (index + 1)); [copy[index], copy[target]] = [copy[target]!, copy[index]!]; } return copy; },
    snapshot(): RandomState { return { resolvedSeed, drawCount }; },
  };
}
