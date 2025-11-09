import { type Credentials, Signer } from "@polys/signer";
import ky, { type HTTPError, type KyInstance, type Options } from "ky";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
  ValidationError,
} from "./errors.ts";

const DEFAULT_BASE_URL = "https://clob.polymarket.com";
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_MAX_RETRIES = 3;

export type ClientConfig = {
  baseUrl?: string;
  credentials?: Credentials;
  timeoutMs?: number;
  maxRetries?: number;
  debug?: boolean;
};

/**
 * Base client for making HTTP requests to the CLOB API
 */
export class BaseClient {
  protected readonly signer?: Signer;
  protected readonly debug: boolean;
  private readonly api: KyInstance;

  constructor(config: ClientConfig = {}) {
    this.debug = config.debug ?? false;

    if (config.credentials) {
      this.signer = new Signer(config.credentials);
    }

    this.api = ky.create({
      prefixUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      timeout: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      retry: {
        limit: config.maxRetries ?? DEFAULT_MAX_RETRIES,
        methods: ["get", "post", "delete"],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
        backoffLimit: 10000,
      },
      hooks: {
        beforeRequest: [
          (request) => {
            if (this.debug) {
              console.log(`[OrderBookClient] ${request.method} ${request.url}`);
            }
          },
        ],
        beforeRetry: [
          async ({ request, retryCount }) => {
            if (this.debug) {
              console.log(
                `[OrderBookClient] Retry attempt ${retryCount} for ${request.url}`,
              );
            }
          },
        ],
        afterResponse: [
          (request, _options, response) => {
            if (this.debug) {
              console.log(
                `[OrderBookClient] Response ${response.status} from ${request.url}`,
              );
            }
            return response;
          },
        ],
      },
    });
  }

  /**
   * Make an authenticated or unauthenticated HTTP request
   */
  public async request<T>(
    method: "GET" | "POST" | "DELETE",
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, string | number | boolean | undefined>;
      requiresAuth?: boolean;
    } = {},
  ): Promise<T> {
    const { body, params, requiresAuth = false } = options;

    if (requiresAuth && !this.signer) {
      throw new AuthenticationError(
        "Authentication required but no credentials provided",
      );
    }

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authentication headers if required
    if (requiresAuth && this.signer) {
      // Build search params for signature
      const searchParams = new URLSearchParams();
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        }
      }
      const search = searchParams.toString();
      const fullPath = search ? `${path}?${search}` : path;

      const bodyString = body ? JSON.stringify(body) : undefined;
      const payload = this.signer.createHeaderPayload({
        method,
        path: fullPath,
        body: bodyString,
        timestamp: undefined,
      });

      headers["POLY-ADDRESS"] = payload.key;
      headers["POLY-SIGNATURE"] = payload.signature;
      headers["POLY-TIMESTAMP"] = String(payload.timestamp);
      headers["POLY-PASSPHRASE"] = payload.passphrase;
    }

    // Prepare Ky options
    const kyOptions: Options = {
      method: method.toLowerCase() as Lowercase<typeof method>,
      headers,
    };

    if (body !== undefined) {
      kyOptions.json = body;
    }

    if (params) {
      kyOptions.searchParams = params as Record<
        string,
        string | number | boolean
      >;
    }

    try {
      const response = await this.api(path, kyOptions);
      const data = await response.json<T>();

      if (this.debug) {
        console.log("[OrderBookClient] Response data:", data);
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
          case 401:
          case 403:
            throw new AuthenticationError(
              "Authentication failed",
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
        error instanceof AuthenticationError ||
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
