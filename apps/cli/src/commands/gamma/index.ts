import type { Gamma } from "@dicedhq/gamma";
import { Gamma as GammaClient } from "@dicedhq/gamma";
import { parseArgs } from "util";
import { suggest } from "../../utils/suggestion.js";

export const GAMMA_HELP = `Query Polymarket Gamma API

Usage: polys gamma <COMMAND>

Commands:
  event          Get event by ID
  event-slug     Get event by slug
  events         List events
  market         Get market by ID
  markets        List all markets
  markets-live   List current active markets
  markets-clob   List CLOB-tradable markets
  series         Get series by ID
  series-list    List series
  series-active  List active series
  series-cat     List series by category
  sports         List all sports metadata
  sport          Get sport by identifier
  tags           List tags
  tag            Get tag by ID or slug
  tags-related   Get related tags
  comments       List comments
  comments-event List comments for an event

Options:
  -h, --help     Print help
`;

const COMMANDS = {
  event: "Get event by ID",
  "event-slug": "Get event by slug",
  events: "List events",
  market: "Get market by ID",
  markets: "List all markets",
  "markets-live": "List current active markets",
  "markets-clob": "List CLOB-tradable markets",
  series: "Get series by ID",
  "series-list": "List series",
  "series-active": "List active series",
  "series-cat": "List series by category",
  sports: "List all sports metadata",
  sport: "Get sport by identifier",
  tags: "List tags",
  tag: "Get tag by ID or slug",
  "tags-related": "Get related tags",
  comments: "List comments",
  "comments-event": "List comments for an event",
} as const;

type GlobalConfig = {
  baseUrl?: string;
  timeout?: number;
  debug?: boolean;
  json?: boolean;
};

export async function gammaCommand(
  args: string[],
  globalConfig: GlobalConfig,
): Promise<unknown> {
  const command = args[0];

  if (!command || command === "help") {
    throw new Error("SHOW_HELP:gamma");
  }

  const client = new GammaClient({
    baseUrl: globalConfig.baseUrl,
    timeoutMs: globalConfig.timeout,
    debug: globalConfig.debug,
  });

  switch (command) {
    case "event":
      return eventCommand(client, args.slice(1));
    case "event-slug":
      return eventSlugCommand(client, args.slice(1));
    case "events":
      return eventsCommand(client, args.slice(1));

    case "market":
      return marketCommand(client, args.slice(1));
    case "markets":
      return marketsCommand(client, args.slice(1));
    case "markets-live":
      return marketsLiveCommand(client, args.slice(1));
    case "markets-clob":
      return marketsClobCommand(client, args.slice(1));

    case "series":
      return seriesCommand(client, args.slice(1));
    case "series-list":
      return seriesListCommand(client, args.slice(1));
    case "series-active":
      return seriesActiveCommand(client, args.slice(1));
    case "series-cat":
      return seriesCategoryCommand(client, args.slice(1));

    case "sports":
      return client.sport.list();
    case "sport":
      return sportCommand(client, args.slice(1));

    case "tags":
      return tagsCommand(client, args.slice(1));
    case "tag":
      return tagCommand(client, args.slice(1));
    case "tags-related":
      return tagsRelatedCommand(client, args.slice(1));

    case "comments":
      return commentsCommand(client, args.slice(1));
    case "comments-event":
      return commentsEventCommand(client, args.slice(1));

    default: {
      const suggestion = suggest(command, Object.keys(COMMANDS));
      let msg = `Unknown command: ${command}`;
      if (suggestion) {
        msg += `\n\nDid you mean: polys gamma ${suggestion}?`;
      }
      msg += "\n\nRun 'polys gamma --help' for available commands.";
      throw new Error(msg);
    }
  }
}

// Event commands

async function eventCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
    },
    strict: true,
  });

  if (!values.id) {
    throw new Error("--id is required");
  }

  return client.event.getById(values.id);
}

async function eventSlugCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      slug: { type: "string", short: "s" },
    },
    strict: true,
  });

  if (!values.slug) {
    throw new Error("--slug is required");
  }

  return client.event.getBySlug(values.slug);
}

