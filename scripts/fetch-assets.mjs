/**
 * Downloads the original design assets exported from the Figma file
 * ("Pet Paradise" design system) into public/assets/.
 *
 * Runs automatically before `npm run dev` / `npm run build` (see package.json).
 * Already-downloaded files are skipped, so it only does real work once.
 *
 * NOTE: Figma MCP asset URLs are valid for ~7 days after export. If a URL has
 * expired the script warns and continues — re-export from Figma if needed.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(__dirname, "assets-manifest.json"), "utf8"));
const outDir = join(__dirname, "..", "public", "assets");
mkdirSync(outDir, { recursive: true });

const entries = Object.entries(manifest);
let done = 0, skipped = 0, failed = 0;

async function fetchOne(file, url) {
  const dest = join(outDir, file);
  if (existsSync(dest) && statSync(dest).size > 0) { skipped++; return; }
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    done++;
  } catch (err) {
    failed++;
    console.warn(`  ⚠ could not fetch ${file}: ${err.message}`);
  }
}

const CONCURRENCY = 8;
for (let i = 0; i < entries.length; i += CONCURRENCY) {
  await Promise.all(entries.slice(i, i + CONCURRENCY).map(([f, u]) => fetchOne(f, u)));
}

console.log(`[helpet assets] downloaded ${done}, skipped ${skipped} (already present), failed ${failed}`);
if (failed > 0) {
  console.log("[helpet assets] some Figma asset URLs may have expired (7-day TTL). The site still runs; re-run after refreshing URLs to restore missing images.");
}
