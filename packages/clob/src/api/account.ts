import { NonEmptyString, validate } from "@dicedhq/core/validation";
import type { BaseClient } from "../client/base.js";

export class AccountApi {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get balance and allowance for a token
   */
  async getBalanceAllowance(
    tokenId: string,
    address: string,
  ): Promise<BalanceAllowanceResponse> {
    validate(NonEmptyString, tokenId, "tokenId");
    validate(NonEmptyString, address, "address");

    return this.client.request<BalanceAllowanceResponse>({
      method: "GET",
      path: "/balance-allowance",
      auth: { kind: "l2" },
      options: {
        params: { token_id: tokenId, address },
      },
    });
  }
}

export type BalanceAllowanceResponse = {
  balance: string;
  allowance: string;
};
