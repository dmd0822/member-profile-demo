import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { filesUnder } from "./file-system.mjs";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const sourceRoot = join(repositoryRoot, "src");
const testsRoot = join(repositoryRoot, "tests");
const frontendTestRoot = join(testsRoot, "unit", "frontend");
const backendTestRoot = join(testsRoot, "unit", "backend");
const testSourcePattern =
  /(?:\.spec\.ts|\.test\.(?:mjs|js|ts|cs)|\.?Tests\.cs)$/i;

function isTestSource(path) {
  return testSourcePattern.test(path);
}

function classifyTestCategory(path) {
  const normalizedPath = path.replaceAll("\\", "/");
  return normalizedPath.match(/^tests\/(unit|integration|contract)\//)?.[1];
}

function referencesBackendImplementation(manifest, sourceText) {
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  };
  const dependencyReference = Object.entries(dependencies).some(
    ([name, version]) =>
      /MemberProfile\.Backend/i.test(name) ||
      (typeof version === "string" &&
        /^file:/i.test(version) &&
        /backend/i.test(version)),
  );
  return (
    dependencyReference ||
    /(?:src\/backend|MemberProfile\.Backend(?:\.csproj)?)/i.test(
      sourceText.replaceAll("\\", "/"),
    )
  );
}

test("keeps a nonempty frontend and backend test suite outside src/", () => {
  const frontendTests = filesUnder(frontendTestRoot).filter(isTestSource);
  const backendTests = filesUnder(backendTestRoot).filter(isTestSource);

  assert.ok(frontendTests.length > 0, "frontend unit tests must be discovered");
  assert.ok(backendTests.length > 0, "backend unit tests must be discovered");
  assert.deepEqual(
    filesUnder(sourceRoot).filter(isTestSource),
    [],
    "test source files must not be under src/",
  );
});

test("accepts only the unit, integration, and contract test categories", () => {
  assert.equal(
    isTestSource("FoundationBoundaryTests.cs"),
    true,
    "MSTest source names ending in Tests.cs must be recognized",
  );

  const recognizedTests = filesUnder(testsRoot).filter(isTestSource);
  assert.ok(recognizedTests.length > 0, "repository test sources must exist");
  for (const path of recognizedTests) {
    const relativePath = relative(repositoryRoot, path).replaceAll("\\", "/");
    assert.ok(
      classifyTestCategory(relativePath),
      `test source uses an unsupported category: ${relativePath}`,
    );
  }

  assert.equal(
    classifyTestCategory("tests/unit/frontend/app-shell.spec.ts"),
    "unit",
  );
  assert.equal(
    classifyTestCategory("tests/integration/backend/store.test.cs"),
    "integration",
  );
  assert.equal(
    classifyTestCategory("tests/contract/api/example.test.mjs"),
    "contract",
  );
  assert.equal(
    classifyTestCategory("tests/frontend/app-shell.spec.ts"),
    undefined,
  );
});

test("does not add an unjustified shared library", () => {
  assert.equal(
    existsSync(join(sourceRoot, "shared")),
    false,
    "shared code requires an approved reuse requirement",
  );
});

test("the frontend does not reference backend implementation", () => {
  const manifest = JSON.parse(
    readFileSync(
      join(repositoryRoot, "src", "frontend", "package.json"),
      "utf8",
    ),
  );
  const frontendSource = filesUnder(
    join(repositoryRoot, "src", "frontend", "src"),
  )
    .filter((path) => [".ts", ".html"].includes(extname(path)))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  assert.equal(
    referencesBackendImplementation(manifest, frontendSource),
    false,
    "Angular must not depend on C# project or source files",
  );
  assert.equal(
    referencesBackendImplementation(
      { dependencies: { "MemberProfile.Backend": "1.0.0" } },
      "",
    ),
    true,
    "the dependency check must reject a backend project reference",
  );
  assert.equal(
    referencesBackendImplementation(
      {},
      "import type { Example } from '../../../src/backend/Example.cs';",
    ),
    true,
    "the source check must reject backend implementation imports",
  );
  assert.equal(
    referencesBackendImplementation(
      { dependencies: { "@angular/core": "22.2.5" } },
      "import { Component } from '@angular/core';",
    ),
    false,
    "approved frontend imports remain valid",
  );
});
