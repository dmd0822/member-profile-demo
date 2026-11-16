import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

test("CLI exits after checking a redirect whose original response stays open", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "link-check-shutdown-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const checker = new URL(
    "../../../.github/scripts/check-markdown-links.mjs",
    import.meta.url,
  );
  const config = new URL("../../../.markdownlint-cli2.cjs", import.meta.url);
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
        import { createServer } from "node:http";
        import { writeFileSync } from "node:fs";
        import { fileURLToPath } from "node:url";
        import config from ${JSON.stringify(config.href)};
        const server = createServer((request, response) => {
          if (request.url === "/redirect") {
            response.writeHead(302, { location: "/target" });
            response.flushHeaders();
            const timer = setInterval(() => response.write("synthetic"), 50);
            response.on("close", () => clearInterval(timer));
          } else {
            response.end("synthetic");
          }
        });
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
        const fixture = ${JSON.stringify(join(directory, "fixture.md"))};
        writeFileSync(fixture, "[Synthetic](http://127.0.0.1:" + server.address().port + "/redirect)");
        config.globs = [fixture];
        config.ignores = [];
        process.argv[1] = fileURLToPath(${JSON.stringify(checker.href)});
        await import(${JSON.stringify(checker.href)});
        server.close();
      `,
    ],
    { encoding: "utf8", timeout: 5000 },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr + result.error);
  assert.match(result.stdout, /1 Markdown files; 0 failed links/);
});
