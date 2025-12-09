import { ApiError, AuthenticationError, NetworkError } from "@dicedhq/core";
import ky, { HTTPError } from "ky";
import type { HeaderPayload } from "../signer/signer.js";

export type AttributorConfig = {
  url: string;
  token: string;
};

export type AttributorHeaders = {
  POLY_BUILDER_API_KEY: string;
  POLY_BUILDER_PASSPHRASE: string;
  POLY_BUILDER_SIGNATURE: string;
  POLY_BUILDER_TIMESTAMP: string;
};

export class Attributor {
  public readonly url: string;

  private readonly token: string;

  constructor(config: AttributorConfig) {
    this.url = config.url;
    this.token = config.token;
  }

  public async sign({
    method,
    path,
    body,
    timestamp,
  }: {
    method: string;
    path: string;
    body: string | undefined;
    timestamp: string | undefined;
  }): Promise<AttributorHeaders> {
    try {
      const response = await ky.post<HeaderPayload>(this.url, {
        json: { path, method, body, timestamp },
        headers: {
          authorization: `Bearer ${this.token}`,
          "content-type": "application/json",
        },
      });

      const json = await response.json();
      return {
        POLY_BUILDER_API_KEY: json.key,
        POLY_BUILDER_PASSPHRASE: json.passphrase,
        POLY_BUILDER_SIGNATURE: json.signature,
        POLY_BUILDER_TIMESTAMP: json.timestamp.toString(),
      };
    } catch (error) {
      if (error instanceof HTTPError) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          throw new AuthenticationError("Attributor authentication failed", {
            url: this.url,
            status,
          });
        }
        throw new ApiError(
          `Attributor request failed: ${error.message}`,
          status,
          { url: this.url },
        );
      }
      if (error instanceof TypeError) {
        throw new NetworkError("Attributor network request failed", {
          url: this.url,
          cause: error.message,
        });
      }
      throw error;
    }
  }
}
