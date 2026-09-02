import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(process.cwd(), "src", "domain-foundation");

const FORBIDDEN_IMPORT_PATTERNS = [
  /from\s+["']react["']/,
  /from\s+["']react-dom["']/,
  /from\s+["']vite["']/,
  /from\s+["']@?\/?.*\/browser-presentation/,
  /from\s+["']@?\/?.*\/web-application/,
  /from\s+["']@?\/?.*\/application-core/,
];

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("domain-foundation import boundary", () => {
  it("does not import browser, UI, or later-unit modules", () => {
    const files = collectSourceFiles(ROOT);

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        expect(content, `${file} matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
