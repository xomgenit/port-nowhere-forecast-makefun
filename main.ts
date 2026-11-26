// Port Nowhere weather bulletin — make.fun one-line entry.
//
// The competition wants a single funny weather forecast for a city that
// does not exist. This program's whole job is to publish that one line
// into the output directory the grader reads, exactly as written, with
// no trailing newline so the byte count matches the character count.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";

// The bulletin itself: flat official phrasing, then the twist.
const bulletin =
  "Port Nowhere: 22 degrees, clear skies, and a 60% chance the town exists by Thursday.";

// Mirror of the sealed gate: UTF-8 text of 1 to 120 characters, not only
// white space. Keeping the check here means a bad edit to the line above
// is caught at build time instead of at grading time.
function gateOk(text: string): boolean {
  const chars = [...text].length;
  return chars >= 1 && chars <= 120 && text.trim().length > 0;
}

function publish(text: string): void {
  if (!gateOk(text)) {
    throw new Error(`bulletin fails the gate: ${[...text].length} chars`);
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");

  // Read the file back and demand byte-for-byte equality with the source
  // line; a mismatch here means the grader would read something else.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== text) {
    throw new Error("entry.txt on disk does not match the bulletin");
  }
}

publish(bulletin);
