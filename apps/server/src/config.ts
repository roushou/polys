import * as v from "valibot";

const ConfigSchema = v.object({
  polymarket: v.object({
    apiKey: v.pipe(
      v.string(),
      v.nonEmpty("DICED_POLYMARKET_API_KEY is required"),
    ),
    secret: v.pipe(
      v.string(),
      v.nonEmpty("DICED_POLYMARKET_SECRET is required"),
    ),
    passphrase: v.pipe(
      v.string(),
      v.nonEmpty("DICED_POLYMARKET_PASSPHRASE is required"),
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
  }),
});

const rawConfig = {
  polymarket: {
    apiKey: Bun.env.DICED_POLYMARKET_API_KEY ?? "",
    secret: Bun.env.DICED_POLYMARKET_SECRET ?? "",
    passphrase: Bun.env.DICED_POLYMARKET_PASSPHRASE ?? "",
  },
  server: {
    hostname: Bun.env.DICED_SERVER_HOSTNAME ?? "127.0.0.1",
    port: Number(Bun.env.DICED_SERVER_PORT) || 8080,
  },
};

export const config = v.parse(ConfigSchema, rawConfig);
