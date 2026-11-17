import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ignoredDirectories = new Set([
  ".angular",
  "bin",
  "coverage",
  "dist",
  "node_modules",
  "obj",
]);

export function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : filesUnder(path);
    }
    return [path];
  });
}
