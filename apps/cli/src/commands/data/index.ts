import type {
  Data,
  SortBy,
  SortDirection,
  TimePeriod,
  TradeSide,
} from "@dicedhq/data";
import { Data as DataClient } from "@dicedhq/data";
import { parseArgs } from "util";
import { suggest } from "../../utils/suggestion.js";

export const DATA_HELP = `Query Polymarket Data API

Usage: polys data <COMMAND>

Commands:
  health         Check API health status
  positions      Query user positions
  trades         Query trades
  activity       Query user activity
  values         Get position values
  closed         Query closed positions
  traded         Get traded markets count by user
  builders       Query builder leaderboard
  volume         Query builder volume time series
  holders        Query top holders for markets
  open-interest  Get open interest for markets
  live-volume    Get live volume for an event

Options:
  -h, --help     Print help
`;

const COMMANDS = {
  health: "Check API health status",
  positions: "Query user positions",
  trades: "Query trades",
  activity: "Query user activity",
  values: "Get position values",
  closed: "Query closed positions",
  traded: "Get traded markets count by user",
  builders: "Query builder leaderboard",
  volume: "Query builder volume time series",
  holders: "Query top holders for markets",
  "open-interest": "Get open interest for markets",
  "live-volume": "Get live volume for an event",
} as const;

type GlobalConfig = {
  baseUrl?: string;
  timeoutMs?: number;
  debug?: boolean;
  json?: boolean;
};

export async function dataCommand(
  args: string[],
  globalConfig: GlobalConfig,
): Promise<unknown> {
  const command = args[0];

  if (!command || command === "help") {
    throw new Error("SHOW_HELP:data");
  }

  const client = new DataClient({
    baseUrl: globalConfig.baseUrl,
    timeoutMs: globalConfig.timeoutMs,
    debug: globalConfig.debug,
  });

  switch (command) {
    case "health":
      return client.health.check();

    case "positions":
      return positionsCommand(client, args.slice(1));

    case "trades":
      return tradesCommand(client, args.slice(1));

    case "activity":
      return activityCommand(client, args.slice(1));

    case "values":
      return valuesCommand(client, args.slice(1));

    case "closed":
      return closedCommand(client, args.slice(1));

    case "traded":
      return tradedCommand(client, args.slice(1));

    case "builders":
      return buildersCommand(client, args.slice(1));

    case "volume":
      return volumeCommand(client, args.slice(1));

    case "holders":
      return holdersCommand(client, args.slice(1));

    case "open-interest":
      return openInterestCommand(client, args.slice(1));

    case "live-volume":
      return liveVolumeCommand(client, args.slice(1));

    default: {
      const suggestion = suggest(command, Object.keys(COMMANDS));
      let msg = `Unknown command: ${command}`;
      if (suggestion) {
        msg += `\n\nDid you mean: polys data ${suggestion}?`;
      }
      msg += "\n\nRun 'polys data --help' for available commands.";
      throw new Error(msg);
    }
  }
}

// Command implementations

async function positionsCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
      market: { type: "string", short: "m" },
      "event-id": { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      "sort-by": { type: "string" },
      "sort-direction": { type: "string" },
      title: { type: "string" },
    },
    strict: true,
  });

  if (!values.user) {
    throw new Error("--user is required");
  }

  return client.users.positions({
    user: values.user,
    market: values.market,
    eventId: values["event-id"],
    limit: values.limit ? Number.parseInt(values.limit, 10) : 100,
    offset: values.offset ? Number.parseInt(values.offset, 10) : 0,
    sortBy: values["sort-by"] as SortBy | undefined,
    sortDirection: values["sort-direction"] as SortDirection | undefined,
    title: values.title,
  });
}

async function tradesCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
      market: { type: "string", short: "m" },
      "event-id": { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      side: { type: "string" },
    },
    strict: true,
  });

  return client.users.listTrades({
    user: values.user,
    market: values.market,
    eventId: values["event-id"],
    limit: values.limit ? Number.parseInt(values.limit, 10) : 100,
    offset: values.offset ? Number.parseInt(values.offset, 10) : 0,
    side: values.side as TradeSide | undefined,
  });
}

