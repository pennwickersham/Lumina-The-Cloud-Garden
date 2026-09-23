#!/usr/bin/env node
/**
 * Lumina ambience fetcher.
 *
 *   export FREESOUND_TOKEN=xxxxxxxx        (https://freesound.org/apiv2/apply/)
 *   npm run audio search           # candidates for every slot
 *   npm run audio search rain      # candidates for one slot
 *   npm run audio get rain 12345   # fetch + process that sound
 *   npm run audio:check            # report what is in www/audio
 *
 * npm swallows flags unless you separate them, so for CC-BY results say:
 *   npm run audio -- search rain --any
 *
 * A plain API token is enough: it returns the 128 kbps MP3 preview, which is
 * the quality we ship anyway. Full-resolution originals need OAuth2 and are
 * not worth the trouble here.
 *
 * Only CC0 results are offered by default, so nothing needs crediting.
 * Pass --any to include CC-BY; those must be credited in the app's About text.
 *
 * Processing needs ffmpeg on PATH. Each file ends up: 75 s (or the whole
 * sound, if shorter), mono, 112 kbps, 1 s fade in and out,
 * loudness-normalised, in www/audio/<slot>.mp3.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "www", "audio");
const TOKEN = process.env.FREESOUND_TOKEN;
const ANY = process.argv.includes("--any");

/* slot -> what we are after. Queries are deliberately plain; Freesound's
   search does better with nouns than with adjectives. Every word must
   match, so "no thunder" asks for thunder; "-thunder" leaves it out. */
const SLOTS = {
  "wind-soft":       { q: "gentle breeze", note: "Cloud Garden — soft high breeze" },
  "wind-pines":      { q: "wind pine trees forest", note: "Alpine Retreat — wind through conifers" },
  "cave-drips":      { q: "cave dripping", note: "Crystal Caverns — drips with echo" },
  "shore":           { q: "calm sea waves -gull -gulls -seagull", note: "Tidal Shallows — water on sand" },
  "springs":         { q: "small stream trickle water", note: "Hot Springs — trickling water" },
  "orchard-evening": { q: "evening summer insects field", note: "Orchard Shelf — evening insects" },
  "marsh":           { q: "frogs marsh", note: "Reed Bank — reeds, frogs" },
  "meadow-wind":     { q: "wind grass -city", note: "Windmill Rise — wind over grass" },
  "night-quiet":     { q: "crickets night", note: "Moon Garden — near silence" },
  "rain":            { q: "light rain -thunder", note: "Sanctuary Mode — soft rain" }
};

const LICENCE_FILTER = ANY
  ? '(license:"Creative Commons 0" OR license:"Attribution")'
  : 'license:"Creative Commons 0"';
// The API reports licences as URLs, and every one has a version such as
// "4.0" in it, so look for the CC0 path rather than a "0"
const isCC0 = lic => lic.includes("publicdomain/zero");

function need(cond, msg) { if (!cond) { console.error("\n" + msg + "\n"); process.exit(1); } }

async function api(path, params) {
  const u = new URL("https://freesound.org/apiv2" + path);
  Object.entries(params || {}).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { Authorization: "Token " + TOKEN } });
  if (!r.ok) throw new Error(`Freesound ${r.status} ${r.statusText} — ${await r.text()}`);
  return r.json();
}

async function search(slot) {
  const { q, note } = SLOTS[slot];
  const data = await api("/search/text/", {
    query: q,
    filter: `${LICENCE_FILTER} duration:[45 TO 400]`,
    sort: "score",   // relevance; rating order put popular off-topic sounds first
    fields: "id,name,duration,license,username,previews,avg_rating,num_ratings",
    page_size: 6
  });
  console.log(`\n${slot}.mp3  —  ${note}`);
  if (!data.results.length) { console.log("  nothing found; try --any or edit the query"); return; }
  data.results.forEach(s => {
    const lic = isCC0(s.license) ? "CC0" : "CC-BY (credit " + s.username + ")";
    console.log(
      `  ${String(s.id).padEnd(8)} ${Math.round(s.duration).toString().padStart(4)}s  ` +
      `${(s.avg_rating || 0).toFixed(1)}★(${s.num_ratings || 0})  ${lic}`);
    console.log(`           ${s.name.slice(0, 68)}`);
    console.log(`           listen: ${s.previews["preview-hq-mp3"]}`);
  });
  console.log(`  -> node scripts/fetch-audio.mjs get ${slot} <id>`);
}

