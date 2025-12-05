import ky, { type HTTPError, type KyInstance } from "ky";
import {
  ApiError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from "../errors.js";

const DEFAULT_BASE_URL = "https://data-api.polymarket.com";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 3;

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

export class BaseClient {
  protected readonly debug: boolean;

  private readonly api: KyInstance;

  constructor({
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    debug = false,
  }: DataConfig = {}) {
    this.debug = debug;
    this.api = ky.create({
      prefixUrl: baseUrl,
      timeout: timeoutMs,
      retry: {
        limit: maxRetries,
        methods: ["get"],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
        backoffLimit: 10000,
      },
      hooks: {
        beforeRequest: [
          (request) => {
            if (this.debug) {
              console.log(`[Data] ${request.method} ${request.url}`);
            }
          },
        ],
        beforeRetry: [
          async ({ request, retryCount }) => {
            if (this.debug) {
              console.log(
                `[Data] Retry attempt ${retryCount} for ${request.url}`,
              );
            }
          },
        ],
        afterResponse: [
          (request, _options, response) => {
            if (this.debug) {
              console.log(
                `[Data] Response ${response.status} from ${request.url}`,
              );
            }
            return response;
          },
        ],
      },
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
    // Build query params
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          // Handle array values by adding multiple entries with the same key
          if (Array.isArray(value)) {
            for (const item of value) {
              searchParams.append(key, String(item));
            }
          } else {
            searchParams.append(key, String(value));
          }
        }
      }
    }

    // Prepare headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      Connection: "keep-alive",
      "User-Agent": "@dicedhq/polymarket",
    };

    try {
      // Remove leading slash because Ky doesn't like it when using prefixUrl
      const normalizedPath = path.startsWith("/")
        ? path.replace(/^\//, "")
        : path;
      const response = await this.api(normalizedPath, {
        method,
        headers,
        searchParams,
      });
      const data = await response.json<T>();

      if (this.debug) {
        console.log("[Data] Response data:", data);
      }

      return data;
    } catch (error) {
      // Handle HTTPError
      if (error && typeof error === "object" && "response" in error) {
        const httpError = error as HTTPError;
        const response = httpError.response;
        const statusCode = response.status;

        // Try to parse error details
        let errorDetails: unknown;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = {
            statusText: response.statusText,
            status: response.status,
          };
        }

        // Map HTTP status codes to custom errors
        switch (statusCode) {
          case 400:
            throw new ValidationError(
              "Invalid request parameters",
              errorDetails,
            );
          case 404:
            throw new ApiError("Resource not found", 404, errorDetails);
          case 429:
            throw new RateLimitError("Rate limit exceeded", errorDetails);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ApiError("Server error", statusCode, errorDetails);
          default:
            throw new ApiError(`HTTP ${statusCode}`, statusCode, errorDetails);
        }
      }

      // Handle timeout errors
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new TimeoutError(
          `Request timed out after ${DEFAULT_TIMEOUT_MS}ms`,
        );
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new NetworkError("Network request failed", error);
      }

      // If it's already one of our custom errors, rethrow
      if (
        error instanceof ApiError ||
        error instanceof ValidationError ||
        error instanceof RateLimitError ||
        error instanceof TimeoutError ||
        error instanceof NetworkError
      ) {
        throw error;
      }

      // Unknown error
      throw new ApiError(
        "Request failed",
        undefined,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
