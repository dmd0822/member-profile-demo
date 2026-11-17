import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const internalRegistry = "https://packagefeedproxy.microsoft.io/npm/";
const publicRegistry = "https://registry.npmjs.org/";

export function selectChanges(paths) {
  let application = false;
  let infrastructure = false;
  for (const path of paths) {
    if (path === ".github/workflows/application-ci.yml") {
      application = true;
    } else if (path === ".github/workflows/infrastructure-ci.yml") {
      infrastructure = true;
    } else if (
      path.startsWith("src/shared/") ||
      path.startsWith("tests/") ||
      path.startsWith(".github/scripts/") ||
      path.startsWith(".github/ci/") ||
      path.startsWith(".github/workflows/") ||
      (!path.includes("/") && !path.endsWith(".md") && path !== "LICENSE")
    ) {
      application = infrastructure = true;
    } else if (path.startsWith("src/")) {
      application = true;
    } else if (path.startsWith("infra/")) {
      infrastructure = true;
    }
  }
  const tooling = paths.some(
    (path) =>
      path.startsWith("src/") ||
      path.startsWith("tests/unit/") ||
      path.startsWith(".github/scripts/") ||
      path.startsWith(".github/ci/") ||
      path === ".github/workflows/application-ci.yml" ||
      (!path.includes("/") && !path.endsWith(".md") && path !== "LICENSE"),
  );
  return { application, infrastructure, tooling };
}

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function changedPaths({ event, base, head, runGit = git } = {}) {
  if (
    event !== "workflow_dispatch" &&
    event !== undefined &&
    (!/^[a-f0-9]{40,64}$/.test(base ?? "") ||
      !/^[a-f0-9]{40,64}$/.test(head ?? ""))
  ) {
    throw new Error(
      "Missing or invalid event revisions; cannot select CI checks.",
    );
  }
  try {
    if (event === "workflow_dispatch" || !base || /^0+$/.test(base)) {
      return runGit(["ls-files", "-z"]).split("\0").filter(Boolean);
    }
    const ancestor = runGit(["merge-base", base, head]).trim();
    return runGit([
      "diff",
      "--name-only",
      "--no-renames",
      "-z",
      ancestor,
      head,
      "--",
    ])
      .split("\0")
      .filter(Boolean);
  } catch {
    throw new Error("Cannot determine changed paths; CI selection is blocked.");
  }
}

function projectPath(domain, path) {
  return domain === "application"
    ? path.startsWith("src/") ||
        (path.startsWith("tests/") && !path.startsWith("tests/unit/tooling/"))
    : path.startsWith("infra/");
}

export function readiness(domain, paths, tracked) {
  if (!["application", "infrastructure"].includes(domain)) {
    throw new Error("Unknown CI domain.");
  }
  const selected = selectChanges(paths)[domain];
  const implemented = domain === "application";
  const codeqlWorkflowConfigured = true;
  const codeqlEnforcementVerified = false;
  const secretScanningImplemented = false;
  return {
    selected,
    implemented,
    codeqlWorkflowConfigured,
    codeqlEnforcementVerified,
    secretScanningImplemented,
    blocked:
      (selected &&
        !implemented &&
        [...paths, ...tracked].some((path) => projectPath(domain, path))) ||
      (selected &&
        domain === "application" &&
        (!codeqlEnforcementVerified || !secretScanningImplemented)),
  };
}

const requiredApplicationFiles = [
  ".node-version",
  "global.json",
  "NuGet.Config",
  "src/frontend/.npmrc",
  "src/frontend/angular.json",
  "src/frontend/eslint.config.mjs",
  "src/frontend/package.json",
  "src/frontend/package-lock.json",
  "src/backend/MemberProfile.Backend.csproj",
  "tests/unit/frontend/tsconfig.spec.json",
  "tests/unit/frontend/vitest.config.mts",
  "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
];

function findTestSources(root, directory, pattern) {
  const pending = [resolve(root, directory)];
  const files = [];
  while (pending.length > 0) {
    const current = pending.pop();
    if (!existsSync(current)) continue;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (
          !["bin", "obj", "dist", "node_modules", ".angular"].includes(
            entry.name,
          )
        ) {
          pending.push(resolve(current, entry.name));
        }
      } else if (entry.isFile() && pattern.test(entry.name)) {
        files.push(resolve(current, entry.name));
      }
    }
  }
  return files;
}

