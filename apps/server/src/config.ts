import * as v from "valibot";

const ConfigSchema = v.object({
  polymarket: v.object({
    apiKey: v.pipe(
      v.string(),
      v.nonEmpty("POLYS_POLYMARKET_API_KEY is required"),
    ),
    secret: v.pipe(
      v.string(),
      v.nonEmpty("POLYS_POLYMARKET_SECRET is required"),
    ),
    passphrase: v.pipe(
      v.string(),
      v.nonEmpty("POLYS_POLYMARKET_PASSPHRASE is required"),
    ),
  }),
  server: v.object({
    hostname: v.pipe(v.string(), v.nonEmpty(), v.ip("Invalid hostname format")),
    port: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(1, "Port must be at least 1"),
      v.maxValue(65535, "Port must be at most 65535"),
    ),
    apiTokens: v.pipe(
      v.array(v.pipe(v.string(), v.nonEmpty())),
      v.minLength(1, "At least one API token is required"),
    ),
  }),
});

const rawConfig = {
  polymarket: {
    apiKey: Bun.env.POLYS_POLYMARKET_API_KEY ?? "",
    secret: Bun.env.POLYS_POLYMARKET_SECRET ?? "",
    passphrase: Bun.env.POLYS_POLYMARKET_PASSPHRASE ?? "",
  },
  server: {
    hostname: Bun.env.POLYS_SERVER_HOSTNAME ?? "127.0.0.1",
    port: Number(Bun.env.POLYS_SERVER_PORT) || 8080,
    apiTokens: Bun.env.POLYS_API_TOKENS?.split(",").map((t) => t.trim()) ?? [],
  },
};

export const config = v.parse(ConfigSchema, rawConfig);