async function get(slot, id) {
  need(SLOTS[slot], `Unknown slot "${slot}". One of: ${Object.keys(SLOTS).join(", ")}`);
  const s = await api(`/sounds/${id}/`, { fields: "id,name,license,username,previews,duration" });
  const url = s.previews["preview-hq-mp3"];
  console.log(`${slot}: "${s.name}" by ${s.username} (${s.license})`);
  try{ execFileSync("ffmpeg", ["-version"], {stdio:"ignore"}); }
  catch(e){ need(false, "ffmpeg is not on PATH. Install it first:\n" +
    "  macOS   brew install ffmpeg\n  Ubuntu  sudo apt install ffmpeg\n  Windows winget install Gyan.FFmpeg"); }

  mkdirSync(OUT, { recursive: true });
  const raw = join(OUT, `.raw-${slot}.mp3`);
  const buf = Buffer.from(await (await fetch(url, { headers: { Authorization: "Token " + TOKEN } })).arrayBuffer());
  writeFileSync(raw, buf);

  // 75 s from ten seconds in (skips the settling at the start of most field
  // recordings), mono, loudness-normalised, then faded in and out. The fades
  // go last: loudnorm can push a burst out at the very end of a file, which
  // clicks at the loop point. A sound shorter than 75 s is used whole, with
  // the fade-out timed from its real end.
  const dest = join(OUT, `${slot}.mp3`);
  const start = Math.min(10, Math.max(0, s.duration - 80));
  const len = Math.min(75, s.duration - start);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(start), "-t", String(len), "-i", raw,
    "-af", `loudnorm=I=-18:TP=-2:LRA=7,afade=t=in:st=0:d=1,afade=t=out:st=${len - 1}:d=1`,
    "-ac", "1", "-b:a", "112k", dest]);
  unlinkSync(raw);

  const kb = Math.round(statSync(dest).size / 1024);
  console.log(`  -> www/audio/${slot}.mp3  (${kb} KB)`);
  if (!isCC0(s.license)) {
    console.log(`  ! CC-BY: add "Ambience by ${s.username} (freesound.org)" to the app's credits`);
  }
}

function check() {
  const rows = Object.keys(SLOTS).concat("music");
  let total = 0;
  rows.forEach(slot => {
    const f = join(OUT, slot + ".mp3");
    if (existsSync(f)) { const kb = Math.round(statSync(f).size / 1024); total += kb;
      console.log(`  ${slot.padEnd(18)} ${String(kb).padStart(5)} KB`); }
    else console.log(`  ${slot.padEnd(18)}     — missing (the synthesised version plays)`);
  });
  console.log(`  ${"total".padEnd(18)} ${String(total).padStart(5)} KB added to the APK`);
  console.log("\n  npm run sync   to copy into the Android project");
}

const [cmd, a, b] = process.argv.slice(2).filter(x => !x.startsWith("--"));
if (cmd === "check") { check(); }
else {
  need(TOKEN, "Set FREESOUND_TOKEN first. Free key: https://freesound.org/apiv2/apply/");
  if (cmd === "search") {
    const slots = a ? [a] : Object.keys(SLOTS);
    for (const s of slots) { need(SLOTS[s], `Unknown slot "${s}"`); await search(s); }
  } else if (cmd === "get") {
    need(a && b, "Usage: node scripts/fetch-audio.mjs get <slot> <freesound-id>");
    await get(a, b);
  } else {
    console.log("Usage: npm run audio search [slot] | get <slot> <id>   |   npm run audio:check");
    console.log("       npm run audio -- search <slot> --any     (include CC-BY, needs crediting)");
    console.log("Slots: " + Object.keys(SLOTS).join(", "));
  }
}
