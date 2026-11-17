import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  changedPaths,
  readiness,
  runTooling,
  selectChanges,
  validatePublicPackages,
} from "../../../.github/scripts/ci-foundation.mjs";
import * as ciFoundation from "../../../.github/scripts/ci-foundation.mjs";

function packageFixture() {
  return {
    manifest: { devDependencies: { "synthetic-public-tool": "1.0.0" } },
    lock: {
      lockfileVersion: 3,
      packages: {
        "": { devDependencies: { "synthetic-public-tool": "1.0.0" } },
        "node_modules/synthetic-public-tool": {
          version: "1.0.0",
          integrity: "sha512-c3ludGhldGlj",
        },
      },
    },
    publicPackages: ["synthetic-public-tool"],
  };
}

test("selects expensive tooling only for source, unit tests and supporting configuration", () => {
  for (const [paths, application, infrastructure, tooling] of [
    [["src/frontend/new.ts"], true, false, true],
    [["src/backend/New.cs"], true, false, true],
    [["src/frontend/angular.json"], true, false, true],
    [["src/frontend/package-lock.json"], true, false, true],
    [["src/backend/MemberProfile.Backend.csproj"], true, false, true],
    [[".node-version"], true, true, true],
    [["global.json"], true, true, true],
    [["NuGet.Config"], true, true, true],
    [["tests/unit/tooling/new.test.mjs"], true, true, true],
    [["infra/main.bicep"], false, true, false],
    [["src/shared/contract.json"], true, true, true],
    [["tests/contract/example.json"], true, true, false],
    [["package-lock.json"], true, true, true],
    [["Directory.Build.props"], true, true, true],
    [[".github/workflows/application-ci.yml"], true, false, true],
    [[".github/workflows/infrastructure-ci.yml"], false, true, false],
    [[".github/scripts/ci-foundation.mjs"], true, true, true],
    [["README.md", "specs/001-example/spec.md"], false, false, false],
    [
      ["docs/architecture/overview.md", ".github/agents/example.md"],
      false,
      false,
      false,
    ],
  ]) {
    assert.deepEqual(selectChanges(paths), {
      application,
      infrastructure,
      tooling,
    });
  }
});

