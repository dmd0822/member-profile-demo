import { globSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import markdownLinkCheck from "markdown-link-check";
import markdownConfig from "../../.markdownlint-cli2.cjs";

const checkLinks = promisify(markdownLinkCheck);
const root = fileURLToPath(new URL("../../", import.meta.url));

export async function checkMarkdown(markdown, directory, options) {
  return checkLinks(markdown, {
    ...options,
    baseUrl: pathToFileURL(directory + sep).href,
  });
}

export function findMarkdownFiles() {
  const { globs, ignores } = markdownConfig;
  return globSync(globs, { cwd: root, exclude: ignores }).sort();
}

async function main() {
  const options = JSON.parse(
    readFileSync(resolve(root, ".markdown-link-check.json"), "utf8"),
  );
  const files = findMarkdownFiles();

  if (files.length === 0) {
    throw new Error("No Markdown files found; check the documentation globs.");
  }

  let failures = 0;
  for (const file of files) {
    const filename = resolve(root, file);
    const results = await checkMarkdown(
      readFileSync(filename, "utf8"),
      dirname(filename),
      options,
    );
    for (const result of results) {
      if (result.status !== "alive" && result.status !== "ignored") {
        console.error(
          `${file}: ${result.link} (${result.status}, status ${result.statusCode})`,
        );
        failures++;
      }
    }
  }

  console.log(
    `Checked links in ${files.length} Markdown files; ${failures} failed links.`,
  );
  return failures === 0 ? 0 : 1;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = await main();
}
