import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
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
  return { application, infrastructure, tooling: true };
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
  return {
    selected,
    implemented: false,
    blocked:
      selected &&
      [...paths, ...tracked].some((path) => projectPath(domain, path)),
  };
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
  validateMap(manifest.overrides);
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

function runCommand(command, args) {
  const windowsNpm = process.platform === "win32" && command === "npm";
  const result = windowsNpm
    ? spawnSync(
        process.env.ComSpec ?? "cmd.exe",
        ["/d", "/s", "/c", `npm ${args.join(" ")}`],
        { stdio: "inherit" },
      )
    : spawnSync(command, args, { stdio: "inherit" });
  if (result.error || result.status !== 0) {
    throw new Error(
      `${command} failed; exit status ${result.status ?? "unavailable"}.`,
    );
  }
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
      ? "Angular/.NET build, application tests, API contracts and business coverage: **not implemented**. Approved projects and executable checks are required."
      : "Bicep lint/build/validation: **not implemented**. Approved templates and executable checks are required.",
  );
  report(
    "Deployment: **disabled**. No cloud authentication or resource changes.",
  );
  if (domain === "application") {
    report(
      "SAST and secret scanning: **not implemented by these workflows**; required separately. Tooling success is not release approval.",
    );
    runTooling(readPackages());
    report(
      "Repository lint, tooling tests and public-dependency audit: **passed**.",
    );
  }
  if (capability.blocked) {
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