async function activityCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
      market: { type: "string", short: "m" },
      "event-id": { type: "string" },
      type: { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      side: { type: "string" },
      "sort-by": { type: "string" },
      "sort-direction": { type: "string" },
    },
    strict: true,
  });

  if (!values.user) {
    throw new Error("--user is required");
  }

  return client.users.listActivity({
    user: values.user,
    market: values.market,
    eventId: values["event-id"],
    type: values.type,
    limit: values.limit ? Number.parseInt(values.limit, 10) : 100,
    offset: values.offset ? Number.parseInt(values.offset, 10) : 0,
    side: values.side as TradeSide | undefined,
    sortBy: values["sort-by"] as "TIMESTAMP" | "TOKENS" | "CASH" | undefined,
    sortDirection: values["sort-direction"] as SortDirection | undefined,
  });
}

async function valuesCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
      market: { type: "string", short: "m" },
    },
    strict: true,
  });

  if (!values.user) {
    throw new Error("--user is required");
  }

  return client.users.listPositionsValues({
    user: values.user,
    market: values.market,
  });
}

async function closedCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
      market: { type: "string", short: "m" },
      "event-id": { type: "string" },
      title: { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      "sort-by": { type: "string" },
      "sort-direction": { type: "string" },
    },
    strict: true,
  });

  if (!values.user) {
    throw new Error("--user is required");
  }

  return client.users.listClosedPositions({
    user: values.user,
    market: values.market,
    eventId: values["event-id"],
    title: values.title,
    limit: values.limit ? Number.parseInt(values.limit, 10) : 100,
    offset: values.offset ? Number.parseInt(values.offset, 10) : 0,
    sortBy: values["sort-by"] as
      | "REALIZEDPNL"
      | "TITLE"
      | "PRICE"
      | "AVGPRICE"
      | "TIMESTAMP"
      | undefined,
    sortDirection: values["sort-direction"] as SortDirection | undefined,
  });
}

async function tradedCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      user: { type: "string", short: "u" },
    },
    strict: true,
  });

  if (!values.user) {
    throw new Error("--user is required");
  }

  return client.users.getTradedMarkets(values.user);
}

async function buildersCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      period: { type: "string", short: "p" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  const period = (values.period || "day") as TimePeriod;
  return client.builders.leaderboard({
    timePeriod: period,
    limit: values.limit ? Number.parseInt(values.limit, 10) : 25,
    offset: values.offset ? Number.parseInt(values.offset, 10) : 0,
  });
}

async function volumeCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      period: { type: "string", short: "p" },
    },
    strict: true,
  });

  if (!values.period) {
    throw new Error("--period is required (day|week|month|all)");
  }

  return client.builders.volume(values.period as TimePeriod);
}

async function holdersCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      market: { type: "string", short: "m" },
      limit: { type: "string", short: "l" },
      "min-balance": { type: "string" },
    },
    strict: true,
  });

  if (!values.market) {
    throw new Error("--market is required");
  }

  return client.holders.listHolders({
    market: values.market,
    limit: values.limit ? Number.parseInt(values.limit, 10) : 100,
    minBalance: values["min-balance"]
      ? Number.parseInt(values["min-balance"], 10)
      : 0,
  });
}

async function openInterestCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      market: { type: "string", short: "m" },
    },
    strict: true,
  });

  return client.misc.getOpenInterest(values.market);
}

async function liveVolumeCommand(client: Data, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      "event-id": { type: "string", short: "e" },
    },
    strict: true,
  });

  if (!values["event-id"]) {
    throw new Error("--event-id is required");
  }

  const eventId = Number.parseInt(values["event-id"], 10);
  if (Number.isNaN(eventId)) {
    throw new Error("--event-id must be a number");
  }

  return client.misc.getEventLiveVolume(eventId);
}
