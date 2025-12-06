import { BaseHttpClient } from "@dicedhq/core";

const DEFAULT_BASE_URL = "https://gamma-api.polymarket.com";

/**
 * Configuration for the Gamma client
 */
export type GammaConfig = {
  /** Base URL for the Gamma API */
  baseUrl?: string;

  /** Request timeout in milliseconds */
  timeoutMs?: number;

  /** Maximum number of retries for failed requests */
  maxRetries?: number;

  /** Enable debug logging */
  debug?: boolean;
};

export class BaseClient extends BaseHttpClient {
  constructor({
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
    maxRetries,
    debug = false,
  }: GammaConfig = {}) {
    super({
      baseUrl,
      timeoutMs,
      maxRetries,
      debug,
      debugPrefix: "Gamma",
      retryMethods: ["get"],
    });
  }

  /**
   * Make an HTTP GET request to the Gamma API
   *
   * @param path - Request path
   * @param params - Query parameters
   * @returns Response data
   */
  public async request<T>({
    method,
    path,
    params,
  }: {
    method: "GET";
    path: `/${string}`;
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >;
  }): Promise<T> {
    const searchParams = this.buildSearchParams(params);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      Connection: "keep-alive",
      "User-Agent": "@dicedhq/polymarket",
    };

    return this.fetch<T>({
      method,
      path,
      headers,
      searchParams,
    });
  }
}
