import ky from "ky";
import type { HeaderPayload } from "../signer/signer.js";

export type AttributorConfig = {
  url: string;
  token: string;
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
  }) {
    const response = await ky.post<HeaderPayload>(this.url, {
      json: { path, method, body, timestamp },
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
    });

    // TODO: better handle errors
    if (!response.ok) {
      throw new Error("Server error");
    }

    const json = await response.json();
    return {
      POLY_BUILDER_API_KEY: json.key,
      POLY_BUILDER_PASSPHRASE: json.passphrase,
      POLY_BUILDER_SIGNATURE: json.signature,
      POLY_BUILDER_TIMESTAMP: json.timestamp.toString(),
    };
  }
}