test("documentation-only application invocation completes without reading packages or running npm", (t) => {
  const root = mkdtempSync(join(tmpdir(), "ci-docs-only-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  git("init", "--quiet");
  git("config", "user.name", "Synthetic CI");
  git("config", "user.email", "synthetic@example.invalid");
  writeFileSync(join(root, "README.md"), "baseline");
  git("add", ".");
  git("commit", "--quiet", "-m", "baseline");
  const base = git("rev-parse", "HEAD");
  writeFileSync(join(root, "README.md"), "documentation-only change");
  git("commit", "--quiet", "-am", "docs");
  const result = spawnSync(
    process.execPath,
    [
      fileURLToPath(
        new URL("../../../.github/scripts/ci-foundation.mjs", import.meta.url),
      ),
      "application",
    ],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10000,
      env: {
        ...process.env,
        CI_EVENT: "pull_request",
        CI_BASE_SHA: base,
        CI_HEAD_SHA: git("rev-parse", "HEAD"),
        GITHUB_STEP_SUMMARY: "",
      },
    },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /not applicable/);
  assert.doesNotMatch(result.stdout, /audit: \*\*passed|added \d+ packages/);
});

test("compares Git changes including old and new names for a cross-domain rename", (t) => {
  const root = mkdtempSync(join(tmpdir(), "ci-foundation-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  git("init", "--quiet");
  git("config", "user.name", "Synthetic CI");
  git("config", "user.email", "synthetic@example.invalid");
  mkdirSync(join(root, "src", "backend"), { recursive: true });
  mkdirSync(join(root, "infra"));
  writeFileSync(join(root, "src", "backend", "Old.cs"), "synthetic");
  git("add", ".");
  git("commit", "--quiet", "-m", "baseline");
  const base = git("rev-parse", "HEAD");
  git("mv", join("src", "backend", "Old.cs"), join("infra", "main.bicep"));
  git("commit", "--quiet", "-m", "rename");
  const head = git("rev-parse", "HEAD");
  const runGit = (args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" });
  const paths = changedPaths({ base, head, runGit }).sort();
  assert.deepEqual(paths, ["infra/main.bicep", "src/backend/Old.cs"]);
  assert.deepEqual(selectChanges(paths), {
    application: true,
    infrastructure: true,
    tooling: true,
  });
  assert.deepEqual(changedPaths({ event: "workflow_dispatch", runGit }), [
    "infra/main.bicep",
  ]);
  git("rm", join("infra", "main.bicep"));
  git("commit", "--quiet", "-m", "delete last domain file");
  const deleted = changedPaths({
    base: head,
    head: git("rev-parse", "HEAD"),
    runGit,
  });
  assert.deepEqual(deleted, ["infra/main.bicep"]);
  assert.equal(readiness("infrastructure", deleted, []).blocked, true);
});

test("fails explicitly when the change comparison cannot be determined", () => {
  assert.throws(
    () =>
      changedPaths({
        base: "a".repeat(40),
        head: "b".repeat(40),
        runGit: () => {
          throw new Error("synthetic git failure");
        },
      }),
    /Cannot determine changed paths/,
  );
  assert.throws(
    () => changedPaths({ event: "pull_request", base: "", head: "" }),
    /Missing or invalid event revisions/,
  );
});

test("reports missing capabilities without blocking unrelated documentation", () => {
  assert.deepEqual(readiness("application", ["README.md"], []), {
    selected: false,
    implemented: true,
    codeqlWorkflowConfigured: true,
    codeqlEnforcementVerified: false,
    secretScanningImplemented: false,
    blocked: false,
  });
  assert.equal(
    readiness("application", ["src/backend/Deleted.cs"], []).blocked,
    true,
  );
  assert.equal(
    readiness("infrastructure", ["infra/main.bicep"], ["infra/main.bicep"])
      .blocked,
    true,
  );
  assert.equal(
    readiness("application", ["package.json"], ["src/backend/New.cs"]).blocked,
    true,
  );
  assert.equal(
    readiness("infrastructure", ["README.md"], ["infra/main.bicep"]).blocked,
    false,
  );
});

test("rejects vulnerable packages in the structured NuGet audit output", () => {
  assert.equal(typeof ciFoundation.assertNoVulnerabilities, "function");
  assert.doesNotThrow(() =>
    ciFoundation.assertNoVulnerabilities(
      JSON.stringify({
        version: 1,
        projects: [{ path: "synthetic.csproj" }],
      }),
    ),
  );
  assert.throws(
    () =>
      ciFoundation.assertNoVulnerabilities(
        JSON.stringify({
          version: 1,
          problems: [],
          projects: [
            {
              frameworks: [
                {
                  transitivePackages: [
                    {
                      id: "synthetic-package",
                      vulnerabilities: [
                        {
                          severity: "High",
                          advisoryurl: "https://example.invalid",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      ),
    /reported vulnerabilities/i,
  );
  assert.throws(
    () => ciFoundation.assertNoVulnerabilities("not json"),
    /could not be parsed/i,
  );
});

test("accepts portable locked public dependencies and preserves integrity", () => {
  const fixture = packageFixture();
  const before = structuredClone(fixture);
  validatePublicPackages(fixture);
  assert.deepEqual(fixture, before);
});

test("rejects unknown identities and unsupported sources before any npm command", () => {
  for (const mutate of [
    (f) => {
      f.manifest.devDependencies["synthetic-private-tool"] = "1.0.0";
    },
    (f) => {
      f.lock.packages["node_modules/@synthetic/private"] = {
        version: "1.0.0",
        integrity: "sha512-c3ludGhldGlj",
      };
    },
    (f) => {
      f.manifest.devDependencies["synthetic-public-tool"] =
        "npm:synthetic-private-tool@1.0.0";
    },
    (f) => {
      f.lock.packages["node_modules/synthetic-public-tool"].resolved =
        "https://synthetic.invalid/private.tgz";
    },
    (f) => {
      delete f.lock.packages["node_modules/synthetic-public-tool"].integrity;
    },
    (f) => {
      f.lock.packages[""].devDependencies["synthetic-public-tool"] = "2.0.0";
    },
    (f) => {
      f.manifest.overrides = {
        "synthetic-public-tool": "file:synthetic-private-tool",
      };
    },
    (f) => {
      f.manifest.workspaces = ["synthetic-private-workspace"];
    },
    (f) => {
      f.lock.packages["node_modules/synthetic-public-tool"].name =
        "synthetic-private-tool";
    },
  ]) {
    const fixture = packageFixture();
    mutate(fixture);
    const commands = [];
    assert.throws(
      () => runTooling(fixture, (...args) => commands.push(args), true),
      (error) =>
        /Package policy rejected/.test(error.message) &&
        !error.message.includes("synthetic"),
    );
    assert.deepEqual(commands, []);
  }
});

test("chooses the registry per environment and does not retry failed retrieval", () => {
  for (const [hosted, registry] of [
    [true, "https://registry.npmjs.org/"],
    [false, "https://packagefeedproxy.microsoft.io/npm/"],
  ]) {
    const commands = [];
    runTooling(packageFixture(), (...args) => commands.push(args), hosted);
    const restore = commands[0];
    assert.equal(restore[0], "npm");
    assert.ok(restore[1].includes(`--registry=${registry}`));
    assert.ok(restore[1].includes("--ignore-scripts"));
    assert.ok(restore[1].includes("--audit=false"));
    assert.ok(commands.some(([, args]) => args.includes("test:tooling")));
    assert.ok(commands.some(([, args]) => args.includes("test:foundation")));
    assert.ok(commands.some(([, args]) => args.includes("lint")));
    let attempts = 0;
    assert.throws(
      () =>
        runTooling(
          packageFixture(),
          () => {
            attempts++;
            throw new Error("synthetic feed unavailable");
          },
          hosted,
        ),
      /feed unavailable/,
    );
    assert.equal(attempts, 1);
  }
});

test("keeps both workflow checks unconditional, read-only and non-deploying", () => {
  for (const name of ["application", "infrastructure"]) {
    const workflow = readFileSync(
      new URL(`../../../.github/workflows/${name}-ci.yml`, import.meta.url),
      "utf8",
    );
    assert.match(workflow, /pull_request:/);
    assert.match(workflow, /workflow_dispatch:/);
    assert.match(workflow, /push:/);
    assert.match(workflow, /contents: read/);
    assert.match(workflow, /persist-credentials: false/);
    assert.match(workflow, /fetch-depth: 0/);
    assert.doesNotMatch(
      workflow,
      /paths:|paths-ignore:|pull_request_target|secrets\.|id-token:|azure\/|continue-on-error:|if:/,
    );
    assert.match(
      workflow,
      new RegExp(`node \\.github/scripts/ci-foundation\\.mjs ${name}`),
    );
    if (name === "application") {
      assert.match(workflow, /node-version-file: \.node-version/);
      assert.match(workflow, /global-json-file: global\.json/);
    }
    for (const action of workflow.matchAll(/uses: (.+)/g)) {
      assert.match(action[1], /^[\w/-]+@[0-9a-f]{40}(?:\s+#.*)?$/);
    }
  }
});

test("configures pinned CodeQL analysis for JavaScript/TypeScript and C#", () => {
  const workflow = readFileSync(
    new URL("../../../.github/workflows/application-ci.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /security-events:\s*write/);
  assert.match(
    workflow,
    /github\/codeql-action\/init@9418214df1f2c4b8128c770156c409013b07d6b9/,
  );
  assert.match(
    workflow,
    /github\/codeql-action\/analyze@9418214df1f2c4b8128c770156c409013b07d6b9/,
  );
  assert.match(workflow, /languages:\s*javascript-typescript,\s*csharp/);
  assert.match(workflow, /build-mode:\s*none/);
  assert.match(workflow, /queries:\s*security-extended/);
});

test("requires a frontend ESLint script and Angular-aware configuration", () => {
  const frontendPackage = JSON.parse(
    readFileSync(
      new URL("../../../src/frontend/package.json", import.meta.url),
      "utf8",
    ),
  );
  const lintConfig = readFileSync(
    new URL("../../../src/frontend/eslint.config.mjs", import.meta.url),
    "utf8",
  );
  assert.match(frontendPackage.scripts.lint, /\beslint\b/);
  assert.equal(
    frontendPackage.overrides["@typescript-eslint/typescript-estree"].minimatch,
    "11.0.1",
  );
  assert.match(lintConfig, /tsRecommended/);
  assert.match(lintConfig, /templateAccessibility/);
});

test("validates required projects and external suites before running application checks", (t) => {
  const root = mkdtempSync(join(tmpdir(), "application-projects-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of [
    ".node-version",
    "global.json",
    "src/frontend/eslint.config.mjs",
    "src/frontend/angular.json",
    "src/frontend/eslint.config.mjs",
    "src/frontend/package.json",
    "src/frontend/package-lock.json",
    "src/frontend/.npmrc",
    "src/backend/MemberProfile.Backend.csproj",
    "NuGet.Config",
    "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
    "tests/unit/frontend/tsconfig.spec.json",
    "tests/unit/frontend/vitest.config.mts",
    "tests/unit/frontend/app-shell.spec.ts",
    "tests/unit/backend/FoundationBoundaryTests.cs",
  ]) {
    const file = join(root, path);
    mkdirSync(join(file, ".."), { recursive: true });
    const contents =
      path === "NuGet.Config"
        ? '<configuration><packageSources><clear /><add key="approved-internal" value="https://packagefeedproxy.microsoft.io/nuget/v3/index.json" /></packageSources></configuration>'
        : path === "src/frontend/.npmrc"
          ? "registry=https://packagefeedproxy.microsoft.io/npm/\n"
          : "synthetic";
    writeFileSync(file, contents);
  }

  assert.equal(typeof ciFoundation.validateApplicationProjects, "function");
  ciFoundation.validateApplicationProjects(root);

  rmSync(join(root, "src/frontend/package-lock.json"));
  assert.throws(
    () => ciFoundation.validateApplicationProjects(root),
    /required application files are missing/i,
  );
});

test("requires nonzero test discovery from Angular and MSTest output", () => {
  assert.equal(typeof ciFoundation.assertTestsDiscovered, "function");
  assert.doesNotThrow(() =>
    ciFoundation.assertTestsDiscovered(
      "frontend",
      "Test Files 1 passed (1)\nTests 1 passed (1)",
    ),
  );
  assert.doesNotThrow(() =>
    ciFoundation.assertTestsDiscovered(
      "frontend",
      "\u001b[2m Tests \u001b[1m\u001b[32m1 passed\u001b[39m",
    ),
  );
  assert.doesNotThrow(() =>
    ciFoundation.assertTestsDiscovered(
      "backend",
      "Passed! - Failed: 0, Passed: 3, Skipped: 0, Total: 3",
    ),
  );
  assert.throws(
    () => ciFoundation.assertTestsDiscovered("frontend", "Tests 0"),
    /zero tests|no tests/i,
  );
  assert.throws(
    () =>
      ciFoundation.assertTestsDiscovered(
        "backend",
        "No test matches the given testcase filter",
      ),
    /zero tests|no tests/i,
  );
});

test("runs the Angular and .NET builds and requires both real test suites", () => {
  assert.equal(typeof ciFoundation.runApplicationChecks, "function");
  const commands = [];
  ciFoundation.runApplicationChecks({
    frontendPackages: packageFixture(),
    hosted: true,
    run: (command, args) => {
      commands.push([command, args]);
      if (command === "npm" && args.includes("test")) {
        return {
          status: 0,
          stdout: "Test Files 1 passed (1)\nTests 1 passed (1)",
        };
      }
      if (command === "dotnet" && args[0] === "test") {
        return {
          status: 0,
          stdout: "Passed! - Failed: 0, Passed: 3, Skipped: 0, Total: 3",
        };
      }
      if (command === "dotnet" && args[0] === "list") {
        return {
          status: 0,
          stdout: JSON.stringify({
            version: 1,
            problems: [],
            projects: [{ path: "synthetic.csproj", frameworks: [] }],
          }),
        };
      }
      return { status: 0, stdout: "" };
    },
  });

  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "npm" &&
        args.includes("audit") &&
        args.includes("--audit-level=high") &&
        args.includes("--registry=https://registry.npmjs.org/"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "dotnet" &&
        args[0] === "list" &&
        args.includes("--vulnerable") &&
        args.includes("--include-transitive") &&
        args.includes("--configfile"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "dotnet" &&
        args[0] === "format" &&
        args.includes("--verify-no-changes"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "npm" &&
        args.includes("--prefix") &&
        args.includes("src/frontend") &&
        args.includes("lint"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "npm" &&
        args.includes("--prefix") &&
        args.includes("src/frontend") &&
        args.includes("build"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "dotnet" &&
        args.includes("src/backend/MemberProfile.Backend.csproj") &&
        args.includes("build"),
    ),
  );
  assert.ok(
    commands.some(
      ([command, args]) =>
        command === "dotnet" &&
        args.includes(
          "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
        ) &&
        args[0] === "test",
    ),
  );
});

test("stops application validation when a dependency or formatting check fails", () => {
  for (const predicate of [
    (command, args) => command === "npm" && args.includes("lint"),
    (command, args) => command === "npm" && args.includes("audit"),
    (command, args) => command === "dotnet" && args[0] === "format",
  ]) {
    assert.throws(
      () =>
        ciFoundation.runApplicationChecks({
          frontendPackages: packageFixture(),
          hosted: true,
          run: (command, args) => {
            if (predicate(command, args)) {
              throw new Error("synthetic validation failure");
            }
            if (command === "npm" && args.includes("test")) {
              return {
                status: 0,
                stdout: "Tests 1 passed (1)",
              };
            }
            if (command === "dotnet" && args[0] === "test") {
              return {
                status: 0,
                stdout: "Passed! - Failed: 0, Passed: 3, Skipped: 0, Total: 3",
              };
            }
            if (command === "dotnet" && args[0] === "list") {
              return {
                status: 0,
                stdout: JSON.stringify({
                  version: 1,
                  problems: [],
                  projects: [{ path: "synthetic.csproj", frameworks: [] }],
                }),
              };
            }
            return { status: 0, stdout: "" };
          },
        }),
      /synthetic validation failure/,
    );
  }
});

test("stops application validation on a failed check or zero discovered tests", () => {
  assert.equal(typeof ciFoundation.runApplicationChecks, "function");
  const calls = [];
  assert.throws(
    () =>
      ciFoundation.runApplicationChecks({
        frontendPackages: packageFixture(),
        hosted: true,
        run: (command, args) => {
          calls.push([command, args]);
          if (command === "npm" && args.includes("build")) {
            throw new Error("synthetic build failure");
          }
          return { status: 0, stdout: "" };
        },
      }),
    /synthetic build failure/,
  );
  assert.ok(calls.length > 0);

  const zeroTestCalls = [];
  assert.throws(
    () =>
      ciFoundation.runApplicationChecks({
        frontendPackages: packageFixture(),
        hosted: true,
        run: (command, args) => {
          zeroTestCalls.push([command, args]);
          if (command === "npm" && args.includes("test")) {
            return { status: 0, stdout: "Test Files 0" };
          }
          return { status: 0, stdout: "" };
        },
      }),
    /zero tests|no tests/i,
  );
  assert.equal(
    zeroTestCalls.some(([, args]) => args[0] === "restore"),
    false,
    "backend retrieval must not proceed after zero frontend tests",
  );
});

test("validates the nested frontend lock against the public package inventory", () => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../../../src/frontend/package.json", import.meta.url),
      "utf8",
    ),
  );
  const lock = JSON.parse(
    readFileSync(
      new URL("../../../src/frontend/package-lock.json", import.meta.url),
      "utf8",
    ),
  );
  const publicPackages = JSON.parse(
    readFileSync(
      new URL("../../../.github/ci/public-npm-packages.json", import.meta.url),
      "utf8",
    ),
  );

  assert.doesNotThrow(() =>
    validatePublicPackages({ manifest, lock, publicPackages }),
  );
  assert.throws(
    () =>
      validatePublicPackages({
        manifest,
        lock,
        publicPackages: publicPackages.filter(
          (name) => name !== "@angular/core",
        ),
      }),
    /Package policy rejected/,
  );
});
