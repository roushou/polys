declare module "bun" {
  interface Env {
    DICED_SERVER_HOSTNAME: string | undefined;
    DICED_SERVER_PORT: string | undefined;

    DICED_POLYMARKET_API_KEY: string | undefined;
    DICED_POLYMARKET_SECRET: string | undefined;
    DICED_POLYMARKET_PASSPHRASE: string | undefined;
  }
}
