import ky, { type HTTPError, type KyInstance } from "ky";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from "../errors.js";

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 3;

/**
 * Configuration for the base HTTP client
 */
export type BaseHttpClientConfig = {
  /** Base URL for the API */
  baseUrl: string;

  /** Request timeout in milliseconds */
  timeoutMs?: number;

  /** Maximum number of retries for failed requests */
  maxRetries?: number;

  /** Enable debug logging */
  debug?: boolean;

  /** Prefix for debug log messages */
  debugPrefix?: string;

  /** HTTP methods to allow for retries */
  retryMethods?: Array<"get" | "post" | "delete">;
};

/**
 * Base HTTP client with common functionality for all Polymarket API clients.
 * Provides retry logic, error handling, and debug logging.
 */
export class BaseHttpClient {
  protected readonly debug: boolean;
  protected readonly debugPrefix: string;
  protected readonly timeoutMs: number;
  protected readonly api: KyInstance;

  constructor({
    baseUrl,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    debug = false,
    debugPrefix = "API",
    retryMethods = ["get"],
  }: BaseHttpClientConfig) {
    this.debug = debug;
    this.debugPrefix = debugPrefix;
    this.timeoutMs = timeoutMs;

    this.api = ky.create({
      prefixUrl: baseUrl,
      timeout: timeoutMs,
      retry: {
        limit: maxRetries,
        methods: retryMethods,
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
        backoffLimit: 10000,
      },
      hooks: {
        beforeRequest: [
          (request) => {
            if (this.debug) {
              console.log(
                `[${this.debugPrefix}] ${request.method} ${request.url}`,
              );
            }
          },
        ],
        beforeRetry: [
          async ({ request, retryCount }) => {
            if (this.debug) {
              console.log(
                `[${this.debugPrefix}] Retry attempt ${retryCount} for ${request.url}`,
              );
            }
          },
        ],
        afterResponse: [
          (request, _options, response) => {
            if (this.debug) {
              console.log(
                `[${this.debugPrefix}] Response ${response.status} from ${request.url}`,
              );
            }
            return response;
          },
        ],
      },
    });
  }

  /**
   * Make an HTTP request and handle errors consistently
   *
   * @param options - Request options
   * @returns Response data
   */
  protected async fetch<T>({
    method,
    path,
    headers = {},
    body,
    searchParams,
  }: {
    method: "GET" | "POST" | "DELETE";
    path: string;
    headers?: Record<string, string>;
    body?: unknown;
    searchParams?: URLSearchParams;
  }): Promise<T> {
    try {
      // Remove leading slash because Ky doesn't like it when using prefixUrl
      const normalizedPath = path.startsWith("/")
        ? path.replace(/^\//, "")
        : path;

      const response = await this.api(normalizedPath, {
        method,
        headers,
        json: body,
        searchParams,
      });

      const data = await response.json<T>();

      if (this.debug) {
        console.log(`[${this.debugPrefix}] Response data:`, data);
      }

      return data;
    } catch (error) {
      throw await this.handleError(error);
    }
  }

  /**
   * Build URLSearchParams from a params object, handling arrays and undefined values
   */
  protected buildSearchParams(
    params?: Record<
      string,
      string | number | boolean | string[] | number[] | undefined
    >,
  ): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
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

    return searchParams;
  }

  /**
   * Handle and transform errors into typed error classes
   */
  private async handleError(error: unknown): Promise<Error> {
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
          return new ValidationError(
            "Invalid request parameters",
            errorDetails,
          );
        case 401:
        case 403:
          return new AuthenticationError("Authentication failed", errorDetails);
        case 404:
          return new ApiError("Resource not found", 404, errorDetails);
        case 429:
          return new RateLimitError("Rate limit exceeded", errorDetails);
        case 500:
        case 502:
        case 503:
        case 504:
          return new ApiError("Server error", statusCode, errorDetails);
        default:
          return new ApiError(`HTTP ${statusCode}`, statusCode, errorDetails);
      }
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === "TimeoutError") {
      return new TimeoutError(`Request timed out after ${this.timeoutMs}ms`);
    }

    // Handle network errors
    if (error instanceof TypeError) {
      return new NetworkError("Network request failed", error);
    }

    // If it's already one of our custom errors, return as-is
    if (
      error instanceof ApiError ||
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof RateLimitError ||
      error instanceof TimeoutError ||
      error instanceof NetworkError
    ) {
      return error;
    }

    // Unknown error
    return new ApiError(
      "Request failed",
      undefined,
      error instanceof Error ? error.message : error,
    );
  }
}
