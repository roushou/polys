import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "util";

const cleanupTarget = ["node_modules", "dist"] as const;

type CleanupTarget = (typeof cleanupTarget)[number];

const args = parseArgs({
  args: Bun.argv,
  options: {
    dist: {
      type: "boolean",
    },
    node_modules: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

const foldersToDelete: CleanupTarget[] = [];

if (!args.values.dist && !args.values.node_modules) {
  foldersToDelete.push("dist");
  foldersToDelete.push("node_modules");
} else {
  if (args.values.dist) {
    foldersToDelete.push("dist");
  }
  if (args.values.node_modules) {
    foldersToDelete.push("node_modules");
  }
}

async function findAndDelete(rootDirectory: string, depth = 0) {
  const maxDepth = 3;
  if (depth > maxDepth) return;

  try {
    const entries = await readdir(rootDirectory, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = join(rootDirectory, entry.name);

      if (foldersToDelete.includes(entry.name as CleanupTarget)) {
        console.log(`Deleting: ${fullPath}`);
        await rm(fullPath, { recursive: true, force: true });
      } else {
        await findAndDelete(fullPath, depth + 1);
      }
    }
  } catch (err) {
    console.error(`Could not read directory ${rootDirectory}:`, err);
  }
}

console.log(`Deleting: ${foldersToDelete.join(", ")}`);
console.log(`Root directory: ${process.cwd()}\n`);

await findAndDelete(process.cwd());

console.log("\nDone!");
