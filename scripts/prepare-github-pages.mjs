import { access, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist/client");
const basePath = "/ma-aigc-portfolio";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".rsc", ".txt", ".xml"]);
const publicAssetPaths = [
  "/ai-series/assets/",
  "/ai-series/video/",
  "/ai-series/ai-series-entry-cover.webp",
  "/ai-visual/app-splash/",
  "/ai-visual/banners/",
  "/ai-visual/illustrations/",
  "/ai-visual/ip-vi/",
  "/ai-visual/posters/",
  "/ai-visual/typography/",
  "/ai-visual/ai-visual-entry-cover.webp",
  "/ma-zhongyu-profile.webp",
  "/og.webp",
  "/yibi-cover.webp",
  "/favicon.svg",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unprefixedAssetPattern(assetPath) {
  return new RegExp(
    `(?<!${escapeRegExp(basePath)})${escapeRegExp(assetPath)}`,
    "g",
  );
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

await access(path.join(outputDirectory, "index.html"));

const files = await collectFiles(outputDirectory);
let updatedFileCount = 0;

for (const file of files) {
  if (!textExtensions.has(path.extname(file))) continue;

  const original = await readFile(file, "utf8");
  let updated = original;

  for (const assetPath of publicAssetPaths) {
    updated = updated.replace(unprefixedAssetPattern(assetPath), `${basePath}${assetPath}`);
  }

  if (updated !== original) {
    await writeFile(file, updated, "utf8");
    updatedFileCount += 1;
  }
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, ".nojekyll"), "", "utf8");

const notFoundPath = path.join(outputDirectory, "404.html");
const notFoundHtml = await readFile(notFoundPath, "utf8");
const duplicateBasePathRecovery = `<script>(function(){var b="${basePath}";var d=b+b;if(location.pathname===d||location.pathname.startsWith(d+"/")){location.replace(b+location.pathname.slice(d.length)+location.search+location.hash)}})();</script>`;
if (!notFoundHtml.includes(duplicateBasePathRecovery)) {
  await writeFile(notFoundPath, notFoundHtml.replace("</head>", `${duplicateBasePathRecovery}</head>`), "utf8");
}

const remainingUnprefixed = [];
for (const file of files) {
  if (!textExtensions.has(path.extname(file))) continue;
  const contents = await readFile(file, "utf8");
  for (const assetPath of publicAssetPaths) {
    if (unprefixedAssetPattern(assetPath).test(contents)) {
      remainingUnprefixed.push(`${path.relative(outputDirectory, file)}: ${assetPath}`);
    }
  }
}

if (remainingUnprefixed.length > 0) {
  throw new Error(`Unprefixed public asset URLs remain:\n${remainingUnprefixed.join("\n")}`);
}

const nestedNextDirectory = path.join(outputDirectory, basePath.slice(1), "_next");
const rootNextDirectory = path.join(outputDirectory, "_next");
await rename(nestedNextDirectory, rootNextDirectory);
await rm(path.join(outputDirectory, basePath.slice(1)), { recursive: true, force: true });
await access(path.join(rootNextDirectory, "static"));

console.log(`Prepared GitHub Pages output in ${outputDirectory}. Updated ${updatedFileCount} files.`);
