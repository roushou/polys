#!/usr/bin/env bun

import { parseArgs } from "util";
import { DATA_HELP, dataCommand } from "./commands/data/index.js";
import { GAMMA_HELP, gammaCommand } from "./commands/gamma/index.js";
import { formatOutput } from "./utils/output.js";
import { suggest } from "./utils/suggestion.js";

const MAIN_HELP = `Polymarket CLI

Usage: polys <API> <COMMAND> [OPTIONS]

APIs:
  data   Query user positions, trades, builders, holders
  gamma  Query events, markets, series, tags

Global Options:
  --base-url <url>   Override API base URL
  --timeout <ms>     Request timeout (default: 30000)
  --debug            Enable debug logging
  --json             Output raw JSON
  -h, --help         Print help

Run 'polys <API> --help' for API-specific commands.
`;

const APIS = ["data", "gamma"] as const;

type Api = (typeof APIS)[number];

function isApi(value: unknown): value is Api {
  if (typeof value !== "string" || value === null) {
    return false;
  }
  return APIS.includes(value as Api);
}

async function main() {
  const args = process.argv.slice(2);

  // Show main help if no args
  if (args.length === 0) {
    console.log(MAIN_HELP);
    process.exit(0);
  }

  const api = args[0];
  if (!api || !isApi(api)) {
    console.log(MAIN_HELP);
    process.exit(0);
  }

  // Handle --help at any position
  if (args.includes("--help") || args.includes("-h")) {
    if (api === "data") {
      console.log(DATA_HELP);
    } else if (api === "gamma") {
      console.log(GAMMA_HELP);
    }
    process.exit(0);
  }

  // Parse global options
  const { values } = parseArgs({
    args,
    options: {
      "base-url": { type: "string" },
      timeout: { type: "string" },
      debug: { type: "boolean", default: false },
      json: { type: "boolean", default: false },
    },
    allowPositionals: true,
    allowNegative: true,
    strict: false, // Allow unknown options to pass through to commands
  });

  const globalConfig = {
    baseUrl: values["base-url"] as string | undefined,
    timeoutMs: values.timeout
      ? Number.parseInt(values.timeout as string, 10)
      : undefined,
    debug: values.debug as boolean,
    json: values.json as boolean,
  };

  // Pass remaining args (after API name) to command
  const commandArgs = args.slice(1);

  try {
    let result: unknown;

    switch (api) {
      case "data":
        result = await dataCommand(commandArgs, globalConfig);
        break;

      case "gamma":
        result = await gammaCommand(commandArgs, globalConfig);
        break;

      default: {
        const suggestion = suggest(api, APIS);
        console.error(`Unknown command: ${api}`);
        if (suggestion) {
          console.error(`Did you mean: polys ${suggestion}?\n`);
        }
        console.log("Available APIs: data, gamma");
        console.log("Run 'polys --help' for usage information.");
        process.exit(1);
      }
    }

    formatOutput(result, globalConfig.json);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("SHOW_HELP:")) {
        const helpType = error.message.replace("SHOW_HELP:", "");
        if (helpType === "data") console.log(DATA_HELP);
        else if (helpType === "gamma") console.log(GAMMA_HELP);
        process.exit(0);
      }

      console.error(`error: ${error.message}`);
      if (globalConfig.debug) {
        console.error(error.stack);
      }
    } else {
      console.error("An unexpected error occurred");
    }
    process.exit(1);
  }
}

main();