async function eventsCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      active: { type: "boolean", default: true },
      closed: { type: "boolean", default: false },
      "tag-id": { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      ascending: { type: "boolean" },
    },
    strict: true,
  });

  return client.event.list({
    active: values.active,
    closed: values.closed,
    tag_id: values["tag-id"],
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
    ascending: values.ascending,
  });
}

// Market commands

async function marketCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
    },
    strict: true,
  });

  if (!values.id) {
    throw new Error("--id is required");
  }

  return client.market.get(values.id);
}

async function marketsCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      active: { type: "boolean", default: true },
      closed: { type: "boolean", default: false },
      archived: { type: "boolean", default: false },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  return client.market.listAll({
    active: values.active,
    closed: values.closed,
    archived: values.archived,
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}

async function marketsLiveCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  return client.market.listCurrent({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}

async function marketsClobCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  return client.market.listClobTradable({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}

// Series commands

async function seriesCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
      "include-chat": { type: "boolean", default: false },
    },
    strict: true,
  });

  if (!values.id) {
    throw new Error("--id is required");
  }

  return client.series.get({
    id: values.id,
    includeChat: values["include-chat"],
  });
}

async function seriesListCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      closed: { type: "boolean" },
      "include-chat": { type: "boolean" },
      ascending: { type: "boolean" },
    },
    strict: true,
  });

  return client.series.list({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
    closed: values.closed,
    includeChat: values["include-chat"],
    ascending: values.ascending,
  });
}

async function seriesActiveCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  return client.series.listActive({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}

async function seriesCategoryCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      label: { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  if (!values.label) {
    throw new Error("--label is required");
  }

  return client.series.listByCategory(values.label, {
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}

// Sport commands

async function sportCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      sport: { type: "string", short: "s" },
    },
    strict: true,
  });

  if (!values.sport) {
    throw new Error("--sport is required");
  }

  return client.sport.listBySport(values.sport);
}

// Tag commands

async function tagsCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      "include-template": { type: "boolean" },
      ascending: { type: "boolean" },
    },
    strict: true,
  });

  return client.tags.list({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
    includeTemplate: values["include-template"],
    ascending: values.ascending,
  });
}

async function tagCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
      slug: { type: "string", short: "s" },
      "include-template": { type: "boolean", default: false },
    },
    strict: true,
  });

  if (values.id) {
    return client.tags.getById({
      id: values.id,
      includeTemplate: values["include-template"],
    });
  }
  if (values.slug) {
    return client.tags.getBySlug({
      slug: values.slug,
      includeTemplate: values["include-template"],
    });
  }
  throw new Error("Either --id or --slug is required");
}

async function tagsRelatedCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
      slug: { type: "string", short: "s" },
      status: { type: "string", default: "all" },
      "omit-empty": { type: "boolean", default: true },
    },
    strict: true,
  });

  const status = values.status as "active" | "closed" | "all";

  if (values.id) {
    return client.tags.listRelatedTagsById({
      id: values.id,
      omitEmpty: values["omit-empty"],
      status,
    });
  }
  if (values.slug) {
    return client.tags.listRelatedTagsBySlug({
      slug: values.slug,
      omitEmpty: values["omit-empty"],
      status,
    });
  }
  throw new Error("Either --id or --slug is required");
}

// Comment commands

async function commentsCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
      "entity-type": { type: "string" },
      "entity-id": { type: "string" },
      ascending: { type: "boolean" },
    },
    strict: true,
  });

  return client.comments.list({
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
    parentEntityType: values["entity-type"] as
      | "Event"
      | "Series"
      | "market"
      | undefined,
    parentEntityId: values["entity-id"]
      ? Number.parseInt(values["entity-id"], 10)
      : undefined,
    ascending: values.ascending,
  });
}

async function commentsEventCommand(client: Gamma, args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      id: { type: "string" },
      limit: { type: "string", short: "l" },
      offset: { type: "string" },
    },
    strict: true,
  });

  if (!values.id) {
    throw new Error("--id is required");
  }

  return client.comments.listByEvent(Number.parseInt(values.id, 10), {
    limit: values.limit ? Number.parseInt(values.limit, 10) : undefined,
    offset: values.offset ? Number.parseInt(values.offset, 10) : undefined,
  });
}
