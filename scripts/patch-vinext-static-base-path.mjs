import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const prerenderFile = path.resolve("node_modules/vinext/dist/build/prerender.js");
const original = await readFile(prerenderFile, "utf8");
const oldCode = "const url = `http://127.0.0.1:${renderPorts[renderRoundRobin++ % renderPorts.length]}${parsed.pathname}${parsed.search}`;";
const previousPatch = [
  "const requestedPathname = config.basePath && parsed.pathname !== config.basePath && !parsed.pathname.startsWith(config.basePath + \"/\")",
  "\t\t\t\t? `${config.basePath}${parsed.pathname}`",
  "\t\t\t\t: parsed.pathname;",
  "\t\t\tconst url = `http://127.0.0.1:${renderPorts[renderRoundRobin++ % renderPorts.length]}${requestedPathname}${parsed.search}`;",
].join("\n\t\t\t");
const newCode = [
  "const basePathname = config.basePath && parsed.pathname !== config.basePath && !parsed.pathname.startsWith(config.basePath + \"/\")",
  "\t\t\t\t? `${config.basePath}${parsed.pathname}`",
  "\t\t\t\t: parsed.pathname;",
  "\t\t\tconst requestedPathname = config.trailingSlash && basePathname !== \"/\" && !basePathname.endsWith(\"/\")",
  "\t\t\t\t? `${basePathname}/`",
  "\t\t\t\t: basePathname;",
  "\t\t\tconst url = `http://127.0.0.1:${renderPorts[renderRoundRobin++ % renderPorts.length]}${requestedPathname}${parsed.search}`;",
].join("\n\t\t\t");

if (original.includes(newCode)) {
  console.log("Vinext static base-path patch is already applied.");
} else if (original.includes(oldCode)) {
  await writeFile(prerenderFile, original.replace(oldCode, newCode), "utf8");
  console.log("Applied Vinext static base-path prerender patch.");
} else if (original.includes(previousPatch)) {
  await writeFile(prerenderFile, original.replace(previousPatch, newCode), "utf8");
  console.log("Updated Vinext static base-path prerender patch.");
} else {
  throw new Error("Vinext prerender implementation changed; refusing to apply an unsafe patch.");
}
