import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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
import {
  changedPaths,
  readiness,
  runTooling,
  selectChanges,
  validatePublicPackages,
} from "../../../.github/scripts/ci-foundation.mjs";

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

test("selects independent domains and conservative shared/configuration changes", () => {
  for (const [paths, application, infrastructure] of [
    [["src/frontend/new.ts"], true, false],
    [["src/backend/New.cs"], true, false],
    [["infra/main.bicep"], false, true],
    [["src/shared/contract.json"], true, true],
    [["tests/contract/example.json"], true, true],
    [["package-lock.json"], true, true],
    [[".github/workflows/application-ci.yml"], true, false],
    [[".github/workflows/infrastructure-ci.yml"], false, true],
    [[".github/scripts/ci-foundation.mjs"], true, true],
    [["README.md", "specs/001-example/spec.md"], false, false],
  ]) {
    assert.deepEqual(selectChanges(paths), {
      application,
      infrastructure,
      tooling: true,
    });
  }
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
    implemented: false,
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
    for (const action of workflow.matchAll(/uses: (.+)/g)) {
      assert.match(action[1], /^[\w/-]+@[0-9a-f]{40}(?:\s+#.*)?$/);
    }
  }
});
