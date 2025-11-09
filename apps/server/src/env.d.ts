declare module "bun" {
  interface Env {
    POLYS_SERVER_HOSTNAME: string | undefined;
    POLYS_SERVER_PORT: string | undefined;

    POLYS_POLYMARKET_API_KEY: string | undefined;
    POLYS_POLYMARKET_SECRET: string | undefined;
    POLYS_POLYMARKET_PASSPHRASE: string | undefined;
  }
}
