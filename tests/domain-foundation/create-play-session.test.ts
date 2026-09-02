import { describe, expect, it } from "vitest";
import { createPlaySession } from "../../src/domain-foundation/index.js";
import { makeValidDungeon } from "./support/fixtures.js";

describe("createPlaySession", () => {
  it("starts at the entrance and is incomplete", () => {
    const dungeon = makeValidDungeon();
    const session = createPlaySession(dungeon);
    expect(session.position).toEqual(dungeon.entrance);
    expect(session.completed).toBe(false);
  });
});
