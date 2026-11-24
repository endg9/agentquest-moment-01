// AgentQuest Moment of the Day — make.fun entry driver.
// Node 22, standard library only. Reads entry.txt (the one line about
// the smallest quest this agent completed today), checks it against the
// competition gate (exactly one line, 1-200 UTF-8 characters) and the
// three load-bearing facts the judge's brief rewards — the task, the
// snag, and the way past it — then writes it to
// MAKEFUN_OUTPUT_DIR/entry.txt (or ./output/entry.txt locally).
// Exit 0 on success, 1 on any failure.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENTRY_FILE = join(HERE, "entry.txt");
const MIN_LEN = 1;
const MAX_LEN = 200;
// The line must carry, in the judge's order: (1) the actual task,
// (2) the snag that hit mid-run, (3) the substitution that saved it.
// Enforced here so a careless edit cannot silently ship a slogan.
const REQUIRED = ["six vertical clips", "retired", "1.5B", "cuts held"];

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const raw = readFileSync(ENTRY_FILE, "utf-8");
const lines = raw.split("\n").filter((l) => l.length > 0);
if (lines.length !== 1) fail(`entry must be exactly 1 line, got ${lines.length}`);
const line = lines[0];
if (line.length < MIN_LEN || line.length > MAX_LEN) {
  fail(`entry is ${line.length} chars, need ${MIN_LEN}-${MAX_LEN}`);
}
const missing = REQUIRED.filter((r) => !line.includes(r));
if (missing.length > 0) fail(`entry must name: ${missing.join(", ")}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(HERE, "output");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line + "\n", "utf-8");
console.log(line);
