type Config = {
  polymarket: {
    apiKey: string;
    secret: string;
    passphrase: string;
  };
  server: {
    hostname: string;
    port: number;
  };
};

const DEFAULT_CONFIG = {
  polymarket: {
    apiKey: "",
    secret: "",
    passphrase: "",
  },
  server: {
    hostname: "127.0.0.1",
    port: 8080,
  },
} satisfies Config;

function loadConfig(): Config {
  const apiKey = Bun.env.POLYS_POLYMARKET_API_KEY;
  const secret = Bun.env.POLYS_POLYMARKET_SECRET;
  const passphrase = Bun.env.POLYS_POLYMARKET_PASSPHRASE;

  if (!apiKey)
    throw new Error(
      "Missing required environment variable: POLYS_POLYMARKET_API_KEY",
    );
  if (!secret)
    throw new Error(
      "Missing required environment variable: POLYS_POLYMARKET_SECRET",
    );
  if (!passphrase)
    throw new Error(
      "Missing required environment variable: POLYS_POLYMARKET_PASSPHRASE",
    );

  const hostname =
    Bun.env.POLYS_SERVER_HOSTNAME ?? DEFAULT_CONFIG.server.hostname;

  // Validate port
  let port = Number(Bun.env.POLYS_SERVER_PORT);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    console.warn(
      `Invalid POLYS_SERVER_PORT: ${port ?? "undefined"}. Must be a number between 1 and 65535. Replacing with ${DEFAULT_CONFIG.server.port}`,
    );
    port = DEFAULT_CONFIG.server.port;
  }

  return {
    polymarket: {
      apiKey,
      secret,
      passphrase,
    },
    server: {
      hostname,
      port,
    },
  };
}

export const config = loadConfig();
