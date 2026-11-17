import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { filesUnder } from "./file-system.mjs";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const sourceRoot = join(repositoryRoot, "src");
const infrastructureRoot = join(repositoryRoot, "infra");
const runtimeExtensions = new Set([
  ".cs",
  ".csproj",
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
]);
const infrastructureExtensions = new Set([".bicep", ".bicepparam", ".tf"]);

function directoriesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function isDirectory(path) {
  return existsSync(path) && statSync(path).isDirectory();
}

function isTestSource(path) {
  return /\.(?:spec|test)\.[^.]+$/i.test(path);
}

test("defines exactly one frontend and one backend application project", () => {
  assert.deepEqual(directoriesUnder(sourceRoot), ["backend", "frontend"]);
  assert.ok(
    existsSync(join(sourceRoot, "frontend", "package.json")),
    "the Angular project manifest must be under src/frontend/",
  );
  assert.ok(
    existsSync(join(sourceRoot, "frontend", "angular.json")),
    "the Angular workspace must be under src/frontend/",
  );
  assert.ok(
    existsSync(join(sourceRoot, "backend", "MemberProfile.Backend.csproj")),
    "the .NET backend project must be under src/backend/",
  );
});

test("keeps frontend and backend responsibilities distinct and tests external", () => {
  for (const directory of [
    "frontend/src/app/components",
    "frontend/src/app/pages",
    "frontend/src/app/services",
    "backend/Api",
    "backend/Services",
    "backend/Models",
  ]) {
    assert.ok(
      isDirectory(join(sourceRoot, directory)),
      `required responsibility directory is missing: src/${directory}`,
    );
  }

  const projectFiles = filesUnder(sourceRoot);
  assert.deepEqual(
    projectFiles.filter(isTestSource).map((path) => relative(sourceRoot, path)),
    [],
    "test sources must stay outside src/",
  );
});

test("keeps application runtime and infrastructure files in separate roots", () => {
  const sourceFiles = filesUnder(sourceRoot);
  assert.deepEqual(
    sourceFiles
      .filter(
        (path) =>
          infrastructureExtensions.has(extname(path)) ||
          path.endsWith(".tf.json"),
      )
      .map((path) => relative(sourceRoot, path)),
    [],
    "infrastructure definitions must not be under src/",
  );
  assert.deepEqual(
    filesUnder(infrastructureRoot)
      .filter((path) => runtimeExtensions.has(extname(path)))
      .map((path) => relative(infrastructureRoot, path)),
    [],
    "application runtime files must not be under infra/",
  );
});

test("does not add speculative shared libraries or member behavior", () => {
  assert.equal(
    existsSync(join(sourceRoot, "shared")),
    false,
    "src/shared/ requires an approved cross-project reuse need",
  );

  const backendSources = filesUnder(join(sourceRoot, "backend")).filter(
    (path) => extname(path) === ".cs",
  );
  assert.deepEqual(
    backendSources.map((path) => relative(repositoryRoot, path)),
    [],
    "the foundation must not add backend sample classes or member behavior",
  );

  const frontendFiles = filesUnder(join(sourceRoot, "frontend"));
  const featureFiles = frontendFiles.filter((path) => {
    const appPath = relative(
      join(sourceRoot, "frontend", "src", "app"),
      path,
    ).replaceAll("\\", "/");
    return (
      (appPath.startsWith("pages/") || appPath.startsWith("services/")) &&
      runtimeExtensions.has(extname(path))
    );
  });
  assert.deepEqual(
    featureFiles.map((path) => relative(repositoryRoot, path)),
    [],
    "member pages and API services are outside the approved foundation scope",
  );

  const behaviorPattern =
    /\b(?:HttpClient|provideHttpClient|fetch\s*\(|CanActivate|CanMatch|login|enrollment|membership|MemberProfileService)\b/i;
  const behaviorFiles = frontendFiles
    .filter((path) => [".ts", ".html"].includes(extname(path)))
    .filter((path) => behaviorPattern.test(readFileSync(path, "utf8")));
  assert.deepEqual(
    behaviorFiles.map((path) => relative(repositoryRoot, path)),
    [],
    "frontend source must not implement identity, API, or member workflows",
  );
});