export function validateApplicationProjects(root = process.cwd()) {
  const missing = requiredApplicationFiles.filter(
    (path) => !existsSync(resolve(root, path)),
  );
  const frontendTests = findTestSources(
    root,
    "tests/unit/frontend",
    /(?:\.spec|\.test)\.ts$/i,
  );
  const backendTests = findTestSources(
    root,
    "tests/unit/backend",
    /(?:\.test\.cs|Tests\.cs)$/i,
  );
  if (frontendTests.length === 0) {
    missing.push("tests/unit/frontend/<test source>");
  }
  if (backendTests.length === 0) {
    missing.push("tests/unit/backend/<test source>");
  }
  if (missing.length > 0) {
    throw new Error(
      `Required application files are missing: ${missing.join(", ")}.`,
    );
  }

  const nugetConfig = readFileSync(resolve(root, "NuGet.Config"), "utf8");
  const packageSources = nugetConfig.match(
    /<packageSources\b[^>]*>([\s\S]*?)<\/packageSources>/i,
  )?.[1];
  const sources = [
    ...(packageSources ?? "").matchAll(/\bvalue=["']([^"']+)["']/gi),
  ].map((match) => match[1]);
  if (
    !packageSources ||
    !/<clear\s*\/?>/i.test(packageSources) ||
    sources.length !== 1 ||
    sources[0] !== "https://packagefeedproxy.microsoft.io/nuget/v3/index.json"
  ) {
    throw new Error(
      "NuGet restore must clear other sources and use only the approved internal feed.",
    );
  }

  const npmrc = readFileSync(resolve(root, "src/frontend/.npmrc"), "utf8");
  if (
    !/^\s*registry=https:\/\/packagefeedproxy\.microsoft\.io\/npm\/\s*$/m.test(
      npmrc,
    )
  ) {
    throw new Error(
      "The frontend npm configuration must use the approved internal registry.",
    );
  }
}

export function validatePublicPackages({ manifest, lock, publicPackages }) {
  const reject = () => {
    throw new Error(
      "Package policy rejected: review public inventory, dependency sources, and portable lock before retrieval.",
    );
  };
  if (
    !Array.isArray(publicPackages) ||
    lock?.lockfileVersion !== 3 ||
    !lock.packages?.[""] ||
    !manifest ||
    manifest.workspaces !== undefined
  ) {
    reject();
  }
  const allowed = new Set(publicPackages);
  const validateMap = (map = {}) => {
    if (!map || typeof map !== "object" || Array.isArray(map)) reject();
    for (const [name, version] of Object.entries(map)) {
      if (
        !allowed.has(name) ||
        typeof version !== "string" ||
        !/^[a-zA-Z0-9.*~^<>=|+\s-]+$/.test(version)
      ) {
        reject();
      }
    }
  };
  const groups = [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
  ];
  for (const group of groups) {
    validateMap(manifest[group]);
    const normalized = (map) =>
      JSON.stringify(
        Object.entries(map ?? {}).sort(([a], [b]) => a.localeCompare(b)),
      );
    if (normalized(manifest[group]) !== normalized(lock.packages[""][group])) {
      reject();
    }
  }
  const validateOverrides = (overrides) => {
    if (
      !overrides ||
      typeof overrides !== "object" ||
      Array.isArray(overrides)
    ) {
      reject();
    }
    for (const [name, value] of Object.entries(overrides)) {
      if (!allowed.has(name)) reject();
      if (typeof value === "string") {
        if (!/^[a-zA-Z0-9.*~^<>=|+\s-]+$/.test(value)) reject();
      } else {
        validateOverrides(value);
      }
    }
  };
  if (manifest.overrides !== undefined) validateOverrides(manifest.overrides);
  for (const [path, entry] of Object.entries(lock.packages)) {
    for (const group of groups) validateMap(entry[group]);
    if (!path) continue;
    const name = path.split("node_modules/").at(-1);
    if (
      !path.startsWith("node_modules/") ||
      !allowed.has(name) ||
      (entry.name !== undefined && entry.name !== name) ||
      entry.resolved !== undefined ||
      entry.link ||
      !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(entry.version ?? "") ||
      !/^sha(?:1|256|384|512)-[A-Za-z0-9+/=]+$/.test(entry.integrity ?? "")
    ) {
      reject();
    }
  }
}

