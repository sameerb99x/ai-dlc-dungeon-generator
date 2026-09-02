import { createDungeon, createPlaySession, err, ok, type Dungeon, type PlaySessionState, type RawSettings, type Result } from "../../domain-foundation/index.js";
import { createRandomSource, createSettingsProcessor, DEFAULT_SUPPORTED_LIMITS } from "../../deterministic-random-and-settings/index.js";

export type GenerationFailure = { readonly message: string };
export type GenerationSuccess = { readonly dungeon: Dungeon; readonly seed: string; readonly session: PlaySessionState };
export type GenerationOutcome = Result<GenerationSuccess, readonly GenerationFailure[]>;
export type Direction = "north" | "south" | "east" | "west";
const DELTAS: Record<Direction, readonly [number, number]> = { north: [0, 1], south: [0, -1], east: [1, 0], west: [-1, 0] };

const VERSIONS = { applicationVersion: "0.1.0-poc", generatorVersion: "1", formatVersion: "1" };
const ATTEMPTS = 12;

type MutableTile = { terrain: "walkable" | "blocked"; marker: "none" | "entrance" | "exit" };
type RoomShape = { x: number; y: number; width: number; height: number };

function overlaps(a: RoomShape, b: RoomShape): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function carve(grid: MutableTile[][], x: number, y: number): void {
  const row = grid[y]; const tile = row?.[x]; if (tile) tile.terrain = "walkable";
}

function connected(grid: MutableTile[][], start: { x: number; y: number }, end: { x: number; y: number }): boolean {
  const queue = [start]; const seen = new Set([`${start.x},${start.y}`]);
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index]; if (!current) continue;
    if (current.x === end.x && current.y === end.y) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const next = { x: current.x + dx, y: current.y + dy }; const tile = grid[next.y]?.[next.x]; const key = `${next.x},${next.y}`;
      if (tile?.terrain === "walkable" && !seen.has(key)) { seen.add(key); queue.push(next); }
    }
  }
  return false;
}

export function generate(raw: RawSettings): GenerationOutcome {
  const processed = createSettingsProcessor().process(raw, DEFAULT_SUPPORTED_LIMITS, VERSIONS);
  if (!processed.ok) return err(processed.error.map(diagnostic => ({ message: diagnostic.message })));
  const { request } = processed.value; const { width, height } = request.settings.dimensions; const c = request.settings.constraints;
  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    const random = createRandomSource(`${request.resolvedSeed}:${attempt}`);
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, (): MutableTile => ({ terrain: "blocked", marker: "none" })));
    const rooms: RoomShape[] = []; const target = Math.max(2, Math.min(8, Math.floor((width * height) / 350) + 2));
    for (let placement = 0; placement < target * 20 && rooms.length < target; placement += 1) {
      const roomWidth = random.nextInteger(c.minRoomWidth, Math.min(c.maxRoomWidth, width - 2));
      const roomHeight = random.nextInteger(c.minRoomHeight, Math.min(c.maxRoomHeight, height - 2));
      if (!roomWidth.ok || !roomHeight.ok) break;
      const x = random.nextInteger(1, width - roomWidth.value - 1); const y = random.nextInteger(1, height - roomHeight.value - 1);
      if (!x.ok || !y.ok) break; const room = { x: x.value, y: y.value, width: roomWidth.value, height: roomHeight.value };
      if (rooms.some(existing => overlaps(existing, room))) continue; rooms.push(room);
      for (let yy = room.y; yy < room.y + room.height; yy += 1) for (let xx = room.x; xx < room.x + room.width; xx += 1) carve(grid, xx, yy);
    }
    if (rooms.length < 2) continue;
    const centers = rooms.map(room => ({ x: room.x + Math.floor(room.width / 2), y: room.y + Math.floor(room.height / 2) })); const corridors = [] as Array<{ path: Array<{ x: number; y: number }> }>;
    for (let index = 1; index < centers.length; index += 1) {
      const from = centers[index - 1]!; const to = centers[index]!; const path = [from, { x: to.x, y: from.y }, to]; corridors.push({ path });
      for (let xx = Math.min(from.x, to.x); xx <= Math.max(from.x, to.x); xx += 1) carve(grid, xx, from.y);
      for (let yy = Math.min(from.y, to.y); yy <= Math.max(from.y, to.y); yy += 1) carve(grid, to.x, yy);
    }
    const entrance = centers[0]!; const exit = centers[centers.length - 1]!; grid[entrance.y]![entrance.x]!.marker = "entrance"; grid[exit.y]![exit.x]!.marker = "exit";
    if (!connected(grid, entrance, exit)) continue;
    const dungeon = createDungeon({ dimensions: { width, height }, tiles: grid, rooms, corridors, entrance, exit });
    if (!dungeon.ok) continue; const session = createPlaySession(dungeon.value); return ok({ dungeon: dungeon.value, seed: request.resolvedSeed, session });
  }
  return err([{ message: "Could not generate a playable dungeon. Try different settings or seed." }]);
}

export function move(dungeon: Dungeon, session: PlaySessionState, direction: Direction): PlaySessionState {
  if (session.completed) return session; const delta = DELTAS[direction];
  const position = { x: session.position.x + delta[0], y: session.position.y + delta[1] }; const tile = dungeon.tiles[position.y]?.[position.x];
  if (tile?.terrain !== "walkable") return session; return { position, completed: position.x === dungeon.exit.x && position.y === dungeon.exit.y };
}

export function reset(dungeon: Dungeon): PlaySessionState { return createPlaySession(dungeon); }
