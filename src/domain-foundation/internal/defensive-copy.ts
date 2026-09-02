import type { Coordinate } from "../types/coordinate.js";
import type { Corridor, Room } from "../types/geometry.js";
import type { Tile, TileGrid } from "../types/tile.js";

export function copyCoordinate(coordinate: Coordinate): Coordinate {
  return { x: coordinate.x, y: coordinate.y };
}

export function copyTile(tile: Tile): Tile {
  return { terrain: tile.terrain, marker: tile.marker };
}

export function copyTileGrid(tiles: TileGrid): TileGrid {
  return tiles.map((row) => row.map(copyTile));
}

export function copyRoom(room: Room): Room {
  return {
    x: room.x,
    y: room.y,
    width: room.width,
    height: room.height,
  };
}

export function copyCorridor(corridor: Corridor): Corridor {
  return {
    path: corridor.path.map((point) => ({ x: point.x, y: point.y })),
  };
}

export function copyRooms(rooms: ReadonlyArray<Room>): ReadonlyArray<Room> {
  return rooms.map(copyRoom);
}

export function copyCorridors(
  corridors: ReadonlyArray<Corridor>,
): ReadonlyArray<Corridor> {
  return corridors.map(copyCorridor);
}

export function copyReadonlyArray<T>(values: ReadonlyArray<T>): ReadonlyArray<T> {
  return [...values];
}