function readFrontendPackages() {
  try {
    return {
      manifest: JSON.parse(readFileSync("src/frontend/package.json", "utf8")),
      lock: JSON.parse(readFileSync("src/frontend/package-lock.json", "utf8")),
      publicPackages: JSON.parse(
        readFileSync(".github/ci/public-npm-packages.json", "utf8"),
      ),
    };
  } catch {
    throw new Error(
      "Cannot read frontend package policy documents; dependency retrieval is blocked.",
    );
  }
}

export function assertTestsDiscovered(domain, output) {
  const pattern =
    domain === "frontend"
      ? /\bTests\s+(\d+)\b/i
      : domain === "backend"
        ? /\bTotal:\s*(\d+)\b/i
        : undefined;
  if (!pattern) throw new Error("Unknown application test runner.");
  const plainOutput = output.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
  const count = Number(plainOutput.match(pattern)?.[1] ?? 0);
  if (count < 1) {
    throw new Error(
      `${domain} test runner reported zero tests or no discovery count.`,
    );
  }
}

export function assertNoVulnerabilities(output) {
  let audit;
  try {
    audit = JSON.parse(output);
  } catch {
    throw new Error("NuGet vulnerability audit output could not be parsed.");
  }
  if (
    (audit.problems !== undefined && !Array.isArray(audit.problems)) ||
    !Array.isArray(audit.projects) ||
    audit.projects.length === 0
  ) {
    throw new Error("NuGet vulnerability audit returned incomplete results.");
  }
  if (audit.problems?.length > 0) {
    throw new Error(
      "NuGet vulnerability audit reported an unavailable result.",
    );
  }

  const containsVulnerabilities = (value) => {
    if (Array.isArray(value)) {
      return value.some(containsVulnerabilities);
    }
    if (value === null || typeof value !== "object") {
      return false;
    }
    return Object.entries(value).some(
      ([key, nested]) =>
        (key.toLowerCase() === "vulnerabilities" &&
          Array.isArray(nested) &&
          nested.length > 0) ||
        containsVulnerabilities(nested),
    );
  };
  if (containsVulnerabilities(audit.projects)) {
    throw new Error("NuGet vulnerability audit reported vulnerabilities.");
  }
}

function execute(run, command, args) {
  const result = run(command, args);
  if (result?.error || (result?.status !== undefined && result.status !== 0)) {
    throw new Error(
      `${command} failed; exit status ${result.status ?? "unavailable"}.`,
    );
  }
  return `${result?.stdout ?? ""}\n${result?.stderr ?? ""}`;
}

export function runApplicationChecks({
  frontendPackages = readFrontendPackages(),
  run = runCommand,
  hosted = process.env.GITHUB_ACTIONS === "true",
  root = process.cwd(),
} = {}) {
  validateApplicationProjects(root);
  validatePublicPackages(frontendPackages);
  const registry = `--registry=${hosted ? publicRegistry : internalRegistry}`;
  execute(run, "npm", [
    "--prefix",
    "src/frontend",
    "ci",
    "--ignore-scripts",
    "--audit=false",
    "--fund=false",
    registry,
  ]);
  execute(run, "npm", ["--prefix", "src/frontend", "run", "lint"]);
  execute(run, "npm", [
    "--prefix",
    "src/frontend",
    "audit",
    "--audit-level=high",
    registry,
  ]);
  execute(run, "npm", ["--prefix", "src/frontend", "run", "build"]);
  const frontendOutput = execute(run, "npm", [
    "--prefix",
    "src/frontend",
    "run",
    "test",
  ]);
  assertTestsDiscovered("frontend", frontendOutput);
  execute(run, "dotnet", [
    "restore",
    "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
    "--configfile",
    "NuGet.Config",
  ]);
  const vulnerabilityOutput = execute(run, "dotnet", [
    "list",
    "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
    "package",
    "--vulnerable",
    "--include-transitive",
    "--format",
    "json",
    "--configfile",
    "NuGet.Config",
    "--no-restore",
  ]);
  assertNoVulnerabilities(vulnerabilityOutput);
  execute(run, "dotnet", [
    "format",
    "src/backend/MemberProfile.Backend.csproj",
    "--verify-no-changes",
    "--no-restore",
  ]);
  execute(run, "dotnet", [
    "format",
    "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
    "--verify-no-changes",
    "--no-restore",
  ]);
  execute(run, "dotnet", [
    "build",
    "src/backend/MemberProfile.Backend.csproj",
    "--configuration",
    "Release",
    "--no-restore",
  ]);
  const backendOutput = execute(run, "dotnet", [
    "test",
    "tests/unit/backend/MemberProfile.Backend.Tests.csproj",
    "--configuration",
    "Release",
    "--no-restore",
  ]);
  assertTestsDiscovered("backend", backendOutput);
}

