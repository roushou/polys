import { BaseHttpClient } from "@dicedhq/core";

const DEFAULT_BASE_URL = "https://data-api.polymarket.com";

/**
 * Configuration for the Data client
 */
export type DataConfig = {
  /** Base URL for the Data API */
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
  }: DataConfig = {}) {
    super({
      baseUrl,
      timeoutMs,
      maxRetries,
      debug,
      debugPrefix: "Data",
      retryMethods: ["get"],
    });
  }

  /**
   * Make an HTTP GET request to the Data API
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
