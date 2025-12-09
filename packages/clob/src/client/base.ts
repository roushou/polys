import { BaseHttpClient } from "@dicedhq/core";
import { Attributor, type AttributorConfig } from "../attributor/attributor.js";
import { createL1Headers, createL2Headers } from "../core/headers.js";
import type { Credentials } from "../signer/signer.js";
import type { ConnectedWalletClient } from "../wallet/wallet.js";

const DEFAULT_BASE_URL = "https://clob.polymarket.com";

/**
 * Base client configuration
 */
export type BaseClientConfig = {
  /** Wallet to use for L1 authentication */
  wallet: ConnectedWalletClient;

  /** L2 API credentials (key, secret, passphrase) */
  credentials: Credentials;

  /** Attributor of orders */
  attributor?: AttributorConfig;

  /** Base URL for the CLOB API */
  baseUrl?: string;

  /** Request timeout in milliseconds */
  timeoutMs?: number;

  /** Maximum number of retries for failed requests */
  maxRetries?: number;

  /** Enable debug logging */
  debug?: boolean;
};

export class BaseClient extends BaseHttpClient {
  public readonly wallet: ConnectedWalletClient;
  public readonly credentials: Credentials;
  public readonly attributor?: Attributor;

  constructor({
    wallet,
    credentials,
    attributor,
    baseUrl = DEFAULT_BASE_URL,
    timeoutMs,
    maxRetries,
    debug = false,
  }: BaseClientConfig) {
    super({
      baseUrl,
      timeoutMs,
      maxRetries,
      debug,
      debugPrefix: "CLOB",
      retryMethods: ["get", "post", "delete"],
    });

    this.wallet = wallet;
    this.credentials = credentials;
    this.attributor = attributor ? new Attributor(attributor) : undefined;
  }

  /**
   * Make an authenticated or unauthenticated HTTP request
   *
   * @param method - HTTP method (GET, POST, DELETE)
   * @param path - Request path
   * @param options - Request options including auth type, body, and params
   * @returns Response data
   */
  public async request<T>({
    method,
    path,
    auth,
    options = {},
  }: {
    method: "GET" | "POST" | "DELETE";
    path: `/${string}`;
    auth:
      | { kind: "none" }
      | { kind: "l1"; nonce: number; timestamp?: number }
      | { kind: "l2"; headerArgs?: Record<string, unknown> }
      | { kind: "l2-with-attribution"; headerArgs?: Record<string, unknown> };
    options?: {
      body?: Record<string, unknown> | Record<string, unknown>[];
      params?: Record<string, string | number | boolean | undefined>;
    };
  }): Promise<T> {
    const { body, params } = options;
    const searchParams = this.buildSearchParams(params);

    // Prepare headers
    const headers: Record<string, string> = {
      Accept: "*/*",
      "Accept-Encoding": "gzip",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      "User-Agent": "@dicedhq/polymarket",
    };

    // Add authentication headers based on auth type
    await this.addAuthHeaders(headers, auth, method, path);

    return this.fetch<T>({
      method,
      path,
      headers,
      body,
      searchParams,
    });
  }

  /**
   * Add authentication headers based on the auth type
   */
  private async addAuthHeaders(
    headers: Record<string, string>,
    auth:
      | { kind: "none" }
      | { kind: "l1"; nonce: number; timestamp?: number }
      | { kind: "l2"; headerArgs?: Record<string, unknown> }
      | { kind: "l2-with-attribution"; headerArgs?: Record<string, unknown> },
    method: "GET" | "POST" | "DELETE",
    path: `/${string}`,
  ): Promise<void> {
    if (auth.kind === "none") {
      return;
    }

    if (auth.kind === "l1") {
      // L1 authentication (EIP-712 wallet signature)
      const l1Headers = await createL1Headers({
        signer: this.wallet,
        nonce: BigInt(auth.nonce),
        timestamp: auth.timestamp,
      });
      Object.assign(headers, l1Headers);
      return;
    }

    // L2 authentication (HMAC signature with API keys)
    const l2Headers = createL2Headers({
      address: this.wallet.account.address,
      credentials: this.credentials,
      headerArgs: {
        method,
        requestPath: path,
        body:
          auth.headerArgs !== undefined
            ? JSON.stringify(auth.headerArgs)
            : undefined,
      },
    });
    Object.assign(headers, l2Headers);

    // Add attribution headers if configured
    if (auth.kind === "l2-with-attribution" && this.attributor) {
      if (this.debug) {
        console.log(`[CLOB] Sending to attributor ${this.attributor.url}`);
      }

      const attributorHeaders = await this.attributor.sign({
        method,
        path,
        body:
          auth.headerArgs !== undefined
            ? JSON.stringify(auth.headerArgs)
            : undefined,
        timestamp: undefined,
      });
      Object.assign(headers, attributorHeaders);
    }
  }
}