function runCommand(command, args) {
  const windowsNpm = process.platform === "win32" && command === "npm";
  const result = windowsNpm
    ? spawnSync(
        process.env.ComSpec ?? "cmd.exe",
        ["/d", "/s", "/c", `npm ${args.join(" ")}`],
        { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
      )
    : spawnSync(command, args, {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
      });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    throw new Error(
      `${command} failed; exit status ${result.status ?? "unavailable"}.`,
    );
  }
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

export function runTooling(
  packages,
  run = runCommand,
  hosted = process.env.GITHUB_ACTIONS === "true",
) {
  validatePublicPackages(packages);
  const registry = `--registry=${hosted ? publicRegistry : internalRegistry}`;
  run("npm", [
    "ci",
    "--ignore-scripts",
    "--audit=false",
    "--fund=false",
    registry,
  ]);
  run("npm", ["run", "test:tooling"]);
  run("npm", ["run", "test:foundation"]);
  run("npm", ["run", "lint"]);
  run("npm", ["audit", "--audit-level=high", registry]);
}

function report(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`);
  }
}

function readPackages() {
  try {
    return {
      manifest: JSON.parse(readFileSync("package.json", "utf8")),
      lock: JSON.parse(readFileSync("package-lock.json", "utf8")),
      publicPackages: JSON.parse(
        readFileSync(".github/ci/public-npm-packages.json", "utf8"),
      ),
    };
  } catch {
    throw new Error(
      "Cannot read package policy documents; dependency retrieval is blocked.",
    );
  }
}

function main(domain) {
  const paths = changedPaths({
    event: process.env.CI_EVENT,
    base: process.env.CI_BASE_SHA,
    head: process.env.CI_HEAD_SHA,
  });
  const tracked = git(["ls-files", "-z"]).split("\0").filter(Boolean);
  const capability = readiness(domain, paths, tracked);
  report(
    `## ${domain === "application" ? "Application" : "Infrastructure"} CI foundation`,
  );
  report(
    `Domain validation selected by changes: **${capability.selected ? "yes" : "no"}**.`,
  );
  report(
    domain === "application"
      ? capability.selected
        ? "Angular/.NET builds and independent unit tests are selected for validation."
        : "Angular/.NET builds and unit tests: **not applicable** to this change."
      : "Bicep lint/build/validation: **not implemented**. Approved templates and executable checks are required.",
  );
  report(
    "Deployment: **disabled**. No cloud authentication or resource changes.",
  );
  if (domain === "application") {
    report(
      "CodeQL SAST is configured, but hosted analysis and repository enforcement are unverified. GitHub secret scanning and push protection remain **blocked** pending repository-admin configuration.",
    );
    if (capability.selected) {
      runApplicationChecks();
      report(
        "Angular/.NET builds, nonempty independent unit tests, dependency vulnerability checks, and .NET formatting: **passed**.",
      );
    }
    if (selectChanges(paths).tooling) {
      runTooling(readPackages());
      report(
        "Repository lint, tooling tests and public-dependency audit: **passed**.",
      );
    } else {
      report(
        "Repository tooling: **not applicable**. No source, unit-test, or supporting configuration changes; skipping dependency restore, lint, tests and audit.",
      );
    }
  }
  if (capability.blocked) {
    if (
      domain === "application" &&
      (!capability.codeqlEnforcementVerified ||
        !capability.secretScanningImplemented)
    ) {
      throw new Error(
        "Required CodeQL result enforcement and GitHub secret-scanning controls are not verified; configure CodeQL alert enforcement, secret scanning, and push protection before application changes can pass CI.",
      );
    }
    throw new Error(
      "Affected project validation is not implemented; add approved checks before introducing or changing domain files.",
    );
  }
  report(
    "Foundation checks complete. Unavailable project checks have not passed.",
  );
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? "")).href) {
  try {
    main(process.argv[2]);
  } catch (error) {
    report(`CI foundation **failed**: ${error.message}`);
    process.exitCode = 1;
  }
}
