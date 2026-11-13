import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  checkMarkdown,
  findMarkdownFiles,
} from "../../../.github/scripts/check-markdown-links.mjs";

const docsDirectory = fileURLToPath(new URL("../../../docs/", import.meta.url));

test("loads shared scope after formatting and includes hidden project documentation", () => {
  const files = findMarkdownFiles().map((file) => file.replaceAll("\\", "/"));

  assert.ok(files.includes("README.md"));
  assert.ok(files.includes(".github/agents/csharp-expert.agent.md"));
  assert.ok(
    files.every(
      (file) =>
        !file.startsWith("node_modules/") &&
        !file.startsWith(".specify/") &&
        !file.startsWith(".github/skills/speckit-"),
    ),
  );
});

test("resolves local links relative to the document directory", async () => {
  const results = await checkMarkdown(
    "[License](../LICENSE)",
    docsDirectory,
    {},
  );

  assert.equal(results.length, 1);
  assert.equal(results[0].status, "alive");
});

test("reports a missing local target as a dead link", async () => {
  const results = await checkMarkdown(
    "[Missing](./missing-link-check-target.md)",
    docsDirectory,
    {},
  );

  assert.equal(results.length, 1);
  assert.equal(results[0].status, "dead");
});

test("checks anchors in the current document", async () => {
  const results = await checkMarkdown(
    "# Existing heading\n\n[Valid](#existing-heading)\n\n[Missing](#missing-heading)\n",
    docsDirectory,
    {},
  );

  assert.deepEqual(
    results.map(({ status }) => status),
    ["alive", "dead"],
  );
});
