import { existsSync, mkdirSync, statSync } from "fs";
import { parseArgs } from "util";
// biome-ignore lint/correctness/useImportExtensions: should keep `.json` extension
import pkg from "./package.json";

type Target =
  | "bun-darwin-arm64"
  | "bun-darwin-x64"
  | "bun-linux-arm64"
  | "bun-linux-x64"
  | "bun-windows-x64";

const TARGETS: Record<string, Target> = {
  "darwin-arm64": "bun-darwin-arm64",
  "darwin-x64": "bun-darwin-x64",
  "linux-arm64": "bun-linux-arm64",
  "linux-x64": "bun-linux-x64",
  "windows-x64": "bun-windows-x64",
};

const OUT_DIR = "bin";
const OUT_FILE = "polys";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    target: { type: "string", short: "t" },
    all: { type: "boolean", short: "a" },
    outdir: { type: "string", short: "o", default: OUT_DIR },
  },
  strict: true,
});

async function build(target?: Target): Promise<boolean> {
  const start = performance.now();
  const outfile = target
    ? `${values.outdir}/polys-${target.replace("bun-", "")}`
    : `${values.outdir}/${OUT_FILE}`;

  const output = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./bin",
    target: "bun",
    minify: true,
    compile: {
      outfile: "polys",
    },
  });

  const elapsed = (performance.now() - start).toFixed(0);

  if (output.success) {
    const stats = statSync(outfile);
    const size = (stats.size / 1024 / 1024).toFixed(1);
    const name = outfile.split("/").pop();
    console.log(`  ${name} (${size} MB) [${elapsed}ms]`);
    return true;
  }

  const name = outfile.split("/").pop();
  console.error(`  Failed: ${name}`);
  for (const log of output.logs) {
    console.error(`    ${log.message}`);
  }
  return false;
}

async function main() {
  console.log(`Building ${pkg.name} v${pkg.version}\n`);

  if (!existsSync(values.outdir)) {
    mkdirSync(values.outdir, { recursive: true });
  }

  const targets: (Target | undefined)[] = [];

  if (values.all) {
    targets.push(...Object.values(TARGETS));
  } else if (values.target) {
    const target = TARGETS[values.target];
    if (!target) {
      console.error(`Unknown target: ${values.target}`);
      console.error(`Available: ${Object.keys(TARGETS).join(", ")}`);
      process.exit(1);
    }
    targets.push(target);
  } else {
    targets.push(undefined); // Current platform
  }

  const start = performance.now();
  const results = await Promise.all(targets.map(build));
  const elapsed = (performance.now() - start).toFixed(0);

  const success = results.filter(Boolean).length;
  const failed = results.length - success;

  console.log();
  if (failed === 0) {
    console.log(`Done in ${elapsed}ms`);
  } else {
    console.error(`${failed}/${results.length} builds failed`);
    process.exit(1);
  }
}

main();
